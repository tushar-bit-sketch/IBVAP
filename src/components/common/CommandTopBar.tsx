"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useSimulation } from '@/context/SimulationContext';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Bell, 
  Cpu, 
  Clock, 
  Zap, 
  Wifi, 
  WifiOff, 
  Search, 
  ChevronDown, 
  CheckCircle2, 
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { TacticalScenarioModal } from './TacticalScenarioModal';
import { Role, NetworkMode } from '@/types';

export function CommandTopBar() {
  const { 
    metrics, 
    currentTimeStr, 
    soundAlerts, 
    setSoundAlerts, 
    triggerSimulatedAlert,
    setScenarioModalOpen,
    setCommandPaletteOpen,
    playTacticalSound,
    alerts,
    networkMode,
    setNetworkMode,
    pendingSyncCount,
    isSyncing,
    currentRole,
    currentUser,
    switchRole,
    juryDemoActive,
    juryDemoStep,
    juryDemoCurrent,
    startJuryDemo,
    stopJuryDemo,
    nextJuryStep,
    resetToNominal
  } = useSimulation();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [networkMenuOpen, setNetworkMenuOpen] = useState(false);

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  const rolesList: Role[] = ['COMMANDER', 'OPERATOR', 'ANALYST', 'AUDITOR', 'SUPER_ADMIN'];

  return (
    <>
      <header className="h-14 border-b border-neutral-800/80 bg-obsidian-200/95 backdrop-blur px-4 flex items-center justify-between select-none z-30 shrink-0">
        {/* Left: Product & Outpost telemetry */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white text-xs font-mono font-bold group-hover:border-neutral-500 transition-colors">
              IB
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs tracking-tactical font-bold text-neutral-100 hidden sm:inline">
                IBVAP
              </span>
              <span className="font-mono text-[8px] text-neutral-500 hidden md:inline leading-none">
                SIH26187
              </span>
            </div>
          </Link>

          <div className="h-4 w-[1px] bg-neutral-800" />

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-sm bg-neutral-900 border border-neutral-800 font-mono text-[10px] text-neutral-300">
              BOP-17 · Sector North
            </span>
          </div>

          {/* Network State & Edge Sync Indicator */}
          <div className="relative">
            <button
              onClick={() => setNetworkMenuOpen(!networkMenuOpen)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-sm border font-mono text-[10px] tracking-wider transition-colors ${
                networkMode === 'ONLINE'
                  ? 'border-green-900/60 bg-green-950/30 text-emerald-400 hover:bg-green-900/40'
                  : networkMode === 'DEGRADED'
                  ? 'border-amber-900/60 bg-amber-950/30 text-amber-400 hover:bg-amber-900/40'
                  : 'border-red-900/80 bg-red-950/50 text-red-400 hover:bg-red-900/60'
              }`}
            >
              {networkMode === 'OFFLINE' ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
              <span>{networkMode}</span>
              {pendingSyncCount > 0 && (
                <span className="px-1 rounded bg-neutral-900 border border-neutral-700 text-[9px] text-neutral-300">
                  {isSyncing ? 'Syncing...' : `${pendingSyncCount} queued`}
                </span>
              )}
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>

            {networkMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-obsidian-200 border border-neutral-700 rounded shadow-xl py-1 z-50 font-mono text-xs">
                <div className="px-3 py-1 text-[9px] text-neutral-500 uppercase border-b border-neutral-800">
                  Select edge uplink mode
                </div>
                {(['ONLINE', 'DEGRADED', 'OFFLINE'] as NetworkMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => {
                      setNetworkMode(mode);
                      setNetworkMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-neutral-800 text-[11px] ${
                      networkMode === mode ? 'text-white font-bold bg-neutral-800/60' : 'text-neutral-400'
                    }`}
                  >
                    <span>{mode}</span>
                    {networkMode === mode && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Command Palette Trigger & Jury Demo / Scenarios */}
        <div className="flex items-center gap-2.5">
          {/* Quick Command Palette Button */}
          <button
            onClick={() => {
              playTacticalSound('click');
              setCommandPaletteOpen(true);
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-neutral-900/90 border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white transition-all font-mono text-xs"
            title="Global search and quick actions (Ctrl+K or /)"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden md:inline text-[11px]">Search system...</span>
            <kbd className="px-1.5 py-0.2 rounded bg-neutral-800 border border-neutral-700 text-[9px] text-neutral-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Dedicated START JURY DEMO Action */}
          {juryDemoActive ? (
            <div className="flex items-center gap-1.5 bg-red-950/70 border border-red-700 px-2.5 py-1 rounded shadow-lg">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-mono text-[10px] font-bold text-red-300">
                Jury demo ({juryDemoStep}/12)
              </span>
              <button
                onClick={nextJuryStep}
                className="ml-1 px-1.5 py-0.5 rounded bg-red-900 text-white font-mono text-[9px] hover:bg-red-800"
              >
                Next
              </button>
              <button
                onClick={stopJuryDemo}
                className="px-1 py-0.5 text-neutral-400 hover:text-white font-mono text-[9px]"
              >
                Stop
              </button>
            </div>
          ) : (
            <button
              onClick={startJuryDemo}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-neutral-800 border border-neutral-700 text-neutral-200 hover:bg-neutral-700 hover:text-white transition-all font-mono text-[10px] font-medium tracking-wider shadow-sm"
              title="Execute 12-Step Automated Presentation Sequence"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Jury demo</span>
            </button>
          )}

          {/* Operational Scenarios Selector */}
          <button
            onClick={() => {
              playTacticalSound('click');
              setScenarioModalOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-sm bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all font-mono text-[10px]"
            title="Open 14 Coordinated Operational Scenarios"
          >
            <span>Scenarios</span>
          </button>
        </div>

        {/* Right: RBAC Role, Audio, Breach Simulator & Live Clock */}
        <div className="flex items-center gap-2.5">
          {/* Active Role Selector (RBAC) */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700 transition-colors font-mono text-[10px]"
            >
              <UserCheck className="w-3 h-3 text-neutral-400" />
              <span className="font-semibold text-white">{currentRole}</span>
              <ChevronDown className="w-2.5 h-2.5 text-neutral-500" />
            </button>

            {roleMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-52 bg-obsidian-200 border border-neutral-700 rounded shadow-xl py-1 z-50 font-mono text-xs">
                <div className="px-3 py-1 text-[9px] text-neutral-500 uppercase border-b border-neutral-800">
                  Switch Operator Role (RBAC)
                </div>
                {rolesList.map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      switchRole(role);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-neutral-800 text-[11px] ${
                      currentRole === role ? 'text-white font-bold bg-neutral-800/60' : 'text-neutral-400'
                    }`}
                  >
                    <span>{role}</span>
                    {currentRole === role && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Breach Simulator Button */}
          <button
            onClick={triggerSimulatedAlert}
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-sm bg-red-950/40 border border-red-900/60 text-red-300 hover:bg-red-900/40 hover:text-white transition-all font-mono text-[10px] tracking-wider"
            title="Simulate Real-time Critical Perimeter Breach"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden xl:inline">Breach [sim]</span>
          </button>

          {/* Reset System to Nominal */}
          <button
            onClick={resetToNominal}
            className="p-1.5 rounded border border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
            title="Reset All Alarms & System to Nominal State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Audio Alert Toggle */}
          <button
            onClick={() => setSoundAlerts(!soundAlerts)}
            className={`p-1.5 rounded border transition-colors ${
              soundAlerts 
                ? 'border-neutral-700 bg-neutral-800 text-neutral-200' 
                : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
            }`}
            title={soundAlerts ? 'Audio alerts active' : 'Audio muted'}
          >
            {soundAlerts ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Live Clock Strip */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 border border-neutral-800">
            <Clock className="w-3 h-3 text-neutral-400" />
            <span className="font-mono text-xs font-medium text-neutral-200 tracking-wider">
              {currentTimeStr}
            </span>
          </div>
        </div>
      </header>

      {/* Active Jury Demo Progress Banner */}
      {juryDemoActive && juryDemoCurrent && (
        <div className="bg-red-950/90 border-b border-red-900 px-4 py-2 flex items-center justify-between text-xs font-mono text-neutral-200 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-red-900 text-white font-semibold text-[10px]">
              Stage {juryDemoCurrent.stepIndex}/12
            </span>
            <span className="font-semibold text-white tracking-wider">
              {juryDemoCurrent.title}
            </span>
            <span className="text-neutral-400 hidden sm:inline">
              — {juryDemoCurrent.description}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-400">
              Focus: <strong className="text-white">{juryDemoCurrent.cameraFocus}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Scenarios Modal */}
      <TacticalScenarioModal />
    </>
  );
}
