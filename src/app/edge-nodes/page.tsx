"use client";

import React from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { useSimulation } from '@/context/SimulationContext';
import { 
  Cpu, 
  HardDrive, 
  Activity, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  ShieldCheck, 
  Server, 
  Thermometer, 
  Layers, 
  Clock, 
  Database,
  ArrowRight
} from 'lucide-react';

export default function EdgeNodesPage() {
  const { 
    edgeNode, 
    networkMode, 
    setNetworkMode, 
    pendingSyncCount, 
    isSyncing, 
    triggerManualSync, 
    playTacticalSound 
  } = useSimulation();

  return (
    <div className="flex flex-col h-screen bg-obsidian text-neutral-100 overflow-hidden font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto bg-obsidian-base p-4 gap-4">
          {/* Header */}
          <div className="p-4 border border-neutral-800 rounded-lg bg-obsidian-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-tactical-cyan" />
                <h1 className="font-mono text-base font-bold text-white tracking-wider">
                  EDGE NODE INTELLIGENCE &amp; OFFLINE SYNCHRONIZATION
                </h1>
                <span className="px-2 py-0.5 rounded bg-green-950/80 border border-green-800 font-mono text-[10px] text-tactical-green font-bold">
                  LOCAL DAEMON ACTIVE
                </span>
              </div>
              <p className="font-mono text-xs text-neutral-400 mt-1">
                BOP-17 Autonomous Edge Computing Unit — Zero-cloud dependency; real-time inference executed on local GPU clusters.
              </p>
            </div>

            {/* Network Mode & Sync Actions */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="text-neutral-400 text-[10px]">UPLINK:</span>
              {(['ONLINE', 'DEGRADED', 'OFFLINE'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setNetworkMode(mode)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors border ${
                    networkMode === mode
                      ? mode === 'ONLINE' ? 'bg-green-950 border-green-700 text-tactical-green font-bold' :
                        mode === 'DEGRADED' ? 'bg-amber-950 border-amber-700 text-tactical-amber font-bold' :
                        'bg-red-950 border-red-700 text-tactical-red font-bold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}

              <button
                onClick={triggerManualSync}
                disabled={networkMode === 'OFFLINE' || isSyncing}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700 disabled:opacity-40 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'SYNCING...' : 'FORCE SYNC'}</span>
              </button>
            </div>
          </div>

          {/* Sync Queue Banner (Offline-first proof) */}
          <div className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs ${
            networkMode === 'OFFLINE' 
              ? 'bg-red-950/40 border-red-800 text-red-300' 
              : pendingSyncCount > 0 
              ? 'bg-amber-950/40 border-amber-800 text-amber-300'
              : 'bg-obsidian-100 border-neutral-800 text-neutral-300'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded ${
                networkMode === 'OFFLINE' ? 'bg-red-900/60 text-white' : 'bg-neutral-800 text-neutral-400'
              }`}>
                {networkMode === 'OFFLINE' ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-bold block tracking-wider">
                  {networkMode === 'OFFLINE' ? 'OFFLINE AUTONOMOUS PROCESSING ACTIVE' : 'CENTRAL SYNC QUEUE STATUS'}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {networkMode === 'OFFLINE'
                    ? 'All camera inference, polygon breach alerts, and SHA-256 evidence hashing proceed uninterrupted in local edge memory.'
                    : isSyncing 
                    ? `Synchronizing ${pendingSyncCount} cached incidents to National Sector Command...`
                    : 'Edge node fully synchronized with Central Command network.'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-[10px] text-neutral-500 block">PENDING EVENTS</span>
                <span className="text-base font-bold text-white">{pendingSyncCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block">LAST SYNC</span>
                <span className="text-xs text-neutral-300">{edgeNode.lastSyncTimestamp}</span>
              </div>
            </div>
          </div>

          {/* Hardware & Computational Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* GPU Utilization */}
            <div className="p-4 rounded-lg bg-obsidian-100 border border-neutral-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400 font-mono text-xs">
                <span>EDGE GPU LOAD</span>
                <Activity className="w-4 h-4 text-tactical-cyan" />
              </div>
              <div className="my-2">
                <span className="text-2xl font-mono font-bold text-white tracking-tight">
                  {edgeNode.gpuLoadPercent}%
                </span>
                <span className="text-[10px] font-mono text-neutral-500 ml-2">NVIDIA JETSON / ORIN</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-tactical-cyan h-full transition-all duration-500" 
                  style={{ width: `${edgeNode.gpuLoadPercent}%` }}
                />
              </div>
            </div>

            {/* VRAM Utilization */}
            <div className="p-4 rounded-lg bg-obsidian-100 border border-neutral-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400 font-mono text-xs">
                <span>VRAM ALLOCATION</span>
                <Layers className="w-4 h-4 text-tactical-cyan" />
              </div>
              <div className="my-2">
                <span className="text-2xl font-mono font-bold text-white tracking-tight">
                  {edgeNode.vramUsageGb} / {edgeNode.vramTotalGb} GB
                </span>
                <span className="text-[10px] font-mono text-neutral-500 ml-2">TENSOR RT CORES</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-tactical-cyan h-full transition-all duration-500" 
                  style={{ width: `${(edgeNode.vramUsageGb / edgeNode.vramTotalGb) * 100}%` }}
                />
              </div>
            </div>

            {/* CPU Load */}
            <div className="p-4 rounded-lg bg-obsidian-100 border border-neutral-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400 font-mono text-xs">
                <span>CPU CORES (12T)</span>
                <Cpu className="w-4 h-4 text-tactical-green" />
              </div>
              <div className="my-2">
                <span className="text-2xl font-mono font-bold text-white tracking-tight">
                  {edgeNode.cpuLoadPercent}%
                </span>
                <span className="text-[10px] font-mono text-neutral-500 ml-2">ARM64 ARCH</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-tactical-green h-full transition-all duration-500" 
                  style={{ width: `${edgeNode.cpuLoadPercent}%` }}
                />
              </div>
            </div>

            {/* Temperature */}
            <div className="p-4 rounded-lg bg-obsidian-100 border border-neutral-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400 font-mono text-xs">
                <span>DIE TEMPERATURE</span>
                <Thermometer className="w-4 h-4 text-tactical-amber" />
              </div>
              <div className="my-2">
                <span className="text-2xl font-mono font-bold text-white tracking-tight">
                  {edgeNode.temperatureC}°C
                </span>
                <span className="text-[10px] font-mono text-neutral-500 ml-2">PASSIVE CHASSIS</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-tactical-amber h-full transition-all duration-500" 
                  style={{ width: `${(edgeNode.temperatureC / 90) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Subsystems & Local Ingestion Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Active AI Inference Models on Edge */}
            <div className="p-4 rounded-lg bg-obsidian-100 border border-neutral-800 flex flex-col font-mono">
              <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Server className="w-4 h-4 text-tactical-cyan" />
                <span>LOADED EDGE INFERENCE ENGINES</span>
              </h3>
              <div className="flex flex-col divide-y divide-neutral-800/60 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">YOLOv8x-CustomBorder</span>
                    <span className="text-[10px] text-neutral-500">Object Detection • TensorRT FP16</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-950 border border-green-800 text-tactical-green text-[10px] font-bold">
                    ONLINE (28.8 FPS)
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">DeepSORT v2.1-ReID</span>
                    <span className="text-[10px] text-neutral-500">Cross-Camera Entity Association</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-950 border border-green-800 text-tactical-green text-[10px] font-bold">
                    ONLINE (12ms)
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">LPRNet-v3 + CRNN OCR</span>
                    <span className="text-[10px] text-neutral-500">License Plate Optical Recognition</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-950 border border-green-800 text-tactical-green text-[10px] font-bold">
                    ONLINE (34ms)
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">ArcFace-512D ResNet-50</span>
                    <span className="text-[10px] text-neutral-500">Biometric Vector Extraction</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-950 border border-green-800 text-tactical-green text-[10px] font-bold">
                    ONLINE (41ms)
                  </span>
                </div>
              </div>
            </div>

            {/* Local Storage & Daemon Health */}
            <div className="p-4 rounded-lg bg-obsidian-100 border border-neutral-800 flex flex-col font-mono">
              <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-tactical-cyan" />
                <span>LOCAL DAEMON PERSISTENCE &amp; MEMORY BUS</span>
              </h3>
              <div className="flex flex-col divide-y divide-neutral-800/60 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">PostgreSQL / TimescaleDB</span>
                    <span className="text-[10px] text-neutral-500">Local Relational Incident Store</span>
                  </div>
                  <span className="text-tactical-green font-bold text-[11px]">HEALTHY (8ms)</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">Redis 7.2 In-Memory Broker</span>
                    <span className="text-[10px] text-neutral-500">Sub-millisecond Event Queue</span>
                  </div>
                  <span className="text-tactical-green font-bold text-[11px]">HEALTHY (0.4ms)</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">RTSP Ingestion Pipeline</span>
                    <span className="text-[10px] text-neutral-500">4 / 4 Active Camera Streams</span>
                  </div>
                  <span className="text-tactical-green font-bold text-[11px]">4096 Kbps TOTAL</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">System Uptime</span>
                    <span className="text-[10px] text-neutral-500">BOP-17 Continuous Operational Runtime</span>
                  </div>
                  <span className="text-white font-bold text-[11px]">{edgeNode.uptimeHours} HOURS</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
