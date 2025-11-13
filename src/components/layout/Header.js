"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LinkButton } from "@/components/ui/Links";
import { useConfig } from "@/context/ConfigContext";
import { HiBars3, HiXMark, HiChevronRight } from "react-icons/hi2";
import { CgMenuGridR } from "react-icons/cg";

const Header = () => {
  const config = useConfig();
  const pathname = usePathname();
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
    <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${
      scrolled ? 'shadow-2xl' : 'shadow-xl'
    }`}>
      {/* Modern dark background */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: scrolled
            ? config.menuBackground || '#ffffff'
            : `linear-gradient(180deg,
                rgba(10, 10, 15, 0.98) 0%,
                rgba(15, 15, 20, 0.95) 100%)`,
          backdropFilter: 'blur(20px) saturate(180%)',
        }}
      />

      {/* Sleek top accent */}
      <div
        className="absolute top-0 left-0 w-full h-[2px] transition-all duration-500"
        style={{
          background: `linear-gradient(90deg,
            transparent 0%,
            ${config.primaryColor || '#ef4444'}40 20%,
            ${config.primaryColor || '#ef4444'} 50%,
            ${config.primaryColor || '#ef4444'}40 80%,
            transparent 100%)`,
          boxShadow: `0 0 15px ${config.primaryColor || '#ef4444'}60`,
        }}
      />

      {/* Modern bottom border */}
      <div
        className="absolute bottom-0 left-0 w-full h-[1px] transition-all duration-500"
        style={{
          background: scrolled
            ? `${config.primaryColor || '#ef4444'}20`
            : `linear-gradient(90deg,
                transparent 0%,
                ${config.primaryColor || '#ef4444'}60 50%,
                transparent 100%)`,
          boxShadow: scrolled
            ? 'none'
            : `0 1px 10px ${config.primaryColor || '#ef4444'}30`,
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${config.primaryColor || '#ef4444'} 1px, transparent 1px),
                           linear-gradient(90deg, ${config.primaryColor || '#ef4444'} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      
      <div className="flex items-center w-full px-4 sm:px-6 lg:px-8 xl:px-16 relative z-10 h-20">
        <div className="logo-container relative flex-shrink-0 max-w-[160px] lg:max-w-[200px]">
          <Link href="/" className="flex items-center group">
            {config.logoImage && config.logoImage.trim() !== '' ? (
              <div className="h-12 lg:h-14 w-auto flex items-center relative">
                <Image
                  src={config.logoImage}
                  alt="Logo"
                  width={200}
                  height={56}
                  priority
                  className="object-contain w-auto h-full transition-all duration-300 group-hover:scale-[1.02]"
                  style={{
                    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4)) brightness(1.05)',
                  }}
                />
              </div>
            ) : (
              <div className="h-12 lg:h-14 flex items-center justify-center bg-gray-900/50 rounded px-4 border"
                style={{ borderColor: `${config.primaryColor || '#ef4444'}40` }}>
                <span className="text-white font-bold text-sm">LOGO</span>
              </div>
            )}
          </Link>
        </div>
        <div className="relative flex gap-4 lg:gap-6 flex-grow justify-end items-center ml-8">
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10" role="navigation" aria-label="Primary">
            {config.menu.map((item, index) => {
              const isActive = item.url.startsWith('#') && activeSection && (`#${activeSection}` === item.url);
              const isCurrentPage = !item.url.startsWith('#') && pathname === item.url;
              const active = isActive || isCurrentPage;

              return (
                <Link
                  className="relative px-1 py-2 whitespace-nowrap uppercase font-semibold tracking-wider transition-all duration-300 text-[13px] group"
                  key={index}
                  href={item.url}
                  onClick={(e) => handleSmoothAnchorClick(e, item.url)}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    color: active
                      ? '#ffffff'
                      : scrolled
                      ? config.textColor || '#374151'
                      : 'rgba(255, 255, 255, 0.75)',
                    fontWeight: active ? '700' : '600',
                    letterSpacing: '0.08em',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = scrolled 
                        ? (config.primaryColor || '#ef4444')
                        : '#ffffff';
                      // Add glow to underline on hover
                      const underline = e.currentTarget.querySelector('span[style*="backgroundColor"]');
                      if (underline) {
                        underline.style.boxShadow = `0 0 8px ${config.primaryColor || '#ef4444'}60`;
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = scrolled
                        ? config.textColor || '#374151'
                        : 'rgba(255, 255, 255, 0.75)';
                      // Remove glow from underline
                      const underline = e.currentTarget.querySelector('span[style*="backgroundColor"]');
                      if (underline && !active) {
                        underline.style.boxShadow = 'none';
                      }
                    }
                  }}
                >
                  {/* Modern underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ease-out ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    style={{
                      backgroundColor: config.primaryColor || '#ef4444',
                      boxShadow: active 
                        ? `0 0 8px ${config.primaryColor || '#ef4444'}60` 
                        : 'none',
                    }}
                  />

                  {/* Hover glow - always present but only visible on hover */}
                  <span
                    className="absolute inset-0 -z-10 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at center, ${config.primaryColor || '#ef4444'}15 0%, transparent 70%)`,
                    }}
                  />

                  {item.label}
                </Link>
              );
            })}
          </nav>
          {Array.isArray(config.actions) && config.actions.length > 0 && (
            <div className="flex items-center gap-3">
              {config.actions.map((action, i) => (
                <LinkButton key={i} href={action.url} newTab={action.newTab}>
                  {action.label}
                </LinkButton>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md transition-all duration-300 hover:bg-white/5 flex items-center justify-center border border-white/10"
                aria-label="Toggle mobile menu"
                style={{
                  color: scrolled ? config.textColor || '#374151' : 'rgba(255, 255, 255, 0.9)',
                }}
              >
                <HiBars3 className="w-6 h-6" />
              </button>
            </div>

            <button
              onClick={toggleWebsitesMenu}
              className="px-6 py-2 flex items-center justify-center gap-2 rounded-md transition-all duration-300 text-white hover:brightness-110 uppercase font-bold tracking-wider text-[13px] whitespace-nowrap relative overflow-hidden group"
              style={{
                background: `linear-gradient(135deg, ${config.primaryColor || '#ef4444'} 0%, ${config.primaryColor || '#dc2626'} 100%)`,
                boxShadow: `0 4px 14px ${config.primaryColor || '#ef4444'}40`,
                letterSpacing: '0.08em',
              }}
              aria-label="Open websites panel"
            >
              {/* Shine effect on hover */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
                  transform: 'translateX(-100%)',
                  animation: 'shine 2s infinite',
                }}
              />
              <span className="md:block hidden relative z-10">Websites</span>
              <CgMenuGridR className="w-5 h-5 relative z-10" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={mobilePanelRef}
        className={`fixed inset-0 bg-white transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 9999 }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Menu"
      >
        <div className="flex flex-col h-screen w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {config.logoImage && config.logoImage.trim() !== '' ? (
                <Image
                  src={config.logoImage}
                  alt="Logo"
                  width={120}
                  height={40}
                  className="w-auto h-10 object-contain"
                />
              ) : (
                <div className="h-10 flex items-center justify-center bg-gray-200 rounded-lg px-3">
                  <span className="text-gray-600 font-bold text-xs">LOGO</span>
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold" style={{ color: config.textColor || '#1a1a1a' }}>
                  {config.siteTitle}
                </h2>
                <p
                  className="text-xs uppercase tracking-wide font-medium"
                  style={{ color: config.primaryColor || '#ef4444' }}
                >
                  {config.tagline || 'Racing Event'}
                </p>
              </div>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
              aria-label="Close mobile menu"
              style={{ color: config.textColor || '#374151' }}
            >
              <HiXMark className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation menu */}
          <nav className="flex-1 px-6 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {(() => {
                const menuItems =
                  config.menu && config.menu.length > 0
                    ? config.menu
                    : [
                        { label: 'Home', url: '/' },
                        { label: 'Dashboard', url: '/dashboard' },
                        { label: 'Events', url: '/events' },
                        { label: 'Event Info', url: '/event-info' },
                        { label: 'News', url: '/#news' },
                        { label: 'Documents', url: '/#documents' },
                      ];
                console.log('Mobile menu rendering items:', menuItems);
                return menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.url}
                      onClick={(e) => {
                        handleSmoothAnchorClick(e, item.url);
                        closeMobileMenu();
                      }}
                      className="group block py-3 px-4 rounded-lg uppercase font-semibold text-sm transition-all duration-200 hover:bg-gray-50"
                      style={{
                        color: config.textColor || '#374151',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        <HiChevronRight
                          className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                          style={{ color: config.primaryColor || '#ef4444' }}
                        />
                      </div>
                    </Link>
                  </li>
                ));
              })()}
            </ul>
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              © {new Date().getFullYear()} {config.siteTitle}
            </p>
          </div>
        </div>
      </div>

      <div
        ref={websitesPanelRef}
        className={`fixed inset-0 bg-white transform transition-transform duration-300 ${
          isWebsitesMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 9999 }}
        role="dialog"
        aria-modal="true"
        aria-label="Websites Menu"
      >
        <div className="flex flex-col min-h-screen w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-wide" style={{ color: config.textColor || '#1a1a1a' }}>
                Websites
              </h2>
              <p className="text-sm" style={{ color: config.primaryColor || '#ef4444' }}>
                Racing Network
              </p>
            </div>
            <button
              onClick={closeWebsitesMenu}
              className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
              aria-label="Close websites menu"
              style={{ color: config.textColor || '#374151' }}
            >
              <HiXMark className="w-6 h-6" />
            </button>
          </div>

          {/* Websites grid */}
          <nav className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
              {console.log('Websites data:', config.websites) ||
              (config.websites && config.websites.length > 0 ? (
                config.websites.map((item, index) => (
                  <div key={index} className="group">
                    <div
                      className="relative overflow-hidden rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-lg cursor-pointer aspect-video bg-white p-4 flex items-center justify-center"
                      onClick={() => console.log('Clicked website:', item)}
                    >
                      {item.logo ? (
                        <Image
                          src={item.logo}
                          alt={item.label || 'Racing Network'}
                          width={300}
                          height={200}
                          className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
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

                      {/* Label overlay on hover */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="truncate">{item.label || item.url || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-500">No websites available</p>
                </div>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              © {new Date().getFullYear()} {config.siteTitle}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
