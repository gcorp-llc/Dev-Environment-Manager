'use client';

import React, { useState, useEffect } from 'react';
import { PackageModule, CATEGORIES } from '@/lib/dem-data';
import { X, Save, Terminal, Code2, Layers, Server } from 'lucide-react';

interface EditModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: PackageModule | null;
  onSave: (module: PackageModule) => void;
}

export default function EditModuleModal({
  isOpen,
  onClose,
  module,
  onSave,
}: EditModuleModalProps) {
  const [formData, setFormData] = useState<Partial<PackageModule>>({
    id: '',
    name: '',
    category: 'core',
    description: '',
    packages: [],
    status: 'uninstalled',
    version: '1.0.0',
    hasServices: false,
    serviceName: '',
    scripts: { install: '', configure: '', verify: '', uninstall: '' },
  });

  const [packagesStr, setPackagesStr] = useState('');
  const [activeScriptTab, setActiveScriptTab] = useState<'install' | 'configure' | 'verify' | 'uninstall'>('install');

  useEffect(() => {
    if (module) {
      setFormData(module);
      setPackagesStr((module.packages || []).join(', '));
    } else {
      const newId = `mod-custom-${Date.now().toString().slice(-4)}`;
      setFormData({
        id: newId,
        name: '',
        category: 'core',
        description: '',
        packages: [],
        status: 'uninstalled',
        version: '1.0.0',
        hasServices: false,
        serviceName: '',
        scripts: {
          install: '#!/usr/bin/env bash\nset -euo pipefail\necho "Installing custom package..."',
          configure: '#!/usr/bin/env bash\necho "Configuring package..."',
          verify: '#!/usr/bin/env bash\nwhich custom-bin || exit 0',
          uninstall: '#!/usr/bin/env bash\necho "Uninstalling package..."',
        },
      });
      setPackagesStr('');
    }
  }, [module, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pkgs = packagesStr
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const finalModule: PackageModule = {
      id: formData.id || `mod-${Date.now()}`,
      name: formData.name || 'Custom Module',
      category: formData.category || 'core',
      description: formData.description || '',
      packages: pkgs,
      status: formData.status || 'uninstalled',
      version: formData.version || '1.0.0',
      hasServices: Boolean(formData.hasServices),
      serviceName: formData.serviceName || '',
      scripts: formData.scripts || {},
    };

    onSave(finalModule);
    onClose();
  };

  const handleScriptChange = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      scripts: {
        ...prev.scripts,
        [activeScriptTab]: code,
      },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-xl border border-[#30363d] bg-[#161b22] shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Layers className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-100">
              {module ? `Edit Module: ${module.name}` : 'Register New Package Module'}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 mb-1">Module ID</label>
              <input
                type="text"
                value={formData.id || ''}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full rounded-lg bg-[#0d1117] px-3 py-2 text-xs font-mono text-slate-200 border border-[#30363d] focus:border-emerald-500/60 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 mb-1">Module Display Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Node.js v22 LTS"
                className="w-full rounded-lg bg-[#0d1117] px-3 py-2 text-xs text-slate-200 border border-[#30363d] focus:border-emerald-500/60 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 mb-1">Category</label>
              <select
                value={formData.category || 'core'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg bg-[#0d1117] px-3 py-2 text-xs text-slate-200 border border-[#30363d] focus:border-emerald-500/60 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id.toUpperCase()} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 mb-1">Version String</label>
              <input
                type="text"
                value={formData.version || ''}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="e.g. 22.14.0"
                className="w-full rounded-lg bg-[#0d1117] px-3 py-2 text-xs font-mono text-slate-200 border border-[#30363d] focus:border-emerald-500/60 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-400 mb-1">APT Packages (comma separated)</label>
            <input
              type="text"
              value={packagesStr}
              onChange={(e) => setPackagesStr(e.target.value)}
              placeholder="build-essential, curl, git"
              className="w-full rounded-lg bg-[#0d1117] px-3 py-2 text-xs font-mono text-slate-200 border border-[#30363d] focus:border-emerald-500/60 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-400 mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the package module..."
              className="w-full rounded-lg bg-[#0d1117] px-3 py-2 text-xs text-slate-200 border border-[#30363d] focus:border-emerald-500/60 focus:outline-none"
            />
          </div>

          {/* Systemd Toggle */}
          <div className="flex items-center gap-4 bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(formData.hasServices)}
                onChange={(e) => setFormData({ ...formData, hasServices: e.target.checked })}
                className="rounded border-[#30363d] bg-[#161b22] text-emerald-500 focus:ring-0"
              />
              <span>Has Systemd Service Unit</span>
            </label>

            {formData.hasServices && (
              <div className="flex-1 flex items-center gap-2">
                <Server className="h-4 w-4 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  value={formData.serviceName || ''}
                  onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                  placeholder="Service name (e.g. docker, postgresql)"
                  className="w-full rounded-lg bg-[#161b22] px-3 py-1.5 text-xs font-mono text-slate-200 border border-[#30363d] focus:border-cyan-500/60 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* 4-Script Lifecycle Tabs */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-medium text-slate-400">4-Step Lifecycle Bash Scripts</label>
            <div className="flex border-b border-[#30363d]">
              {(['install', 'configure', 'verify', 'uninstall'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveScriptTab(tab)}
                  className={`px-4 py-2 text-xs font-mono font-semibold border-b-2 transition ${
                    activeScriptTab === tab
                      ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}.sh
                </button>
              ))}
            </div>

            <textarea
              rows={8}
              value={formData.scripts?.[activeScriptTab] || ''}
              onChange={(e) => handleScriptChange(e.target.value)}
              className="w-full rounded-lg bg-[#090d13] p-3 text-xs font-mono leading-relaxed text-emerald-300 border border-[#30363d] focus:border-emerald-500/60 focus:outline-none"
              placeholder={`#!/usr/bin/env bash\n# ${activeScriptTab}.sh script for module`}
            />
          </div>

          {/* Submit Footer */}
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
              <Save className="h-4 w-4" /> Save Module
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
