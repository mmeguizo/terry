"use client";

import { HiChevronRight } from "react-icons/hi2";
import { IconLinkButton } from "@/components/ui/Links";
import { useConfig } from "@/context/ConfigContext";

export default function EventDocuments() {
  const config = useConfig();
  const docs = Array.isArray(config?.eventDocuments) ? config.eventDocuments : [];

  return (
    <section className="bg-[#171717] py-18">
      <div className="container">
        <h1 className="xs:text-4xl text-3xl font-semibold text-white text-start mb-8 uppercase">
          Event Documents
        </h1>
        <div className="grid lg:grid-cols-2 2xl:grid-cols-4 grid-cols-1 justify-between gap-6">
          {docs.length === 0 ? (
            <p className="text-white/80">No documents yet.</p>
          ) : (
            docs.map((eventDocument, index) => (
              <IconLinkButton key={index} href={eventDocument.url}>
                <HiChevronRight />
                {eventDocument.label}
              </IconLinkButton>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
