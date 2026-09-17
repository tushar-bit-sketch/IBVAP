"use client";

import React from 'react';
import { Camera } from '@/types';
import { CameraFeed } from './CameraFeed';
import { useSimulation } from '@/context/SimulationContext';
import { 
  Maximize2, 
  Layers, 
  Grid2X2, 
  Activity, 
  ShieldCheck, 
  Sliders, 
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface CameraGridProps {
  cameras?: Camera[];
}

export function CameraGrid({ cameras: propCameras }: CameraGridProps) {
  const { cameras: ctxCameras, selectedCameraId, setSelectedCameraId } = useSimulation();
  const cameras = propCameras || ctxCameras;

  const activeCam = cameras.find(c => c.id === selectedCameraId) || null;

  return (
    <div className="w-full h-full flex flex-col">
      {activeCam ? (
        // Expanded Focus View
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-3 h-full overflow-hidden">
          {/* Main Feed View (3 cols) */}
          <div className="xl:col-span-3 flex flex-col h-full bg-black border border-sandal-300 rounded-lg overflow-hidden shadow-2xs">
            <div className="p-2.5 border-b border-sandal-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-stone-950 px-2 py-0.5 bg-sandal-100 rounded border border-sandal-200">
                  {activeCam.id}
                </span>
                <span className="font-mono text-xs text-stone-800 font-semibold">
                  {activeCam.name} — {activeCam.sector}
                </span>
              </div>
              <button
                onClick={() => setSelectedCameraId(null)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono transition-colors shadow-2xs font-semibold"
              >
                <Grid2X2 className="w-3.5 h-3.5 text-sandal-300" />
                <span>GRID VIEW</span>
              </button>
            </div>

            <div className="flex-1 relative min-h-[400px] bg-black">
              <CameraFeed
                camera={activeCam}
                isExpanded={true}
                onToggleExpand={() => setSelectedCameraId(null)}
              />
            </div>
          </div>

          {/* Right Inspector Column for Expanded Feed */}
          <div className="xl:col-span-1 flex flex-col gap-3 h-full overflow-y-auto">
            {/* Real-time Objects in Frame */}
            <div className="bg-white border border-sandal-200 p-3.5 rounded-lg shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                  ACTIVE DETECTIONS ({activeCam.currentDetections.length})
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              </div>
              <div className="flex flex-col gap-2">
                {activeCam.currentDetections.map(det => (
                  <div key={det.id} className="p-2.5 rounded-lg bg-[#faf8f5] border border-sandal-200 flex flex-col gap-1 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 uppercase">{det.class}</span>
                      <span className="text-emerald-700 text-[10px] font-bold">{det.trackingId}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-stone-500">
                      <span>CONF: {(det.confidence * 100).toFixed(0)}%</span>
                      {det.speedKmh && <span>VEL: {det.speedKmh} km/h</span>}
                      {det.loiterSeconds && <span className="text-amber-800 font-bold">LOITER: {det.loiterSeconds}s</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Virtual Zones Status */}
            <div className="bg-white border border-sandal-200 p-3.5 rounded-lg shadow-2xs">
              <span className="font-mono text-[10px] text-stone-500 font-bold uppercase tracking-wider block mb-2">
                CONFIGURED ZONES ({activeCam.activeZones.length})
              </span>
              <div className="flex flex-col gap-1.5 font-mono text-xs">
                {activeCam.activeZones.map(zone => (
                  <div key={zone.id} className="flex items-center justify-between p-2 rounded-lg bg-[#faf8f5] border border-sandal-200">
                    <div>
                      <div className="font-semibold text-stone-900 text-[11px]">{zone.name}</div>
                      <div className="text-[9px] text-stone-500">{zone.type}</div>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      zone.status === 'TRIGGERED' 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-sandal-100 text-sandal-800 border border-sandal-200'
                    }`}>
                      {zone.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* PTZ Simulation Controls */}
            <div className="bg-white border border-sandal-200 p-3.5 rounded-lg shadow-2xs">
              <span className="font-mono text-[10px] text-stone-500 font-bold uppercase tracking-wider block mb-2">
                OPTICAL / PTZ CONTROL
              </span>
              <div className="flex flex-col items-center gap-1.5 p-2 bg-[#faf8f5] rounded-lg border border-sandal-200">
                <button className="p-1 rounded bg-white border border-sandal-200 hover:bg-sandal-50 text-stone-700 shadow-2xs">
                  <ArrowUp className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3">
                  <button className="p-1 rounded bg-white border border-sandal-200 hover:bg-sandal-50 text-stone-700 shadow-2xs">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="w-4 h-4 rounded-full border border-sandal-400 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-sandal-600" />
                  </div>
                  <button className="p-1 rounded bg-white border border-sandal-200 hover:bg-sandal-50 text-stone-700 shadow-2xs">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <button className="p-1 rounded bg-white border border-sandal-200 hover:bg-sandal-50 text-stone-700 shadow-2xs">
                  <ArrowDown className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 pt-2 border-t border-sandal-200 w-full justify-center">
                  <button className="flex items-center gap-1 px-2 py-1 bg-white border border-sandal-200 hover:bg-sandal-50 rounded text-[10px] font-mono text-stone-700 shadow-2xs font-semibold">
                    <ZoomIn className="w-3 h-3 text-sandal-600" /> ZOOM +
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 bg-white border border-sandal-200 hover:bg-sandal-50 rounded text-[10px] font-mono text-stone-700 shadow-2xs font-semibold">
                    <ZoomOut className="w-3 h-3 text-sandal-600" /> ZOOM -
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Standard 2x2 Tactical Matrix
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full h-full">
          {cameras.map((camera) => (
            <div key={camera.id} className="relative group cursor-pointer" onClick={() => setSelectedCameraId(camera.id)}>
              <CameraFeed
                camera={camera}
                isExpanded={false}
                onToggleExpand={() => setSelectedCameraId(camera.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
