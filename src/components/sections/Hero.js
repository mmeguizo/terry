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
      className="z-0 relative w-full h-[900px] lg:h-[750px] bg-neutral-700 bg-cover bg-center bg-fixed after:z-0 after:content-[''] after:bg-black/70 after:inset-0 after:absolute"
      style={{
        backgroundImage: `url(${config.hero.background})`,
        backgroundPosition: `center ${offsetY * -0.5}px`,
      }}
    >
      <div className="container absolute z-10 inset-0 flex items-center text-center gap-4 text-white pt-20">
        <div className="grid xl:grid-cols-[2fr_1fr] gap-12 w-full lg:grid-cols-[1fr_1fr]">
          <div className="grow font-bold flex flex-col gap-4">
            <h1 className="xs:text-6xl text-5xl xs:gap-4 gap-1 flex font-normal text-white">
              <span className="flex shrink-0 flex-col gap-1">
                <span>{formatTime(timeLeft.days)}</span>
                <span
                  className="font-medium relative flex items-center gap-1.5 text-start text-sm uppercase after:content-[''] after:relative after:bg-[var(--primary-color)] after:h-[2px] after:w-[100%]"
                  style={{ color: config.primaryColor, "--primary-color": config.primaryColor }}
                >
                  Days
                </span>
              </span>
              <span>:</span>
              <span className="flex flex-col gap-1">
                <span>{formatTime(timeLeft.hours)}</span>
                <span
                  className="font-medium relative flex items-center gap-1.5 text-start text-sm uppercase after:content-[''] after:relative after:bg-[var(--primary-color)] after:h-[2px] after:w-[100%]"
                  style={{ color: config.primaryColor, "--primary-color": config.primaryColor }}
                >
                  Hrs
                </span>
              </span>
              <span>:</span>
              <span className="flex flex-col gap-1">
                <span>{formatTime(timeLeft.minutes)}</span>
                <span
                  className="font-medium relative flex items-center gap-1.5 text-start text-sm uppercase after:content-[''] after:relative after:bg-[var(--primary-color)] after:h-[2px] after:w-[100%]"
                  style={{ color: config.primaryColor, "--primary-color": config.primaryColor }}
                >
                  Mins
                </span>
              </span>
              <span>:</span>
              <span className="flex flex-col gap-1">
                <span>{formatTime(timeLeft.seconds)}</span>
                <span
                  className="font-medium relative flex items-center gap-1.5 text-start text-sm uppercase after:content-[''] after:relative after:bg-[var(--primary-color)] after:h-[2px] after:w-[100%]"
                  style={{ color: config.primaryColor, "--primary-color": config.primaryColor }}
                >
                  Secs
                </span>
              </span>
            </h1>
            <h1 className="xs:text-5xl text-4xl font-semibold text-start uppercase">{config.hero.eventName}</h1>

            <h1 className="xs:text-4xl text-3xl font-medium text-start uppercase">{config.hero.eventLocation}</h1>

            <p className="font-medium text-start uppercase">{formattedEventDate}</p>
            <LinkButton href={config.hero.eventInfo}>Event Info</LinkButton>
          </div>
          <div className="shrink-0 flex flex-col justify-end grow gap-3">
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
