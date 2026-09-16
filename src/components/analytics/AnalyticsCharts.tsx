"use client";

import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ANALYTICS_SERIES_24H } from '@/data/mockData';
import { Activity, Cpu, AlertTriangle, ShieldCheck, TrendingUp, BarChart2 } from 'lucide-react';

const ALERT_BREAKDOWN = [
  { name: 'INTRUSION', value: 42, color: '#ef4444' },
  { name: 'LOITERING', value: 28, color: '#f59e0b' },
  { name: 'WATCHLIST', value: 16, color: '#06b6d4' },
  { name: 'ANPR FLAG', value: 14, color: '#a855f7' },
];

const LATENCY_DISTRIBUTION = [
  { bucket: '60-75ms', count: 12 },
  { bucket: '75-90ms', count: 68 },
  { bucket: '90-105ms', count: 94 },
  { bucket: '105-120ms', count: 18 },
  { bucket: '>120ms', count: 2 },
];

// Tactical Custom Tooltip
const TacticalTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-obsidian-200 border border-neutral-700 p-2.5 rounded shadow-2xl font-mono text-xs">
        <div className="text-[10px] text-neutral-400 font-bold border-b border-neutral-800 pb-1 mb-1.5 flex items-center justify-between gap-3">
          <span>WINDOW: {label} IST</span>
          <span className="w-1.5 h-1.5 rounded-full bg-tactical-green" />
        </div>
        <div className="flex flex-col gap-1 text-[11px]">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-neutral-400 uppercase text-[10px]">{entry.name}:</span>
              <span className="font-bold text-white" style={{ color: entry.color }}>
                {entry.value} {entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function AnalyticsCharts() {
  const [timeRange, setTimeRange] = useState<'24H' | '7D' | '30D'>('24H');

  return (
    <div className="w-full flex flex-col gap-4 font-mono select-none">
      {/* Top Header Filter Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-neutral-400" />
          <span className="font-bold text-white tracking-wider">
            BORDER ANALYTICS & INFERENCE BENCHMARKS
          </span>
        </div>
        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded p-0.5">
          {(['24H', '7D', '30D'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-1 rounded text-[10px] transition-colors ${
                timeRange === range ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Chart 1: Detection Velocity vs Alert Trigger Volume */}
        <div className="p-3 bg-obsidian-200 border border-neutral-800 rounded flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              HOURLY PERCEPTION VOLUME (DETECTIONS VS ALERTS)
            </span>
            <div className="flex items-center gap-3 text-[9px] text-neutral-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-tactical-cyan" /> DETECTIONS
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-tactical-red" /> ALERTS
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_SERIES_24H} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#1f1f28" vertical={false} />
                <XAxis dataKey="time" stroke="#52525b" fontSize={9} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
                <Tooltip content={<TacticalTooltip />} />
                <Area type="monotone" dataKey="detections" name="Detections" stroke="#06b6d4" strokeWidth={1.5} fillOpacity={1} fill="url(#colorDet)" />
                <Area type="monotone" dataKey="alerts" name="Alerts" stroke="#ef4444" strokeWidth={1.5} fillOpacity={1} fill="url(#colorAlt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Edge Inference Latency (ms) & FPS Stream Stability */}
        <div className="p-3 bg-obsidian-200 border border-neutral-800 rounded flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              EDGE INFERENCE LATENCY & STREAM VELOCITY
            </span>
            <div className="flex items-center gap-3 text-[9px] text-neutral-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-tactical-green" /> LATENCY (MS)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> FPS
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ANALYTICS_SERIES_24H} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1f1f28" vertical={false} />
                <XAxis dataKey="time" stroke="#52525b" fontSize={9} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={9} tickLine={false} domain={[60, 110]} />
                <Tooltip content={<TacticalTooltip />} />
                <Line type="monotone" dataKey="inferenceMs" name="Inference" stroke="#10b981" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="fps" name="FPS" stroke="#fbbf24" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Incident Category Distribution (Donut) */}
        <div className="p-3 bg-obsidian-200 border border-neutral-800 rounded flex flex-col gap-3">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
            ALERTS DISTRIBUTION BY THREAT PROFILE
          </span>
          <div className="h-56 w-full flex items-center justify-between">
            <div className="h-full w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ALERT_BREAKDOWN}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#09090d"
                  >
                    {ALERT_BREAKDOWN.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 flex flex-col gap-2 pl-4 border-l border-neutral-800 text-xs">
              {ALERT_BREAKDOWN.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-neutral-300 text-[11px]">{item.name}</span>
                  </div>
                  <span className="font-bold text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 4: Latency Frequency Histogram */}
        <div className="p-3 bg-obsidian-200 border border-neutral-800 rounded flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              MODEL INFERENCE LATENCY BINS (YOLOV8x INT8)
            </span>
            <span className="text-[9px] text-tactical-green font-bold">AVG: 91.2ms</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LATENCY_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1f1f28" vertical={false} />
                <XAxis dataKey="bucket" stroke="#52525b" fontSize={9} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
                <Tooltip content={<TacticalTooltip />} />
                <Bar dataKey="count" name="Frequency" fill="#3f3f4e" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
