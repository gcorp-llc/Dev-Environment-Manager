'use client';

import React, { useState } from 'react';
import { CATEGORIES, PackageModule, Profile } from '@/lib/dem-data';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Play, 
  CheckCircle2, 
  Server, 
  Terminal, 
  Layers, 
  Boxes,
  Code
} from 'lucide-react';

interface ProfilesModulesViewProps {
  modules: PackageModule[];
  profiles: Profile[];
  onRunCommand: (command: string, target?: string, extraData?: any) => void;
  onEditModule: (mod: PackageModule | null) => void;
  onDeleteModule: (modId: string) => void;
  onEditProfile: (prof: Profile | null) => void;
  onDeleteProfile: (profId: string) => void;
  onOpenScriptEditor: (modId: string) => void;
}

export default function ProfilesModulesView({
  modules,
  profiles,
  onRunCommand,
  onEditModule,
  onDeleteModule,
  onEditProfile,
  onDeleteProfile,
  onOpenScriptEditor,
}: ProfilesModulesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredModules = modules.filter((m) => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.packages.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363d] pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Boxes className="h-5 w-5 text-emerald-400" /> Profiles & Package Modules Suite
          </h2>
          <p className="text-xs text-slate-400">
            Manage Debian 13 software packages, systemd unit definitions, 4-phase Bash lifecycle scripts, and environment profile stacks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditProfile(null)}
            className="flex items-center gap-1.5 rounded-lg bg-[#21262d] px-3 py-2 text-xs font-semibold text-slate-200 border border-[#30363d] hover:bg-[#30363d] transition"
          >
            <Plus className="h-4 w-4" /> New Profile
          </button>

          <button
            onClick={() => onEditModule(null)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition glow-emerald"
          >
            <Plus className="h-4 w-4" /> Add Module
          </button>
        </div>
      </div>

      {/* Profiles Stacks Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-emerald-400">
          Environment Profiles Stacks ({profiles.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {profiles.map((prof) => (
            <div key={prof.id} className="glass-panel rounded-xl p-4 flex flex-col justify-between gap-3 border border-[#30363d]">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-100 truncate">{prof.name}</h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditProfile(prof)}
                      title="Edit Profile"
                      className="p-1 text-slate-400 hover:text-slate-200"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProfile(prof.id)}
                      title="Delete Profile"
                      className="p-1 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{prof.description}</p>
                <div className="text-[10px] font-mono text-cyan-400">
                  Target: {prof.target}
                </div>
              </div>

              <div className="pt-2 border-t border-[#30363d] flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">{prof.modules.length} Cats</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRunCommand('verify', prof.name, prof)}
                    className="px-2 py-1 rounded bg-[#21262d] text-[11px] font-medium text-slate-300 border border-[#30363d] hover:bg-[#30363d]"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => onRunCommand('install', prof.name, prof)}
                    className="px-2 py-1 rounded bg-emerald-500/20 text-[11px] font-medium text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 flex items-center gap-1"
                  >
                    <Play className="h-3 w-3 fill-emerald-400" /> Install
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filterable Search & Categories Bar */}
      <div className="space-y-4 pt-4 border-t border-[#30363d]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modules by name, description, or APT package..."
              className="w-full rounded-xl bg-[#0d1117] pl-9 pr-4 py-2 text-xs text-slate-200 border border-[#30363d] focus:border-emerald-500/60 focus:outline-none"
            />
          </div>

          <div className="text-xs font-mono text-slate-400">
            Showing <span className="text-slate-100 font-bold">{filteredModules.length}</span> of {modules.length} modules
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'bg-[#161b22] text-slate-400 border border-[#30363d] hover:bg-[#1c2128]'
            }`}
          >
            ALL CATEGORIES
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-[#161b22] text-slate-400 border border-[#30363d] hover:bg-[#1c2128]'
              }`}
            >
              {cat.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Package Modules Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((mod) => (
          <div key={mod.id} className="glass-panel glass-panel-hover rounded-xl p-5 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              {/* Card Top Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {mod.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-100 mt-1">{mod.name}</h4>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                    mod.status === 'verified'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : mod.status === 'installed' || mod.status === 'configured'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                  }`}
                >
                  {mod.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{mod.description}</p>

              {/* Package Chips */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-400">APT Packages:</div>
                <div className="flex flex-wrap gap-1">
                  {(mod.packages || []).map((pkg) => (
                    <span
                      key={pkg}
                      className="text-[10px] font-mono bg-[#0d1117] px-1.5 py-0.5 rounded text-slate-300 border border-[#30363d]"
                    >
                      {pkg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Systemd Service Badge */}
              {mod.hasServices && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                  <Server className="h-3 w-3 shrink-0" />
                  <span>systemd unit: {mod.serviceName}.service</span>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onOpenScriptEditor(mod.id)}
                  title="Open in Script Studio"
                  className="p-1.5 rounded bg-[#21262d] text-slate-300 hover:text-emerald-400 border border-[#30363d] transition"
                >
                  <Code className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onEditModule(mod)}
                  title="Edit Module Metadata"
                  className="p-1.5 rounded bg-[#21262d] text-slate-300 hover:text-slate-100 border border-[#30363d] transition"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDeleteModule(mod.id)}
                  title="Delete Module"
                  className="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onRunCommand('verify_module', mod.name, mod)}
                  className="px-2.5 py-1 rounded bg-[#21262d] text-xs font-medium text-slate-300 border border-[#30363d] hover:bg-[#30363d] transition"
                >
                  Verify
                </button>
                <button
                  onClick={() => onRunCommand('install_module', mod.name, mod)}
                  className="px-2.5 py-1 rounded bg-emerald-500/20 text-xs font-medium text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition flex items-center gap-1"
                >
                  <Play className="h-3 w-3 fill-emerald-400" /> Install
                </button>
                <button
                  onClick={() => onRunCommand('uninstall_module', mod.name, mod)}
                  title="Purge Package Module"
                  className="px-2 py-1 rounded bg-rose-500/10 text-xs font-medium text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition"
                >
                  Purge
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
