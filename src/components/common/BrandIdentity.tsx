"use client";

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  height?: number;
}

/**
 * Canonical SPIDEY SENSE Team Logo mark
 * Native aspect ratio preserved (approx 1:1)
 */
export function SpideySenseLogo({ className = '', size = 'md', height }: LogoProps) {
  // Height map for responsive standards
  const heightClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10 sm:h-12 sm:w-12',
    lg: 'h-12 w-12 sm:h-14 sm:w-14',
    xl: 'h-16 w-16 sm:h-20 sm:w-20',
  };

  const style = height ? { height: `${height}px`, width: `${height}px` } : undefined;

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center transition-transform duration-200 hover:scale-[1.015] ${
        height ? '' : heightClasses[size]
      } ${className}`}
      style={style}
    >
      <img
        src="/branding/spidey-sense-logo.jpg"
        alt="SPIDEY SENSE"
        className="w-full h-full object-contain mix-blend-multiply select-none"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

/**
 * Canonical Smart India Hackathon 2026 Event Identity mark
 * Native aspect ratio preserved (~2.18 : 1)
 */
export function Sih2026Logo({ className = '', size = 'md', height }: LogoProps) {
  // Height map for responsive standards
  const heightClasses = {
    xs: 'h-5 w-auto',
    sm: 'h-6 sm:h-7 w-auto',
    md: 'h-7 sm:h-8 w-auto',
    lg: 'h-8 sm:h-9 w-auto',
    xl: 'h-10 sm:h-12 w-auto',
  };

  const style = height ? { height: `${height}px`, width: 'auto' } : undefined;

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center transition-transform duration-200 hover:scale-[1.015] ${
        height ? '' : heightClasses[size]
      } ${className}`}
      style={style}
    >
      <img
        src="/branding/sih-2026-logo.jpg"
        alt="Smart India Hackathon 2026"
        className="h-full w-auto object-contain mix-blend-multiply select-none"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

interface BrandIdentityProps {
  variant?: 'landing-header' | 'command-bar' | 'hero' | 'login' | 'footer' | 'compact';
  linkHref?: string;
  className?: string;
  isScrolled?: boolean;
}

/**
 * Unified IBVAP + SPIDEY SENSE + SIH 2026 Identity System
 * Strictly enforces:
 *  1. PRODUCT FIRST (IBVAP)
 *  2. TEAM SECOND (SPIDEY SENSE)
 *  3. EVENT THIRD (SMART INDIA HACKATHON 2026)
 */
export function BrandIdentity({
  variant = 'landing-header',
  linkHref = '/',
  className = '',
  isScrolled = false,
}: BrandIdentityProps) {
  // 1. COMMAND TOP BAR VARIANT (Operational Restraint)
  if (variant === 'command-bar') {
    return (
      <Link
        href={linkHref}
        className={`flex items-center gap-2.5 group select-none transition-opacity duration-150 hover:opacity-95 ${className}`}
      >
        {/* Team Mark: Small, restrained */}
        <div className="p-0.5 rounded bg-white border border-sandal-200 shadow-2xs">
          <SpideySenseLogo size="sm" className="h-6 w-6" />
        </div>

        {/* Product Identity */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-mono text-xs tracking-tactical font-bold text-stone-950">
              IBVAP
            </span>
            <span className="text-[8px] font-mono font-semibold px-1 py-0.2 rounded bg-sandal-100 text-sandal-800 border border-sandal-200/80">
              SIH26187
            </span>
          </div>
          <span className="font-mono text-[8px] text-stone-500 hidden sm:inline leading-tight mt-0.5">
            SPIDEY SENSE
          </span>
        </div>
      </Link>
    );
  }

  // 2. LANDING HEADER LEFT BLOCK (Spidey Sense + IBVAP)
  if (variant === 'landing-header') {
    return (
      <Link
        href={linkHref}
        className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}
      >
        {/* SPIDEY SENSE primary mark */}
        <div className="p-0.5 sm:p-1 rounded-md bg-white border border-sandal-200/90 shadow-2xs transition-all duration-200 group-hover:border-sandal-400">
          <SpideySenseLogo
            height={isScrolled ? 36 : 44}
            className="transition-all duration-300"
          />
        </div>

        {/* Product & Team Typography */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs sm:text-sm font-bold text-stone-950 tracking-wider">
              IBVAP
            </span>
            <span className="text-[9px] font-mono text-sandal-700 bg-sandal-50 px-1.5 py-0.2 rounded border border-sandal-200/80 font-semibold hidden xs:inline">
              SIH #26187
            </span>
          </div>
          <span className="text-[9px] font-mono text-stone-500 leading-tight">
            by <strong className="text-stone-700 font-semibold">SPIDEY SENSE</strong>
          </span>
        </div>
      </Link>
    );
  }

  // 3. LOGIN PAGE VARIANT (Elevated, authoritative defense portal)
  if (variant === 'login') {
    return (
      <div className={`flex flex-col items-center text-center gap-3 ${className}`}>
        {/* Team Mark */}
        <div className="p-2 rounded-xl bg-white border border-sandal-200 shadow-sm">
          <SpideySenseLogo size="xl" className="h-16 w-16 sm:h-18 sm:w-18" />
        </div>

        {/* Product Wordmark */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest font-bold">
            DEFENSE SURVEILLANCE &amp; FORENSIC DIVISION
          </span>
          <h1 className="text-2xl font-bold font-mono text-stone-950 tracking-wider uppercase">
            IBVAP
          </h1>
          <p className="text-xs font-mono text-stone-600">
            Intelligent Border Video Analytics Platform
          </p>
        </div>

        {/* SIH Event Secondary Badge */}
        <div className="mt-1 pt-2.5 border-t border-sandal-200 w-full flex items-center justify-center gap-2">
          <span className="text-[10px] font-mono text-stone-500 font-medium">PRESENTED FOR</span>
          <div className="p-1 rounded bg-white border border-sandal-200 shadow-2xs">
            <Sih2026Logo size="xs" className="h-5" />
          </div>
        </div>
      </div>
    );
  }

  // 4. FOOTER VARIANT (Balanced, unobtrusive institutional line)
  if (variant === 'footer') {
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] ${className}`}>
        {/* Left: Product & Team */}
        <div className="flex items-center gap-2.5">
          <SpideySenseLogo size="xs" className="h-6 w-6" />
          <div>
            <span className="font-bold text-stone-900">IBVAP</span>
            <span className="text-stone-500"> — Built by </span>
            <strong className="text-stone-800 font-semibold">Team SPIDEY SENSE</strong>
          </div>
        </div>

        {/* Center: SIH 2026 Institutional Mark */}
        <div className="flex items-center gap-2">
          <span className="text-stone-500">Presented at</span>
          <div className="p-0.5 rounded bg-white border border-sandal-200">
            <Sih2026Logo size="xs" className="h-6" />
          </div>
          <span className="text-stone-500 hidden md:inline">SIH #26187</span>
        </div>

        {/* Right: Technical status */}
        <div className="flex items-center gap-2 text-stone-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>Competition Prototype · Edge Telemetry</span>
        </div>
      </div>
    );
  }

  // Default compact
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <SpideySenseLogo size="sm" />
      <span className="font-mono text-xs font-bold text-stone-950">IBVAP</span>
      <Sih2026Logo size="xs" />
    </div>
  );
}
