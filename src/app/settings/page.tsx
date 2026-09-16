"use client";

import React, { useState } from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { 
  Settings, 
  Sliders, 
  Cpu, 
  Bell, 
  ShieldCheck, 
  Database, 
  Save, 
  Check, 
  RefreshCw, 
  Server 
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'THRESHOLDS' | 'MODELS' | 'NOTIFICATIONS' | 'SYSTEM'>('THRESHOLDS');
  const [personConfidence, setPersonConfidence] = useState(0.85);
  const [vehicleConfidence, setVehicleConfidence] = useState(0.80);
  const [loiterThresholdSec, setLoiterThresholdSec] = useState(60);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-neutral-100 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-wider">
                  EDGE NODE PARAMETERS &amp; COMPUTER VISION CONFIGURATION
                </h1>
                <p className="text-[10px] text-neutral-500">
                  LOCAL ACCELERATOR RUNTIME, INFERENCE THRESHOLDS &amp; SENSITIVITIES
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded bg-neutral-100 text-neutral-950 font-bold hover:bg-white text-xs transition-all active:scale-95"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'PERSISTED TO EDGE NODE' : 'SAVE CONFIGURATION'}</span>
            </button>
          </div>

          {/* Grouped Technical Tabs */}
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 text-xs">
            {[
              { id: 'THRESHOLDS', label: 'DETECTION THRESHOLDS', icon: Sliders },
              { id: 'MODELS', label: 'MODEL DEPLOYMENT', icon: Cpu },
              { id: 'NOTIFICATIONS', label: 'ALERT ROUTING', icon: Bell },
              { id: 'SYSTEM', label: 'NODE TELEMETRY & LOGS', icon: Server },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${
                    isActive ? 'bg-neutral-800 text-white font-bold border border-neutral-700' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 bg-obsidian-200 border border-neutral-800 rounded p-5 flex flex-col gap-6 text-xs max-w-4xl">
            {activeTab === 'THRESHOLDS' && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5 p-3 rounded bg-neutral-900 border border-neutral-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white uppercase">HUMAN DETECTION CONFIDENCE THRESHOLD</span>
                    <span className="text-tactical-green font-bold">{(personConfidence * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="0.98"
                    step="0.01"
                    value={personConfidence}
                    onChange={(e) => setPersonConfidence(parseFloat(e.target.value))}
                    className="accent-tactical-green cursor-pointer mt-1"
                  />
                  <span className="text-[10px] text-neutral-500">
                    Target Human Detection Target: &gt;85%. Suppresses false triggers from shrub movement and desert debris.
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 p-3 rounded bg-neutral-900 border border-neutral-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white uppercase">VEHICLE CLASSIFICATION THRESHOLD</span>
                    <span className="text-tactical-cyan font-bold">{(vehicleConfidence * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="0.98"
                    step="0.01"
                    value={vehicleConfidence}
                    onChange={(e) => setVehicleConfidence(parseFloat(e.target.value))}
                    className="accent-tactical-cyan cursor-pointer mt-1"
                  />
                  <span className="text-[10px] text-neutral-500">
                    Filters car, truck, and bus classifications for Checkpoint Alpha ANPR gate.
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 p-3 rounded bg-neutral-900 border border-neutral-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white uppercase">LOITERING STATIONARY DWELL TIMER</span>
                    <span className="text-tactical-amber font-bold">{loiterThresholdSec} SECONDS</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="180"
                    step="5"
                    value={loiterThresholdSec}
                    onChange={(e) => setLoiterThresholdSec(parseInt(e.target.value))}
                    className="accent-tactical-amber cursor-pointer mt-1"
                  />
                  <span className="text-[10px] text-neutral-500">
                    Triggers behavioral anomaly alert when tracked object persists within restricted polygon buffer.
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'MODELS' && (
              <div className="flex flex-col gap-3">
                {[
                  { name: 'YOLOv8x-Border-Custom', precision: 'TensorRT INT8', latency: '24ms', status: 'ACTIVE' },
                  { name: 'DeepSORT-v2.1 Kalman', precision: 'FP16', latency: '12ms', status: 'ACTIVE' },
                  { name: 'LPRNet-v3 Indian ANPR', precision: 'INT8', latency: '18ms', status: 'ACTIVE' },
                  { name: 'ArcFace-Biometric-512', precision: 'FP16', latency: '35ms', status: 'ACTIVE' }
                ].map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded bg-neutral-900 border border-neutral-800">
                    <div>
                      <div className="font-bold text-white text-xs">{m.name}</div>
                      <div className="text-[10px] text-neutral-400">PRECISION: {m.precision} // RUNTIME: {m.latency}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-tactical-green border border-emerald-900 text-[10px] font-bold">
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'NOTIFICATIONS' && (
              <div className="flex flex-col gap-3">
                <div className="p-3 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">TACTICAL AUDIO CHIRP</div>
                    <div className="text-[10px] text-neutral-400">Synthesize alert frequency chime upon CRITICAL perimeter breach</div>
                  </div>
                  <span className="text-tactical-green font-bold">ENABLED</span>
                </div>

                <div className="p-3 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">REDIS STREAM EVENT BUS</div>
                    <div className="text-[10px] text-neutral-400">Local sub-millisecond pub/sub broadcast on 127.0.0.1:6379</div>
                  </div>
                  <span className="text-tactical-green font-bold">CONNECTED</span>
                </div>
              </div>
            )}

            {activeTab === 'SYSTEM' && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-neutral-500 font-bold uppercase">EDGE NODE AUDIT LOG</span>
                <div className="p-3 rounded bg-black border border-neutral-900 text-[11px] text-neutral-400 flex flex-col gap-1 font-mono">
                  <div>[14:32:48] HEARTBEAT: BOP-17 edge node healthy. GPU load: 68%. VRAM: 3.8 / 8.0 GB.</div>
                  <div>[14:30:45] INFERENCE: CAM-01 tripwire breach detected for PERSON-042. Alert published.</div>
                  <div>[14:28:12] ANPR: Checkpoint Alpha processed TN01AB1234. Confidence 88.4%.</div>
                  <div>[14:20:00] TIME_SYNC: Edge hardware RTC calibrated to IST (NTP local).</div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
