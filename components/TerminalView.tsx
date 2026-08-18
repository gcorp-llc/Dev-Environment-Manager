'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, Copy, Play, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

interface TerminalViewProps {
  onRunAction: (cmd: string, target?: string) => void;
}

export default function TerminalView({ onRunAction }: TerminalViewProps) {
  const [inputVal, setInputVal] = useState<string>('./dem.sh doctor');
  const [history, setHistory] = useState<Array<{ cmd: string; time: string; output: string[] }>>([
    {
      cmd: './dem.sh status',
      time: '10:42:15 AM',
      output: [
        'Dev Environment Manager (DEM) v2.4.0 Status Report',
        'Target System: Debian GNU/Linux 13 (Trixie) x86_64',
        '------------------------------------------------',
        '[CORE] build-essential, git, curl, gnupg - VERIFIED',
        '[DOCKER] docker-ce.service - ACTIVE (running)',
        '[LANGUAGES] Node.js 22.13.0, Go 1.22.5, Rust 1.80.0 - VERIFIED',
        '[DATABASES] PostgreSQL 16 (port 5432) - LISTENING',
        '[DATABASES] ScyllaDB NoSQL Engine - ACTIVE (AVX2 confirmed)',
        '[TOOLS] kubectl, terraform, helm, gh - INSTALLED',
        '------------------------------------------------',
        'System status clean. 0 broken dependencies.'
      ]
    }
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleRunCommand = (cmdStr: string) => {
    const cleanCmd = cmdStr.trim();
    if (!cleanCmd) return;

    const timestamp = new Date().toLocaleTimeString();
    let outputLines: string[] = [];

    if (cleanCmd.includes('doctor')) {
      outputLines = [
        '[DEM DOCTOR] Inspecting system state...',
        '✓ Debian 13 release check passed',
        '✓ Dpkg lock test passed',
        '✓ /etc/apt/keyrings signed-by integrity passed',
        '✓ Systemd PID 1 bus active',
        '✓ AVX2 SIMD CPU flags detected',
        'Doctor check completed. 0 errors.'
      ];
    } else if (cleanCmd.includes('install')) {
      const parts = cleanCmd.split(' ');
      const prof = parts[2] || 'server';
      outputLines = [
        `[DEM INSTALL] Installing profile '${prof}'...`,
        'Executing install.sh -> configure.sh -> verify.sh sequential chain...',
        'APT updating indexes...',
        'Importing GPG keyrings into /etc/apt/keyrings/...',
        'Enabling systemd service units...',
        `[SUCCESS] Profile '${prof}' installed cleanly.`
      ];
    } else if (cleanCmd.includes('verify')) {
      outputLines = [
        '[DEM VERIFY] Running module verification suite...',
        'Node.js v22.13.0 - PASS',
        'Go v1.22.5 - PASS',
        'Docker Engine - PASS',
        'PostgreSQL 16 - PASS',
        'All verification tests passed.'
      ];
    } else if (cleanCmd.includes('repair')) {
      outputLines = [
        '[DEM REPAIR] Normalizing workspace...',
        'Converting CRLF line endings -> LF across bash scripts...',
        'Setting chmod +x execution permissions on all scripts...',
        'Clearing interrupted dpkg locks...',
        'Workspace repair complete.'
      ];
    } else if (cleanCmd.includes('backup')) {
      outputLines = [
        '[DEM BACKUP] Backing up system configuration...',
        'Creating archive under /var/backups/dem_backup.tar.gz...',
        'Backup created successfully (2.4 MB).'
      ];
    } else {
      outputLines = [
        `[DEM CLI] Executing: ${cleanCmd}`,
        'Operation finished. Exit status: 0'
      ];
    }

    setHistory(prev => [...prev, { cmd: cleanCmd, time: timestamp, output: outputLines }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRunCommand(inputVal);
  };

  const presets = [
    './dem.sh doctor',
    './dem.sh status',
    './dem.sh install desktop',
    './dem.sh verify server',
    './dem.sh repair',
    './dem.sh backup'
  ];

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161b22] border border-[#30363d] p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">DEM CLI Shell Simulator</h2>
            <p className="text-xs text-slate-400">Interactive execution console for dem.sh entrypoint controller</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHistory([])}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-slate-300 border border-[#30363d] rounded-lg text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Terminal
          </button>
        </div>
      </div>

      {/* Preset Command Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-slate-400 font-mono shrink-0">Quick Presets:</span>
        {presets.map(p => (
          <button
            key={p}
            onClick={() => {
              setInputVal(p);
              handleRunCommand(p);
            }}
            className="px-2.5 py-1 bg-[#161b22] hover:bg-[#21262d] text-emerald-400 border border-[#30363d] hover:border-emerald-500/40 rounded-lg text-xs font-mono shrink-0 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Terminal Screen */}
      <div className="bg-[#090d13] border border-[#30363d] rounded-xl overflow-hidden font-mono text-xs shadow-2xl flex flex-col h-[520px]">
        {/* Terminal Window Header */}
        <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="ml-2 text-slate-400 text-[11px]">root@debian13-trixie: ~/dem#</span>
          </div>

          <span className="text-slate-500 text-[11px]">bash 5.2.21</span>
        </div>

        {/* Console output buffer */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-emerald-400 font-bold">root@debian13:~/dem#</span>
                <span className="text-slate-100 font-semibold">{item.cmd}</span>
                <span className="ml-auto text-[10px] text-slate-600">{item.time}</span>
              </div>

              <div className="pl-4 border-l-2 border-[#30363d] space-y-0.5 text-slate-300">
                {item.output.map((outLine, lineIdx) => (
                  <div key={lineIdx} className={
                    outLine.includes('[SUCCESS]') || outLine.includes('✓')
                      ? 'text-emerald-400 font-medium'
                      : outLine.includes('[WARN]')
                      ? 'text-amber-300'
                      : 'text-slate-300'
                  }>
                    {outLine}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Prompt Form */}
        <form onSubmit={handleSubmit} className="p-3 bg-[#0d1117] border-t border-[#30363d] flex items-center gap-2">
          <span className="text-emerald-400 font-bold shrink-0">root@debian13:~/dem#</span>
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Type command e.g. ./dem.sh doctor, ./dem.sh install server..."
            className="flex-1 bg-transparent border-none text-slate-100 font-mono text-xs focus:outline-none placeholder-slate-600"
          />
          <button
            type="submit"
            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
