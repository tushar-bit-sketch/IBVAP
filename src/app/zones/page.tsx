"use client";

import React from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { ZoneEditor } from '@/components/zones/ZoneEditor';
import { Shield } from 'lucide-react';

export default function ZonesPage() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-neutral-100 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-tactical-green">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-wider">
                  VIRTUAL INTRUSION ZONES &amp; TRIPWIRE GEOMETRY
                </h1>
                <p className="text-[10px] text-neutral-500">
                  GEOMETRIC POLYGON DEFINITIONS, VECTOR TRIGGERS &amp; LOITER THRESHOLDS
                </p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-tactical-green font-bold text-[10px]">
              TRIPWIRE ENGINE: ACTIVE
            </span>
          </div>

          <ZoneEditor />
        </main>
      </div>
    </div>
  );
}
