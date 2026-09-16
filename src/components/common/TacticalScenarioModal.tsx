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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono select-none animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-obsidian-200 border border-neutral-700/90 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-obsidian-100 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-neutral-900 border border-neutral-700 text-tactical-cyan">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold block">
                SIH26187 COHERENT SCENARIO ENGINE // 14 TACTICAL PRESETS
              </span>
              <h2 className="text-sm font-bold text-white tracking-wider">
                OPERATIONAL SCENARIO SIMULATOR
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed Control Strip */}
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs">
              <Gauge className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-[10px] text-neutral-400">SPEED:</span>
              {[0.5, 1, 2, 4].map(s => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-1.5 py-0.2 rounded text-[10px] ${
                    playbackSpeed === s ? 'bg-tactical-cyan text-black font-bold' : 'text-neutral-400 hover:text-white'
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
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters Strip */}
        <div className="px-4 py-2 bg-obsidian-300 border-b border-neutral-800 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded text-[10px] tracking-wider transition-colors ${
                  activeCategory === cat
                    ? 'bg-neutral-800 text-white border border-neutral-700 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
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
            className="flex items-center gap-1 px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white text-[10px]"
            title="Restore baseline nominal operations"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET NOMINAL</span>
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="p-4 flex flex-col gap-2.5 overflow-y-auto divide-y divide-neutral-800/40">
          {filteredScenarios.map((scen) => {
            const isCurrent = currentScenario === scen.id;

            return (
              <div
                key={scen.id}
                onClick={() => handleRun(scen.id)}
                className={`p-3 rounded transition-all cursor-pointer flex flex-col gap-1.5 group ${
                  isCurrent 
                    ? 'bg-red-950/30 border border-red-800' 
                    : 'bg-neutral-900/70 border border-neutral-800/80 hover:border-neutral-600 hover:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                      scen.category === 'PERIMETER' ? 'bg-red-950 text-tactical-red border-red-900' :
                      scen.category === 'WATCHLIST' ? 'bg-amber-950 text-tactical-amber border-amber-900' :
                      scen.category === 'SYSTEM_FAIL' ? 'bg-purple-950 text-purple-400 border-purple-900' :
                      'bg-cyan-950 text-tactical-cyan border-cyan-900'
                    }`}>
                      {scen.category}
                    </span>
                    <span className="font-bold text-white text-xs group-hover:text-tactical-cyan transition-colors">
                      {scen.name}
                    </span>
                  </div>

                  <span className="text-[10px] text-neutral-500 group-hover:text-white flex items-center gap-1 font-bold">
                    <span>EXECUTE</span>
                    <span>→</span>
                  </span>
                </div>

                <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                  {scen.description}
                </p>

                <div className="flex items-center gap-4 pt-1 text-[10px] text-neutral-500">
                  <span>TARGET CAM: <strong className="text-neutral-300">{scen.targetCameraId}</strong></span>
                  <span>ENTITY: <strong className="text-neutral-300">{scen.targetEntityId}</strong></span>
                  <span>ALERTS GENERATED: <strong className="text-neutral-300">{scen.initialAlertCount}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-obsidian-100 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500">
          <span>COORDINATED MULTI-SUBSYSTEM EVENT DISPATCH</span>
          <span className="text-tactical-cyan font-bold">SIH26187 PROTOCOL VERIFIED</span>
        </div>
      </div>
    </div>
  );
}
