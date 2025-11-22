"use client";

import React, { useEffect, useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { HiChevronRight } from "react-icons/hi2";
import { LinkButton, IconLinkButton } from "@/components/ui/Links";

// Helper function to extract YouTube video ID and create embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;

  // Extract video ID from various YouTube URL formats
  let videoId = null;

  // youtu.be format
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
  }
  // youtube.com/watch?v= format
  else if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0];
  }
  // youtube.com/embed/ format (already embedded)
  else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('embed/')[1]?.split(/[?&]/)[0];
  }

  if (!videoId) return null;

  // Create embed URL with autoplay, loop, mute, no controls, and highest quality
  // vq=hd1080 requests 1080p, hd720 is fallback
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&vq=hd1080&hd=1`;
};

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

  // Check if backgroundVideo is a YouTube URL
  const isYouTube = backgroundVideo && (
    backgroundVideo.includes('youtube.com') ||
    backgroundVideo.includes('youtu.be')
  );
  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(backgroundVideo) : null;

  // Debug logging
  console.log('🎥 Video config:', {
    backgroundVideo,
    isYouTube,
    youtubeEmbedUrl,
    backgroundImage
  });

  return (
    <section
      id="home"
      className="z-0 relative w-full h-[900px] lg:h-[750px] xl:h-[800px] 2xl:h-[900px] 3xl:h-[1000px] bg-neutral-700 overflow-hidden scroll-mt-24"
    >
      {/* Image Background (poster/fallback) - Always show as base layer */}
      {backgroundImage && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: `center ${offsetY * -0.5}px`,
          }}
        />
      )}

      {/* YouTube Video Background - Layer on top of image */}
      {youtubeEmbedUrl && (
        <div className="absolute inset-0 w-full h-full z-[1]">
          <iframe
            src={youtubeEmbedUrl}
            className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Hero Background Video"
            loading="eager"
            style={{ border: 0 }}
          />
        </div>
      )}

      {/* MP4 Video Background (if not YouTube) */}
      {backgroundVideo && !isYouTube && (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={backgroundImage}
          onLoadedData={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover z-[1]"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Enhanced overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40 z-0"></div>
      <div className="container absolute z-10 inset-0 flex items-center text-center gap-4 text-white pt-16 xl:pt-20 2xl:pt-24 px-4 xl:px-8">
        <div className="grid xl:grid-cols-[3fr_2fr] gap-8 xl:gap-16 2xl:gap-20 w-full lg:grid-cols-[1fr_1fr]">
          <div className="grow flex flex-col gap-3 xl:gap-4">
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
            <h1 className="xs:text-2xl text-xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl text-start uppercase leading-tight text-white font-normal">
              {typeof eventName === 'string' ? eventName : 'Event Name TBA'}
            </h1>

            <h2 className="xs:text-xl text-lg xl:text-2xl 2xl:text-3xl 3xl:text-4xl text-start uppercase leading-tight text-white font-light">
              {typeof eventLocation === 'string' ? eventLocation : 'Venue TBA'}
            </h2>

            <p className="text-start uppercase text-xs xl:text-sm 2xl:text-base text-gray-200 font-light">{formattedEventDate}</p>

            {/* Dynamic buttons based on event_status */}
            <div className="flex gap-3 justify-start flex-wrap">
              {nextEvent?.event_status === 'entries-open' && (
                <LinkButton href={nextEvent?.entry_url || '/event-info'}>
                  Enter Now
                </LinkButton>
              )}
              {nextEvent?.event_status === 'entries-closed' && (
                <button
                  disabled
                  className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg opacity-60 cursor-not-allowed"
                >
                  Entries Closed
                </button>
              )}
              {nextEvent?.event_status === 'live' && (
                <div className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg animate-pulse">
                  🔴 Happening Now!
                </div>
              )}
              {(!nextEvent?.event_status || nextEvent?.event_status === 'upcoming') && (
                <div className="px-6 py-3 bg-neutral-700 text-white font-semibold rounded-lg border border-neutral-600">
                  Entries Opening Soon
                </div>
              )}
              <LinkButton href="/event-info">
                Event Info
              </LinkButton>
            </div>
          </div>
          <div className="shrink-0 flex flex-col justify-end grow gap-2 xl:gap-2.5">
            {/* Clean GT4-inspired buttons */}
            <IconLinkButton href="/events">
              <HiChevronRight />
              Event Timetable
            </IconLinkButton>
            <IconLinkButton href="/noticeboard">
              <HiChevronRight />
              Noticeboard
            </IconLinkButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
