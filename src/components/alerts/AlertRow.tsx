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
        return 'bg-red-50 border-red-200 text-red-700';
      case 'HIGH':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'MEDIUM':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-sandal-50 border-sandal-200 text-stone-700';
    }
  };

  return (
    <div
      onClick={() => onSelect(alert)}
      className={`p-2.5 rounded border transition-all cursor-pointer select-none flex flex-col gap-1.5 group shadow-2xs ${
        isSelected 
          ? 'bg-sandal-100 border-sandal-400 shadow-xs' 
          : 'bg-white border-sandal-200 hover:bg-sandal-50/70 hover:border-sandal-300'
      } ${!alert.acknowledged && alert.severity === 'CRITICAL' ? 'border-red-300 bg-red-50/20' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold border tracking-wider uppercase ${getSeverityBadge()}`}>
            {alert.severity}
          </span>
          <span className="font-mono text-xs font-bold text-stone-900 group-hover:text-stone-950">
            {alert.type.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500">
          <Clock className="w-3 h-3 text-stone-400" />
          <span>{alert.timestamp}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-stone-600">
        <div className="flex items-center gap-1.5">
          <CameraIcon className="w-3 h-3 text-sandal-600" />
          <span className="text-stone-800 font-medium">{alert.cameraId}</span>
          {alert.zoneName && <span className="text-stone-500">/ {alert.zoneName}</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <Crosshair className="w-3 h-3 text-sandal-600" />
          <span className="text-stone-900 font-semibold">{alert.objectId}</span>
          <span className="text-[10px] text-stone-500">({(alert.confidence * 100).toFixed(0)}%)</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-sandal-100 text-[10px] font-mono">
        <span className="text-stone-600 truncate max-w-[210px]">
          {alert.description}
        </span>
        {alert.acknowledged ? (
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>ACK</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-red-700 font-bold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <span>PENDING</span>
          </span>
        )}
      </div>
    </div>
  );
}
