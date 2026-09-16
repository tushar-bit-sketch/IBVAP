"use client";

import React, { useState } from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { useSimulation } from '@/context/SimulationContext';
import { INITIAL_REPORTS } from '@/data/mockData';
import { ReportItem } from '@/types';
import { 
  FileCheck2, 
  Download, 
  Printer, 
  Search, 
  Calendar, 
  Shield, 
  FileText, 
  CheckCircle2, 
  Plus, 
  X,
  Lock
} from 'lucide-react';

export default function ReportsPage() {
  const { currentUser, playTacticalSound, logAuditAction } = useSimulation();

  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState<'DAILY_SUMMARY' | 'INCIDENT_DOSSIER' | 'ANPR_WATCHLIST' | 'CAMERA_HEALTH'>('DAILY_SUMMARY');
  const [selectedSector, setSelectedSector] = useState('NORTH SECTOR (BOP-17)');

  const handleGenerateReport = () => {
    setGenerating(true);
    playTacticalSound('click');

    setTimeout(() => {
      const now = new Date();
      const newRep: ReportItem = {
        id: `REP-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(10 + Math.random() * 90)}`,
        title: `${selectedSector} — ${reportType.replace('_', ' ')} REPORT`,
        type: reportType,
        generatedAt: `${now.toLocaleDateString('en-CA')} ${now.toLocaleTimeString('en-US', { hour12: false })} IST`,
        generatedBy: currentUser.callsign,
        sector: selectedSector,
        eventCount: Math.floor(15 + Math.random() * 40),
        integrityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 (Verified)',
        classification: 'RESTRICTED / DEMO SIMULATION'
      };

      setReports(prev => [newRep, ...prev]);
      setSelectedReport(newRep);
      setGenerating(false);
      playTacticalSound('ack');
      logAuditAction('REPORT_GENERATED', newRep.id, `Generated report type ${reportType}`);
    }, 800);
  };

  return (
    <div className="flex flex-col h-screen bg-obsidian text-neutral-100 overflow-hidden font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto bg-obsidian-base p-4 gap-4">
          {/* Header */}
          <div className="p-4 border border-neutral-800 rounded-lg bg-obsidian-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-tactical-cyan" />
                <h1 className="font-mono text-base font-bold text-white tracking-wider">
                  FORENSIC REPORTING &amp; INTELLIGENCE DOSSIERS
                </h1>
                <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono text-[10px] text-neutral-300">
                  SIH26187 EXPORT
                </span>
              </div>
              <p className="font-mono text-xs text-neutral-400 mt-1">
                Generate tamper-evident, SHA-256 authenticated security summaries, incident briefs, and ANPR audit reports.
              </p>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={generating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700 font-mono text-xs transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-tactical-cyan" />
              <span>{generating ? 'COMPILING DOSSIER...' : 'GENERATE NEW REPORT'}</span>
            </button>
          </div>

          {/* Generator Parameters Card */}
          <div className="p-4 rounded-lg bg-obsidian-100 border border-neutral-800 font-mono text-xs">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
              REPORT GENERATION PARAMETERS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-neutral-500 block mb-1">REPORT TYPE</label>
                <select
                  value={reportType}
                  onChange={e => setReportType(e.target.value as any)}
                  className="w-full bg-obsidian-200 border border-neutral-700 rounded p-2 text-neutral-200 text-xs focus:outline-none"
                >
                  <option value="DAILY_SUMMARY">DAILY OPERATIONAL SUMMARY</option>
                  <option value="INCIDENT_DOSSIER">INCIDENT FORENSIC DOSSIER</option>
                  <option value="ANPR_WATCHLIST">ANPR &amp; WATCHLIST LOG</option>
                  <option value="CAMERA_HEALTH">CAMERA STREAM HEALTH AUDIT</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-500 block mb-1">SECTOR OUTPOST</label>
                <select
                  value={selectedSector}
                  onChange={e => setSelectedSector(e.target.value)}
                  className="w-full bg-obsidian-200 border border-neutral-700 rounded p-2 text-neutral-200 text-xs focus:outline-none"
                >
                  <option value="NORTH SECTOR (BOP-17)">NORTH SECTOR (BOP-17)</option>
                  <option value="EAST MOUNTAIN SECTOR (BOP-23)">EAST MOUNTAIN SECTOR (BOP-23)</option>
                  <option value="VALLEY PASS OUTPOST (BOP-01)">VALLEY PASS OUTPOST (BOP-01)</option>
                  <option value="NATIONAL AGGREGATED VIEW">NATIONAL AGGREGATED VIEW</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-500 block mb-1">OPERATOR AUTHORIZATION</label>
                <input
                  type="text"
                  disabled
                  value={`${currentUser.callsign} (${currentUser.role})`}
                  className="w-full bg-obsidian-200/50 border border-neutral-800 rounded p-2 text-neutral-400 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Generated Reports Table */}
          <div className="p-4 rounded-lg bg-obsidian-100 border border-neutral-800 font-mono text-xs flex flex-col gap-3">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              ARCHIVED &amp; SEALED SECURITY REPORTS
            </h3>

            <div className="flex flex-col divide-y divide-neutral-800/80">
              {reports.map(rep => (
                <div
                  key={rep.id}
                  className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-neutral-900/40 px-2 rounded transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded bg-neutral-900 border border-neutral-700 text-tactical-cyan shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white tracking-wider">{rep.id}</span>
                        <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-[9px] text-neutral-400">
                          {rep.type}
                        </span>
                        <span className="text-[10px] text-neutral-500">{rep.generatedAt}</span>
                      </div>
                      <h4 className="text-neutral-200 font-semibold truncate">{rep.title}</h4>
                      <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                        By: <strong className="text-neutral-400">{rep.generatedBy}</strong> • Sector: {rep.sector} • Events: {rep.eventCount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        playTacticalSound('click');
                        setSelectedReport(rep);
                      }}
                      className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white text-[11px]"
                    >
                      PREVIEW
                    </button>
                    <button
                      onClick={() => {
                        playTacticalSound('click');
                        alert(`Exporting official forensic PDF dossier: ${rep.id} with SHA-256 integrity signature.`);
                      }}
                      className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white text-[11px] flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>EXPORT</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Official Forensic Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 font-mono select-none">
          <div className="w-full max-w-2xl bg-neutral-950 border border-neutral-600 rounded-lg shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-tactical-cyan" />
                <span className="text-xs font-bold text-white tracking-widest">
                  OFFICIAL SECURITY DOSSIER // SIH26187
                </span>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content */}
            <div className="bg-white text-black p-6 rounded shadow font-mono text-xs flex flex-col gap-4">
              <div className="border-b-2 border-black pb-2 text-center">
                <span className="font-bold text-sm block">INTELLIGENT BORDER VIDEO ANALYTICS PLATFORM</span>
                <span className="text-[10px] text-neutral-700 uppercase tracking-widest">
                  SIH26187 — DEFENSE SURVEILLANCE &amp; FORENSIC DIVISION
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-neutral-300 pb-2">
                <div><strong>REPORT ID:</strong> {selectedReport.id}</div>
                <div><strong>TIMESTAMP:</strong> {selectedReport.generatedAt}</div>
                <div><strong>SECTOR:</strong> {selectedReport.sector}</div>
                <div><strong>AUTHOR:</strong> {selectedReport.generatedBy}</div>
              </div>

              <div>
                <span className="font-bold text-xs uppercase block mb-1">{selectedReport.title}</span>
                <p className="text-neutral-800 text-[11px] leading-relaxed">
                  This forensic package compiles synchronized edge detection events, virtual polygon tripwire breaches, and continuous trajectory tracks recorded by the BOP-17 edge computing daemon. All included frames have been cryptographically sealed against tampering.
                </p>
              </div>

              <div className="bg-neutral-100 p-3 rounded border border-neutral-300 flex flex-col gap-1 text-[10px]">
                <div><strong>INTEGRITY SEAL:</strong> SHA-256 Validated</div>
                <div className="text-[9px] text-neutral-600 break-all font-mono">
                  {selectedReport.integrityHash}
                </div>
                <div><strong>DIGITAL SIGNATURE:</strong> ED25519-SIG-8492-BOP17-AUTHENTICATED</div>
              </div>

              <div className="text-right text-[10px] text-neutral-600 pt-2 border-t border-neutral-300">
                PROTOTYPE SIMULATION • SIH26187 • STRICTLY RESTRICTED
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PRINT DOSSIER</span>
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white text-xs"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
