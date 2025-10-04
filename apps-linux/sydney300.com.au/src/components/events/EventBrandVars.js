"use client";

import { useConfig } from "@/context/ConfigContext";

export default function EventBrandVars({ children }) {
  const config = useConfig();
  const primaryColor = config?.primaryColor || "#0ea5e9";
  return (
    <div style={{ "--primary-color": primaryColor }}>
      {children}
    </div>
  );
}


