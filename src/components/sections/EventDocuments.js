"use client";

import { HiChevronRight } from "react-icons/hi2";
import { IconLinkButton } from "@/components/ui/Links";
import { useConfig } from "@/context/ConfigContext";

const EventDocuments = () => {
  const config = useConfig();

  return (
    <section id="documents" className="relative bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-900 py-20 scroll-mt-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h1 className="xs:text-5xl text-4xl font-bold text-white mb-4 uppercase tracking-wider">
            Event Documents
            <span className="block w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mt-4 rounded-full"></span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Access all essential event documentation and regulations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {config.eventDocuments.map((eventDocument, index) => (
            <div
              key={index}
              className="opacity-0 translate-y-8 animate-[fadeInUp_0.6s_ease-out_forwards] flex"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <IconLinkButton href={eventDocument.url}>
                <HiChevronRight />
                {eventDocument.label}
              </IconLinkButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventDocuments;
