'use client';

import React from 'react';
import { BookOpen, CheckCircle2, ShieldAlert, FileCode2, Terminal, Layers, Cpu, Server } from 'lucide-react';

export default function DocsView() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-200">
      {/* Header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-slate-100">DEM Architectural Specifications</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          Dev Environment Manager (DEM) is a modular, Bash-based environment provisioning framework targeting Debian 13 (Trixie). Every package module implements a strict 4-script lifecycle standard.
        </p>
      </div>

      {/* Grid Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rule 1 */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <FileCode2 className="w-4 h-4" />
            <h3 className="text-sm font-bold text-slate-100">The 4-Script Module Standard</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every sub-module under <code className="text-emerald-400 font-mono">packages/&lt;category&gt;/&lt;module&gt;/</code> MUST implement exactly 4 lifecycle scripts:
          </p>
          <ul className="text-xs space-y-2 text-slate-300 font-mono bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
            <li><strong className="text-emerald-400">install.sh</strong>: Downloads packages and imports GPG keyrings.</li>
            <li><strong className="text-amber-400">configure.sh</strong>: Sets config files, users, and systemd units.</li>
            <li><strong className="text-cyan-400">verify.sh</strong>: Asserts binaries exist and endpoints respond.</li>
            <li><strong className="text-rose-400">uninstall.sh</strong>: Completely purges packages, keys, and configs.</li>
          </ul>
        </div>

        {/* Rule 2 */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            <h3 className="text-sm font-bold text-slate-100">APT Signed-By GPG Security</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            DEM completely avoids deprecated <code className="text-rose-400 font-mono">apt-key</code> and global <code className="text-rose-400 font-mono">trusted.gpg</code> keys. Third-party GPG keyrings are saved under <code className="text-emerald-400 font-mono">/etc/apt/keyrings/</code> with explicit <code className="text-emerald-400 font-mono">signed-by</code> parameters in sources list files.
          </p>
          <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] text-[11px] font-mono text-slate-300">
            deb [signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian trixie stable
          </div>
        </div>
      </div>
    </div>
  );
}
