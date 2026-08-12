'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Boxes, 
  Code2, 
  Stethoscope, 
  Terminal, 
  Archive, 
  FileText,
  HardDrive,
  Cpu
} from 'lucide-react';

export type ViewType = 'dashboard' | 'profiles' | 'scripts' | 'doctor' | 'terminal' | 'backup' | 'docs';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  storageStatus?: string;
}

export default function Sidebar({ activeView, onViewChange, storageStatus = 'Synced' }: SidebarProps) {
  const navItems: { id: ViewType; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'profiles', label: 'Profiles & Modules', icon: Boxes, badge: '12 Cats' },
    { id: 'scripts', label: 'Script Studio', icon: Code2 },
    { id: 'doctor', label: 'System Doctor', icon: Stethoscope },
    { id: 'terminal', label: 'DEM CLI Terminal', icon: Terminal },
    { id: 'backup', label: 'Backup & Archive', icon: Archive },
    { id: 'docs', label: 'Architecture Specs', icon: FileText },
  ];

  return (
    <aside className="w-full lg:w-64 border-r border-[#30363d] bg-[#161b22]/90 backdrop-blur-md flex flex-col justify-between p-3 shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
          Navigation Suite
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-slate-300 hover:bg-[#1c2128] hover:text-slate-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#30363d] text-slate-300">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Live System Indicator */}
      <div className="mt-4 pt-3 border-t border-[#30363d] space-y-2">
        <div className="rounded-lg bg-[#0d1117] p-2.5 border border-[#30363d] space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Cpu className="h-3 w-3 text-cyan-400" /> Target OS
            </span>
            <span className="text-cyan-400 font-semibold">Debian 13</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <HardDrive className="h-3 w-3 text-emerald-400" /> Storage State
            </span>
            <span className="text-emerald-400 font-semibold">{storageStatus}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
