'use client';

import React, { useState } from 'react';
import { PackageModule, Profile, CATEGORIES } from '@/lib/dem-data';
import { Play, CheckCircle2, ShieldCheck, Wrench, Trash2, Check, RefreshCw, Box, Filter, Plus, Edit3, Settings, AlertOctagon } from 'lucide-react';
import EditModuleModal from './EditModuleModal';
import EditProfileModal from './EditProfileModal';

interface ProfilesModulesViewProps {
  modules: PackageModule[];
  profiles: Profile[];
  onRunAction: (cmd: string, target?: string, moduleDetails?: PackageModule) => void;
  setModules: React.Dispatch<React.SetStateAction<PackageModule[]>>;
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
  onSaveModule: (module: PackageModule) => void;
  onDeleteModule: (moduleId: string) => void;
  onSaveProfile: (profile: Profile) => void;
  onDeleteProfile: (profileId: string) => void;
}

export default function ProfilesModulesView({
  modules,
  profiles,
  onRunAction,
  setModules,
  setProfiles,
  onSaveModule,
  onDeleteModule,
  onSaveProfile,
  onDeleteProfile
}: ProfilesModulesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<PackageModule | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const filteredModules = modules.filter(m => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.packages.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateModule = () => {
    setEditingModule(null);
    setIsModuleModalOpen(true);
  };

  const handleEditModule = (mod: PackageModule) => {
    setEditingModule(mod);
    setIsModuleModalOpen(true);
  };

  const handleCreateProfile = () => {
    setEditingProfile(null);
    setIsProfileModalOpen(true);
  };

  const handleEditProfile = (prof: Profile) => {
    setEditingProfile(prof);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Environment Profiles & Package Modules
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {modules.length} Modules Registered
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, and execute package modules with 4-phase Bash lifecycle scripts (install.sh, configure.sh, verify.sh, uninstall.sh).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCreateProfile}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>New Profile</span>
          </button>

          <button
            onClick={handleCreateModule}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Module</span>
          </button>
        </div>
      </div>

      {/* Profile Cards Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Registered Environment Stacks ({profiles.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profiles.map(prof => (
            <div key={prof.id} className="bg-[#161b22] border border-[#30363d] hover:border-slate-600 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">{prof.id}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditProfile(prof)}
                      title="Edit Profile"
                      className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-[#21262d] rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {profiles.length > 1 && (
                      <button
                        onClick={() => onDeleteProfile(prof.id)}
                        title="Delete Profile"
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#21262d] rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-100">{prof.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{prof.description}</p>

                <div className="text-[11px] font-mono text-slate-500 pt-1">
                  Target: {prof.target}
                </div>
              </div>

              <div className="pt-3 border-t border-[#30363d] flex items-center gap-2">
                <button
                  onClick={() => onRunAction('install', prof.id)}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-950/30"
                >
                  <Play className="w-3 h-3 fill-current" /> Install Profile
                </button>
                <button
                  onClick={() => onRunAction('uninstall', prof.id)}
                  className="py-2 px-3 bg-[#21262d] hover:bg-rose-950/40 text-rose-300 border border-[#30363d] hover:border-rose-900 rounded-xl text-xs font-semibold transition-colors"
                >
                  Uninstall
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Module Filters Bar */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter modules by name or APT package (e.g. Docker, PostgreSQL, Go, ScyllaDB)..."
              className="bg-[#0d1117] border border-[#30363d] text-slate-200 placeholder-slate-500 text-xs rounded-xl px-3 py-2 w-full focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#21262d] text-slate-400 border border-[#30363d] hover:text-slate-200'
              }`}
            >
              All Modules ({modules.length})
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#21262d] text-slate-400 border border-[#30363d] hover:text-slate-200'
                }`}
              >
                #{c.number} {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredModules.map(mod => {
            const isInstalled = mod.status === 'verified' || mod.status === 'configured';

            return (
              <div
                key={mod.id}
                className="bg-[#0d1117] border border-[#30363d] hover:border-slate-600 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative group transition-all shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {mod.category}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold ${
                        isInstalled
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-[#21262d] text-slate-400 border border-[#30363d]'
                      }`}>
                        {isInstalled ? <Check className="w-3 h-3" /> : null}
                        {mod.status.toUpperCase()}
                      </span>

                      <button
                        onClick={() => handleEditModule(mod)}
                        title="Edit Module"
                        className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-[#21262d] rounded-lg transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteModule(mod.id)}
                        title="Delete Module"
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-[#21262d] rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      {mod.name}
                      {mod.version && (
                        <span className="text-[10px] font-mono text-slate-400 bg-[#21262d] px-1.5 py-0.5 rounded-md border border-[#30363d]">
                          {mod.version}
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">{mod.description}</p>
                  </div>

                  {/* Included packages tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {mod.packages.map(p => (
                      <span key={p} className="text-[10px] font-mono bg-[#161b22] text-slate-300 border border-[#30363d] px-1.5 py-0.5 rounded-md">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#30363d] flex items-center justify-between gap-2 text-xs">
                  {mod.hasServices && (
                    <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                      systemd: {mod.serviceName}
                    </span>
                  )}

                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      onClick={() => onRunAction('verify_module', mod.id, mod)}
                      className="px-2.5 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-slate-200 rounded-xl border border-[#30363d] transition-colors text-[11px] font-semibold"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => onRunAction('uninstall_module', mod.id, mod)}
                      className="px-2.5 py-1.5 bg-[#21262d] hover:bg-rose-950/40 text-rose-300 rounded-xl border border-[#30363d] hover:border-rose-900 transition-colors text-[11px] font-semibold"
                    >
                      Purge
                    </button>
                    <button
                      onClick={() => onRunAction('install_module', mod.id, mod)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors text-[11px] shadow-sm"
                    >
                      Install
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Module Drawer Modal */}
      <EditModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        moduleToEdit={editingModule}
        onSave={onSaveModule}
      />

      {/* Edit Profile Drawer Modal */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profileToEdit={editingProfile}
        modules={modules}
        onSave={onSaveProfile}
      />
    </div>
  );
}
