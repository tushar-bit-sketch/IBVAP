"use client";

import React, { useState, useRef } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { Zone, ZoneType } from '@/types';
import { 
  Shield, 
  Plus, 
  Check, 
  Trash2, 
  AlertTriangle, 
  Layers, 
  Activity, 
  Sliders, 
  Save,
  PenTool,
  RotateCcw,
  Compass
} from 'lucide-react';

export function ZoneEditor() {
  const { cameras, updateZone, addCustomZone, deleteZone, playTacticalSound } = useSimulation();
  const [selectedCameraId, setSelectedCameraId] = useState<string>('CAM-01');
  const activeCamera = cameras.find(c => c.id === selectedCameraId) || cameras[0];
  const [selectedZoneId, setSelectedZoneId] = useState<string>(activeCamera.activeZones[0]?.id || '');
  
  // Custom Interactive Drawing State
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<{ x: number; y: number }[]>([]);
  const [newZoneName, setNewZoneName] = useState('CUSTOM INTRUSION ZONE');
  const [newZoneType, setNewZoneType] = useState<ZoneType>('RESTRICTED AREA');
  const frameRef = useRef<HTMLDivElement>(null);

  const selectedZone = activeCamera.activeZones.find(z => z.id === selectedZoneId) || activeCamera.activeZones[0];

  const handleSensitivityChange = (val: number) => {
    if (!selectedZone) return;
    updateZone({
      ...selectedZone,
      sensitivity: val,
    });
  };

  const toggleZoneStatus = () => {
    if (!selectedZone) return;
    playTacticalSound('breach');
    updateZone({
      ...selectedZone,
      status: selectedZone.status === 'ACTIVE' ? 'TRIGGERED' : 'ACTIVE',
    });
  };

  // Click to draw vertex on frame
  const handleFrameClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    playTacticalSound('click');
    setDrawnPoints(prev => [...prev, { x: +clickX.toFixed(1), y: +clickY.toFixed(1) }]);
  };

  const completeCustomPolygon = () => {
    if (drawnPoints.length < 3) {
      alert('A polygon perimeter requires at least 3 vertex points.');
      return;
    }

    const newId = `zone-${Date.now().toString().slice(-4)}`;
    const newZone: Zone = {
      id: newId,
      name: newZoneName,
      type: newZoneType,
      cameraId: selectedCameraId,
      status: 'ACTIVE',
      sensitivity: 0.92,
      points: drawnPoints,
    };

    playTacticalSound('ack');
    addCustomZone(newZone);
    setSelectedZoneId(newId);
    setDrawnPoints([]);
    setIsDrawing(false);
  };

  const handleDeleteZone = () => {
    if (!selectedZone) return;
    if (activeCamera.activeZones.length <= 1) {
      alert('Each camera requires at least one configured zone.');
      return;
    }
    playTacticalSound('click');
    deleteZone(selectedZone.id, selectedCameraId);
    const remaining = activeCamera.activeZones.filter(z => z.id !== selectedZone.id);
    if (remaining.length > 0) {
      setSelectedZoneId(remaining[0].id);
    }
  };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-4 font-mono select-none">
      {/* Zone Canvas Preview (Left 2/3) */}
      <div className="flex-1 bg-white border border-sandal-200 rounded p-3 flex flex-col gap-3 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-sandal-200 text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sandal-600" />
            <span className="font-bold text-stone-950 tracking-wider">
              VIRTUAL PERIMETER &amp; INTRUSION POLYGON STUDIO
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-stone-500">CAMERA:</span>
              <select
                value={selectedCameraId}
                onChange={(e) => {
                  setSelectedCameraId(e.target.value);
                  const cam = cameras.find(c => c.id === e.target.value);
                  if (cam && cam.activeZones.length > 0) {
                    setSelectedZoneId(cam.activeZones[0].id);
                  }
                  setDrawnPoints([]);
                  setIsDrawing(false);
                }}
                className="bg-sandal-50 border border-sandal-300 rounded px-2 py-1 text-xs text-stone-900 focus:outline-none"
              >
                {cameras.map(c => (
                  <option key={c.id} value={c.id}>{c.id} — {c.name}</option>
                ))}
              </select>
            </div>

            {/* Draw New Polygon Trigger */}
            <button
              onClick={() => {
                playTacticalSound('click');
                setIsDrawing(!isDrawing);
                setDrawnPoints([]);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all ${
                isDrawing 
                  ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]' 
                  : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>{isDrawing ? 'CANCEL DRAW' : 'DRAW NEW ZONE'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Polygon Video Frame */}
        <div 
          ref={frameRef}
          onClick={handleFrameClick}
          className={`relative aspect-video rounded overflow-hidden border bg-neutral-950 select-none group ${
            isDrawing ? 'cursor-crosshair border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'border-neutral-800'
          }`}
        >
          {activeCamera.feedUrl?.endsWith('.mp4') || activeCamera.videoUrl ? (
            <video
              src={activeCamera.videoUrl || activeCamera.feedUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover filter contrast-110 grayscale-[40%]"
            />
          ) : (
            <img
              src={activeCamera.feedUrl}
              alt={activeCamera.name}
              className="w-full h-full object-cover filter contrast-110 grayscale-[40%]"
            />
          )}
          <div className="absolute inset-0 scanline-layer opacity-40 pointer-events-none" />

          {/* SVG Polygonal Zones */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {activeCamera.activeZones.map((zone) => {
              const pointsStr = zone.points.map(p => `${p.x},${p.y}`).join(' ');
              const isSelected = zone.id === selectedZone?.id;
              const isTriggered = zone.status === 'TRIGGERED';

              return (
                <g key={zone.id}>
                  <polygon
                    points={pointsStr}
                    fill={isTriggered ? 'rgba(239, 68, 68, 0.3)' : isSelected ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.08)'}
                    stroke={isTriggered ? '#ef4444' : isSelected ? '#06b6d4' : 'rgba(255, 255, 255, 0.4)'}
                    strokeWidth={isSelected ? '0.8' : '0.4'}
                    strokeDasharray={isTriggered ? 'none' : '1.5 1'}
                    className={isTriggered ? 'animate-pulse' : ''}
                  />

                  {/* Vertices Handle points */}
                  {zone.points.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r={isSelected ? '1.2' : '0.8'}
                      fill={isTriggered ? '#ef4444' : isSelected ? '#06b6d4' : '#ffffff'}
                      stroke="#000000"
                      strokeWidth="0.3"
                    />
                  ))}

                  {/* Polygon Center Label */}
                  {zone.points[0] && (
                    <text
                      x={zone.points[0].x + 1}
                      y={zone.points[0].y + 3}
                      fill={isTriggered ? '#ef4444' : isSelected ? '#06b6d4' : '#ffffff'}
                      fontSize="2.4"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {zone.name} [{zone.status}]
                    </text>
                  )}
                </g>
              );
            })}

            {/* Currently Drawing Polygon Preview */}
            {isDrawing && drawnPoints.length > 0 && (
              <g>
                <polyline
                  points={drawnPoints.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="rgba(245, 158, 11, 0.2)"
                  stroke="#f59e0b"
                  strokeWidth="0.7"
                  strokeDasharray="1.5 1"
                />
                {drawnPoints.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r="1.4"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="0.4"
                  />
                ))}
              </g>
            )}
          </svg>

          {/* Interactive Drawing Instructions Bar */}
          <div className="absolute top-2 left-2 flex items-center gap-2">
            {isDrawing ? (
              <div className="px-2.5 py-1 bg-amber-950/90 border border-amber-500 rounded text-amber-300 font-bold text-xs flex items-center gap-2 shadow-lg animate-pulse">
                <PenTool className="w-3.5 h-3.5" />
                <span>CLICK ANYWHERE ON VIDEO FRAME TO PLACE VERTICES ({drawnPoints.length} POINTS)</span>
              </div>
            ) : (
              <div className="px-2 py-0.5 bg-black/80 rounded border border-neutral-700 text-[10px] text-neutral-300">
                ACTIVE CHANNEL: {selectedCameraId}
              </div>
            )}
          </div>

          {/* Bottom Controls when drawing */}
          {isDrawing && (
            <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/90 p-1.5 rounded border border-amber-500/80 shadow-2xl">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDrawnPoints([]);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded bg-neutral-800 text-neutral-300 hover:text-white text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>CLEAR</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  completeCustomPolygon();
                }}
                disabled={drawnPoints.length < 3}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-400 text-black font-bold text-xs disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>SAVE POLYGON ({drawnPoints.length} PTS)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Zone Configuration Sidebar (Right 1/3) */}
      <div className="w-full xl:w-96 bg-white border border-sandal-200 rounded p-4 flex flex-col gap-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-sandal-200 text-xs">
          <span className="font-bold text-stone-950 uppercase tracking-wider">
            PERIMETER PARAMETERS
          </span>
          <span className="px-1.5 py-0.5 rounded bg-sandal-100 text-[10px] text-stone-700 font-bold">
            {activeCamera.activeZones.length} ACTIVE
          </span>
        </div>

        {/* Zone Selector Pills */}
        <div className="flex flex-wrap gap-1.5">
          {activeCamera.activeZones.map(z => (
            <button
              key={z.id}
              onClick={() => {
                playTacticalSound('click');
                setSelectedZoneId(z.id);
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                selectedZone?.id === z.id 
                  ? 'bg-stone-900 text-white shadow' 
                  : 'bg-sandal-50 border border-sandal-200 text-stone-700 hover:text-stone-950 hover:bg-sandal-100'
              }`}
            >
              {z.name}
            </button>
          ))}
        </div>

        {selectedZone ? (
          <div className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-stone-500 uppercase font-semibold">ZONE NAME</span>
              <input
                type="text"
                value={selectedZone.name}
                onChange={(e) => updateZone({ ...selectedZone, name: e.target.value })}
                className="px-2.5 py-1.5 rounded bg-sandal-50 border border-sandal-300 text-stone-900 font-mono text-xs focus:border-sandal-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-stone-500 uppercase font-semibold">ZONE CLASSIFICATION</span>
              <select
                value={selectedZone.type}
                onChange={(e) => updateZone({ ...selectedZone, type: e.target.value as ZoneType })}
                className="px-2.5 py-1.5 rounded bg-sandal-50 border border-sandal-300 text-stone-900 font-mono text-xs focus:border-sandal-500 focus:outline-none"
              >
                <option value="BORDER FENCE">BORDER FENCE</option>
                <option value="RESTRICTED AREA">RESTRICTED AREA</option>
                <option value="PATROL CORRIDOR">PATROL CORRIDOR</option>
                <option value="BUFFER ZONE">BUFFER ZONE</option>
              </select>
            </div>

            {/* Sensitivity Slider */}
            <div className="flex flex-col gap-1.5 p-3 rounded bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-neutral-400 font-semibold uppercase">TRIPWIRE SENSITIVITY</span>
                <span className="text-tactical-cyan font-bold">{(selectedZone.sensitivity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.99"
                step="0.01"
                value={selectedZone.sensitivity}
                onChange={(e) => handleSensitivityChange(parseFloat(e.target.value))}
                className="w-full accent-tactical-cyan cursor-pointer"
              />
              <span className="text-[9px] text-neutral-500">
                Sensitivity coefficient for Kalman filter boundary collision tests.
              </span>
            </div>

            {/* Test Trigger Button */}
            <div className="flex flex-col gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={toggleZoneStatus}
                className={`py-2 px-3 rounded font-mono text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                  selectedZone.status === 'TRIGGERED'
                    ? 'bg-red-950 text-tactical-red border border-red-800 hover:bg-red-900/50'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>TOGGLE INTRUSION BREACH</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDeleteZone}
                  className="py-2 px-3 rounded bg-neutral-900 hover:bg-red-950 border border-neutral-800 hover:border-red-800 text-neutral-400 hover:text-red-300 font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>DELETE</span>
                </button>

                <button
                  onClick={() => {
                    playTacticalSound('ack');
                    alert(`Perimeter configuration for ${selectedZone.name} persisted to edge node.`);
                  }}
                  className="py-2 px-3 rounded bg-neutral-100 text-neutral-950 hover:bg-white font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>SAVE ZONE</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-neutral-500 text-xs">
            No zone selected.
          </div>
        )}
      </div>
    </div>
  );
}
