"use client";

import React, { useState } from 'react';
import { Camera, Detection, Zone } from '@/types';
import { useSimulation } from '@/context/SimulationContext';
import { 
  Maximize2, 
  Minimize2, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Activity, 
  Layers, 
  Crosshair, 
  ZoomIn, 
  ZoomOut,
  Compass,
  Sliders
} from 'lucide-react';

interface CameraFeedProps {
  camera: Camera;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  showControls?: boolean;
}

export function CameraFeed({
  camera,
  isExpanded = false,
  onToggleExpand,
  showControls = true,
}: CameraFeedProps) {
  const { playTacticalSound } = useSimulation();
  const [showBoxes, setShowBoxes] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [filterMode, setFilterMode] = useState<'RAW' | 'IR_SIM' | 'NIGHT_VISION'>('RAW');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  const isTriggered = camera.activeZones.some(z => z.status === 'TRIGGERED');

  const handleZoom = (delta: number) => {
    playTacticalSound('click');
    setZoomLevel(prev => Math.max(1.0, Math.min(3.5, +(prev + delta).toFixed(1))));
  };

  const getFilterStyle = () => {
    if (filterMode === 'IR_SIM') {
      return 'filter invert-[85%] hue-rotate-180 contrast-200 brightness-110 saturate-200';
    }
    if (filterMode === 'NIGHT_VISION') {
      return 'filter sepia-[100%] hue-rotate-[90deg] saturate-[300%] contrast-150 brightness-90';
    }
    return 'filter grayscale-[30%] contrast-115 brightness-95';
  };

  return (
    <div 
      className={`group relative overflow-hidden bg-black border transition-all duration-300 flex flex-col ${
        isTriggered 
          ? 'border-red-900/90 shadow-[0_0_25px_rgba(239,68,68,0.2)]' 
          : 'border-neutral-800/80 hover:border-neutral-600'
      } ${isExpanded ? 'h-full w-full' : 'aspect-video w-full rounded-sm'}`}
    >
      {/* Background Camera Image Frame with Zoom transform */}
      <div className="relative w-full h-full flex-1 overflow-hidden bg-black select-none">
        <div 
          className="w-full h-full transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            src={camera.feedUrl}
            alt={camera.name}
            className={`w-full h-full object-cover pointer-events-none transition-all duration-500 ${getFilterStyle()}`}
          />
        </div>

        {/* Tactical Scanlines & Vignette */}
        <div className="absolute inset-0 scanline-layer opacity-45 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

        {/* In NVG or Thermal Mode: Colored Tint Overlays */}
        {filterMode === 'NIGHT_VISION' && (
          <div className="absolute inset-0 bg-emerald-950/25 mix-blend-color-dodge pointer-events-none" />
        )}
        {filterMode === 'IR_SIM' && (
          <div className="absolute inset-0 bg-cyan-950/20 mix-blend-overlay pointer-events-none" />
        )}

        {/* SVG Overlay Layer: Zones, Bounding Boxes, Vectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Virtual Zones */}
          {showZones && camera.activeZones.map(zone => {
            const pointsStr = zone.points.map(p => `${p.x},${p.y}`).join(' ');
            const isBreached = zone.status === 'TRIGGERED';
            const zoneColor = isBreached ? '#ef4444' : filterMode === 'NIGHT_VISION' ? '#22c55e' : '#06b6d4';

            return (
              <g key={zone.id}>
                <polygon
                  points={pointsStr}
                  fill={isBreached ? 'rgba(239, 68, 68, 0.28)' : 'rgba(6, 182, 212, 0.08)'}
                  stroke={zoneColor}
                  strokeWidth="0.5"
                  strokeDasharray={isBreached ? 'none' : '1.5 1'}
                  className={isBreached ? 'animate-pulse' : ''}
                />
                {zone.points[0] && (
                  <text
                    x={zone.points[0].x + 1}
                    y={zone.points[0].y + 3}
                    fill={zoneColor}
                    fontSize="2.2"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {zone.name} [{zone.status}]
                  </text>
                )}
              </g>
            );
          })}

          {/* AI Detections & Bounding Boxes */}
          {showBoxes && camera.currentDetections.map((det) => {
            const isCritical = det.trackingId === 'PERSON-042';
            const color = isCritical ? '#ef4444' : filterMode === 'NIGHT_VISION' ? '#22c55e' : '#10b981';

            return (
              <g key={det.id}>
                {/* Bounding Box Rect */}
                <rect
                  x={det.bbox.x}
                  y={det.bbox.y}
                  width={det.bbox.w}
                  height={det.bbox.h}
                  fill="none"
                  stroke={color}
                  strokeWidth="0.4"
                />

                {/* Corner Brackets */}
                <path
                  d={`
                    M ${det.bbox.x},${det.bbox.y + 2} L ${det.bbox.x},${det.bbox.y} L ${det.bbox.x + 2},${det.bbox.y}
                    M ${det.bbox.x + det.bbox.w - 2},${det.bbox.y} L ${det.bbox.x + det.bbox.w},${det.bbox.y} L ${det.bbox.x + det.bbox.w},${det.bbox.y + 2}
                    M ${det.bbox.x},${det.bbox.y + det.bbox.h - 2} L ${det.bbox.x},${det.bbox.y + det.bbox.h} L ${det.bbox.x + 2},${det.bbox.y + det.bbox.h}
                    M ${det.bbox.x + det.bbox.w - 2},${det.bbox.y + det.bbox.h} L ${det.bbox.x + det.bbox.w},${det.bbox.y + det.bbox.h} L ${det.bbox.x + det.bbox.w},${det.bbox.y + det.bbox.h - 2}
                  `}
                  stroke={color}
                  strokeWidth="0.7"
                  fill="none"
                />

                {/* Trajectory Breadcrumb trail */}
                {showTrajectory && (
                  <path
                    d={`M ${det.bbox.x - 6},${det.bbox.y + 4} Q ${det.bbox.x - 3},${det.bbox.y + 2} ${det.bbox.x + (det.bbox.w/2)},${det.bbox.y + det.bbox.h}`}
                    stroke={color}
                    strokeWidth="0.35"
                    strokeDasharray="0.8 0.8"
                    fill="none"
                  />
                )}

                {/* Label Badge */}
                <rect
                  x={det.bbox.x}
                  y={Math.max(1, det.bbox.y - 3.8)}
                  width={Math.max(18, det.bbox.w * 1.5)}
                  height="3.6"
                  fill={isCritical ? 'rgba(239,68,68,0.92)' : 'rgba(10,10,10,0.88)'}
                  stroke={color}
                  strokeWidth="0.3"
                />
                <text
                  x={det.bbox.x + 0.8}
                  y={Math.max(3.2, det.bbox.y - 1.2)}
                  fill="#ffffff"
                  fontSize="2"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {det.class.toUpperCase()} {det.trackingId} {(det.confidence * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}
        </svg>

        {/* HUD Top Left: Camera ID & Sensor Specs */}
        <div className="absolute top-2 left-2 flex items-center gap-2 pointer-events-none">
          <div className="px-1.5 py-0.5 bg-black/85 border border-neutral-700/80 rounded font-mono text-[10px] font-bold text-white flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isTriggered ? 'bg-tactical-red animate-ping' : 'bg-tactical-green'}`} />
            <span>{camera.id}</span>
          </div>
          <span className="font-mono text-[10px] text-neutral-300 drop-shadow hidden sm:inline">
            {camera.name}
          </span>
          {isTriggered && (
            <span className="px-1.5 py-0.5 bg-red-950/90 border border-red-700 rounded font-mono text-[9px] font-bold text-red-300 animate-pulse">
              PERIMETER BREACH
            </span>
          )}
        </div>

        {/* HUD Top Right: Telemetry & Optics Specs */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 pointer-events-none font-mono text-[9px] text-neutral-300">
          <span className="px-1.5 py-0.5 bg-black/80 border border-neutral-800 rounded">
            {camera.resolution}
          </span>
          <span className="px-1.5 py-0.5 bg-black/80 border border-neutral-800 rounded text-tactical-green">
            {camera.fps} FPS
          </span>
          <span className="px-1.5 py-0.5 bg-black/80 border border-neutral-800 rounded text-tactical-cyan">
            ZOOM: {zoomLevel.toFixed(1)}X
          </span>
        </div>

        {/* HUD Center Crosshair when expanded */}
        {isExpanded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
            <Crosshair className="w-16 h-16 text-neutral-300 stroke-1" />
          </div>
        )}

        {/* HUD Bottom Left: Spectrum Mode & Model Engine Tag */}
        <div className="absolute bottom-2 left-2 font-mono text-[9px] text-neutral-400 pointer-events-none flex items-center gap-2">
          <span className="bg-black/85 px-2 py-0.5 rounded border border-neutral-800/80">
            SPECTRUM: <span className="text-white font-bold">{filterMode === 'IR_SIM' ? 'FLIR LWIR 8-14μm' : filterMode === 'NIGHT_VISION' ? 'NVG GEN-3' : 'OPTICAL 4K'}</span>
          </span>
          <span className="hidden lg:inline bg-black/85 px-2 py-0.5 rounded border border-neutral-800/80 text-neutral-300">
            PTZ: AZ 048.2° // EL -08.4°
          </span>
        </div>

        {/* HUD Bottom Right: Interactive Controls & Filters */}
        {showControls && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/85 border border-neutral-800 rounded p-0.5 backdrop-blur-sm">
            {/* Filter Mode Selector */}
            <div className="flex items-center gap-0.5 mr-1 border-r border-neutral-800 pr-1">
              <button
                onClick={() => { playTacticalSound('click'); setFilterMode('RAW'); }}
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors ${
                  filterMode === 'RAW' ? 'bg-neutral-700 text-white font-bold' : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title="Optical RGB Mode"
              >
                OPT
              </button>
              <button
                onClick={() => { playTacticalSound('click'); setFilterMode('IR_SIM'); }}
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors ${
                  filterMode === 'IR_SIM' ? 'bg-cyan-900 text-cyan-200 font-bold border border-cyan-700' : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title="Thermal FLIR Infrared Mode"
              >
                FLIR
              </button>
              <button
                onClick={() => { playTacticalSound('click'); setFilterMode('NIGHT_VISION'); }}
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors ${
                  filterMode === 'NIGHT_VISION' ? 'bg-emerald-900 text-emerald-200 font-bold border border-emerald-700' : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title="Night Vision Phosphor Mode"
              >
                NVG
              </button>
            </div>

            {/* Overlays Toggles */}
            <button
              onClick={() => { playTacticalSound('click'); setShowBoxes(!showBoxes); }}
              className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors ${
                showBoxes ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Toggle AI Bounding Boxes"
            >
              BOX
            </button>
            <button
              onClick={() => { playTacticalSound('click'); setShowZones(!showZones); }}
              className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors ${
                showZones ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Toggle Intrusion Polygons"
            >
              ZONE
            </button>
            <button
              onClick={() => { playTacticalSound('click'); setShowTrajectory(!showTrajectory); }}
              className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors ${
                showTrajectory ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Toggle Motion Vectors"
            >
              TRAJ
            </button>

            {/* Optical Zoom Controls */}
            <div className="flex items-center gap-0.5 ml-1 border-l border-neutral-800 pl-1">
              <button
                onClick={() => handleZoom(0.5)}
                className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleZoom(-0.5)}
                className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
            </div>

            {onToggleExpand && (
              <button
                onClick={() => { playTacticalSound('click'); onToggleExpand(); }}
                className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ml-0.5"
                title={isExpanded ? 'Compress View' : 'Cinematic Expand'}
              >
                {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
