"use client";

import React from "react";
import Link from "next/link";
import { useConfig } from "@/context/ConfigContext";

const LinkButton = ({ href, children, newTab }) => {
  const config = useConfig();
  const primaryColor = config?.primaryColor || "#ffffff";

  return (
    <Link 
      href={href} 
      className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white uppercase tracking-wider transition-all duration-300 transform rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-105"
      style={{ 
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}CC 100%)`,
        boxShadow: `0 4px 15px 0 ${primaryColor}40`
      }}
      target={newTab ? "_blank" : "_self"} 
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-black/20"></span>
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20"></div>
    </Link>
  );
};

const IconLinkButton = ({ href, children, newTab }) => {
  const config = useConfig();
  const primaryColor = config?.primaryColor || "#ffffff";

  const childrenArray = React.Children.toArray(children);

  if (childrenArray.length !== 2) {
    throw new Error("IconButton must have exactly two children: icon and label");
  }

  return (
    <Link 
      href={href} 
      className="group relative flex items-stretch overflow-hidden rounded-xl bg-neutral-900 backdrop-blur-lg border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] w-full min-h-[72px]"
      target={newTab ? "_blank" : "_self"} 
      rel={newTab ? "noopener noreferrer" : undefined}
      style={{ backgroundColor: '#1f2937' }}
    >
      <div 
        className="flex items-center justify-center w-20 flex-shrink-0 transition-all duration-300 group-hover:scale-110"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}DD 100%)`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2)`
        }}
      >
        <span className="text-white text-xl group-hover:rotate-12 transition-transform duration-300">
          {childrenArray[0]}
        </span>
      </div>
      <div className="flex-1 flex items-center px-6 py-4" style={{ backgroundColor: 'rgba(31, 41, 55, 0.9)' }}>
        <span 
          className="text-white font-bold uppercase tracking-wide text-sm leading-tight group-hover:text-blue-100 transition-colors duration-300 drop-shadow-lg"
          style={{ 
            color: '#ffffff',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            fontWeight: '700'
          }}
        >
          {childrenArray[1]}
        </span>
      </div>
      
      {/* Racing corner designs */}
      <div className="absolute inset-0 pointer-events-none rounded-xl">
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-blue-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-blue-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-indigo-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-indigo-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Border glow */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 group-hover:ring-white/30 transition-all duration-300"></div>
    </Link>
  );
};

export { LinkButton, IconLinkButton };
