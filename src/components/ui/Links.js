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
      className="group relative flex items-stretch overflow-hidden rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] w-full min-h-[72px]"
      target={newTab ? "_blank" : "_self"} 
      rel={newTab ? "noopener noreferrer" : undefined}
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
      <div className="flex-1 flex items-center px-6 py-4">
        <span className="text-white font-bold uppercase tracking-wide text-sm leading-tight group-hover:text-blue-100 transition-colors duration-300">
          {childrenArray[1]}
        </span>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Border glow */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 group-hover:ring-white/30 transition-all duration-300"></div>
    </Link>
  );
};

export { LinkButton, IconLinkButton };
