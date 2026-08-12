'use client';

import React, { useEffect, useRef } from 'react';
import { 
  Terminal, 
  X, 
  Copy, 
  Download, 
  Square, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2 
} from 'lucide-react';

interface ConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  logs: string[];
  isRunning: boolean;
  onStop?: () => void;
}

export default function ConsoleModal({
  isOpen,
  onClose,
  title = 'DEM Shell CLI Execution Stream',
  logs,
  isRunning,
  onStop,
}: ConsoleModalProps) {
  const logEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    alert('Execution logs copied to clipboard.');
  };

  const handleDownloadLogs = () => {
    const blob = new Blob([logs.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dem-execution-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const colorizeLogLine = (line: string) => {
    if (line.includes('[SUCCESS]')) {
      return <span className="text-emerald-400 font-semibold">{line}</span>;
    }
    if (line.includes('[EXEC]') || line.includes('[APT]')) {
      return <span className="text-cyan-400 font-mono">{line}</span>;
    }
    if (line.includes('[GPG]') || line.includes('[SERVICE]')) {
      return <span className="text-purple-400 font-mono">{line}</span>;
    }
    if (line.includes('[STEP]') || line.includes('[BATCH]')) {
      return <span className="text-amber-400 font-bold">{line}</span>;
    }
    if (line.includes('[WARN]')) {
      return <span className="text-amber-300 font-semibold">{line}</span>;
    }
    if (line.includes('[ERROR]') || line.includes('[FAIL]')) {
      return <span className="text-rose-400 font-bold">{line}</span>;
    }
    return <span className="text-slate-300 font-mono">{line}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-4xl rounded-xl border border-[#30363d] bg-[#090d13] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">{title}</h3>
              <p className="text-[11px] text-slate-400 font-mono">Debian 13 (Trixie) System Execution Host</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isRunning ? (
              <span className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-mono text-amber-400 border border-amber-500/30">
                <Loader2 className="h-3 w-3 animate-spin" /> RUNNING...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-mono text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-3 w-3" /> EXIT 0 (OK)
              </span>
            )}

            <button
              onClick={handleCopyLogs}
              title="Copy log to clipboard"
              className="rounded-lg bg-[#21262d] p-1.5 text-slate-300 border border-[#30363d] hover:bg-[#30363d] transition"
            >
              <Copy className="h-4 w-4" />
            </button>

            <button
              onClick={handleDownloadLogs}
              title="Download log file (.log)"
              className="rounded-lg bg-[#21262d] p-1.5 text-slate-300 border border-[#30363d] hover:bg-[#30363d] transition"
            >
              <Download className="h-4 w-4" />
            </button>

            {isRunning && onStop && (
              <button
                onClick={onStop}
                title="Cancel execution"
                className="flex items-center gap-1 rounded-lg bg-rose-500/20 px-2.5 py-1 text-xs font-medium text-rose-400 border border-rose-500/40 hover:bg-rose-500/30 transition"
              >
                <Square className="h-3.5 w-3.5 fill-rose-400" /> Stop
              </button>
            )}

            <button
              onClick={onClose}
              disabled={isRunning}
              className="rounded-lg bg-[#21262d] p-1.5 text-slate-400 hover:text-slate-100 disabled:opacity-40 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Terminal Output Body */}
        <div className="flex-1 p-4 overflow-y-auto terminal-bg text-xs font-mono leading-relaxed space-y-1">
          {logs.length === 0 ? (
            <div className="text-slate-400 italic">Initializing execution stream...</div>
          ) : (
            logs.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap break-words">
                {colorizeLogLine(line)}
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>

        {/* Console Footer */}
        <div className="border-t border-[#30363d] bg-[#161b22] px-4 py-2 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Target: Debian 13 x86_64</span>
          <span>Logs: {logs.length} lines</span>
        </div>
      </div>
    </div>
  );
}
