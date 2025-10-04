"use client";

import { useConfig } from "@/context/ConfigContext";
import EntryCountdown from "@/components/events/EntryCountdown";

export default function EventHeaderBand({ title, venue, eventState, opensAt }) {
  const config = useConfig();
  const primaryColor = config?.primaryColor || "#0ea5e9";

  return (
    <section
      className="relative bg-neutral-900 mt-[77px] py-8 overflow-hidden"
      style={{ borderBottom: `2px solid ${primaryColor}` }}
    >
      {/* background overlays removed for a clean solid header */}

      <div className="container relative z-10">
        <h1 className="xs:text-4xl text-3xl font-semibold text-white uppercase tracking-wider">
          {title}
        </h1>
        {venue ? <p className="text-white/80 mt-1">{venue}</p> : null}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span
            className="uppercase text-xs px-2 py-1 rounded-sm text-white"
            style={{ backgroundColor: primaryColor }}
          >
            {eventState.replaceAll("_", " ")}
          </span>
          {eventState === "upcoming_notopen" && opensAt ? (
            <span className="text-sm text-white/90">
              Entries open in: <EntryCountdown targetIso={opensAt} />
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}


