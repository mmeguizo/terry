"use client";

import React, { useEffect, useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { HiChevronRight } from "react-icons/hi2";
import { LinkButton, IconLinkButton } from "@/components/ui/Links";

const Hero = () => {
  const config = useConfig();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [offsetY, setOffsetY] = useState(0);
  const [nextEvent, setNextEvent] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch next event from RaceReady API
  useEffect(() => {
    const fetchNextEvent = async () => {
      try {
        const response = await fetch('/api/raceready-events?view=next');
        if (response.ok) {
          const data = await response.json();
          setNextEvent(data);
          console.log('✅ Next event loaded from RaceReady:', data);
        }
      } catch (error) {
        console.warn('Failed to fetch next event from RaceReady:', error);
      }
    };

    fetchNextEvent();
  }, []);

  useEffect(() => {
    // Use next event date if available, otherwise fall back to config
    const eventDate = nextEvent?.startDate || nextEvent?.date || config.hero?.eventDate;
    
    if (!eventDate) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const targetDate = new Date(eventDate).getTime();
    
    // Check if the date is valid
    if (isNaN(targetDate)) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown(); // Initial run
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval); // Cleanup
  }, [nextEvent, config.hero?.eventDate]);

  const formatTime = (value) => value.toString().padStart(2, "0");
  
  const formattedEventDate = (() => {
    const eventDate = nextEvent?.startDate || nextEvent?.date || config.hero?.eventDate;
    if (!eventDate) return "Event Date TBA";
    
    const date = new Date(eventDate);
    if (isNaN(date.getTime())) return "Event Date TBA";
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  })();

  // Use next event data if available, otherwise fall back to config
  const eventName = nextEvent?.name || nextEvent?.title || config.hero?.eventName;
  const eventLocation = nextEvent?.location || nextEvent?.venue || config.hero?.eventLocation;
  const backgroundImage = nextEvent?.image || config.hero?.background;
  const backgroundVideo = config.hero?.backgroundVideo;

  return (
    <section
      id="home"
      className="z-0 relative w-full h-[900px] lg:h-[750px] xl:h-[800px] 2xl:h-[900px] 3xl:h-[1000px] bg-neutral-700 overflow-hidden scroll-mt-24"
    >
      {/* Video Background (if available) */}
      {backgroundVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={backgroundImage}
          onLoadedData={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      
      {/* Image Background (fallback or poster) */}
      {!backgroundVideo && backgroundImage && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: `center ${offsetY * -0.5}px`,
          }}
        />
      )}

      {/* Enhanced overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40 z-0"></div>
      <div className="container absolute z-10 inset-0 flex items-center text-center gap-4 text-white pt-20 xl:pt-24 2xl:pt-32 px-4 xl:px-8">
        <div className="grid xl:grid-cols-[3fr_2fr] gap-12 xl:gap-24 2xl:gap-32 3xl:gap-40 w-full lg:grid-cols-[1fr_1fr]">
          <div className="grow font-bold flex flex-col gap-4 xl:gap-6">
            <div className="flex justify-center lg:justify-start mb-4 xl:mb-6">
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 xs:gap-3 xl:gap-4">
                {[
                  { value: timeLeft.days, label: 'DAYS' },
                  { value: timeLeft.hours, label: 'HOURS' },
                  { value: timeLeft.minutes, label: 'MINS' },
                  { value: timeLeft.seconds, label: 'SECS' }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="relative bg-black/60 backdrop-blur-sm rounded-lg p-2 xs:p-3 xl:p-3 min-w-[60px] xs:min-w-[70px] xl:min-w-[85px]"
                    >
                      <div className="text-2xl xs:text-3xl xl:text-4xl font-bold text-white mb-0.5 text-center tabular-nums">
                        {formatTime(item.value)}
                      </div>
                      <div 
                        className="text-[9px] xs:text-[10px] xl:text-xs font-medium uppercase tracking-wider text-center opacity-70"
                      >
                        {item.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <h1 className="xs:text-3xl text-2xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl text-start uppercase leading-tight text-white font-bold">
              {typeof eventName === 'string' ? eventName : 'Event Name TBA'}
            </h1>

            <h1 className="xs:text-2xl text-xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl text-start uppercase leading-tight text-white font-semibold">
              {typeof eventLocation === 'string' ? eventLocation : 'Venue TBA'}
            </h1>

            <p className="text-start uppercase text-sm xl:text-base 2xl:text-lg text-gray-200 font-medium">{formattedEventDate}</p>
            {/* Dynamic button based on event state - TODO: implement when API is updated */}
            <LinkButton href="/event-info">Event Info</LinkButton>
          </div>
          <div className="shrink-0 flex flex-col justify-end grow gap-3 xl:gap-4 2xl:gap-5">
            {Array.isArray(config.hero?.buttons) && config.hero.buttons.map((button, index) => {
              // Convert external URLs to internal event/document links
              let internalHref = button.url;
              if (typeof button.url === 'string' && button.url.length > 0) {
                if (button.url.startsWith('http') || button.url.startsWith('//')) {
                  // For external URLs, link to our event page or documents
                  if (button.label?.toLowerCase().includes('event') || button.label?.toLowerCase().includes('info')) {
                    internalHref = config.currentEventId ? `/event/${config.currentEventId}` : '/events';
                  } else if (button.label?.toLowerCase().includes('document') || button.label?.toLowerCase().includes('download')) {
                    internalHref = '#documents';
                  } else {
                    internalHref = '/events';
                  }
                }
              } else {
                internalHref = '/events';
              }
              
              return (
                <IconLinkButton key={index} href={internalHref}>
                  <HiChevronRight />
                  {typeof button.label === 'string' ? button.label : 'Action'}
                </IconLinkButton>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
