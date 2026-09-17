"use client";

import React from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { ZoneEditor } from '@/components/zones/ZoneEditor';
import { Shield } from 'lucide-react';

export default function ZonesPage() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#faf8f5] text-stone-900 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 font-mono bg-[#faf8f5]">
          <div className="flex items-center justify-between pb-3 border-b border-sandal-200 text-xs bg-white p-4 rounded-lg shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sandal-50 border border-sandal-200 text-sandal-700">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-stone-950 tracking-wider">
                  VIRTUAL INTRUSION ZONES &amp; TRIPWIRE GEOMETRY
                </h1>
                <p className="text-[10px] text-stone-500 font-semibold uppercase">
                  GEOMETRIC POLYGON DEFINITIONS, VECTOR TRIGGERS &amp; LOITER THRESHOLDS
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[10px]">
              TRIPWIRE ENGINE: ACTIVE
            </span>
          </div>

          <ZoneEditor />
        </main>
      </div>
    </div>
  );
}
