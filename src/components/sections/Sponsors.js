"use client";

import { useConfig } from "@/context/ConfigContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import Image from "next/image";
import Link from "next/link";

const Sponsors = () => {
  const config = useConfig();

  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  };

  return (
    <section className="bg-neutral-100 py-18">
      <div className="w-full">
        <h1
          className="xs:text-4xl text-3xl font-semibold text-[var(--color-primary)] text-center mb-14 uppercase"
          style={{ "--color-primary": config.primaryColor }}
        >
          Sponsors | Partners
        </h1>
        <Swiper
          modules={[Autoplay]}
          loop={true}
          freeMode={true}
          speed={4000}
          grabCursor={true}
          slidesPerView={2}
          spaceBetween={20}
          breakpoints={{
            [breakpoints.sx]: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            [breakpoints.md]: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
            [breakpoints.lg]: {
              slidesPerView: 4,
              spaceBetween: 50,
            },
            [breakpoints.xl]: {
              slidesPerView: 5,
              spaceBetween: 60,
            },
            [breakpoints.xxl]: {
              slidesPerView: 6,
              spaceBetween: 80,
            },
          }}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
        >
          {[...config.sponsors, ...config.sponsors, ...config.sponsors].map((sponsor, index) => (
            <SwiperSlide key={index} className="hover:opacity-75 transition-opacity">
              <Link
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-video"
              >
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={200}
                  height={200}
                  className="mx-auto h-full w-full object-contain"
                />
              </Link>
              <div className="text-center mt-4">
                <p className="text-lg font-bold leading-none">{sponsor.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section >
  );
};

export default Sponsors;
