"use client";

import React, { useState } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { OPERATIONAL_SCENARIOS } from '@/data/mockData';
import { ScenarioId } from '@/types';
import { 
  X, 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  Gauge, 
  ShieldAlert, 
  Car, 
  UserCheck, 
  Eye, 
  WifiOff, 
  SlidersHorizontal 
} from 'lucide-react';

export function TacticalScenarioModal() {
  const { 
    scenarioModalOpen, 
    setScenarioModalOpen, 
    runScenario, 
    playTacticalSound, 
    resetToNominal,
    currentScenario,
    playbackSpeed,
    setPlaybackSpeed
  } = useSimulation();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  if (!scenarioModalOpen) return null;

  const categories = ['ALL', 'PERIMETER', 'WATCHLIST', 'ANOMALY', 'SYSTEM_FAIL'];

  const filteredScenarios = activeCategory === 'ALL'
    ? OPERATIONAL_SCENARIOS
    : OPERATIONAL_SCENARIOS.filter(s => s.category === activeCategory);

  const handleRun = (id: ScenarioId) => {
    runScenario(id);
    setScenarioModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 font-mono select-none animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white border border-sandal-300 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-[#faf8f5] border-b border-sandal-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sandal-100 border border-sandal-200 text-sandal-800">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold block">
                SIH26187 COHERENT SCENARIO ENGINE // 14 TACTICAL PRESETS
              </span>
              <h2 className="text-sm font-bold text-stone-950 tracking-wider">
                OPERATIONAL SCENARIO SIMULATOR
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed Control Strip */}
            <div className="flex items-center gap-1 bg-white border border-sandal-300 rounded-lg px-2.5 py-1 text-xs shadow-2xs">
              <Gauge className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-[10px] text-stone-500 font-semibold">SPEED:</span>
              {[0.5, 1, 2, 4].map(s => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    playbackSpeed === s ? 'bg-sandal-500 text-white' : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                playTacticalSound('click');
                setScenarioModalOpen(false);
              }}
              className="p-1 rounded-md text-stone-400 hover:text-stone-900 hover:bg-sandal-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters Strip */}
        <div className="px-4 py-2 bg-sandal-50/60 border-b border-sandal-200 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[10px] tracking-wider transition-colors ${
                  activeCategory === cat
                    ? 'bg-stone-900 text-white border border-stone-900 font-bold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              resetToNominal();
              setScenarioModalOpen(false);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-sandal-300 text-stone-700 hover:text-stone-950 hover:border-sandal-400 text-[10px] font-semibold shadow-2xs"
            title="Restore baseline nominal operations"
          >
            <RotateCcw className="w-3 h-3 text-sandal-600" />
            <span>RESET NOMINAL</span>
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="p-4 flex flex-col gap-2.5 overflow-y-auto divide-y divide-sandal-100">
          {filteredScenarios.map((scen) => {
            const isCurrent = currentScenario === scen.id;

            return (
              <div
                key={scen.id}
                onClick={() => handleRun(scen.id)}
                className={`p-3.5 rounded-lg transition-all cursor-pointer flex flex-col gap-1.5 group ${
                  isCurrent 
                    ? 'bg-red-50 border border-red-200 shadow-2xs' 
                    : 'bg-white border border-sandal-200 hover:border-sandal-400 hover:bg-sandal-50/50 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                      scen.category === 'PERIMETER' ? 'bg-red-50 text-red-700 border-red-200' :
                      scen.category === 'WATCHLIST' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      scen.category === 'SYSTEM_FAIL' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                      'bg-sky-50 text-sky-800 border-sky-200'
                    }`}>
                      {scen.category}
                    </span>
                    <span className="font-bold text-stone-900 text-xs group-hover:text-sandal-800 transition-colors">
                      {scen.name}
                    </span>
                  </div>

                  <span className="text-[10px] text-stone-500 group-hover:text-stone-900 flex items-center gap-1 font-bold">
                    <span>EXECUTE</span>
                    <span>→</span>
                  </span>
                </div>

                <p className="text-[11px] text-stone-600 font-sans leading-relaxed">
                  {scen.description}
                </p>

                <div className="flex items-center gap-4 pt-1 text-[10px] text-stone-500 font-medium">
                  <span>TARGET CAM: <strong className="text-stone-800">{scen.targetCameraId}</strong></span>
                  <span>ENTITY: <strong className="text-stone-800">{scen.targetEntityId}</strong></span>
                  <span>ALERTS GENERATED: <strong className="text-stone-800">{scen.initialAlertCount}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#faf8f5] border-t border-sandal-200 flex items-center justify-between text-[10px] text-stone-500 font-semibold">
          <span>COORDINATED MULTI-SUBSYSTEM EVENT DISPATCH</span>
          <span className="text-sandal-700 font-bold">SIH26187 PROTOCOL VERIFIED</span>
        </div>
      </div>
    </div>
  );
}
