"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { CameraFeed } from '@/components/video/CameraFeed';
import { useSimulation } from '@/context/SimulationContext';
import { 
  Scan, 
  Users, 
  Car, 
  Truck, 
  Activity, 
  Layers, 
  Sliders,
  Cpu,
  Shield,
  Eye,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function DetectionsPage() {
  const { 
    cameras, 
    inferenceMode, 
    setInferenceMode, 
    aiModels, 
    activeModelId, 
    setActiveModelId, 
    playTacticalSound 
  } = useSimulation();

  const [selectedCamId, setSelectedCamId] = useState('CAM-01');
  const [confThreshold, setConfThreshold] = useState<number>(0.65);
  const [iouThreshold, setIouThreshold] = useState<number>(0.45);
  const [wildlifeFilter, setWildlifeFilter] = useState<boolean>(true);

  const activeCam = cameras.find(c => c.id === selectedCamId) || cameras[0];
  const activeModel = aiModels.find(m => m.id === activeModelId) || aiModels[0];

  const totalDetections = cameras.flatMap(c => c.currentDetections).filter(d => d.confidence >= confThreshold);
  const personCount = totalDetections.filter(d => d.class === 'person').length;
  const vehicleCount = totalDetections.filter(d => d.class !== 'person').length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-stone-900 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 font-mono">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 border-b border-sandal-200 text-xs gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-white border border-sandal-200 text-sandal-700 shadow-2xs">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-stone-950 tracking-wider">
                    OBJECT PERCEPTION &amp; REAL-TIME CLASSIFICATION CORE
                  </h1>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-300 text-[9px] text-emerald-800 font-bold">
                    {activeModel.codeName} [{activeModel.precision}]
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 mt-0.5">
                  REAL-TIME BOUNDING BOX TELEMETRY · TENSORRT EDGE INFERENCE · FALSE ALARM SUPPRESSION
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {/* Mode Toggle Button */}
              <button
                onClick={() => {
                  playTacticalSound('click');
                  setInferenceMode(inferenceMode === 'REALTIME_CV' ? 'VIDEO_SYNC' : 'REALTIME_CV');
                }}
                className={`px-3 py-1 rounded text-xs transition-colors font-bold border ${
                  inferenceMode === 'REALTIME_CV'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow-xs'
                    : 'bg-stone-900 text-stone-300 border-stone-800'
                }`}
              >
                {inferenceMode === 'REALTIME_CV' ? 'MODE: REAL-TIME AI' : 'MODE: SCENARIO SYNC'}
              </button>

              <Link
                href="/models"
                className="px-2.5 py-1 rounded bg-white border border-sandal-200 hover:bg-sandal-50 text-stone-700 font-bold flex items-center gap-1 shadow-2xs transition-colors"
              >
                <Cpu className="w-3.5 h-3.5 text-sandal-700" />
                <span>Fine-Tune Model</span>
              </Link>

              <span className="px-2 py-1 rounded bg-white border border-sandal-200 text-stone-700 shadow-2xs font-medium">
                PERSONS: <span className="text-emerald-700 font-bold">{personCount}</span>
              </span>
              <span className="px-2 py-1 rounded bg-white border border-sandal-200 text-stone-700 shadow-2xs font-medium">
                VEHICLES: <span className="text-sandal-700 font-bold">{vehicleCount}</span>
              </span>
            </div>
          </div>

          {/* Real-time CV Threshold Control Bar */}
          <div className="bg-white border border-sandal-200 rounded p-3 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-4 text-xs items-center">
            <div>
              <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
                <span>CONFIDENCE THRESHOLD:</span>
                <span className="font-bold text-stone-900">{(confThreshold * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0.25}
                max={0.95}
                step={0.05}
                value={confThreshold}
                onChange={(e) => setConfThreshold(Number(e.target.value))}
                className="w-full accent-stone-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
                <span>IOU NMS THRESHOLD:</span>
                <span className="font-bold text-stone-900">{(iouThreshold * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0.30}
                max={0.80}
                step={0.05}
                value={iouThreshold}
                onChange={(e) => setIouThreshold(Number(e.target.value))}
                className="w-full accent-stone-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="wildlifeFilter"
                checked={wildlifeFilter}
                onChange={(e) => setWildlifeFilter(e.target.checked)}
                className="accent-stone-900"
              />
              <label htmlFor="wildlifeFilter" className="text-[11px] text-stone-700 cursor-pointer font-bold select-none">
                Wildlife &amp; Debris Filter (96% Rejection)
              </label>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <span className="text-[10px] text-stone-500">ACTIVE BACKBONE:</span>
              <select
                value={activeModelId}
                onChange={(e) => {
                  playTacticalSound('click');
                  setActiveModelId(e.target.value);
                }}
                className="bg-sandal-50 border border-sandal-200 rounded px-2 py-1 text-xs font-bold text-stone-900"
              >
                {aiModels.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.codeName} ({m.precision})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Inspection Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1">
            {/* Left Primary Detection Stream (8 cols) */}
            <div className="xl:col-span-8 flex flex-col bg-white border border-sandal-200 rounded p-3 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-sandal-200 text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-stone-950 font-bold">{activeCam.id} — {activeCam.name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-sandal-100 border border-sandal-200 text-[9px] text-sandal-800 font-semibold">
                    {activeCam.sector}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {cameras.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCamId(c.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                        selectedCamId === c.id ? 'bg-stone-900 text-white font-bold shadow-xs' : 'bg-sandal-50 border border-sandal-200 text-stone-600 hover:text-stone-950'
                      }`}
                    >
                      {c.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative aspect-video rounded overflow-hidden border border-sandal-300 bg-black">
                <CameraFeed camera={activeCam} isExpanded={true} />
              </div>
            </div>

            {/* Right Detection Table (4 cols) */}
            <div className="xl:col-span-4 flex flex-col gap-3">
              <div className="p-3 bg-white border border-sandal-200 rounded flex flex-col gap-2 shadow-2xs">
                <div className="flex items-center justify-between border-b border-sandal-200 pb-2">
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                    TARGET CLUSTER TELEMETRY ({totalDetections.length})
                  </span>
                  <span className="text-[9px] text-stone-500">
                    Filter: &ge;{(confThreshold * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto">
                  {totalDetections.map((det) => (
                    <div
                      key={det.id}
                      className="p-2.5 rounded bg-sandal-50 border border-sandal-200 flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-stone-950 uppercase">{det.class}</span>
                        <span className="text-emerald-700 font-bold">{det.trackingId}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-stone-600">
                        <span>CHANNEL: {det.cameraId}</span>
                        <span>CONFIDENCE: {(det.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-stone-500 pt-1 border-t border-sandal-200">
                        <span>{det.zone || 'PERIMETER BUFFER'}</span>
                        <span>{det.timestamp}</span>
                      </div>
                    </div>
                  ))}
                  {totalDetections.length === 0 && (
                    <div className="py-8 text-center text-stone-400 text-xs">
                      No detections currently above {(confThreshold * 100).toFixed(0)}% threshold in this sector.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
