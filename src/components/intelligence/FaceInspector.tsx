"use client";

import React, { useState } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { FaceMatch } from '@/types';
import { 
  UserCheck, 
  ShieldAlert, 
  Search, 
  Info, 
  CheckCircle2, 
  Fingerprint, 
  Clock, 
  Camera,
  Binary,
  Cpu,
  ScanLine
} from 'lucide-react';

// Pure synthetic biometric mesh graphic
function BiometricWireframe({ 
  id, 
  isMatch = false, 
  label = "PROBE CAPTURE",
  color = "#06b6d4" 
}: { 
  id: string; 
  isMatch?: boolean; 
  label?: string;
  color?: string;
}) {
  return (
    <div className="relative w-full aspect-square max-h-72 rounded overflow-hidden border border-neutral-800 bg-neutral-950 flex items-center justify-center select-none p-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-tactical opacity-25 pointer-events-none" />
      <div className="absolute inset-0 scanline-layer opacity-40 pointer-events-none" />

      {/* Synthetic Face Mesh Vector */}
      <svg className="w-full h-full max-w-[220px] max-h-[220px]" viewBox="0 0 100 100">
        {/* Head Oval Contour */}
        <ellipse cx="50" cy="50" rx="28" ry="36" fill="none" stroke={color} strokeWidth="0.8" strokeDasharray="2 1" />
        <ellipse cx="50" cy="50" rx="24" ry="32" fill="rgba(6, 182, 212, 0.03)" stroke={color} strokeWidth="0.4" />

        {/* Eye lines & pupils */}
        <ellipse cx="40" cy="42" rx="4.5" ry="2" fill="none" stroke={color} strokeWidth="0.7" />
        <circle cx="40" cy="42" r="1.2" fill={color} />
        <line x1="33" y1="42" x2="47" y2="42" stroke={color} strokeWidth="0.3" strokeDasharray="1 1" />

        <ellipse cx="60" cy="42" rx="4.5" ry="2" fill="none" stroke={color} strokeWidth="0.7" />
        <circle cx="60" cy="42" r="1.2" fill={color} />
        <line x1="53" y1="42" x2="67" y2="42" stroke={color} strokeWidth="0.3" strokeDasharray="1 1" />

        {/* Interpupillary distance line */}
        <line x1="40" y1="42" x2="60" y2="42" stroke="#22c55e" strokeWidth="0.5" />
        <text x="43" y="39" fill="#22c55e" fontSize="2.5" fontFamily="monospace">64mm IPD</text>

        {/* Nose bridge & tip */}
        <path d="M 50,42 L 49,52 L 47,56 L 53,56 L 51,52 Z" fill="none" stroke={color} strokeWidth="0.6" />
        <circle cx="50" cy="56" r="0.8" fill={color} />

        {/* Lips & Mouth geometry */}
        <path d="M 43,65 Q 50,62 57,65 Q 50,71 43,65 Z" fill="none" stroke={color} strokeWidth="0.7" />
        <line x1="43" y1="65" x2="57" y2="65" stroke={color} strokeWidth="0.4" />

        {/* Triangulation Mesh lines (Delaunay simulation) */}
        <g stroke={color} strokeWidth="0.25" opacity="0.55">
          <line x1="40" y1="42" x2="50" y2="28" />
          <line x1="60" y1="42" x2="50" y2="28" />
          <line x1="40" y1="42" x2="50" y2="56" />
          <line x1="60" y1="42" x2="50" y2="56" />
          <line x1="26" y1="50" x2="40" y2="42" />
          <line x1="74" y1="50" x2="60" y2="42" />
          <line x1="26" y1="50" x2="43" y2="65" />
          <line x1="74" y1="50" x2="57" y2="65" />
          <line x1="50" y1="56" x2="43" y2="65" />
          <line x1="50" y1="56" x2="57" y2="65" />
          <line x1="43" y1="65" x2="50" y2="82" />
          <line x1="57" y1="65" x2="50" y2="82" />
          <line x1="26" y1="50" x2="35" y2="74" />
          <line x1="74" y1="50" x2="65" y2="74" />
          <line x1="35" y1="74" x2="50" y2="82" />
          <line x1="65" y1="74" x2="50" y2="82" />
        </g>

        {/* Keypoint coordinate tags */}
        <circle cx="50" cy="28" r="0.8" fill="#ffffff" />
        <circle cx="26" cy="50" r="0.8" fill="#ffffff" />
        <circle cx="74" cy="50" r="0.8" fill="#ffffff" />
        <circle cx="50" cy="82" r="0.8" fill="#ffffff" />

        {/* Animated Scanning Line */}
        <line x1="15" y1="50" x2="85" y2="50" stroke="#ef4444" strokeWidth="0.5" opacity="0.8">
          <animate attributeName="y1" values="20;80;20" dur="4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="20;80;20" dur="4s" repeatCount="indefinite" />
        </line>
      </svg>

      {/* Header watermark */}
      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 rounded border border-neutral-800 text-[9px] font-mono text-neutral-300">
        {label}: {id}
      </div>

      <div className="absolute bottom-2 right-2 text-[8px] font-mono text-neutral-500">
        512-DIM ARCFACE VECTOR
      </div>
    </div>
  );
}

