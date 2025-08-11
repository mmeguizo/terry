"use client";

import { useConfig } from "@/context/ConfigContext";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import * as FaIcons from "react-icons/fa";

const Footer = () => {
  const config = useConfig();
  return (
    <footer style={{ backgroundColor: config.footer.backgroundColor }}>
      <div className="container py-24 flex-wrap gap-14 flex items-center">
        <Link href="/" className="flex flex-col gap-4 justify-center items-center grow">
          <div>
            <Image src={config.logoImage} alt={config.siteTitle} width={300} height={300} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white text-center">{config.siteTitle}</h1>
          </div>
        </Link>
        <div className="flex flex-col justify-center items-center gap-1 grow">
          <h2 className="text-white text-lg mb-2 font-semibold">Quick Links</h2>
          {config.menu.map((item, index) => (
            <Link className="text-white/80 hover:text-white w-fit" key={index} href={item.url}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col justify-center items-center gap-1 grow">
          <h2 className="text-white text-lg mb-2 font-semibold">Follow Us</h2>
          <div className="flex gap-4">
            {config.socials.map((social, index) => {
              const IconComponent = FaIcons[`Fa${social.platform.charAt(0) + social.platform.slice(1)}`];
              return (
                <Link key={index} href={social.url} target="_blank" className="text-white/80 hover:text-white">
                  {IconComponent ? <IconComponent size={24} /> : null}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
