'use client';

import React, { useState } from 'react';
import { DiagnosticCheck } from '@/lib/dem-data';
import { 
  Stethoscope, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  Play, 
  Wrench,
  ShieldCheck
} from 'lucide-react';

interface DoctorViewProps {
  diagnostics: DiagnosticCheck[];
  onRunDoctor: () => void;
  onEditCheck: (check: DiagnosticCheck | null) => void;
  onDeleteCheck: (checkId: string) => void;
  onRunFixCommand: (fixCmd: string) => void;
}

export default function DoctorView({
  diagnostics,
  onRunDoctor,
  onEditCheck,
  onDeleteCheck,
  onRunFixCommand,
}: DoctorViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const passCount = diagnostics.filter((d) => d.status === 'pass').length;
  const warnCount = diagnostics.filter((d) => d.status === 'warn').length;
  const failCount = diagnostics.filter((d) => d.status === 'fail').length;

  const categories = ['All', 'System', 'Packages', 'Security', 'Services', 'Hardware', 'Storage'];

  const filteredChecks = diagnostics.filter(
    (d) => selectedCategory === 'All' || d.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363d] pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-emerald-400" /> System Doctor Diagnostics Engine
          </h2>
          <p className="text-xs text-slate-400">
            Real-time audit suite for Debian 13 release target, APT locks, GPG keyrings, systemd init, CPU instruction sets (AVX2), and free storage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditCheck(null)}
            className="flex items-center gap-1.5 rounded-lg bg-[#21262d] px-3 py-2 text-xs font-semibold text-slate-200 border border-[#30363d] hover:bg-[#30363d] transition"
          >
            <Plus className="h-4 w-4" /> Add Check
          </button>
          <button
            onClick={onRunDoctor}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition glow-emerald"
          >
            <Play className="h-4 w-4 fill-slate-950" /> Run All Diagnostics
          </button>
        </div>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase">Total Audit Checks</div>
            <div className="text-2xl font-bold text-slate-100 font-mono">{diagnostics.length}</div>
          </div>
          <ShieldCheck className="h-8 w-8 text-cyan-400" />
        </div>

        <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase">PASSED</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{passCount}</div>
          </div>
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>

        <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase">WARNINGS</div>
            <div className="text-2xl font-bold text-amber-400 font-mono">{warnCount}</div>
          </div>
          <AlertTriangle className="h-8 w-8 text-amber-400" />
        </div>

        <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-rose-400 uppercase">FAILURES</div>
            <div className="text-2xl font-bold text-rose-400 font-mono">{failCount}</div>
          </div>
          <XCircle className="h-8 w-8 text-rose-400" />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-[#161b22] text-slate-400 border border-[#30363d] hover:bg-[#1c2128]'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Diagnostic Checks List */}
      <div className="space-y-3">
        {filteredChecks.map((check) => (
          <div
            key={check.id}
            className="glass-panel glass-panel-hover rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {check.status === 'pass' && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                {check.status === 'warn' && <AlertTriangle className="h-5 w-5 text-amber-400" />}
                {check.status === 'fail' && <XCircle className="h-5 w-5 text-rose-400" />}
                {check.status === 'pending' && <Clock className="h-5 w-5 text-slate-400" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100">{check.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0d1117] text-slate-400 border border-[#30363d]">
                    {check.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono">{check.message}</p>

                {check.fixAction && (
                  <div className="mt-2 text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 flex items-center justify-between gap-2">
                    <span>Suggested Fix: {check.fixAction}</span>
                    <button
                      onClick={() => onRunFixCommand(check.fixAction!)}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-[10px] font-bold flex items-center gap-1"
                    >
                      <Wrench className="h-3 w-3" /> Apply Fix
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => onEditCheck(check)}
                title="Edit Check"
                className="p-1.5 rounded bg-[#21262d] text-slate-300 hover:text-slate-100 border border-[#30363d]"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDeleteCheck(check.id)}
                title="Delete Check"
                className="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
