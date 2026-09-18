"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrandIdentity, SpideySenseLogo, Sih2026Logo } from './BrandIdentity';

export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'System', href: '#system' },
    { label: 'Perception', href: '#perception' },
    { label: 'ANPR / Vehicle', href: '#anpr' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Performance', href: '#performance' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 border-b border-sandal-200/90 bg-[#faf8f5]/95 backdrop-blur-md transition-all duration-300 flex items-center justify-between px-4 sm:px-6 md:px-10 ${
        scrolled ? 'h-14 shadow-xs' : 'h-16'
      }`}
    >
      {/* =================================================================== */}
      {/* LEFT: SPIDEY SENSE TEAM LOGO + PRODUCT IDENTITY (IBVAP)             */}
      {/* =================================================================== */}
      <div className="flex items-center">
        <BrandIdentity
          variant="landing-header"
          isScrolled={scrolled}
          linkHref="/"
        />
      </div>

      {/* =================================================================== */}
      {/* CENTER: PRIMARY SECTION NAVIGATION (Desktop)                        */}
      {/* =================================================================== */}
      <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-[11px] font-mono text-stone-600 hover:text-stone-950 font-medium transition-colors duration-150 relative py-1 hover:border-b-2 hover:border-sandal-500"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* =================================================================== */}
      {/* RIGHT: SMART INDIA HACKATHON 2026 + ENTER COMMAND CENTER           */}
      {/* =================================================================== */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* SIH 2026 Institutional Identifier */}
        <div
          className="flex items-center gap-2 px-2 py-1 rounded-md bg-white border border-sandal-200/90 shadow-2xs transition-all duration-300 hover:border-sandal-300"
          title="Smart India Hackathon 2026 — Ministry of Education / AICTE"
        >
          <Sih2026Logo
            height={scrolled ? 28 : 34}
            className="transition-all duration-300"
          />
        </div>

        {/* Vertical Hairline Divider */}
        <div className="h-5 w-[1px] bg-sandal-300/80 hidden sm:block" />

        {/* Enter Operational Command Center */}
        <Link
          href="/command-center"
          className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-md bg-stone-900 text-white font-mono text-[11px] font-semibold hover:bg-stone-800 transition-colors duration-150 active:scale-95 shadow-xs whitespace-nowrap"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="hidden sm:inline">Command center</span>
          <span className="sm:hidden">Mission</span>
        </Link>
      </div>
    </header>
  );
}
