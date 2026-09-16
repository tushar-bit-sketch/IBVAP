"use client";

import React, { useState } from 'react';
import { 
  Camera, 
  Server, 
  Cpu, 
  Layers, 
  Zap, 
  Database, 
  Monitor, 
  CloudOff, 
  Radio, 
  CheckCircle2 
} from 'lucide-react';

interface ArchNode {
  id: string;
  name: string;
  sub: string;
  role: string;
  tech: string;
  latency: string;
  isEdge: boolean;
}

const NODES: ArchNode[] = [
  {
    id: 'cctv',
    name: 'CCTV INFRASTRUCTURE',
    sub: 'Existing ONVIF / RTSP Cameras',
    role: 'Legacy Video Capture',
    tech: 'H.264 / H.265 RTSP Stream',
    latency: '0ms (Source)',
    isEdge: true,
  },
  {
    id: 'edge_ingest',
    name: 'EDGE ACCELERATOR',
    sub: 'NVIDIA Jetson / x86 Embedded',
    role: 'Hardware Video Decoding & Ingestion',
    tech: 'DeepStream / FFmpeg NVDEC',
    latency: '8ms',
    isEdge: true,
  },
  {
    id: 'cv_engine',
    name: 'YOLOV8x + DEEPSORT',
    sub: 'Edge Object Tracking Daemon',
    role: 'Real-time Object Detection & Tracking',
    tech: 'TensorRT INT8 Precision',
    latency: '24ms',
    isEdge: true,
  },
  {
    id: 'anomaly',
    name: 'ANOMALY & ANPR ENGINE',
    sub: 'LPRNet + Virtual Zone Breaches',
    role: 'Behavioral Tripwire & Biometrics',
    tech: 'ArcFace / OpenCV Python C++',
    latency: '35ms',
    isEdge: true,
  },
  {
    id: 'fastapi',
    name: 'FASTAPI & REDIS BUS',
    sub: 'Local Event Broker',
    role: 'Sub-second Tactical Pub/Sub',
    tech: 'FastAPI / Redis Streams',
    latency: '4ms',
    isEdge: true,
  },
  {
    id: 'db',
    name: 'LOCAL TIMESCALEDB',
    sub: 'On-device Event Store',
    role: 'Forensic Video & Telemetry Storage',
    tech: 'PostgreSQL + TimescaleDB',
    latency: '6ms',
    isEdge: true,
  },
  {
    id: 'operator',
    name: 'TACTICAL DASHBOARD',
    sub: 'BOP Mission Control',
    role: 'Human-in-the-loop Operational Terminal',
    tech: 'Next.js / WebSocket / WebGL',
    latency: '<100ms Total',
    isEdge: true,
  },
  {
    id: 'hq_sync',
    name: 'CENTRAL HQ COMMAND',
    sub: 'National Border Surveillance Sync',
    role: 'Periodic Batch Aggregation (Optional)',
    tech: 'Asynchronous MQTT / TLS',
    latency: 'Opportunistic',
    isEdge: false,
  }
];

export function ArchitectureGraph() {
  const [activeNode, setActiveNode] = useState<ArchNode>(NODES[2]);

  return (
    <div className="w-full flex flex-col gap-6 font-mono select-none">
      {/* Edge-First Banner */}
      <div className="p-4 rounded bg-obsidian-200 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-neutral-900 border border-neutral-700 text-tactical-green">
            <CloudOff className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest block">
              PARADIGM SHIFT: ZERO CLOUD DEPENDENCY AT THE PERIMETER
            </span>
            <h3 className="text-sm font-bold text-white tracking-wide">
              100% LOCAL EDGE INFERENCE & AUTONOMOUS SURVIVABILITY
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/60 border border-neutral-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-tactical-green animate-pulse" />
          <span className="text-neutral-300">WAN DISCONNECTED: FULLY OPERATIONAL</span>
        </div>
      </div>

      {/* Pipeline Diagram */}
      <div className="p-4 bg-black border border-neutral-800 rounded flex flex-col gap-4">
        <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
          SYSTEM DATA FLOW & PIPELINE STAGES (CLICK NODE TO INSPECT)
        </span>

        {/* Nodes Grid / Chain */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
          {NODES.map((node, i) => {
            const isSelected = activeNode.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setActiveNode(node)}
                className={`p-3 rounded border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] relative group ${
                  isSelected 
                    ? 'bg-neutral-800 border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]' 
                    : 'bg-obsidian-200 border-neutral-800 hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-bold text-neutral-500">
                    STAGE / 0{i + 1}
                  </span>
                  <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${
                    node.isEdge ? 'bg-emerald-950/60 text-tactical-green border border-emerald-900' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {node.isEdge ? 'EDGE' : 'HQ SYNC'}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-white leading-tight mb-1 group-hover:text-neutral-200">
                    {node.name}
                  </h4>
                  <p className="text-[10px] text-neutral-400 leading-snug">
                    {node.sub}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[9px] text-neutral-500">
                  <span>LATENCY:</span>
                  <span className="text-tactical-cyan font-bold">{node.latency}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Node Technical Specs */}
        <div className="p-4 rounded bg-obsidian-200 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
              COMPONENT SPECIFICATION: {activeNode.name}
            </span>
            <div className="text-sm font-bold text-white">
              ROLE: <span className="text-neutral-300 font-normal">{activeNode.role}</span>
            </div>
            <div className="text-xs text-neutral-400">
              TECH STACK: <span className="text-tactical-cyan">{activeNode.tech}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/60 p-3 rounded border border-neutral-800 text-xs">
            <div className="flex flex-col">
              <span className="text-[9px] text-neutral-500 uppercase">PROCESSING LATENCY</span>
              <span className="text-sm font-bold text-tactical-green">{activeNode.latency}</span>
            </div>
            <div className="h-6 w-[1px] bg-neutral-800" />
            <div className="flex flex-col">
              <span className="text-[9px] text-neutral-500 uppercase">FAULT TOLERANCE</span>
              <span className="text-sm font-bold text-white">LOCAL FALLBACK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
