'use client';

import React, { useState } from 'react';
import { PackageModule } from '@/lib/dem-data';
import { Code2, Play, Save, Terminal, FileCode, CheckCircle2, RotateCcw, Copy, Check } from 'lucide-react';

interface ScriptEditorViewProps {
  modules: PackageModule[];
  onUpdateModule: (updatedModule: PackageModule) => void;
  onRunScript: (scriptCode: string, scriptName: string) => void;
}

export default function ScriptEditorView({ modules, onUpdateModule, onRunScript }: ScriptEditorViewProps) {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0]?.id || 'core');
  const [activePhase, setActivePhase] = useState<'install' | 'configure' | 'verify' | 'uninstall'>('install');
  
  const currentModule = modules.find(m => m.id === selectedModuleId) || modules[0];
  
  const defaultScriptMap = {
    install: currentModule?.scripts?.install || `#!/usr/bin/env bash\n# Install script for ${currentModule?.name}\nset -euo pipefail\napt-get update\napt-get install -y ${currentModule?.packages?.join(' ') || ''}`,
    configure: currentModule?.scripts?.configure || `#!/usr/bin/env bash\n# Configure script for ${currentModule?.name}\necho "Applying configuration..."`,
    verify: currentModule?.scripts?.verify || `#!/usr/bin/env bash\n# Verification test script\ncommand -v ${currentModule?.packages?.[0] || 'git'}`,
    uninstall: currentModule?.scripts?.uninstall || `#!/usr/bin/env bash\n# Uninstallation script\napt-get purge -y ${currentModule?.packages?.join(' ') || ''}`
  };

  const [code, setCode] = useState<string>(defaultScriptMap[activePhase]);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleModuleChange = (modId: string) => {
    setSelectedModuleId(modId);
    const mod = modules.find(m => m.id === modId);
    if (mod) {
      const script = mod.scripts?.[activePhase] || `#!/usr/bin/env bash\n# Script for ${mod.name}\nset -euo pipefail`;
      setCode(script);
    }
  };

  const handlePhaseChange = (phase: 'install' | 'configure' | 'verify' | 'uninstall') => {
    setActivePhase(phase);
    if (currentModule) {
      const script = currentModule.scripts?.[phase] || defaultScriptMap[phase];
      setCode(script);
    }
  };

  const handleSave = () => {
    if (!currentModule) return;
    const updatedScripts = {
      ...(currentModule.scripts || {}),
      [activePhase]: code
    };
    const updatedModule: PackageModule = {
      ...currentModule,
      scripts: updatedScripts
    };
    onUpdateModule(updatedModule);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(defaultScriptMap[activePhase]);
  };

  return (
    <div className="space-[#161b22] space-y-6">
      {/* Top Banner */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Interactive Bash Script Studio
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Debian 13 Native
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Inspect, modify, and test run individual Bash scripts for any module in real-time.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>

          <button
            onClick={handleReset}
            className="px-3.5 py-2 bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/30 transition-all"
          >
            {savedSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {savedSuccess ? 'Saved!' : 'Save Script'}
          </button>

          <button
            onClick={() => onRunScript(code, `${currentModule?.id}_${activePhase}.sh`)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-950/30 transition-all"
          >
            <Play className="w-4 h-4 fill-current" /> Execute Script
          </button>
        </div>
      </div>

      {/* Main Studio Editor Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Module Sidebar Selector */}
        <div className="lg:col-span-1 bg-[#161b22] border border-[#30363d] rounded-2xl p-4 space-y-3 flex flex-col max-h-[600px] overflow-hidden">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-2 flex items-center justify-between">
            <span>Package Modules</span>
            <span className="text-slate-500 font-mono">({modules.length})</span>
          </h3>

          <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
            {modules.map(mod => {
              const isSelected = mod.id === selectedModuleId;
              return (
                <button
                  key={mod.id}
                  onClick={() => handleModuleChange(mod.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-medium'
                      : 'bg-[#0d1117] border-[#30363d] text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200">{mod.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{mod.category}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 truncate">
                    {mod.packages.join(' ')}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Editor Window */}
        <div className="lg:col-span-3 bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden flex flex-col">
          {/* Script Phase Tabs Header */}
          <div className="bg-[#0d1117] border-b border-[#30363d] px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-slate-200 font-semibold">
                {currentModule?.id}/{activePhase}.sh
              </span>
            </div>

            <div className="flex items-center gap-1 bg-[#161b22] p-1 rounded-xl border border-[#30363d]">
              {(['install', 'configure', 'verify', 'uninstall'] as const).map(phase => (
                <button
                  key={phase}
                  onClick={() => handlePhaseChange(phase)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg capitalize transition-all ${
                    activePhase === phase
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {phase}.sh
                </button>
              ))}
            </div>
          </div>

          {/* Code Textarea Editor */}
          <div className="p-4 bg-[#090d13] flex-1 relative min-h-[420px]">
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full min-h-[400px] bg-transparent text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none resize-none p-2"
            />
          </div>

          {/* Footer Info Bar */}
          <div className="px-4 py-2.5 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <div>Lines: {code.split('\n').length} | Syntax: Bash Shell Script</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Ready to execute
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
