"use client";

import React, { useState } from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { useSimulation } from '@/context/SimulationContext';
import { AlertDrawer } from '@/components/alerts/AlertDrawer';
import { IncidentStatus, Alert } from '@/types';
import { 
  LifeBuoy, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  ShieldAlert, 
  ArrowRight, 
  User, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function IncidentsPage() {
  const { alerts, setSelectedAlert, setIsAlertDrawerOpen, acknowledgeAlert, resolveAlert, playTacticalSound } = useSimulation();

  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const lifecycleStages: { status: IncidentStatus; label: string; color: string }[] = [
    { status: 'NEW', label: 'NEW / UNACKNOWLEDGED', color: 'border-red-200 text-red-700 bg-red-50' },
    { status: 'ACKNOWLEDGED', label: 'ACKNOWLEDGED', color: 'border-amber-200 text-amber-800 bg-amber-50' },
    { status: 'INVESTIGATING', label: 'UNDER INVESTIGATION', color: 'border-sky-200 text-sky-800 bg-sky-50' },
    { status: 'ESCALATED', label: 'ESCALATED TO SECTOR HQ', color: 'border-purple-200 text-purple-800 bg-purple-50' },
    { status: 'RESOLVED', label: 'RESOLVED / INTERDICTED', color: 'border-emerald-200 text-emerald-800 bg-emerald-50' },
    { status: 'FALSE_POSITIVE', label: 'FALSE POSITIVE', color: 'border-stone-200 text-stone-600 bg-stone-100' }
  ];

  const filteredAlerts = alerts.filter(alert => {
    if (activeStatusFilter !== 'ALL' && alert.status !== activeStatusFilter) return false;
    if (selectedSeverity !== 'ALL' && alert.severity !== selectedSeverity) return false;
    return true;
  });

  const handleOpenAlert = (alert: Alert) => {
    playTacticalSound('click');
    setSelectedAlert(alert);
    setIsAlertDrawerOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-[#faf8f5] text-stone-900 overflow-hidden font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto bg-[#faf8f5]">
          {/* Header Bar */}
          <div className="p-4 border-b border-sandal-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-sandal-600" />
                <h1 className="font-mono text-base font-bold text-stone-950 tracking-wider">
                  INCIDENT LIFECYCLE MANAGEMENT
                </h1>
                <span className="px-2 py-0.5 rounded bg-sandal-100 border border-sandal-200 font-mono text-[10px] text-sandal-800 font-semibold">
                  SIH26187 COMMAND TRIAGE
                </span>
              </div>
              <p className="font-mono text-xs text-stone-600 mt-1">
                Forensic escalation board tracking security incidents from tripwire breach to operator resolution and evidence retention.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-stone-500 text-[10px] font-semibold uppercase">SEVERITY:</span>
              <select
                value={selectedSeverity}
                onChange={e => setSelectedSeverity(e.target.value)}
                className="bg-white border border-sandal-300 rounded px-2.5 py-1 text-stone-800 text-xs focus:outline-none focus:border-sandal-500 shadow-2xs"
              >
                <option value="ALL">ALL SEVERITIES</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="INFO">INFO</option>
              </select>
            </div>
          </div>

          {/* Lifecycle Status Pipeline Selector */}
          <div className="p-3 border-b border-sandal-200 bg-sandal-50/80 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded font-mono text-xs transition-colors shrink-0 ${
                activeStatusFilter === 'ALL'
                  ? 'bg-stone-900 text-white font-bold shadow-2xs'
                  : 'bg-white border border-sandal-200 text-stone-600 hover:text-stone-900'
              }`}
            >
              ALL INCIDENTS ({alerts.length})
            </button>
            {lifecycleStages.map(stage => {
              const count = alerts.filter(a => a.status === stage.status).length;
              const isSelected = activeStatusFilter === stage.status;

              return (
                <button
                  key={stage.status}
                  onClick={() => setActiveStatusFilter(stage.status)}
                  className={`px-3 py-1.5 rounded font-mono text-xs flex items-center gap-2 border transition-all shrink-0 ${
                    isSelected
                      ? `${stage.color} font-bold shadow-2xs ring-1 ring-sandal-400`
                      : 'bg-white border-sandal-200 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>{stage.label}</span>
                  <span className="px-1.5 py-0.2 rounded bg-black/10 text-[10px] font-semibold">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Incidents Table / Cards */}
          <div className="p-4 flex-1 flex flex-col gap-3">
            {filteredAlerts.length === 0 ? (
              <div className="py-24 text-center text-stone-500 font-mono text-sm border border-dashed border-sandal-300 rounded-lg bg-white/60">
                NO INCIDENTS CURRENTLY IN &ldquo;{activeStatusFilter}&rdquo; LIFECYCLE STATE.
              </div>
            ) : (
              filteredAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="bg-white border border-sandal-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-sandal-400 transition-colors shadow-2xs"
                >
                  {/* Left Column: ID, Severity, Type, Camera */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`p-2.5 rounded-lg border mt-0.5 shrink-0 ${
                      alert.severity === 'CRITICAL' ? 'bg-red-50 border-red-200 text-red-600' :
                      alert.severity === 'HIGH' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                      'bg-sandal-50 border-sandal-200 text-sandal-800'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-stone-950 tracking-wider">
                          {alert.id}
                        </span>
                        <span className={`px-2 py-0.2 rounded font-mono text-[9px] font-bold border uppercase ${
                          alert.severity === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200' :
                          alert.severity === 'HIGH' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-stone-100 text-stone-700 border-stone-200'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="px-2 py-0.2 rounded bg-sandal-100 border border-sandal-200 font-mono text-[9px] text-sandal-800 uppercase font-semibold">
                          {alert.status}
                        </span>
                        <span className="font-mono text-[10px] text-stone-500">
                          {alert.timestamp}
                        </span>
                      </div>

                      <h3 className="font-mono text-xs font-bold text-stone-900 tracking-wide">
                        {alert.type} — {alert.cameraName} {alert.zoneName ? `[${alert.zoneName}]` : ''}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1 font-sans leading-relaxed">
                        {alert.description}
                      </p>

                      {/* Explainable Threat Score Strip */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span className="text-stone-500 font-semibold">THREAT SCORE:</span>
                        <span className="px-1.5 py-0.2 rounded bg-red-50 border border-red-200 text-red-700 font-bold text-xs">
                          {alert.threatBreakdown.score} / 100
                        </span>
                        <span className="text-stone-400">|</span>
                        <span className="text-stone-500">REASON:</span>
                        <span className="text-stone-700 italic text-[10px]">
                          &ldquo;{alert.threatBreakdown.reason}&rdquo;
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-sandal-200">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 rounded bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors font-mono text-xs font-semibold shadow-2xs"
                      >
                        ACKNOWLEDGE
                      </button>
                    )}

                    {alert.status !== 'RESOLVED' && alert.status !== 'FALSE_POSITIVE' && (
                      <button
                        onClick={() => resolveAlert(alert.id, 'Patrol dispatched; perimeter secure.')}
                        className="px-3 py-1.5 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors font-mono text-xs font-semibold shadow-2xs"
                      >
                        RESOLVE
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenAlert(alert)}
                      className="px-3 py-1.5 rounded bg-white border border-sandal-200 text-stone-800 hover:bg-sandal-50 hover:border-sandal-300 transition-colors font-mono text-xs flex items-center gap-1.5 shadow-2xs font-medium"
                    >
                      <span>INSPECT</span>
                      <ChevronRight className="w-3.5 h-3.5 text-sandal-600" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      <AlertDrawer />
    </div>
  );
}
