'use client';

import React, { useState, useEffect } from 'react';
import { Profile, PackageModule } from '@/lib/dem-data';
import { X, Save, Layers, Check, Box } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileToEdit: Profile | null;
  modules: PackageModule[];
  onSave: (profile: Profile) => void;
}

export default function EditProfileModal({ isOpen, onClose, profileToEdit, modules, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState<Partial<Profile>>({
    id: '',
    name: '',
    description: '',
    target: '',
    modules: [],
    isInstalled: false,
  });

  useEffect(() => {
    if (profileToEdit) {
      setFormData({
        ...profileToEdit,
        modules: [...profileToEdit.modules]
      });
    } else {
      setFormData({
        id: `profile-${Date.now().toString().slice(-4)}`,
        name: 'New Custom Profile',
        description: 'Custom profile tailored for specific deployment nodes.',
        target: 'Debian 13 (Trixie) Node',
        modules: ['core', 'system', 'docker'],
        isInstalled: false,
      });
    }
  }, [profileToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleModuleInProfile = (modId: string) => {
    setFormData(prev => {
      const current = prev.modules || [];
      const updated = current.includes(modId)
        ? current.filter(m => m !== modId)
        : [...current, modId];
      return { ...prev, modules: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.id) return;
    onSave(formData as Profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#30363d] bg-[#0d1117] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {profileToEdit ? `Edit Profile: ${profileToEdit.name}` : 'Create Custom Environment Profile'}
              </h3>
              <p className="text-xs text-slate-400">Define targeted package module stacks and node metadata</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-[#21262d] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Profile Identifier (ID)</label>
              <input
                type="text"
                value={formData.id}
                onChange={e => setFormData({ ...formData, id: e.target.value })}
                required
                className="bg-[#0d1117] border border-[#30363d] text-slate-100 font-mono text-xs rounded-lg px-3 py-2 w-full focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Profile Display Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-[#0d1117] border border-[#30363d] text-slate-100 text-xs rounded-lg px-3 py-2 w-full focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Target Infrastructure Description</label>
            <input
              type="text"
              value={formData.target}
              onChange={e => setFormData({ ...formData, target: e.target.value })}
              placeholder="e.g. Debian 13 Cloud VPS / K8s Worker"
              className="bg-[#0d1117] border border-[#30363d] text-slate-100 text-xs rounded-lg px-3 py-2 w-full focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Profile Overview Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="bg-[#0d1117] border border-[#30363d] text-slate-100 text-xs rounded-lg p-3 w-full focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Included Modules Checklist */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Select Included Package Modules ({formData.modules?.length || 0} selected)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 border border-[#30363d] bg-[#0d1117] rounded-xl">
              {modules.map(mod => {
                const isSelected = formData.modules?.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    onClick={() => toggleModuleInProfile(mod.id)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200'
                        : 'bg-[#161b22] border-[#30363d] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-200">{mod.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Category: {mod.category}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#30363d] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-slate-300 rounded-xl text-xs font-medium border border-[#30363d] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-950/40 transition-all"
            >
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
