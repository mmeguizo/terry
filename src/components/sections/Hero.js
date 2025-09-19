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

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const targetDate = new Date(config.hero.eventDate).getTime();

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
  }, [config.hero.eventDate]);

  const formatTime = (value) => value.toString().padStart(2, "0");
  const formattedEventDate = new Date(config.hero.eventDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section
      id="home"
      className="z-0 relative w-full h-[900px] lg:h-[750px] xl:h-[800px] 2xl:h-[900px] 3xl:h-[1000px] bg-neutral-700 bg-cover bg-center bg-fixed overflow-hidden scroll-mt-24"
      style={{
        backgroundImage: `url(${config.hero.background})`,
        backgroundPosition: `center ${offsetY * -0.5}px`,
      }}
    >
      {/* Enhanced overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40 z-0"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Racing corner designs */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {/* Top corners */}
        <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-blue-400/30"></div>
        <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-blue-400/30"></div>
        {/* Bottom corners */}
        <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-purple-400/30"></div>
        <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-purple-400/30"></div>
        
        {/* Racing stripes */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>
      </div>
      <div className="container absolute z-10 inset-0 flex items-center text-center gap-4 text-white pt-20 xl:pt-24 2xl:pt-32">
        <div className="grid xl:grid-cols-[3fr_2fr] gap-12 xl:gap-24 2xl:gap-32 3xl:gap-40 w-full lg:grid-cols-[1fr_1fr]">
          <div className="grow font-bold flex flex-col gap-4">
            <div className="flex justify-center lg:justify-start mb-8 xl:mb-12 2xl:mb-16">
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 xs:gap-6 xl:gap-8 2xl:gap-12 3xl:gap-16">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Minutes' },
                  { value: timeLeft.seconds, label: 'Seconds' }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-4 xs:p-6 xl:p-8 2xl:p-10 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 min-w-[80px] xs:min-w-[100px] xl:min-w-[120px] 2xl:min-w-[140px] group"
                      style={{ boxShadow: `0 8px 32px ${config.primaryColor}20` }}
                    >
                      {/* Racing corner designs */}
                      <div className="absolute inset-0 pointer-events-none rounded-2xl">
                        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-blue-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-blue-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-purple-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-purple-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      
                      <div className="text-3xl xs:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white mb-2 text-center">
                        {formatTime(item.value)}
                      </div>
                      <div 
                        className="text-xs xs:text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider text-center"
                        style={{ color: config.primaryColor }}
                      >
                        {item.label}
                      </div>
                      {/* Glow effect */}
                      <div 
                        className="absolute inset-0 rounded-2xl opacity-20 blur-xl"
                        style={{ background: config.primaryColor }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <h1 className="xs:text-5xl text-4xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-semibold text-start uppercase leading-tight">{config.hero.eventName}</h1>

            <h1 className="xs:text-4xl text-3xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl font-medium text-start uppercase leading-tight">{config.hero.eventLocation}</h1>

            <p className="font-medium text-start uppercase text-lg xl:text-xl 2xl:text-2xl">{formattedEventDate}</p>
            <LinkButton href={config.currentEventId ? `/event/${config.currentEventId}` : (config.hero.eventInfo || '#')}>Event Info</LinkButton>
          </div>
          <div className="shrink-0 flex flex-col justify-end grow gap-3 xl:gap-4 2xl:gap-5">
            {config.hero.buttons.map((button, index) => (
              <IconLinkButton key={index} href={button.url}>
                <HiChevronRight />
                {button.label}
              </IconLinkButton>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
