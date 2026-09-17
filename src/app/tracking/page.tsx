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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-stone-900 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 font-mono bg-obsidian">
          {/* Header */}
          <div className="p-4 border border-sandal-200 rounded-lg bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-white border border-sandal-200 text-sandal-700 shadow-2xs">
                <Route className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-stone-950 tracking-wider">
                  CROSS-CAMERA RE-IDENTIFICATION &amp; TRAJECTORY TRACKING
                </h1>
                <p className="text-xs text-stone-500 font-sans">
                  DeepSORT v2.1 Kalman Filter + Spatiotemporal Graph: &ldquo;ONE OBJECT • ONE IDENTITY • MULTIPLE SENSORS • ONE CONTINUOUS TIMELINE&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                TRACKING STABILITY: 94.8%
              </span>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1">
            {/* Left Column: Tracked Target Selector (4 cols) */}
            <div className="xl:col-span-4 flex flex-col gap-3">
              <div className="p-3 bg-white border border-sandal-200 rounded-lg flex flex-col gap-2 shadow-2xs">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
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
                            ? 'bg-stone-900 text-white shadow-md border-stone-800' 
                            : 'bg-sandal-50/70 border-sandal-200 text-stone-900 hover:bg-sandal-100'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className={`text-sm tracking-wider ${isSelected ? 'text-white' : 'text-stone-950'}`}>{t.trackingId}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            isAnomalous 
                              ? 'bg-red-500 text-white' 
                              : isSelected ? 'bg-stone-800 text-stone-300' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {t.status}
                          </span>
                        </div>

                        <div className={`grid grid-cols-2 gap-1 text-[10px] ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                          <span>CAM: <strong className={isSelected ? 'text-white' : 'text-stone-900'}>{t.currentCameraId}</strong></span>
                          <span>ZONE: <strong className={isSelected ? 'text-white' : 'text-stone-900'}>{t.currentZone}</strong></span>
                          <span>SPEED: <strong className={isSelected ? 'text-white' : 'text-stone-900'}>{t.speedKmh} km/h</strong></span>
                          <span>THREAT: <strong className={isAnomalous ? 'text-red-600 font-bold' : isSelected ? 'text-amber-300 font-bold' : 'text-amber-700 font-bold'}>{t.threatScore} / 100</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Entity Spatiotemporal Summary Card */}
              <div className="p-4 bg-white border border-sandal-200 rounded-lg flex flex-col gap-2 text-xs shadow-2xs">
                <h3 className="font-bold text-stone-950 uppercase tracking-wider text-[11px] mb-1">
                  SPATIOTEMPORAL INTELLIGENCE
                </h3>
                <div className="flex justify-between border-b border-sandal-200 py-1 text-stone-600">
                  <span>FIRST IDENTIFIED</span>
                  <span className="text-stone-950 font-bold">{activeTarget.firstSeen}</span>
                </div>
                <div className="flex justify-between border-b border-sandal-200 py-1 text-stone-600">
                  <span>LAST OBSERVED</span>
                  <span className="text-stone-950 font-bold">{activeTarget.lastSeen}</span>
                </div>
                <div className="flex justify-between border-b border-sandal-200 py-1 text-stone-600">
                  <span>DWELL TIME</span>
                  <span className="text-stone-950 font-bold">{activeTarget.dwellSeconds} SECONDS</span>
                </div>
                <div className="flex justify-between border-b border-sandal-200 py-1 text-stone-600">
                  <span>KALMAN CONFIDENCE</span>
                  <span className="text-emerald-700 font-bold">{(activeTarget.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Right Column: Multi-Camera Waypoint Handoff Timeline & Live Visual (8 cols) */}
            <div className="xl:col-span-8 flex flex-col gap-4">
              {/* Continuous Cross-Camera Timeline Card */}
              <div className="p-4 bg-white border border-sandal-200 rounded-lg flex flex-col gap-3 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-sandal-200">
                  <span className="text-xs font-bold text-stone-950 flex items-center gap-2 tracking-wider">
                    <Zap className="w-4 h-4 text-sandal-600" />
                    <span>CROSS-CAMERA HANDOFF CONTINUITY TIMELINE</span>
                  </span>
                  <span className="text-[10px] text-stone-500">
                    TARGET: <strong className="text-stone-950">{activeTarget.trackingId}</strong>
                  </span>
                </div>

                {/* Timeline Waypoints */}
                <div className="flex flex-col gap-3 relative before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-sandal-200">
                  {activeTarget.crossCameraPath.map((wp, idx) => (
                    <div key={idx} className="flex items-start gap-4 relative z-10">
                      <div className="w-7 h-7 rounded-full bg-stone-900 border-2 border-sandal-400 flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow">
                        {idx + 1}
                      </div>
                      <div className="flex-1 p-3 rounded bg-sandal-50 border border-sandal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="px-1.5 py-0.2 rounded bg-white border border-sandal-300 text-sandal-800 font-bold text-[10px]">
                              {wp.cameraId}
                            </span>
                            <span className="font-bold text-stone-950 text-xs">
                              {wp.cameraName}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              {wp.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 font-sans">
                            {wp.event.replace(/_/g, ' ')} at {wp.location}
                          </p>
                        </div>
                        <div className="text-right shrink-0 font-mono text-[10px] text-stone-500">
                          <span>DWELL: {wp.dwellSeconds}s</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Tracking Camera Feed */}
              <div className="p-4 bg-white border border-sandal-200 rounded-lg flex flex-col gap-2 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-sandal-200">
                  <span className="text-xs font-bold text-stone-950 flex items-center gap-2">
                    <Video className="w-4 h-4 text-emerald-700" />
                    <span>CURRENT SENSOR INTERCEPT FEED — {camForTarget.name} ({camForTarget.id})</span>
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {camForTarget.fps} FPS • {camForTarget.resolution}
                  </span>
                </div>

                <div className="max-h-[380px] rounded overflow-hidden border border-sandal-300">
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
