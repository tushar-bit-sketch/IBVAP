"use client";

import React, { useState } from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { useSimulation } from '@/context/SimulationContext';
import { Evidence } from '@/types';
import { 
  FolderArchive, 
  FileCheck, 
  Download, 
  Lock, 
  Search, 
  Filter, 
  FileText, 
  ShieldCheck, 
  Calendar,
  CheckCircle2,
  Printer,
  X,
  ExternalLink
} from 'lucide-react';

export default function EvidencePage() {
  const { evidence, playTacticalSound } = useSimulation();
  const [selectedItem, setSelectedItem] = useState<Evidence>(evidence[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [reportType, setReportType] = useState('DAILY SUMMARY');
  const [reportGenerated, setReportGenerated] = useState(false);

  const filteredEvidence = evidence.filter(e => 
    e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.eventId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.objectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.cameraName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-stone-900 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 font-mono select-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-sandal-200 gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-white border border-sandal-200 text-emerald-700 shadow-2xs">
                <FolderArchive className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-stone-950 tracking-wider">
                  FORENSIC EVIDENCE VAULT &amp; CHAIN OF CUSTODY
                </h1>
                <p className="text-[10px] text-stone-500">
                  CRYPTOGRAPHICALLY SEALED INCIDENT FRAMES (SHA-256 TAMPER-PROOF ARCHIVE)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playTacticalSound('click');
                  setReportGenerated(false);
                  setReportModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sandal-100 hover:bg-sandal-200 text-stone-900 text-xs transition-colors border border-sandal-300 active:scale-95 font-bold shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-sandal-700" />
                <span>GENERATE SECURITY REPORT</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search evidence by Record ID, Alert ID, Target ID, or Camera..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-sandal-200 rounded text-xs text-stone-900 focus:outline-none focus:border-sandal-400 placeholder:text-stone-400 shadow-2xs"
            />
          </div>

          {/* Master Detail Split */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1">
            {/* Left Evidence Archive List (5 cols) */}
            <div className="xl:col-span-5 bg-white border border-sandal-200 rounded p-3 flex flex-col gap-2 shadow-2xs">
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block mb-1">
                SEALED RECORDS ({filteredEvidence.length})
              </span>

              <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px]">
                {filteredEvidence.map(item => {
                  const isSelected = selectedItem.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        playTacticalSound('click');
                        setSelectedItem(item);
                      }}
                      className={`p-3 rounded border transition-all cursor-pointer flex flex-col gap-1 text-xs select-none ${
                        isSelected 
                          ? 'bg-stone-900 text-white shadow-md border-stone-800' 
                          : 'bg-sandal-50/70 border-sandal-200 hover:bg-sandal-100/70 text-stone-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lock className={`w-3 h-3 ${isSelected ? 'text-emerald-400' : 'text-emerald-700'}`} />
                          <span className={`font-bold ${isSelected ? 'text-white' : 'text-stone-950'}`}>{item.id}</span>
                        </div>
                        <span className={`text-[10px] ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>{item.timestamp.split(' ')[1]} IST</span>
                      </div>

                      <div className={`flex items-center justify-between text-[11px] ${isSelected ? 'text-stone-200' : 'text-stone-700'}`}>
                        <span className="font-semibold">{item.alertType.replace('_', ' ')}</span>
                        <span className={isSelected ? 'text-sandal-300 font-bold' : 'text-sandal-700 font-bold'}>{item.objectId}</span>
                      </div>

                      <div className={`text-[9px] truncate pt-1 border-t ${isSelected ? 'border-stone-800 text-stone-400' : 'border-sandal-200 text-stone-500'}`}>
                        HASH: {item.cryptographicHash.slice(0, 28)}...
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Evidence Inspector (7 cols) */}
            <div className="xl:col-span-7 bg-white border border-sandal-200 rounded p-4 flex flex-col gap-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-sandal-200">
                <div>
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest block">
                    FORENSIC ARCHIVE INSPECTOR
                  </span>
                  <h3 className="text-base font-bold text-stone-950 tracking-wider">
                    {selectedItem.id} // {selectedItem.alertType}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    playTacticalSound('ack');
                    setDossierModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-900 text-white hover:bg-stone-800 font-bold text-xs transition-all active:scale-95 shadow-xs"
                >
                  <FileCheck className="w-3.5 h-3.5 text-sandal-300" />
                  <span>VIEW OFFICIAL DOSSIER</span>
                </button>
              </div>

              {/* Snapshot Frame */}
              <div className="relative aspect-video rounded overflow-hidden border border-sandal-300 bg-black">
                <img
                  src={selectedItem.frameUrl}
                  alt="Forensic Frame"
                  className="w-full h-full object-cover filter contrast-115 grayscale-[20%]"
                />
                <div className="absolute inset-0 scanline-layer opacity-40 pointer-events-none" />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-stone-900/90 text-white border border-stone-700 rounded text-[10px]">
                  SEALED EVIDENCE FRAME: {selectedItem.eventId}
                </div>
              </div>

              {/* Cryptographic SHA-256 Hash Display */}
              <div className="p-2.5 rounded bg-sandal-50 border border-sandal-200 flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between text-[10px] text-stone-600">
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>SHA-256 TAMPER-PROOF CHECKSUM</span>
                  </span>
                  <span className="text-stone-500 font-semibold">DIGITALLY SEALED</span>
                </div>
                <code className="text-[11px] text-stone-800 break-all bg-white p-2 rounded border border-sandal-200 font-mono">
                  {selectedItem.cryptographicHash}
                </code>
              </div>

              {/* Chain of Custody Audit Log */}
              <div className="p-3 rounded bg-sandal-50 border border-sandal-200 flex flex-col gap-2 text-xs">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                  CHAIN OF CUSTODY TIMELINE
                </span>

                <div className="flex flex-col gap-1.5">
                  {selectedItem.chainOfCustody.map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-sandal-200 pb-1 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sandal-600" />
                        <span className="font-semibold text-stone-950">{entry.actor}</span>
                        <span className="text-stone-600">— {entry.action}</span>
                      </div>
                      <span className="text-stone-500 text-[10px]">{entry.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Official Printable Forensic Dossier Modal */}
          {/* Official Printable Forensic Dossier Modal */}
          {dossierModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
              <div className="w-full max-w-3xl bg-white border border-sandal-300 rounded shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto text-stone-900">
                <div className="flex items-start justify-between pb-3 border-b border-sandal-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold text-[9px]">
                        DEFENSE INTELLIGENCE DOSSIER
                      </span>
                      <span className="text-xs text-stone-500 font-mono">SIH #26187 // FORENSIC ARCHIVE</span>
                    </div>
                    <h2 className="text-lg font-bold text-stone-950 mt-1 tracking-wider">
                      INCIDENT DOSSIER: {selectedItem.id}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>PRINT / PDF</span>
                    </button>
                    <button
                      onClick={() => setDossierModalOpen(false)}
                      className="p-1.5 rounded text-stone-500 hover:text-stone-950 hover:bg-sandal-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Dossier Body */}
                <div className="flex flex-col gap-4 text-xs font-mono">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-sandal-50 p-3 rounded border border-sandal-200">
                    <div>
                      <span className="text-stone-500 text-[10px] block">OUTPOST</span>
                      <span className="text-stone-950 font-bold">BOP-17 / NORTH</span>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] block">CAMERA CHANNEL</span>
                      <span className="text-stone-950 font-bold">{selectedItem.cameraId}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] block">CLASSIFIED TARGET</span>
                      <span className="text-emerald-700 font-bold">{selectedItem.objectId}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] block">CONFIDENCE</span>
                      <span className="text-stone-950 font-bold">{(selectedItem.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="relative aspect-video rounded overflow-hidden border border-sandal-300 bg-black">
                    <img src={selectedItem.frameUrl} alt="Evidence Frame" className="w-full h-full object-cover filter contrast-115" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-stone-900/90 text-white text-[10px] rounded border border-stone-700">
                      SEALED EVIDENCE FRAME // TIMESTAMP: {selectedItem.timestamp}
                    </div>
                  </div>

                  <div className="p-3 bg-sandal-50 rounded border border-sandal-200 flex flex-col gap-1 text-[11px]">
                    <span className="text-[10px] text-stone-500 font-bold uppercase">CRYPTOGRAPHIC VERIFICATION SEAL</span>
                    <div className="break-all font-mono text-sandal-800 text-[10px] font-bold">
                      {selectedItem.cryptographicHash}
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">
                      SIGNING KEY: ED25519-SIG-8492-BOP17 // DIGITAL CERTIFICATE VALIDATED
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Report Modal */}
          {reportModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-lg bg-white border border-sandal-300 rounded p-5 flex flex-col gap-4 shadow-2xl text-stone-900">
                <div className="flex items-center justify-between pb-2 border-b border-sandal-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sandal-700" />
                    <span className="font-bold text-stone-950 text-sm tracking-wider">
                      SECURITY REPORT COMPILER
                    </span>
                  </div>
                  <button onClick={() => setReportModalOpen(false)} className="text-stone-400 hover:text-stone-900 text-lg font-bold">
                    ×
                  </button>
                </div>

                {!reportGenerated ? (
                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-stone-500 text-[10px] uppercase font-semibold">REPORT TEMPLATE</span>
                      <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="bg-sandal-50 border border-sandal-300 rounded p-2 text-stone-900 focus:outline-none"
                      >
                        <option value="DAILY SUMMARY">DAILY SUMMARY (24-HR THREAT DIGEST)</option>
                        <option value="WEEKLY SECURITY ANALYSIS">WEEKLY SECURITY ANALYSIS</option>
                        <option value="INCIDENT REPORT">INCIDENT REPORT (BREACH FORENSICS)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-stone-500 text-[10px] uppercase font-semibold">SECTOR</span>
                      <div className="bg-sandal-50 border border-sandal-200 rounded p-2 text-stone-800">
                        BOP-17 / NORTH SECTOR
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playTacticalSound('ack');
                        setReportGenerated(true);
                      }}
                      className="mt-2 py-2 rounded bg-stone-900 text-white font-bold hover:bg-stone-800 transition-all text-xs flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>COMPILE &amp; SIGN REPORT</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 text-xs">
                    <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{reportType} COMPILED &amp; DIGITALLY SIGNED</span>
                    </div>

                    <div className="p-3 rounded bg-sandal-50 border border-sandal-200 flex flex-col gap-1.5 text-[11px] text-stone-700 font-mono">
                      <div>TOTAL BREACHES: 3 CRITICAL</div>
                      <div>AVERAGE EDGE LATENCY: 91.2 MS</div>
                      <div>VEHICLES SCANNED: 4 LOGISTICS CARRIERS</div>
                      <div>DIGITAL SIGNATURE: OP-ALPHA-07 // ED25519</div>
                    </div>

                    <button
                      onClick={() => {
                        playTacticalSound('click');
                        setReportModalOpen(false);
                      }}
                      className="py-2 rounded bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      DOWNLOAD PDF PACK &amp; CLOSE
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
