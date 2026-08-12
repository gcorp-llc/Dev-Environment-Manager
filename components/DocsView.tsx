'use client';

import React from 'react';
import { FileText, Cpu, Server, ShieldCheck, Layers, Terminal, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '@/lib/dem-data';

export default function DocsView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#30363d] pb-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <FileText className="h-5 w-5 text-cyan-400" /> System Architecture Specifications
        </h2>
        <p className="text-xs text-slate-400">
          Technical specifications, Debian 13 (Trixie) system requirements, GPG keyring policies, and 4-step Bash lifecycle rules.
        </p>
      </div>

      {/* 4-Step Lifecycle Specs */}
      <div className="glass-panel rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="h-4 w-4" /> 4-Step Module Execution Lifecycle
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-400">1. install.sh</div>
            <p className="text-xs text-slate-300">
              Adds official APT repository mirrors to <code className="text-emerald-300">/etc/apt/sources.list.d/</code>, imports GPG keyrings, and executes non-interactive APT installation.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2">
            <div className="text-xs font-mono font-bold text-cyan-400">2. configure.sh</div>
            <p className="text-xs text-slate-300">
              Applies system configs, configures environment variables, system limits in <code className="text-cyan-300">/etc/security/limits.conf</code>, and creates necessary symlinks.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2">
            <div className="text-xs font-mono font-bold text-purple-400">3. systemd enablement</div>
            <p className="text-xs text-slate-300">
              Enables background daemons via <code className="text-purple-300">systemctl enable --now serviceName</code> and verifies active state IPC via systemd D-Bus interface.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2">
            <div className="text-xs font-mono font-bold text-amber-400">4. verify.sh</div>
            <p className="text-xs text-slate-300">
              Executes binary PATH checks via <code className="text-amber-300">which binary</code>, tests command line versions, and confirms exit status code 0.
            </p>
          </div>
        </div>
      </div>

      {/* Target OS & Hardening Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-cyan-400" /> Target OS Environment
          </h3>
          <ul className="space-y-2 text-xs text-slate-300 font-mono">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>OS Release: Debian GNU/Linux 13 (Trixie)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Kernel: Linux 6.12+ LTS (x86_64 / amd64)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Init System: Systemd v256+ with D-Bus IPC support</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>CPU Instructions: AVX2 + FMA extension support</span>
            </li>
          </ul>
        </div>

        <div className="glass-panel rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-purple-400" /> Security & GPG Keyring Policy
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            In compliance with modern Debian security standards, all third-party APT repositories (Docker CE, NodeSource, VS Code) store de-armored GPG public keys exclusively in:
          </p>
          <div className="p-2 rounded bg-[#0d1117] border border-[#30363d] text-xs font-mono text-purple-300">
            /etc/apt/keyrings/[repository].gpg
          </div>
          <p className="text-xs text-slate-400">
            Legacy <code className="text-slate-200">apt-key add</code> is completely deprecated and avoided.
          </p>
        </div>
      </div>

      {/* 12 Categories Reference */}
      <div className="glass-panel rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
          12 Architectural Category Matrix Reference
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                <span>{cat.name}</span>
                <span className="text-[10px] text-slate-500 uppercase">{cat.id}</span>
              </div>
              <p className="text-xs text-slate-400">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
