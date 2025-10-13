"use client";

import { HiChevronRight } from "react-icons/hi2";
import { IconLinkButton } from "@/components/ui/Links";
import { useConfig } from "@/context/ConfigContext";

const EventDocuments = () => {
  const config = useConfig();

  return (
    <section 
      id="documents" 
      className="relative py-20 scroll-mt-24 overflow-hidden"
      style={{
        background: config.menuBackground || '#ffffff'
      }}
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-3">
        <div 
          className="absolute top-10 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl"
          style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
        ></div>
        <div 
          className="absolute bottom-10 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl"
          style={{ backgroundColor: config.primaryColor ? `${config.primaryColor}60` : '#3b82f660' }}
        ></div>
      </div>
      
      {/* Racing corner designs */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top corners */}
        <div 
          className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 opacity-20"
          style={{ borderColor: config.primaryColor || '#3b82f6' }}
        ></div>
        <div 
          className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 opacity-20"
          style={{ borderColor: config.primaryColor || '#3b82f6' }}
        ></div>
        {/* Bottom corners */}
        <div 
          className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 opacity-20"
          style={{ borderColor: config.primaryColor || '#3b82f6' }}
        ></div>
        <div 
          className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 opacity-20"
          style={{ borderColor: config.primaryColor || '#3b82f6' }}
        ></div>
        
        {/* Racing stripes */}
        <div 
          className="absolute top-0 left-0 w-full h-1 opacity-15"
          style={{ background: `linear-gradient(to right, transparent, ${config.primaryColor || '#3b82f6'}, transparent)` }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-full h-1 opacity-15"
          style={{ background: `linear-gradient(to right, transparent, ${config.primaryColor || '#3b82f6'}, transparent)` }}
        ></div>
        
        {/* Additional alignment lines */}
        <div 
          className="absolute top-2 left-8 right-8 h-px opacity-10"
          style={{ background: `linear-gradient(to right, ${config.primaryColor || '#3b82f6'}, transparent, ${config.primaryColor || '#3b82f6'})` }}
        ></div>
        <div 
          className="absolute bottom-2 left-8 right-8 h-px opacity-10"
          style={{ background: `linear-gradient(to right, ${config.primaryColor || '#3b82f6'}, transparent, ${config.primaryColor || '#3b82f6'})` }}
        ></div>
      </div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h1 
            className="xs:text-5xl text-4xl font-bold mb-4 uppercase tracking-wider"
            style={{ color: config.textColor || '#000000' }}
          >
            Event Documents
            <span 
              className="block w-24 h-1 mx-auto mt-4 rounded-full"
              style={{ background: `linear-gradient(to right, ${config.primaryColor || '#3b82f6'}, ${config.primaryColor ? `${config.primaryColor}80` : '#3b82f680'})` }}
            ></span>
          </h1>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: config.textColor || '#000000' }}
          >
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
              <IconLinkButton 
                href={eventDocument.url}
                sectionBg={config.menuBackground}
              >
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
