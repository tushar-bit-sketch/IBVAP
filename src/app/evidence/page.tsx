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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-neutral-100 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 font-mono select-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-800 gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-tactical-green">
                <FolderArchive className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-wider">
                  FORENSIC EVIDENCE VAULT &amp; CHAIN OF CUSTODY
                </h1>
                <p className="text-[10px] text-neutral-500">
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs transition-colors border border-neutral-700 active:scale-95"
              >
                <FileText className="w-3.5 h-3.5 text-tactical-cyan" />
                <span>GENERATE SECURITY REPORT</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search evidence by Record ID, Alert ID, Target ID, or Camera..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-obsidian-200 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-neutral-600 placeholder:text-neutral-600"
            />
          </div>

          {/* Master Detail Split */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1">
            {/* Left Evidence Archive List (5 cols) */}
            <div className="xl:col-span-5 bg-obsidian-200 border border-neutral-800 rounded p-3 flex flex-col gap-2">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block mb-1">
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
                          ? 'bg-neutral-800 border-white text-white shadow-md' 
                          : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lock className="w-3 h-3 text-tactical-green" />
                          <span className="font-bold text-white">{item.id}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400">{item.timestamp.split(' ')[1]} IST</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-300">
                        <span className="font-semibold">{item.alertType.replace('_', ' ')}</span>
                        <span className="text-tactical-cyan">{item.objectId}</span>
                      </div>

                      <div className="text-[9px] text-neutral-500 truncate pt-1 border-t border-neutral-800/80">
                        HASH: {item.cryptographicHash.slice(0, 28)}...
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Evidence Inspector (7 cols) */}
            <div className="xl:col-span-7 bg-black border border-neutral-800 rounded p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest block">
                    FORENSIC ARCHIVE INSPECTOR
                  </span>
                  <h3 className="text-base font-bold text-white tracking-wider">
                    {selectedItem.id} // {selectedItem.alertType}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    playTacticalSound('ack');
                    setDossierModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-100 text-neutral-950 hover:bg-white font-bold text-xs transition-all active:scale-95 shadow-md"
                >
                  <FileCheck className="w-3.5 h-3.5 text-black" />
                  <span>VIEW OFFICIAL DOSSIER</span>
                </button>
              </div>

              {/* Snapshot Frame */}
              <div className="relative aspect-video rounded overflow-hidden border border-neutral-800 bg-neutral-950">
                <img
                  src={selectedItem.frameUrl}
                  alt="Forensic Frame"
                  className="w-full h-full object-cover filter contrast-115 grayscale-[20%]"
                />
                <div className="absolute inset-0 scanline-layer opacity-40 pointer-events-none" />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 rounded border border-neutral-700 text-[10px] text-white">
                  SEALED EVIDENCE FRAME: {selectedItem.eventId}
                </div>
              </div>

              {/* Cryptographic SHA-256 Hash Display */}
              <div className="p-2.5 rounded bg-obsidian-200 border border-neutral-800 flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span className="flex items-center gap-1 text-tactical-green font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>SHA-256 TAMPER-PROOF CHECKSUM</span>
                  </span>
                  <span className="text-neutral-500">DIGITALLY SEALED</span>
                </div>
                <code className="text-[11px] text-neutral-300 break-all bg-black/60 p-2 rounded border border-neutral-900">
                  {selectedItem.cryptographicHash}
                </code>
              </div>

              {/* Chain of Custody Audit Log */}
              <div className="p-3 rounded bg-obsidian-200 border border-neutral-800 flex flex-col gap-2 text-xs">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                  CHAIN OF CUSTODY TIMELINE
                </span>

                <div className="flex flex-col gap-1.5">
                  {selectedItem.chainOfCustody.map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-neutral-900 pb-1 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-tactical-cyan" />
                        <span className="font-semibold text-white">{entry.actor}</span>
                        <span className="text-neutral-400">— {entry.action}</span>
                      </div>
                      <span className="text-neutral-500 text-[10px]">{entry.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Official Printable Forensic Dossier Modal */}
          {dossierModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
              <div className="w-full max-w-3xl bg-neutral-950 border border-neutral-700 rounded shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto text-neutral-200">
                <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-950 text-tactical-red border border-red-800 font-bold text-[9px]">
                        DEFENSE INTELLIGENCE DOSSIER
                      </span>
                      <span className="text-xs text-neutral-400">SIH #26187 // FORENSIC ARCHIVE</span>
                    </div>
                    <h2 className="text-lg font-bold text-white mt-1 tracking-wider">
                      INCIDENT DOSSIER: {selectedItem.id}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>PRINT / PDF</span>
                    </button>
                    <button
                      onClick={() => setDossierModalOpen(false)}
                      className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Dossier Body */}
                <div className="flex flex-col gap-4 text-xs font-mono">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-neutral-900/80 p-3 rounded border border-neutral-800">
                    <div>
                      <span className="text-neutral-500 text-[10px] block">OUTPOST</span>
                      <span className="text-white font-bold">BOP-17 / NORTH</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">CAMERA CHANNEL</span>
                      <span className="text-white font-bold">{selectedItem.cameraId}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">CLASSIFIED TARGET</span>
                      <span className="text-tactical-green font-bold">{selectedItem.objectId}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">CONFIDENCE</span>
                      <span className="text-white font-bold">{(selectedItem.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="relative aspect-video rounded overflow-hidden border border-neutral-800">
                    <img src={selectedItem.frameUrl} alt="Evidence Frame" className="w-full h-full object-cover filter contrast-115" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-[10px] text-white rounded">
                      SEALED EVIDENCE FRAME // TIMESTAMP: {selectedItem.timestamp}
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-900/60 rounded border border-neutral-800 flex flex-col gap-1 text-[11px]">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase">CRYPTOGRAPHIC VERIFICATION SEAL</span>
                    <div className="break-all font-mono text-tactical-cyan text-[10px]">
                      {selectedItem.cryptographicHash}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">
                      SIGNING KEY: ED25519-SIG-8492-BOP17 // DIGITAL CERTIFICATE VALIDATED
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Report Modal */}
          {reportModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
              <div className="w-full max-w-lg bg-obsidian-200 border border-neutral-800 rounded p-5 flex flex-col gap-4 shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-tactical-cyan" />
                    <span className="font-bold text-white text-sm tracking-wider">
                      SECURITY REPORT COMPILER
                    </span>
                  </div>
                  <button onClick={() => setReportModalOpen(false)} className="text-neutral-500 hover:text-white">
                    ×
                  </button>
                </div>

                {!reportGenerated ? (
                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-neutral-500 text-[10px] uppercase">REPORT TEMPLATE</span>
                      <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 rounded p-2 text-white focus:outline-none"
                      >
                        <option value="DAILY SUMMARY">DAILY SUMMARY (24-HR THREAT DIGEST)</option>
                        <option value="WEEKLY SECURITY ANALYSIS">WEEKLY SECURITY ANALYSIS</option>
                        <option value="INCIDENT REPORT">INCIDENT REPORT (BREACH FORENSICS)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-neutral-500 text-[10px] uppercase">SECTOR</span>
                      <div className="bg-neutral-900 border border-neutral-800 rounded p-2 text-neutral-300">
                        BOP-17 / NORTH SECTOR
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playTacticalSound('ack');
                        setReportGenerated(true);
                      }}
                      className="mt-2 py-2 rounded bg-neutral-100 text-neutral-950 font-bold hover:bg-white transition-all text-xs flex items-center justify-center gap-2"
                    >
                      <span>COMPILE &amp; SIGN REPORT</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 text-xs">
                    <div className="p-3 rounded bg-emerald-950/40 border border-emerald-900 text-tactical-green flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{reportType} COMPILED &amp; DIGITALLY SIGNED</span>
                    </div>

                    <div className="p-3 rounded bg-neutral-900 border border-neutral-800 flex flex-col gap-1.5 text-[11px] text-neutral-300">
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
                      className="py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
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
