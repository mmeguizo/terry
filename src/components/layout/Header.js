"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { CgMenuGridR } from "react-icons/cg";

// Helper: decide if a URL is internal (use <Link>) or external (use <a>)
function isInternal(href = "") {
  return typeof href === "string" && href.startsWith("/") && !href.startsWith("//");
}

// Reusable link that keeps your classes/styles/handlers
function NavLink({ href, children, ...props }) {
  if (isInternal(href)) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  // External link: use <a> and keep target/rel if provided
  const rel =
    props.target === "_blank"
      ? props.rel || "noopener noreferrer"
      : props.rel;
  return (
    <a href={href} {...props} rel={rel}>
      {children}
    </a>
  );
}

const Header = () => {
  const config = useConfig();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWebsitesMenuOpen, setIsWebsitesMenuOpen] = useState(false);

  console.log(config);

  // Inject "Events" link safely (do not mutate config.menu)
  const menuItems = Array.isArray(config?.menu) ? [...config.menu] : [];
  const hasEvents = menuItems.some(
    (it) =>
      (it?.url && String(it.url).replace(/\/+$/, "") === "/events") ||
      String(it?.label || "").toLowerCase() === "events"
  );
  if (!hasEvents) {
    menuItems.push({ label: "Events", url: "/events" });
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleWebsitesMenu = () => setIsWebsitesMenuOpen(!isWebsitesMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const closeWebsitesMenu = () => setIsWebsitesMenuOpen(false);

  return (
    <header className="fixed w-full top-0 z-50 flex items-stretch">
      <div className="flex items-center w-full px-3 xs:px-8">
        <div
          className="logo-container relative z-50 h-full flex after:text-[var(--logoContainerBG)]"
          style={{ "--logoContainerBG": config.primaryColor }}
        >
          {/* render Image only when src is truthy to avoid empty-string src warnings */}
          {config?.logoImage ? (
            <Image
              src={config.logoImage}
              alt={config.siteTitle || "Logo"}
              width={360}
              height={120}
              priority
              className="w-auto h-full object-contain z-50 relative xs:mt-4 mt-[5px]"
            />
          ) : (
            <div className="w-[180px] h-8 bg-neutral-200/10 rounded" aria-hidden="true" />
          )}
        </div>

        <div className="relative h-full menu-container flex gap-4 flex-grow justify-end items-center pt-[5px] xs:ps-30 z-50">
          {/* Desktop menu */}
          <div className="hidden lg:flex gap-4 items-center">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                href={item.url}
                className="z-50 px-3 py-2 whitespace-nowrap uppercase font-bold relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[var(--primaryColor)] after:transition-all after:duration-300 hover:after:w-full"
                style={{ color: config.textColor, "--primaryColor": config.primaryColor }}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="z-50 p-2 rounded-md cursor-pointer transition-colors duration-300 hover:bg-black/10 text-white xs:text-[var(--txtColor)]"
              style={{ "--txtColor": config.textColor }}
              aria-label="Toggle mobile menu"
            >
              <HiBars3 className="size-8" />
            </button>
          </div>

          {/* Websites button */}
          <div className="flex items-center">
            <button
              type="button" // ensure no form submit
              onClick={toggleWebsitesMenu}
              aria-expanded={isWebsitesMenuOpen}
              aria-controls="websites-drawer"
              className="z-[60] p-2 flex items-center overflow-hidden relative rounded-md cursor-pointer duration-300 bg-[var(--bgColor)] text-white after:content-[''] after:inset-1 after:rounded-sm after:absolute after:bg-[var(--bgColor)] after:transition-all after:scale-90 after:duration-200  after:brightness-70 after:opacity-0 hover:after:opacity-100 hover:after:scale-100"
              style={{ "--bgColor": config.primaryColor }}
            >
              <p className="md:block hidden text-lg font-semibold uppercase mx-2 relative z-50">
                Websites
              </p>
              <CgMenuGridR className="size-8 relative z-50" />
            </button>
          </div>

          {/* Decorative SVGs unchanged, but make them ignore pointer events */}
          <svg
            className="pointer-events-none relative z-40 hidden xs:block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2500 97"
          >
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
          </svg>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-neutral-900/90 backdrop-blur-xl transform transition-transform duration-600 ease-in-out z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between ps-8 pe-6 py-6 border-b border-white/20">
            <h2 className="text-xl font-bold uppercase text-white">Menu</h2>
            <button
              onClick={closeMobileMenu}
              className="p-2 cursor-pointer rounded-md transition-colors duration-300 hover:bg-white/10 text-white"
              aria-label="Close mobile menu"
            >
              <HiXMark className="size-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    href={item.url}
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 rounded-md uppercase font-bold text-md transition-all duration-300 relative overflow-hidden group"
                    style={{ color: config.textColor }}
                  >
                    <span className="relative z-10 text-white">{item.label}</span>
                    <div
                      className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left opacity-40"
                      style={{ backgroundColor: config.primaryColor }}
                    />
                  </NavLink>
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

      {/* Websites drawer */}
      <div
        id="websites-drawer"
        className={`fixed top-0 right-0 h-full w-full bg-neutral-900/90 backdrop-blur-xl transform transition-transform duration-600 ease-in-out z-[70] ${
          isWebsitesMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between ps-8 pe-6 py-6 border-b border-white/20">
            <h2 className="text-xl font-bold uppercase text-white">Websites</h2>
            <button
              onClick={closeWebsitesMenu}
              className="p-2 cursor-pointer rounded-md transition-colors duration-300 hover:bg-white/10 text-white"
              aria-label="Close websites menu"
            >
              <HiXMark className="size-6" />
            </button>
          </div>

          <nav className="grow place-content-start grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 py-12 px-4 xs:px-6 sm:px-12 lg:px-24 overflow-auto [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:border-neutral-800 [&::-webkit-scrollbar-thumb]:bg-neutral-400 [&::-webkit-scrollbar-thumb]:rounded-full">
            {config.websites && config.websites.length > 0 ? (
              config.websites.map((item, index) => (
                <NavLink
                  key={index}
                  href={item.url}
                  target="_blank"
                  className="aspect-video bg-neutral-700 rounded-md border-2 border-transparent hover:border-neutral-500 hover:scale-105 transition-[border-color, scale] duration-400"
                >
                  <Image
                    src={item.logo}
                    alt={item.label}
                    width={300}
                    height={200}
                    className="w-full h-full object-contain"
                    unoptimized={true}
                  />
                </NavLink>
              ))
            ) : (
              <div className="col-span-full text-center text-white/70">
                <p>No websites available</p>
              </div>
            )}
          </nav>

          <div className="p-6 border-t border-white/20">
            <p className="text-sm opacity-70 text-white">
              © {new Date().getFullYear()} {config.siteTitle}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
