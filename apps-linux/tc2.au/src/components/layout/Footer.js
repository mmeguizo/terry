"use client";

import { useConfig } from "@/context/ConfigContext";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import * as FaIcons from "react-icons/fa";

const Footer = () => {
  const config = useConfig();
  
  return (
    <footer style={{ backgroundColor: config.footer?.backgroundColor || config.menuBackground || '#1f2937' }} className="relative overflow-hidden">
      {/* Racing background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(to right, transparent, ${config.primaryColor || '#3b82f6'}, transparent)` }}></div>
        <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: `linear-gradient(to right, transparent, ${config.primaryColor || '#3b82f6'}, transparent)` }}></div>
        {/* Racing corner designs */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2" style={{ borderColor: config.primaryColor || '#3b82f6' }}></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2" style={{ borderColor: config.primaryColor || '#3b82f6' }}></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2" style={{ borderColor: config.primaryColor || '#3b82f6' }}></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2" style={{ borderColor: config.primaryColor || '#3b82f6' }}></div>
      </div>

      {/* Main Footer Content - Mobile Optimized */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Mobile-first layout */}
        <div className="max-w-7xl mx-auto">
          
          {/* Logo and Brand Section - Full width on mobile */}
          <div className="text-center mb-8 lg:mb-12">
            <Link href="/" className="inline-block group transition-all duration-300 hover:scale-105">
              <div className="mb-4">
                {config.logoImage && config.logoImage.trim() !== '' ? (
                  <Image 
                    src={config.logoImage} 
                    alt={config.siteTitle} 
                    width={200} 
                    height={200} 
                    className="w-auto h-16 sm:h-20 lg:h-24 mx-auto"
                  />
                ) : (
                  <div className="w-auto h-16 sm:h-20 lg:h-24 mx-auto flex items-center justify-center bg-white/10 rounded-lg px-6">
                    <span className="text-white/80 font-bold text-lg">LOGO</span>
                  </div>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:opacity-80 transition-opacity duration-300">
                {config.siteTitle}
              </h1>
            </Link>
            <p className="text-white/70 text-sm sm:text-base mt-3 max-w-md mx-auto leading-relaxed">
              Premier motorsport racing event featuring the world&apos;s top drivers and teams.
            </p>
          </div>

          {/* Mobile-optimized grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Quick Links Section */}
            <div className="text-center sm:text-left">
              <h2 className="text-white text-lg font-bold mb-4 relative inline-block">
                Quick Links
                <div className="absolute -bottom-1 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-12 h-0.5" style={{ backgroundColor: config.primaryColor || '#3b82f6' }}></div>
              </h2>
              <nav className="flex flex-col gap-2">
                {config.menu.map((item, index) => (
                  <Link 
                    key={index} 
                    href={item.url} 
                    className="text-white/80 hover:text-white transition-all duration-200 py-2 px-3 rounded-lg hover:bg-white/5 inline-block text-center sm:text-left"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Event Information Section */}
            <div className="text-center sm:text-left">
              <h2 className="text-white text-lg font-bold mb-4 relative inline-block">
                Event Info
                <div className="absolute -bottom-1 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-12 h-0.5" style={{ backgroundColor: config.primaryColor || '#3b82f6' }}></div>
              </h2>
              <div className="flex flex-col gap-2">
                {config.eventDocuments?.slice(0, 4).map((doc, index) => (
                  <Link 
                    key={index} 
                    href={doc.url} 
                    className="text-white/80 hover:text-white transition-all duration-200 py-2 px-3 rounded-lg hover:bg-white/5 text-sm inline-block text-center sm:text-left"
                  >
                    {doc.label}
                  </Link>
                )) || (
                  <p className="text-white/60 text-sm">Event documents coming soon</p>
                )}
              </div>
            </div>

            {/* Social Media and Contact Section */}
            <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
              <h2 className="text-white text-lg font-bold mb-4 relative inline-block">
                Connect With Us
                <div className="absolute -bottom-1 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-12 h-0.5" style={{ backgroundColor: config.primaryColor || '#3b82f6' }}></div>
              </h2>
              
              {/* Social Media Icons */}
              <div className="flex justify-center sm:justify-start gap-3 mb-6">
                {config.socials?.map((social, index) => {
                  const IconComponent = FaIcons[`Fa${social.platform.charAt(0) + social.platform.slice(1)}`];
                  return (
                    <div 
                      key={index} 
                      className="group bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-full p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer border border-white/10"
                      style={{
                        '&:hover': {
                          backgroundColor: config.primaryColor || '#3b82f6',
                          borderColor: config.primaryColor || '#3b82f6'
                        }
                      }}
                      aria-label={`Follow us on ${social.platform}`}
                    >
                      {IconComponent ? <IconComponent size={18} /> : null}
                    </div>
                  );
                }) || (
                  <div className="flex gap-3">
                    <div className="bg-white/10 rounded-full p-3 border border-white/10">
                      <FaIcons.FaFacebook size={18} className="text-white/60" />
                    </div>
                    <div className="bg-white/10 rounded-full p-3 border border-white/10">
                      <FaIcons.FaTwitter size={18} className="text-white/60" />
                    </div>
                    <div className="bg-white/10 rounded-full p-3 border border-white/10">
                      <FaIcons.FaInstagram size={18} className="text-white/60" />
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <p className="flex items-center justify-center sm:justify-start gap-2 text-white/70 text-sm">
                  <FaIcons.FaEnvelope style={{ color: config.primaryColor || '#3b82f6' }} />
                  info@{config.siteTitle?.toLowerCase().replace(/\s+/g, '') || 'racing'}.com.au
                </p>
                <p className="flex items-center justify-center sm:justify-start gap-2 text-white/70 text-sm">
                  <FaIcons.FaPhone style={{ color: config.primaryColor || '#3b82f6' }} />
                  +61 (0) 123 456 789
                </p>
                <p className="flex items-center justify-center sm:justify-start gap-2 text-white/70 text-sm">
                  <FaIcons.FaMapMarkerAlt style={{ color: config.primaryColor || '#3b82f6' }} />
                  {config.hero?.eventLocation || 'Racing Venue'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Mobile Optimized */}
      <div className="border-t border-white/10 relative z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-white/60 text-xs sm:text-sm text-center sm:text-left">
                <p>&copy; {new Date().getFullYear()} {config.siteTitle}. All rights reserved.</p>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-xs sm:text-sm">
                <Link href="/privacy" className="text-white/60 hover:text-white transition-colors duration-200 hover:underline">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-white/60 hover:text-white transition-colors duration-200 hover:underline">
                  Terms & Conditions
                </Link>
                <Link href="/contact" className="text-white/60 hover:text-white transition-colors duration-200 hover:underline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${config.primaryColor || '#3b82f6'}, transparent)` }}></div>
    </footer>
  );
};

export default Footer;
