"use client";

import React from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { FaceInspector } from '@/components/intelligence/FaceInspector';
import { UserCheck } from 'lucide-react';

export default function FacesPage() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-neutral-100 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-tactical-cyan">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-wider">
                  FACIAL INTELLIGENCE &amp; SYNTHETIC WATCHLIST RE-ID
                </h1>
                <p className="text-[10px] text-neutral-500">
                  ARCFACE 512-DIM EMBEDDING EXTRACTION // PROTOYPE SIMULATION ONLY
                </p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-tactical-amber font-bold text-[10px]">
              SIMULATED TEST IDENTITIES
            </span>
          </div>

          <FaceInspector />
        </main>
      </div>
    </div>
  );
}
