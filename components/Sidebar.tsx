'use client';

import React from 'react';
import { LayoutDashboard, Layers, Code2, Stethoscope, Terminal, Archive, BookOpen } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  installedCount: number;
  modulesCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, installedCount, modulesCount }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, badge: null },
    { id: 'profiles', label: 'Profiles & Modules', icon: Layers, badge: `${installedCount}/${modulesCount} active` },
    { id: 'scripts', label: 'Script Studio', icon: Code2, badge: '4-Phase' },
    { id: 'doctor', label: 'System Doctor', icon: Stethoscope, badge: '8 checks' },
    { id: 'terminal', label: 'DEM Shell Terminal', icon: Terminal, badge: './dem.sh' },
    { id: 'backup', label: 'Backup & Profiles', icon: Archive, badge: null },
    { id: 'docs', label: 'Architecture Specs', icon: BookOpen, badge: 'Docs' },
  ];

  return (
    <aside className="w-64 border-r border-[#30363d] bg-[#0d1117] flex flex-col shrink-0 min-h-[calc(100vh-57px)]">
      <div className="p-4 space-y-1">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Management Console
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161b22]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-[#21262d] text-slate-400 border border-[#30363d]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System info badge bottom */}
      <div className="mt-auto p-4 border-t border-[#30363d] bg-[#161b22]/50">
        <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Target System:</span>
            <span className="font-mono text-emerald-400 text-[11px] font-bold">Debian 13</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Architecture:</span>
            <span className="font-mono text-slate-300 text-[11px]">x86_64</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Persistence:</span>
            <span className="font-mono text-cyan-400 text-[11px]">localStorage</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
