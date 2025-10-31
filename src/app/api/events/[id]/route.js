export const dynamic = "force-dynamic";

function pick(...vals) {
  return vals.find((v) => v !== undefined && v !== null && v !== "");
}
function asArray(x) {
  if (Array.isArray(x)) return x;
  if (!x) return [];
  return [x];
}
function mapDocs(raw = []) {
  return asArray(raw)
    .map((d, i) => {
      const label = pick(d?.label, d?.name, d?.title, d?.filename, `Document ${i + 1}`);
      const url = pick(d?.url, d?.href, d?.link);
      return url ? { id: d?.id || i, label, url } : null;
    })
    .filter(Boolean);
}
function mapEntries(raw = []) {
  return asArray(raw).map((e, i) => ({
    id: e?.id || i,
    number: pick(e?.number, e?.carNumber, e?.no, e?.entry_no),
    name: pick(e?.name, e?.driver, e?.team),
    vehicle: pick(e?.vehicle, e?.car, e?.model),
    category: pick(e?.category, e?.class),
    nationality: pick(e?.nationality, e?.country),
  }));
}
function normalizeEvent(src = {}) {
  // Handle various shapes (some return { event, documents, entries, ... })
  const root = src?.event || src?.Event || src?.data?.event || src?.data || src;
  const merged = {
    ...(typeof root === "object" ? root : {}),
    eventDocuments: root?.eventDocuments || root?.Documents || [], // Use "Documents" from JSON
    entryList: root?.entryList || root?.entries || [], // Will collect from categories
    categories: root?.categories || root?.Categories || [], // Use "Categories" from JSON
    sponsors: root?.sponsors || root?.partners || [],
    hero: root?.hero || {},
    heroButton: root?.heroButton || root?.links || [],
  };

  // Extract entries from categories if not already in entryList
  if (!merged.entryList.length && Array.isArray(merged.categories)) {
    merged.entryList = merged.categories.flatMap((cat) => cat?.entries || []);
  }

  // Store original categories with entries for grouped display
  const categoriesWithEntries = Array.isArray(merged.categories) 
    ? merged.categories.map((cat) => {
        if (typeof cat === 'string') return { name: cat, entries: [] };
        return {
          name: cat?.Name || cat?.name || String(cat),
          entries: Array.isArray(cat?.entries) ? cat.entries.map((e, i) => ({
            id: e?.id || i,
            number: e?.racenumber || e?.number || e?.carNumber || e?.no || e?.entry_no,
            name: e?.name || e?.driver || e?.team,
            vehicle: e?.vehicle || e?.car || e?.model,
            category: e?.category || e?.class || cat?.Name || cat?.name,
            sponsor: e?.sponsor || e?.team_name || e?.entrant,
            nationality: e?.nationality || e?.country,
          })) : []
        };
      })
    : [];

  // Map categories to names
  if (Array.isArray(merged.categories)) {
    merged.categories = merged.categories.map((cat) => cat?.Name || cat?.name || String(cat));
  }

  // Map entries to standard format
  if (Array.isArray(merged.entryList)) {
    merged.entryList = merged.entryList.map((e, i) => ({
      id: e?.id || i,
      number: e?.racenumber || e?.number || e?.carNumber || e?.no || e?.entry_no,
      name: e?.name || e?.driver || e?.team,
      vehicle: e?.vehicle || e?.car || e?.model,
      category: e?.category || e?.class,
      sponsor: e?.sponsor || e?.team_name || e?.entrant,
      nationality: e?.nationality || e?.country,
    }));
  }

  // Map documents
  if (Array.isArray(merged.eventDocuments)) {
    merged.eventDocuments = merged.eventDocuments
      .map((d, i) => ({
        id: d?.id || i,
        label: d?.Name || d?.name || d?.title || d?.filename || `Document ${i + 1}`,
        url: d?.URL_Long || d?.url || d?.href || d?.link,
      }))
      .filter((d) => d.url);
  }

  // Build hero from root fields
  merged.hero = {
    ...merged.hero,
    eventName: merged.hero?.eventName || root?.EventName || root?.eventName,
    eventDate: merged.hero?.eventDate || root?.EventDate || root?.eventDate,
    eventLocation: merged.hero?.eventLocation || root?.venue_name || root?.location,
    eventInfo: merged.hero?.eventInfo || root?.InfoPage || root?.infoUrl,
    background: merged.hero?.background || root?.Logo || root?.banner,
  };

  // Build buttons from links
  if (!merged.heroButton.length) {
    const links = [];
    if (root?.EntryLink) links.push({ label: "Entry Link", url: root.EntryLink });
    if (root?.InfoPage) links.push({ label: "Event Info", url: root.InfoPage });
    merged.heroButton = links;
  }

  console.log("[normalizer] mapped →", {
    docs: merged.eventDocuments.length,
    entries: merged.entryList.length,
    categories: merged.categories.length,
  });

  return {
    id: root?.EventID || root?.eventid || root?.id,
    title: root?.EventName || root?.eventName || root?.title,
    startDate: root?.event_datetime_start || root?.EventDate || root?.startDate,
    endDate: root?.event_datetime_finish || root?.endDate,
    location: root?.venue_name || root?.location,
    heroImage: merged.hero?.background,
    infoUrl: merged.hero?.eventInfo,
    description: root?.event_slug || root?.description,
    documents: merged.eventDocuments,
    categories: merged.categories,
    categoriesWithEntries: categoriesWithEntries,
    entries: merged.entryList,
    sponsors: merged.sponsors,
    buttons: merged.heroButton,
    // Additional event metadata
    // Promotor can be array of objects or string - extract name if array
    promotor: (() => {
      const p = root?.promotor || root?.promoter || root?.Promotor || root?.Promoter;
      if (Array.isArray(p) && p.length > 0) return p[0].name;
      return p;
    })(),
    permitNumber: root?.event_permit_number || root?.permitNumber || root?.permit_number || root?.PermitNumber,
    entriesOpenDate: root?.event_entries_open || root?.entries_open_date || root?.entriesOpenDate,
    entriesCloseDate: root?.event_entries_close || root?.entries_close_date || root?.entriesCloseDate,
    entryLink: root?.EntryLink || root?.entry_link || root?.entryLink,
    eventStatus: root?.event_status || root?.status || root?.eventStatus,
    // Venue details
    venue: {
      name: root?.venue_name || root?.Venue || root?.venue?.name || root?.location,
      address: root?.venue_address || root?.venue?.address,
      suburb: root?.venue_suburb || root?.venue?.suburb,
      state: root?.venue_state || root?.venue?.state,
      postcode: root?.venue_postcode || root?.venue?.postcode,
      phone: root?.venue_phone || root?.venue?.phone,
      email: root?.venue_email || root?.venue?.email,
      website: root?.venue_website || root?.venue?.website,
    },
    raw: src,
  };
}

