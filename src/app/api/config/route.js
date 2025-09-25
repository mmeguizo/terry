import { NextResponse } from "next/server";

export async function GET() {
  try {
    const siteSlug = process.env.SITE_SLUG;

    if (!siteSlug) {
      throw new Error("SITE_SLUG environment variable is not defined");
    }

    const queryUrl =
      `${process.env.STRAPI_URL}/api/sites?filters[slug][$eq]=${siteSlug}` +
      `&populate[footer]=*` +
      `&populate[socials]=*` +
      `&populate[sponsors]=*` +
      `&populate[eventDocuments]=*` +
      `&populate[menu]=*` +
      `&populate[websites]=*` +
      `&populate[hero]=*`;

    // Fetch site configuration from Strapi based on slug
    const strapiResponse = await fetch(
      // `${process.env.STRAPI_URL}/api/sites?filters[slug][$eq]=${siteSlug}&populate=*`,
      queryUrl,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: "no-store", // Disable caching for dynamic content
      }
    );

    if (!strapiResponse.ok) {
      console.error(`Strapi API failed with status: ${strapiResponse.status}`);
      console.error(`Request URL: ${queryUrl}`);
      console.error(`Response: ${await strapiResponse.text()}`);
      throw new Error(
        `Strapi API failed with status: ${strapiResponse.status}`
      );
    }

    const strapiData = await strapiResponse.json();

    // Check if we got a site with the requested slug
    if (!strapiData.data || strapiData.data.length === 0) {
      console.warn(`No site found with slug: ${siteSlug}. Available sites should be checked in Strapi CMS.`);
      console.warn(`Falling back to local configuration...`);
      throw new Error(`No site found with slug: ${siteSlug}`);
    }

    // Transform Strapi data to match your existing structure
    const transformedConfig = transformStrapiData(strapiData.data[0]);
    return NextResponse.json(transformedConfig);
  } catch (error) {
    console.warn("Falling back to local JSON config:", error);
    const configModule = await import("@/config/site-config.json");
    return NextResponse.json(configModule.default);
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
    menu: data.menu || [],
    actions: data.actions || [],
    currentEventId: data.currentEventId || null,
    hero: {
      background: data.hero?.[0]?.background?.data?.attributes?.url
        ? `${strapiUrl}${data.hero[0].background.data.attributes.url}`
        : data.hero?.[0]?.background,
      eventDate: data.hero?.[0]?.eventDate,
      eventInfo: data.hero?.[0]?.eventInfo,
      eventName: data.hero?.[0]?.eventName,
      eventLocation: data.hero?.[0]?.eventLocation,
      buttons: data.hero?.[0]?.button || [],
    },

    eventDocuments: data.eventDocuments || [],
    websites: (data.websites || []).map((site) => ({
      ...site,
      logo: site.logo?.data?.attributes?.url
        ? `${strapiUrl}${site.logo.data.attributes.url}`
        : site.logo,
    })),
    newsItems: (data.newsItems || []).map((item) => ({
      ...item,
      image: item.image?.data?.attributes?.url
        ? `${strapiUrl}${item.image.data.attributes.url}`
        : item.image,
    })),
    sponsors: (data.sponsors || []).map((sponsor) => ({
      ...sponsor,
      logo: sponsor.logo?.data?.attributes?.url
        ? `${strapiUrl}${sponsor.logo.data.attributes.url}`
        : sponsor.logo,
    })),
    // footer: data.footer ||[],
    footer: {
      backgroundColor: data.footer?.[0]?.backgroundColor || "#000000",
      textColor: data.footer?.[0]?.textColor || "#FFFFFF",
    },
    socials: data.socials || [],
  };
}
