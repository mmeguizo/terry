"use client";

import { useConfig } from "@/context/ConfigContext";
import Image from "next/image";
import Link from "next/link";

const Sponsors = () => {
  const config = useConfig();

  // Create enough duplicates for seamless scrolling
  const sponsorItems = [...config.sponsors, ...config.sponsors, ...config.sponsors];

  return (
    <section id="sponsors" className="relative bg-gradient-to-br from-neutral-50 via-white to-neutral-100 py-20 scroll-mt-24 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="w-full relative z-10">
        <div className="text-center mb-16">
          <h1
            className="xs:text-5xl text-4xl font-bold text-[var(--color-primary)] mb-4 uppercase tracking-wider"
            style={{ "--color-primary": config.primaryColor }}
          >
            Sponsors & Partners
            <span 
              className="block w-24 h-1 mx-auto mt-4 rounded-full"
              style={{ background: `linear-gradient(90deg, ${config.primaryColor}, ${config.primaryColor}80)` }}
            ></span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Proud to be supported by industry-leading partners and sponsors
          </p>
        </div>
        
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
                className="inline-flex flex-shrink-0 w-56 mx-6"
              >
                <Link
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block w-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 border border-white/50"
                >
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center h-24 mb-4">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={200}
                      height={100}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="relative z-10 text-center">
                    <p className="text-sm font-semibold text-gray-700 leading-tight group-hover:text-gray-900 transition-colors duration-300">
                      {sponsor.name}
                    </p>
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
                  
                  {/* Border glow */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 group-hover:ring-blue-200/50 transition-all duration-300"></div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
