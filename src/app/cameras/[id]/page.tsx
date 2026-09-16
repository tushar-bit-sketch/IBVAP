"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { CameraFeed } from '@/components/video/CameraFeed';
import { useSimulation } from '@/context/SimulationContext';
import { 
  ArrowLeft, 
  Video, 
  Activity, 
  ShieldAlert, 
  Settings, 
  Layers, 
  Crosshair,
  Maximize2 
} from 'lucide-react';
import Link from 'next/link';

export default function CameraDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { cameras } = useSimulation();

  const cameraId = params?.id as string;
  const camera = cameras.find(c => c.id === cameraId) || cameras[0];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-neutral-100 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 font-mono">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
            <div className="flex items-center gap-3">
              <Link
                href="/cameras"
                className="p-1.5 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-base font-bold text-white tracking-wider flex items-center gap-2">
                  <span>{camera.id}</span>
                  <span className="text-neutral-400 font-normal">— {camera.name}</span>
                </h1>
                <p className="text-[10px] text-neutral-500">
                  {camera.sector} // {camera.resolution} // {camera.fps} FPS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-tactical-green font-bold text-[10px]">
                AI PIPELINE: {camera.aiStatus}
              </span>
            </div>
          </div>

          {/* Main Inspection Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1">
            {/* Expanded Feed (8 cols) */}
            <div className="xl:col-span-8 flex flex-col bg-black border border-neutral-800 rounded p-2">
              <div className="relative aspect-video rounded overflow-hidden">
                <CameraFeed camera={camera} isExpanded={true} />
              </div>
            </div>

            {/* Telemetry & Controls (4 cols) */}
            <div className="xl:col-span-4 flex flex-col gap-3">
              <div className="p-3 bg-obsidian-200 border border-neutral-800 rounded flex flex-col gap-2">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                  REAL-TIME DETECTIONS ({camera.currentDetections.length})
                </span>
                <div className="flex flex-col gap-2">
                  {camera.currentDetections.map(det => (
                    <div key={det.id} className="p-2 rounded bg-neutral-900 border border-neutral-800 flex flex-col gap-1 text-xs">
                      <div className="flex justify-between font-bold text-white">
                        <span>{det.class.toUpperCase()}</span>
                        <span className="text-tactical-green">{det.trackingId}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-neutral-400">
                        <span>CONFIDENCE: {(det.confidence * 100).toFixed(0)}%</span>
                        {det.speedKmh && <span>SPEED: {det.speedKmh} km/h</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-obsidian-200 border border-neutral-800 rounded flex flex-col gap-2 text-xs">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                  STREAM CONFIGURATION
                </span>
                <div className="flex flex-col gap-1.5 text-[11px]">
                  <div className="flex justify-between text-neutral-400">
                    <span>RTSP INGESTION:</span>
                    <span className="text-white truncate max-w-[180px]">{camera.rtspUrl}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>INFERENCE ENGINE:</span>
                    <span className="text-tactical-cyan">{camera.model}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>TARGET FPS:</span>
                    <span className="text-white">{camera.targetFps} FPS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
