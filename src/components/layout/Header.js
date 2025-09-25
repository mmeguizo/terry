"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LinkButton } from "@/components/ui/Links";
import { useConfig } from "@/context/ConfigContext";
import { HiBars3, HiXMark } from "react-icons/hi2";
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
        ? 'bg-neutral-900/95 backdrop-blur-xl shadow-2xl border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      {/* Racing-themed scroll indicator */}
      <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent transition-all duration-500 ${
        scrolled ? 'opacity-100' : 'opacity-0'
      }`}></div>
      <div className="flex items-center w-full px-3 xs:px-8 xl:px-16 2xl:px-24 3xl:px-32 relative z-40">
        <div className="logo-container relative z-50 h-full flex after:text-[var(--logoContainerBG)]" style={{ "--logoContainerBG": config.primaryColor }}>
          <Link href="/">
            <Image src={config.logoImage} alt="Logo" width={360} height={120} priority className="w-auto h-full object-contain z-50 relative xs:mt-4 mt-[5px] xl:scale-110 2xl:scale-125" />
          </Link>
        </div>
        <div className="relative h-full menu-container flex gap-4 xl:gap-6 2xl:gap-8 flex-grow justify-end items-center pt-[5px] xs:ps-30 z-50">
          <div className="hidden lg:flex gap-4 xl:gap-6 2xl:gap-8 items-center" role="navigation" aria-label="Primary">
            {config.menu.map((item, index) => {
              const isActive = item.url.startsWith('#') && activeSection && (`#${activeSection}` === item.url);
              return (
                <Link
                  className={`z-50 px-3 py-2 xl:px-4 xl:py-3 2xl:px-5 2xl:py-4 whitespace-nowrap uppercase font-bold relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[var(--primaryColor)] after:transition-all after:duration-300 hover:after:w-full text-sm xl:text-base 2xl:text-lg transition-all duration-300 ${
                    scrolled 
                      ? 'text-white hover:text-white/90' 
                      : ''
                  }`}
                  key={index}
                  href={item.url}
                  onClick={(e) => handleSmoothAnchorClick(e, item.url)}
                  aria-current={isActive ? 'page' : undefined}
                  style={{ 
                    color: scrolled ? 'white' : config.textColor, 
                    "--primaryColor": config.primaryColor 
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
                className={`z-50 p-2 rounded-md cursor-pointer transition-all duration-300 hover:bg-black/10 ${
                  scrolled ? 'text-white' : 'text-white xs:text-[var(--txtColor)]'
                }`} 
                style={{ "--txtColor": scrolled ? 'white' : config.textColor }} 
                aria-label="Toggle mobile menu"
              >
                <HiBars3 className="size-8" />
              </button>
            </div>

            <button
              onClick={toggleWebsitesMenu}
              className="z-50 px-3 py-2.5 xl:px-4 xl:py-3 2xl:px-5 2xl:py-3.5 flex items-center justify-center gap-2 xl:gap-2.5 2xl:gap-3 overflow-hidden relative rounded-lg cursor-pointer duration-300 bg-[var(--bgColor)] text-white transition-all hover:scale-105 shadow-lg ml-2 xl:ml-3 2xl:ml-4"
              style={{ "--bgColor": config.primaryColor }}
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

      <div ref={mobilePanelRef} className={`fixed top-0 right-0 h-full w-full bg-neutral-900/90 backdrop-blur-xl transform transition-transform duration-600 ease-in-out z-50 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`} role="dialog" aria-modal="true" aria-label="Mobile Menu">
        <div className="flex flex-col h-full" onClick={(e) => { if (e.target === e.currentTarget) closeMobileMenu(); }}>
          <div className="flex items-center justify-between ps-8 pe-6 py-6 border-b border-white/20">
            <h2 className="text-xl font-bold uppercase text-white">Menu</h2>
            <button onClick={closeMobileMenu} className="p-2 cursor-pointer rounded-md transition-colors duration-300 hover:bg-white/10 text-white" aria-label="Close mobile menu">
              <HiXMark className="size-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {config.menu.map((item, index) => (
                <li key={index}>
                  <Link href={item.url} onClick={(e) => { handleSmoothAnchorClick(e, item.url); closeMobileMenu(); }} className="block py-3 px-4 rounded-md uppercase font-bold text-md transition-all duration-300 relative overflow-hidden group" style={{ color: config.textColor }}>
                    <span className="relative z-10 text-white">{item.label}</span>
                    <div className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left opacity-40" style={{ backgroundColor: config.primaryColor }} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-6 border-t border-white/20">
            <p className="text-sm opacity-70 text-white">
              © {new Date().getFullYear()} {config.siteTitle}
            </p>
          </div>
        </div>
      </div>

       <div ref={websitesPanelRef} className={`fixed top-0 right-0 h-full w-full bg-gradient-to-br from-neutral-900/95 via-neutral-800/90 to-black/95 backdrop-blur-2xl transform transition-transform duration-600 ease-in-out z-50 ${isWebsitesMenuOpen ? "translate-x-0" : "translate-x-full"}`} role="dialog" aria-modal="true" aria-label="Websites Menu">
         {/* Racing-themed background effects */}
         <div className="absolute inset-0 pointer-events-none overflow-hidden">
           {/* Grid pattern overlay */}
           <div className="absolute inset-0 opacity-5">
             <div className="w-full h-full" style={{
               backgroundImage: `
                 linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
               `,
               backgroundSize: '50px 50px'
             }}></div>
           </div>
           
           {/* Animated racing stripes */}
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-pulse"></div>
           <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-500/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
           
           {/* Corner accents */}
           <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-blue-400/40"></div>
           <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-blue-400/40"></div>
           <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-red-400/40"></div>
           <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-red-400/40"></div>
         </div>

         <div className="flex flex-col h-full relative z-10" onClick={(e) => { if (e.target === e.currentTarget) closeWebsitesMenu(); }}>
           {/* Enhanced header */}
           <div className="relative flex items-center justify-between ps-8 pe-6 py-6 border-b border-gradient-to-r from-blue-500/20 via-white/20 to-red-500/20">
             <div className="flex items-center gap-4">
               <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-red-400 rounded-full"></div>
               <div>
                 <h2 className="text-2xl font-bold uppercase text-white tracking-wider">Racing Network</h2>
                 <p className="text-sm text-blue-400/80 font-mono">MOTORSPORTS ECOSYSTEM</p>
               </div>
             </div>
             <button onClick={closeWebsitesMenu} className="p-3 cursor-pointer rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-110 text-white border border-white/20 hover:border-white/40" aria-label="Close websites menu">
               <HiXMark className="size-5" />
             </button>
           </div>

          {/* Racing-themed navigation grid */}
          <nav className="flex-1 p-8 overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-neutral-800/50 [&::-webkit-scrollbar-thumb]:bg-blue-500/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-blue-400/70">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 max-w-7xl mx-auto">
              {config.websites && config.websites.length > 0 ? (
                config.websites.map((item, index) => (
                  <div
                    key={index}
                    className="group relative"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Link 
                      href={item.url} 
                      target="_blank" 
                      className="block relative overflow-hidden rounded-xl bg-gradient-to-br from-neutral-800/80 via-neutral-700/60 to-neutral-800/80 backdrop-blur-sm border border-neutral-600/30 hover:border-blue-400/50 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 aspect-video"
                    >
                      {/* Racing-themed background effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Corner racing stripes */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400/0 via-blue-400/60 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-400/0 via-red-400/60 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Logo container */}
                      <div className="relative z-10 p-4 h-full flex items-center justify-center">
                        <Image 
                          src={item.logo} 
                          alt={item.label} 
                          width={300} 
                          height={200} 
                          className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 filter drop-shadow-lg" 
                          unoptimized={true}
                        />
                      </div>
                      
                      {/* Hover overlay with racing theme */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Racing-style corner indicators */}
                      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-blue-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-blue-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-red-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-red-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Scanning line effect */}
                      <div className="absolute inset-0 overflow-hidden rounded-xl">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="inline-flex items-center gap-3 text-white/70">
                    <div className="w-2 h-2 bg-blue-400/60 rounded-full animate-pulse"></div>
                    <p className="text-lg font-mono uppercase tracking-wider">No Racing Networks Available</p>
                    <div className="w-2 h-2 bg-red-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Enhanced footer */}
          <div className="relative p-6 border-t border-gradient-to-r from-blue-500/20 via-white/20 to-red-500/20 bg-gradient-to-r from-neutral-900/50 via-neutral-800/30 to-neutral-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-white/80 font-mono">
                  RACING NETWORK ACTIVE
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span>© {new Date().getFullYear()}</span>
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
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
