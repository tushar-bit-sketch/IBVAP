"use client";

import React, { useState } from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { useSimulation } from '@/context/SimulationContext';
import { 
  ScrollText, 
  ShieldCheck, 
  Search, 
  Filter, 
  Lock, 
  User, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function AuditPage() {
  const { auditLogs } = useSimulation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    if (selectedRole !== 'ALL' && log.role !== selectedRole) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.resource.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
                <ScrollText className="w-5 h-5 text-sandal-600" />
                <h1 className="font-mono text-base font-bold text-stone-950 tracking-wider">
                  TAMPER-EVIDENT OPERATIONAL AUDIT LEDGER
                </h1>
                <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 font-mono text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>SHA-256 SEAL VALID</span>
                </span>
              </div>
              <p className="font-mono text-xs text-stone-600 mt-1">
                Chronological, cryptographically hashed audit trail recording every operator decision, alert acknowledgement, zone modification, and system scenario execution.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-white border border-sandal-300 rounded px-3 py-1.5 text-stone-800 text-xs placeholder:text-stone-400 focus:outline-none focus:border-sandal-500 shadow-2xs w-44"
              />
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="bg-white border border-sandal-300 rounded px-2 py-1.5 text-stone-800 text-xs focus:outline-none focus:border-sandal-500 shadow-2xs"
              >
                <option value="ALL">ALL ROLES</option>
                <option value="OPERATOR">OPERATOR</option>
                <option value="COMMANDER">COMMANDER</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="ANALYST">ANALYST</option>
                <option value="AUDITOR">AUDITOR</option>
              </select>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="p-4 rounded-lg bg-white border border-sandal-200 font-mono text-xs flex flex-col gap-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-sandal-200 text-[10px] text-stone-500 font-semibold uppercase">
              <span>RECORD COUNT: {filteredLogs.length}</span>
              <span className="text-sandal-700 font-bold">CHAIN INTEGRITY: ED25519-SIG-BOP17</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-sandal-200 bg-sandal-50/70 text-[10px] text-stone-600 uppercase tracking-wider">
                    <th className="py-2.5 px-3 font-bold">ID &amp; TIME</th>
                    <th className="py-2.5 px-3 font-bold">ACTOR</th>
                    <th className="py-2.5 px-3 font-bold">ROLE</th>
                    <th className="py-2.5 px-3 font-bold">ACTION</th>
                    <th className="py-2.5 px-3 font-bold">RESOURCE</th>
                    <th className="py-2.5 px-3 font-bold">RESULT</th>
                    <th className="py-2.5 px-3 font-bold">DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandal-100">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-sandal-50/60 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-bold text-stone-900 block">{log.id}</span>
                        <span className="text-[10px] text-stone-500">{log.timestamp}</span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-stone-800 whitespace-nowrap">
                        {log.actor}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-1.5 py-0.2 rounded bg-sandal-100 border border-sandal-200 text-[9px] text-sandal-800 font-semibold">
                          {log.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-sandal-700 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-2.5 px-3 text-stone-700 whitespace-nowrap">
                        {log.resource}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] font-bold">
                          {log.result}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-600 font-sans text-xs max-w-xs truncate">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
