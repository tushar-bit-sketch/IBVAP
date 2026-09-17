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
    <div className="flex flex-col h-screen bg-[#faf8f5] text-stone-900 overflow-hidden font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto bg-[#faf8f5] p-4 gap-4">
          {/* Header */}
          <div className="p-4 border border-sandal-200 rounded-lg bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-sandal-600" />
                <h1 className="font-mono text-base font-bold text-stone-950 tracking-wider">
                  TECHNICAL OBSERVABILITY &amp; SYSTEM DIAGNOSTICS
                </h1>
                <span className="px-2 py-0.5 rounded bg-sandal-100 border border-sandal-200 font-mono text-[10px] text-sandal-800 font-semibold">
                  SIH26187 BENCHMARK
                </span>
              </div>
              <p className="font-mono text-xs text-stone-600 mt-1">
                Real-time sub-millisecond pipeline diagnostics, API response latency, and component health monitoring.
              </p>
            </div>

            <button
              onClick={runPingTest}
              disabled={pingRunning}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-stone-900 border border-stone-800 text-white hover:bg-stone-800 font-mono text-xs transition-colors self-start sm:self-auto shadow-2xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sandal-300 ${pingRunning ? 'animate-spin' : ''}`} />
              <span>{pingRunning ? 'DIAGNOSING...' : 'RUN PIPELINE DIAGNOSTIC'}</span>
            </button>
          </div>

          {/* Real-time Performance Target vs Simulated Benchmark */}
          <div className="p-4 rounded-lg bg-white border border-sandal-200 font-mono shadow-2xs">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>TARGET PERFORMANCE METRICS (COMPETITION BENCHMARKS)</span>
              <span className="text-[10px] text-sandal-700 font-semibold">SIMULATED BENCHMARK DATA</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#faf8f5] border border-sandal-200">
                <span className="text-[10px] text-stone-500 font-semibold block">STREAM FRAME RATE</span>
                <span className="text-xl font-bold text-stone-950">{metrics.fpsAverage} FPS</span>
                <span className="text-[9px] text-emerald-700 block mt-0.5 font-medium">Target: &gt; 24.0 FPS (Achieved)</span>
              </div>

              <div className="p-3 rounded-lg bg-[#faf8f5] border border-sandal-200">
                <span className="text-[10px] text-stone-500 font-semibold block">AI INFERENCE LATENCY</span>
                <span className="text-xl font-bold text-stone-950">{metrics.inferenceLatencyMs} ms</span>
                <span className="text-[9px] text-emerald-700 block mt-0.5 font-medium">Target: &lt; 100 ms (Achieved)</span>
              </div>

              <div className="p-3 rounded-lg bg-[#faf8f5] border border-sandal-200">
                <span className="text-[10px] text-stone-500 font-semibold block">ALERT EMISSION TIME</span>
                <span className="text-xl font-bold text-stone-950">{metrics.alertLatencyMs} ms</span>
                <span className="text-[9px] text-emerald-700 block mt-0.5 font-medium">Target: &lt; 500 ms (Achieved)</span>
              </div>

              <div className="p-3 rounded-lg bg-[#faf8f5] border border-sandal-200">
                <span className="text-[10px] text-stone-500 font-semibold block">OPERATIONAL UPTIME</span>
                <span className="text-xl font-bold text-stone-950">{metrics.uptimePercentage}%</span>
                <span className="text-[9px] text-emerald-700 block mt-0.5 font-medium">Target: 99.9% (Continuous Edge)</span>
              </div>
            </div>
          </div>

          {/* Subsystem Health Grid */}
          <div className="p-4 rounded-lg bg-white border border-sandal-200 font-mono shadow-2xs">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
              SUBSYSTEM INTEGRITY MATRIX
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
              {subsystems.map(sub => (
                <div 
                  key={sub.name}
                  className="p-3 rounded-lg bg-[#faf8f5] border border-sandal-200 flex items-center justify-between hover:border-sandal-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-stone-900 font-bold block">{sub.name}</span>
                      <span className="text-[10px] text-stone-500">{sub.notes}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                    {sub.latency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Console Log Terminal */}
          <div className="p-4 rounded-lg bg-[#1c1917] border border-stone-800 font-mono flex flex-col shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-2">
              <span className="text-xs font-bold text-sandal-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-sandal-400" />
                <span>DIAGNOSTIC EVENT STREAM CONSOLE</span>
              </span>
              <span className="text-[10px] text-stone-400 font-medium">LIVE HEARTBEAT 1 Hz</span>
            </div>
            <div className="flex flex-col gap-1 text-[11px] text-stone-200 max-h-48 overflow-y-auto">
              {pingLog.map((line, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-sandal-400 font-bold">&gt;</span> {line}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
