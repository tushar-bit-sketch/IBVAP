"use client";

import React from 'react';
import { Alert } from '@/types';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Camera as CameraIcon,
  Crosshair
} from 'lucide-react';

interface AlertRowProps {
  alert: Alert;
  isSelected?: boolean;
  onSelect: (alert: Alert) => void;
}

export function AlertRow({ alert, isSelected = false, onSelect }: AlertRowProps) {
  const getSeverityBadge = () => {
    switch (alert.severity) {
      case 'CRITICAL':
        return 'bg-red-950/70 border-red-800 text-tactical-red';
      case 'HIGH':
        return 'bg-amber-950/70 border-amber-800 text-tactical-amber';
      case 'MEDIUM':
        return 'bg-yellow-950/50 border-yellow-800 text-yellow-400';
      default:
        return 'bg-neutral-900 border-neutral-800 text-neutral-400';
    }
  };

  return (
    <div
      onClick={() => onSelect(alert)}
      className={`p-2.5 rounded border transition-all cursor-pointer select-none flex flex-col gap-1.5 group ${
        isSelected 
          ? 'bg-neutral-800/90 border-neutral-600 shadow-md' 
          : 'bg-obsidian-200/80 border-neutral-800/80 hover:bg-neutral-800/40 hover:border-neutral-700'
      } ${!alert.acknowledged && alert.severity === 'CRITICAL' ? 'border-red-900/60' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold border tracking-wider uppercase ${getSeverityBadge()}`}>
            {alert.severity}
          </span>
          <span className="font-mono text-xs font-bold text-neutral-100 group-hover:text-white">
            {alert.type.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400">
          <Clock className="w-3 h-3 text-neutral-500" />
          <span>{alert.timestamp}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-1.5">
          <CameraIcon className="w-3 h-3 text-neutral-500" />
          <span className="text-neutral-300">{alert.cameraId}</span>
          {alert.zoneName && <span className="text-neutral-500">/ {alert.zoneName}</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <Crosshair className="w-3 h-3 text-neutral-500" />
          <span className="text-neutral-300 font-semibold">{alert.objectId}</span>
          <span className="text-[10px] text-neutral-500">({(alert.confidence * 100).toFixed(0)}%)</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-[10px] font-mono">
        <span className="text-neutral-500 truncate max-w-[210px]">
          {alert.description}
        </span>
        {alert.acknowledged ? (
          <span className="flex items-center gap-1 text-neutral-500">
            <CheckCircle2 className="w-3 h-3 text-tactical-green" />
            <span>ACK</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-tactical-red font-bold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-tactical-red" />
            <span>PENDING</span>
          </span>
        )}
      </div>
    </div>
  );
}
