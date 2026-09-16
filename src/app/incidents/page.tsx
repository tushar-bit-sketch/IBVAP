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
    { status: 'NEW', label: 'NEW / UNACKNOWLEDGED', color: 'border-red-900/80 text-tactical-red bg-red-950/40' },
    { status: 'ACKNOWLEDGED', label: 'ACKNOWLEDGED', color: 'border-amber-900/80 text-tactical-amber bg-amber-950/40' },
    { status: 'INVESTIGATING', label: 'UNDER INVESTIGATION', color: 'border-blue-900/80 text-blue-400 bg-blue-950/40' },
    { status: 'ESCALATED', label: 'ESCALATED TO SECTOR HQ', color: 'border-purple-900/80 text-purple-400 bg-purple-950/40' },
    { status: 'RESOLVED', label: 'RESOLVED / INTERDICTED', color: 'border-emerald-900/80 text-tactical-green bg-emerald-950/40' },
    { status: 'FALSE_POSITIVE', label: 'FALSE POSITIVE', color: 'border-neutral-800 text-neutral-400 bg-neutral-900' }
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
    <div className="flex flex-col h-screen bg-obsidian text-neutral-100 overflow-hidden font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto bg-obsidian-base">
          {/* Header Bar */}
          <div className="p-4 border-b border-neutral-800/80 bg-obsidian-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-tactical-cyan" />
                <h1 className="font-mono text-base font-bold text-white tracking-wider">
                  INCIDENT LIFECYCLE MANAGEMENT
                </h1>
                <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono text-[10px] text-neutral-300">
                  SIH26187 COMMAND TRIAGE
                </span>
              </div>
              <p className="font-mono text-xs text-neutral-400 mt-1">
                Forensic escalation board tracking security incidents from tripwire breach to operator resolution and evidence retention.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-neutral-500 text-[10px]">SEVERITY:</span>
              <select
                value={selectedSeverity}
                onChange={e => setSelectedSeverity(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-neutral-200 text-xs focus:outline-none"
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
          <div className="p-4 border-b border-neutral-800/60 bg-obsidian-200/50 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded font-mono text-xs transition-colors shrink-0 ${
                activeStatusFilter === 'ALL'
                  ? 'bg-neutral-700 text-white font-bold'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
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
                      ? `${stage.color} font-bold shadow-md`
                      : 'bg-neutral-900/80 border-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span>{stage.label}</span>
                  <span className="px-1.5 py-0.2 rounded bg-black/50 text-[10px]">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Incidents Table / Cards */}
          <div className="p-4 flex-1 flex flex-col gap-3">
            {filteredAlerts.length === 0 ? (
              <div className="py-24 text-center text-neutral-500 font-mono text-sm border border-dashed border-neutral-800 rounded">
                NO INCIDENTS CURRENTLY IN &ldquo;{activeStatusFilter}&rdquo; LIFECYCLE STATE.
              </div>
            ) : (
              filteredAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="bg-obsidian-100 border border-neutral-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-neutral-700 transition-colors shadow-sm"
                >
                  {/* Left Column: ID, Severity, Type, Camera */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`p-2.5 rounded border mt-0.5 shrink-0 ${
                      alert.severity === 'CRITICAL' ? 'bg-red-950/60 border-red-800 text-tactical-red' :
                      alert.severity === 'HIGH' ? 'bg-amber-950/60 border-amber-800 text-tactical-amber' :
                      'bg-neutral-900 border-neutral-700 text-neutral-300'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-white tracking-wider">
                          {alert.id}
                        </span>
                        <span className={`px-2 py-0.2 rounded font-mono text-[9px] font-bold border uppercase ${
                          alert.severity === 'CRITICAL' ? 'bg-red-950 text-tactical-red border-red-900' :
                          alert.severity === 'HIGH' ? 'bg-amber-950 text-tactical-amber border-amber-900' :
                          'bg-neutral-900 text-neutral-400 border-neutral-800'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="px-2 py-0.2 rounded bg-neutral-900 border border-neutral-800 font-mono text-[9px] text-neutral-400 uppercase">
                          {alert.status}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-500">
                          {alert.timestamp}
                        </span>
                      </div>

                      <h3 className="font-mono text-xs font-bold text-neutral-200 tracking-wide">
                        {alert.type} — {alert.cameraName} {alert.zoneName ? `[${alert.zoneName}]` : ''}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 font-sans leading-relaxed">
                        {alert.description}
                      </p>

                      {/* Explainable Threat Score Strip */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span className="text-neutral-400">THREAT SCORE:</span>
                        <span className="px-1.5 py-0.2 rounded bg-red-950/80 border border-red-900 text-tactical-red font-bold text-xs">
                          {alert.threatBreakdown.score} / 100
                        </span>
                        <span className="text-neutral-500">REASON:</span>
                        <span className="text-neutral-300 italic text-[10px]">
                          &ldquo;{alert.threatBreakdown.reason}&rdquo;
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-800">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 rounded bg-amber-950/40 border border-amber-800 text-amber-300 hover:bg-amber-900/40 transition-colors font-mono text-xs font-semibold"
                      >
                        ACKNOWLEDGE
                      </button>
                    )}

                    {alert.status !== 'RESOLVED' && alert.status !== 'FALSE_POSITIVE' && (
                      <button
                        onClick={() => resolveAlert(alert.id, 'Patrol dispatched; perimeter secure.')}
                        className="px-3 py-1.5 rounded bg-emerald-950/40 border border-emerald-800 text-tactical-green hover:bg-emerald-900/40 transition-colors font-mono text-xs font-semibold"
                      >
                        RESOLVE
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenAlert(alert)}
                      className="px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors font-mono text-xs flex items-center gap-1.5"
                    >
                      <span>INSPECT</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
