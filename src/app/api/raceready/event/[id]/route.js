export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

const RR_BASE = "https://raceready.com.au/api/event/?eventid=";

const pick = (...vals) => vals.find((v) => v != null && v !== "" && !(Array.isArray(v) && v.length === 0));
function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(_request, { params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id; // <- use destructured params
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const url = `${RR_BASE}${encodeURIComponent(id)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json({ error: `Upstream ${res.status}`, details: text }, { status: 502 });
    }
    const json = await res.json();

    const name = pick(json?.EventName, json?.eventName, json?.Title, json?.title, json?.name) || `Event ${id}`;
    const venue = pick(json?.Venue, json?.venue, json?.Location, json?.location, json?.TrackName, json?.track) || null;
    const startDate = pick(json?.EventStartDate, json?.StartDate, json?.startDate, json?.eventDate) || null;
    const endDate = pick(json?.EventEndDate, json?.EndDate, json?.endDate) || null;
    const heroImage =
      pick(json?.HeroImage, json?.BannerUrl, json?.PosterUrl, json?.poster, json?.image, json?.headerImage) || null;
    const description = pick(json?.Description, json?.description, json?.Summary, json?.summary) || null;

    const rawDocs =
      (Array.isArray(json?.Documents) && json.Documents) ||
      (Array.isArray(json?.EventDocuments) && json.EventDocuments) ||
      (Array.isArray(json?.documents) && json.documents) ||
      [];
    const documents = rawDocs
      .filter(Boolean)
      .map((d, i) => ({
        id: d?.id ?? i,
        label: pick(d?.Label, d?.label, d?.Name, d?.name, "Document"),
        url: pick(d?.URL, d?.Url, d?.url, d?.Href, d?.href, "#"),
      }));

    const rawCats =
      (Array.isArray(json?.Categories) && json.Categories) ||
      (Array.isArray(json?.classes) && json.classes) ||
      (Array.isArray(json?.CategoryList) && json.CategoryList) ||
      [];
    const categories = rawCats
      .filter(Boolean)
      .map((c, i) => pick(c?.Name, c?.name, c?.Title, c?.title, c) || `Category ${i + 1}`);

    const rawEntries =
      (Array.isArray(json?.Entries) && json.Entries) ||
      (Array.isArray(json?.EntryList) && json.EntryList) ||
      (Array.isArray(json?.entries) && json.entries) ||
      [];
    const entries = rawEntries
      .filter(Boolean)
      .map((e, i) => ({
        id: e?.id ?? e?.EntryID ?? i,
        number: pick(e?.Number, e?.number, e?.CarNumber, e?.carNumber, null),
        team: pick(e?.Team, e?.team, e?.Entrant, e?.entrant, null),
        drivers:
          (Array.isArray(e?.Drivers) ? e.Drivers : Array.isArray(e?.drivers) ? e.drivers : [pick(e?.Driver, e?.driver)])
            .filter(Boolean)
            .map((d) => (typeof d === "string" ? d : pick(d?.Name, d?.name, d?.FullName, d?.fullName))),
        car: pick(e?.Car, e?.car, e?.Vehicle, e?.vehicle, null),
        class: pick(e?.Class, e?.class, e?.Category, e?.category, null),
      }));

    const out = {
      id: String(id),
      slug: slugify(name),
      name,
      venue,
      startDate,
      endDate,
      heroImage,
      description,
      documents,
      categories,
      entries,
      _rawAvailable: !!json,
    };

    return NextResponse.json(out);
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Failed to fetch" }, { status: 500 });
  }
}