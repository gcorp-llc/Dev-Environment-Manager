'use client';

import React from 'react';
import { Archive, Download, ShieldCheck, HardDrive, Play, RefreshCw, FileText } from 'lucide-react';
import { PackageModule, Profile } from '@/lib/dem-data';

interface BackupViewProps {
  modules: PackageModule[];
  profiles: Profile[];
  onRunBackup: () => void;
}

export default function BackupView({ modules, profiles, onRunBackup }: BackupViewProps) {
  const backupsList = [
    { id: 'b1', name: 'dem-backup-debian13-2026-08-12.tar.gz', size: '4.2 MB', date: '2026-08-12 06:30', keyrings: 4 },
    { id: 'b2', name: 'dem-backup-debian13-2026-08-01.tar.gz', size: '3.9 MB', date: '2026-08-01 14:15', keyrings: 4 },
    { id: 'b3', name: 'dem-backup-debian13-2026-07-15.tar.gz', size: '3.7 MB', date: '2026-07-15 09:00', keyrings: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363d] pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Archive className="h-5 w-5 text-purple-400" /> Backup & Profile Archiving Manager
          </h2>
          <p className="text-xs text-slate-400">
            Create snapshot archives of Debian 13 APT repository lists, /etc/apt/keyrings GPG keys, and DEM JSON profile manifests.
          </p>
        </div>

        <button
          onClick={onRunBackup}
          className="flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-purple-400 transition glow-purple"
        >
          <Play className="h-4 w-4 fill-slate-950" /> Generate Backup Archive (.tar.gz)
        </button>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-5 space-y-2">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>APT Sources & Repos</span>
            <FileText className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">14 Sources</div>
          <p className="text-xs text-slate-400">Includes official Debian 13 Trixie main, contrib & non-free repos.</p>
        </div>

        <div className="glass-panel rounded-xl p-5 space-y-2">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>GPG Signed Keyrings</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">4 Keyrings</div>
          <p className="text-xs text-slate-400">Docker CE, NodeSource, Microsoft VS Code, Debian Archive.</p>
        </div>

        <div className="glass-panel rounded-xl p-5 space-y-2">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Manifest Storage</span>
            <HardDrive className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">/var/backups/dem/</div>
          <p className="text-xs text-slate-400">Local tarball archives stored on root partition.</p>
        </div>
      </div>

      {/* Backup Archives List */}
      <div className="glass-panel rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
            System Archive Snapshots
          </h3>
          <span className="text-xs font-mono text-slate-400">{backupsList.length} Archives Available</span>
        </div>

        <div className="space-y-2">
          {backupsList.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between p-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <Archive className="h-4 w-4 text-purple-400" />
                <div>
                  <div className="text-slate-100 font-bold">{b.name}</div>
                  <div className="text-slate-400 text-[10px]">Created: {b.date} | Keyrings: {b.keyrings}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400">{b.size}</span>
                <button
                  onClick={onRunBackup}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#21262d] text-slate-200 border border-[#30363d] hover:bg-[#30363d]"
                >
                  <Download className="h-3 w-3" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
