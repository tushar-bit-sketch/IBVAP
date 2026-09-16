"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSimulation } from '@/context/SimulationContext';
import { 
  LayoutGrid, 
  Video, 
  AlertTriangle, 
  Scan, 
  Route, 
  Car, 
  UserCheck, 
  Shield, 
  BarChart3, 
  FolderArchive, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Cpu,
  Activity,
  FileCheck2,
  ScrollText,
  LifeBuoy
} from 'lucide-react';

export function CommandSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { alerts, cameras, pendingSyncCount, networkMode } = useSimulation();

  const activeAlertsCount = alerts.filter(a => !a.acknowledged).length;
  const onlineCamerasCount = cameras.filter(c => c.status === 'ONLINE').length;

  const navLinks = [
    {
      label: 'COMMAND MATRIX',
      href: '/command-center',
      icon: LayoutGrid,
      badge: null,
    },
    {
      label: 'CAMERAS & PTZ',
      href: '/cameras',
      icon: Video,
      badge: `${onlineCamerasCount}/4`,
    },
    {
      label: 'INCIDENT TRIAGE',
      href: '/incidents',
      icon: LifeBuoy,
      badge: 'LIFECYCLE',
      badgeColor: 'bg-neutral-800 text-neutral-300 border border-neutral-700',
    },
    {
      label: 'ALERTS & BREACHES',
      href: '/alerts',
      icon: AlertTriangle,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null,
      badgeColor: 'bg-red-950 text-tactical-red border border-red-900',
    },
    {
      label: 'AI DETECTIONS',
      href: '/detections',
      icon: Scan,
      badge: null,
    },
    {
      label: 'OBJECT TRACKING',
      href: '/tracking',
      icon: Route,
      badge: 'ReID',
    },
    {
      label: 'ANPR / VEHICLES',
      href: '/anpr',
      icon: Car,
      badge: null,
    },
    {
      label: 'FACE INTEL (SIM)',
      href: '/faces',
      icon: UserCheck,
      badge: '512D',
    },
    {
      label: 'VIRTUAL ZONES',
      href: '/zones',
      icon: Shield,
      badge: null,
    },
    {
      label: 'EDGE NODES',
      href: '/edge-nodes',
      icon: Cpu,
      badge: networkMode === 'OFFLINE' ? `${pendingSyncCount} SYNC` : 'ONLINE',
      badgeColor: networkMode === 'OFFLINE' ? 'bg-amber-950 text-tactical-amber border border-amber-900' : 'bg-green-950 text-tactical-green border border-green-900',
    },
    {
      label: 'DIAGNOSTICS',
      href: '/system',
      icon: Activity,
      badge: null,
    },
    {
      label: 'FORENSIC EVIDENCE',
      href: '/evidence',
      icon: FolderArchive,
      badge: 'SHA-256',
    },
    {
      label: 'SECURITY REPORTS',
      href: '/reports',
      icon: FileCheck2,
      badge: null,
    },
    {
      label: 'AUDIT LEDGER',
      href: '/audit',
      icon: ScrollText,
      badge: null,
    },
    {
      label: 'ANALYTICS',
      href: '/analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      label: 'EDGE SETTINGS',
      href: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside 
      className={`border-r border-neutral-800/80 bg-obsidian-300/95 backdrop-blur transition-all duration-200 flex flex-col justify-between select-none z-20 shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Nav List */}
      <div className="flex flex-col py-3 overflow-y-auto max-h-screen">
        <div className="px-3 pb-2 mb-2 border-b border-neutral-800/60 flex items-center justify-between">
          {!collapsed && (
            <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
              TACTICAL SUBSYSTEMS
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors ml-auto"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 px-2">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href === '/command-center' && pathname === '/dashboard');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-2.5 py-1.5 rounded font-mono text-xs transition-all relative group ${
                  isActive
                    ? 'bg-neutral-800/90 text-white font-semibold border-l-2 border-tactical-cyan shadow-inner'
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-tactical-cyan' : 'text-neutral-500 group-hover:text-neutral-300'}`} />

                {!collapsed && (
                  <>
                    <span className="truncate flex-1 tracking-wider text-[11px]">
                      {item.label}
                    </span>

                    {item.badge && (
                      <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-bold ${
                        item.badgeColor || 'bg-neutral-900 border border-neutral-800 text-neutral-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Outpost Telemetry Status */}
      {!collapsed && (
        <div className="p-3 border-t border-neutral-800/60 bg-obsidian-200/50">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1">
            <span>DAEMON STATUS</span>
            <span className="text-tactical-green">OPTIMAL</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1 overflow-hidden">
            <div className="bg-tactical-cyan h-full w-[88%]" />
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 mt-1">
            <span>YOLOv8x / DeepSORT</span>
            <span>28.8 FPS</span>
          </div>
        </div>
      )}
    </aside>
  );
}
