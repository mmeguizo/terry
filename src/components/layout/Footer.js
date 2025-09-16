"use client";

import { useConfig } from "@/context/ConfigContext";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import * as FaIcons from "react-icons/fa";

const Footer = () => {
  const config = useConfig();
  
  return (
    <footer style={{ backgroundColor: config.footer.backgroundColor }} className="relative">
      {/* Main Footer Content */}
      <div className="container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Logo and Brand Section */}
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
            <Link href="/" className="group transition-all duration-300 hover:scale-105">
              <div className="mb-4">
                <Image 
                  src={config.logoImage} 
                  alt={config.siteTitle} 
                  width={200} 
                  height={200} 
                  className="w-auto h-20 lg:h-24"
                />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                {config.siteTitle}
              </h1>
            </Link>
            <p className="text-white/70 text-sm mt-3 text-center lg:text-left leading-relaxed">
              Premier motorsport racing event featuring the world's top drivers and teams.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col items-center lg:items-start">
            <h2 className="text-white text-lg font-bold mb-4 relative">
              Quick Links
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-blue-400"></div>
            </h2>
            <nav className="flex flex-col gap-2">
              {config.menu.map((item, index) => (
                <Link 
                  key={index} 
                  href={item.url} 
                  className="text-white/80 hover:text-white hover:text-blue-300 transition-all duration-200 py-1 px-2 rounded hover:bg-white/5 w-fit"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Event Information Section */}
          <div className="flex flex-col items-center lg:items-start">
            <h2 className="text-white text-lg font-bold mb-4 relative">
              Event Info
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-blue-400"></div>
            </h2>
            <div className="flex flex-col gap-2">
              {config.eventDocuments.slice(0, 4).map((doc, index) => (
                <Link 
                  key={index} 
                  href={doc.url} 
                  className="text-white/80 hover:text-white hover:text-blue-300 transition-all duration-200 py-1 px-2 rounded hover:bg-white/5 w-fit text-sm"
                >
                  {doc.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Media and Contact Section */}
          <div className="flex flex-col items-center lg:items-start">
            <h2 className="text-white text-lg font-bold mb-4 relative">
              Connect With Us
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-blue-400"></div>
            </h2>
            
            {/* Social Media Icons */}
            <div className="flex gap-3 mb-6">
              {config.socials.map((social, index) => {
                const IconComponent = FaIcons[`Fa${social.platform.charAt(0) + social.platform.slice(1)}`];
                return (
                  <Link 
                    key={index} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group bg-white/10 hover:bg-blue-500 text-white/80 hover:text-white rounded-full p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label={`Follow us on ${social.platform}`}
                  >
                    {IconComponent ? <IconComponent size={20} /> : null}
                  </Link>
                );
              })}
            </div>

            {/* Contact Information */}
            <div className="text-center lg:text-left">
              <div className="text-white/70 text-sm space-y-1">
                <p className="flex items-center justify-center lg:justify-start gap-2">
                  <FaIcons.FaEnvelope className="text-blue-400" />
                  info@wakefield300.com.au
                </p>
                <p className="flex items-center justify-center lg:justify-start gap-2">
                  <FaIcons.FaPhone className="text-blue-400" />
                  +61 (0) 123 456 789
                </p>
                <p className="flex items-center justify-center lg:justify-start gap-2">
                  <FaIcons.FaMapMarkerAlt className="text-blue-400" />
                  Wakefield Park, NSW
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/60 text-sm text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} {config.siteTitle}. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <Link href="/privacy" className="text-white/60 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/60 hover:text-white transition-colors duration-200">
                Terms & Conditions
              </Link>
              <Link href="/contact" className="text-white/60 hover:text-white transition-colors duration-200">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
    </footer>
  );
};

export default Footer;
