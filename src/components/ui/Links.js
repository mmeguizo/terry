"use client";

import React from "react";
import Link from "next/link";
import { useConfig } from "@/context/ConfigContext";

const LinkButton = ({ href, children, newTab }) => {
  const config = useConfig();

  return (
    <Link 
      href={href} 
      className="group relative inline-flex items-center justify-center px-8 py-4 text-sm uppercase tracking-wider transition-all duration-300 transform rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-105 smart-button-primary"
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

const IconLinkButton = ({ href, children, newTab, sectionBg = null }) => {
  const config = useConfig();

  const childrenArray = React.Children.toArray(children);

  if (childrenArray.length !== 2) {
    throw new Error("IconButton must have exactly two children: icon and label");
  }

  // Use textColor from config for better contrast
  const textColor = config?.textColor || '#1a1a1a';
  const primaryColor = config?.primaryColor || '#3b82f6';

  return (
    <Link 
      href={href} 
      className="group relative flex items-stretch overflow-hidden rounded-2xl backdrop-blur-sm border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 w-full min-h-[72px] smart-card"
      target={newTab ? "_blank" : "_self"} 
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      <div 
        className="flex items-center justify-center w-20 flex-shrink-0 transition-all duration-300 group-hover:scale-110"
        style={{ backgroundColor: primaryColor }}
      >
        <span className="text-white text-xl group-hover:rotate-12 transition-transform duration-300">
          {childrenArray[0]}
        </span>
      </div>
      <div className="flex-1 flex items-center px-6 py-4 bg-white/80">
        <span 
          className="font-semibold uppercase tracking-wide text-sm leading-tight transition-colors duration-300"
          style={{ color: textColor }}
        >
          {childrenArray[1]}
        </span>
      </div>
      
      {/* Racing corner designs */}
      <div className="absolute inset-0 pointer-events-none rounded-xl">
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-[var(--accent-color)]"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-[var(--accent-color)]"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-[var(--accent-color)]"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-[var(--accent-color)]"></div>
      </div>

      {/* Clean shine effect - same as sponsors */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
      
      {/* Clean border glow - same as sponsors */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 group-hover:ring-blue-200/50 transition-all duration-300"></div>
      
      {/* Background glow effect - same as sponsors */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </Link>
  );
};

export { LinkButton, IconLinkButton };
