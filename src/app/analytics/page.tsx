"use client";

import React from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { ArchitectureGraph } from '@/components/intelligence/ArchitectureGraph';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-neutral-100 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-6 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-tactical-cyan">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-wider">
                  SYSTEM PERFORMANCE, ANALYTICS &amp; INFERENCE PROFILING
                </h1>
                <p className="text-[10px] text-neutral-500">
                  REAL-TIME TELEMETRY, INCIDENT AGGREGATION &amp; HARDWARE BENCHMARKS
                </p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-tactical-green font-bold text-[10px]">
              24-HOUR ROLLING WINDOW
            </span>
          </div>

          {/* Recharts Analytics Suite */}
          <AnalyticsCharts />

          {/* Edge Architecture Section */}
          <div className="pt-4 border-t border-neutral-800">
            <ArchitectureGraph />
          </div>
        </main>
      </div>
    </div>
  );
}
