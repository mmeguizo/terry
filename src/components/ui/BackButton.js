"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BackButton() {
  const router = useRouter();
  const [label, setLabel] = useState("Go Back");
  const [backPath, setBackPath] = useState("/events");

  useEffect(() => {
    // Check localStorage for previous page
    const previousPage = localStorage.getItem("previousPage");
    const currentPage = window.location.pathname;

    // Store current page for next navigation
    localStorage.setItem("previousPage", currentPage);

    // Check document.referrer
    const referrer = document.referrer;
    let detectedLabel = "Back to Events";
    let detectedPath = "/events";

    if (referrer) {
      if (referrer.includes("/news")) {
        detectedLabel = "Back to News";
        detectedPath = "/news";
      } else if (referrer.includes("/events")) {
        detectedLabel = "Back to Events";
        detectedPath = "/events";
      }
    } else if (previousPage && previousPage !== currentPage) {
      // Use stored previous page if referrer not available
      if (previousPage.includes("/news")) {
        detectedLabel = "Back to News";
        detectedPath = "/news";
      } else if (previousPage.includes("/events")) {
        detectedLabel = "Back to Events";
        detectedPath = "/events";
      }
    }

    setLabel(detectedLabel);
    setBackPath(detectedPath);
  }, []);

  const handleBack = () => {
    // Try to go back in history first
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to detected path
      router.push(backPath);
    }
  };

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
