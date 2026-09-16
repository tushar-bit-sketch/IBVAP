"use client";

import React, { useEffect, useState } from 'react';

export function TacticalCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on fine pointer devices (desktop)
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest('[data-cursor]');
      if (interactiveEl) {
        setHovered(true);
        setCursorText(interactiveEl.getAttribute('data-cursor') || 'VIEW');
      } else {
        setHovered(false);
        setCursorText('');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 transition-transform duration-75 ease-out will-change-transform hidden md:block"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      {/* Central reticle dot */}
      <div 
        className={`relative -left-1/2 -top-1/2 flex items-center justify-center transition-all duration-200 ${
          hovered 
            ? 'w-16 h-16 rounded-full border border-neutral-400/80 bg-neutral-900/60 backdrop-blur-sm' 
            : 'w-5 h-5 rounded-full border border-neutral-500/50'
        }`}
      >
        <div className={`w-1 h-1 rounded-full bg-neutral-200 ${hovered ? 'scale-0' : 'scale-100'} transition-transform`} />
        {hovered && cursorText && (
          <span className="text-[9px] font-mono tracking-widest text-neutral-200 font-semibold uppercase">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
