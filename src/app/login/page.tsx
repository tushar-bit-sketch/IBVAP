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
    <div className="relative min-h-screen w-screen bg-[#faf8f5] text-stone-900 flex items-center justify-center p-4 font-mono select-none overflow-hidden">
      {/* Background warm daylight terrain overlay */}
      <div className="absolute inset-0 bg-[#faf8f5]">
        <img
          src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=80"
          alt="Border Terrain"
          className="w-full h-full object-cover opacity-10 filter contrast-125 saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/80 via-transparent to-[#faf8f5]/90" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-sandal-200 rounded-xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
        {/* Header */}
        <div className="flex flex-col gap-1 text-center items-center pb-4 border-b border-sandal-200">
          <div className="w-12 h-12 rounded-xl bg-sandal-100 border border-sandal-300 flex items-center justify-center text-stone-900 mb-2 shadow-2xs">
            <span className="font-bold text-base text-sandal-900">IB</span>
          </div>
          <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">
            SECURE DEFENSE ACCESS GATEWAY // SIH26187
          </span>
          <h1 className="text-xl font-bold text-stone-950 tracking-wider uppercase">
            IBVAP // OPERATOR TERMINAL
          </h1>
          <div className="flex items-center gap-1.5 text-[9px] text-sandal-900 mt-1 px-2.5 py-0.5 rounded-full bg-sandal-100 border border-sandal-200 font-semibold">
            <span>PROTOTYPE // SIMULATED AUTHENTICATION</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-xs">
          {/* Quick Role Presets */}
          <div className="flex flex-col gap-1.5">
            <label className="text-stone-600 text-[10px] uppercase font-bold tracking-wider">
              SELECT OPERATOR ROLE (RBAC PRESET)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {rolesPreset.slice(0, 4).map(p => (
                <button
                  type="button"
                  key={p.role}
                  onClick={() => handleRoleSelect(p.role)}
                  className={`p-2.5 rounded-lg border text-left transition-all text-[10px] ${
                    selectedRole === p.role 
                      ? 'bg-stone-900 border-stone-900 text-white font-bold shadow-2xs' 
                      : 'bg-[#faf8f5] border-sandal-200 text-stone-700 hover:bg-sandal-50'
                  }`}
                >
                  <span className="block font-semibold">{p.role}</span>
                  <span className="text-[9px] opacity-75 truncate block mt-0.5">{p.callsign}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-stone-600 text-[10px] uppercase font-bold tracking-wider">
              OPERATOR CALLSIGN / BADGE ID
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#faf8f5] border border-sandal-300 rounded-lg text-stone-900 focus:outline-none focus:border-sandal-600 focus:bg-white font-mono text-xs shadow-2xs font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-stone-600 text-[10px] uppercase font-bold tracking-wider">
              CRYPTOGRAPHIC HARDWARE TOKEN / PIN
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#faf8f5] border border-sandal-300 rounded-lg text-stone-900 focus:outline-none focus:border-sandal-600 focus:bg-white font-mono text-xs shadow-2xs font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="mt-2 py-3 rounded-lg bg-stone-900 text-white font-bold hover:bg-stone-800 transition-all text-xs flex items-center justify-center gap-2 active:scale-95 shadow-md"
          >
            {isAuthenticating ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sandal-400 animate-ping" />
                <span>AUTHENTICATING EDGE CREDENTIALS...</span>
              </span>
            ) : (
              <>
                <Fingerprint className="w-4 h-4 text-sandal-300" />
                <span>INITIALIZE MISSION CONTROL</span>
                <ChevronRight className="w-4 h-4 text-sandal-300" />
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center pt-2 border-t border-sandal-200">
          <Link
            href="/"
            className="text-[11px] text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-wider font-semibold"
          >
            ← Return to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
