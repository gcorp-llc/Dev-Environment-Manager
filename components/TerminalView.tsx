'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, Copy, CornerDownLeft } from 'lucide-react';

interface TerminalViewProps {
  onExecuteCommand: (cmd: string, target?: string) => void;
}

export default function TerminalView({ onExecuteCommand }: TerminalViewProps) {
  const [inputCmd, setInputCmd] = useState('');
  const [history, setHistory] = useState<string[]>([
    'DEM v2.5.0 LTS Shell CLI Terminal [Debian 13 Trixie x86_64]',
    'Type "help" or "dem status" to view available CLI commands.',
    '----------------------------------------------------------------------',
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputCmd.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, `root@debian-trixie:~# ${trimmed}`]);
    setInputCmd('');

    const lower = trimmed.toLowerCase();

    if (lower === 'clear') {
      setHistory([]);
      return;
    }

    if (lower === 'help') {
      setHistory((prev) => [
        ...prev,
        'Available DEM Shell Commands:',
        '  dem status             - View system release & profile status',
        '  dem doctor             - Trigger system diagnostics audit',
        '  dem repair             - Normalize line endings & permissions',
        '  dem backup             - Generate system manifest backup',
        '  dem install <profile>  - Batch install specified profile',
        '  dem verify <module>    - Verify binary PATH & systemd service',
        '  version                - Print DEM version & kernel release',
        '  clear                  - Clear terminal screen',
      ]);
      return;
    }

    if (lower === 'version') {
      setHistory((prev) => [
        ...prev,
        'Dev Environment Manager v2.5.0 LTS (Built for Debian GNU/Linux 13 Trixie)',
      ]);
      return;
    }

    if (lower.startsWith('dem doctor')) {
      onExecuteCommand('doctor');
      return;
    }

    if (lower.startsWith('dem repair')) {
      onExecuteCommand('repair');
      return;
    }

    if (lower.startsWith('dem backup')) {
      onExecuteCommand('backup');
      return;
    }

    if (lower.startsWith('dem install')) {
      const parts = trimmed.split(' ');
      const profTarget = parts.slice(2).join(' ') || 'Minimal Dev Base';
      onExecuteCommand('install', profTarget);
      return;
    }

    if (lower.startsWith('dem status')) {
      setHistory((prev) => [
        ...prev,
        '[STATUS] System Target: Debian 13 (Trixie) 6.12.0-8-amd64',
        '[STATUS] Active Profiles: Minimal Dev Base (INSTALLED), Production Server (INSTALLED)',
        '[STATUS] Total Modules: 14 Registered / 12 Verified',
        '[STATUS] GPG Keyrings: 4 active in /etc/apt/keyrings/',
      ]);
      return;
    }

    // Default custom command execution via API engine
    onExecuteCommand('run_custom_script', trimmed);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363d] pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <TerminalIcon className="h-5 w-5 text-emerald-400" /> DEM Shell CLI Terminal
          </h2>
          <p className="text-xs text-slate-400">
            Interactive command line prompt connected directly to the DEM Linux Execution Host.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHistory([])}
            className="flex items-center gap-1.5 rounded-lg bg-[#21262d] px-3 py-1.5 text-xs font-medium text-slate-300 border border-[#30363d] hover:bg-[#30363d]"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Clear Screen
          </button>
        </div>
      </div>

      {/* Terminal View Window */}
      <div className="glass-panel rounded-xl overflow-hidden border border-[#30363d] flex flex-col h-[500px]">
        <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-2 text-slate-200">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            root@debian-trixie: /etc/dem
          </span>
          <span>bash 5.2.21</span>
        </div>

        {/* Console Log Output */}
        <div className="flex-1 p-4 overflow-y-auto terminal-bg font-mono text-xs leading-relaxed space-y-1 text-slate-200">
          {history.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap">
              {line.startsWith('root@debian-trixie:') ? (
                <span className="text-emerald-400 font-bold">{line}</span>
              ) : (
                <span className="text-slate-300">{line}</span>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Form */}
        <form onSubmit={handleCommandSubmit} className="bg-[#0d1117] px-4 py-3 border-t border-[#30363d] flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 font-bold shrink-0">root@debian-trixie:~#</span>
          <input
            type="text"
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            placeholder="Type 'help' or any shell script command..."
            className="flex-1 bg-transparent text-xs font-mono text-slate-100 focus:outline-none"
            autoFocus
          />
          <button type="submit" className="p-1 text-slate-400 hover:text-emerald-400">
            <CornerDownLeft className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
