"use client";

import { useConfig } from "@/context/ConfigContext";
import Image from "next/image";
import Link from "next/link";

const Sponsors = () => {
  const config = useConfig();

  // Create enough duplicates for seamless scrolling
  const sponsorItems = [...config.sponsors, ...config.sponsors, ...config.sponsors];

  return (
    <section 
      id="sponsors" 
      className="relative py-20 xl:py-24 2xl:py-28 scroll-mt-24 overflow-hidden"
      style={{
        background: config.menuBackground || '#ffffff'
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Racing corner designs */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top corners */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2" style={{ borderColor: config.primaryColor + '60' }}></div>
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2" style={{ borderColor: config.primaryColor + '60' }}></div>
        {/* Bottom corners */}
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2" style={{ borderColor: config.primaryColor + '40' }}></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2" style={{ borderColor: config.primaryColor + '40' }}></div>
        
        {/* Racing stripes */}
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(to right, transparent, ${config.primaryColor}50, transparent)` }}></div>
        <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: `linear-gradient(to right, transparent, ${config.primaryColor}30, transparent)` }}></div>
      </div>
      
      <div className="w-full relative z-10 xl:px-8 2xl:px-12 3xl:px-16">
        <div className="text-center mb-16 xl:mb-20 2xl:mb-24">
          <h1
            className="xs:text-5xl text-4xl xl:text-6xl 2xl:text-7xl font-bold text-[var(--color-primary)] mb-4 xl:mb-6 2xl:mb-8 uppercase tracking-wider"
            style={{ "--color-primary": config.primaryColor }}
          >
            Sponsors & Partners
            <span 
              className="block w-24 xl:w-28 2xl:w-32 h-1 xl:h-1.5 2xl:h-2 mx-auto mt-4 xl:mt-6 2xl:mt-8 rounded-full"
              style={{ background: `linear-gradient(90deg, ${config.primaryColor}, ${config.primaryColor}80)` }}
            ></span>
          </h1>
          <p className="text-gray-600 text-lg xl:text-xl 2xl:text-2xl max-w-2xl xl:max-w-4xl 2xl:max-w-6xl mx-auto">
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
                className="inline-flex flex-shrink-0 w-56 xl:w-72 2xl:w-80 3xl:w-96 mx-6 xl:mx-10 2xl:mx-12 3xl:mx-16"
              >
                <div
                  className="group relative block w-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 xl:p-8 2xl:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 border border-white/50 cursor-pointer"
                >
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Racing corner designs */}
                  <div className="absolute inset-0 pointer-events-none rounded-2xl">
                    <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderColor: config.primaryColor + '80' }}></div>
                    <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderColor: config.primaryColor + '80' }}></div>
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderColor: config.primaryColor + '60' }}></div>
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderColor: config.primaryColor + '60' }}></div>
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center h-24 xl:h-28 2xl:h-32 mb-4 xl:mb-5 2xl:mb-6">
                    {sponsor.logo && sponsor.logo.trim() !== '' ? (
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width={200}
                        height={100}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                        <span className="text-gray-500 font-medium text-sm">LOGO</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative z-10 text-center">
                    <p className="text-sm xl:text-base 2xl:text-lg font-semibold text-gray-700 leading-tight group-hover:text-gray-900 transition-colors duration-300">
                      {typeof sponsor.name === 'string' ? sponsor.name : 'Sponsor'}
                    </p>
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
                  
                  {/* Border glow */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 group-hover:ring-blue-200/50 transition-all duration-300"></div>
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
