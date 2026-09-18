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
      color: 'text-emerald-700',
    },
    {
      label: 'TRACKED PERSONS',
      value: String(metrics.activePersons).padStart(2, '0'),
      sub: 'DEEPSORT ACTIVE',
      icon: Users,
      color: 'text-stone-900',
    },
    {
      label: 'VEHICLES IN SECTOR',
      value: String(metrics.activeVehicles).padStart(2, '0'),
      sub: 'ANPR CHECKPOINT',
      icon: Car,
      color: 'text-stone-900',
    },
    {
      label: 'FACIAL MATCHES',
      value: String(metrics.activeFaces).padStart(2, '0'),
      sub: 'SIMULATED DB',
      icon: ScanFace,
      color: 'text-stone-900',
    },
    {
      label: 'UNACKED ALERTS',
      value: unackedAlerts > 0 ? `0${unackedAlerts}` : '00',
      sub: unackedAlerts > 0 ? 'CRITICAL BREACH' : 'ALL CLEAR',
      icon: AlertTriangle,
      color: unackedAlerts > 0 ? 'text-red-700 font-bold' : 'text-stone-400',
    },
    {
      label: 'STREAM VELOCITY',
      value: `${metrics.fpsAverage}`,
      sub: 'TARGET: 30 FPS',
      unit: 'FPS',
      icon: Gauge,
      color: 'text-sandal-800',
    },
    {
      label: 'EDGE INFERENCE',
      value: `${metrics.inferenceLatencyMs}`,
      sub: '<100ms TARGET',
      unit: 'MS',
      icon: Cpu,
      color: 'text-emerald-700',
    },
    {
      label: 'NODE UPTIME',
      value: `${metrics.uptimePercentage}%`,
      sub: 'CONTINUOUS RUN',
      icon: ShieldCheck,
      color: 'text-stone-900',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2 w-full select-none">
      {metricItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-2.5 rounded bg-white border border-sandal-200 hover:border-sandal-400 flex flex-col justify-between transition-all group shadow-2xs"
          >
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="font-mono text-[9px] font-semibold tracking-wider uppercase truncate text-stone-600">
                {item.label}
              </span>
              <Icon className="w-3 h-3 text-sandal-500 group-hover:text-stone-900 transition-colors" />
            </div>

            <div className="flex items-baseline gap-1 my-0.5">
              <span className={`font-mono text-lg font-bold tracking-tight ${item.color}`}>
                {item.value}
              </span>
              {item.unit && (
                <span className="font-mono text-[10px] text-stone-500 font-semibold">
                  {item.unit}
                </span>
              )}
            </div>

            <div className="font-mono text-[9px] text-stone-500 truncate pt-1 border-t border-sandal-100">
              {item.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
