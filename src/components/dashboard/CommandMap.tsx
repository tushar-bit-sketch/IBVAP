"use client";

import React, { useState } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { BOPNode } from '@/types';
import { 
  Radio, 
  ShieldAlert, 
  Activity, 
  MapPin, 
  Server, 
  Wifi, 
  Crosshair, 
  Maximize2 
} from 'lucide-react';

export function CommandMap() {
  const { bopNodes, currentTimeStr } = useSimulation();
  const [selectedNode, setSelectedNode] = useState<BOPNode>(bopNodes[1]); // Default BOP-17

  return (
    <div className="w-full h-full flex flex-col xl:flex-row gap-3 bg-black border border-neutral-800 rounded-sm p-3 relative overflow-hidden select-none">
      {/* Abstract Tactical Sector Map Grid */}
      <div className="flex-1 relative min-h-[350px] bg-neutral-950 border border-neutral-900 rounded overflow-hidden flex items-center justify-center">
        {/* Background Radar Grid */}
        <div className="absolute inset-0 bg-grid-tactical opacity-20 pointer-events-none" />
        
        {/* Radar Concentric Circles */}
        <div className="absolute w-[450px] h-[450px] rounded-full border border-neutral-800/40 pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-neutral-800/60 pointer-events-none" />
        <div className="absolute w-[150px] h-[150px] rounded-full border border-neutral-800/80 pointer-events-none" />
        
        {/* Rotating Radar Sweep Line */}
        <div className="absolute w-[450px] h-[450px] rounded-full overflow-hidden pointer-events-none">
          <div className="w-full h-full animate-radar-sweep bg-gradient-to-r from-transparent via-cyan-900/10 to-transparent" />
        </div>

        {/* Sector Labels */}
        <div className="absolute top-3 left-3 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
          TACTICAL BORDER CORRIDOR / 74°E - 34°N
        </div>
        <div className="absolute bottom-3 left-3 font-mono text-[9px] text-neutral-500">
          SURVEILLANCE RADIAL COVERAGE: 64 KM
        </div>
        <div className="absolute bottom-3 right-3 font-mono text-[9px] text-neutral-500">
          PROJECTION: WGS84 / TACTICAL GRID
        </div>

        {/* BOP Outpost Nodes plotted on the abstract grid */}
        {bopNodes.map((node, i) => {
          // Abstract coordinates on grid
          const positions = [
            { x: '25%', y: '35%' }, // BOP-01
            { x: '52%', y: '48%' }, // BOP-17
            { x: '78%', y: '28%' }, // BOP-23
            { x: '42%', y: '75%' }, // BOP-41
          ];
          const pos = positions[i] || { x: '50%', y: '50%' };
          const isSelected = selectedNode.id === node.id;
          const isAlert = node.status === 'ALERT';

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{ left: pos.x, top: pos.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
            >
              {/* Radar pulse ring if alert */}
              {isAlert && (
                <div className="absolute -inset-2 rounded-full border border-tactical-red radar-ping pointer-events-none" />
              )}

              <div className={`p-1.5 rounded flex items-center gap-2 border transition-all ${
                isSelected 
                  ? 'bg-neutral-100 text-neutral-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                  : isAlert
                  ? 'bg-red-950/80 text-red-200 border-red-700'
                  : 'bg-neutral-900/90 text-neutral-300 border-neutral-700 hover:border-neutral-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isAlert ? 'bg-tactical-red animate-pulse' : 'bg-tactical-green'
                }`} />
                <span className="font-mono text-[11px] font-bold tracking-wider">
                  {node.code}
                </span>
              </div>

              {/* Node Mini Sublabel */}
              <div className="font-mono text-[8px] text-neutral-400 mt-1 text-center whitespace-nowrap drop-shadow bg-black/60 px-1 rounded">
                {node.sector.split('/')[0]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Node Telemetry Inspector Drawer / Panel */}
      <div className="w-full xl:w-80 bg-obsidian-200 border border-neutral-800 rounded p-3 flex flex-col justify-between font-mono text-xs">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div>
              <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest block">
                OUTPOST TELEMETRY
              </span>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {selectedNode.code} — {selectedNode.name}
              </h3>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
              selectedNode.status === 'ALERT'
                ? 'bg-red-950 border-red-800 text-tactical-red'
                : 'bg-neutral-900 border-neutral-800 text-tactical-green'
            }`}>
              {selectedNode.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800 flex flex-col">
              <span className="text-[9px] text-neutral-500 uppercase">CAMERAS</span>
              <span className="text-sm font-bold text-white">{selectedNode.cameraCount} STREAMS</span>
            </div>
            <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800 flex flex-col">
              <span className="text-[9px] text-neutral-500 uppercase">ACTIVE ALERTS</span>
              <span className={`text-sm font-bold ${selectedNode.activeAlerts > 0 ? 'text-tactical-red' : 'text-neutral-300'}`}>
                {selectedNode.activeAlerts} CRITICAL
              </span>
            </div>
            <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800 flex flex-col">
              <span className="text-[9px] text-neutral-500 uppercase">EDGE LOAD</span>
              <span className="text-sm font-bold text-tactical-cyan">{selectedNode.edgeLoad}%</span>
            </div>
            <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800 flex flex-col">
              <span className="text-[9px] text-neutral-500 uppercase">HQ SYNC</span>
              <span className="text-sm font-bold text-neutral-300">{selectedNode.lastSync}</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-neutral-900/40 border border-neutral-800 flex flex-col gap-1 text-[11px]">
            <div className="flex justify-between text-neutral-400">
              <span>LATITUDE / LONGITUDE:</span>
              <span className="text-neutral-200">{selectedNode.coordinates.lat}° N, {selectedNode.coordinates.lng}° E</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>SECTOR ZONE:</span>
              <span className="text-neutral-200">{selectedNode.sector}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>THREAT PROFILE:</span>
              <span className={`font-bold ${
                selectedNode.threatLevel === 'CRITICAL' ? 'text-tactical-red' :
                selectedNode.threatLevel === 'ELEVATED' ? 'text-tactical-amber' :
                'text-tactical-green'
              }`}>{selectedNode.threatLevel}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-800">
          <div className="flex items-center justify-between text-[10px] text-neutral-500">
            <span>EDGE NODE HEARTBEAT</span>
            <span className="text-tactical-green">NOMINAL 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
