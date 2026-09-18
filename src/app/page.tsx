"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FloatingNav } from '@/components/common/FloatingNav';
import { SpideySenseLogo, Sih2026Logo } from '@/components/common/BrandIdentity';

export default function LandingPage() {
  const router = useRouter();
  const [selectedPipelineStage, setSelectedPipelineStage] = useState(0);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initStage, setInitStage] = useState('Initializing edge network...');

  const pipelineStages = [
    {
      title: 'RTSP INGESTION',
      sub: 'CAM-01 / 1920x1080 @ 29 FPS',
      desc: 'Hardware-accelerated H.264/H.265 RTSP feed ingestion via NVDEC video pipeline without network latency.',
      metric: '8 ms',
      metricLabel: 'target latency',
      tag: 'Stage 01',
    },
    {
      title: 'YOLOV8x DETECTION',
      sub: 'TensorRT INT8 neural accelerator',
      desc: 'High-throughput boundary object detection categorising persons, light vehicles, heavy trucks, and vessels.',
      metric: '22 ms / 94%',
      metricLabel: 'target / conf. [demo]',
      tag: 'Stage 02',
    },
    {
      title: 'DEEPSORT TRACKING',
      sub: 'Multi-camera ReID pipeline',
      desc: 'Spatio-temporal trajectory correlation preserving subject identity across terrain transitions and line-of-sight occlusions.',
      metric: '< 1 frame loss',
      metricLabel: 'handoff target [demo]',
      tag: 'Stage 03',
    },
    {
      title: 'ANOMALY ENGINE',
      sub: 'Virtual tripwires & loitering',
      desc: 'Autonomous spatial rule evaluation flagging fence line breaches, abnormal direction-of-travel, and dwell-time violations.',
      metric: 'CRITICAL',
      metricLabel: 'threat triage level',
      tag: 'Stage 04',
    },
    {
      title: 'ALERT DISPATCH',
      sub: 'Zero-cloud local notification',
      desc: 'Immediate sub-second tactical dispatch to command terminals, patrol radios, and cryptographic audit logs.',
      metric: '< 420 ms',
      metricLabel: 'end-to-end target',
      tag: 'Stage 05',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedPipelineStage((prev) => (prev + 1) % pipelineStages.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [pipelineStages.length]);

  return (
    <main className="relative min-h-screen bg-obsidian text-stone-900 font-sans selection:bg-sandal-200 selection:text-stone-900">
      <FloatingNav />

      {/* ===================================================================== */}
      {/* HERO                                                                  */}
      {/* ===================================================================== */}
      <section className="relative min-h-screen flex flex-col justify-between pt-14 px-6 md:px-12 lg:px-16 pb-8 border-b border-sandal-200 overflow-hidden bg-gradient-to-b from-white via-obsidian to-sandal-100/40">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=85"
            alt="Arid Border Terrain"
            className="w-full h-full object-cover opacity-15 filter contrast-105"
          />
          <div className="absolute inset-0 scanline-layer opacity-40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-transparent to-obsidian/90" />
        </div>

        {/* Top micro-telemetry row */}
        <div className="relative z-10 flex items-center justify-between pt-6 md:pt-4 font-mono text-[10px] text-stone-600">
          <div className="flex items-center gap-2.5 bg-white/80 border border-sandal-200 px-3 py-1 rounded-sm shadow-xs backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-stone-900 font-semibold">System active</span>
            <span className="text-sandal-400">·</span>
            <span className="text-stone-600">Defense intelligence platform</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 bg-white/80 border border-sandal-200 px-3 py-1 rounded-sm shadow-xs backdrop-blur-xs">
            <span>BOP-17 sector</span>
            <span className="text-sandal-400">·</span>
            <span>RTSP 1080p29</span>
            <span className="text-sandal-400">·</span>
            <span className="text-emerald-700 font-medium">Edge node online</span>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 my-auto py-10 flex flex-col gap-6">
          {/* Canonical team & event attribution chip */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] mb-1">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/95 border border-sandal-200/90 shadow-2xs">
              <SpideySenseLogo size="xs" className="h-4 w-4" />
              <span className="font-bold text-stone-950 tracking-wider text-[10px]">TEAM SPIDEY SENSE</span>
            </div>
            <span className="text-sandal-400 hidden sm:inline">·</span>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/95 border border-sandal-200/90 shadow-2xs">
              <Sih2026Logo size="xs" className="h-4" />
              <span className="text-stone-700 font-semibold tracking-wider text-[10px]">SIH #26187</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-stone-950 leading-[0.9] select-none">
            Intelligent<br />
            border<br />
            surveillance.
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <p className="text-base sm:text-lg text-stone-700 font-normal leading-relaxed max-w-xl">
                Transforms conventional border CCTV infrastructure into an edge-first, autonomous computer vision network. Real-time intrusion detection, DeepSORT object tracking, and ANPR — with no mandatory cloud connectivity.
              </p>
              <p className="text-sm text-stone-600 font-normal leading-relaxed max-w-xl">
                Processes every video frame locally on embedded edge hardware at each Border Outpost. Sub-second alert dispatch. Zero camera replacements.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row items-start sm:items-center lg:justify-end gap-3">
              <Link
                href="/command-center"
                className="group flex items-center gap-2.5 px-5 py-3 rounded-sm bg-stone-900 text-white font-mono text-xs font-semibold hover:bg-stone-800 transition-colors duration-150 active:scale-95 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Open command center</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
              </Link>
              <a
                href="#system"
                className="flex items-center gap-2 px-4 py-3 rounded-sm border border-sandal-300 hover:border-sandal-500 bg-white/80 font-mono text-xs text-stone-700 hover:text-stone-950 transition-colors duration-150 shadow-xs"
              >
                System overview ↓
              </a>
            </div>
          </div>
        </div>

        {/* Bottom metadata strip */}
        <div className="relative z-10 pt-5 border-t border-sandal-200 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-white/70 border border-sandal-200/80 p-3 rounded-sm">
            <span className="text-[9px] text-sandal-700 block uppercase font-semibold mb-0.5">Processing paradigm</span>
            <span className="text-stone-900 font-semibold">Edge-first computation</span>
          </div>
          <div className="bg-white/70 border border-sandal-200/80 p-3 rounded-sm">
            <span className="text-[9px] text-sandal-700 block uppercase font-semibold mb-0.5">Inference latency</span>
            <span className="text-emerald-700 font-semibold">&lt; 100 ms <span className="text-stone-500 font-normal">[target]</span></span>
          </div>
          <div className="bg-white/70 border border-sandal-200/80 p-3 rounded-sm">
            <span className="text-[9px] text-sandal-700 block uppercase font-semibold mb-0.5">Surveillance cycle</span>
            <span className="text-stone-900 font-semibold">24 h / 7 d continuous</span>
          </div>
          <div className="bg-white/70 border border-sandal-200/80 p-3 rounded-sm">
            <span className="text-[9px] text-sandal-700 block uppercase font-semibold mb-0.5">Infrastructure reuse</span>
            <span className="text-stone-900 font-semibold">100% existing CCTV</span>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 01 — THE PROBLEM                                                      */}
      {/* ===================================================================== */}
      <section id="system" className="px-6 md:px-14 lg:px-20 py-16 md:py-20 border-b border-sandal-200 bg-obsidian">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-sandal-800 uppercase tracking-wider font-semibold">01 — Operational context</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-950">
              The problem with passive CCTV.
            </h2>
            <p className="text-base text-stone-600 font-normal max-w-2xl mt-1">
              Traditional CCTV records. It does not analyse, understand, or respond.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left: Conventional CCTV */}
            <div className="p-6 rounded-sm bg-white border border-sandal-200 shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-sandal-200">
                <span className="font-mono text-[10px] text-stone-600 uppercase tracking-wider font-semibold">Conventional border CCTV</span>
                <span className="px-2 py-0.5 rounded-sm bg-red-50 border border-red-200 font-mono text-[9px] text-red-700 font-medium">Legacy shortfall</span>
              </div>
              <div className="flex flex-col gap-3 font-mono text-xs">
                {[
                  { title: 'Passive recording only', desc: 'Streams saved to DVR/NVR without automated threat detection.' },
                  { title: 'Operator fatigue at scale', desc: 'Cognitive vigilance drops sharply after 20 minutes on 16+ feeds.' },
                  { title: 'Delayed forensic response', desc: 'Breaches discovered hours later through manual fast-forwarding.' },
                  { title: 'No identity re-identification', desc: 'Suspects moving between camera sectors are not tracked persistently.' },
                  { title: 'Expensive hardware upgrades', desc: 'Proprietary smart cameras require replacing entire legacy installations.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 py-2 border-b border-sandal-100 last:border-0">
                    <span className="text-red-600 font-bold mt-0.5">x</span>
                    <div>
                      <div className="font-medium text-stone-800">{item.title}</div>
                      <div className="text-stone-500 text-[11px] leading-relaxed mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-mono text-stone-500 pt-1 border-t border-sandal-100">
                Outcome: unpredictable blind spots and slow threat response.
              </div>
            </div>

            {/* Right: IBVAP */}
            <div className="p-6 rounded-sm bg-sandal-100/60 border border-sandal-300/90 shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-sandal-200">
                <span className="font-mono text-[10px] text-stone-900 uppercase tracking-wider font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  IBVAP intelligent platform
                </span>
                <span className="px-2 py-0.5 rounded-sm bg-emerald-50 border border-emerald-200 font-mono text-[9px] text-emerald-800 font-semibold">Edge-first AI</span>
              </div>
              <div className="flex flex-col gap-3 font-mono text-xs">
                {[
                  { title: 'Real-time YOLOv8 inference', desc: 'Sub-100 ms detection of humans, vehicles, and vessels across standard RTSP streams.' },
                  { title: 'Persistent DeepSORT tracking', desc: 'Single object assigned a persistent token across multiple border camera angles.' },
                  { title: 'Automated virtual fence tripwires', desc: 'Instant perimeter breach notifications when polygonal boundaries are crossed.' },
                  { title: 'Behavioural anomaly detection', desc: 'Loitering timers, sprint detection, and night movement alerts — fully autonomous.' },
                  { title: 'Retrofit any CCTV camera', desc: 'Zero camera replacements. Open RTSP ingestion on low-cost edge nodes.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 py-2 border-b border-sandal-200/60 last:border-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-950">{item.title}</div>
                      <div className="text-stone-600 text-[11px] leading-relaxed mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-mono text-emerald-800 pt-1 border-t border-sandal-200/60 flex items-center justify-between font-medium">
                <span>Operational advantage: sub-second breach alerts</span>
                <span className="font-bold text-emerald-700">&lt; 420 ms <span className="text-stone-500 font-normal">[target]</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 02 — PROCESSING PIPELINE                                             */}
      {/* ===================================================================== */}
      <section className="px-6 md:px-14 lg:px-20 py-16 md:py-20 border-b border-sandal-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-sandal-800 uppercase tracking-wider font-semibold">02 — Processing pipeline</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-950">
              From raw video to actionable intelligence.
            </h2>
            <p className="text-base text-stone-600 font-normal max-w-2xl mt-1">
              Five sequential processing stages — all running on the local edge node.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 font-mono text-xs">
            {pipelineStages.map((stage, idx) => {
              const isSelected = selectedPipelineStage === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedPipelineStage(idx)}
                  className={`p-3 rounded-sm border text-left flex flex-col justify-between transition-all duration-150 select-none ${
                    isSelected
                      ? 'bg-sandal-200/90 border-sandal-400 text-stone-950 shadow-xs font-semibold'
                      : 'bg-obsidian border-sandal-200 text-stone-600 hover:bg-sandal-100/60 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-medium text-stone-500">{stage.tag}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-500' : 'bg-sandal-400'}`} />
                  </div>
                  <div className="font-semibold text-[11px] mb-0.5">{stage.title}</div>
                  <div className="text-[10px] text-stone-500 truncate">{stage.metric}</div>
                </button>
              );
            })}
          </div>

          <div className="p-6 rounded-sm bg-obsidian border border-sandal-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono shadow-xs">
            <div className="flex flex-col gap-2.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-sm bg-white border border-sandal-200 text-stone-800 text-[10px] font-semibold">
                  {pipelineStages[selectedPipelineStage].tag}
                </span>
                <span className="text-stone-500 text-[10px]">
                  {pipelineStages[selectedPipelineStage].sub}
                </span>
              </div>
              <h3 className="text-xl font-bold text-stone-950 tracking-wide">
                {pipelineStages[selectedPipelineStage].title}
              </h3>
              <p className="text-sm text-stone-600 font-sans leading-relaxed">
                {pipelineStages[selectedPipelineStage].desc}
              </p>
            </div>
            <div className="p-4 rounded-sm bg-white border border-sandal-200 flex flex-col items-start md:items-center justify-center gap-0.5 min-w-[180px] shrink-0 shadow-xs">
              <span className="text-[9px] text-sandal-700 uppercase tracking-wider font-semibold mb-1">Stage performance</span>
              <span className="text-lg font-bold text-emerald-700">
                {pipelineStages[selectedPipelineStage].metric}
              </span>
              <span className="text-[9px] text-stone-500">
                {pipelineStages[selectedPipelineStage].metricLabel}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 03 — PERCEPTION / DEEPSORT                                            */}
      {/* ===================================================================== */}
      <section id="perception" className="px-6 md:px-14 lg:px-20 py-16 md:py-20 border-b border-sandal-200 bg-obsidian">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-sandal-800 uppercase tracking-wider font-semibold">03 — Computer vision pipeline</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-950 leading-tight">
              Object detection and persistent tracking.
            </h2>
            <p className="text-base text-stone-600 font-normal max-w-2xl mt-1">
              DeepSORT trajectory analysis maintains track of a suspect through terrain shifts and cross-camera handoffs using a persistent object token.
            </p>
          </div>

          <div className="relative aspect-video rounded-sm overflow-hidden border border-sandal-300 bg-neutral-950 select-none shadow-md">
            <img
              src="https://images.unsplash.com/photo-1566847936715-5e147ef9caec?auto=format&fit=crop&w=1600&q=80"
              alt="Demo surveillance scene with detection overlay"
              className="w-full h-full object-cover filter contrast-110 grayscale-[30%]"
            />
            <div className="absolute inset-0 scanline-layer opacity-20 pointer-events-none" />
            <div className="absolute top-[38%] left-[44%] w-[14%] h-[32%] border border-red-500 bg-red-500/10 rounded-sm">
              <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-red-950/90 border border-red-800 font-mono text-[9px] font-semibold text-red-200 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-red-400 animate-ping" />
                PERSON ID-042 · 94%
              </div>
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white/60" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-white/60" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-white/60" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white/60" />
            </div>
            <div className="absolute top-[48%] left-[72%] w-[18%] h-[28%] border border-sky-400 bg-sky-500/10 rounded-sm">
              <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-neutral-900/90 border border-sky-600 font-mono text-[9px] font-semibold text-sky-200">
                TRUCK ID-031 · 89%
              </div>
            </div>
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 border border-neutral-800 rounded-sm font-mono text-[9px] text-neutral-300">
              CAM-01 · Border Fence North · DeepSORT active&nbsp;
              <span className="text-amber-400">[Demo footage — simulated detection overlay]</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
            {[
              { time: '14:21:04 IST', event: 'First seen', cam: 'CAM-01 North', status: 'Conf 89%' },
              { time: '14:23:11 IST', event: 'Entered zone A', cam: 'Buffer perimeter', status: 'Vel: 4.2 km/h' },
              { time: '14:24:55 IST', event: 'Approached fence', cam: 'Zone B boundary', status: 'Speed reducing' },
              { time: '14:27:02 IST', event: 'Cross-cam re-ID', cam: 'CAM-03 handoff', status: 'ID retained' },
              { time: '14:28:09 IST', event: 'Loiter anomaly', cam: '64 s dwell', status: 'ALERT triggered' },
            ].map((step, idx) => (
              <div key={idx} className="p-3 rounded-sm bg-white border border-sandal-200 flex flex-col gap-1 shadow-xs">
                <span className="text-[9px] text-stone-500">{step.time}</span>
                <span className="font-semibold text-stone-900 text-[11px]">{step.event}</span>
                <span className="text-[10px] text-stone-500">{step.cam}</span>
                <span className="text-[9px] text-emerald-700 font-semibold pt-1 border-t border-sandal-100 mt-1">
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 04 — ANPR                                                             */}
      {/* ===================================================================== */}
      <section id="anpr" className="px-6 md:px-14 lg:px-20 py-16 md:py-20 border-b border-sandal-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-sandal-800 uppercase tracking-wider font-semibold">04 — Vehicle intelligence</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-950">
              Automatic number plate recognition.
            </h2>
            <p className="text-base text-stone-600 font-normal max-w-2xl mt-1">
              Zero-latency licence plate character segmentation and instant verification against logistics and watchlists.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-7 relative aspect-video rounded-sm overflow-hidden border border-sandal-300 bg-neutral-950 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
                alt="Demo ANPR vehicle frame"
                className="w-full h-full object-cover filter contrast-105 grayscale-[20%]"
              />
              <div className="absolute inset-0 scanline-layer opacity-15 pointer-events-none" />
              <div className="absolute bottom-[28%] left-[36%] w-32 h-12 border border-emerald-500 bg-emerald-500/15 rounded-sm flex items-center justify-center">
                <span className="font-mono text-[10px] font-bold text-emerald-300 bg-black/80 px-1 rounded-sm">
                  TN01AB1234
                </span>
              </div>
              <div className="absolute bottom-2 left-2 font-mono text-[9px] text-neutral-300 bg-black/70 px-2 py-1 rounded-sm border border-neutral-800">
                <span className="text-amber-400">[Demo footage]</span>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-sm bg-obsidian border border-sandal-200 flex flex-col gap-4 font-mono shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-sandal-200">
                <span className="text-[10px] text-stone-600 uppercase tracking-wider font-semibold">OCR inference audit</span>
                <span className="px-2 py-0.5 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] font-semibold">High confidence</span>
              </div>
              <div className="px-4 py-3 rounded-sm bg-amber-400 text-neutral-950 font-mono font-black text-2xl tracking-widest flex items-center gap-3 shadow-xs">
                <div className="text-[9px] font-bold border-r border-neutral-900/50 pr-2 leading-none text-blue-900">IND</div>
                <span>TN01AB1234</span>
              </div>
              <div className="flex flex-col gap-2 text-xs">
                {[
                  { label: 'OCR confidence', value: '88.4%', color: 'text-emerald-700' },
                  { label: 'Format validation', value: 'Valid — Indian standard', color: 'text-stone-900' },
                  { label: 'Vehicle classification', value: 'Commercial logistics truck', color: 'text-stone-900' },
                  { label: 'Stolen / hotlist status', value: 'Clear — verified', color: 'text-emerald-700' },
                ].map((row, idx) => (
                  <div key={idx} className="flex justify-between border-b border-sandal-200/60 pb-1.5 last:border-0">
                    <span className="text-stone-600">{row.label}</span>
                    <span className={`font-semibold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="text-[9px] text-stone-500 pt-1 border-t border-sandal-200/60">
                <span className="text-amber-700">[Demo telemetry]</span> — simulated OCR result
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 05 — EDGE ARCHITECTURE                                               */}
      {/* ===================================================================== */}
      <section id="architecture" className="px-6 md:px-14 lg:px-20 py-16 md:py-20 border-b border-sandal-200 bg-obsidian">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-sandal-800 uppercase tracking-wider font-semibold">05 — Edge architecture</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-950 leading-tight">
              Fully autonomous edge processing — no cloud required.
            </h2>
            <p className="text-base text-stone-600 font-normal max-w-2xl mt-1">
              Remote Border Outposts frequently face fibre cuts, jamming, and zero WAN connectivity. IBVAP processes every video frame locally on the edge node.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {[
              { num: '01', title: 'Local inference only', desc: 'YOLOv8x and DeepSORT execute on low-power embedded edge accelerators at each border outpost. Zero frame bytes leave the local LAN.', tag: 'Air-gapped capable', tagColor: 'text-emerald-700' },
              { num: '02', title: 'Store-and-forward sync', desc: 'When satellite or RF backhaul becomes available, metadata and incident hashes synchronise asynchronously to National Command without interrupting live alerts.', tag: 'WAN-independent failover', tagColor: 'text-blue-700' },
              { num: '03', title: 'Retrofit-compatible', desc: 'Directly ingests existing ONVIF and RTSP video streams from legacy cameras. No mandatory smart-camera upgrades or vendor lock-in.', tag: 'No hardware replacement', tagColor: 'text-emerald-700' },
            ].map((cap, idx) => (
              <div key={idx} className="p-5 rounded-sm bg-white border border-sandal-200 flex flex-col justify-between gap-4 shadow-xs">
                <div>
                  <span className="text-[9px] text-sandal-700 font-bold uppercase mb-2 block">Capability {cap.num}</span>
                  <h3 className="text-sm font-bold text-stone-950 mb-2">{cap.title}</h3>
                  <p className="text-stone-600 text-[11px] font-sans leading-relaxed">{cap.desc}</p>
                </div>
                <span className={`text-[10px] font-semibold ${cap.tagColor}`}>{cap.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 06 — TARGET SPECIFICATIONS                                           */}
      {/* ===================================================================== */}
      <section id="performance" className="px-6 md:px-14 lg:px-20 py-16 md:py-20 border-b border-sandal-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-sandal-800 uppercase tracking-wider font-semibold">06 — Target specifications</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-950">
              Engineering targets.
            </h2>
            <p className="text-sm text-stone-600 font-normal mt-1">
              Benchmarks for production prototype deployment. <span className="text-amber-700">[Demo telemetry — target values, not measured]</span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
            {[
              { value: '24+', unit: 'fps', label: 'Stream processing', sub: 'Per camera channel [target]', color: 'text-stone-950' },
              { value: '<100', unit: 'ms', label: 'Edge inference latency', sub: 'YOLOv8x TensorRT INT8 [target]', color: 'text-emerald-700' },
              { value: '<500', unit: 'ms', label: 'Alert latency', sub: 'Camera breach to terminal [target]', color: 'text-blue-700' },
              { value: '>85', unit: '%', label: 'Detection accuracy', sub: 'Target performance benchmark', color: 'text-stone-950' },
            ].map((metric, idx) => (
              <div key={idx} className="p-5 rounded-sm bg-obsidian border border-sandal-200 flex flex-col gap-1.5 shadow-xs">
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${metric.color}`}>{metric.value}</span>
                  <span className="text-stone-500 text-sm font-medium">{metric.unit}</span>
                </div>
                <span className="text-xs text-stone-800 font-semibold">{metric.label}</span>
                <span className="text-[10px] text-stone-500">{metric.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* FINAL CTA                                                            */}
      {/* ===================================================================== */}
      <section className="px-8 md:px-16 lg:px-24 py-20 md:py-28 bg-gradient-to-b from-sandal-100/60 to-obsidian flex flex-col items-center justify-center text-center relative overflow-hidden border-b border-sandal-200">
        <div className="max-w-2xl flex flex-col items-center gap-5 relative z-10">
          <span className="font-mono text-[10px] text-emerald-800 uppercase tracking-wider font-semibold bg-white/80 border border-sandal-300 px-3 py-1 rounded-sm shadow-xs">
            System ready · BOP-17 North sector
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold text-stone-950 tracking-tight leading-tight">
            Open the command center.
          </h2>

          <p className="text-base text-stone-600 font-normal max-w-xl">
            Real-time multi-camera feeds, interactive intrusion zones, and live threat dispatch — running on simulated edge telemetry.
          </p>

          <button
            onClick={() => {
              setIsInitializing(true);
              setInitStage('Initializing system...');
              setTimeout(() => setInitStage('Connecting to edge network...'), 350);
              setTimeout(() => setInitStage('Cameras online (4 channels)'), 700);
              setTimeout(() => setInitStage('AI inference pipeline ready'), 1050);
              setTimeout(() => setInitStage('Alert engine active'), 1400);
              setTimeout(() => router.push('/command-center'), 1750);
            }}
            className="group mt-2 flex items-center gap-2.5 px-6 py-3.5 rounded-sm bg-stone-900 text-white font-mono text-sm font-semibold hover:bg-stone-800 transition-colors duration-150 active:scale-95 cursor-pointer shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open command center</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
          </button>
        </div>
      </section>

      {/* Transition overlay */}
      {isInitializing && (
        <div className="fixed inset-0 z-50 bg-obsidian flex flex-col items-center justify-center p-6 font-mono select-none animate-in fade-in duration-200">
          <div className="p-2.5 rounded-lg bg-white border border-sandal-300 shadow-md mb-5">
            <SpideySenseLogo size="md" className="h-10 w-10" />
          </div>
          <span className="text-[10px] text-sandal-800 uppercase tracking-wider mb-2 font-semibold">
            BOP-17 defense edge computing cluster
          </span>
          <h3 className="text-lg font-bold text-stone-900 tracking-wider mb-5 text-center">
            {initStage}
          </h3>
          <div className="w-48 bg-sandal-200 rounded-full h-1 overflow-hidden">
            <div className="bg-stone-800 h-full w-full animate-pulse" />
          </div>
          <span className="text-[9px] text-stone-500 mt-4 tracking-widest uppercase">
            SIH #26187 secure protocol initialization
          </span>
        </div>
      )}

      {/* Footer */}
      <footer className="px-6 md:px-10 py-6 border-t border-sandal-200 bg-white font-mono text-[10px] text-stone-600 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-2.5">
          <div className="p-0.5 rounded bg-white border border-sandal-200 shadow-2xs">
            <SpideySenseLogo size="xs" className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-stone-950">IBVAP</span>
            <span className="text-stone-500"> — Built by </span>
            <strong className="text-stone-800 font-semibold">Team SPIDEY SENSE</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-500">Presented for</span>
          <div className="p-1 rounded bg-[#faf8f5] border border-sandal-200 shadow-2xs">
            <Sih2026Logo size="xs" className="h-5" />
          </div>
          <span className="text-stone-700 font-semibold hidden sm:inline">SIH #26187</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>Competition Prototype · Simulated telemetry</span>
        </div>
      </footer>
    </main>
  );
}
