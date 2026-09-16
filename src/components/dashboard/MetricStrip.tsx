"use client";

import React from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { 
  Video, 
  Users, 
  Car, 
  ScanFace, 
  AlertTriangle, 
  Gauge, 
  Cpu, 
  ShieldCheck 
} from 'lucide-react';

export function MetricStrip() {
  const { metrics, alerts } = useSimulation();
  const unackedAlerts = alerts.filter(a => !a.acknowledged).length;

  const metricItems = [
    {
      label: 'ACTIVE CAMERAS',
      value: `${metrics.activeCameras}/${metrics.totalCameras}`,
      sub: 'ALL CHANNELS UP',
      icon: Video,
      color: 'text-tactical-green',
    },
    {
      label: 'TRACKED PERSONS',
      value: `0${metrics.activePersons}`,
      sub: 'DEEPSORT ACTIVE',
      icon: Users,
      color: 'text-neutral-200',
    },
    {
      label: 'VEHICLES IN SECTOR',
      value: `0${metrics.activeVehicles}`,
      sub: 'ANPR CHECKPOINT',
      icon: Car,
      color: 'text-neutral-200',
    },
    {
      label: 'FACIAL MATCHES',
      value: `0${metrics.activeFaces}`,
      sub: 'SIMULATED DB',
      icon: ScanFace,
      color: 'text-neutral-200',
    },
    {
      label: 'UNACKED ALERTS',
      value: unackedAlerts > 0 ? `0${unackedAlerts}` : '00',
      sub: unackedAlerts > 0 ? 'CRITICAL BREACH' : 'ALL CLEAR',
      icon: AlertTriangle,
      color: unackedAlerts > 0 ? 'text-tactical-red animate-pulse' : 'text-neutral-400',
    },
    {
      label: 'STREAM VELOCITY',
      value: `${metrics.fpsAverage}`,
      sub: 'TARGET: 30 FPS',
      unit: 'FPS',
      icon: Gauge,
      color: 'text-tactical-cyan',
    },
    {
      label: 'EDGE INFERENCE',
      value: `${metrics.inferenceLatencyMs}`,
      sub: '<100ms TARGET',
      unit: 'MS',
      icon: Cpu,
      color: 'text-tactical-green',
    },
    {
      label: 'NODE UPTIME',
      value: `${metrics.uptimePercentage}%`,
      sub: 'CONTINUOUS RUN',
      icon: ShieldCheck,
      color: 'text-neutral-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2 w-full select-none">
      {metricItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-2.5 rounded bg-obsidian-200/90 border border-neutral-800/80 hover:border-neutral-700 flex flex-col justify-between transition-all group"
          >
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="font-mono text-[9px] font-semibold tracking-wider uppercase truncate">
                {item.label}
              </span>
              <Icon className="w-3 h-3 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
            </div>

            <div className="flex items-baseline gap-1 my-0.5">
              <span className={`font-mono text-lg font-bold tracking-tight ${item.color}`}>
                {item.value}
              </span>
              {item.unit && (
                <span className="font-mono text-[10px] text-neutral-500 font-semibold">
                  {item.unit}
                </span>
              )}
            </div>

            <div className="font-mono text-[9px] text-neutral-500 truncate pt-1 border-t border-neutral-800/40">
              {item.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
