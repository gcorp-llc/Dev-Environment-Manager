'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Sidebar, { ViewType } from '@/components/Sidebar';
import ConsoleModal from '@/components/ConsoleModal';
import DashboardOverview from '@/components/DashboardOverview';
import ProfilesModulesView from '@/components/ProfilesModulesView';
import ScriptEditorView from '@/components/ScriptEditorView';
import DoctorView from '@/components/DoctorView';
import TerminalView from '@/components/TerminalView';
import BackupView from '@/components/BackupView';
import DocsView from '@/components/DocsView';
import EditModuleModal from '@/components/EditModuleModal';
import EditProfileModal from '@/components/EditProfileModal';
import EditDiagnosticModal from '@/components/EditDiagnosticModal';

import {
  PackageModule,
  Profile,
  DiagnosticCheck,
  DEFAULT_MODULES,
  DEFAULT_PROFILES,
  DEFAULT_DIAGNOSTICS,
  loadStoredModules,
  saveStoredModules,
  loadStoredProfiles,
  saveStoredProfiles,
  loadStoredDiagnostics,
  saveStoredDiagnostics,
} from '@/lib/dem-data';

export default function Home() {
  const [modules, setModules] = useState<PackageModule[]>(DEFAULT_MODULES);
  const [profiles, setProfiles] = useState<Profile[]>(DEFAULT_PROFILES);
  const [diagnostics, setDiagnostics] = useState<DiagnosticCheck[]>(DEFAULT_DIAGNOSTICS);

  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [storageStatus, setStorageStatus] = useState<string>('Synced');

  // Console Modal Execution state
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleTitle, setConsoleTitle] = useState('DEM Shell CLI Execution Stream');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Modals state
  const [editingModule, setEditingModule] = useState<PackageModule | null>(null);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);

  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [editingDiagnostic, setEditingDiagnostic] = useState<DiagnosticCheck | null>(null);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);

  const [scriptStudioModuleId, setScriptStudioModuleId] = useState<string>('');

  // Initial Load from LocalStorage
  useEffect(() => {
    const loadedMods = loadStoredModules();
    const loadedProfs = loadStoredProfiles();
    const loadedDiags = loadStoredDiagnostics();
    setModules(loadedMods);
    setProfiles(loadedProfs);
    setDiagnostics(loadedDiags);
  }, []);

  // Sync to LocalStorage
  const updateModules = (newMods: PackageModule[]) => {
    setModules(newMods);
    saveStoredModules(newMods);
    setStorageStatus('Synced');
  };

  const updateProfiles = (newProfs: Profile[]) => {
    setProfiles(newProfs);
    saveStoredProfiles(newProfs);
    setStorageStatus('Synced');
  };

  const updateDiagnostics = (newDiags: DiagnosticCheck[]) => {
    setDiagnostics(newDiags);
    saveStoredDiagnostics(newDiags);
    setStorageStatus('Synced');
  };

  // Run Backend Execution Engine
  const runCommand = async (command: string, target?: string, extraData?: any) => {
    setIsConsoleOpen(true);
    setConsoleTitle(`DEM Execution: command="${command}" target="${target || 'system'}"`);
    setConsoleLogs([`[INIT] Sending POST /api/dem/exec command="${command}"...`]);
    setIsExecuting(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/dem/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command,
          target,
          moduleData: extraData && extraData.packages ? extraData : undefined,
          profileData: extraData && extraData.modules ? extraData : undefined,
          scriptContent: typeof extraData === 'string' ? extraData : undefined,
        }),
        signal: controller.signal,
      });

      if (!response.body) {
        setConsoleLogs((prev) => [...prev, '[ERROR] Response body readable stream unavailable.']);
        setIsExecuting(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const textChunk = decoder.decode(value);
        const lines = textChunk.split('\n').filter((l) => l.length > 0);
        setConsoleLogs((prev) => [...prev, ...lines]);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setConsoleLogs((prev) => [...prev, `[ERROR] Execution stream failed: ${err.message}`]);
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const handleStopExecution = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setConsoleLogs((prev) => [...prev, '[WARN] Execution process cancelled by user request.']);
      setIsExecuting(false);
    }
  };

  // Config Import / Reset
  const handleImportConfig = (data: { modules?: PackageModule[]; profiles?: Profile[]; diagnostics?: DiagnosticCheck[] }) => {
    if (data.modules && Array.isArray(data.modules)) updateModules(data.modules);
    if (data.profiles && Array.isArray(data.profiles)) updateProfiles(data.profiles);
    if (data.diagnostics && Array.isArray(data.diagnostics)) updateDiagnostics(data.diagnostics);
    alert('JSON configuration imported successfully.');
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all modules, profiles, and diagnostics to factory defaults?')) {
      updateModules(DEFAULT_MODULES);
      updateProfiles(DEFAULT_PROFILES);
      updateDiagnostics(DEFAULT_DIAGNOSTICS);
    }
  };

  // Module CRUD handlers
  const handleSaveModule = (mod: PackageModule) => {
    const exists = modules.some((m) => m.id === mod.id);
    if (exists) {
      updateModules(modules.map((m) => (m.id === mod.id ? mod : m)));
    } else {
      updateModules([...modules, mod]);
    }
  };

  const handleDeleteModule = (modId: string) => {
    if (confirm('Are you sure you want to delete this module?')) {
      updateModules(modules.filter((m) => m.id !== modId));
    }
  };

  // Profile CRUD handlers
  const handleSaveProfile = (prof: Profile) => {
    const exists = profiles.some((p) => p.id === prof.id);
    if (exists) {
      updateProfiles(profiles.map((p) => (p.id === prof.id ? prof : p)));
    } else {
      updateProfiles([...profiles, prof]);
    }
  };

  const handleDeleteProfile = (profId: string) => {
    if (confirm('Are you sure you want to delete this profile stack?')) {
      updateProfiles(profiles.filter((p) => p.id !== profId));
    }
  };

  // Diagnostic CRUD handlers
  const handleSaveDiagnostic = (check: DiagnosticCheck) => {
    const exists = diagnostics.some((d) => d.id === check.id);
    if (exists) {
      updateDiagnostics(diagnostics.map((d) => (d.id === check.id ? check : d)));
    } else {
      updateDiagnostics([...diagnostics, check]);
    }
  };

  const handleDeleteDiagnostic = (checkId: string) => {
    if (confirm('Are you sure you want to delete this diagnostic check?')) {
      updateDiagnostics(diagnostics.filter((d) => d.id !== checkId));
    }
  };

  // Script studio save script
  const handleSaveModuleScript = (moduleId: string, scripts: PackageModule['scripts']) => {
    updateModules(
      modules.map((m) => (m.id === moduleId ? { ...m, scripts } : m))
    );
  };

  const handleOpenScriptEditor = (modId: string) => {
    setScriptStudioModuleId(modId);
    setActiveView('scripts');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      {/* Header Bar */}
      <Header
        onRunCommand={runCommand}
        modules={modules}
        profiles={profiles}
        diagnostics={diagnostics}
        onImportConfig={handleImportConfig}
        onResetDefaults={handleResetDefaults}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar Navigation */}
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          storageStatus={storageStatus}
        />

        {/* View Content Canvas */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeView === 'dashboard' && (
            <DashboardOverview
              modules={modules}
              profiles={profiles}
              onRunCommand={runCommand}
              onNavigateToView={(view) => setActiveView(view)}
            />
          )}

          {activeView === 'profiles' && (
            <ProfilesModulesView
              modules={modules}
              profiles={profiles}
              onRunCommand={runCommand}
              onEditModule={(mod) => {
                setEditingModule(mod);
                setIsModuleModalOpen(true);
              }}
              onDeleteModule={handleDeleteModule}
              onEditProfile={(prof) => {
                setEditingProfile(prof);
                setIsProfileModalOpen(true);
              }}
              onDeleteProfile={handleDeleteProfile}
              onOpenScriptEditor={handleOpenScriptEditor}
            />
          )}

          {activeView === 'scripts' && (
            <ScriptEditorView
              modules={modules}
              initialModuleId={scriptStudioModuleId}
              onSaveModuleScript={handleSaveModuleScript}
              onRunCustomScript={(code) => runCommand('run_custom_script', 'custom.sh', code)}
            />
          )}

          {activeView === 'doctor' && (
            <DoctorView
              diagnostics={diagnostics}
              onRunDoctor={() => runCommand('doctor')}
              onEditCheck={(check) => {
                setEditingDiagnostic(check);
                setIsDiagnosticModalOpen(true);
              }}
              onDeleteCheck={handleDeleteDiagnostic}
              onRunFixCommand={(fixCmd) => runCommand('run_custom_script', 'fix.sh', fixCmd)}
            />
          )}

          {activeView === 'terminal' && (
            <TerminalView onExecuteCommand={runCommand} />
          )}

          {activeView === 'backup' && (
            <BackupView
              modules={modules}
              profiles={profiles}
              onRunBackup={() => runCommand('backup')}
            />
          )}

          {activeView === 'docs' && <DocsView />}
        </main>
      </div>

      {/* Streaming Console Terminal Modal */}
      <ConsoleModal
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        title={consoleTitle}
        logs={consoleLogs}
        isRunning={isExecuting}
        onStop={handleStopExecution}
      />

      {/* Module CRUD Drawer Modal */}
      <EditModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        module={editingModule}
        onSave={handleSaveModule}
      />

      {/* Profile CRUD Modal */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={editingProfile}
        onSave={handleSaveProfile}
      />

      {/* Diagnostic Check CRUD Modal */}
      <EditDiagnosticModal
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
        diagnostic={editingDiagnostic}
        onSave={handleSaveDiagnostic}
      />
    </div>
  );
}
