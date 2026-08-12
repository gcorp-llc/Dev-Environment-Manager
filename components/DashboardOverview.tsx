'use client';

import React from 'react';
import { 
  Server, 
  Cpu, 
  ShieldCheck, 
  HardDrive, 
  Boxes, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Layers,
  Wrench,
  Activity
} from 'lucide-react';
import { CATEGORIES, PackageModule, Profile } from '@/lib/dem-data';

interface DashboardOverviewProps {
  modules: PackageModule[];
  profiles: Profile[];
  onRunCommand: (command: string, target?: string, extraData?: any) => void;
  onNavigateToView: (view: 'profiles' | 'doctor' | 'scripts') => void;
}

export default function DashboardOverview({
  modules,
  profiles,
  onRunCommand,
  onNavigateToView,
}: DashboardOverviewProps) {
  const verifiedCount = modules.filter((m) => m.status === 'verified').length;
  const installedCount = modules.filter((m) => m.status === 'installed' || m.status === 'configured').length;
  const coveragePercent = Math.round(((verifiedCount + installedCount) / (modules.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#30363d] bg-gradient-to-r from-[#161b22] via-[#1c2128] to-[#0d1117] p-6 shadow-xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-400 border border-emerald-500/30">
              <Activity className="h-3.5 w-3.5" /> Debian 13 (Trixie) Provisioning Ready
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight sm:text-3xl">
              Dev Environment Manager <span className="text-emerald-400">v2.5.0 LTS</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Automated workstation & server environment orchestration tool for Debian Linux.
              Provision 12 architectural categories, verify systemd daemons, manage GPG keyrings, and run real-time diagnostic checks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onRunCommand('install', 'Production Server Stack', profiles.find(p => p.id === 'prof-server-prod'))}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg hover:from-emerald-400 hover:to-teal-500 transition glow-emerald"
            >
              <Play className="h-4 w-4 fill-slate-950" /> Provision Server Profile
            </button>

            <button
              onClick={() => onNavigateToView('profiles')}
              className="flex items-center gap-2 rounded-xl bg-[#21262d] px-4 py-2.5 text-sm font-semibold text-slate-200 border border-[#30363d] hover:bg-[#30363d] transition"
            >
              Explore Modules <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Telemetry Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gauge 1 */}
        <div className="glass-panel glass-panel-hover rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>OS Target</span>
            <Cpu className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-100 font-mono">Debian 13</div>
            <p className="text-xs text-slate-400 font-mono">Codename: Trixie (6.12 LTS)</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> APT Sources Validated
          </div>
        </div>

        {/* Gauge 2 */}
        <div className="glass-panel glass-panel-hover rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Modules Coverage</span>
            <Boxes className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-100 font-mono">{coveragePercent}%</div>
            <p className="text-xs text-slate-400 font-mono">{verifiedCount + installedCount} / {modules.length} Modules Installed</p>
          </div>
          <div className="w-full bg-[#30363d] h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${coveragePercent}%` }} />
          </div>
        </div>

        {/* Gauge 3 */}
        <div className="glass-panel glass-panel-hover rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>GPG Security</span>
            <ShieldCheck className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-100 font-mono">Hardened</div>
            <p className="text-xs text-slate-400 font-mono">4 Keyrings in /etc/apt/keyrings/</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-purple-400">
            <ShieldCheck className="h-3.5 w-3.5" /> 0 Unsigned Repos
          </div>
        </div>

        {/* Gauge 4 */}
        <div className="glass-panel glass-panel-hover rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Hardware Activity</span>
            <HardDrive className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-100 font-mono">42.8 GB Free</div>
            <p className="text-xs text-slate-400 font-mono">AVX2 & FMA Instructions OK</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400">
            <Server className="h-3.5 w-3.5" /> Systemd PID 1 IPC OK
          </div>
        </div>
      </div>

      {/* Profiles Quick Stacks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Environment Profiles Stacks</h3>
            <p className="text-xs text-slate-400">Pre-configured module profiles ready for 1-click execution</p>
          </div>
          <button
            onClick={() => onNavigateToView('profiles')}
            className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
          >
            Manage Profiles <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((prof) => (
            <div key={prof.id} className="glass-panel glass-panel-hover rounded-xl p-5 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-100">{prof.name}</h4>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                    prof.isInstalled 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                  }`}>
                    {prof.isInstalled ? 'INSTALLED' : 'AVAILABLE'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{prof.description}</p>
                <div className="text-[11px] font-mono text-cyan-400 bg-cyan-500/5 px-2 py-1 rounded border border-cyan-500/20">
                  Target: {prof.target}
                </div>
              </div>

              <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">{prof.modules.length} Modules Included</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRunCommand('verify', prof.name, prof)}
                    className="px-3 py-1.5 rounded-lg bg-[#21262d] text-xs font-medium text-slate-300 border border-[#30363d] hover:bg-[#30363d] transition"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => onRunCommand('install', prof.name, prof)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-xs font-medium text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 transition flex items-center gap-1"
                  >
                    <Play className="h-3 w-3 fill-emerald-400" /> Install Stack
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 12-Category Grid Showcase */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100">12-Category Architecture Matrix</h3>
          <p className="text-xs text-slate-400">Complete architectural breakdown of Debian 13 software packages</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => {
            const catMods = modules.filter((m) => m.category === cat.id);
            const totalPkgs = catMods.reduce((acc, m) => acc + (m.packages?.length || 0), 0);
            return (
              <div key={cat.id} className="glass-panel glass-panel-hover rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    {cat.id}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#30363d] text-slate-300">
                    {catMods.length} Mods
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-100">{cat.name}</div>
                <p className="text-xs text-slate-400 line-clamp-2">{cat.description}</p>
                <div className="pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-[#30363d]/60">
                  <span>Packages:</span>
                  <span className="text-slate-200 font-semibold">{totalPkgs} Debian PKGs</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
