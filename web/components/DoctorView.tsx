'use client';

import React, { useState } from 'react';
import { DiagnosticCheck } from '@/lib/dem-data';
import { Stethoscope, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Wrench, Shield, Plus, Edit3, Trash2 } from 'lucide-react';
import EditDiagnosticModal from './EditDiagnosticModal';

interface DoctorViewProps {
  diagnostics: DiagnosticCheck[];
  onRunAction: (cmd: string, target?: string) => void;
  onSaveDiagnostic: (check: DiagnosticCheck) => void;
  onDeleteDiagnostic: (checkId: string) => void;
}

export default function DoctorView({ diagnostics, onRunAction, onSaveDiagnostic, onDeleteDiagnostic }: DoctorViewProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCheck, setEditingCheck] = useState<DiagnosticCheck | null>(null);

  const categories = ['all', ...Array.from(new Set(diagnostics.map(d => d.category)))];

  const filteredDiagnostics = diagnostics.filter(d => 
    filterCategory === 'all' || d.category === filterCategory
  );

  const passCount = diagnostics.filter(d => d.status === 'pass').length;
  const warnCount = diagnostics.filter(d => d.status === 'warn').length;
  const failCount = diagnostics.filter(d => d.status === 'fail').length;

  const handleCreateCheck = () => {
    setEditingCheck(null);
    setIsModalOpen(true);
  };

  const handleEditCheck = (check: DiagnosticCheck) => {
    setEditingCheck(check);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">DEM System Doctor</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Automated health diagnostics inspecting Debian 13 release requirements, APT locks, GPG keyrings under <code className="text-emerald-400 bg-[#0d1117] px-1.5 py-0.5 rounded font-mono">/etc/apt/keyrings</code>, systemd init state, and storage metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleCreateCheck}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-purple-400" /> Add Diagnostic
          </button>

          <button
            onClick={() => onRunAction('doctor')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-run Diagnostics
          </button>

          <button
            onClick={() => onRunAction('repair')}
            className="flex items-center gap-2 px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] rounded-xl text-xs font-semibold transition-colors"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" /> Run Repair
          </button>
        </div>
      </div>

      {/* Overview Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-medium text-slate-400">Passed Checks</p>
            <h3 className="text-xl font-bold text-emerald-400 mt-1">{passCount} / {diagnostics.length}</h3>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-80" />
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-medium text-slate-400">System Warnings</p>
            <h3 className="text-xl font-bold text-amber-400 mt-1">{warnCount}</h3>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-400 opacity-80" />
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs font-medium text-slate-400">Critical Failures</p>
            <h3 className="text-xl font-bold text-rose-400 mt-1">{failCount}</h3>
          </div>
          <XCircle className="w-8 h-8 text-rose-400 opacity-80" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap capitalize ${
              filterCategory === cat
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-[#161b22] text-slate-400 border border-[#30363d] hover:text-slate-200'
            }`}
          >
            {cat} Checks
          </button>
        ))}
      </div>

      {/* Diagnostics List */}
      <div className="space-y-3">
        {filteredDiagnostics.map(diag => {
          const isPass = diag.status === 'pass';
          const isWarn = diag.status === 'warn';

          return (
            <div
              key={diag.id}
              className="bg-[#161b22] border border-[#30363d] hover:border-slate-600 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {isPass && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {isWarn && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  {!isPass && !isWarn && <XCircle className="w-5 h-5 text-rose-400" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100">{diag.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0d1117] text-slate-400 border border-[#30363d]">
                      {diag.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{diag.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md uppercase ${
                  isPass
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : isWarn
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {diag.status}
                </span>

                <button
                  onClick={() => handleEditCheck(diag)}
                  title="Edit Diagnostic Check"
                  className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-[#21262d] rounded-lg transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDeleteDiagnostic(diag.id)}
                  title="Delete Check"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#21262d] rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <EditDiagnosticModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        checkToEdit={editingCheck}
        onSave={onSaveDiagnostic}
      />
    </div>
  );
}
