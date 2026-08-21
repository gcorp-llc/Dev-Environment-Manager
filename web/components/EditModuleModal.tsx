'use client';

import React, { useState, useEffect } from 'react';
import { PackageModule, CATEGORIES } from '@/lib/dem-data';
import { X, Save, Plus, Trash2, Code2, Terminal, Server, Package } from 'lucide-react';

interface EditModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleToEdit: PackageModule | null;
  onSave: (module: PackageModule) => void;
}

export default function EditModuleModal({ isOpen, onClose, moduleToEdit, onSave }: EditModuleModalProps) {
  const [formData, setFormData] = useState<Partial<PackageModule>>({
    id: '',
    name: '',
    category: 'development',
    description: '',
    packages: [],
    status: 'configured',
    version: '',
    hasServices: false,
    serviceName: '',
    scripts: {
      install: '#!/usr/bin/env bash\napt-get update && apt-get install -y my-package',
      configure: '#!/usr/bin/env bash\necho "Configuring module..."',
      verify: '#!/usr/bin/env bash\ncommand -v my-package',
      uninstall: '#!/usr/bin/env bash\napt-get purge -y my-package'
    }
  });

  const [packageInput, setPackageInput] = useState('');
  const [activeScriptTab, setActiveScriptTab] = useState<'install' | 'configure' | 'verify' | 'uninstall'>('install');

  useEffect(() => {
    if (moduleToEdit) {
      setFormData({
        ...moduleToEdit,
        packages: [...moduleToEdit.packages],
        scripts: moduleToEdit.scripts ? { ...moduleToEdit.scripts } : {
          install: `#!/usr/bin/env bash\napt-get update && apt-get install -y ${moduleToEdit.packages.join(' ')}`,
          configure: '#!/usr/bin/env bash\necho "Configuring module..."',
          verify: `#!/usr/bin/env bash\ncommand -v ${moduleToEdit.packages[0] || 'pkg'}`,
          uninstall: `#!/usr/bin/env bash\napt-get purge -y ${moduleToEdit.packages.join(' ')}`
        }
      });
    } else {
      setFormData({
        id: `custom-module-${Date.now().toString().slice(-4)}`,
        name: 'New Custom Package Module',
        category: 'development',
        description: 'Custom package module description for Debian 13 environment.',
        packages: ['custom-tool'],
        status: 'configured',
        version: '1.0.0',
        hasServices: false,
        serviceName: '',
        scripts: {
          install: '#!/usr/bin/env bash\napt-get update && apt-get install -y custom-tool',
          configure: '#!/usr/bin/env bash\necho "Configuring custom-tool..."',
          verify: '#!/usr/bin/env bash\ncommand -v custom-tool',
          uninstall: '#!/usr/bin/env bash\napt-get purge -y custom-tool'
        }
      });
    }
  }, [moduleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddPackage = () => {
    if (!packageInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      packages: [...(prev.packages || []), packageInput.trim()]
    }));
    setPackageInput('');
  };

  const handleRemovePackage = (pkg: string) => {
    setFormData(prev => ({
      ...prev,
      packages: (prev.packages || []).filter(p => p !== pkg)
    }));
  };

  const handleScriptChange = (code: string) => {
    setFormData(prev => ({
      ...prev,
      scripts: {
        ...(prev.scripts || {}),
        [activeScriptTab]: code
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.id) return;
    onSave(formData as PackageModule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#30363d] bg-[#0d1117] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {moduleToEdit ? `Edit Module: ${moduleToEdit.name}` : 'Create New Package Module'}
              </h3>
              <p className="text-xs text-slate-400">Configure metadata, APT packages, and 4-script Bash lifecycles</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-[#21262d] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Module ID (Unique)</label>
              <input
                type="text"
                value={formData.id}
                onChange={e => setFormData({ ...formData, id: e.target.value })}
                required
                className="bg-[#0d1117] border border-[#30363d] text-slate-100 font-mono text-xs rounded-lg px-3 py-2 w-full focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Display Module Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-[#0d1117] border border-[#30363d] text-slate-100 text-xs rounded-lg px-3 py-2 w-full focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="bg-[#0d1117] border border-[#30363d] text-slate-100 text-xs rounded-lg px-3 py-2 w-full focus:outline-none focus:border-emerald-500 capitalize"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>
                    #{c.number} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Version String</label>
              <input
                type="text"
                value={formData.version || ''}
                placeholder="e.g. v2.4.0 or 1.22.5"
                onChange={e => setFormData({ ...formData, version: e.target.value })}
                className="bg-[#0d1117] border border-[#30363d] text-slate-100 text-xs rounded-lg px-3 py-2 w-full focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Status State</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="bg-[#0d1117] border border-[#30363d] text-slate-100 text-xs rounded-lg px-3 py-2 w-full focus:outline-none focus:border-emerald-500"
              >
                <option value="verified">Verified (Installed & Running)</option>
                <option value="configured">Configured (Installed)</option>
                <option value="uninstalled">Uninstalled</option>
                <option value="error">Error State</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="bg-[#0d1117] border border-[#30363d] text-slate-100 text-xs rounded-lg p-3 w-full focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Systemd Service Settings */}
          <div className="bg-[#0d1117] border border-[#30363d] p-3.5 rounded-xl space-y-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.hasServices || false}
                onChange={e => setFormData({ ...formData, hasServices: e.target.checked })}
                className="rounded border-[#30363d] text-emerald-500 focus:ring-0 bg-[#161b22]"
              />
              <span className="text-xs font-semibold text-slate-200">Includes Systemd Background Service</span>
            </label>

            {formData.hasServices && (
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Systemd Service Unit Name</label>
                <input
                  type="text"
                  value={formData.serviceName || ''}
                  onChange={e => setFormData({ ...formData, serviceName: e.target.value })}
                  placeholder="e.g. docker or postgresql"
                  className="bg-[#161b22] border border-[#30363d] text-slate-100 font-mono text-xs rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Packages List Editor */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">APT Packages List</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={packageInput}
                onChange={e => setPackageInput(e.target.value)}
                placeholder="Add package name e.g. htop..."
                className="bg-[#0d1117] border border-[#30363d] text-slate-100 font-mono text-xs rounded-lg px-3 py-1.5 flex-1 focus:outline-none focus:border-emerald-500"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPackage();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddPackage}
                className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2 bg-[#0d1117] border border-[#30363d] rounded-lg min-h-[42px]">
              {formData.packages?.map(pkg => (
                <span
                  key={pkg}
                  className="bg-[#161b22] border border-[#30363d] text-slate-300 font-mono text-xs px-2 py-1 rounded-md flex items-center gap-1.5"
                >
                  {pkg}
                  <button
                    type="button"
                    onClick={() => handleRemovePackage(pkg)}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 4-Script Lifecycle Code Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-400" />
                4-Script Lifecycle Execution Code
              </label>

              <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
                {(['install', 'configure', 'verify', 'uninstall'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveScriptTab(tab)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-md capitalize transition-colors ${
                      activeScriptTab === tab
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}.sh
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={formData.scripts?.[activeScriptTab] || ''}
              onChange={e => handleScriptChange(e.target.value)}
              rows={5}
              className="bg-[#090d13] border border-[#30363d] text-emerald-400 font-mono text-xs rounded-xl p-3 w-full focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all"
            >
              <Save className="w-4 h-4" /> Save Module Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
