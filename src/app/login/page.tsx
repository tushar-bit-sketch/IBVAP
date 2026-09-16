"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSimulation } from '@/context/SimulationContext';
import { Role } from '@/types';
import { 
  Shield, 
  Lock, 
  KeyRound, 
  ChevronRight, 
  Fingerprint, 
  UserCheck 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, logAuditAction, playTacticalSound } = useSimulation();

  const [selectedRole, setSelectedRole] = useState<Role>('OPERATOR');
  const [operatorId, setOperatorId] = useState('OP-ALPHA-07');
  const [passkey, setPasskey] = useState('••••••••••••');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const rolesPreset: { role: Role; callsign: string; title: string }[] = [
    { role: 'OPERATOR', callsign: 'OP-ALPHA-07', title: 'Sub-Inspector Ankit Verma (Console 01)' },
    { role: 'COMMANDER', callsign: 'VICTOR-ACTUAL', title: 'Col. Rajesh Sharma (BOP-17 HQ)' },
    { role: 'ANALYST', callsign: 'INTEL-03', title: 'Analyst Priya Mehta (Intel Cell)' },
    { role: 'AUDITOR', callsign: 'AUDIT-LEAD', title: 'Inspector Harpreet Kaur (Audit Wing)' },
    { role: 'SUPER_ADMIN', callsign: 'SYS-ROOT', title: 'Defense Technology Administrator' }
  ];

  const handleRoleSelect = (r: Role) => {
    setSelectedRole(r);
    const preset = rolesPreset.find(p => p.role === r);
    if (preset) setOperatorId(preset.callsign);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    playTacticalSound('click');
    switchRole(selectedRole);
    logAuditAction('OPERATOR_LOGIN', `USER:${operatorId}`, `Operator authenticated with role ${selectedRole}`);

    setTimeout(() => {
      playTacticalSound('ack');
      router.push('/command-center');
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-screen bg-black text-neutral-100 flex items-center justify-center p-4 font-mono select-none overflow-hidden">
      {/* Background visual */}
      <div className="absolute inset-0 bg-neutral-950">
        <img
          src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=80"
          alt="Border Terrain"
          className="w-full h-full object-cover opacity-15 filter contrast-125 grayscale"
        />
        <div className="absolute inset-0 scanline-layer opacity-40" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-obsidian-200 border border-neutral-800 rounded-lg p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col gap-1 text-center items-center pb-4 border-b border-neutral-800">
          <div className="w-10 h-10 rounded bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white mb-2 shadow-inner">
            <span className="font-bold text-sm">IB</span>
          </div>
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
            SECURE DEFENSE ACCESS GATEWAY // SIH26187
          </span>
          <h1 className="text-xl font-bold text-white tracking-wider uppercase">
            IBVAP // OPERATOR TERMINAL
          </h1>
          <div className="flex items-center gap-1.5 text-[9px] text-tactical-amber mt-1 px-2 py-0.5 rounded bg-amber-950/40 border border-amber-900/60">
            <span>PROTOTYPE // SIMULATED AUTHENTICATION</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-xs">
          {/* Quick Role Presets */}
          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-400 text-[10px] uppercase font-semibold">
              SELECT OPERATOR ROLE (RBAC PRESET)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {rolesPreset.slice(0, 4).map(p => (
                <button
                  type="button"
                  key={p.role}
                  onClick={() => handleRoleSelect(p.role)}
                  className={`p-2 rounded border text-left transition-colors text-[10px] ${
                    selectedRole === p.role 
                      ? 'bg-neutral-800 border-tactical-cyan text-white font-bold' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="block">{p.role}</span>
                  <span className="text-[9px] text-neutral-500 truncate block">{p.callsign}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-400 text-[10px] uppercase font-semibold">
              OPERATOR CALLSIGN / BADGE ID
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
              <input
                type="text"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-neutral-600 font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-400 text-[10px] uppercase font-semibold">
              CRYPTOGRAPHIC HARDWARE TOKEN / PIN
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-neutral-600 font-mono text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="mt-2 py-3 rounded bg-neutral-100 text-neutral-950 font-bold hover:bg-white transition-all text-xs flex items-center justify-center gap-2 active:scale-95 shadow-lg"
          >
            {isAuthenticating ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-950 animate-ping" />
                <span>AUTHENTICATING EDGE CREDENTIALS...</span>
              </span>
            ) : (
              <>
                <Fingerprint className="w-4 h-4" />
                <span>INITIALIZE MISSION CONTROL</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center pt-2 border-t border-neutral-800/80">
          <Link
            href="/"
            className="text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors uppercase tracking-wider"
          >
            ← Return to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
