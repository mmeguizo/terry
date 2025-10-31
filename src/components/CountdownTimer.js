"use client";

import { useState, useEffect } from "react";
import { getTimeRemaining } from "@/utils/eventStatus";

/**
 * Countdown timer component for entries opening soon
 * @param {Object} props
 * @param {string|Date} props.targetDate - Date when entries open
 * @param {Function} props.onComplete - Optional callback when countdown reaches zero
 */
export default function CountdownTimer({ targetDate, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetDate));

  useEffect(() => {
    // Update every second
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(targetDate);
      setTimeLeft(remaining);

      // Call onComplete when countdown finishes
      if (remaining.total <= 0 && onComplete) {
        onComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  // If countdown is over
  if (timeLeft.total <= 0) {
    return (
      <div className="text-center py-6">
        <p className="text-xl font-bold text-green-600">Entries are now open!</p>
      </div>
    );
  }

  // Show countdown
  const isLessThan24Hours = timeLeft.days === 0;

  return (
    <div className="text-center py-6">
      <p className="text-sm uppercase tracking-wide text-neutral-600 mb-4">
        Entries Opening In
      </p>
      
      <div className="flex justify-center gap-4">
        {/* Days */}
        {timeLeft.days > 0 && (
          <div className="flex flex-col items-center">
            <div className="bg-red-600 text-white text-3xl font-black px-4 py-3 rounded-lg min-w-[70px]">
              {timeLeft.days}
            </div>
            <p className="text-xs uppercase text-neutral-600 mt-2 font-semibold">
              {timeLeft.days === 1 ? 'Day' : 'Days'}
            </p>
          </div>
        )}
        
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className={`${isLessThan24Hours ? 'bg-orange-600' : 'bg-red-600'} text-white text-3xl font-black px-4 py-3 rounded-lg min-w-[70px]`}>
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <p className="text-xs uppercase text-neutral-600 mt-2 font-semibold">
            Hours
          </p>
        </div>
        
        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className={`${isLessThan24Hours ? 'bg-orange-600' : 'bg-red-600'} text-white text-3xl font-black px-4 py-3 rounded-lg min-w-[70px]`}>
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <p className="text-xs uppercase text-neutral-600 mt-2 font-semibold">
            Minutes
          </p>
        </div>
        
        {/* Seconds - only show if less than 24 hours */}
        {isLessThan24Hours && (
          <div className="flex flex-col items-center">
            <div className="bg-orange-600 text-white text-3xl font-black px-4 py-3 rounded-lg min-w-[70px]">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <p className="text-xs uppercase text-neutral-600 mt-2 font-semibold">
              Seconds
            </p>
          </div>
        )}
      </div>
      
      {isLessThan24Hours && (
        <p className="mt-4 text-orange-600 font-bold animate-pulse">
          ⚡ Opening very soon!
        </p>
      )}
    </div>
  );
}

