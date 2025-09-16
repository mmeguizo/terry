"use client";

import { useConfig } from "@/context/ConfigContext";

export default function SectionTitle({ children, className = "" }) {
  const config = useConfig();
  const primaryColor = config?.primaryColor || "#0ea5e9";
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="xs:text-3xl text-2xl font-semibold text-white uppercase tracking-wide">
        {children}
      </h2>
      <div
        className="h-[3px] mt-3 rounded"
        style={{
          background:
            `linear-gradient(90deg, ${primaryColor}, ${primaryColor} 30%, transparent 30%, transparent)`,
        }}
      />
    </div>
  );
}


