"use client";

import React, { useState } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { LicensePlate } from '@/types';
import { 
  Car, 
  Truck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Maximize2, 
  Filter, 
  Download,
  Clock,
  ScanLine,
  Play,
  RotateCcw,
  ShieldAlert,
  Radio,
  FileCheck
} from 'lucide-react';

export function ANPRInspector() {
  const { plates, playTacticalSound } = useSimulation();
  const [selectedPlate, setSelectedPlate] = useState<LicensePlate>(plates[0]);
  const [filterQuery, setFilterQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const filteredPlates = plates.filter(p => 
    p.plateNumber.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.vehicleType.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const triggerLiveOcrScan = () => {
    playTacticalSound('click');
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      playTacticalSound(selectedPlate.status === 'WATCHLIST' ? 'breach' : 'ack');
    }, 850);
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 0.85) {
      return { label: 'HIGH CONFIDENCE', bg: 'bg-emerald-950/70 text-emerald-400 border-emerald-800' };
    }
    if (score >= 0.70) {
      return { label: 'REVIEW RECOMMENDED', bg: 'bg-amber-950/70 text-amber-400 border-amber-800' };
    }
    return { label: 'MANUAL REVIEW', bg: 'bg-red-950/70 text-red-400 border-red-800' };
  };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-4 font-mono select-none">
      {/* Left List of Captured Vehicle Plates */}
      <div className="w-full xl:w-96 bg-white border border-sandal-200 rounded p-3 flex flex-col gap-3 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-sandal-200">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-sandal-600" />
            <span className="text-xs font-bold text-stone-950 tracking-wider">
              ANPR RECOGNITION LOG
            </span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-sandal-100 text-stone-700 font-bold">
            {plates.length} CAPTURES
          </span>
        </div>

        {/* Search Filter */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search plate or vehicle..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-sandal-50 border border-sandal-200 rounded text-xs text-stone-900 focus:outline-none focus:border-sandal-400 placeholder:text-stone-400"
          />
        </div>

        {/* Plate Cards List */}
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[480px]">
          {filteredPlates.map((plate) => {
            const isSelected = selectedPlate.id === plate.id;
            const isWatchlist = plate.status === 'WATCHLIST';
            return (
              <div
                key={plate.id}
                onClick={() => {
                  playTacticalSound('click');
                  setSelectedPlate(plate);
                }}
                className={`p-2.5 rounded border transition-all cursor-pointer select-none flex flex-col gap-1 ${
                  isSelected 
                    ? 'bg-stone-900 text-white shadow' 
                    : 'bg-sandal-50/70 border-sandal-200 hover:bg-sandal-100/70 text-stone-900'
                } ${isWatchlist && !isSelected ? 'border-red-300' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-xs tracking-wider ${isSelected ? 'text-white' : 'text-stone-950'}`}>
                      {plate.plateNumber}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      isWatchlist 
                        ? 'bg-red-500 text-white' 
                        : isSelected ? 'bg-stone-800 text-stone-300' : 'bg-sandal-200 text-stone-800'
                    }`}>
                      {isWatchlist ? 'FLAGGED' : plate.vehicleType}
                    </span>
                  </div>
                  <span className={`text-[10px] ${isSelected ? 'text-stone-400' : 'text-stone-500'}`}>{plate.timestamp}</span>
                </div>

                <div className={`flex items-center justify-between text-[10px] pt-1 ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                  <span>CAMERA: {plate.cameraId}</span>
                  <span className={plate.ocrConfidence >= 0.85 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                    OCR: {(plate.ocrConfidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right High-Fidelity ANPR Inspection Studio */}
      <div className="flex-1 bg-white border border-sandal-200 rounded p-4 flex flex-col gap-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-sandal-200">
          <div>
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest block">
              AUTOMATIC NUMBER PLATE RECOGNITION (ANPR) // LPRNET-V3 INT8
            </span>
            <h3 className="text-base font-bold text-stone-950 tracking-wider flex items-center gap-2">
              <span>VEHICLE: {selectedPlate.plateNumber}</span>
              {selectedPlate.status === 'WATCHLIST' && (
                <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold animate-pulse">
                  HOTLIST HIT
                </span>
              )}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerLiveOcrScan}
              disabled={isScanning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sandal-100 hover:bg-sandal-200 text-stone-900 text-xs font-bold transition-all border border-sandal-300 active:scale-95 disabled:opacity-50 shadow-2xs"
            >
              <ScanLine className="w-3.5 h-3.5 text-sandal-700" />
              <span>{isScanning ? 'RUNNING OCR ENGINE...' : 'RESIMULATE OCR SCAN'}</span>
            </button>
            <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
              selectedPlate.ocrConfidence >= 0.85 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
              selectedPlate.ocrConfidence >= 0.70 ? 'bg-amber-50 text-amber-800 border-amber-200' :
              'bg-red-50 text-red-700 border-red-200'
            }`}>
              {getConfidenceBadge(selectedPlate.ocrConfidence).label}
            </span>
          </div>
        </div>

        {/* Visual Inspection Split: Full Frame vs Cropped Plate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Vehicle Detection View */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
              PRIMARY CAMERA INGESTION FEED ({selectedPlate.cameraId})
            </span>
            <div className="relative aspect-video rounded overflow-hidden border border-sandal-300 bg-black">
              <img
                src={selectedPlate.cropUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'}
                alt="Vehicle Frame"
                className="w-full h-full object-cover filter contrast-110"
              />
              <div className="absolute inset-0 scanline-layer opacity-40 pointer-events-none" />
              
              {/* Simulated vehicle detection box */}
              <div className="absolute inset-x-8 inset-y-6 border-2 border-sky-400/90 rounded">
                <div className="absolute -top-3 left-2 bg-stone-900 border border-sky-400/70 px-1.5 py-0.5 text-[9px] text-white font-bold">
                  {selectedPlate.vehicleType} CONF: {(selectedPlate.confidence * 100).toFixed(0)}%
                </div>
              </div>

              {/* Sub-plate crop highlight */}
              <div className={`absolute bottom-10 left-1/3 w-32 h-10 border-2 rounded ${
                isScanning ? 'border-amber-400 bg-amber-400/25 animate-pulse' : 'border-emerald-500 bg-emerald-500/20'
              }`} />
            </div>
          </div>

          {/* High-Res Plate Crop & OCR Character Segmentation */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
              AUTOMATED PLATE EXTRACTION &amp; CHARACTER SEGMENTATION
            </span>
            <div className="p-4 rounded bg-sandal-50 border border-sandal-200 flex flex-col items-center justify-center gap-4 flex-1 relative overflow-hidden">
              {/* Laser Scanning Line Animation */}
              {isScanning && (
                <div className="absolute inset-y-0 w-1 bg-sky-500 shadow-[0_0_15px_#0284c7] animate-scanline pointer-events-none" />
              )}

              {/* Indian License Plate Graphic */}
              <div className="px-6 py-3 rounded bg-amber-400 border-2 border-stone-900 text-stone-950 font-mono font-black text-2xl tracking-widest shadow-lg relative flex items-center gap-3">
                <div className="flex flex-col items-center text-[8px] font-bold border-r-2 border-stone-900 pr-2 leading-none text-blue-900">
                  <span>IND</span>
                  <div className="w-2 h-2 rounded-full border border-blue-900 mt-0.5 flex items-center justify-center">
                    <div className="w-0.5 h-0.5 bg-blue-900 rounded-full" />
                  </div>
                </div>
                <span>{selectedPlate.plateNumber}</span>
              </div>

              {/* Character by character OCR Confidence breakdown */}
              <div className="flex items-center gap-1">
                {selectedPlate.plateNumber.split('').map((char, i) => (
                  <div key={i} className="flex flex-col items-center p-1 rounded bg-white border border-sandal-300 text-center min-w-[24px] shadow-2xs">
                    <span className="text-stone-950 font-bold text-xs">{char}</span>
                    <span className="text-[8px] text-emerald-700 font-bold">
                      {Math.floor(92 + (i % 4) * 2)}%
                    </span>
                  </div>
                ))}
              </div>

              {/* VAHAN Registry Metadata */}
              <div className="w-full max-w-sm flex flex-col gap-1.5 pt-2 border-t border-sandal-200">
                <div className="flex justify-between text-[10px] text-stone-600">
                  <span>REGISTRATION REGION:</span>
                  <span className="text-stone-950 font-semibold">
                    {selectedPlate.plateNumber.startsWith('TN') ? 'TAMIL NADU // SECTOR SOUTH' :
                     selectedPlate.plateNumber.startsWith('DL') ? 'DELHI NCR // COMMERCIAL' :
                     selectedPlate.plateNumber.startsWith('JK') ? 'JAMMU & KASHMIR // BORDER' : 'PUNJAB // LOGISTICS'}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-600">
                  <span>OCR ENGINE ACCELERATOR:</span>
                  <span className="text-sandal-700 font-bold">LPRNet-v3 TensorRT INT8 (18.2ms)</span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-600">
                  <span>BARRIER GATE DECISION:</span>
                  <span className={`font-bold ${selectedPlate.status === 'WATCHLIST' ? 'text-red-700' : 'text-emerald-700'}`}>
                    {selectedPlate.status === 'WATCHLIST' ? 'LOCKDOWN ENGAGED // FLAG OPERATOR' : 'GATE ACCESS AUTHORIZED'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-sandal-200 text-xs">
          <span className="text-stone-500 text-[10px]">
            CAPTURED AT {selectedPlate.timestamp} ON {selectedPlate.cameraId} // SPEED: {selectedPlate.speedKmh} KM/H
          </span>
          <button 
            onClick={() => {
              playTacticalSound('ack');
              alert(`Exported ANPR record ${selectedPlate.plateNumber} to National Logistics Archive.`);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sandal-100 hover:bg-sandal-200 border border-sandal-300 text-stone-900 transition-colors text-xs font-bold shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT DOSSIER</span>
          </button>
        </div>
      </div>
    </div>
  );
}
