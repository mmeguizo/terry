"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LinkButton } from "@/components/ui/Links";
import { useConfig } from "@/context/ConfigContext";
import { HiBars3, HiXMark, HiChevronRight } from "react-icons/hi2";
import { CgMenuGridR } from "react-icons/cg";

const Header = () => {
  const config = useConfig();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWebsitesMenuOpen, setIsWebsitesMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const websitesPanelRef = useRef(null);
  const mobilePanelRef = useRef(null);

  const handleSmoothAnchorClick = (event, href) => {
    if (typeof href !== 'string') return;
    if (!href.startsWith('#')) return;
    event.preventDefault();
    const targetId = href.slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      try { history.pushState(null, '', href); } catch {}
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const toggleWebsitesMenu = () => {
    console.log('Toggling websites menu, current state:', isWebsitesMenuOpen);
    setIsWebsitesMenuOpen(!isWebsitesMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  const closeWebsitesMenu = () => {
    setIsWebsitesMenuOpen(false);
  };

  // Scroll detection for header animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 100);
    };

    // Check initial scroll position
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section highlighting
  useEffect(() => {
    const sectionIds = ["home", "documents", "news", "sponsors"]; // known anchors
    const elements = sectionIds
      .map((id) => {
        const el = document.getElementById(id);
        return el ? { id, el } : null;
      })
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id) setActiveSection(id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    elements.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close menus with Escape; focus management
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (isWebsitesMenuOpen) setIsWebsitesMenuOpen(false);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
      if (e.key === "Tab") {
        const panel = isWebsitesMenuOpen ? websitesPanelRef.current : isMobileMenuOpen ? mobilePanelRef.current : null;
        if (!panel) return;
        const focusables = panel.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isWebsitesMenuOpen, isMobileMenuOpen]);

  return (
    <header className={`fixed w-full top-0 z-50 flex items-stretch transition-all duration-500 ease-in-out ${
      scrolled 
        ? 'smart-bg-secondary backdrop-blur-xl shadow-2xl border-b border-gray-200/50' 
        : 'bg-black/20 backdrop-blur-sm'
    }`} style={{
      backgroundColor: scrolled ? config.menuBackground || 'rgba(255,255,255,0.95)' : undefined
    }}>
      {/* Dynamic scroll indicator */}
      <div 
        className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-500 ${
          scrolled ? 'opacity-100' : 'opacity-60'
        }`}
        style={{
          background: `linear-gradient(to right, transparent, ${config.primaryColor || '#3b82f6'}, transparent)`
        }}
      ></div>
      <div className="flex items-center w-full px-3 xs:px-8 xl:px-16 2xl:px-24 3xl:px-32 relative z-40">
        <div className="logo-container relative z-50 h-full flex items-center">
          <Link href="/" className="relative z-50 flex items-center gap-3">
            {config.logoImage && config.logoImage.trim() !== '' ? (
              <Image 
                src={config.logoImage} 
                alt="Logo" 
                width={300} 
                height={100} 
                priority 
                className="w-auto h-16 sm:h-12 xl:h-14 2xl:h-16 object-contain transition-all duration-300" 
              />
            ) : (
              <div className="w-auto h-16 sm:h-12 xl:h-14 2xl:h-16 flex items-center justify-center bg-gray-200 rounded-lg px-4">
                <span className="text-gray-600 font-bold text-sm">LOGO</span>
              </div>
            )}
            {/* Mobile title text */}
            <div className="flex flex-col lg:hidden">
              <h1 className="text-lg font-bold smart-text-primary leading-tight" style={{ color: config.textColor || 'var(--text-primary)' }}>{config.siteTitle}</h1>
              <p className="text-xs smart-text-secondary font-medium uppercase tracking-wide" style={{ color: config.textColor ? `${config.textColor}80` : 'var(--text-secondary)' }}>{config.tagline || 'Racing Event'}</p>
            </div>
          </Link>
        </div>
        <div className="relative h-full menu-container flex gap-4 xl:gap-6 2xl:gap-8 flex-grow justify-end items-center pt-[5px] xs:ps-30 z-50">
          <div className="hidden lg:flex gap-4 xl:gap-6 2xl:gap-8 items-center" role="navigation" aria-label="Primary">
            {config.menu.map((item, index) => {
              const isActive = item.url.startsWith('#') && activeSection && (`#${activeSection}` === item.url);
              return (
                <Link
                  className={`z-50 px-3 py-2 xl:px-4 xl:py-3 2xl:px-5 2xl:py-4 whitespace-nowrap uppercase font-bold relative rounded-lg transition-all duration-300 text-sm xl:text-base 2xl:text-lg backdrop-blur-sm ${
                    isActive ? 'smart-bg-primary/10' : ''
                  }`}
                  key={index}
                  href={item.url}
                  onClick={(e) => handleSmoothAnchorClick(e, item.url)}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    color: config.textColor || '#1a1a1a',
                    backgroundColor: isActive ? `${config.primaryColor || 'var(--primary-color)'}20` : undefined
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = `${config.primaryColor || 'var(--primary-color)'}10`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            {Array.isArray(config.actions) && config.actions.length > 0 && (
              <div className="ms-4 xl:ms-6 2xl:ms-8 flex items-center gap-3 xl:gap-4 2xl:gap-5">
                {config.actions.map((action, i) => (
                  <LinkButton key={i} href={action.url} newTab={action.newTab}>
                    {action.label}
                  </LinkButton>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 xl:gap-3 2xl:gap-4 mr-4 xl:mr-6 2xl:mr-8">
            <div className="lg:hidden">
              <button 
                onClick={toggleMobileMenu} 
                className="z-50 p-3 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm smart-text-primary" 
                aria-label="Toggle mobile menu"
                style={{
                  color: config.textColor || 'var(--text-primary)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = `${config.primaryColor || 'var(--primary-color)'}10`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <HiBars3 className="size-8" />
              </button>
            </div>

            <button
              onClick={toggleWebsitesMenu}
              className="z-50 px-3 py-2.5 xl:px-4 xl:py-3 2xl:px-5 2xl:py-3.5 flex items-center justify-center gap-2 xl:gap-2.5 2xl:gap-3 overflow-hidden relative rounded-lg cursor-pointer duration-300 text-white transition-all hover:scale-105 shadow-lg ml-2 xl:ml-3 2xl:ml-4"
              style={{ 
                backgroundColor: config.primaryColor || '#3b82f6',
                boxShadow: `0 4px 15px ${config.primaryColor || '#3b82f6'}40`
              }}
              aria-label="Open websites panel"
            >
              <span className="md:block hidden text-sm xl:text-base 2xl:text-lg font-semibold uppercase relative z-50">Websites</span>
              <CgMenuGridR className="size-6 xl:size-7 2xl:size-8 relative z-50" />
            </button>
          </div>

          <svg className={`relative z-30 hidden xs:block pointer-events-none transition-opacity duration-500 ease-in-out ${
            scrolled ? 'opacity-20' : 'opacity-100'
          }`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2500 97">
            <defs>
              <linearGradient id="headerShineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="42%" stopColor="white" stopOpacity="0" />
                <stop offset="50%" stopColor="white" stopOpacity="0.95" />
                <stop offset="58%" stopColor="white" stopOpacity="0" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="headerShineGradientCore" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="48%" stopColor="white" stopOpacity="0" />
                <stop offset="49%" stopColor="white" stopOpacity="1" />
                <stop offset="51%" stopColor="white" stopOpacity="1" />
                <stop offset="52%" stopColor="white" stopOpacity="0" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <filter id="headerShineBlur" x="-20%" y="-200%" width="140%" height="500%" filterUnits="userSpaceOnUse">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
              </filter>
              <filter id="headerShineBlurLight" x="-20%" y="-200%" width="140%" height="500%" filterUnits="userSpaceOnUse">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
              </filter>
              <clipPath id="headerBandClip" clipPathUnits="userSpaceOnUse">
                <path
                  d="M 0.315 91 L -0.014 97 L 2391.63 97 C 2411.38 96.996 2430.32 89.143 2444.28 75.169 C 2444.28 75.169 2478.74 40.715 2495.96 23.49 C 2519.86 -0.404 2549.44 0 2549.44 0 C 2549.44 -0.293 2536.457 0 2531.59 0 C 2521.156 0 2501.577 8.305 2492.2 17.682 C 2472.473 37.409 2457.583 52.913 2440.37 70.126 C 2426.067 84.429 2406.699 91 2389.44 91 C 2379.532 91 2371.637 91 2371.637 91 L 0.315 91 Z"
                  transform="matrix(-1, 0, 0, -1, 2549.43994141, 96.999985)"
                />
              </clipPath>
            </defs>
            <path
              fill={config.menuBackground}
              d="M -379.355 -0.012 L -379.355 74.988 L 1949.14 74.988 C 1964.82 74.988 1995.639 70.748 2006.719 59.658 C 2006.719 59.658 2035.045 35.513 2048.725 21.843 C 2067.695 2.873 2069.382 -0.012 2069.382 -0.012 L -379.355 -0.012 Z"
              style={{ transformOrigin: "1062.52px 38.494px" }}
              transform="matrix(-1, 0, 0, -1, 0, 0)"
            />
            <path
              fill={config.primaryColor}
              fillOpacity="1"
              d="M 0.315 91 L -0.014 97 L 2391.63 97 C 2411.38 96.996 2430.32 89.143 2444.28 75.169 C 2444.28 75.169 2478.74 40.715 2495.96 23.49 C 2519.86 -0.404 2549.44 0 2549.44 0 C 2549.44 -0.293 2536.457 0 2531.59 0 C 2521.156 0 2501.577 8.305 2492.2 17.682 C 2472.473 37.409 2457.583 52.913 2440.37 70.126 C 2426.067 84.429 2406.699 91 2389.44 91 C 2379.532 91 2371.637 91 2371.637 91 L 0.315 91 Z"
              transform="matrix(-1, 0, 0, -1, 2549.43994141, 96.999985)"
            />
            <g style={{ mixBlendMode: 'screen', opacity: 0.95 }} clipPath="url(#headerBandClip)">
              <g transform="rotate(-8 1250 48)">
                <rect
                  x="-1200"
                  y="-220"
                  width="1600"
                  height="440"
                  fill="url(#headerShineGradient)"
                  filter="url(#headerShineBlur)"
                  className="header-shine"
                />
                <rect
                  x="-1200"
                  y="-220"
                  width="700"
                  height="440"
                  fill="url(#headerShineGradientCore)"
                  filter="url(#headerShineBlurLight)"
                  className="header-shine-core"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>

      <div ref={mobilePanelRef} className={`fixed inset-0 transform transition-transform duration-500 ease-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`} style={{ zIndex: 9999 }} role="dialog" aria-modal="true" aria-label="Mobile Menu">
        {/* Clean white background */}
        <div className="absolute inset-0 bg-white"></div>
        
        {/* Subtle racing pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(to right, transparent, ${config.primaryColor || '#ef4444'}, transparent)` }}></div>
          <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(to right, transparent, ${config.primaryColor || '#ef4444'}, transparent)` }}></div>
          {/* Racing corner accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2" style={{ borderColor: config.primaryColor || '#ef4444' }}></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2" style={{ borderColor: config.primaryColor || '#ef4444' }}></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2" style={{ borderColor: config.primaryColor || '#ef4444' }}></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2" style={{ borderColor: config.primaryColor || '#ef4444' }}></div>
        </div>
        
        <div className="flex flex-col h-screen w-full relative z-20" onClick={(e) => { if (e.target === e.currentTarget) closeMobileMenu(); }}>
          {/* Black header with logo and close */}
          <div className="flex items-center justify-between px-6 py-6 bg-black border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative">
                {config.logoImage && config.logoImage.trim() !== '' ? (
                  <Image 
                    src={config.logoImage} 
                    alt="Logo" 
                    width={120} 
                    height={40} 
                    className="w-auto h-12 object-contain drop-shadow-lg" 
                  />
                ) : (
                  <div className="w-auto h-12 flex items-center justify-center bg-gray-200 rounded-lg px-3">
                    <span className="text-gray-600 font-bold text-xs">LOGO</span>
                  </div>
                )}
                <div className="absolute -inset-1 rounded-lg opacity-20" style={{ background: `linear-gradient(45deg, ${config.primaryColor || '#ef4444'}, transparent)` }}></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white drop-shadow-lg">{config.siteTitle}</h2>
                <p className="text-sm text-gray-300 uppercase tracking-wider font-medium" style={{ color: config.primaryColor || '#ef4444' }}>{config.tagline || 'Racing Event'}</p>
              </div>
            </div>
            <button 
              onClick={closeMobileMenu} 
              className="relative p-3 rounded-xl transition-all duration-300 hover:bg-white/10 text-white hover:scale-110 group border border-white/20 hover:border-white/40" 
              aria-label="Close mobile menu"
            >
              <HiXMark className="size-6 relative z-10" />
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(45deg, ${config.primaryColor || '#ef4444'}20, transparent)` }}></div>
            </button>
          </div>


          {/* White background navigation menu */}
          <nav className="flex-1 px-6 py-8 overflow-y-auto min-h-0 bg-white">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 rounded-full" style={{ background: `linear-gradient(to bottom, ${config.primaryColor || '#ef4444'}, ${config.primaryColor ? `${config.primaryColor}80` : '#ef444480'})` }}></div>
                <h3 className="text-gray-900 text-2xl font-bold uppercase tracking-wider">Navigation</h3>
              </div>
            </div>
            <ul className="space-y-4">
              {(() => {
                const menuItems = config.menu && config.menu.length > 0 ? config.menu : [
                  { label: 'Home', url: '/' },
                  { label: 'Dashboard', url: '/dashboard' },
                  { label: 'Events', url: '/events' },
                  { label: 'Event Info', url: '/event-info' },
                  { label: 'News', url: '/#news' },
                  { label: 'Documents', url: '/#documents' }
                ];
                console.log('Mobile menu rendering items:', menuItems);
                return menuItems.map((item, index) => (
                <li key={index} className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]" style={{ animationDelay: `${index * 100}ms` }}>
                  <Link 
                    href={item.url} 
                    onClick={(e) => { handleSmoothAnchorClick(e, item.url); closeMobileMenu(); }} 
                    className="group relative block py-5 px-6 rounded-2xl uppercase font-bold text-lg transition-all duration-500 overflow-hidden backdrop-blur-sm border hover:scale-105 hover:-translate-y-1"
                    style={{
                      background: `linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%)`,
                      borderColor: `${config.primaryColor || '#ef4444'}40`,
                      boxShadow: `0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)`
                    }}
                  >
                    {/* Animated background */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                      style={{ background: `linear-gradient(135deg, ${config.primaryColor || '#ef4444'}20 0%, ${config.primaryColor || '#ef4444'}10 100%)` }}
                    ></div>
                    
                    {/* Racing corner indicators */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderColor: config.primaryColor || '#ef4444' }}></div>
                    <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderColor: config.primaryColor || '#ef4444' }}></div>
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderColor: `${config.primaryColor || '#ef4444'}80` }}></div>
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderColor: `${config.primaryColor || '#ef4444'}80` }}></div>
                    
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-gray-900 font-bold tracking-wider group-hover:text-gray-900 transition-all duration-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-125" style={{ backgroundColor: config.primaryColor || '#ef4444' }}></div>
                        <HiChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-900 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
                  </Link>
                </li>
                ));
              })()}
            </ul>
          </nav>
          
          {/* Clean footer section */}
          <div className="px-6 py-6 border-t border-gray-200 bg-white">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-0.5 rounded-full" style={{ background: `linear-gradient(to right, transparent, ${config.primaryColor || '#ef4444'})` }}></div>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: config.primaryColor || '#ef4444' }}></div>
                <div className="w-8 h-0.5 rounded-full" style={{ background: `linear-gradient(to left, transparent, ${config.primaryColor || '#ef4444'})` }}></div>
              </div>
              <p className="text-gray-700 text-sm font-medium">
                © {new Date().getFullYear()} {config.siteTitle}
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-wider">
                Motorsport Excellence
              </p>
            </div>
          </div>
        </div>
      </div>

       <div ref={websitesPanelRef} className={`fixed top-0 left-0 w-full h-full bg-white/95 backdrop-blur-xl transform transition-transform duration-600 ease-in-out ${isWebsitesMenuOpen ? "translate-x-0" : "translate-x-full"}`} style={{ zIndex: 9999, minHeight: '100vh', minWidth: '100vw' }} role="dialog" aria-modal="true" aria-label="Websites Menu">
         {/* Clean background pattern */}
         <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-3">
           <div 
             className="absolute top-0 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
             style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
           ></div>
           <div 
             className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500"
             style={{ backgroundColor: config.primaryColor ? `${config.primaryColor}60` : '#8b5cf660' }}
           ></div>
         </div>

         <div className="flex flex-col min-h-screen w-full relative z-10" onClick={(e) => { if (e.target === e.currentTarget) closeWebsitesMenu(); }}>
           {/* Clean header */}
           <div className="relative flex items-center justify-between ps-8 pe-6 py-6 border-b border-gray-200/50">
             <div className="flex items-center gap-4">
               <div 
                 className="w-1 h-8 rounded-full"
                 style={{ background: `linear-gradient(to bottom, ${config.primaryColor || '#3b82f6'}, ${config.primaryColor ? `${config.primaryColor}80` : '#3b82f680'})` }}
               ></div>
               <div>
                 <h2 className="text-2xl font-bold uppercase text-gray-800 tracking-wider">Racing Network</h2>
                 <p 
                   className="text-sm font-mono"
                   style={{ color: config.primaryColor || '#3b82f6' }}
                 >
                   MOTORSPORTS ECOSYSTEM
                 </p>
               </div>
             </div>
             <button onClick={closeWebsitesMenu} className="p-3 cursor-pointer rounded-lg transition-all duration-300 hover:bg-gray-100 hover:scale-110 text-gray-800 border border-gray-200/50 hover:border-gray-300" aria-label="Close websites menu">
               <HiXMark className="size-5" />
             </button>
           </div>

          {/* Clean navigation grid */}
          <nav className="flex-1 p-8 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 max-w-7xl mx-auto">
              {console.log('Websites data:', config.websites) || config.websites && config.websites.length > 0 ? (
                config.websites.map((item, index) => (
                  <div
                    key={index}
                    className="group relative"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div 
                      className="block relative overflow-hidden rounded-2xl backdrop-blur-sm border transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 aspect-video shadow-lg hover:shadow-2xl cursor-pointer"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                      }}
                      onClick={() => console.log('Clicked website:', item)}
                    >
                      {/* Clean background glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Logo container */}
                      <div className="relative z-10 p-4 h-full flex items-center justify-center">
                        {item.logo ? (
                          <Image 
                            src={item.logo} 
                            alt={item.label || 'Racing Network'} 
                            width={300} 
                            height={200} 
                            className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 filter drop-shadow-lg" 
                            unoptimized={true}
                            onError={(e) => {
                              console.error('Image failed to load:', item.logo);
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <div className="hidden text-center text-gray-600 font-semibold text-sm">
                          {item.label || 'Racing Network'}
                        </div>
                      </div>
                      
                      {/* Hover overlay with racing theme */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Clean corner indicators */}
                      <div 
                        className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ borderColor: `${config.primaryColor || '#3b82f6'}80` }}
                      ></div>
                      <div 
                        className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ borderColor: `${config.primaryColor || '#3b82f6'}80` }}
                      ></div>
                      <div 
                        className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ borderColor: `${config.primaryColor || '#3b82f6'}60` }}
                      ></div>
                      <div 
                        className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ borderColor: `${config.primaryColor || '#3b82f6'}60` }}
                      ></div>
                      
                      {/* Clean shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
                      
                      {/* Website title overlay for debugging */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="truncate">{item.label || item.url || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="inline-flex items-center gap-3 text-gray-500">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: `${config.primaryColor || '#3b82f6'}60` }}
                    ></div>
                    <p className="text-lg font-mono uppercase tracking-wider">No Racing Networks Available</p>
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: `${config.primaryColor || '#3b82f6'}60`,
                        animationDelay: '0.5s'
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Clean footer */}
          <div className="relative p-6 border-t border-gray-200/50 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                ></div>
                <p className="text-sm text-gray-600 font-mono">
                  RACING NETWORK ACTIVE
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>© {new Date().getFullYear()}</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="uppercase tracking-wider">{config.siteTitle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
