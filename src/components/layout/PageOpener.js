"use client";

import { useEffect, useRef, useState } from "react";
import { useConfig } from "@/context/ConfigContext";

const SESSION_KEY = "page-opener-played";

export default function PageOpener() {
  const config = useConfig();
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef(null);

  useEffect(() => {
    const alreadyPlayed = typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1";
    if (alreadyPlayed) {
      setVisible(false);
      return;
    }
    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, "1");

    hideTimer.current = setTimeout(() => setVisible(false), 2200);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="opener-container" aria-hidden>
      <div className="opener-bg" style={{ backgroundImage: `linear-gradient(130deg, ${config.primaryColor} 0%, rgba(0,0,0,0.6) 60%)` }} />
      <div className="opener-glow" style={{ background: `radial-gradient(60% 60% at 50% 50%, ${config.primaryColor}66 0%, transparent 60%)` }} />
      <div className="opener-slice" style={{ background: `linear-gradient(90deg, transparent, #ffffff, transparent)` }} />
      <div className="opener-logo">
        <img src={config.logoImage} alt="Logo" />
      </div>
    </div>
  );
}


