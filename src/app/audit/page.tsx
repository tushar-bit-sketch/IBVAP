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
    <div className="flex flex-col h-screen bg-obsidian text-neutral-100 overflow-hidden font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto bg-obsidian-base p-4 gap-4">
          {/* Header */}
          <div className="p-4 border border-neutral-800 rounded-lg bg-obsidian-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-tactical-cyan" />
                <h1 className="font-mono text-base font-bold text-white tracking-wider">
                  TAMPER-EVIDENT OPERATIONAL AUDIT LEDGER
                </h1>
                <span className="px-2 py-0.5 rounded bg-green-950/80 border border-green-800 font-mono text-[10px] text-tactical-green font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>SHA-256 SEAL VALID</span>
                </span>
              </div>
              <p className="font-mono text-xs text-neutral-400 mt-1">
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
                className="bg-neutral-900 border border-neutral-700 rounded px-3 py-1.5 text-neutral-200 text-xs placeholder:text-neutral-500 focus:outline-none w-44"
              />
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-neutral-200 text-xs focus:outline-none"
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
          <div className="p-4 rounded-lg bg-obsidian-100 border border-neutral-800 font-mono text-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-[10px] text-neutral-500 uppercase">
              <span>RECORD COUNT: {filteredLogs.length}</span>
              <span>CHAIN INTEGRITY: ED25519-SIG-BOP17</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-800/80 text-[10px] text-neutral-500 uppercase tracking-wider">
                    <th className="py-2 px-2">ID &amp; TIME</th>
                    <th className="py-2 px-2">ACTOR</th>
                    <th className="py-2 px-2">ROLE</th>
                    <th className="py-2 px-2">ACTION</th>
                    <th className="py-2 px-2">RESOURCE</th>
                    <th className="py-2 px-2">RESULT</th>
                    <th className="py-2 px-2">DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="py-2 px-2 whitespace-nowrap">
                        <span className="font-bold text-white block">{log.id}</span>
                        <span className="text-[10px] text-neutral-500">{log.timestamp}</span>
                      </td>
                      <td className="py-2 px-2 font-bold text-neutral-200 whitespace-nowrap">
                        {log.actor}
                      </td>
                      <td className="py-2 px-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.2 rounded bg-neutral-800 border border-neutral-700 text-[9px] text-neutral-300">
                          {log.role}
                        </span>
                      </td>
                      <td className="py-2 px-2 font-bold text-tactical-cyan whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-2 px-2 text-neutral-300 whitespace-nowrap">
                        {log.resource}
                      </td>
                      <td className="py-2 px-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.2 rounded bg-green-950 border border-green-800 text-tactical-green text-[9px] font-bold">
                          {log.result}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-neutral-400 font-sans text-xs max-w-xs truncate">
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
