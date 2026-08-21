'use client';

import React, { useState } from 'react';
import { Archive, Download, Upload, Copy, Check, Plus, FileText, Server, Layers } from 'lucide-react';
import { CATEGORIES } from '@/lib/dem-data';

interface BackupViewProps {
  onRunAction: (cmd: string, target?: string) => void;
}

export default function BackupView({ onRunAction }: BackupViewProps) {
  const [profileName, setProfileName] = useState('custom-k8s-node');
  const [selectedCats, setSelectedCats] = useState<string[]>(['core', 'system', 'docker', 'tools']);
  const [copiedProfile, setCopiedProfile] = useState(false);

  const toggleCategory = (id: string) => {
    setSelectedCats(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const generatedProfileCode = `# Custom DEM Profile Manifest
# Name: ${profileName}
# Target OS: Debian 13 (Trixie)
# Created: ${new Date().toISOString().split('T')[0]}

${selectedCats.map(c => `package_${c}="installed"`).join('\n')}
`;

  const handleCopyProfile = () => {
    navigator.clipboard.writeText(generatedProfileCode);
    setCopiedProfile(true);
    setTimeout(() => setCopiedProfile(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Archive className="w-5 h-5 text-cyan-400" /> System Backup & Custom Profile Builder
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Archive system configuration state, APT keyrings under <code className="text-emerald-400 font-mono">/etc/apt/keyrings/</code>, or declare custom <code className="text-cyan-400 font-mono">.profile</code> files for custom Debian 13 node deployments.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onRunAction('backup')}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg shadow-md shadow-cyan-950/40 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Trigger System Backup
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Custom Profile Generator */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" /> Declarative Profile Builder
            </h3>
            <span className="text-[10px] font-mono text-slate-400">profiles/*.profile</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Profile Name Identifier</label>
              <input
                type="text"
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                className="bg-[#0d1117] border border-[#30363d] text-slate-100 text-xs rounded-lg px-3 py-2 w-full focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-2">Select Included Module Categories</label>
              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {CATEGORIES.map(cat => {
                  const isChecked = selectedCats.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between text-xs transition-colors ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-[#0d1117] border-[#30363d] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-medium text-[11px]">#{cat.number} {cat.name}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Code Manifest Preview */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">Manifest Preview</h3>
            </div>

            <button
              onClick={handleCopyProfile}
              className="flex items-center gap-1.5 text-xs text-slate-300 bg-[#21262d] hover:bg-[#30363d] px-2.5 py-1 rounded-md border border-[#30363d] transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              {copiedProfile ? 'Copied!' : 'Copy Code'}
            </button>
          </div>

          <pre className="bg-[#090d13] border border-[#30363d] rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-x-auto flex-1 min-h-[220px]">
            {generatedProfileCode}
          </pre>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <span>File destination: <code className="text-slate-200 font-mono">profiles/{profileName}.profile</code></span>
            <button
              onClick={() => onRunAction('install', profileName)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold text-xs transition-colors"
            >
              Save & Test Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
