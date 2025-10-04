"use client";

import { useEffect, useState } from "react";

export default function EntryCountdown({ targetIso }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!targetIso) return;
    const target = new Date(targetIso).getTime();
    const tick = () => {
      setRemaining(Math.max(0, target - Date.now()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  if (!targetIso) return null;

  const total = remaining;
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  const pad = (v) => v.toString().padStart(2, "0");

  return (
    <span>
      {pad(days)}d:{pad(hours)}h:{pad(minutes)}m:{pad(seconds)}s
    </span>
  );
}


