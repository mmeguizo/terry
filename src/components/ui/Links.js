"use client";

import React from "react";
import Link from "next/link";
import { useConfig } from "@/context/ConfigContext";

const LinkButton = ({ href, children, newTab }) => {
  const config = useConfig();

  return (
    <Link
      href={href}
      className="group relative inline-flex items-center justify-center px-6 py-2.5 text-xs uppercase tracking-wide transition-all duration-300 transform rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:scale-105 smart-button-primary font-medium"
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
      className="group relative flex items-stretch overflow-hidden rounded-lg backdrop-blur-sm border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 w-full min-h-[46px] smart-card"
      target={newTab ? "_blank" : "_self"}
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      <div
        className="flex items-center justify-center w-10 flex-shrink-0 transition-all duration-300"
        style={{ backgroundColor: primaryColor }}
      >
        <span className="text-white text-sm transition-transform duration-300">
          {childrenArray[0]}
        </span>
      </div>
      <div className="flex-1 flex items-center px-3 py-2 bg-white/90 hover:bg-white transition-colors duration-300">
        <span
          className="font-normal uppercase tracking-wide text-xs leading-tight transition-colors duration-300"
          style={{ color: textColor }}
        >
          {childrenArray[1]}
        </span>
      </div>
    </Link>
  );
};

export { LinkButton, IconLinkButton };
