"use client";

import { HiChevronRight } from "react-icons/hi2";
import { IconLinkButton } from "@/components/ui/Links";
import { useConfig } from "@/context/ConfigContext";

const EventDocuments = () => {
  const config = useConfig();

  return (
    <section className="bg-neutral-700 py-18">
      <div className="container">
        <h1 className="xs:text-4xl text-3xl font-semibold text-white text-start mb-8 uppercase">Event Documents</h1>
        <div className="grid lg:grid-cols-2 2xl:grid-cols-4 grid-cols-1 justify-between gap-6">
          {config.eventDocuments.map((eventDocument, index) => (
            <IconLinkButton key={index} href={eventDocument.url}>
              <HiChevronRight />
              {eventDocument.label}
            </IconLinkButton>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventDocuments;
