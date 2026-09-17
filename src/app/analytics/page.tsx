"use client";

import React from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { ArchitectureGraph } from '@/components/intelligence/ArchitectureGraph';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-stone-900 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-6 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-sandal-200 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-white border border-sandal-200 text-sandal-700 shadow-2xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-stone-950 tracking-wider">
                  SYSTEM PERFORMANCE, ANALYTICS &amp; INFERENCE PROFILING
                </h1>
                <p className="text-[10px] text-stone-500">
                  REAL-TIME TELEMETRY, INCIDENT AGGREGATION &amp; HARDWARE BENCHMARKS
                </p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded bg-sandal-50 border border-sandal-200 text-sandal-700 font-bold text-[10px]">
              24-HOUR ROLLING WINDOW
            </span>
          </div>

          {/* Recharts Analytics Suite */}
          <AnalyticsCharts />

          {/* Edge Architecture Section */}
          <div className="pt-4 border-t border-sandal-200">
            <ArchitectureGraph />
          </div>
        </main>
      </div>
    </div>
  );
}
