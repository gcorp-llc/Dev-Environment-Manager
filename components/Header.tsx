'use client';

import React, { useRef } from 'react';
import { 
  Terminal, 
  Stethoscope, 
  Wrench, 
  Archive, 
  CheckCircle2, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck,
  Server
} from 'lucide-react';
import { PackageModule, Profile, DiagnosticCheck } from '@/lib/dem-data';

interface HeaderProps {
  onRunCommand: (command: string, target?: string) => void;
  modules: PackageModule[];
  profiles: Profile[];
  diagnostics: DiagnosticCheck[];
  onImportConfig: (data: { modules?: PackageModule[]; profiles?: Profile[]; diagnostics?: DiagnosticCheck[] }) => void;
  onResetDefaults: () => void;
}

export default function Header({
  onRunCommand,
  modules,
  profiles,
  diagnostics,
  onImportConfig,
  onResetDefaults,
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    const data = {
      version: '2.5.0-LTS',
      exportedAt: new Date().toISOString(),
      modules,
      profiles,
      diagnostics,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dem-config-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onImportConfig(parsed);
      } catch (err) {
        alert('Invalid JSON configuration file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#30363d] bg-[#0d1117]/90 backdrop-blur-md px-4 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400 glow-emerald">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-100 tracking-tight">Dev Environment Manager</h1>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-medium text-emerald-400 border border-emerald-500/30">
                v2.5.0 LTS
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-cyan-500/10 px-2 py-0.5 text-xs font-mono font-medium text-cyan-400 border border-cyan-500/30">
                <Server className="h-3 w-3" /> Debian 13 Trixie
              </span>
            </div>
            <p className="text-xs text-slate-400">Automated Linux Developer Provisioning & Diagnostic Engine</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick-action buttons */}
          <button
            onClick={() => onRunCommand('doctor')}
            className="flex items-center gap-1.5 rounded-lg bg-[#161b22] px-3 py-1.5 text-xs font-medium text-emerald-400 border border-[#30363d] hover:bg-[#1c2128] hover:border-emerald-500/40 transition"
          >
            <Stethoscope className="h-3.5 w-3.5" />
            <span>Doctor</span>
          </button>

          <button
            onClick={() => onRunCommand('repair')}
            className="flex items-center gap-1.5 rounded-lg bg-[#161b22] px-3 py-1.5 text-xs font-medium text-amber-400 border border-[#30363d] hover:bg-[#1c2128] hover:border-amber-500/40 transition"
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Repair</span>
          </button>

          <button
            onClick={() => onRunCommand('backup')}
            className="flex items-center gap-1.5 rounded-lg bg-[#161b22] px-3 py-1.5 text-xs font-medium text-purple-400 border border-[#30363d] hover:bg-[#1c2128] hover:border-purple-500/40 transition"
          >
            <Archive className="h-3.5 w-3.5" />
            <span>Backup</span>
          </button>

          <button
            onClick={() => onRunCommand('verify', 'Production Server Stack')}
            className="flex items-center gap-1.5 rounded-lg bg-[#161b22] px-3 py-1.5 text-xs font-medium text-cyan-400 border border-[#30363d] hover:bg-[#1c2128] hover:border-cyan-500/40 transition"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Verify Server</span>
          </button>

          <div className="h-5 w-[1px] bg-[#30363d] mx-1 hidden sm:block" />

          {/* Utility Actions */}
          <button
            onClick={handleExport}
            title="Export JSON Configuration"
            className="flex items-center gap-1 rounded-lg bg-[#161b22] p-1.5 text-xs text-slate-300 border border-[#30363d] hover:bg-[#1c2128] hover:text-slate-100 transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Export</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import JSON Configuration"
            className="flex items-center gap-1 rounded-lg bg-[#161b22] p-1.5 text-xs text-slate-300 border border-[#30363d] hover:bg-[#1c2128] hover:text-slate-100 transition"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Import</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={onResetDefaults}
            title="Factory Reset Defaults"
            className="flex items-center gap-1 rounded-lg bg-rose-500/10 p-1.5 text-xs text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
