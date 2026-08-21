'use client';

import React from 'react';
import { Cpu, Server, Activity, Play, CheckCircle2, ArrowUpRight, Terminal, Shield, Layers, Box, Wrench, RefreshCw, Sparkles } from 'lucide-react';
import { PackageModule, Profile, CATEGORIES } from '@/lib/dem-data';

interface DashboardOverviewProps {
  modules: PackageModule[];
  profiles: Profile[];
  onRunAction: (cmd: string, target?: string) => void;
  onNavigate: (tab: string) => void;
}

export default function DashboardOverview({ modules, profiles, onRunAction, onNavigate }: DashboardOverviewProps) {
  const verifiedCount = modules.filter(m => m.status === 'verified').length;
  const configuredCount = modules.filter(m => m.status === 'configured').length;
  const uninstalledCount = modules.filter(m => m.status === 'uninstalled').length;
  const activePercent = Math.round(((verifiedCount + configuredCount) / Math.max(modules.length, 1)) * 100);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / System Summary */}
      <div className="bg-gradient-to-r from-[#161b22] via-[#1c2128] to-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/2 bottom-0 w-96 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Debian 13 (Trixie) Certified Automation Suite
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
              Dev Environment Manager Control Hub
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Fully editable, idempotent environment provisioning system managing {modules.length} package modules across {profiles.length} profiles with real-time execution logging and state persistence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onRunAction('install', 'server')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-950/40"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Provision Server Profile</span>
            </button>
            <button
              onClick={() => onNavigate('scripts')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] text-xs font-semibold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Script Studio</span>
            </button>
            <button
              onClick={() => onNavigate('terminal')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] text-xs font-semibold transition-all"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>CLI Terminal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real Metrics Gauge Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Target Platform OS</p>
              <h3 className="text-base font-bold text-slate-100 mt-1">Debian 13 (Trixie)</h3>
              <p className="text-[11px] text-emerald-400 font-mono mt-0.5">Linux 6.12 x86_64</p>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full bg-[#0d1117] h-1.5 rounded-full overflow-hidden border border-[#30363d]">
            <div className="bg-cyan-400 h-full w-full"></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Active Package Modules</p>
              <h3 className="text-base font-bold text-slate-100 mt-1">{verifiedCount + configuredCount} / {modules.length} Active</h3>
              <p className="text-[11px] text-emerald-400 font-mono mt-0.5">{activePercent}% Coverage Rate</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full bg-[#0d1117] h-1.5 rounded-full overflow-hidden border border-[#30363d]">
            <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${activePercent}%` }}></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">GPG Security & Keyrings</p>
              <h3 className="text-base font-bold text-slate-100 mt-1">signed-by Enabled</h3>
              <p className="text-[11px] text-amber-400 font-mono mt-0.5">/etc/apt/keyrings/</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full bg-[#0d1117] h-1.5 rounded-full overflow-hidden border border-[#30363d]">
            <div className="bg-amber-400 h-full w-full"></div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Hardware & Storage</p>
              <h3 className="text-base font-bold text-slate-100 mt-1">34.8 GB Free</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">CPU Load: 0.14 • 16GB RAM</p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full bg-[#0d1117] h-1.5 rounded-full overflow-hidden border border-[#30363d]">
            <div className="bg-purple-400 h-full w-3/4"></div>
          </div>
        </div>
      </div>

      {/* Profiles Selection & Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Box className="w-4 h-4 text-emerald-400" />
            Environment Profiles Suite
          </h3>
          <button
            onClick={() => onNavigate('profiles')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            Manage & Edit Profiles ({profiles.length}) <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profiles.map((prof) => (
            <div
              key={prof.id}
              className={`bg-[#161b22] border rounded-2xl p-5 flex flex-col justify-between space-y-4 relative transition-all shadow-lg ${
                prof.isInstalled
                  ? 'border-emerald-500/40 shadow-emerald-950/20'
                  : 'border-[#30363d] hover:border-slate-600'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    {prof.id}
                  </span>
                  {prof.isInstalled ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                      Installed
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#21262d] text-slate-400 border border-[#30363d]">
                      Available
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-100">{prof.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{prof.description}</p>
              </div>

              <div className="pt-3 border-t border-[#30363d] space-y-3">
                <div className="text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Target Node:</span> {prof.target}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onRunAction('install', prof.id)}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/30"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Install Stack
                  </button>
                  <button
                    onClick={() => onRunAction('verify', prof.id)}
                    className="py-2 px-3 bg-[#21262d] hover:bg-[#30363d] text-slate-300 border border-[#30363d] rounded-xl text-xs font-semibold transition-colors"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 12-Category Module Architectural Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            12-Category Package Architecture
          </h3>
          <span className="text-xs text-slate-400 font-mono">Decoupled Bash Execution Lifecycles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => {
            const catModules = modules.filter(m => m.category === cat.id);
            const verifiedCatModules = catModules.filter(m => m.status === 'verified').length;

            return (
              <div
                key={cat.id}
                onClick={() => onNavigate('profiles')}
                className="bg-[#161b22] border border-[#30363d] hover:border-emerald-500/50 rounded-2xl p-4 space-y-3 cursor-pointer transition-all group shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    Category #{cat.number}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {verifiedCatModules}/{catModules.length || 1} verified
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {cat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
