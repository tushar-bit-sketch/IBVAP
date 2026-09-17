"use client";

import React from 'react';
import Link from 'next/link';

export function FloatingNav() {
  const navItems = [
    { label: 'System', href: '#system' },
    { label: 'Perception', href: '#perception' },
    { label: 'ANPR / Vehicle', href: '#anpr' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Performance', href: '#performance' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-12 border-b border-neutral-900 bg-black/95 backdrop-blur-sm flex items-center justify-between px-6 md:px-10">
      {/* Left: IBVAP identifier */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-6 h-6 rounded-sm bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-200 group-hover:border-neutral-500 transition-colors duration-150">
          <span className="font-mono text-[10px] font-bold tracking-tighter">IB</span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold text-neutral-100 tracking-wider">IBVAP</span>
          <span className="text-[8px] font-mono text-neutral-500 hidden sm:block leading-none">SIH #26187</span>
        </div>
      </Link>

      {/* Center: Section links */}
      <nav className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-[11px] font-mono text-neutral-500 hover:text-neutral-200 transition-colors duration-150"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Right: Enter platform */}
      <Link
        href="/command-center"
        className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-neutral-100 text-neutral-950 font-mono text-[11px] font-semibold hover:bg-white transition-colors duration-150 active:scale-95"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Command center</span>
      </Link>
    </header>
  );
}

