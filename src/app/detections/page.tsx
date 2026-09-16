"use client";

import React, { useState } from 'react';
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
  Sliders 
} from 'lucide-react';

export default function DetectionsPage() {
  const { cameras } = useSimulation();
  const [selectedCamId, setSelectedCamId] = useState('CAM-01');
  const activeCam = cameras.find(c => c.id === selectedCamId) || cameras[0];

  const totalDetections = cameras.flatMap(c => c.currentDetections);
  const personCount = totalDetections.filter(d => d.class === 'person').length;
  const vehicleCount = totalDetections.filter(d => d.class !== 'person').length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-neutral-100 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 font-mono">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-tactical-cyan">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-wider">
                  YOLOV8x OBJECT PERCEPTION &amp; CLASSIFICATION
                </h1>
                <p className="text-[10px] text-neutral-500">
                  REAL-TIME BOUNDING BOX TELEMETRY &amp; CONFIDENCE INFERENCE
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                PERSONS: <span className="text-tactical-green font-bold">{personCount}</span>
              </span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                VEHICLES: <span className="text-tactical-cyan font-bold">{vehicleCount}</span>
              </span>
            </div>
          </div>

          {/* Main Inspection Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1">
            {/* Left Primary Detection Stream (8 cols) */}
            <div className="xl:col-span-8 flex flex-col bg-black border border-neutral-800 rounded p-2">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs mb-2">
                <span className="text-white font-bold">{activeCam.id} — {activeCam.name}</span>
                <div className="flex items-center gap-1">
                  {cameras.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCamId(c.id)}
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        selectedCamId === c.id ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {c.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative aspect-video rounded overflow-hidden">
                <CameraFeed camera={activeCam} isExpanded={true} />
              </div>
            </div>

            {/* Right Detection Table (4 cols) */}
            <div className="xl:col-span-4 flex flex-col gap-3">
              <div className="p-3 bg-obsidian-200 border border-neutral-800 rounded flex flex-col gap-2">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                  ALL DETECTIONS ACROSS SECTOR ({totalDetections.length})
                </span>

                <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto">
                  {totalDetections.map((det) => (
                    <div
                      key={det.id}
                      className="p-2.5 rounded bg-neutral-900 border border-neutral-800 flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-white uppercase">{det.class}</span>
                        <span className="text-tactical-green">{det.trackingId}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span>CHANNEL: {det.cameraId}</span>
                        <span>CONFIDENCE: {(det.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-neutral-500 pt-1 border-t border-neutral-800/80">
                        <span>{det.zone || 'PERIMETER REGION'}</span>
                        <span>{det.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
