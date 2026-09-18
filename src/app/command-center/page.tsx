"use client";

import React, { useState } from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { MetricStrip } from '@/components/dashboard/MetricStrip';
import { CameraGrid } from '@/components/video/CameraGrid';
import { AlertRow } from '@/components/alerts/AlertRow';
import { AlertDrawer } from '@/components/alerts/AlertDrawer';
import { CommandMap } from '@/components/dashboard/CommandMap';
import { useSimulation } from '@/context/SimulationContext';
import { 
  LayoutGrid, 
  MapPin, 
  AlertTriangle, 
  Sliders, 
  RefreshCw, 
  Volume2, 
  Maximize2 
} from 'lucide-react';

export default function CommandCenterPage() {
  const { alerts, selectedAlert, selectAlertAndSeek } = useSimulation();
  const [viewMode, setViewMode] = useState<'MATRIX' | 'MAP'>('MATRIX');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter === 'ALL') return true;
    return a.severity === severityFilter;
  });

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-stone-900 font-sans">
      {/* Top Command Bar */}
      <CommandTopBar />

      {/* Main Mission Control Shell */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Operational Sidebar */}
        <CommandSidebar />

        {/* Center & Right Command Center Body */}
        <main className="flex-1 flex flex-col overflow-hidden p-3 gap-3 bg-obsidian">
          {/* Top Metric Strip */}
          <div className="shrink-0">
            <MetricStrip />
          </div>

          {/* Center Main Stage + Right Alert Feed */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
            {/* Center Stage: Camera Grid or Tactical Map (9 cols on lg) */}
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col h-full overflow-hidden bg-neutral-950 border border-sandal-300 rounded-sm shadow-xs">
              {/* Stage View Switcher Tabs */}
              <div className="p-2 border-b border-sandal-200 bg-white flex items-center justify-between font-mono text-xs select-none">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('MATRIX')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all ${
                      viewMode === 'MATRIX' 
                        ? 'bg-sandal-100 border border-sandal-300 text-stone-950 font-bold shadow-2xs' 
                        : 'text-stone-600 hover:text-stone-950 hover:bg-sandal-50'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Camera matrix (4 feeds)</span>
                  </button>

                  <button
                    onClick={() => setViewMode('MAP')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all ${
                      viewMode === 'MAP' 
                        ? 'bg-sandal-100 border border-sandal-300 text-stone-950 font-bold shadow-2xs' 
                        : 'text-stone-600 hover:text-stone-950 hover:bg-sandal-50'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Tactical radar map</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-3 text-[10px] text-stone-600">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 4 channels online
                  </span>
                  <span>Sync: edge direct</span>
                </div>
              </div>

              {/* View Content */}
              <div className="flex-1 p-2 overflow-y-auto">
                {viewMode === 'MATRIX' ? (
                  <CameraGrid />
                ) : (
                  <CommandMap />
                )}
              </div>
            </div>

            {/* Right Live Security Events Feed (3 cols on lg) */}
            <div className="lg:col-span-4 xl:col-span-3 flex flex-col h-full bg-white border border-sandal-200 rounded-sm overflow-hidden select-none font-mono shadow-xs">
              <div className="p-2.5 border-b border-sandal-200 flex items-center justify-between bg-sandal-50/50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-bold text-stone-950 tracking-wider">
                    Alert feed ({alerts.length})
                  </span>
                </div>

                {/* Filter Selector */}
                <div className="flex items-center gap-1 text-[10px]">
                  {(['ALL', 'CRITICAL'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setSeverityFilter(f)}
                      className={`px-1.5 py-0.5 rounded transition-colors ${
                        severityFilter === f ? 'bg-stone-900 text-white font-bold' : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      {f === 'ALL' ? 'All' : 'Critical'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Alerts Stream */}
              <div className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto bg-obsidian">
                {filteredAlerts.map(alert => (
                  <AlertRow
                    key={alert.id}
                    alert={alert}
                    isSelected={selectedAlert?.id === alert.id}
                    onSelect={(a) => selectAlertAndSeek(a)}
                  />
                ))}
              </div>

              {/* Bottom Quick Status */}
              <div className="p-2 border-t border-sandal-200 bg-sandal-50 text-[10px] text-stone-600 flex items-center justify-between">
                <span>Select alert to inspect evidence dossier</span>
                <span className="text-emerald-700 font-semibold">Live</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Slide-out Forensic Alert Drawer */}
      <AlertDrawer />
    </div>
  );
}
