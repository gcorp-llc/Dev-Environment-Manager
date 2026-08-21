'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Terminal, X, CheckCircle2, AlertTriangle, Loader2, Copy, Download, Square, Check } from 'lucide-react';

interface ConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  logs: string[];
  isRunning: boolean;
  isSuccess?: boolean;
  onCancel?: () => void;
}

export default function ConsoleModal({ isOpen, onClose, title, logs, isRunning, isSuccess = true, onCancel }: ConsoleModalProps) {
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([logs.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dem-exec-${Date.now()}.log`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d] bg-[#0d1117]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">{title}</h3>
              <p className="text-xs text-slate-400">DEM Execution Stream • Real-time Output Log</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-slate-300 bg-[#21262d] hover:bg-[#30363d] px-3 py-1.5 rounded-xl border border-[#30363d] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              {copied ? 'Copied' : 'Copy'}
            </button>

            <button
              onClick={handleDownload}
              title="Download Log Report"
              className="p-1.5 text-slate-300 bg-[#21262d] hover:bg-[#30363d] rounded-xl border border-[#30363d] transition-colors"
            >
              <Download className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-[#21262d] rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Console output area */}
        <div ref={scrollRef} className="p-5 bg-[#090d13] font-mono text-xs text-slate-300 overflow-y-auto flex-1 space-y-1.5 min-h-[300px]">
          {logs.map((line, idx) => (
            <div key={idx} className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-slate-600 select-none font-mono text-[11px] w-6 text-right">{idx + 1}</span>
              <span className="text-slate-600 select-none">›</span>
              <span className={
                line.includes('[SUCCESS]') || line.includes('[OK]') || line.includes('- PASS')
                  ? 'text-emerald-400 font-semibold'
                  : line.includes('[WARN]') || line.includes('[CHECK]')
                  ? 'text-amber-300'
                  : line.includes('[STEP]') || line.includes('[DEM') || line.includes('[EXEC]')
                  ? 'text-cyan-400 font-bold'
                  : 'text-slate-300'
              }>
                {line}
              </span>
            </div>
          ))}

          {isRunning && (
            <div className="flex items-center gap-2 text-cyan-400 pt-3 text-xs font-semibold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Executing step script on Debian 13 environment...</span>
            </div>
          )}
        </div>

        {/* Footer status bar */}
        <div className="px-6 py-3.5 border-t border-[#30363d] bg-[#0d1117] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {isRunning ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Process in progress
                </span>
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 px-2.5 py-1 rounded-lg border border-rose-800 text-[11px] font-semibold transition-colors"
                  >
                    <Square className="w-3 h-3 fill-current" /> Stop Execution
                  </button>
                )}
              </div>
            ) : isSuccess ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Process finished with exit code 0
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                <AlertTriangle className="w-4 h-4" /> Process stopped or completed with errors
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#21262d] hover:bg-[#30363d] text-slate-200 rounded-xl border border-[#30363d] font-semibold text-xs transition-colors"
          >
            Close Stream
          </button>
        </div>
      </div>
    </div>
  );
}
