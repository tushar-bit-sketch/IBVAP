"use client";

import React, { useState } from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { AlertDrawer } from '@/components/alerts/AlertDrawer';
import { useSimulation } from '@/context/SimulationContext';
import { Alert, AlertSeverity } from '@/types';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Download,
  Check 
} from 'lucide-react';

export default function AlertsPage() {
  const { alerts, setSelectedAlert, setIsAlertDrawerOpen, acknowledgeAlert } = useSimulation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [onlyPending, setOnlyPending] = useState(false);

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = 
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.cameraId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.objectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = selectedSeverity === 'ALL' || a.severity === selectedSeverity;
    const matchesPending = !onlyPending || !a.acknowledged;

    return matchesSearch && matchesSeverity && matchesPending;
  });

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-neutral-100 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 font-mono">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-800 gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-red-950/40 border border-red-900/60 text-tactical-red">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-wider">
                  SECURITY OPERATIONS CENTER (SOC) ALERTS &amp; INCIDENTS
                </h1>
                <p className="text-[10px] text-neutral-500">
                  REAL-TIME PERIMETER BREACHES, BIOMETRIC FLAGS &amp; BEHAVIORAL ANOMALIES
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alerts.forEach(a => !a.acknowledged && acknowledgeAlert(a.id))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs transition-colors"
              >
                <Check className="w-3.5 h-3.5 text-tactical-green" />
                <span>ACKNOWLEDGE ALL</span>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-obsidian-200 border border-neutral-800 p-2.5 rounded text-xs">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search by Alert ID, Camera, Target ID, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-neutral-600"
              />
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] text-neutral-500 uppercase mr-1">SEVERITY:</span>
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2 py-1 rounded text-[10px] transition-colors ${
                    selectedSeverity === sev ? 'bg-neutral-800 text-white font-bold border border-neutral-700' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-1.5 text-[10px] text-neutral-400 cursor-pointer select-none ml-2">
              <input
                type="checkbox"
                checked={onlyPending}
                onChange={(e) => setOnlyPending(e.target.checked)}
                className="accent-tactical-red"
              />
              <span>PENDING ONLY</span>
            </label>
          </div>

          {/* Alerts Table */}
          <div className="bg-obsidian-200 border border-neutral-800 rounded overflow-hidden flex flex-col">
            <div className="grid grid-cols-12 gap-2 p-2.5 bg-neutral-900 border-b border-neutral-800 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              <div className="col-span-2">ALERT ID &amp; SEVERITY</div>
              <div className="col-span-2">INCIDENT TYPE</div>
              <div className="col-span-2">CAMERA / ZONE</div>
              <div className="col-span-2">OBJECT ID (CONF)</div>
              <div className="col-span-2">TIMESTAMP</div>
              <div className="col-span-2 text-right">STATUS / ACTION</div>
            </div>

            <div className="flex flex-col divide-y divide-neutral-800/60">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map(alert => {
                  const isCritical = alert.severity === 'CRITICAL';
                  return (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setSelectedAlert(alert);
                        setIsAlertDrawerOpen(true);
                      }}
                      className="grid grid-cols-12 gap-2 p-3 hover:bg-neutral-800/40 cursor-pointer items-center transition-colors text-xs"
                    >
                      <div className="col-span-2 flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase ${
                          isCritical ? 'bg-red-950 border-red-800 text-tactical-red' :
                          alert.severity === 'HIGH' ? 'bg-amber-950 border-amber-800 text-tactical-amber' :
                          'bg-neutral-900 border-neutral-800 text-neutral-300'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="font-bold text-white">{alert.id}</span>
                      </div>

                      <div className="col-span-2 font-bold text-neutral-200">
                        {alert.type.replace('_', ' ')}
                      </div>

                      <div className="col-span-2 text-neutral-300">
                        {alert.cameraId} {alert.zoneName && <span className="text-neutral-500">/ {alert.zoneName}</span>}
                      </div>

                      <div className="col-span-2 flex items-center gap-1">
                        <span className="font-semibold text-white">{alert.objectId}</span>
                        <span className="text-[10px] text-tactical-green">({(alert.confidence * 100).toFixed(0)}%)</span>
                      </div>

                      <div className="col-span-2 text-neutral-400 text-[11px]">
                        {alert.timestamp}
                      </div>

                      <div className="col-span-2 text-right">
                        {alert.acknowledged ? (
                          <span className="inline-flex items-center gap-1 text-tactical-green text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>ACKNOWLEDGED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-tactical-red text-[10px] font-bold animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-tactical-red" />
                            <span>PENDING ACK</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-neutral-500 text-xs">
                  No alerts match active filter criteria.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <AlertDrawer />
    </div>
  );
}
