"use client";

import { useConfig } from "@/context/ConfigContext";
import Image from "next/image";
import Link from "next/link";

const Sponsors = () => {
  const config = useConfig();

  // Create enough duplicates for seamless scrolling
  const sponsorItems = [...config.sponsors, ...config.sponsors, ...config.sponsors];

  return (
    <section id="sponsors" className="bg-neutral-100 py-18 scroll-mt-24">
      <div className="w-full">
        <h1
          className="xs:text-4xl text-3xl font-semibold text-[var(--color-primary)] text-center mb-14 uppercase"
          style={{ "--color-primary": config.primaryColor }}
        >
          Sponsors | Partners
        </h1>
        
        {/* Marquee Container */}
        <div className="overflow-hidden relative">
          <div 
            className="flex whitespace-nowrap sponsors-marquee"
            onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
          >
            {sponsorItems.map((sponsor, index) => (
              <div 
                key={index} 
                className="inline-flex flex-shrink-0 w-48 h-32 flex-col items-center justify-center mx-4 hover:opacity-75 transition-opacity duration-300"
              >
                <Link
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-24 mb-2"
                >
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={200}
                    height={100}
                    className="w-full h-full object-contain"
                  />
                </Link>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 leading-tight truncate w-full">{sponsor.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
