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
    <div className="w-full flex flex-col gap-5 font-mono select-none">
      {/* Edge-First Banner */}
      <div className="p-4 rounded-lg bg-white border border-sandal-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
            <CloudOff className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest block">
              PARADIGM SHIFT: ZERO CLOUD DEPENDENCY AT THE PERIMETER
            </span>
            <h3 className="text-sm font-bold text-stone-950 tracking-wide">
              100% LOCAL EDGE INFERENCE &amp; AUTONOMOUS SURVIVABILITY
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-emerald-900 font-semibold text-[11px]">WAN DISCONNECTED: FULLY OPERATIONAL</span>
        </div>
      </div>

      {/* Pipeline Diagram */}
      <div className="p-5 bg-white border border-sandal-200 rounded-lg flex flex-col gap-4 shadow-2xs">
        <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">
          SYSTEM DATA FLOW &amp; PIPELINE STAGES (CLICK NODE TO INSPECT)
        </span>

        {/* Nodes Grid / Chain */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
          {NODES.map((node, i) => {
            const isSelected = activeNode.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setActiveNode(node)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] relative group ${
                  isSelected 
                    ? 'bg-sandal-100/90 border-sandal-400 ring-2 ring-sandal-300 shadow-2xs' 
                    : 'bg-[#faf8f5] border-sandal-200 hover:border-sandal-400 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-bold text-stone-500">
                    STAGE / 0{i + 1}
                  </span>
                  <span className={`text-[8px] px-1.5 py-0.2 rounded font-bold ${
                    node.isEdge ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-sandal-100 text-sandal-800 border border-sandal-200'
                  }`}>
                    {node.isEdge ? 'EDGE' : 'HQ SYNC'}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-stone-950 leading-tight mb-1">
                    {node.name}
                  </h4>
                  <p className="text-[10px] text-stone-600 leading-snug">
                    {node.sub}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-sandal-200 text-[9px] text-stone-500 font-medium">
                  <span>LATENCY:</span>
                  <span className="text-sandal-800 font-bold">{node.latency}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Node Technical Specs */}
        <div className="p-4 rounded-lg bg-[#faf8f5] border border-sandal-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">
              COMPONENT SPECIFICATION: {activeNode.name}
            </span>
            <div className="text-sm font-bold text-stone-950">
              ROLE: <span className="text-stone-700 font-normal">{activeNode.role}</span>
            </div>
            <div className="text-xs text-stone-600">
              TECH STACK: <span className="text-sandal-700 font-semibold">{activeNode.tech}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-sandal-200 text-xs shadow-2xs">
            <div className="flex flex-col">
              <span className="text-[9px] text-stone-500 font-semibold uppercase">PROCESSING LATENCY</span>
              <span className="text-sm font-bold text-emerald-700">{activeNode.latency}</span>
            </div>
            <div className="h-6 w-[1px] bg-sandal-200" />
            <div className="flex flex-col">
              <span className="text-[9px] text-stone-500 font-semibold uppercase">FAULT TOLERANCE</span>
              <span className="text-sm font-bold text-stone-900">LOCAL FALLBACK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
