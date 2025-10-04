"use client";

import { useConfig } from "@/context/ConfigContext";

export default function SectionTitle({ children, className = "" }) {
  const config = useConfig();
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="xs:text-3xl text-2xl font-bold text-white uppercase tracking-wide">
        {children}
      </h2>
      <div className="h-[3px] mt-3 rounded bg-gradient-to-r from-[var(--primary-color,#CC0000)] via-[var(--primary-color,#CC0000)] to-transparent" style={{ backgroundSize: '30% 100%' }} />
    </div>
  );
}


