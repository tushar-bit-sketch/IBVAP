"use client";

import React, { useState } from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { CameraFeed } from '@/components/video/CameraFeed';
import { useSimulation } from '@/context/SimulationContext';
import { 
  Video, 
  Plus, 
  Grid2X2, 
  Sliders, 
  Activity, 
  Compass, 
  Eye, 
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import Link from 'next/link';

export default function CamerasPage() {
  const { cameras, setSelectedCameraId } = useSimulation();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredCameras = cameras.filter(cam => {
    if (filterType === 'ALL') return true;
    return cam.feedType === filterType;
  });

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-neutral-100 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4">
          {/* Header & Filter Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-200">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-wider">
                  CCTV CAMERA INVENTORY & STREAMS
                </h1>
                <p className="text-[10px] text-neutral-500">
                  4 CONFIGURED ONVIF/RTSP STREAMS // EDGE DIRECT INGESTION
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-500 uppercase">FEED TYPE:</span>
              {(['ALL', 'OPTICAL', 'THERMAL_IR', 'ANPR_MACRO'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1 rounded text-[10px] transition-colors ${
                    filterType === type ? 'bg-neutral-800 text-white font-bold border border-neutral-700' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Camera Grid with Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCameras.map((camera) => (
              <div
                key={camera.id}
                className="bg-obsidian-200 border border-neutral-800 rounded p-3 flex flex-col gap-3 font-mono"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tactical-green" />
                    <span className="font-bold text-white text-xs">{camera.id}</span>
                    <span className="text-neutral-400 text-xs">— {camera.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-tactical-cyan font-bold">
                    {camera.fps} FPS
                  </span>
                </div>

                <div className="relative aspect-video rounded overflow-hidden">
                  <CameraFeed camera={camera} showControls={false} />
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] text-neutral-400 pt-2 border-t border-neutral-800">
                  <div>
                    <span className="text-neutral-500 block">SECTOR</span>
                    <span className="text-white font-bold">{camera.sector}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">MODEL</span>
                    <span className="text-white font-bold truncate">{camera.model.split('+')[0]}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">RESOLUTION</span>
                    <span className="text-tactical-green font-bold">{camera.resolution}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
                  <span className="text-[10px] text-neutral-500">
                    RTSP: {camera.rtspUrl}
                  </span>
                  <Link
                    href={`/cameras/${camera.id}`}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs transition-colors"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>INSPECT</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
