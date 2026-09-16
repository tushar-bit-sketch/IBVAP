"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, ChevronRight, Activity, Terminal } from 'lucide-react';

interface FloatingNavProps {
  currentSection?: string;
}

export function FloatingNav({ currentSection = 'hero' }: FloatingNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'SYSTEM', href: '#system' },
    { label: 'PERCEPTION', href: '#perception' },
    { label: 'ANPR / VEHICLE', href: '#anpr' },
    { label: 'ARCHITECTURE', href: '#architecture' },
    { label: 'PERFORMANCE', href: '#performance' },
  ];

  return (
    <header className="fixed top-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none transition-all duration-300">
      <nav 
        className={`pointer-events-auto flex items-center justify-between transition-all duration-300 ${
          isScrolled 
            ? 'py-2 px-4 bg-obsidian-200/90 border border-neutral-800 shadow-2xl backdrop-blur-md rounded-full max-w-4xl w-full' 
            : 'py-3 px-6 bg-obsidian-300/60 border border-neutral-800/80 backdrop-blur-sm rounded-full max-w-5xl w-full'
        }`}
      >
        {/* Left: IBVAP Logo mark */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 group cursor-pointer"
          data-cursor="HOME"
        >
          <div className="w-7 h-7 rounded bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-200 group-hover:border-neutral-400 transition-colors">
            <span className="font-mono text-xs font-bold tracking-tighter">IB</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs tracking-tactical font-bold text-neutral-100">
              IBVAP
            </span>
            <span className="text-[8px] font-mono text-neutral-500 tracking-wider hidden sm:block">
              SIH #26187
            </span>
          </div>
        </Link>

        {/* Center: Editorial Links */}
        <div className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              data-cursor="EXPLORE"
              className="text-[11px] font-mono tracking-widest text-neutral-400 hover:text-white transition-colors relative py-1"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right: Enter Command Center Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/command-center"
            data-cursor="ENTER"
            className="group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-950 font-mono text-[11px] font-semibold tracking-wider hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all active:scale-95"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-tactical-green animate-pulse" />
            <span>COMMAND CENTER</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
