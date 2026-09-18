"use client";

import React from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  Video, 
  Download, 
  Share2, 
  Clock, 
  Crosshair, 
  Compass, 
  Maximize2,
  FileCheck,
  Zap,
  RotateCcw,
  AlertOctagon,
  LifeBuoy
} from 'lucide-react';
import Link from 'next/link';

export function AlertDrawer() {
  const { 
    selectedAlert, 
    isAlertDrawerOpen, 
    setIsAlertDrawerOpen, 
    acknowledgeAlert,
    resolveAlert,
    setSelectedCameraId,
    seekCamera,
    playTacticalSound
  } = useSimulation();

  if (!isAlertDrawerOpen || !selectedAlert) return null;

  const isCritical = selectedAlert.severity === 'CRITICAL';
  const threat = selectedAlert.threatBreakdown;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-all duration-300 select-none">
      {/* Drawer Panel */}
      <div className="w-full max-w-lg bg-white border-l border-sandal-300 h-full flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200 font-sans">
        {/* Header */}
        <div className={`p-4 border-b flex items-start justify-between ${
          isCritical ? 'bg-red-50 border-red-200' : 'bg-sandal-50 border-sandal-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider ${
                isCritical ? 'bg-red-100 border border-red-300 text-red-800' : 'bg-white border border-sandal-200 text-stone-700'
              }`}>
                {selectedAlert.severity} EVENT
              </span>
              <span className="font-mono text-xs text-stone-500">
                ID: {selectedAlert.id}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-white border border-sandal-200 font-mono text-[9px] text-stone-600 uppercase font-semibold">
                {selectedAlert.status}
              </span>
            </div>
            <h2 className="font-mono text-base font-bold text-stone-950 tracking-wide">
              {selectedAlert.type.replace('_', ' ')}
            </h2>
          </div>
          <button
            onClick={() => setIsAlertDrawerOpen(false)}
            className="p-1 rounded text-stone-500 hover:text-stone-900 hover:bg-sandal-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snapshot Evidence Frame */}
        <div className="p-4 border-b border-sandal-200 bg-obsidian">
          <span className="font-mono text-[10px] text-stone-600 uppercase tracking-widest block mb-2 font-semibold">
            Primary incident frame snapshot
          </span>
          <div className="relative aspect-video rounded overflow-hidden border border-sandal-300 group bg-black shadow-xs">
            <img
              src={selectedAlert.snapshotUrl || 'https://images.unsplash.com/photo-1566847936715-5e147ef9caec?auto=format&fit=crop&w=800&q=80'}
              alt="Incident Snapshot"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 scanline-layer opacity-20 pointer-events-none" />
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/85 border border-neutral-700 rounded font-mono text-[9px] text-white flex items-center gap-1.5">
              <span>{selectedAlert.cameraId}</span>
              {selectedAlert.videoTimestamp !== undefined && (
                <span className="text-amber-400 font-bold">T+{selectedAlert.videoTimestamp.toFixed(1)}s</span>
              )}
              <span>· {selectedAlert.timestamp}</span>
            </div>
            {/* Target Reticle Indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-red-500 border-dashed rounded flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            </div>
          </div>
        </div>

        {/* Explainable Threat Scoring Factor Breakdown */}
        {threat && (
          <div className="p-4 border-b border-sandal-200 bg-sandal-50 font-mono">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-sandal-600" />
                <span>Explainable threat engine (XAI)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-red-100 border border-red-300 text-red-800 font-bold text-xs">
                Score: {threat.score} / 100 [{threat.level}]
              </span>
            </div>

            <p className="text-[11px] text-stone-700 italic mb-3 font-sans leading-relaxed">
              &ldquo;{threat.reason}&rdquo;
            </p>

            <div className="flex flex-col gap-1.5 text-xs">
              {threat.factors.map((factor, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-1.5 rounded bg-white border border-sandal-200 shadow-2xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-stone-900 block text-[11px] truncate">
                      {factor.name}
                    </span>
                    <span className="text-[10px] text-stone-500 block truncate">
                      {factor.description}
                    </span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-sandal-100 text-sandal-800 font-bold text-[10px] shrink-0">
                    +{factor.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Forensic Metadata Grid */}
        <div className="p-4 flex flex-col gap-4 flex-1 bg-white">
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <div className="p-2.5 rounded bg-sandal-50/70 border border-sandal-200 flex flex-col gap-0.5">
              <span className="text-[10px] text-stone-500 font-semibold uppercase">Camera feed</span>
              <span className="text-stone-900 font-bold">{selectedAlert.cameraId}</span>
              <span className="text-[10px] text-stone-600 truncate">{selectedAlert.cameraName}</span>
            </div>

            <div className="p-2.5 rounded bg-sandal-50/70 border border-sandal-200 flex flex-col gap-0.5">
              <span className="text-[10px] text-stone-500 font-semibold uppercase">Zone perimeter</span>
              <span className="text-stone-900 font-bold">{selectedAlert.zoneName || 'UNASSIGNED'}</span>
              <span className="text-[10px] text-stone-600">{selectedAlert.zoneId || 'ZONE-01'}</span>
            </div>

            <div className="p-2.5 rounded bg-sandal-50/70 border border-sandal-200 flex flex-col gap-0.5">
              <span className="text-[10px] text-stone-500 font-semibold uppercase">Classified target</span>
              <span className="text-stone-900 font-bold">{selectedAlert.objectId}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">Conf: {(selectedAlert.confidence * 100).toFixed(1)}%</span>
            </div>

            <div className="p-2.5 rounded bg-sandal-50/70 border border-sandal-200 flex flex-col gap-0.5">
              <span className="text-[10px] text-stone-500 font-semibold uppercase">Footage timestamp</span>
              <span className="text-amber-800 font-bold">
                {selectedAlert.videoTimestamp !== undefined ? `T+${selectedAlert.videoTimestamp.toFixed(1)}s` : 'REAL-TIME'}
              </span>
              <span className="text-[10px] text-stone-600">{selectedAlert.timestamp}</span>
            </div>
          </div>

          {/* Description narrative */}
          <div className="p-3 rounded bg-sandal-50/50 border border-sandal-200 font-mono text-xs">
            <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold block mb-1">
              System incident log
            </span>
            <p className="text-stone-700 leading-relaxed font-sans text-xs">
              {selectedAlert.description}
            </p>
          </div>
        </div>

        {/* Operational Actions Footer */}
        <div className="p-4 border-t border-sandal-200 bg-sandal-50/60 flex flex-col gap-2 font-mono text-xs">
          {/* Video-Synchronized Event Replay */}
          <button
            onClick={() => {
              if (selectedAlert) {
                const startTime = Math.max(0, (selectedAlert.videoTimestamp ?? 1) - 1.5);
                setSelectedCameraId(selectedAlert.cameraId);
                seekCamera(selectedAlert.cameraId, startTime, false);
                playTacticalSound('click');
                setIsAlertDrawerOpen(false);
              }
            }}
            className="w-full py-2.5 rounded bg-sandal-800 hover:bg-sandal-900 text-white font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
            title="Jump to 1.5s before incident and play footage in real-time"
          >
            <RotateCcw className="w-4 h-4 text-amber-300" />
            <span>Replay event from T+{Math.max(0, (selectedAlert.videoTimestamp ?? 1) - 1.5).toFixed(1)}s</span>
          </button>

          {!selectedAlert.acknowledged ? (
            <button
              onClick={() => acknowledgeAlert(selectedAlert.id)}
              className="w-full py-2.5 rounded bg-stone-900 text-white hover:bg-stone-800 font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Acknowledge incident</span>
            </button>
          ) : (
            <div className="p-2 rounded bg-white border border-sandal-200 flex items-center justify-between text-stone-600 shadow-2xs">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Acknowledged by {selectedAlert.acknowledgedBy || 'Operator'}</span>
              </span>
              <span className="text-[10px] text-stone-500">{selectedAlert.timestamp}</span>
            </div>
          )}

          {/* Resolve & False-Positive Feedback Buttons */}
          {selectedAlert.status !== 'RESOLVED' && selectedAlert.status !== 'FALSE_POSITIVE' && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => resolveAlert(selectedAlert.id, 'Patrol verified perimeter is secure.')}
                className="py-2 px-3 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 font-bold shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Resolve incident</span>
              </button>
              <button
                onClick={() => resolveAlert(selectedAlert.id, 'Flagged as animal/swaying branch detection.', true)}
                className="py-2 px-3 rounded bg-white border border-sandal-200 text-stone-600 hover:text-stone-950 hover:bg-sandal-50 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                title="Feeds edge pipeline feedback loop to reduce sensitivity"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>False positive</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setSelectedCameraId(selectedAlert.cameraId);
                setIsAlertDrawerOpen(false);
              }}
              className="py-2 px-3 rounded bg-white border border-sandal-200 hover:bg-sandal-50 text-stone-800 flex items-center justify-center gap-2 transition-colors shadow-2xs font-medium"
            >
              <Video className="w-3.5 h-3.5 text-sandal-700" />
              <span>Open camera feed</span>
            </button>

            <Link
              href="/evidence"
              onClick={() => setIsAlertDrawerOpen(false)}
              className="py-2 px-3 rounded bg-white border border-sandal-200 hover:bg-sandal-50 text-stone-800 flex items-center justify-center gap-2 transition-colors shadow-2xs font-medium"
            >
              <FileCheck className="w-3.5 h-3.5 text-sandal-700" />
              <span>Forensic vault</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
