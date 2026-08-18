'use client';

import React from 'react';
import { Stethoscope, Wrench, Archive, CheckCircle2, Download, Upload, RotateCcw, Sparkles } from 'lucide-react';

interface HeaderProps {
  onRunAction: (cmd: string, target?: string) => void;
  activeTab: string;
  onExportConfig: () => void;
  onImportConfig: () => void;
  onResetData: () => void;
}

export default function Header({ onRunAction, activeTab, onExportConfig, onImportConfig, onResetData }: HeaderProps) {
  return (
    <header className="border-b border-[#30363d] bg-[#161b22]/90 backdrop-blur-md px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
      {/* Brand & System Status */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-indigo-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg shadow-lg shadow-emerald-950/20">
          D
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
              Dev Environment Manager
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                v2.5.0 LTS
              </span>
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              Debian 13 Trixie
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            APT Keyrings & Systemd Services: Clean • Local State Persisted
          </p>
        </div>
      </div>

      {/* Controller Quick Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onRunAction('doctor')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] transition-all hover:border-slate-500 shadow-sm"
        >
          <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
          <span>Doctor</span>
        </button>

        <button
          onClick={() => onRunAction('repair')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] transition-all hover:border-slate-500 shadow-sm"
        >
          <Wrench className="w-3.5 h-3.5 text-amber-400" />
          <span>Repair</span>
        </button>

        <button
          onClick={() => onRunAction('backup')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] transition-all hover:border-slate-500 shadow-sm"
        >
          <Archive className="w-3.5 h-3.5 text-cyan-400" />
          <span>Backup</span>
        </button>

        <div className="h-4 w-px bg-[#30363d] mx-1"></div>

        <button
          onClick={onExportConfig}
          title="Export DEM configuration as dem-config.json"
          className="p-2 bg-[#21262d] hover:bg-[#30363d] text-slate-300 border border-[#30363d] rounded-xl text-xs transition-colors"
        >
          <Download className="w-4 h-4 text-slate-300" />
        </button>

        <button
          onClick={onImportConfig}
          title="Import dem-config.json"
          className="p-2 bg-[#21262d] hover:bg-[#30363d] text-slate-300 border border-[#30363d] rounded-xl text-xs transition-colors"
        >
          <Upload className="w-4 h-4 text-slate-300" />
        </button>

        <button
          onClick={onResetData}
          title="Reset back to factory defaults"
          className="p-2 bg-[#21262d] hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 border border-[#30363d] hover:border-rose-800 rounded-xl text-xs transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => onRunAction('verify', 'server')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-lg shadow-emerald-950/50"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verify Server</span>
        </button>
      </div>
    </header>
  );
}
