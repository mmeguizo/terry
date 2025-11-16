"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BackButton() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  const [referrer, setReferrer] = useState(null);

  useEffect(() => {
    // Check if browser history is available
    setCanGoBack(window.history.length > 1);

    // Try to determine where user came from
    const ref = document.referrer;
    if (ref) {
      setReferrer(ref);
    }
  }, []);

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push("/events");
    }
  };

  // Determine label based on referrer
  const getLabel = () => {
    if (!referrer) return "Back to Events";
    if (referrer.includes("/news")) return "Back to News";
    if (referrer.includes("/events")) return "Back to Events";
    return "Go Back";
  };

  const label = getLabel();

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-3 text-red-600 hover:text-red-700 font-bold uppercase text-sm tracking-wide group transition-colors"
    >
      <svg
        className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      {label}
    </button>
  );
}
