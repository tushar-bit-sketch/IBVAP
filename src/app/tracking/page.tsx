"use client";

import React, { useState } from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { CameraFeed } from '@/components/video/CameraFeed';
import { useSimulation } from '@/context/SimulationContext';
import { 
  Route, 
  Search, 
  Clock, 
  MapPin, 
  Activity, 
  Compass, 
  ShieldAlert, 
  ArrowRight,
  User,
  Zap,
  CheckCircle2,
  Video
} from 'lucide-react';

export default function TrackingPage() {
  const { cameras, tracks, playTacticalSound } = useSimulation();
  const [selectedTrackId, setSelectedTrackId] = useState<string>('PERSON-042');

  const activeTarget = tracks.find(t => t.trackingId === selectedTrackId) || tracks[0];
  const camForTarget = cameras.find(c => c.id === activeTarget.currentCameraId) || cameras[0];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-neutral-100 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 font-mono bg-obsidian-base">
          {/* Header */}
          <div className="p-4 border border-neutral-800 rounded-lg bg-obsidian-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-tactical-cyan">
                <Route className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-wider">
                  CROSS-CAMERA RE-IDENTIFICATION &amp; TRAJECTORY TRACKING
                </h1>
                <p className="text-xs text-neutral-400 font-sans">
                  DeepSORT v2.1 Kalman Filter + Spatiotemporal Graph: &ldquo;ONE OBJECT • ONE IDENTITY • MULTIPLE SENSORS • ONE CONTINUOUS TIMELINE&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-green-950 border border-green-800 text-tactical-green font-bold">
                TRACKING STABILITY: 94.8%
              </span>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1">
            {/* Left Column: Tracked Target Selector (4 cols) */}
            <div className="xl:col-span-4 flex flex-col gap-3">
              <div className="p-3 bg-obsidian-100 border border-neutral-800 rounded-lg flex flex-col gap-2">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                  ACTIVE MONITORED ENTITIES ({tracks.length})
                </span>

                <div className="flex flex-col gap-2">
                  {tracks.map(t => {
                    const isSelected = selectedTrackId === t.trackingId;
                    const isAnomalous = t.status === 'ANOMALOUS';

                    return (
                      <div
                        key={t.trackingId}
                        onClick={() => {
                          playTacticalSound('click');
                          setSelectedTrackId(t.trackingId);
                        }}
                        className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col gap-1.5 text-xs ${
                          isSelected 
                            ? 'bg-neutral-800 border-tactical-cyan text-white shadow-md' 
                            : 'bg-obsidian-200 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-white text-sm tracking-wider">{t.trackingId}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            isAnomalous ? 'bg-red-950 text-tactical-red border border-red-900' : 'bg-neutral-900 text-tactical-green border border-neutral-800'
                          }`}>
                            {t.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1 text-[10px] text-neutral-400">
                          <span>CAM: <strong className="text-neutral-200">{t.currentCameraId}</strong></span>
                          <span>ZONE: <strong className="text-neutral-200">{t.currentZone}</strong></span>
                          <span>SPEED: <strong className="text-neutral-200">{t.speedKmh} km/h</strong></span>
                          <span>THREAT: <strong className="text-tactical-red">{t.threatScore} / 100</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Entity Spatiotemporal Summary Card */}
              <div className="p-4 bg-obsidian-100 border border-neutral-800 rounded-lg flex flex-col gap-2 text-xs">
                <h3 className="font-bold text-white uppercase tracking-wider text-[11px] mb-1">
                  SPATIOTEMPORAL INTELLIGENCE
                </h3>
                <div className="flex justify-between border-b border-neutral-800/80 py-1 text-neutral-400">
                  <span>FIRST IDENTIFIED</span>
                  <span className="text-white font-bold">{activeTarget.firstSeen}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/80 py-1 text-neutral-400">
                  <span>LAST OBSERVED</span>
                  <span className="text-white font-bold">{activeTarget.lastSeen}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/80 py-1 text-neutral-400">
                  <span>DWELL TIME</span>
                  <span className="text-white font-bold">{activeTarget.dwellSeconds} SECONDS</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/80 py-1 text-neutral-400">
                  <span>KALMAN CONFIDENCE</span>
                  <span className="text-tactical-green font-bold">{(activeTarget.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Right Column: Multi-Camera Waypoint Handoff Timeline & Live Visual (8 cols) */}
            <div className="xl:col-span-8 flex flex-col gap-4">
              {/* Continuous Cross-Camera Timeline Card */}
              <div className="p-4 bg-obsidian-100 border border-neutral-800 rounded-lg flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="text-xs font-bold text-white flex items-center gap-2 tracking-wider">
                    <Zap className="w-4 h-4 text-tactical-cyan" />
                    <span>CROSS-CAMERA HANDOFF CONTINUITY TIMELINE</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    TARGET: <strong className="text-white">{activeTarget.trackingId}</strong>
                  </span>
                </div>

                {/* Timeline Waypoints */}
                <div className="flex flex-col gap-3 relative before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-neutral-800">
                  {activeTarget.crossCameraPath.map((wp, idx) => (
                    <div key={idx} className="flex items-start gap-4 relative z-10">
                      <div className="w-7 h-7 rounded-full bg-obsidian-200 border-2 border-tactical-cyan flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow">
                        {idx + 1}
                      </div>
                      <div className="flex-1 p-3 rounded bg-obsidian-200 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-700 text-tactical-cyan font-bold text-[10px]">
                              {wp.cameraId}
                            </span>
                            <span className="font-bold text-white text-xs">
                              {wp.cameraName}
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              {wp.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-300 font-sans">
                            {wp.event.replace(/_/g, ' ')} at {wp.location}
                          </p>
                        </div>
                        <div className="text-right shrink-0 font-mono text-[10px] text-neutral-500">
                          <span>DWELL: {wp.dwellSeconds}s</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Tracking Camera Feed */}
              <div className="p-4 bg-obsidian-100 border border-neutral-800 rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-tactical-green" />
                    <span>CURRENT SENSOR INTERCEPT FEED — {camForTarget.name} ({camForTarget.id})</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {camForTarget.fps} FPS • {camForTarget.resolution}
                  </span>
                </div>

                <div className="max-h-[380px] rounded overflow-hidden">
                  <CameraFeed camera={camForTarget} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
