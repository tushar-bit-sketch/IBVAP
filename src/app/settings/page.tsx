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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#faf8f5] text-stone-900 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 font-mono bg-[#faf8f5]">
          <div className="flex items-center justify-between pb-3 border-b border-sandal-200 text-xs bg-white p-4 rounded-lg shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sandal-50 border border-sandal-200 text-sandal-700">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-stone-950 tracking-wider">
                  EDGE NODE PARAMETERS &amp; COMPUTER VISION CONFIGURATION
                </h1>
                <p className="text-[10px] text-stone-500 font-semibold uppercase">
                  LOCAL ACCELERATOR RUNTIME, INFERENCE THRESHOLDS &amp; SENSITIVITIES
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900 text-white font-bold hover:bg-stone-800 text-xs transition-all active:scale-95 shadow-2xs"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4 text-sandal-300" />}
              <span>{savedSuccess ? 'PERSISTED TO EDGE NODE' : 'SAVE CONFIGURATION'}</span>
            </button>
          </div>

          {/* Grouped Technical Tabs */}
          <div className="flex items-center gap-2 border-b border-sandal-200 pb-2 text-xs">
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
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-colors font-semibold ${
                    isActive ? 'bg-sandal-100 text-sandal-900 font-bold border border-sandal-300 shadow-2xs' : 'text-stone-600 hover:text-stone-900 hover:bg-sandal-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-sandal-600" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 bg-white border border-sandal-200 rounded-lg p-5 flex flex-col gap-6 text-xs max-w-4xl shadow-2xs">
            {activeTab === 'THRESHOLDS' && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5 p-3.5 rounded-lg bg-[#faf8f5] border border-sandal-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-900 uppercase">HUMAN DETECTION CONFIDENCE THRESHOLD</span>
                    <span className="text-emerald-800 font-bold">{(personConfidence * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="0.98"
                    step="0.01"
                    value={personConfidence}
                    onChange={(e) => setPersonConfidence(parseFloat(e.target.value))}
                    className="accent-sandal-600 cursor-pointer mt-1"
                  />
                  <span className="text-[10px] text-stone-500 font-medium">
                    Target Human Detection Target: &gt;85%. Suppresses false triggers from shrub movement and desert debris.
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 p-3.5 rounded-lg bg-[#faf8f5] border border-sandal-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-900 uppercase">VEHICLE CLASSIFICATION THRESHOLD</span>
                    <span className="text-sandal-700 font-bold">{(vehicleConfidence * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="0.98"
                    step="0.01"
                    value={vehicleConfidence}
                    onChange={(e) => setVehicleConfidence(parseFloat(e.target.value))}
                    className="accent-sandal-600 cursor-pointer mt-1"
                  />
                  <span className="text-[10px] text-stone-500 font-medium">
                    Filters car, truck, and bus classifications for Checkpoint Alpha ANPR gate.
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 p-3.5 rounded-lg bg-[#faf8f5] border border-sandal-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-900 uppercase">LOITERING STATIONARY DWELL TIMER</span>
                    <span className="text-amber-800 font-bold">{loiterThresholdSec} SECONDS</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="180"
                    step="5"
                    value={loiterThresholdSec}
                    onChange={(e) => setLoiterThresholdSec(parseInt(e.target.value))}
                    className="accent-amber-600 cursor-pointer mt-1"
                  />
                  <span className="text-[10px] text-stone-500 font-medium">
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
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-lg bg-[#faf8f5] border border-sandal-200">
                    <div>
                      <div className="font-bold text-stone-900 text-xs">{m.name}</div>
                      <div className="text-[10px] text-stone-500 font-semibold">PRECISION: {m.precision} // RUNTIME: {m.latency}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'NOTIFICATIONS' && (
              <div className="flex flex-col gap-3">
                <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-sandal-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-900">TACTICAL AUDIO CHIRP</div>
                    <div className="text-[10px] text-stone-500">Synthesize alert frequency chime upon CRITICAL perimeter breach</div>
                  </div>
                  <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">ENABLED</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-sandal-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-900">REDIS STREAM EVENT BUS</div>
                    <div className="text-[10px] text-stone-500">Local sub-millisecond pub/sub broadcast on 127.0.0.1:6379</div>
                  </div>
                  <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">CONNECTED</span>
                </div>
              </div>
            )}

            {activeTab === 'SYSTEM' && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-stone-600 font-bold uppercase">EDGE NODE AUDIT LOG</span>
                <div className="p-3.5 rounded-lg bg-[#1c1917] border border-stone-800 text-[11px] text-stone-300 flex flex-col gap-1.5 font-mono shadow-md">
                  <div><span className="text-sandal-400">[14:32:48]</span> HEARTBEAT: BOP-17 edge node healthy. GPU load: 68%. VRAM: 3.8 / 8.0 GB.</div>
                  <div><span className="text-sandal-400">[14:30:45]</span> INFERENCE: CAM-01 tripwire breach detected for PERSON-042. Alert published.</div>
                  <div><span className="text-sandal-400">[14:28:12]</span> ANPR: Checkpoint Alpha processed TN01AB1234. Confidence 88.4%.</div>
                  <div><span className="text-sandal-400">[14:20:00]</span> TIME_SYNC: Edge hardware RTC calibrated to IST (NTP local).</div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
