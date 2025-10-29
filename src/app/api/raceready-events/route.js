import { NextResponse } from "next/server";

// Disable ALL caching completely
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = 'force-no-store';

/**
 * RaceReady Events API Proxy
 * 
 * Fetches event data from RaceReady API using GUID authentication
 * 
 * Query Parameters:
 * - view: 'next' | 'events' | 'event'
 * - event: event slug or ID (required when view='event')
 * 
 * Examples:
 * - /api/raceready-events?view=next - Get next upcoming event
 * - /api/raceready-events?view=events - Get all events
 * - /api/raceready-events?view=event&event=2025-round-1 - Get specific event
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'next';
    const eventSlug = searchParams.get('event');

    // Validate view parameter
    const validViews = ['next', 'events', 'event'];
    if (!validViews.includes(view)) {
      return NextResponse.json(
        { error: `Invalid view parameter. Must be one of: ${validViews.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate event parameter for 'event' view
    if (view === 'event' && !eventSlug) {
      return NextResponse.json(
        { error: 'Event slug or ID is required when view=event' },
        { status: 400 }
      );
    }

    // Get site configuration to retrieve GUID
    const isDev = process.env.NODE_ENV !== "production";
    const local = `http://localhost:${process.env.PORT || 3000}`;
    const baseUrl = isDev ? local : (process.env.NEXT_PUBLIC_BASE_URL || process.env.SITE_DOMAIN || local);

    let guid = null;
    
    try {
      const configRes = await fetch(`${baseUrl}/api/config`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (configRes.ok) {
        const config = await configRes.json();
        guid = config.raceReadyGUID;
      }
    } catch (configError) {
      console.warn('Failed to fetch config for GUID:', configError.message);
    }

    // Fallback to environment variable if not in config
    if (!guid) {
      guid = process.env.RACEREADY_GUID;
    }

    // TEMPORARY: Hardcoded GUID for testing
    if (!guid) {
      guid = '84368220-881D-42A8-8B08-A38A4FE11A96'; // Motor Racing Australia
      console.log('🧪 Using hardcoded GUID for testing');
    }

    if (!guid) {
      console.warn('⚠️ No GUID configured, returning empty data for graceful fallback');
      // Return empty/null data instead of error to allow frontend fallback
      return NextResponse.json(null, { status: 200 });
    }

    // Build RaceReady API URL with cache buster
    let raceReadyUrl = `https://raceready.com.au/api/events/?GUID=${guid}&view=${view}`;
    if (view === 'event' && eventSlug) {
      raceReadyUrl += `&event=${encodeURIComponent(eventSlug)}`;
    }
    // Add timestamp to prevent caching
    raceReadyUrl += `&_t=${Date.now()}`;

    console.log('🏁 Fetching RaceReady events:', { view, eventSlug, guid: `${guid.substring(0, 8)}...` });

    // Fetch from RaceReady API with aggressive no-cache headers
    const raceReadyRes = await fetch(raceReadyUrl, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!raceReadyRes.ok) {
      console.error('RaceReady API error:', raceReadyRes.status, raceReadyRes.statusText);
      return NextResponse.json(
        { 
          error: 'Failed to fetch from RaceReady API',
          status: raceReadyRes.status,
          statusText: raceReadyRes.statusText
        },
        { status: raceReadyRes.status }
      );
    }

    const data = await raceReadyRes.json();

    // Transform and normalize the response
    const normalizedData = normalizeRaceReadyData(data, view);

    return NextResponse.json(normalizedData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error) {
    console.error('RaceReady Events API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        type: 'RACEREADY_API_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * Normalize RaceReady API response data
 */
function normalizeRaceReadyData(data, view) {
  if (!data) return null;

  // Handle different view types
  switch (view) {
    case 'next':
      return normalizeEvent(data);
    
    case 'events':
      if (Array.isArray(data)) {
        return data.map(event => normalizeEvent(event));
      }
      return data.events ? data.events.map(event => normalizeEvent(event)) : [];
    
    case 'event':
      return normalizeEvent(data);
    
    default:
      return data;
  }
}

/**
 * Normalize a single event object
 */
function normalizeEvent(event) {
  if (!event) return null;

  // Extract venue name if it's an object
  let venueName = event.venue || event.location || event.track;
  if (typeof venueName === 'object' && venueName !== null) {
    venueName = venueName.name || venueName.display || venueName.track || 'Venue TBA';
  }

  // Flatten entries from all categories
  let allEntries = [];
  if (Array.isArray(event.categories)) {
    event.categories.forEach(category => {
      if (Array.isArray(category.entries)) {
        // Add category name to each entry
        const entriesWithCategory = category.entries.map(entry => ({
          ...entry,
          category: category.Name || category.name,
          categoryId: category.ID || category.id,
          driver: entry.name || entry.driver,
          number: entry.racenumber || entry.number,
          team: entry.sponsor || entry.team,
          vehicle: entry.vehicle || entry.car,
        }));
        allEntries = allEntries.concat(entriesWithCategory);
      }
    });
  }

  // Parse event_date if it's a string like "4 April 2025 - 6 April 2025"
  let startDate = event.start_date || event.startDate || event.date_start;
  let endDate = event.end_date || event.endDate || event.date_end;
  
  if (event.event_date && typeof event.event_date === 'string') {
    const dateParts = event.event_date.split(' - ');
    if (dateParts.length === 2) {
      startDate = startDate || dateParts[0];
      endDate = endDate || dateParts[1];
    } else {
      startDate = startDate || event.event_date;
    }
  }

  return {
    id: event.id || event.eventid || event.event_id,
    slug: event.slug || event.event_slug || event.eventSlug,
    name: event.name || event.event_name || event.eventName || event.title,
    title: event.title || event.name || event.event_name,
    location: venueName,
    venue: event.venue,
    startDate: startDate,
    endDate: endDate,
    date: event.event_date || event.date || startDate,
    description: event.description || event.desc || event.event_description || null,
    image: event.image || event.banner || event.hero_image,
    status: event.status || event.event_status || event.entryStatus,
    event_status: event.event_status || event.status || event.entryStatus,
    entries_open: event.entries_open || event.entriesOpen || (event.event_status === 'entries-open'),
    entry_link: event.entry_link || event.entryLink,
    
    // Additional fields
    categories: event.categories || event.classes || [],
    sessions: event.sessions || event.schedule || [],
    documents: event.documents || event.files || [],
    entries: allEntries, // Flattened entries from all categories
    weather: event.weather || null,
    track_map: event.track_map || event.trackMap || event.circuit_map,
    
    // Event metadata
    permit_number: event.event_permit_number || event.permitNumber,
    entries_open_date: event.event_entries_open,
    entries_close_date: event.event_entries_close,
    promotor: event.promotor || event.promoter,
    sanctioning: event.sanctioning || event.sanctioningBody,
    
    // Metadata
    created_at: event.created_at || event.createdAt,
    updated_at: event.updated_at || event.updatedAt,
    
    // Keep original data for reference
    _raw: event
  };
}

