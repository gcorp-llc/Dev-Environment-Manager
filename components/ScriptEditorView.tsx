'use client';

import React, { useState, useEffect } from 'react';
import { PackageModule } from '@/lib/dem-data';
import { 
  Code2, 
  Terminal, 
  Play, 
  Copy, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  FileCode,
  Layers
} from 'lucide-react';

interface ScriptEditorViewProps {
  modules: PackageModule[];
  initialModuleId?: string;
  onSaveModuleScript: (moduleId: string, scripts: PackageModule['scripts']) => void;
  onRunCustomScript: (script: string) => void;
}

export default function ScriptEditorView({
  modules,
  initialModuleId,
  onSaveModuleScript,
  onRunCustomScript,
}: ScriptEditorViewProps) {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    initialModuleId || modules[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'install' | 'configure' | 'verify' | 'uninstall'>('install');

  const selectedModule = modules.find((m) => m.id === selectedModuleId) || modules[0];

  const [scripts, setScripts] = useState<PackageModule['scripts']>({
    install: '',
    configure: '',
    verify: '',
    uninstall: '',
  });

  useEffect(() => {
    if (selectedModule) {
      setScripts(
        selectedModule.scripts || {
          install: '#!/usr/bin/env bash\nset -euo pipefail\necho "Installing package..."',
          configure: '#!/usr/bin/env bash\necho "Configuring package..."',
          verify: '#!/usr/bin/env bash\nwhich binary',
          uninstall: '#!/usr/bin/env bash\necho "Uninstalling package..."',
        }
      );
    }
  }, [selectedModuleId, modules]);

  const currentCode = scripts[activeTab] || '';

  const handleCodeChange = (newCode: string) => {
    setScripts((prev) => ({
      ...prev,
      [activeTab]: newCode,
    }));
  };

  const handleSave = () => {
    if (!selectedModule) return;
    onSaveModuleScript(selectedModule.id, scripts);
    alert(`Saved updated scripts for module: ${selectedModule.name}`);
  };

  const handleReset = () => {
    if (selectedModule) {
      setScripts(selectedModule.scripts || {});
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    alert('Bash script copied to clipboard.');
  };

  const lineCount = currentCode.split('\n').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363d] pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-emerald-400" /> Interactive Bash Script Studio
          </h2>
          <p className="text-xs text-slate-400">
            Inspect, edit, test, and execute 4-step Bash lifecycle scripts (`install.sh`, `configure.sh`, `verify.sh`, `uninstall.sh`).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg bg-[#21262d] px-3 py-2 text-xs font-medium text-slate-300 border border-[#30363d] hover:bg-[#30363d] transition"
          >
            <Copy className="h-3.5 w-3.5" /> Copy Code
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg bg-[#21262d] px-3 py-2 text-xs font-medium text-slate-300 border border-[#30363d] hover:bg-[#30363d] transition"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-[#21262d] px-3 py-2 text-xs font-semibold text-emerald-400 border border-emerald-500/40 hover:bg-[#30363d] transition"
          >
            <Save className="h-3.5 w-3.5" /> Save Script
          </button>
          <button
            onClick={() => onRunCustomScript(currentCode)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition glow-emerald"
          >
            <Play className="h-4 w-4 fill-slate-950" /> Execute Script
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Module Selector */}
        <div className="glass-panel rounded-xl p-4 space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-400" /> Module Registry ({modules.length})
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setSelectedModuleId(mod.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition flex flex-col gap-1 ${
                  selectedModuleId === mod.id
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 font-semibold'
                    : 'bg-[#161b22] text-slate-300 border border-[#30363d] hover:bg-[#1c2128]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{mod.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0d1117] text-slate-400 uppercase">
                    {mod.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Code Editor Panel */}
        <div className="lg:col-span-3 glass-panel rounded-xl overflow-hidden border border-[#30363d] flex flex-col">
          {/* Tab Header */}
          <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117] px-4 py-2">
            <div className="flex items-center gap-1">
              {(['install', 'configure', 'verify', 'uninstall'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-t-lg transition flex items-center gap-1.5 ${
                    activeTab === tab
                      ? 'bg-[#161b22] text-emerald-400 border-t-2 border-emerald-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  {tab}.sh
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-slate-400">
              Module: <span className="text-slate-100 font-bold">{selectedModule?.name}</span>
            </div>
          </div>

          {/* Editor Container with Line Numbers */}
          <div className="flex-1 min-h-[420px] bg-[#090d13] p-4 flex font-mono text-xs leading-relaxed overflow-x-auto">
            {/* Line Numbers Column */}
            <div className="select-none text-slate-600 text-right pr-4 border-r border-[#30363d]/50 space-y-1">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code Input Area */}
            <textarea
              value={currentCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="flex-1 bg-transparent pl-4 text-emerald-300 focus:outline-none resize-none font-mono text-xs leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Editor Footer */}
          <div className="border-t border-[#30363d] bg-[#0d1117] px-4 py-2 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Bash Shell (set -euo pipefail)</span>
            <span>Lines: {lineCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
