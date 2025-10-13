"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useConfig } from '@/context/ConfigContext';
import { useState, useEffect } from 'react';

const MobileBottomNav = () => {
  const pathname = usePathname();
  const config = useConfig();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    {
      label: 'Home',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      href: '/',
    },
    {
      label: 'Events',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/events',
    },
    {
      label: 'News',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      href: '/#news',
    },
    {
      label: 'More',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      href: '#',
      isMenu: true,
    },
  ];

  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleMoreClick = (e) => {
    e.preventDefault();
    setShowMoreMenu(!showMoreMenu);
  };

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false; // Handle hash links separately
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Bottom Navigation - only visible on mobile */}
      <nav 
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          background: `linear-gradient(to top, ${config.menuBackground || '#ffffff'}f5 0%, ${config.menuBackground || '#ffffff'}e8 100%)`,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 -2px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={item.isMenu ? handleMoreClick : undefined}
                className="flex flex-col items-center justify-center flex-1 h-full transition-all duration-200"
                style={{
                  color: active ? config.primaryColor || '#3b82f6' : config.textColor || '#1a1a1a',
                }}
              >
                <div 
                  className="transition-transform duration-200"
                  style={{
                    transform: active ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {item.icon}
                </div>
                <span 
                  className="text-xs mt-1 font-semibold transition-opacity duration-200"
                  style={{
                    opacity: active ? 1 : 0.7,
                  }}
                >
                  {item.label}
                </span>
                
                {/* Active indicator dot */}
                {active && (
                  <div 
                    className="absolute bottom-1 w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: config.primaryColor || '#3b82f6',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Active tab indicator bar */}
        <div 
          className="absolute top-0 left-0 h-0.5 transition-all duration-300"
          style={{
            backgroundColor: config.primaryColor || '#3b82f6',
            width: '25%',
            transform: `translateX(${
              navItems.findIndex(item => isActive(item.href)) * 100
            }%)`,
          }}
        />
      </nav>

      {/* More Menu Modal */}
      {showMoreMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
            onClick={() => setShowMoreMenu(false)}
          />
          
          {/* Menu */}
          <div 
            className="fixed bottom-16 left-4 right-4 z-50 rounded-2xl shadow-2xl overflow-hidden md:hidden animate-slide-up-fade"
            style={{
              background: config.menuBackground || '#ffffff',
            }}
          >
            <div className="p-4">
              <h3 
                className="text-lg font-bold mb-4"
                style={{ color: config.textColor || '#1a1a1a' }}
              >
                More Options
              </h3>
              
              <div className="space-y-2">
                <Link
                  href="/events/calendar"
                  className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-black/5"
                  style={{ color: config.textColor || '#1a1a1a' }}
                  onClick={() => setShowMoreMenu(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Calendar</span>
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-black/5"
                  style={{ color: config.textColor || '#1a1a1a' }}
                  onClick={() => setShowMoreMenu(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Contact</span>
                </Link>

                <Link
                  href="/privacy"
                  className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-black/5"
                  style={{ color: config.textColor || '#1a1a1a' }}
                  onClick={() => setShowMoreMenu(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="font-medium">Privacy Policy</span>
                </Link>

                <Link
                  href="/terms"
                  className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-black/5"
                  style={{ color: config.textColor || '#1a1a1a' }}
                  onClick={() => setShowMoreMenu(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">Terms & Conditions</span>
                </Link>

                <div className="border-t pt-2 mt-2" style={{ borderColor: `${config.textColor || '#1a1a1a'}20` }}>
                  <button
                    onClick={() => setShowMoreMenu(false)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-semibold transition-colors duration-200"
                    style={{
                      backgroundColor: config.primaryColor || '#3b82f6',
                      color: '#ffffff',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add bottom padding to main content to prevent overlap */}
      <style jsx global>{`
        @media (max-width: 768px) {
          body {
            padding-bottom: 64px;
          }
        }
      `}</style>
    </>
  );
};

export default MobileBottomNav;

