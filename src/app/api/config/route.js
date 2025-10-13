import { NextResponse } from "next/server";
import { cacheHelpers } from "@/utils/smartCache";
import { RacingError, RacingErrorTypes, handleApiError } from "@/utils/apiErrorHandler";

export async function GET() {
  try {
    const siteSlug = process.env.SITE_SLUG;

    if (!siteSlug) {
      const error = new RacingError(
        RacingErrorTypes.VALIDATION_ERROR,
        new Error("SITE_SLUG environment variable is not defined"),
        { endpoint: '/api/config' }
      );
      return NextResponse.json(
        { error: error.message, type: error.type },
        { status: 400 }
      );
    }

  // Use smart caching for site configuration
  try {
    const result = await cacheHelpers.getSiteConfig(siteSlug, async () => {
      const queryUrl =
        `${process.env.STRAPI_URL}/api/sites?filters[slug][$eq]=${siteSlug}` +
        `&populate[footer]=*` +
        `&populate[socials]=*` +
        `&populate[sponsors]=*` +
        `&populate[eventDocuments]=*` +
        `&populate[menu]=*` +
        `&populate[websites]=*` +
        `&populate[hero]=*` +
        `&populate[heroButton]=*`;

      const strapiResponse = await fetch(queryUrl, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        // Remove no-store to allow caching
        next: { revalidate: 1800 } // 30 minutes ISR
      });

      if (!strapiResponse.ok) {
        console.error(`Strapi API failed with status: ${strapiResponse.status}`);
        throw new Error(`Strapi API failed with status: ${strapiResponse.status}`);
      }

      const strapiData = await strapiResponse.json();

      if (!strapiData.data || strapiData.data.length === 0) {
        throw new Error(`No site found with slug: ${siteSlug}`);
      }

      return transformStrapiData(strapiData.data[0]);
    });

    // Add cache metadata to response headers
    const response = NextResponse.json(result.data);
    response.headers.set('X-Cache-Status', result.fromCache ? 'HIT' : 'MISS');
    response.headers.set('X-Cache-Age', result.age?.toString() || '0');
    
    if (result.stale) {
      response.headers.set('X-Cache-Stale', 'true');
    }

    console.log(`🏁 Config API: ${result.fromCache ? 'CACHE HIT' : 'CACHE MISS'} for ${siteSlug}`);
    return response;

  } catch (error) {
    const racingError = handleApiError(error, { 
      endpoint: '/api/config',
      siteSlug,
      operation: 'getSiteConfig'
    });
    
    console.warn("🚨 Strapi failed, falling back to local JSON config:", racingError.message);
    
    // Fallback to local configuration
    try {
      const configModule = await import("@/config/site-config.json");
      const response = NextResponse.json(configModule.default);
      response.headers.set('X-Cache-Status', 'FALLBACK');
      response.headers.set('X-Error-Recovered', 'true');
      response.headers.set('X-Original-Error', racingError.type);
      return response;
    } catch (fallbackError) {
      const finalError = handleApiError(fallbackError, {
        endpoint: '/api/config',
        siteSlug,
        operation: 'fallbackConfig',
        originalError: racingError
      });
      
      console.error("❌ Local config fallback failed:", finalError);
      return NextResponse.json(
        { 
          error: finalError.message,
          type: finalError.type,
          suggestion: finalError.suggestion,
          errorId: finalError.errorId
        }, 
        { status: 500 }
      );
    }
  }
  } catch (globalError) {
    const racingError = handleApiError(globalError, {
      endpoint: '/api/config',
      operation: 'global'
    });
    
    return NextResponse.json(
      {
        error: racingError.message,
        type: racingError.type,
        suggestion: racingError.suggestion,
        errorId: racingError.errorId
      },
      { status: 500 }
    );
  }
}

// Transform Strapi data structure to match your existing JSON structure
function transformStrapiData(data) {
  console.log("Transforming Strapi data:", data);

  // The data is already in the format we need, no need to access 'attributes'
  const strapiUrl = process.env.STRAPI_URL || "";

  return {
    siteTitle: data.siteTitle,
    primaryColor: data.primaryColor,
    menuBackground: data.menuBackground,
    textColor: data.textColor,
    logoImage: data.logoImage,
      menu: [
        { id: 1, label: 'Home', url: '/' },
        { id: 2, label: 'Events', url: '/events' },
        { id: 3, label: 'Event Info', url: '/event-info' },
        { id: 4, label: 'News', url: '/#news' },
        { id: 5, label: 'Documents', url: '/#documents' }
      ],
    actions: data.actions || [],
    currentEventId: data.eventId || data.currentEventId || null,
    hero: {
      background: data.hero?.[0]?.background?.data?.attributes?.url
        ? `${strapiUrl}${data.hero[0].background.data.attributes.url}`
        : data.hero?.[0]?.background,
      eventDate: data.hero?.[0]?.eventDate,
      eventInfo: data.hero?.[0]?.eventInfo,
      eventName: data.hero?.[0]?.eventName,
      eventLocation: data.hero?.[0]?.eventLocation,
      buttons: data.heroButton || data.hero?.[0]?.button || [],
    },

    eventDocuments: data.eventDocuments || [],
    websites: (data.websites || []).map((site) => {
      console.log('Processing website:', site);
      const mediaFromObject = site.logo?.data?.attributes?.url
        ? `${strapiUrl}${site.logo.data.attributes.url}`
        : null;
      const raw = mediaFromObject || site.logo || null;
      const normalizedLogo = typeof raw === "string"
        ? (raw.startsWith("http") ? raw : `${strapiUrl}${raw}`)
        : raw;
      const processed = { ...site, logo: normalizedLogo };
      console.log('Processed website:', processed);
      return processed;
    }),
    newsItems: (data.newsItems || []).map((item) => {
      const mediaFromObject = item.image?.data?.attributes?.url
        ? `${strapiUrl}${item.image.data.attributes.url}`
        : null;
      const raw = mediaFromObject || item.image || null;
      const normalizedImage = typeof raw === "string"
        ? (raw.startsWith("http") ? raw : `${strapiUrl}${raw}`)
        : raw;
      return { ...item, image: normalizedImage };
    }),
    sponsors: (data.sponsors || []).map((sponsor) => {
      const mediaFromObject = sponsor.logo?.data?.attributes?.url
        ? `${strapiUrl}${sponsor.logo.data.attributes.url}`
        : null;
      const raw = mediaFromObject || sponsor.logo || null;
      const normalizedLogo = typeof raw === "string"
        ? (raw.startsWith("http") ? raw : `${strapiUrl}${raw}`)
        : raw;
      return { ...sponsor, logo: normalizedLogo };
    }),
    // footer: data.footer ||[],
    footer: {
      backgroundColor: data.footer?.[0]?.backgroundColor || "#000000",
      textColor: data.footer?.[0]?.textColor || "#FFFFFF",
    },
    socials: data.socials || [],
  };
}
