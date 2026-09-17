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
    <div className="flex flex-col h-screen bg-[#faf8f5] text-stone-900 overflow-hidden font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto bg-[#faf8f5] p-4 gap-4">
          {/* Header */}
          <div className="p-4 border border-sandal-200 rounded-lg bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-sandal-600" />
                <h1 className="font-mono text-base font-bold text-stone-950 tracking-wider">
                  FORENSIC REPORTING &amp; INTELLIGENCE DOSSIERS
                </h1>
                <span className="px-2 py-0.5 rounded bg-sandal-100 border border-sandal-200 font-mono text-[10px] text-sandal-800 font-semibold">
                  SIH26187 EXPORT
                </span>
              </div>
              <p className="font-mono text-xs text-stone-600 mt-1">
                Generate tamper-evident, SHA-256 authenticated security summaries, incident briefs, and ANPR audit reports.
              </p>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={generating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-stone-900 text-white hover:bg-stone-800 font-mono text-xs transition-colors self-start sm:self-auto shadow-2xs font-semibold"
            >
              <Plus className="w-4 h-4 text-sandal-300" />
              <span>{generating ? 'COMPILING DOSSIER...' : 'GENERATE NEW REPORT'}</span>
            </button>
          </div>

          {/* Generator Parameters Card */}
          <div className="p-4 rounded-lg bg-white border border-sandal-200 font-mono text-xs shadow-2xs">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
              REPORT GENERATION PARAMETERS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-stone-500 font-semibold block mb-1">REPORT TYPE</label>
                <select
                  value={reportType}
                  onChange={e => setReportType(e.target.value as any)}
                  className="w-full bg-[#faf8f5] border border-sandal-300 rounded p-2 text-stone-800 text-xs focus:outline-none focus:border-sandal-500 shadow-2xs"
                >
                  <option value="DAILY_SUMMARY">DAILY OPERATIONAL SUMMARY</option>
                  <option value="INCIDENT_DOSSIER">INCIDENT FORENSIC DOSSIER</option>
                  <option value="ANPR_WATCHLIST">ANPR &amp; WATCHLIST LOG</option>
                  <option value="CAMERA_HEALTH">CAMERA STREAM HEALTH AUDIT</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-stone-500 font-semibold block mb-1">SECTOR OUTPOST</label>
                <select
                  value={selectedSector}
                  onChange={e => setSelectedSector(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-sandal-300 rounded p-2 text-stone-800 text-xs focus:outline-none focus:border-sandal-500 shadow-2xs"
                >
                  <option value="NORTH SECTOR (BOP-17)">NORTH SECTOR (BOP-17)</option>
                  <option value="EAST MOUNTAIN SECTOR (BOP-23)">EAST MOUNTAIN SECTOR (BOP-23)</option>
                  <option value="VALLEY PASS OUTPOST (BOP-01)">VALLEY PASS OUTPOST (BOP-01)</option>
                  <option value="NATIONAL AGGREGATED VIEW">NATIONAL AGGREGATED VIEW</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-stone-500 font-semibold block mb-1">OPERATOR AUTHORIZATION</label>
                <input
                  type="text"
                  disabled
                  value={`${currentUser.callsign} (${currentUser.role})`}
                  className="w-full bg-sandal-50 border border-sandal-200 rounded p-2 text-stone-700 font-bold text-xs"
                />
              </div>
            </div>
          </div>

          {/* Generated Reports Table */}
          <div className="p-4 rounded-lg bg-white border border-sandal-200 font-mono text-xs flex flex-col gap-3 shadow-2xs">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              ARCHIVED &amp; SEALED SECURITY REPORTS
            </h3>

            <div className="flex flex-col divide-y divide-sandal-200">
              {reports.map(rep => (
                <div
                  key={rep.id}
                  className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-sandal-50/60 px-2 rounded transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded bg-sandal-50 border border-sandal-200 text-sandal-700 shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-stone-950 tracking-wider">{rep.id}</span>
                        <span className="px-1.5 py-0.2 rounded bg-sandal-100 border border-sandal-200 text-[9px] text-sandal-800 font-semibold">
                          {rep.type}
                        </span>
                        <span className="text-[10px] text-stone-500">{rep.generatedAt}</span>
                      </div>
                      <h4 className="text-stone-900 font-semibold truncate">{rep.title}</h4>
                      <p className="text-[10px] text-stone-600 truncate mt-0.5">
                        By: <strong className="text-stone-800">{rep.generatedBy}</strong> • Sector: {rep.sector} • Events: {rep.eventCount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        playTacticalSound('click');
                        setSelectedReport(rep);
                      }}
                      className="px-2.5 py-1 rounded bg-white border border-sandal-300 text-stone-800 hover:bg-sandal-50 text-[11px] font-medium shadow-2xs"
                    >
                      PREVIEW
                    </button>
                    <button
                      onClick={() => {
                        playTacticalSound('click');
                        alert(`Exporting official forensic PDF dossier: ${rep.id} with SHA-256 integrity signature.`);
                      }}
                      className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-white hover:bg-stone-800 text-[11px] flex items-center gap-1 shadow-2xs font-semibold"
                    >
                      <Download className="w-3 h-3 text-sandal-300" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-mono select-none">
          <div className="w-full max-w-2xl bg-white border border-sandal-300 rounded-lg shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-sandal-200 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-sandal-700" />
                <span className="text-xs font-bold text-stone-900 tracking-widest uppercase">
                  OFFICIAL SECURITY DOSSIER // SIH26187
                </span>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded text-stone-400 hover:text-stone-800 hover:bg-sandal-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content */}
            <div className="bg-[#fbf9f6] text-stone-900 p-6 rounded border border-sandal-200 shadow-2xs font-mono text-xs flex flex-col gap-4">
              <div className="border-b-2 border-stone-900 pb-2 text-center">
                <span className="font-bold text-sm block tracking-wide">INTELLIGENT BORDER VIDEO ANALYTICS PLATFORM</span>
                <span className="text-[10px] text-stone-600 uppercase tracking-widest">
                  SIH26187 — DEFENSE SURVEILLANCE &amp; FORENSIC DIVISION
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-sandal-300 pb-2">
                <div><strong>REPORT ID:</strong> {selectedReport.id}</div>
                <div><strong>TIMESTAMP:</strong> {selectedReport.generatedAt}</div>
                <div><strong>SECTOR:</strong> {selectedReport.sector}</div>
                <div><strong>AUTHOR:</strong> {selectedReport.generatedBy}</div>
              </div>

              <div>
                <span className="font-bold text-xs uppercase block mb-1 text-stone-900">{selectedReport.title}</span>
                <p className="text-stone-700 text-[11px] leading-relaxed">
                  This forensic package compiles synchronized edge detection events, virtual polygon tripwire breaches, and continuous trajectory tracks recorded by the BOP-17 edge computing daemon. All included frames have been cryptographically sealed against tampering.
                </p>
              </div>

              <div className="bg-white p-3 rounded border border-sandal-200 flex flex-col gap-1 text-[10px] shadow-2xs">
                <div><strong>INTEGRITY SEAL:</strong> SHA-256 Validated</div>
                <div className="text-[9px] text-stone-600 break-all font-mono">
                  {selectedReport.integrityHash}
                </div>
                <div><strong>DIGITAL SIGNATURE:</strong> ED25519-SIG-8492-BOP17-AUTHENTICATED</div>
              </div>

              <div className="text-right text-[10px] text-stone-500 pt-2 border-t border-sandal-200">
                PROTOTYPE SIMULATION • SIH26187 • STRICTLY RESTRICTED
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs flex items-center gap-1.5 shadow-2xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PRINT DOSSIER</span>
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-3 py-1.5 rounded bg-white border border-sandal-300 text-stone-700 hover:bg-sandal-50 text-xs font-medium"
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
