'use client';

import React, { useState, useEffect } from 'react';
import { DiagnosticCheck } from '@/lib/dem-data';
import { X, Save, Stethoscope, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

interface EditDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkToEdit: DiagnosticCheck | null;
  onSave: (check: DiagnosticCheck) => void;
}

export default function EditDiagnosticModal({ isOpen, onClose, checkToEdit, onSave }: EditDiagnosticModalProps) {
  const [formData, setFormData] = useState<Partial<DiagnosticCheck>>({
    id: '',
    title: '',
    category: 'System',
    status: 'pass',
    message: '',
    fixAction: ''
  });

  useEffect(() => {
    if (checkToEdit) {
      setFormData({ ...checkToEdit });
    } else {
      setFormData({
        id: `diag-${Date.now().toString().slice(-4)}`,
        title: 'New Diagnostic Check',
        category: 'Services',
        status: 'pass',
        message: 'All health requirements verified for Debian 13 environment.',
        fixAction: 'Run repair command if issues occur'
      });
    }
  }, [checkToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.id) return;
    onSave(formData as DiagnosticCheck);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#30363d] bg-[#0d1117] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {checkToEdit ? `Edit Check: ${checkToEdit.title}` : 'Add Diagnostic Check'}
              </h3>
              <p className="text-xs text-slate-400">Configure health diagnostic title, category, and fix instructions</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-[#21262d] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Check ID</label>
            <input
              type="text"
              value={formData.id}
              onChange={e => setFormData({ ...formData, id: e.target.value })}
              required
              className="bg-[#0d1117] border border-[#30363d] text-slate-100 font-mono text-xs rounded-lg px-3 py-2 w-full focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Check Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
              className="bg-[#0d1117] border border-[#30363d] text-slate-100 text-xs rounded-lg px-3 py-2 w-full focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="bg-[#0d1117] border border-[#30363d] text-slate-100 text-xs rounded-lg px-3 py-2 w-full focus:outline-none focus:border-purple-500"
              >
                <option value="System">System</option>
                <option value="Packages">Packages</option>
                <option value="Security">Security</option>
                <option value="Services">Services</option>
                <option value="Hardware">Hardware</option>
                <option value="Network">Network</option>
                <option value="Filesystem">Filesystem</option>
                <option value="Storage">Storage</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Health Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="bg-[#0d1117] border border-[#30363d] text-slate-100 text-xs rounded-lg px-3 py-2 w-full focus:outline-none focus:border-purple-500"
              >
                <option value="pass">Pass (Healthy)</option>
                <option value="warn">Warning</option>
                <option value="fail">Critical Fail</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Diagnostic Output Message</label>
            <textarea
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              rows={2}
              required
              className="bg-[#0d1117] border border-[#30363d] text-slate-100 text-xs rounded-lg p-3 w-full focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Recommended Fix Action (Optional)</label>
            <input
              type="text"
              value={formData.fixAction || ''}
              onChange={e => setFormData({ ...formData, fixAction: e.target.value })}
              placeholder="e.g. Run ./dem.sh repair or apt-get update"
              className="bg-[#0d1117] border border-[#30363d] text-slate-100 text-xs rounded-lg px-3 py-2 w-full focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="pt-4 border-t border-[#30363d] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-slate-300 rounded-xl text-xs font-medium border border-[#30363d] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-950/40 transition-all"
            >
              <Save className="w-4 h-4" /> Save Diagnostic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
