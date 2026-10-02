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
  Pause,
  X,
  ExternalLink,
  CheckCheck,
  AlertTriangle
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
    latestNotification,
    clearLatestNotification,
    suppressScreenPopups,
    setSuppressScreenPopups,
    dismissAndSuppressPopups,
    numberPopActive,
    selectAlertAndSeek,
    acknowledgeAlert
  } = useSimulation();

  const activeModel = aiModels.find(m => m.id === activeModelId) || aiModels[0];

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [networkMenuOpen, setNetworkMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

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

          {/* Notification Bell with Badge, Dynamic "+1" Number Pop & Dropdown Popover */}
          <div className="relative">
            <button
              onClick={() => {
                playTacticalSound('click');
                setNotificationMenuOpen(!notificationMenuOpen);
              }}
              className={`p-1.5 rounded border transition-all duration-200 shadow-2xs relative ${
                notificationMenuOpen || unacknowledgedCount > 0
                  ? 'border-sandal-400 bg-sandal-100 text-stone-900 font-bold'
                  : 'border-sandal-200 text-stone-600 hover:text-stone-900 hover:bg-sandal-50'
              }`}
              title={`Alert Notifications (${unacknowledgedCount} unacknowledged)`}
            >
              <Bell className={`w-3.5 h-3.5 transition-transform duration-300 ${numberPopActive ? 'scale-125 text-red-600' : ''}`} />
              {unacknowledgedCount > 0 && (
                <span className={`absolute -top-1 -right-1 px-1 min-w-[15px] h-[15px] rounded-full bg-red-600 text-white text-[8px] font-mono font-bold flex items-center justify-center transition-all duration-300 shadow-xs ${
                  numberPopActive ? 'scale-125 ring-2 ring-red-400 bg-red-700 animate-pulse' : ''
                }`}>
                  {unacknowledgedCount > 99 ? '99+' : unacknowledgedCount}
                </span>
              )}
            </button>

            {/* Dynamic "+1" Number Pop-up directly on Notification Bell Icon */}
            {numberPopActive && (
              <div className="absolute -top-3.5 -right-2 pointer-events-none z-50 animate-in zoom-in-75 fade-in slide-in-from-bottom-2 duration-300">
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-mono font-black shadow-md border border-white flex items-center gap-0.5 tracking-tight animate-bounce">
                  +1
                </span>
              </div>
            )}

            {/* Notification Popover Dropdown */}
            {notificationMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-80 md:w-96 bg-white border border-sandal-200 rounded shadow-xl py-2 z-50 font-mono text-xs animate-in fade-in duration-150">
                <div className="px-3 pb-2 border-b border-sandal-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-stone-700" />
                    <span className="font-bold text-stone-900 text-xs">
                      Alert Notifications
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-800 text-[9px] font-bold">
                      {unacknowledgedCount} pending
                    </span>
                  </div>
                  {unacknowledgedCount > 0 && (
                    <button
                      onClick={() => {
                        alerts.filter(a => !a.acknowledged).forEach(a => acknowledgeAlert(a.id));
                        playTacticalSound('ack');
                      }}
                      className="text-[9px] text-stone-500 hover:text-stone-950 flex items-center gap-1 font-semibold"
                    >
                      <CheckCheck className="w-3 h-3 text-emerald-600" />
                      <span>Ack all</span>
                    </button>
                  )}
                </div>

                {/* Screen Popups Suppression Status & Quick Toggle */}
                <div className="px-3 py-1.5 bg-sandal-50/90 border-b border-sandal-100 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${suppressScreenPopups ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <span className="text-stone-600 text-[10px]">
                      Screen Pop-ups: <strong className="text-stone-900">{suppressScreenPopups ? 'Silenced (Numbers Only)' : 'Active (Toasts On)'}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSuppressScreenPopups(!suppressScreenPopups);
                      playTacticalSound('click');
                    }}
                    className="text-[9px] font-bold text-stone-700 hover:text-stone-950 underline transition-colors"
                  >
                    {suppressScreenPopups ? 'Enable Toasts' : 'Mute Toasts'}
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-sandal-100">
                  {alerts.slice(0, 6).map(alert => (
                    <div
                      key={alert.id}
                      className={`p-2.5 hover:bg-sandal-50/70 transition-colors flex flex-col gap-1 ${
                        !alert.acknowledged ? 'bg-sandal-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            !alert.acknowledged ? 'bg-red-600' : 'bg-stone-300'
                          }`} />
                          <span className="font-bold text-stone-900">{alert.cameraId}</span>
                          <span className={`px-1 py-0.2 rounded text-[8px] font-bold ${
                            alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {alert.severity}
                          </span>
                        </div>
                        <span className="text-[9px] text-stone-500">{alert.timestamp}</span>
                      </div>

                      <p className="text-[10px] text-stone-700 line-clamp-1 font-medium">
                        {alert.description}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[9px] text-stone-500">{alert.zoneName || 'PERIMETER BUFFER'}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              selectAlertAndSeek(alert);
                              setNotificationMenuOpen(false);
                            }}
                            className="text-[9px] text-stone-900 font-bold hover:underline flex items-center gap-0.5"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                          {!alert.acknowledged && (
                            <button
                              onClick={() => {
                                acknowledgeAlert(alert.id);
                                playTacticalSound('ack');
                              }}
                              className="text-[9px] text-emerald-700 hover:text-emerald-900 font-bold"
                            >
                              Ack
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <div className="p-4 text-center text-stone-400 text-xs">
                      No alert notifications in current queue.
                    </div>
                  )}
                </div>

                <div className="px-3 pt-2 border-t border-sandal-100 flex items-center justify-between">
                  <Link
                    href="/alerts"
                    onClick={() => setNotificationMenuOpen(false)}
                    className="text-[10px] text-stone-700 hover:text-stone-950 font-bold flex items-center gap-1"
                  >
                    <span>View all {alerts.length} alerts</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
                  <button
                    onClick={() => setNotificationMenuOpen(false)}
                    className="text-[9px] text-stone-500 hover:text-stone-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

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

      {/* Floating Tactical Pop-up Notification on the Notification Icon (Hidden when user has dismissed / silenced popups) */}
      {!suppressScreenPopups && latestNotification && (
        <div className="fixed top-16 right-4 z-50 w-80 md:w-96 bg-white/95 backdrop-blur-md border border-sandal-300 rounded shadow-xl p-3 font-mono text-xs flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-sandal-200 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                latestNotification.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-300' :
                latestNotification.severity === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                'bg-blue-100 text-blue-800 border border-blue-300'
              }`}>
                {latestNotification.severity} EVENT
              </span>
              <span className="text-[10px] text-stone-700 font-bold">{latestNotification.cameraId}</span>
            </div>
            <button
              onClick={dismissAndSuppressPopups}
              className="text-stone-400 hover:text-stone-900 p-0.5 rounded transition-colors flex items-center gap-1 text-[9px] hover:bg-sandal-100 px-1"
              title="Dismiss & switch to notification numbers on icon only"
            >
              <span className="text-[8px] font-bold uppercase hidden sm:inline">Dismiss</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-950 text-[11px] uppercase tracking-wide">
                {latestNotification.type.replace('_', ' ')}
              </span>
              <span className="text-[9px] text-stone-500">{latestNotification.timestamp}</span>
            </div>
            <p className="text-[10px] text-stone-600 leading-snug line-clamp-2">
              {latestNotification.description}
            </p>
            {latestNotification.threatBreakdown && (
              <div className="flex items-center justify-between text-[9px] text-stone-500 mt-0.5 pt-1 border-t border-sandal-100">
                <span>Threat Score: <strong className="text-red-700">{latestNotification.threatBreakdown.score}/100</strong></span>
                <span>{latestNotification.zoneName || 'STERILE PERIMETER'}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-sandal-200">
            <button
              onClick={() => {
                selectAlertAndSeek(latestNotification);
                clearLatestNotification();
              }}
              className="flex-1 py-1 px-2 rounded bg-stone-900 hover:bg-stone-800 text-white font-bold text-[10px] text-center transition-colors flex items-center justify-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Inspect Event</span>
            </button>
            <button
              onClick={() => {
                acknowledgeAlert(latestNotification.id);
                clearLatestNotification();
              }}
              className="py-1 px-2.5 rounded bg-sandal-100 hover:bg-sandal-200 text-stone-800 font-medium text-[10px] text-center border border-sandal-300 transition-colors"
            >
              Acknowledge
            </button>
            <button
              onClick={dismissAndSuppressPopups}
              className="py-1 px-2 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[9px] text-center border border-stone-300 transition-colors"
              title="Dismiss and show numbers only on notification icon"
            >
              Dismiss (Numbers Only)
            </button>
          </div>
        </div>
      )}

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
