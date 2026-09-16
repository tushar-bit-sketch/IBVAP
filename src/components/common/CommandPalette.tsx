"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulation } from '@/context/SimulationContext';
import { 
  Search, 
  Video, 
  AlertTriangle, 
  Car, 
  User, 
  Shield, 
  MapPin, 
  FileText, 
  Zap, 
  WifiOff, 
  Play, 
  CornerDownLeft,
  X
} from 'lucide-react';

export function CommandPalette() {
  const router = useRouter();
  const { 
    commandPaletteOpen, 
    setCommandPaletteOpen,
    cameras,
    alerts,
    tracks,
    plates,
    bopNodes,
    evidence,
    setSelectedCameraId,
    setSelectedAlert,
    setIsAlertDrawerOpen,
    startJuryDemo,
    triggerSimulatedAlert,
    setNetworkMode,
    networkMode,
    playTacticalSound
  } = useSimulation();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  // Aggregate search items
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return [
        {
          id: 'action-jury-demo',
          category: 'QUICK ACTIONS',
          title: 'Start 12-Step Automated Jury Demo',
          subtitle: 'Runs complete perimeter breach, threat scoring, and resolution scenario',
          icon: Zap,
          action: () => {
            startJuryDemo();
            setCommandPaletteOpen(false);
          }
        },
        {
          id: 'action-sim-breach',
          category: 'QUICK ACTIONS',
          title: 'Simulate Real-Time Tripwire Breach',
          subtitle: 'Triggers instant CRITICAL alert on CAM-01',
          icon: AlertTriangle,
          action: () => {
            triggerSimulatedAlert();
            setCommandPaletteOpen(false);
          }
        },
        {
          id: 'action-offline-mode',
          category: 'QUICK ACTIONS',
          title: networkMode === 'OFFLINE' ? 'Restore Network to ONLINE' : 'Simulate OFFLINE Edge Mode',
          subtitle: networkMode === 'OFFLINE' ? 'Begin background sync of queued incidents' : 'Sever command uplink; activate local edge queuing',
          icon: WifiOff,
          action: () => {
            setNetworkMode(networkMode === 'OFFLINE' ? 'ONLINE' : 'OFFLINE');
            setCommandPaletteOpen(false);
          }
        },
        {
          id: 'nav-incidents',
          category: 'NAVIGATION',
          title: 'Incident Lifecycle Triage Board',
          subtitle: 'View New, Acknowledged, Investigating, and Resolved incidents',
          icon: AlertTriangle,
          action: () => {
            router.push('/incidents');
            setCommandPaletteOpen(false);
          }
        },
        {
          id: 'nav-edge-nodes',
          category: 'NAVIGATION',
          title: 'Edge Node Telemetry & Sync Queue',
          subtitle: 'Inspect BOP-17 hardware GPU/CPU metrics and pending sync',
          icon: Shield,
          action: () => {
            router.push('/edge-nodes');
            setCommandPaletteOpen(false);
          }
        },
        {
          id: 'nav-system',
          category: 'NAVIGATION',
          title: 'System Diagnostics & Health',
          subtitle: 'Observe API latency, WebSocket ping, and pipeline diagnostics',
          icon: Zap,
          action: () => {
            router.push('/system');
            setCommandPaletteOpen(false);
          }
        }
      ];
    }

    const items: Array<{
      id: string;
      category: string;
      title: string;
      subtitle: string;
      icon: any;
      action: () => void;
    }> = [];

    // Cameras
    cameras.forEach(c => {
      if (c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q)) {
        items.push({
          id: `cam-${c.id}`,
          category: 'CAMERAS',
          title: `${c.id} — ${c.name}`,
          subtitle: `${c.sector} • ${c.feedType} • ${c.fps} FPS`,
          icon: Video,
          action: () => {
            setSelectedCameraId(c.id);
            router.push(`/cameras/${c.id}`);
            setCommandPaletteOpen(false);
          }
        });
      }
    });

    // Alerts
    alerts.forEach(a => {
      if (a.id.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.objectId.toLowerCase().includes(q)) {
        items.push({
          id: `alert-${a.id}`,
          category: 'ALERTS',
          title: `${a.id} [${a.severity}] — ${a.type}`,
          subtitle: `${a.cameraName} • ${a.objectId} • Threat Score ${a.threatBreakdown.score}/100`,
          icon: AlertTriangle,
          action: () => {
            setSelectedAlert(a);
            setIsAlertDrawerOpen(true);
            router.push('/alerts');
            setCommandPaletteOpen(false);
          }
        });
      }
    });

    // Tracked Objects
    tracks.forEach(t => {
      if (t.trackingId.toLowerCase().includes(q) || t.class.toLowerCase().includes(q)) {
        items.push({
          id: `track-${t.trackingId}`,
          category: 'TRACKED OBJECTS',
          title: `${t.trackingId} (${t.class.toUpperCase()})`,
          subtitle: `Current: ${t.currentCameraId} • Speed: ${t.speedKmh} km/h • Threat: ${t.threatScore}/100`,
          icon: User,
          action: () => {
            router.push('/tracking');
            setCommandPaletteOpen(false);
          }
        });
      }
    });

    // Plates
    plates.forEach(p => {
      if (p.plateNumber.toLowerCase().includes(q) || p.vehicleType.toLowerCase().includes(q)) {
        items.push({
          id: `plate-${p.id}`,
          category: 'ANPR PLATES',
          title: `${p.plateNumber} [${p.status}]`,
          subtitle: `${p.vehicleType} • Confidence: ${Math.round(p.confidence * 100)}% • ${p.cameraId}`,
          icon: Car,
          action: () => {
            router.push('/anpr');
            setCommandPaletteOpen(false);
          }
        });
      }
    });

    // Evidence
    evidence.forEach(e => {
      if (e.id.toLowerCase().includes(q) || e.objectId.toLowerCase().includes(q) || e.cryptographicHash.includes(q)) {
        items.push({
          id: `evidence-${e.id}`,
          category: 'FORENSIC EVIDENCE',
          title: `${e.id} — ${e.alertType}`,
          subtitle: `Hash: ${e.cryptographicHash.slice(0, 16)}... • ${e.cameraName}`,
          icon: FileText,
          action: () => {
            router.push('/evidence');
            setCommandPaletteOpen(false);
          }
        });
      }
    });

    // BOP Nodes
    bopNodes.forEach(b => {
      if (b.code.toLowerCase().includes(q) || b.name.toLowerCase().includes(q) || b.sector.toLowerCase().includes(q)) {
        items.push({
          id: `bop-${b.code}`,
          category: 'BOP OUTPOSTS',
          title: `${b.code} — ${b.name}`,
          subtitle: `${b.sector} • ${b.cameraCount} Cams • ${b.threatLevel} Threat`,
          icon: MapPin,
          action: () => {
            router.push('/command-center');
            setCommandPaletteOpen(false);
          }
        });
      }
    });

    return items;
  }, [query, cameras, alerts, tracks, plates, evidence, bopNodes, networkMode, router, setSelectedCameraId, setSelectedAlert, setIsAlertDrawerOpen, startJuryDemo, triggerSimulatedAlert, setNetworkMode, setCommandPaletteOpen]);

  // Handle Arrow navigation & Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        playTacticalSound('click');
        results[selectedIndex].action();
      }
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div 
        className="w-full max-w-2xl bg-obsidian-200 border border-neutral-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-800 bg-obsidian-100">
          <Search className="w-5 h-5 text-tactical-cyan shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search cameras, alerts, tracks, plates, zones, BOPs, or type an action..."
            className="w-full bg-transparent text-white font-mono text-sm placeholder:text-neutral-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono text-[10px] text-neutral-400">
            ESC
          </kbd>
          <button 
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-neutral-800/40">
          {results.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 font-mono text-xs">
              NO ENTITIES OR ACTIONS MATCHING &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    playTacticalSound('click');
                    item.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded cursor-pointer transition-all ${
                    isSelected ? 'bg-neutral-800/90 text-white' : 'text-neutral-300 hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded ${
                      isSelected ? 'bg-tactical-cyan/20 text-tactical-cyan' : 'bg-neutral-800/80 text-neutral-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold truncate text-neutral-100">
                          {item.title}
                        </span>
                        <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 uppercase">
                          {item.category}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-neutral-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <CornerDownLeft className="w-4 h-4 text-neutral-400 shrink-0 ml-2" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info strip */}
        <div className="px-4 py-2 bg-obsidian-300 border-t border-neutral-800/80 flex items-center justify-between font-mono text-[10px] text-neutral-500">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-tactical-cyan">IBVAP SIH26187 GLOBAL PALETTE</span>
        </div>
      </div>
    </div>
  );
}
