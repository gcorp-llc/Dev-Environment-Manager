'use client';

import React, { useState, useEffect } from 'react';
import { Profile, CATEGORIES } from '@/lib/dem-data';
import { X, Save, Boxes } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onSave: (profile: Profile) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<Partial<Profile>>({
    id: '',
    name: '',
    description: '',
    target: 'Debian 13 Cloud VPS',
    modules: [],
    isInstalled: false,
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    } else {
      setFormData({
        id: `prof-custom-${Date.now().toString().slice(-4)}`,
        name: '',
        description: '',
        target: 'Debian 13 Cloud VPS',
        modules: ['core', 'system', 'development'],
        isInstalled: false,
      });
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const toggleCategory = (catId: string) => {
    const current = formData.modules || [];
    if (current.includes(catId)) {
      setFormData({ ...formData, modules: current.filter((c) => c !== catId) });
    } else {
      setFormData({ ...formData, modules: [...current, catId] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProfile: Profile = {
      id: formData.id || `prof-${Date.now()}`,
      name: formData.name || 'Custom Profile Stack',
      description: formData.description || '',
      target: formData.target || 'Debian 13 Cloud VPS',
      modules: formData.modules || [],
      isInstalled: Boolean(formData.isInstalled),
    };
    onSave(finalProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-xl border border-[#30363d] bg-[#161b22] shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Boxes className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-100">
              {profile ? `Edit Profile: ${profile.name}` : 'Create Environment Profile Stack'}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 mb-1">Profile Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Backend Microservice VPS"
                className="w-full rounded-lg bg-[#0d1117] px-3 py-2 text-xs text-slate-200 border border-[#30363d] focus:border-emerald-500/60 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 mb-1">OS Target Platform</label>
              <input
                type="text"
                value={formData.target || ''}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                placeholder="e.g. Debian 13 Cloud VPS (x86_64)"
                className="w-full rounded-lg bg-[#0d1117] px-3 py-2 text-xs text-slate-200 border border-[#30363d] focus:border-emerald-500/60 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-400 mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Target workflow and software stack summary..."
              className="w-full rounded-lg bg-[#0d1117] px-3 py-2 text-xs text-slate-200 border border-[#30363d] focus:border-emerald-500/60 focus:outline-none"
            />
          </div>

          {/* Categories Selector */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-400 mb-2">Included Module Categories</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-[#0d1117] rounded-lg border border-[#30363d]">
              {CATEGORIES.map((cat) => {
                const isSelected = (formData.modules || []).includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-2 p-2 rounded text-xs font-mono text-left transition ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-[#161b22] text-slate-400 border border-[#30363d] hover:bg-[#1c2128]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="rounded text-emerald-500 bg-[#0d1117] border-[#30363d]"
                    />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#30363d]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#21262d] text-xs font-medium text-slate-300 border border-[#30363d] hover:bg-[#30363d] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition glow-emerald"
            >
              <Save className="h-4 w-4" /> Save Profile Stack
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
