"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  ChevronRight, 
  ArrowDown, 
  Video, 
  Scan, 
  Cpu, 
  Maximize2, 
  Activity, 
  Car, 
  UserCheck, 
  ShieldAlert, 
  Check, 
  Layers, 
  Server, 
  Compass, 
  Sparkles,
  Terminal,
  Crosshair,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FloatingNav } from '@/components/common/FloatingNav';
import { TacticalCursor } from '@/components/common/TacticalCursor';

export default function LandingPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [plateHovered, setPlateHovered] = useState(false);
  const [selectedPipelineStage, setSelectedPipelineStage] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState('01');
  const [isInitializing, setIsInitializing] = useState(false);
  const [initStage, setInitStage] = useState('INITIALIZING EDGE NETWORK...');

  // Simulated pipeline stages for "From Camera to Intelligence"
  const pipelineStages = [
    {
      title: 'RTSP INGESTION',
      sub: 'CAM-01 / 1920x1080 @ 29 FPS',
      desc: 'Hardware accelerated H.264/H.265 RTSP feed ingestion via NVDEC video pipeline without network latency.',
      metric: '8ms Latency',
      tag: 'STAGE 01',
    },
    {
      title: 'YOLOV8x DETECTION',
      sub: 'TensorRT INT8 Neural Accelerator',
      desc: 'High-throughput boundary object detection categorizing persons, light vehicles, heavy trucks, and vessels.',
      metric: '22ms / 94% Conf',
      tag: 'STAGE 02',
    },
    {
      title: 'DEEPSORT TRACKING',
      sub: 'Kalman Filter + ReID Embeddings',
      desc: 'Persistent spatiotemporal tracking associating target ID-042 across occlusions, tree coverage, and terrain dips.',
      metric: '0 Lost Frames',
      tag: 'STAGE 03',
    },
    {
      title: 'ANOMALY ENGINE',
      sub: 'Spatiotemporal Behavioral Rules',
      desc: 'Real-time calculation of loiter dwell time (64s), rapid sprint velocity vectors, and virtual fence breaches.',
      metric: 'CRITICAL Status',
      tag: 'STAGE 04',
    },
    {
      title: 'ALERT DISPATCH',
      sub: 'Sub-second Local Bus Broadcast',
      desc: 'Instant alerting dispatched to border outpost operator terminals in under 420 milliseconds.',
      metric: '<420ms End-to-End',
      tag: 'STAGE 05',
    },
  ];

  // Auto-progress pipeline demonstration
  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedPipelineStage((prev) => (prev + 1) % pipelineStages.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [pipelineStages.length]);

  return (
    <main className="relative min-h-screen bg-obsidian text-neutral-100 font-sans selection:bg-neutral-800 selection:text-white">
      <TacticalCursor />
      <FloatingNav />

      {/* Subtle Right-Side Vertical Progress Indicator */}
      <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center gap-4 pointer-events-none select-none">
        <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase [writing-mode:vertical-lr]">
          SECTION / {currentSectionIndex}
        </span>
        <div className="w-[1px] h-24 bg-neutral-800 relative">
          <div 
            className="absolute top-0 left-0 w-full bg-neutral-200 transition-all duration-300"
            style={{ height: `${(parseInt(currentSectionIndex) / 6) * 100}%` }}
          />
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 08 & 09 — HERO SECTION: CINEMATIC EDITORIAL OPENING                      */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen flex flex-col justify-between p-6 md:p-12 lg:p-16 border-b border-neutral-900 overflow-hidden">
        {/* Background Cinematic Visual with Atmospheric Vignette */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <img
            src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=85"
            alt="Border Terrain Night Surveillance"
            className="w-full h-full object-cover opacity-35 filter contrast-125 grayscale-[30%] scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 scanline-layer opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-transparent to-obsidian" />
        </div>

        {/* Top Micro-Telemetry Row */}
        <div className="relative z-10 flex items-center justify-between pt-16 md:pt-14 font-mono text-[10px] tracking-widest text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-tactical-green animate-pulse" />
            <span className="text-neutral-200 font-bold">SYSTEM ACTIVE</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-400">DEFENSE INTELLIGENCE PLATFORM</span>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <span>BOP-17 SECTOR</span>
            <span className="text-neutral-600">/</span>
            <span>RTSP 1080P29</span>
            <span className="text-neutral-600">/</span>
            <span className="text-tactical-green font-bold">EDGE NODE ONLINE</span>
          </div>
        </div>

        {/* Center: Massive Architectural Editorial Typography */}
        <div className="relative z-10 my-auto py-12 flex flex-col">
          <div className="font-mono text-xs md:text-sm tracking-tactical text-neutral-400 uppercase font-semibold mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-tactical-cyan rounded-full" />
            <span>SIH26187 // INTELLIGENT BORDER VIDEO ANALYTICS PLATFORM</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white uppercase leading-[0.88] select-none">
            INTELLIGENT<br />
            BORDER<br />
            SURVEILLANCE.
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-end">
            <div className="lg:col-span-6 flex flex-col gap-4">
              <p className="text-base sm:text-xl text-neutral-300 font-light leading-relaxed max-w-xl">
                Transforming conventional border CCTV infrastructure into an edge-first, autonomous computer vision network. Real-time intrusion detection, DeepSORT object tracking, and ANPR without mandatory cloud connectivity.
              </p>

              {/* Core Philosophy Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded bg-neutral-900/90 border border-neutral-700 text-white font-bold">
                  THE SYSTEM SEES.
                </span>
                <span className="px-2.5 py-1 rounded bg-neutral-900/90 border border-neutral-700 text-white font-bold">
                  THE SYSTEM UNDERSTANDS.
                </span>
                <span className="px-2.5 py-1 rounded bg-neutral-900/90 border border-neutral-700 text-white font-bold">
                  THE SYSTEM RESPONDS.
                </span>
              </div>
            </div>

            {/* CTAs & Quick Launch */}
            <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center lg:justify-end gap-4">
              <Link
                href="/command-center"
                data-cursor="COMMAND"
                className="group relative flex items-center gap-3 px-6 py-4 rounded bg-neutral-100 text-neutral-950 font-mono text-xs font-bold tracking-wider hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all active:scale-95"
              >
                <span className="w-2 h-2 rounded-full bg-tactical-green animate-pulse" />
                <span>ENTER COMMAND CENTER</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#system"
                data-cursor="DISCOVER"
                className="flex items-center gap-2 px-5 py-4 rounded border border-neutral-700 hover:border-neutral-500 bg-neutral-900/60 font-mono text-xs text-neutral-300 transition-colors"
              >
                <span>EXPLORE THE SYSTEM</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Hero Metadata Strip */}
        <div className="relative z-10 pt-6 border-t border-neutral-900 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div>
            <span className="text-[9px] text-neutral-500 block uppercase font-semibold">PROCESSING PARADIGM</span>
            <span className="text-neutral-200 font-bold">EDGE-FIRST COMPUTATION</span>
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 block uppercase font-semibold">STREAM LATENCY</span>
            <span className="text-tactical-green font-bold">&lt; 100ms INFERENCE</span>
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 block uppercase font-semibold">SURVEILLANCE CYCLE</span>
            <span className="text-neutral-200 font-bold">24 / 7 CONTINUOUS SCAN</span>
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 block uppercase font-semibold">INFRASTRUCTURE REUSE</span>
            <span className="text-tactical-cyan font-bold">100% EXISTING CCTV</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11 & 12 — THE PROBLEM: CONVENTIONAL CCTV VS IBVAP                         */}
      {/* ========================================================================= */}
      <section id="system" className="p-6 md:p-14 lg:p-20 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          {/* Section Header */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-tactical text-neutral-500 uppercase font-semibold">
              01 // CRITICAL OPERATIONAL DEFICIENCY
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white">
              THE PROBLEM.
            </h2>
            <p className="text-lg sm:text-2xl text-neutral-400 font-light max-w-3xl">
              Traditional CCTV sees. It does not understand.
            </p>
          </div>

          {/* Comparative Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Conventional CCTV */}
            <div className="p-6 md:p-8 rounded bg-neutral-950 border border-neutral-900 flex flex-col justify-between gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80">
                <span className="font-mono text-xs font-bold tracking-wider text-neutral-400 uppercase">
                  CONVENTIONAL BORDER CCTV
                </span>
                <span className="px-2 py-0.5 rounded bg-red-950/40 border border-red-900/60 font-mono text-[9px] text-tactical-red">
                  LEGACY SHORTFALL
                </span>
              </div>

              <div className="flex flex-col gap-4 font-mono text-xs">
                {[
                  { title: 'PASSIVE RECORDING ONLY', desc: 'Streams saved to DVR/NVR without immediate automated threat detection.' },
                  { title: 'OPERATOR FATIGUE AT SCALE', desc: 'Human cognitive vigilance drops sharply after 20 minutes of monitoring 16+ feeds.' },
                  { title: 'DELAYED FORENSIC RESPONSE', desc: 'Breaches discovered hours or days later after manual fast-forwarding.' },
                  { title: 'ZERO IDENTITY RE-ID', desc: 'No persistent object tracking when suspects move between camera sectors.' },
                  { title: 'EXPENSIVE HARDWARE UPGRADES', desc: 'Proprietary smart cameras require replacing entire legacy border installations.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded bg-neutral-900/40 border border-neutral-800/50">
                    <span className="text-tactical-red font-bold">×</span>
                    <div>
                      <div className="font-bold text-neutral-200">{item.title}</div>
                      <div className="text-neutral-400 text-[11px] leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded bg-black/60 border border-neutral-900 font-mono text-[10px] text-neutral-500">
                RESULT: UNPREDICTABLE BLIND SPOTS &amp; SLOW THREAT MITIGATION.
              </div>
            </div>

            {/* Right: IBVAP Architecture */}
            <div className="p-6 md:p-8 rounded bg-obsidian-200 border border-neutral-800 flex flex-col justify-between gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <span className="font-mono text-xs font-bold tracking-wider text-white uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tactical-green animate-pulse" />
                  <span>IBVAP INTELLIGENT PLATFORM</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/60 font-mono text-[9px] text-tactical-green">
                  EDGE-FIRST AI
                </span>
              </div>

              <div className="flex flex-col gap-4 font-mono text-xs">
                {[
                  { title: 'REAL-TIME YOLOV8 INFERENCE', desc: 'Sub-100ms detection of humans, vehicles, and vessels across standard RTSP streams.' },
                  { title: 'PERSISTENT DEEPSORT TRACKING', desc: 'Single object assigned a persistent tracking token across multiple border camera angles.' },
                  { title: 'AUTOMATED VIRTUAL FENCE TRIPWIRES', desc: 'Instant perimeter breach notifications when polygonal boundaries are penetrated.' },
                  { title: 'AUTONOMOUS BEHAVIORAL ANOMALIES', desc: 'Loitering timer counters, sudden sprint detection, and night movement alerts.' },
                  { title: 'RETROFIT ANY CCTV CAMERA', desc: 'Zero camera replacements required. Open RTSP ingestion on low-cost edge nodes.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded bg-neutral-900/80 border border-neutral-700/60">
                    <Check className="w-4 h-4 text-tactical-green shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">{item.title}</div>
                      <div className="text-neutral-300 text-[11px] leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded bg-neutral-900/90 border border-neutral-800 font-mono text-[10px] text-tactical-green flex items-center justify-between">
                <span>OPERATIONAL ADVANTAGE: SUB-SECOND BREACH ALERTS</span>
                <span className="font-bold">&lt; 420MS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13 — FROM CAMERA TO INTELLIGENCE: 5-STAGE TECHNICAL PIPELINE             */}
      {/* ========================================================================= */}
      <section className="p-6 md:p-14 lg:p-20 border-b border-neutral-900 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-tactical text-neutral-500 uppercase font-semibold">
              02 // PIPELINE VISUALIZATION
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white">
              FROM CAMERA TO INTELLIGENCE.
            </h2>
            <p className="text-lg text-neutral-400 font-light max-w-2xl">
              Watch how raw RTSP video bytes transform into tactical operator decisions on the edge.
            </p>
          </div>

          {/* Interactive Pipeline Selector */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 font-mono text-xs">
            {pipelineStages.map((stage, idx) => {
              const isSelected = selectedPipelineStage === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedPipelineStage(idx)}
                  className={`p-3 rounded border text-left flex flex-col justify-between transition-all select-none ${
                    isSelected 
                      ? 'bg-neutral-800 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]' 
                      : 'bg-obsidian-200 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-neutral-500">{stage.tag}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-tactical-green' : 'bg-neutral-600'}`} />
                  </div>
                  <div className="font-bold text-xs uppercase mb-1">{stage.title}</div>
                  <div className="text-[10px] text-neutral-500 truncate">{stage.metric}</div>
                </button>
              );
            })}
          </div>

          {/* Pipeline Focus Display Panel */}
          <div className="p-6 md:p-8 rounded bg-obsidian-200 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 font-mono">
            <div className="flex flex-col gap-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-tactical-cyan font-bold text-xs">
                  {pipelineStages[selectedPipelineStage].tag} ACTIVE
                </span>
                <span className="text-neutral-400 text-xs">
                  {pipelineStages[selectedPipelineStage].sub}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                {pipelineStages[selectedPipelineStage].title}
              </h3>

              <p className="text-sm text-neutral-300 font-sans leading-relaxed">
                {pipelineStages[selectedPipelineStage].desc}
              </p>
            </div>

            <div className="p-4 rounded bg-black border border-neutral-800 flex flex-col items-center justify-center gap-1 min-w-[200px]">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">STAGE PERFORMANCE</span>
              <span className="text-xl font-bold text-tactical-green">
                {pipelineStages[selectedPipelineStage].metric}
              </span>
              <span className="text-[9px] text-neutral-400">EDGE PIPELINE CERTIFIED</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14 & 15 — AI PERCEPTION & DEEPSORT TRACKING: PERSON-042                   */}
      {/* ========================================================================= */}
      <section id="perception" className="p-6 md:p-14 lg:p-20 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-tactical text-neutral-500 uppercase font-semibold">
              03 // MULTI-OBJECT COMPUTER VISION
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white leading-none">
              THE CAMERA SEES.<br />IBVAP UNDERSTANDS.
            </h2>
            <p className="text-lg sm:text-xl text-neutral-400 font-light max-w-2xl">
              One object. One continuous story. DeepSORT trajectory analysis keeps track of suspects through terrain shifts and camera handoffs.
            </p>
          </div>

          {/* Interactive Surveillance Frame with Live CV Bounding Boxes */}
          <div className="relative aspect-video rounded overflow-hidden border border-neutral-800 bg-neutral-950 select-none">
            <img
              src="https://images.unsplash.com/photo-1566847936715-5e147ef9caec?auto=format&fit=crop&w=1600&q=80"
              alt="Perception Scene"
              className="w-full h-full object-cover filter contrast-115 grayscale-[20%]"
            />
            <div className="absolute inset-0 scanline-layer opacity-40 pointer-events-none" />

            {/* Bounding Box 1: PERSON-042 (Intruder crossing fence) */}
            <div className="absolute top-[38%] left-[44%] w-[14%] h-[32%] border border-tactical-red bg-red-500/10 rounded-sm">
              <div className="absolute -top-6 left-0 px-2 py-0.5 bg-red-950 border border-red-700 font-mono text-[10px] font-bold text-white flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tactical-red animate-ping" />
                <span>PERSON ID-042 94%</span>
              </div>
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />
            </div>

            {/* Bounding Box 2: TRUCK-031 */}
            <div className="absolute top-[48%] left-[72%] w-[18%] h-[28%] border border-tactical-cyan bg-cyan-500/10 rounded-sm">
              <div className="absolute -top-6 left-0 px-2 py-0.5 bg-neutral-900 border border-tactical-cyan font-mono text-[10px] font-bold text-tactical-cyan">
                TRUCK ID-031 89%
              </div>
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
            </div>

            {/* Telemetry Watermark */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/80 border border-neutral-800 rounded font-mono text-xs text-neutral-300">
              CAM-01 / BORDER FENCE NORTH // DEEPSORT TRAJECTORY ACTIVE
            </div>
          </div>

          {/* DeepSORT Trajectory Timeline Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
            {[
              { time: '14:21:04 IST', event: 'FIRST SEEN', cam: 'CAM-01 NORTH', status: 'CONF 89%' },
              { time: '14:23:11 IST', event: 'ENTERED ZONE A', cam: 'BUFFER PERIMETER', status: 'VEL: 4.2 KM/H' },
              { time: '14:24:55 IST', event: 'APPROACHED FENCE', cam: 'ZONE B BOUNDARY', status: 'SPEED REDUCING' },
              { time: '14:27:02 IST', event: 'CROSS-CAM RE-ID', cam: 'CAM-03 HANDOFF', status: 'ID RETAINED' },
              { time: '14:28:09 IST', event: 'LOITER ANOMALY', cam: '64 SEC DWELL', status: 'ALERT TRIGGERED' }
            ].map((step, idx) => (
              <div key={idx} className="p-3 rounded bg-obsidian-200 border border-neutral-800 flex flex-col gap-1">
                <span className="text-[9px] text-neutral-500 uppercase">{step.time}</span>
                <span className="font-bold text-white text-xs">{step.event}</span>
                <span className="text-[10px] text-neutral-400">{step.cam}</span>
                <span className="text-[9px] text-tactical-green font-semibold pt-1 border-t border-neutral-800/80">
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 16 & 17 — ANPR VEHICLE INTELLIGENCE & OCR VERIFICATION                   */}
      {/* ========================================================================= */}
      <section id="anpr" className="p-6 md:p-14 lg:p-20 border-b border-neutral-900 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-tactical text-neutral-500 uppercase font-semibold">
              04 // VEHICLE INTELLIGENCE
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white">
              AUTOMATIC NUMBER PLATE RECOGNITION.
            </h2>
            <p className="text-lg text-neutral-400 font-light max-w-2xl">
              Zero-latency license plate character segmentation and instant verification against logistics and watchlists.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Vehicle Frame with Crop Action */}
            <div className="lg:col-span-7 relative aspect-video rounded overflow-hidden border border-neutral-800 bg-neutral-950">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
                alt="Vehicle ANPR Frame"
                className="w-full h-full object-cover filter contrast-110"
              />
              <div className="absolute inset-0 scanline-layer opacity-40 pointer-events-none" />
              {/* Plate Crop Box */}
              <div className="absolute bottom-[28%] left-[36%] w-32 h-12 border-2 border-tactical-green bg-green-500/15 rounded flex items-center justify-center animate-pulse">
                <span className="font-mono text-[10px] font-bold text-tactical-green bg-black/80 px-1 rounded">
                  TN01AB1234
                </span>
              </div>
            </div>

            {/* OCR Telemetry Panel */}
            <div className="lg:col-span-5 p-6 rounded bg-obsidian-200 border border-neutral-800 flex flex-col gap-4 font-mono">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                  OCR INFERENCE AUDIT
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-tactical-green text-[10px] font-bold">
                  HIGH CONFIDENCE
                </span>
              </div>

              {/* License Plate Display */}
              <div className="px-4 py-3 rounded bg-amber-400 text-neutral-950 font-mono font-black text-2xl tracking-widest flex items-center gap-3 shadow-lg">
                <div className="text-[9px] font-bold border-r border-neutral-900 pr-2 leading-none text-blue-900">
                  IND
                </div>
                <span>TN01AB1234</span>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between border-b border-neutral-800/80 pb-1 text-neutral-400">
                  <span>OCR CONFIDENCE:</span>
                  <span className="font-bold text-tactical-green">88.4%</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/80 pb-1 text-neutral-400">
                  <span>FORMAT VALIDATION:</span>
                  <span className="font-bold text-white">VALID (INDIAN STANDARD)</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/80 pb-1 text-neutral-400">
                  <span>VEHICLE CLASSIFICATION:</span>
                  <span className="font-bold text-white">COMMERCIAL LOGISTICS TRUCK</span>
                </div>
                <div className="flex justify-between pb-1 text-neutral-400">
                  <span>STOLEN / HOTLIST STATUS:</span>
                  <span className="font-bold text-tactical-green">CLEAR // VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 32 & 33 — EDGE-FIRST ARCHITECTURE: WHY CLOUD-FREE MATTERS                */}
      {/* ========================================================================= */}
      <section id="architecture" className="p-6 md:p-14 lg:p-20 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-tactical text-neutral-500 uppercase font-semibold">
              05 // OPERATIONAL RESILIENCE
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white leading-tight">
              INTELLIGENCE DOESN'T<br />NEED THE CLOUD.
            </h2>
            <p className="text-lg text-neutral-400 font-light max-w-2xl">
              Remote Border Outposts (BOPs) frequently face fiber cuts, jamming, and zero WAN connectivity. IBVAP processes every video frame locally on the edge node.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-6 rounded bg-obsidian-200 border border-neutral-800 flex flex-col justify-between gap-4">
              <span className="text-[10px] text-neutral-500 font-bold uppercase">CAPABILITY 01</span>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">100% LOCAL INFERENCE</h3>
                <p className="text-neutral-400 text-xs font-sans leading-relaxed">
                  YOLOv8x and DeepSORT execute on low-power embedded edge accelerators at each border outpost. Zero frame bytes leave the local LAN.
                </p>
              </div>
              <span className="text-tactical-green text-[10px] font-bold">FULL AIR-GAPPED SECURITY</span>
            </div>

            <div className="p-6 rounded bg-obsidian-200 border border-neutral-800 flex flex-col justify-between gap-4">
              <span className="text-[10px] text-neutral-500 font-bold uppercase">CAPABILITY 02</span>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">STORE-AND-FORWARD SYNC</h3>
                <p className="text-neutral-400 text-xs font-sans leading-relaxed">
                  When satellite or RF backhaul becomes available, metadata and incident hashes synchronize asynchronously to National Command without interrupting live alerts.
                </p>
              </div>
              <span className="text-tactical-cyan text-[10px] font-bold">WAN-INDEPENDENT FAILOVER</span>
            </div>

            <div className="p-6 rounded bg-obsidian-200 border border-neutral-800 flex flex-col justify-between gap-4">
              <span className="text-[10px] text-neutral-500 font-bold uppercase">CAPABILITY 03</span>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">RETROFIT COMPATIBLE</h3>
                <p className="text-neutral-400 text-xs font-sans leading-relaxed">
                  Directly ingests existing ONVIF and RTSP video streams from existing legacy cameras. No mandatory smart-camera upgrades or vendor lock-in.
                </p>
              </div>
              <span className="text-tactical-green text-[10px] font-bold">MASSIVE COST SAVINGS</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 34 & 35 — TARGET PERFORMANCE & ECONOMIC VALUE                            */}
      {/* ========================================================================= */}
      <section id="performance" className="p-6 md:p-14 lg:p-20 border-b border-neutral-900 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-tactical text-neutral-500 uppercase font-semibold">
              06 // TARGET SPECIFICATIONS
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white">
              PERFORMANCE TARGETS.
            </h2>
            <p className="text-lg text-neutral-400 font-light">
              Engineering targets for production prototype deployment.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
            <div className="p-6 rounded bg-obsidian-200 border border-neutral-800 flex flex-col gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-white">24+</span>
              <span className="text-xs text-neutral-400 uppercase font-bold">FPS STREAM PROCESSING</span>
              <span className="text-[10px] text-neutral-500">Per camera feed channel</span>
            </div>

            <div className="p-6 rounded bg-obsidian-200 border border-neutral-800 flex flex-col gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-tactical-green">&lt;100ms</span>
              <span className="text-xs text-neutral-400 uppercase font-bold">EDGE INFERENCE LATENCY</span>
              <span className="text-[10px] text-neutral-500">YOLOv8x TensorRT INT8</span>
            </div>

            <div className="p-6 rounded bg-obsidian-200 border border-neutral-800 flex flex-col gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-tactical-cyan">&lt;500ms</span>
              <span className="text-xs text-neutral-400 uppercase font-bold">ALERT LATENCY</span>
              <span className="text-[10px] text-neutral-500">Camera breach to terminal</span>
            </div>

            <div className="p-6 rounded bg-obsidian-200 border border-neutral-800 flex flex-col gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-white">&gt;85%</span>
              <span className="text-xs text-neutral-400 uppercase font-bold">DETECTION ACCURACY</span>
              <span className="text-[10px] text-neutral-500">Target performance benchmark</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 62 — FINAL CALL TO ACTION: TRANSITION TO COMMAND CENTER                  */}
      {/* ========================================================================= */}
      <section className="p-8 md:p-16 lg:p-24 bg-obsidian-200 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="max-w-3xl flex flex-col items-center gap-6 relative z-10">
          <span className="font-mono text-xs tracking-tactical text-tactical-green uppercase font-bold">
            SYSTEM READY // BOP-17 NORTH SECTOR
          </span>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase text-white tracking-tight leading-tight">
            ENTER MISSION CONTROL.
          </h2>

          <p className="text-base sm:text-lg text-neutral-300 font-light max-w-xl">
            Experience the real-time operational interface with live multi-camera feeds, interactive intrusion zones, and instantaneous threat dispatch.
          </p>

          <button
            onClick={() => {
              setIsInitializing(true);
              setInitStage('SYSTEM INITIALIZING...');
              setTimeout(() => setInitStage('EDGE NETWORK CONNECTING...'), 350);
              setTimeout(() => setInitStage('CAMERAS ONLINE (4 CHANNELS)...'), 700);
              setTimeout(() => setInitStage('AI INFERENCE PIPELINE ONLINE...'), 1050);
              setTimeout(() => setInitStage('TRACKING & ALERT ENGINE ONLINE...'), 1400);
              setTimeout(() => router.push('/command-center'), 1750);
            }}
            data-cursor="LAUNCH"
            className="group mt-4 flex items-center gap-3 px-8 py-4 rounded bg-neutral-100 text-neutral-950 font-mono text-sm font-bold tracking-wider hover:bg-white hover:shadow-[0_0_35px_rgba(255,255,255,0.35)] transition-all active:scale-95 cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-tactical-green animate-pulse" />
            <span>INITIALIZE COMMAND CENTER</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Cinematic Transition Overlay */}
      {isInitializing && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 font-mono select-none animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white mb-6 text-lg font-bold shadow-2xl">
            IB
          </div>
          <span className="text-xs text-neutral-500 uppercase tracking-widest mb-2 font-bold">
            BOP-17 DEFENSE EDGE COMPUTING CLUSTER
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wider mb-6 text-center animate-pulse">
            {initStage}
          </h3>
          <div className="w-64 bg-neutral-900 rounded-full h-1.5 overflow-hidden border border-neutral-800">
            <div className="bg-tactical-cyan h-full w-full animate-pulse" />
          </div>
          <span className="text-[10px] text-neutral-600 mt-4 tracking-widest uppercase">
            SIH26187 SECURE PROTOCOL INITIALIZATION
          </span>
        </div>
      )}

      {/* Editorial Footer */}
      <footer className="p-6 md:p-8 border-t border-neutral-900 bg-black font-mono text-xs text-neutral-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-300">IBVAP</span>
          <span>— INTELLIGENT BORDER VIDEO ANALYTICS PLATFORM</span>
        </div>
        <div>
          <span>SIH26187 // AI-BASED VIDEO ANALYTICS FOR BORDER SURVEILLANCE</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-tactical-amber" />
          <span>PROTOTYPE // SIMULATED DEFENSE TELEMETRY</span>
        </div>
      </footer>
    </main>
  );
}
