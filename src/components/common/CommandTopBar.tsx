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
  UserCheck,
  Play,
  Pause
} from 'lucide-react';
import { TacticalScenarioModal } from './TacticalScenarioModal';
import { Role, NetworkMode } from '@/types';
import { SpideySenseLogo, Sih2026Logo } from './BrandIdentity';

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
    resetToNominal,
    isAllPaused,
    setIsAllPaused,
    playbackSpeed,
    setPlaybackSpeed,
    activeModelId,
    aiModels,
    inferenceMode
  } = useSimulation();

  const activeModel = aiModels.find(m => m.id === activeModelId) || aiModels[0];

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [networkMenuOpen, setNetworkMenuOpen] = useState(false);

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  const rolesList: Role[] = ['COMMANDER', 'OPERATOR', 'ANALYST', 'AUDITOR', 'SUPER_ADMIN'];

  return (
    <>
      <header className="h-14 border-b border-sandal-200 bg-white/95 backdrop-blur px-4 flex items-center justify-between select-none z-30 shrink-0">
        {/* Left: Product, Team & Outpost telemetry */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-0.5 rounded bg-white border border-sandal-200 shadow-2xs group-hover:border-sandal-400 transition-colors">
              <SpideySenseLogo size="sm" className="h-7 w-7" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-mono text-xs tracking-tactical font-bold text-stone-950">
                  IBVAP
                </span>
                <span className="font-mono text-[8px] text-sandal-800 font-bold px-1 py-0.2 rounded bg-sandal-100 border border-sandal-200/80">
                  SIH26187
                </span>
              </div>
              <span className="font-mono text-[8px] text-stone-500 hidden md:inline leading-none mt-0.5">
                SPIDEY SENSE
              </span>
            </div>
          </Link>

          <div className="h-4 w-[1px] bg-sandal-200 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2">
            <div className="p-0.5 rounded bg-white border border-sandal-200/80 shadow-2xs" title="Smart India Hackathon 2026">
              <Sih2026Logo size="xs" className="h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-sm bg-sandal-50 border border-sandal-200 font-mono text-[10px] text-stone-700 font-medium">
              BOP-17 · Sector North
            </span>
          </div>

          {/* Network State & Edge Sync Indicator */}
          <div className="relative">
            <button
              onClick={() => setNetworkMenuOpen(!networkMenuOpen)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-sm border font-mono text-[10px] tracking-wider transition-colors ${
                networkMode === 'ONLINE'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : networkMode === 'DEGRADED'
                  ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                  : 'border-red-200 bg-red-50 text-red-800 hover:bg-red-100'
              }`}
            >
              {networkMode === 'OFFLINE' ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
              <span>{networkMode}</span>
              {pendingSyncCount > 0 && (
                <span className="px-1 rounded bg-white border border-sandal-200 text-[9px] text-stone-700">
                  {isSyncing ? 'Syncing...' : `${pendingSyncCount} queued`}
                </span>
              )}
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>

            {networkMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-sandal-200 rounded shadow-xl py-1 z-50 font-mono text-xs">
                <div className="px-3 py-1 text-[9px] text-stone-500 uppercase border-b border-sandal-100 font-semibold">
                  Select edge uplink mode
                </div>
                {(['ONLINE', 'DEGRADED', 'OFFLINE'] as NetworkMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => {
                      setNetworkMode(mode);
                      setNetworkMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-sandal-50 text-[11px] ${
                      networkMode === mode ? 'text-stone-950 font-bold bg-sandal-100/60' : 'text-stone-600'
                    }`}
                  >
                    <span>{mode}</span>
                    {networkMode === mode && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Core Model & Precision Pill */}
          <Link
            href="/models"
            className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-sandal-200 bg-white hover:bg-sandal-50 text-stone-900 font-mono text-[10px] tracking-wider transition-colors shadow-2xs group"
            title="Open AI Model Training & Optimization Studio"
          >
            <Cpu className="w-3 h-3 text-sandal-700 group-hover:text-stone-950 transition-colors" />
            <span className="font-bold">{activeModel.codeName}</span>
            <span className="px-1 py-0.2 rounded bg-sandal-100 border border-sandal-200 text-[8px] text-emerald-800 font-bold">
              {activeModel.precision}
            </span>
          </Link>
        </div>

        {/* Center: Command Palette Trigger & Jury Demo / Scenarios */}
        <div className="flex items-center gap-2.5">
          {/* Quick Command Palette Button */}
          <button
            onClick={() => {
              playTacticalSound('click');
              setCommandPaletteOpen(true);
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-sandal-50 border border-sandal-200 text-stone-600 hover:border-sandal-400 hover:text-stone-900 transition-all font-mono text-xs shadow-2xs"
            title="Global search and quick actions (Ctrl+K or /)"
          >
            <Search className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden md:inline text-[11px]">Search system...</span>
            <kbd className="px-1.5 py-0.2 rounded bg-white border border-sandal-200 text-[9px] text-stone-600">
              Ctrl+K
            </kbd>
          </button>

          {/* Dedicated START JURY DEMO Action */}
          {juryDemoActive ? (
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2.5 py-1 rounded shadow-xs">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-mono text-[10px] font-bold text-red-800">
                Jury demo ({juryDemoStep}/12)
              </span>
              <button
                onClick={nextJuryStep}
                className="ml-1 px-1.5 py-0.5 rounded bg-red-700 text-white font-mono text-[9px] hover:bg-red-800"
              >
                Next
              </button>
              <button
                onClick={stopJuryDemo}
                className="px-1 py-0.5 text-stone-500 hover:text-stone-900 font-mono text-[9px]"
              >
                Stop
              </button>
            </div>
          ) : (
            <button
              onClick={startJuryDemo}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white border border-sandal-300 text-stone-800 hover:bg-sandal-100/60 hover:text-stone-950 transition-all font-mono text-[10px] font-semibold tracking-wider shadow-xs"
              title="Execute 12-Step Automated Presentation Sequence"
            >
              <Zap className="w-3 h-3 text-sandal-600" />
              <span>Jury demo</span>
            </button>
          )}

          {/* Operational Scenarios Selector */}
          <button
            onClick={() => {
              playTacticalSound('click');
              setScenarioModalOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-sm bg-white border border-sandal-200 text-stone-700 hover:bg-sandal-100/60 hover:text-stone-950 transition-all font-mono text-[10px] shadow-2xs"
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
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-white border border-sandal-200 text-stone-800 hover:border-sandal-400 transition-colors font-mono text-[10px] shadow-2xs"
            >
              <UserCheck className="w-3 h-3 text-sandal-600" />
              <span className="font-semibold text-stone-900">{currentRole}</span>
              <ChevronDown className="w-2.5 h-2.5 text-stone-500" />
            </button>

            {roleMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-sandal-200 rounded shadow-xl py-1 z-50 font-mono text-xs">
                <div className="px-3 py-1 text-[9px] text-stone-500 uppercase border-b border-sandal-100 font-semibold">
                  Switch Operator Role (RBAC)
                </div>
                {rolesList.map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      switchRole(role);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-sandal-50 text-[11px] ${
                      currentRole === role ? 'text-stone-950 font-bold bg-sandal-100/60' : 'text-stone-600'
                    }`}
                  >
                    <span>{role}</span>
                    {currentRole === role && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Breach Simulator Button */}
          <button
            onClick={triggerSimulatedAlert}
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-sm bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:text-red-900 transition-all font-mono text-[10px] tracking-wider shadow-2xs"
            title="Simulate Real-time Critical Perimeter Breach"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden xl:inline">Breach [sim]</span>
          </button>

          {/* Global Video Engine Play/Pause Toggle */}
          <button
            onClick={() => {
              playTacticalSound('click');
              setIsAllPaused(!isAllPaused);
            }}
            className={`flex items-center gap-1.5 px-2 py-1 rounded border font-mono text-[10px] shadow-2xs transition-colors ${
              isAllPaused 
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold' 
                : 'bg-white border-sandal-200 text-stone-800 hover:bg-sandal-50'
            }`}
            title={isAllPaused ? 'Resume video simulation playback' : 'Pause video simulation playback'}
          >
            {isAllPaused ? <Play className="w-3 h-3 text-amber-700" /> : <Pause className="w-3 h-3 text-stone-600" />}
            <span className="hidden xl:inline">{isAllPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>

          {/* Playback Speed Multiplier */}
          <div className="hidden lg:flex items-center bg-white border border-sandal-200 rounded p-0.5 font-mono text-[9px] shadow-2xs">
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  playTacticalSound('click');
                  setPlaybackSpeed(spd);
                }}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  playbackSpeed === spd ? 'bg-stone-900 text-white font-bold' : 'text-stone-500 hover:text-stone-900'
                }`}
                title={`Set playback speed to ${spd}x`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Reset System to Nominal */}
          <button
            onClick={resetToNominal}
            className="p-1.5 rounded border border-sandal-200 text-stone-600 hover:text-stone-900 hover:bg-sandal-100 transition-colors shadow-2xs"
            title="Reset All Alarms & System to Nominal State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Audio Alert Toggle */}
          <button
            onClick={() => setSoundAlerts(!soundAlerts)}
            className={`p-1.5 rounded border transition-colors shadow-2xs ${
              soundAlerts 
                ? 'border-sandal-300 bg-sandal-100 text-stone-900' 
                : 'border-sandal-200 text-stone-500 hover:text-stone-800'
            }`}
            title={soundAlerts ? 'Audio alerts active' : 'Audio muted'}
          >
            {soundAlerts ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Live Clock Strip */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-sandal-50 border border-sandal-200 shadow-2xs">
            <Clock className="w-3 h-3 text-stone-500" />
            <span className="font-mono text-xs font-semibold text-stone-900 tracking-wider">
              {currentTimeStr}
            </span>
          </div>
        </div>
      </header>

      {/* Active Jury Demo Progress Banner */}
      {juryDemoActive && juryDemoCurrent && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center justify-between text-xs font-mono text-stone-800 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-red-700 text-white font-semibold text-[10px]">
              Stage {juryDemoCurrent.stepIndex}/12
            </span>
            <span className="font-semibold text-stone-900 tracking-wider">
              {juryDemoCurrent.title}
            </span>
            <span className="text-stone-600 hidden sm:inline">
              — {juryDemoCurrent.description}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-stone-600">
              Focus: <strong className="text-stone-950">{juryDemoCurrent.cameraFocus}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Scenarios Modal */}
      <TacticalScenarioModal />
    </>
  );
}