export function FaceInspector() {
  const { faces } = useSimulation();
  const [selectedFace, setSelectedFace] = useState<FaceMatch>(faces[0]);

  return (
    <div className="w-full flex flex-col xl:flex-row gap-4 font-mono select-none">
      {/* Left List of Synthetic Biometric Records */}
      <div className="w-full xl:w-96 bg-obsidian-200 border border-neutral-800 rounded p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-bold text-white tracking-wider">
              BIOMETRIC MATCH AUDIT
            </span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/80 text-tactical-amber">
            SYNTHETIC
          </span>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto max-h-[480px]">
          {faces.map((face) => {
            const isSelected = selectedFace.id === face.id;
            const isWatchlist = face.watchlistStatus === 'WATCHLIST MATCH';

            return (
              <div
                key={face.id}
                onClick={() => setSelectedFace(face)}
                className={`p-2.5 rounded border transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected 
                    ? 'bg-neutral-800/90 border-neutral-600' 
                    : 'bg-neutral-900/60 border-neutral-800/80 hover:bg-neutral-800/40'
                }`}
              >
                {/* Mini Wireframe Icon Avatar */}
                <div className="w-11 h-11 rounded border border-neutral-700 shrink-0 bg-black flex items-center justify-center text-tactical-cyan">
                  <Fingerprint className="w-6 h-6 opacity-75" />
                </div>

                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs truncate">
                      {face.databaseId}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      isWatchlist 
                        ? 'bg-red-950 text-tactical-red border border-red-900' 
                        : 'bg-neutral-800 text-tactical-green'
                    }`}>
                      {isWatchlist ? 'MATCH' : 'CLEAR'}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    SIMILARITY: {(face.matchScore * 100).toFixed(1)}%
                  </div>
                  <div className="text-[9px] text-neutral-500 truncate">
                    {face.cameraId} • {face.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prototype Credibility Disclaimer */}
        <div className="p-2.5 rounded bg-black/50 border border-neutral-800 text-[10px] text-neutral-400 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
          <span>
            Facial recognition engine computes 512-dimensional synthetic vector embeddings. No real personal identifiable data is retained.
          </span>
        </div>
      </div>

      {/* Right Biometric Match Comparison Studio */}
      <div className="flex-1 bg-black border border-neutral-800 rounded p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                FACENET / ARCFACE BIOMETRIC RE-ID
              </span>
              <span className="px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-900 text-tactical-amber text-[9px] font-bold">
                SYNTHETIC PROTOTYPE
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-wider">
              IDENTITY PROFILE: {selectedFace.databaseId}
            </h3>
          </div>

          <div className={`px-2.5 py-1 rounded text-[10px] font-bold border uppercase ${
            selectedFace.watchlistStatus === 'WATCHLIST MATCH'
              ? 'bg-red-950 text-tactical-red border-red-800 animate-pulse'
              : 'bg-emerald-950 text-emerald-400 border-emerald-800'
          }`}>
            {selectedFace.watchlistStatus}
          </div>
        </div>

        {/* Pure Synthetic Biometric Mesh Comparison Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
              FIELD PROBE VECTOR (CCTV STREAM)
            </span>
            <BiometricWireframe
              id={selectedFace.databaseId}
              label="CCTV PROBE"
              color="#06b6d4"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
              WATCHLIST VECTOR TEMPLATE (GALLERY)
            </span>
            <BiometricWireframe
              id={selectedFace.databaseId}
              label="GALLERY REF"
              color={selectedFace.watchlistStatus === 'WATCHLIST MATCH' ? '#ef4444' : '#10b981'}
            />
          </div>
        </div>

        {/* Match Telemetry Bar */}
        <div className="p-3 rounded bg-obsidian-200 border border-neutral-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">COSINE VECTOR SIMILARITY:</span>
            <span className={`font-bold text-sm ${
              selectedFace.watchlistStatus === 'WATCHLIST MATCH' ? 'text-tactical-red' : 'text-tactical-green'
            }`}>
              {(selectedFace.matchScore * 100).toFixed(2)}%
            </span>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                selectedFace.watchlistStatus === 'WATCHLIST MATCH' ? 'bg-tactical-red' : 'bg-tactical-green'
              }`}
              style={{ width: `${selectedFace.matchScore * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1">
            <span>THRESHOLD FOR WATCHLIST ALERT: 85.0%</span>
            <span>RESULT: {selectedFace.watchlistStatus === 'WATCHLIST MATCH' ? 'CONFIRMED MATCH EXCEEDS THRESHOLD' : 'MATCH CLEARED'}</span>
          </div>
        </div>

        {/* 512-dim Feature Vector Hex Dump */}
        <div className="p-2.5 rounded bg-neutral-950 border border-neutral-900 text-[10px] text-neutral-500 flex flex-col gap-1 font-mono">
          <div className="flex items-center justify-between text-neutral-400 font-bold">
            <span>FEATURE EMBEDDING VECTOR HASH (SHA-256):</span>
            <span className="text-tactical-cyan">512 FLOAT32 TENSORS</span>
          </div>
          <code className="text-neutral-400 bg-black/60 p-2 rounded border border-neutral-900 break-all text-[9px]">
            [0.0842, -0.2190, 0.4491, 0.8123, -0.0094, 0.1284, -0.7421, 0.3201, 0.5891, -0.1984, 0.3012, -0.4901, ...]
          </code>
        </div>
      </div>
    </div>
  );
}
