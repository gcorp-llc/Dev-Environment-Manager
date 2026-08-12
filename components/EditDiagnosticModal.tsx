'use client';

import React, { useState, useEffect } from 'react';
import { DiagnosticCheck } from '@/lib/dem-data';
import { X, Save, Stethoscope } from 'lucide-react';

interface EditDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnostic: DiagnosticCheck | null;
  onSave: (check: DiagnosticCheck) => void;
}

export default function EditDiagnosticModal({
  isOpen,
  onClose,
  diagnostic,
  onSave,
}: EditDiagnosticModalProps) {
  const [formData, setFormData] = useState<Partial<DiagnosticCheck>>({
    id: '',
    title: '',
    category: 'System',
    status: 'pass',
    message: '',
    fixAction: '',
  });

  useEffect(() => {
    if (diagnostic) {
      setFormData(diagnostic);
    } else {
      setFormData({
        id: `diag-custom-${Date.now().toString().slice(-4)}`,
        title: '',
        category: 'System',
        status: 'pass',
        message: '',
        fixAction: '',
      });
    }
  }, [diagnostic, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCheck: DiagnosticCheck = {
      id: formData.id || `diag-${Date.now()}`,
      title: formData.title || 'Custom System Check',
      category: formData.category || 'System',
      status: formData.status || 'pass',
      message: formData.message || '',
      fixAction: formData.fixAction || undefined,
    };
    onSave(finalCheck);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-xl border border-[#30363d] bg-[#161b22] shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Stethoscope className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-100">
              {diagnostic ? `Edit Diagnostic Check` : 'Add Custom System Diagnostic Check'}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-slate-400 mb-1">Check Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Memory Swap Space Limits"
              className="w-full rounded-lg bg-[#0d1117] px-3 py-2 text-xs text-slate-200 border border-[#30363d] focus:border-emerald-500/60 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 mb-1">Category</label>
              <select
                value={formData.category || 'System'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full rounded-lg bg-[#0d1117] px-3 py-2 text-xs text-slate-200 border border-[#30363d] focus:border-emerald-500/60 focus:outline-none"
              >
                <option value="System">System</option>
                <option value="Packages">Packages</option>
                <option value="Security">Security</option>
                <option value="Services">Services</option>
                <option value="Hardware">Hardware</option>
                <option value="Storage">Storage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 mb-1">Initial Status</label>
              <select
                value={formData.status || 'pass'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-lg bg-[#0d1117] px-3 py-2 text-xs font-mono text-slate-200 border border-[#30363d] focus:border-emerald-500/60 focus:outline-none"
              >
                <option value="pass">PASS</option>
                <option value="warn">WARN</option>
                <option value="fail">FAIL</option>
                <option value="pending">PENDING</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-400 mb-1">Diagnostic Details Message</label>
            <textarea
              rows={2}
              value={formData.message || ''}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Output message or test result description..."
              className="w-full rounded-lg bg-[#0d1117] px-3 py-2 text-xs text-slate-200 border border-[#30363d] focus:border-emerald-500/60 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-400 mb-1">Recommended Fix Action (optional command)</label>
            <input
              type="text"
              value={formData.fixAction || ''}
              onChange={(e) => setFormData({ ...formData, fixAction: e.target.value })}
              placeholder="e.g. systemctl restart systemd-timesyncd"
              className="w-full rounded-lg bg-[#0d1117] px-3 py-2 text-xs font-mono text-cyan-300 border border-[#30363d] focus:border-cyan-500/60 focus:outline-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#30363d]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#21262d] text-xs font-medium text-slate-300 border border-[#30363d] hover:bg-[#30363d] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition glow-emerald"
            >
              <Save className="h-4 w-4" /> Save Diagnostic Check
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
