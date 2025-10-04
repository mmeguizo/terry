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
    entries: merged.entryList,
    sponsors: merged.sponsors,
    buttons: merged.heroButton,
    raw: src,
  };
}

export async function GET(req, ctx) {
  const { id } = await ctx.params; // FIX: await params
  const remote = `https://raceready.com.au/api/event/?eventid=${encodeURIComponent(id)}`;
  console.log("[event-api] fetch →", { id, remote });

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