export async function GET(req, ctx) {
  const { id } = await ctx.params; // FIX: await params
  
  // Get GUID from config or environment
  let guid = process.env.RACEREADY_GUID;
  
  // TEMPORARY: Hardcoded GUID for testing
  if (!guid) {
    guid = '84368220-881D-42A8-8B08-A38A4FE11A96'; // Motor Racing Australia
    console.log('[event-api] Using hardcoded GUID for testing');
  }
  
  // Build URL with GUID - use correct RaceReady API format
  // Note: RaceReady API uses /api/events/ (plural) with view=event and event=slug
  const remote = `https://raceready.com.au/api/events/?GUID=${guid}&view=event&event=${encodeURIComponent(id)}`;
  console.log("[event-api] fetch →", { id, remote: remote.replace(guid, `${guid.substring(0, 8)}...`) });

  try {
    const res = await fetch(remote, { cache: "no-store" });
    const json = await res.json().catch(() => ({}));

    if (!res.ok || !json) {
      console.warn("[event-api] HTTP/error:", res.status, json);
      return Response.json({ ok: false, id, error: "Fetch failed" }, { status: res.status || 500 });
    }

    // Handle various shapes (some return { event, documents, entries, ... })
    const root = json?.event || json?.Event || json?.data?.event || json?.data || json;
    const merged = {
      ...(typeof root === "object" ? root : {}),
      eventDocuments:
        root?.eventDocuments || json?.eventDocuments || json?.documents || json?.docs || [],
      entryList: root?.entryList || root?.entries || json?.entryList || json?.entries || [],
      categories: root?.categories || json?.categories || json?.classes || [],
      sponsors: root?.sponsors || json?.sponsors || json?.partners || [],
      hero: root?.hero || json?.hero || {},
      heroButton: root?.heroButton || json?.heroButton || json?.links || [],
    };

    console.log("[event-api] root keys →", Object.keys(merged || {}));

    const evt = normalizeEvent(merged);

    console.log("[event-api] ok →", {
      id: evt.id,
      title: evt.title,
      docs: evt.documents.length,
      entries: evt.entries.length,
      categories: evt.categories.length,
    });

    return Response.json({ ok: true, event: evt });
  } catch (e) {
    console.warn("[event-api] exception:", e?.message || e);
    return Response.json({ ok: false, id, error: "Exception" }, { status: 500 });
  }
}