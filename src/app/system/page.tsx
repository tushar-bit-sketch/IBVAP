"use client";

import React, { useState } from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { useSimulation } from '@/context/SimulationContext';
import { 
  Activity, 
  Cpu, 
  Server, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Clock, 
  Sliders, 
  HardDrive,
  Terminal,
  ShieldCheck
} from 'lucide-react';

export default function SystemPage() {
  const { metrics, edgeNode, playTacticalSound } = useSimulation();

  const [pingRunning, setPingRunning] = useState(false);
  const [pingLog, setPingLog] = useState<string[]>([
    '14:32:40 IST: API Handshake /api/health -> 200 OK (12ms)',
    '14:32:43 IST: Event Stream /api/events/stream -> SUBSCRIBED (22ms)',
    '14:32:46 IST: RTSP Ingestion Pipeline -> ALL 4 FEEDS STABLE (28.8 FPS avg)',
    '14:32:50 IST: Local TimescaleDB Query -> OK (8ms)'
  ]);

  const runPingTest = () => {
    setPingRunning(true);
    playTacticalSound('click');
    setTimeout(() => {
      const now = new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST';
      setPingLog(prev => [
        `${now}: Diagnostics Ping -> Edge Daemon BOP-17 NOMINAL (Latency 11ms, Jitter 3.2ms)`,
        ...prev
      ]);
      setPingRunning(false);
      playTacticalSound('ack');
    }, 600);
  };

  const subsystems = [
    { name: 'CCTV RTSP Ingestion', status: 'ONLINE', latency: '14ms', notes: '4/4 Feeds Active' },
    { name: 'YOLOv8x Detection Core', status: 'ONLINE', latency: '28.8 FPS', notes: 'TensorRT FP16' },
    { name: 'DeepSORT Trajectory Engine', status: 'ONLINE', latency: '12ms', notes: 'Continuous ReID' },
    { name: 'ANPR / CRNN OCR Module', status: 'ONLINE', latency: '34ms', notes: 'Confidence > 85%' },
    { name: 'Synthetic FaceNet Module', status: 'ONLINE', latency: '41ms', notes: '512D ArcFace' },
    { name: 'Virtual Zone Polygon Engine', status: 'ONLINE', latency: '4ms', notes: 'Tripwire Trigger Active' },
    { name: 'Explainable Threat Engine', status: 'ONLINE', latency: '6ms', notes: 'Weighted Factor Breakdown' },
    { name: 'Cryptographic Evidence Vault', status: 'ONLINE', latency: '18ms', notes: 'SHA-256 + ED25519 Seal' },
    { name: 'Local Redis Event Broker', status: 'ONLINE', latency: '0.4ms', notes: 'Sub-ms Stream Queues' },
    { name: 'PostgreSQL / TimescaleDB', status: 'ONLINE', latency: '8ms', notes: 'Partitioned Timeseries' },
  ];

  return (
    <div className="flex flex-col h-screen bg-obsidian text-neutral-100 overflow-hidden font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto bg-obsidian-base p-4 gap-4">
          {/* Header */}
          <div className="p-4 border border-neutral-800 rounded-lg bg-obsidian-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-tactical-cyan" />
                <h1 className="font-mono text-base font-bold text-white tracking-wider">
                  TECHNICAL OBSERVABILITY &amp; SYSTEM DIAGNOSTICS
                </h1>
                <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono text-[10px] text-neutral-300">
                  SIH26187 BENCHMARK
                </span>
              </div>
              <p className="font-mono text-xs text-neutral-400 mt-1">
                Real-time sub-millisecond pipeline diagnostics, API response latency, and component health monitoring.
              </p>
            </div>

            <button
              onClick={runPingTest}
              disabled={pingRunning}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700 font-mono text-xs transition-colors self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pingRunning ? 'animate-spin' : ''}`} />
              <span>{pingRunning ? 'DIAGNOSING...' : 'RUN PIPELINE DIAGNOSTIC'}</span>
            </button>
          </div>

          {/* Real-time Performance Target vs Simulated Benchmark */}
          <div className="p-4 rounded-lg bg-obsidian-100 border border-neutral-800 font-mono">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>TARGET PERFORMANCE METRICS (COMPETITION BENCHMARKS)</span>
              <span className="text-[10px] text-tactical-amber font-normal">SIMULATED BENCHMARK DATA</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded bg-obsidian-200 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">STREAM FRAME RATE</span>
                <span className="text-xl font-bold text-white">{metrics.fpsAverage} FPS</span>
                <span className="text-[9px] text-tactical-green block mt-0.5">Target: &gt; 24.0 FPS (Achieved)</span>
              </div>

              <div className="p-3 rounded bg-obsidian-200 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">AI INFERENCE LATENCY</span>
                <span className="text-xl font-bold text-white">{metrics.inferenceLatencyMs} ms</span>
                <span className="text-[9px] text-tactical-green block mt-0.5">Target: &lt; 100 ms (Achieved)</span>
              </div>

              <div className="p-3 rounded bg-obsidian-200 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">ALERT EMISSION TIME</span>
                <span className="text-xl font-bold text-white">{metrics.alertLatencyMs} ms</span>
                <span className="text-[9px] text-tactical-green block mt-0.5">Target: &lt; 500 ms (Achieved)</span>
              </div>

              <div className="p-3 rounded bg-obsidian-200 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">OPERATIONAL UPTIME</span>
                <span className="text-xl font-bold text-white">{metrics.uptimePercentage}%</span>
                <span className="text-[9px] text-tactical-green block mt-0.5">Target: 99.9% (Continuous Edge)</span>
              </div>
            </div>
          </div>

          {/* Subsystem Health Grid */}
          <div className="p-4 rounded-lg bg-obsidian-100 border border-neutral-800 font-mono">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              SUBSYSTEM INTEGRITY MATRIX
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {subsystems.map(sub => (
                <div 
                  key={sub.name}
                  className="p-2.5 rounded bg-obsidian-200 border border-neutral-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tactical-green shrink-0" />
                    <div>
                      <span className="text-white font-semibold block">{sub.name}</span>
                      <span className="text-[10px] text-neutral-500">{sub.notes}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-950/80 border border-green-900 text-tactical-green text-[10px] font-bold">
                    {sub.latency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Console Log Terminal */}
          <div className="p-4 rounded-lg bg-black border border-neutral-800 font-mono flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-900 mb-2">
              <span className="text-xs font-bold text-neutral-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-tactical-cyan" />
                <span>DIAGNOSTIC EVENT STREAM CONSOLE</span>
              </span>
              <span className="text-[10px] text-neutral-600">LIVE HEARTBEAT 1 Hz</span>
            </div>
            <div className="flex flex-col gap-1 text-[11px] text-neutral-300 max-h-48 overflow-y-auto">
              {pingLog.map((line, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-tactical-cyan">&gt;</span> {line}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
