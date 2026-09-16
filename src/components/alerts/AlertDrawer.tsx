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
    setSelectedCameraId 
  } = useSimulation();

  if (!isAlertDrawerOpen || !selectedAlert) return null;

  const isCritical = selectedAlert.severity === 'CRITICAL';
  const threat = selectedAlert.threatBreakdown;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-300 select-none">
      {/* Drawer Panel */}
      <div className="w-full max-w-lg bg-obsidian-200 border-l border-neutral-800 h-full flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200 font-sans">
        {/* Header */}
        <div className={`p-4 border-b flex items-start justify-between ${
          isCritical ? 'bg-red-950/30 border-red-900/60' : 'bg-neutral-900/60 border-neutral-800'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider ${
                isCritical ? 'bg-red-950 border border-red-800 text-tactical-red' : 'bg-neutral-800 text-neutral-300'
              }`}>
                {selectedAlert.severity} EVENT
              </span>
              <span className="font-mono text-xs text-neutral-400">
                ID: {selectedAlert.id}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800 font-mono text-[9px] text-neutral-400 uppercase">
                {selectedAlert.status}
              </span>
            </div>
            <h2 className="font-mono text-base font-bold text-white tracking-wide">
              {selectedAlert.type.replace('_', ' ')}
            </h2>
          </div>
          <button
            onClick={() => setIsAlertDrawerOpen(false)}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snapshot Evidence Frame */}
        <div className="p-4 border-b border-neutral-800 bg-black">
          <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block mb-2 font-semibold">
            PRIMARY INCIDENT FRAME SNAPSHOT
          </span>
          <div className="relative aspect-video rounded overflow-hidden border border-neutral-800 group">
            <img
              src={selectedAlert.snapshotUrl || 'https://images.unsplash.com/photo-1566847936715-5e147ef9caec?auto=format&fit=crop&w=800&q=80'}
              alt="Incident Snapshot"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 scanline-layer opacity-40 pointer-events-none" />
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 border border-neutral-700 rounded font-mono text-[9px] text-white">
              {selectedAlert.cameraId} / {selectedAlert.timestamp}
            </div>
            {/* Target Reticle Indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-tactical-red border-dashed rounded flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-tactical-red" />
            </div>
          </div>
        </div>

        {/* Explainable Threat Scoring Factor Breakdown */}
        {threat && (
          <div className="p-4 border-b border-neutral-800 bg-obsidian-100 font-mono">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-tactical-cyan" />
                <span>EXPLAINABLE THREAT ENGINE (XAI)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-tactical-red font-bold text-xs">
                SCORE: {threat.score} / 100 [{threat.level}]
              </span>
            </div>

            <p className="text-[11px] text-neutral-300 italic mb-3 font-sans leading-relaxed">
              &ldquo;{threat.reason}&rdquo;
            </p>

            <div className="flex flex-col gap-1.5 text-xs">
              {threat.factors.map((factor, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-1.5 rounded bg-obsidian-200 border border-neutral-800/80"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-neutral-200 block text-[11px] truncate">
                      {factor.name}
                    </span>
                    <span className="text-[10px] text-neutral-500 block truncate">
                      {factor.description}
                    </span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-tactical-cyan font-bold text-[10px] shrink-0">
                    +{factor.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Forensic Metadata Grid */}
        <div className="p-4 flex flex-col gap-4 flex-1">
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <div className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-500 font-semibold uppercase">CAMERA FEED</span>
              <span className="text-neutral-200 font-bold">{selectedAlert.cameraId}</span>
              <span className="text-[10px] text-neutral-400 truncate">{selectedAlert.cameraName}</span>
            </div>

            <div className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-500 font-semibold uppercase">ZONE PERIMETER</span>
              <span className="text-neutral-200 font-bold">{selectedAlert.zoneName || 'UNASSIGNED'}</span>
              <span className="text-[10px] text-neutral-400">{selectedAlert.zoneId || 'ZONE-01'}</span>
            </div>

            <div className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-500 font-semibold uppercase">CLASSIFIED TARGET</span>
              <span className="text-neutral-200 font-bold">{selectedAlert.objectId}</span>
              <span className="text-[10px] text-tactical-green">CONF: {(selectedAlert.confidence * 100).toFixed(1)}%</span>
            </div>

            <div className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-500 font-semibold uppercase">ENTRY TRAJECTORY</span>
              <span className="text-neutral-200 font-bold">{selectedAlert.direction || 'ENTRY VECTOR'}</span>
              <span className="text-[10px] text-neutral-400">{selectedAlert.timestamp}</span>
            </div>
          </div>

          {/* Description narrative */}
          <div className="p-3 rounded bg-neutral-900/50 border border-neutral-800 font-mono text-xs">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold block mb-1">
              SYSTEM INCIDENT LOG
            </span>
            <p className="text-neutral-300 leading-relaxed font-sans text-xs">
              {selectedAlert.description}
            </p>
          </div>
        </div>

        {/* Operational Actions Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex flex-col gap-2 font-mono text-xs">
          {!selectedAlert.acknowledged ? (
            <button
              onClick={() => acknowledgeAlert(selectedAlert.id)}
              className="w-full py-2.5 rounded bg-neutral-100 text-neutral-950 hover:bg-white font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ACKNOWLEDGE INCIDENT</span>
            </button>
          ) : (
            <div className="p-2 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between text-neutral-400">
              <span className="flex items-center gap-1.5 text-tactical-green">
                <CheckCircle2 className="w-4 h-4" />
                <span>ACKNOWLEDGED BY {selectedAlert.acknowledgedBy || 'OPERATOR'}</span>
              </span>
              <span className="text-[10px] text-neutral-500">{selectedAlert.timestamp}</span>
            </div>
          )}

          {/* Resolve & False-Positive Feedback Buttons */}
          {selectedAlert.status !== 'RESOLVED' && selectedAlert.status !== 'FALSE_POSITIVE' && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => resolveAlert(selectedAlert.id, 'Patrol verified perimeter is secure.')}
                className="py-2 px-3 rounded bg-emerald-950/60 border border-emerald-800 text-tactical-green hover:bg-emerald-900/60 transition-colors flex items-center justify-center gap-1.5 font-bold"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>RESOLVE INCIDENT</span>
              </button>
              <button
                onClick={() => resolveAlert(selectedAlert.id, 'Flagged as animal/swaying branch detection.', true)}
                className="py-2 px-3 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                title="Feeds edge pipeline feedback loop to reduce sensitivity"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>FALSE POSITIVE</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setSelectedCameraId(selectedAlert.cameraId);
                setIsAlertDrawerOpen(false);
              }}
              className="py-2 px-3 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 flex items-center justify-center gap-2 transition-colors"
            >
              <Video className="w-3.5 h-3.5" />
              <span>OPEN CAMERA FEED</span>
            </button>

            <Link
              href="/evidence"
              onClick={() => setIsAlertDrawerOpen(false)}
              className="py-2 px-3 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 flex items-center justify-center gap-2 transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5 text-tactical-cyan" />
              <span>FORENSIC VAULT</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
