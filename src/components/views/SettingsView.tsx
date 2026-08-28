import React, { useState, useRef } from 'react';
import { UserSettings, SleepSession, UserProfile } from '../../types/sleep';
import {
  exportBackupJSON,
  importBackupJSON,
  exportSessionsToCSV,
  clearAllData
} from '../../services/storage';
import { GuideModal } from '../common/GuideModal';

interface SettingsViewProps {
  settings: UserSettings;
  sessions: SleepSession[];
  profiles?: UserProfile[];
  activeProfileId?: string;
  onOpenProfileModal?: () => void;
  onSaveSettings: (settings: UserSettings) => void;
  onRefreshData: () => void;
  onLoadDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  sessions,
  profiles = [],
  activeProfileId,
  onOpenProfileModal,
  onSaveSettings,
  onRefreshData,
  onLoadDemoData
}) => {
  const [showGuide, setShowGuide] = useState(false);
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autorest_sleep_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Backup exported successfully as JSON!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExportCSV = () => {
    const csvStr = exportSessionsToCSV(sessions);
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autorest_sleep_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Data exported successfully as CSV!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBackupJSON(content);
      if (res.success) {
        setStatusMessage(res.message);
        onRefreshData();
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (window.confirm('⚠️ WARNING: This will permanently delete all stored sleep sessions for the current profile. Are you sure?')) {
      clearAllData();
      onRefreshData();
      setStatusMessage('All data reset to initial default.');
    }
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Complete User Guide Modal */}
      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />

      {/* Header */}
      <div className="pt-1 px-1 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            SETTINGS
          </h1>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mt-0.5">
            Profiles, Goals & Tutorial
          </p>
        </div>

        <button
          onClick={() => setShowGuide(true)}
          className="px-3 py-1.5 rounded-xl bg-stage-light/20 border border-stage-light/40 text-stage-light hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
        >
          <span>🎓</span>
          <span>Tutorial</span>
        </button>
      </div>

      {statusMessage && (
        <div className="bg-stage-awake/20 border border-stage-awake/50 text-stage-awake px-4 py-2.5 rounded-2xl text-xs font-bold animate-pulse">
          ✓ {statusMessage}
        </div>
      )}

      {/* 1. Active User Profile Card */}
      <div className="bg-oled-card rounded-[22px] p-5 border border-oled-cardBorder shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-text-primary flex items-center gap-2">
            <span>Current User Profile</span>
            <span className="bg-stage-light/20 text-stage-light text-[10px] font-bold px-2 py-0.5 rounded-full">
              Active
            </span>
          </h2>
          {onOpenProfileModal && (
            <button
              onClick={onOpenProfileModal}
              className="text-xs text-stage-light font-bold hover:underline"
            >
              Switch / Add User
            </button>
          )}
        </div>

        {activeProfile && (
          <div className="p-3.5 bg-oled-darker rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-oled-card border border-white/15 flex items-center justify-center text-2xl shadow-inner">
                {activeProfile.avatarEmoji || '👤'}
              </div>
              <div>
                <span className="text-base font-extrabold text-white block">{activeProfile.name}</span>
                <span className="text-[11px] text-text-secondary">
                  Target: {activeProfile.targetSleepHours}h sleep • Baseline RHR: {activeProfile.baselineRHR} bpm
                </span>
              </div>
            </div>

            {onOpenProfileModal && (
              <button
                onClick={onOpenProfileModal}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
              >
                Change ▾
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Interactive Website Tutorial Card */}
      <div className="bg-oled-card rounded-[22px] p-5 border border-stage-light/30 shadow-card space-y-3 bg-gradient-to-r from-stage-light/5 to-transparent">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-white flex items-center gap-2">
            <span>🎓 Website Guide & Legend</span>
          </h2>
        </div>
        <p className="text-xs text-text-secondary">
          New to AutoRest? Open our step-by-step interactive tutorial to learn how to log sleep, read the hypnogram colors, and calculate sleep cycles.
        </p>

        <button
          onClick={() => setShowGuide(true)}
          className="w-full py-3 bg-stage-light hover:bg-white text-black font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span>🚀</span> Open Step-by-Step Interactive Tutorial
        </button>
      </div>

      {/* 3. User Sleep Goals Form */}
      <form onSubmit={handleSavePreferences} className="bg-oled-card rounded-[22px] p-5 border border-oled-cardBorder shadow-card space-y-4">
        <h2 className="text-[15px] font-bold text-text-primary flex items-center justify-between">
          <span>Target Sleep Goals</span>
          <span className="text-xs text-text-secondary">🎯</span>
        </h2>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-text-secondary">Nightly Sleep Target</span>
              <span className="text-white font-bold">{localSettings.targetSleepHours} Hours</span>
            </div>
            <input
              type="range"
              min="5"
              max="11"
              step="0.5"
              value={localSettings.targetSleepHours}
              onChange={e => setLocalSettings({ ...localSettings, targetSleepHours: parseFloat(e.target.value) })}
              className="w-full accent-ring-gold h-1.5 bg-oled-darker rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-text-secondary">Baseline Daytime Resting HR</span>
              <span className="text-stage-hr font-bold">{localSettings.baselineRHR} bpm</span>
            </div>
            <input
              type="range"
              min="45"
              max="90"
              step="1"
              value={localSettings.baselineRHR}
              onChange={e => setLocalSettings({ ...localSettings, baselineRHR: parseInt(e.target.value, 10) })}
              className="w-full accent-stage-hr h-1.5 bg-oled-darker rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Target Bedtime</label>
              <input
                type="time"
                value={localSettings.targetBedtime}
                onChange={e => setLocalSettings({ ...localSettings, targetBedtime: e.target.value })}
                className="w-full bg-oled-darker border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-stage-light font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Target Wake Time</label>
              <input
                type="time"
                value={localSettings.targetWakeTime}
                onChange={e => setLocalSettings({ ...localSettings, targetWakeTime: e.target.value })}
                className="w-full bg-oled-darker border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-stage-light font-bold"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all text-xs"
        >
          {saveSuccess ? '✓ Goals Saved!' : 'Save Preferences'}
        </button>
      </form>

      {/* 4. Data Backup & Export */}
      <div className="bg-oled-card rounded-[22px] p-5 border border-oled-cardBorder shadow-card space-y-3.5">
        <h2 className="text-[15px] font-bold text-text-primary">
          Data Backup & Portability
        </h2>
        <p className="text-xs text-text-secondary">
          100% private and local-first. All data is saved on your device. You can export full JSON backups or CSV files at any time.
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleExportJSON}
            className="p-3 bg-oled-darker hover:bg-oled-subtle border border-white/10 rounded-xl text-left transition-all group"
          >
            <span className="text-lg block mb-1">📥</span>
            <span className="text-xs font-bold text-white block group-hover:text-stage-light">Export JSON</span>
            <span className="text-[10px] text-text-secondary">Full app backup</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="p-3 bg-oled-darker hover:bg-oled-subtle border border-white/10 rounded-xl text-left transition-all group"
          >
            <span className="text-lg block mb-1">📊</span>
            <span className="text-xs font-bold text-white block group-hover:text-stage-light">Export CSV</span>
            <span className="text-[10px] text-text-secondary">Excel & Sheets data</span>
          </button>
        </div>

        <div className="pt-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 bg-oled-darker hover:bg-oled-subtle border border-dashed border-white/20 hover:border-stage-light text-text-primary hover:text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>📤</span> Import JSON Backup File
          </button>
        </div>
      </div>

      {/* 5. Demo Data & Reset */}
      <div className="bg-oled-card rounded-[22px] p-5 border border-oled-cardBorder shadow-card space-y-3">
        <h2 className="text-[15px] font-bold text-text-primary">
          Sample Data & Reset
        </h2>

        <div className="space-y-2">
          <button
            onClick={() => {
              onLoadDemoData();
              setStatusMessage('Loaded 14-day AutoSleep sample dataset!');
            }}
            className="w-full py-2.5 bg-ring-gold/10 hover:bg-ring-gold/20 text-ring-gold border border-ring-gold/30 font-bold rounded-xl text-xs transition-all"
          >
            ⚡ Reload 14-Day AutoSleep Sample Dataset
          </button>

          <button
            onClick={handleReset}
            className="w-full py-2.5 bg-stage-hr/10 hover:bg-stage-hr/20 text-stage-hr border border-stage-hr/30 font-bold rounded-xl text-xs transition-all"
          >
            🗑️ Clear Current User Data
          </button>
        </div>
      </div>

      {/* App Info Footer */}
      <div className="text-center py-2 text-xs text-text-secondary/70">
        <p className="font-bold text-white/80">AutoRest v1.0.0</p>
        <p className="text-[10px] mt-0.5">Open Source • 100% Client-Side Privacy • Zero Server Costs</p>
      </div>
    </div>
  );
};
