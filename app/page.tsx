'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import DashboardOverview from '@/components/DashboardOverview';
import ProfilesModulesView from '@/components/ProfilesModulesView';
import ScriptEditorView from '@/components/ScriptEditorView';
import DoctorView from '@/components/DoctorView';
import TerminalView from '@/components/TerminalView';
import BackupView from '@/components/BackupView';
import DocsView from '@/components/DocsView';
import ConsoleModal from '@/components/ConsoleModal';
import {
  INITIAL_MODULES,
  INITIAL_PROFILES,
  INITIAL_DIAGNOSTICS,
  PackageModule,
  Profile,
  DiagnosticCheck
} from '@/lib/dem-data';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // LocalStorage-backed state initialized gracefully
  const [modules, setModules] = useState<PackageModule[]>(INITIAL_MODULES);
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [diagnostics, setDiagnostics] = useState<DiagnosticCheck[]>(INITIAL_DIAGNOSTICS);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedModules = localStorage.getItem('dem_modules_v2.5');
      if (savedModules) setModules(JSON.parse(savedModules));

      const savedProfiles = localStorage.getItem('dem_profiles_v2.5');
      if (savedProfiles) setProfiles(JSON.parse(savedProfiles));

      const savedDiagnostics = localStorage.getItem('dem_diagnostics_v2.5');
      if (savedDiagnostics) setDiagnostics(JSON.parse(savedDiagnostics));
    } catch (err) {
      console.error('Failed to load local DEM state:', err);
    }
  }, []);

  // Save changes to LocalStorage
  const saveModulesState = (newModules: PackageModule[]) => {
    setModules(newModules);
    try {
      localStorage.setItem('dem_modules_v2.5', JSON.stringify(newModules));
    } catch (e) {}
  };

  const saveProfilesState = (newProfiles: Profile[]) => {
    setProfiles(newProfiles);
    try {
      localStorage.setItem('dem_profiles_v2.5', JSON.stringify(newProfiles));
    } catch (e) {}
  };

  const saveDiagnosticsState = (newDiagnostics: DiagnosticCheck[]) => {
    setDiagnostics(newDiagnostics);
    try {
      localStorage.setItem('dem_diagnostics_v2.5', JSON.stringify(newDiagnostics));
    } catch (e) {}
  };

  // Console Modal State
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleTitle, setConsoleTitle] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isConsoleRunning, setIsConsoleRunning] = useState(false);

  // Execution Handler with state updates & realistic log streaming
  const handleRunAction = async (command: string, target?: string, moduleDetails?: PackageModule) => {
    const titleTarget = target ? ` [${target}]` : '';
    setConsoleTitle(`DEM Execution Stream: ./dem.sh ${command}${titleTarget}`);
    setConsoleLogs([`[INIT] Launching DEM process controller for '${command}'...`]);
    setIsConsoleRunning(true);
    setIsConsoleOpen(true);

    try {
      const res = await fetch('/api/dem/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, target, moduleDetails })
      });
      const data = await res.json();

      if (data.logs && Array.isArray(data.logs)) {
        // Stream logs with micro-delays for realistic step feedback
        for (let i = 0; i < data.logs.length; i++) {
          await new Promise(r => setTimeout(r, 120));
          setConsoleLogs(prev => [...prev, data.logs[i]]);
        }
      }

      // Automatically update module or profile status in state
      if (command === 'install_module' && (moduleDetails?.id || target)) {
        const targetId = moduleDetails?.id || target;
        const updated = modules.map(m => m.id === targetId ? { ...m, status: 'verified' as const } : m);
        saveModulesState(updated);
      } else if (command === 'verify_module' && (moduleDetails?.id || target)) {
        const targetId = moduleDetails?.id || target;
        const updated = modules.map(m => m.id === targetId ? { ...m, status: 'verified' as const } : m);
        saveModulesState(updated);
      } else if (command === 'uninstall_module' && (moduleDetails?.id || target)) {
        const targetId = moduleDetails?.id || target;
        const updated = modules.map(m => m.id === targetId ? { ...m, status: 'uninstalled' as const } : m);
        saveModulesState(updated);
      } else if (command === 'install' && target) {
        // Installing a profile
        const targetProf = profiles.find(p => p.id === target);
        if (targetProf) {
          const updatedProfiles = profiles.map(p => p.id === target ? { ...p, isInstalled: true } : p);
          saveProfilesState(updatedProfiles);

          // Mark profile's modules as verified
          const updatedModules = modules.map(m => {
            if (targetProf.modules.includes(m.id) || targetProf.modules.includes(m.category)) {
              return { ...m, status: 'verified' as const };
            }
            return m;
          });
          saveModulesState(updatedModules);
        }
      } else if (command === 'uninstall' && target) {
        const updatedProfiles = profiles.map(p => p.id === target ? { ...p, isInstalled: false } : p);
        saveProfilesState(updatedProfiles);
      } else if (command === 'repair') {
        const updatedDiagnostics = diagnostics.map(d => ({ ...d, status: 'pass' as const }));
        saveDiagnosticsState(updatedDiagnostics);
      }
    } catch (err: any) {
      setConsoleLogs(prev => [...prev, `[ERROR] Process failed: ${err.message}`]);
    } finally {
      setIsConsoleRunning(false);
    }
  };

  const handleRunScriptCode = async (scriptCode: string, scriptName: string) => {
    setConsoleTitle(`Script Execution: ${scriptName}`);
    setConsoleLogs([`[INIT] Compiling and running custom Bash script code...`]);
    setIsConsoleRunning(true);
    setIsConsoleOpen(true);

    try {
      const res = await fetch('/api/dem/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'run_custom_script', scriptCode })
      });
      const data = await res.json();
      if (data.logs && Array.isArray(data.logs)) {
        setConsoleLogs(data.logs);
      }
    } catch (err: any) {
      setConsoleLogs(prev => [...prev, `[ERROR] Script execution error: ${err.message}`]);
    } finally {
      setIsConsoleRunning(false);
    }
  };

  // Module CRUD operations
  const handleSaveModule = (mod: PackageModule) => {
    const exists = modules.some(m => m.id === mod.id);
    const updated = exists ? modules.map(m => m.id === mod.id ? mod : m) : [...modules, mod];
    saveModulesState(updated);
  };

  const handleDeleteModule = (moduleId: string) => {
    const updated = modules.filter(m => m.id !== moduleId);
    saveModulesState(updated);
  };

  // Profile CRUD operations
  const handleSaveProfile = (prof: Profile) => {
    const exists = profiles.some(p => p.id === prof.id);
    const updated = exists ? profiles.map(p => p.id === prof.id ? prof : p) : [...profiles, prof];
    saveProfilesState(updated);
  };

  const handleDeleteProfile = (profileId: string) => {
    const updated = profiles.filter(p => p.id !== profileId);
    saveProfilesState(updated);
  };

  // Diagnostic CRUD operations
  const handleSaveDiagnostic = (check: DiagnosticCheck) => {
    const exists = diagnostics.some(d => d.id === check.id);
    const updated = exists ? diagnostics.map(d => d.id === check.id ? check : d) : [...diagnostics, check];
    saveDiagnosticsState(updated);
  };

  const handleDeleteDiagnostic = (checkId: string) => {
    const updated = diagnostics.filter(d => d.id !== checkId);
    saveDiagnosticsState(updated);
  };

  // Export and Import JSON Configuration
  const handleExportConfig = () => {
    const fullConfig = {
      version: '2.5.0',
      exportedAt: new Date().toISOString(),
      modules,
      profiles,
      diagnostics
    };

    const blob = new Blob([JSON.stringify(fullConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dem-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.modules && Array.isArray(parsed.modules)) {
            saveModulesState(parsed.modules);
          }
          if (parsed.profiles && Array.isArray(parsed.profiles)) {
            saveProfilesState(parsed.profiles);
          }
          if (parsed.diagnostics && Array.isArray(parsed.diagnostics)) {
            saveDiagnosticsState(parsed.diagnostics);
          }
          alert('DEM configuration imported and applied successfully!');
        } catch (err) {
          alert('Failed to parse JSON configuration file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all modules, profiles, and diagnostics to factory defaults?')) {
      localStorage.removeItem('dem_modules_v2.5');
      localStorage.removeItem('dem_profiles_v2.5');
      localStorage.removeItem('dem_diagnostics_v2.5');
      setModules(INITIAL_MODULES);
      setProfiles(INITIAL_PROFILES);
      setDiagnostics(INITIAL_DIAGNOSTICS);
    }
  };

  const activeModulesCount = modules.filter(m => m.status === 'verified' || m.status === 'configured').length;

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <Header
        onRunAction={handleRunAction}
        activeTab={activeTab}
        onExportConfig={handleExportConfig}
        onImportConfig={handleImportConfig}
        onResetData={handleResetData}
      />

      {/* Main Content Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          installedCount={activeModulesCount}
          modulesCount={modules.length}
        />

        {/* View Container */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              modules={modules}
              profiles={profiles}
              onRunAction={handleRunAction}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'profiles' && (
            <ProfilesModulesView
              modules={modules}
              profiles={profiles}
              onRunAction={handleRunAction}
              setModules={setModules}
              setProfiles={setProfiles}
              onSaveModule={handleSaveModule}
              onDeleteModule={handleDeleteModule}
              onSaveProfile={handleSaveProfile}
              onDeleteProfile={handleDeleteProfile}
            />
          )}

          {activeTab === 'scripts' && (
            <ScriptEditorView
              modules={modules}
              onUpdateModule={handleSaveModule}
              onRunScript={handleRunScriptCode}
            />
          )}

          {activeTab === 'doctor' && (
            <DoctorView
              diagnostics={diagnostics}
              onRunAction={handleRunAction}
              onSaveDiagnostic={handleSaveDiagnostic}
              onDeleteDiagnostic={handleDeleteDiagnostic}
            />
          )}

          {activeTab === 'terminal' && (
            <TerminalView
              onRunAction={handleRunAction}
            />
          )}

          {activeTab === 'backup' && (
            <BackupView
              onRunAction={handleRunAction}
            />
          )}

          {activeTab === 'docs' && (
            <DocsView />
          )}
        </main>
      </div>

      {/* Execution Log Console Modal */}
      <ConsoleModal
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        title={consoleTitle}
        logs={consoleLogs}
        isRunning={isConsoleRunning}
        onCancel={() => setIsConsoleRunning(false)}
      />
    </div>
  );
}
