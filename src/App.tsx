import React, { useState, useEffect } from 'react';
import { SleepSession, UserSettings } from './types/sleep';
import {
  getStoredSessions,
  saveSessions,
  getStoredSettings,
  saveSettings
} from './services/storage';
import { generate14DaySampleDataset } from './services/sampleData';
import { calculate14DaySleepBank, calculateReadinessScore } from './services/sleepEngine';
import { BackgroundGears } from './components/common/BackgroundGears';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { TodayView } from './components/views/TodayView';
import { ClockView } from './components/views/ClockView';
import { HistoryView } from './components/views/HistoryView';
import { DayEditView } from './components/views/DayEditView';
import { SettingsView } from './components/views/SettingsView';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('today');
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings());
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number>(0);
  const [editingSession, setEditingSession] = useState<SleepSession | null>(null);

  // Load initial data
  useEffect(() => {
    const loadedSessions = getStoredSessions();
    setSessions(loadedSessions);
    setSettings(getStoredSettings());
  }, []);

  const handleSaveSessions = (newSessions: SleepSession[]) => {
    setSessions(newSessions);
    saveSessions(newSessions);
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleLoadDemoData = () => {
    const demo = generate14DaySampleDataset();
    handleSaveSessions(demo);
    setSelectedSessionIndex(0);
  };

  const handleAddOrUpdateSession = (session: SleepSession) => {
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    let updated: SleepSession[];
    if (existingIndex >= 0) {
      updated = [...sessions];
      updated[existingIndex] = session;
    } else {
      updated = [session, ...sessions];
    }
    // Sort by date descending
    updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    handleSaveSessions(updated);
    setSelectedSessionIndex(0);
    setCurrentTab('today');
  };

  const handleDeleteSession = (sessionId: string) => {
    const updated = sessions.filter(s => s.id !== sessionId);
    handleSaveSessions(updated);
    setSelectedSessionIndex(0);
  };

  const handleOpenLogger = (session?: SleepSession) => {
    setEditingSession(session || null);
    setCurrentTab('edit');
  };

  const handleSelectSessionFromHistory = (session: SleepSession) => {
    const idx = sessions.findIndex(s => s.id === session.id);
    if (idx >= 0) {
      setSelectedSessionIndex(idx);
      setCurrentTab('today');
    }
  };

  const handleDateShift = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedSessionIndex < sessions.length - 1) {
      setSelectedSessionIndex(selectedSessionIndex + 1);
    } else if (direction === 'next' && selectedSessionIndex > 0) {
      setSelectedSessionIndex(selectedSessionIndex - 1);
    }
  };

  const currentSession: SleepSession | undefined = sessions[selectedSessionIndex] || sessions[0];
  const sleepBank = calculate14DaySleepBank(sessions, settings.targetSleepHours);
  const readiness = calculateReadinessScore(currentSession, sleepBank);

  const todayDate = new Date();
  const todayDateNumber = todayDate.getDate();
  const todayDayShort = todayDate.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="min-h-screen bg-oled text-text-primary flex justify-center relative overflow-x-hidden">
      {/* Background Decorative Animated Gears */}
      <BackgroundGears />

      {/* Main Responsive Mobile Frame (centered on desktop, edge-to-edge on mobile) */}
      <main className="w-full max-w-md min-h-screen px-4 pt-4 pb-20 relative z-10">
        {currentTab === 'today' && currentSession && (
          <TodayView
            currentSession={currentSession}
            allSessions={sessions}
            settings={settings}
            sleepBank={sleepBank}
            readiness={readiness}
            onOpenLogger={handleOpenLogger}
            onSelectDate={handleDateShift}
            hasPrevDate={selectedSessionIndex < sessions.length - 1}
            hasNextDate={selectedSessionIndex > 0}
          />
        )}

        {currentTab === 'clock' && (
          <ClockView />
        )}

        {currentTab === 'history' && (
          <HistoryView
            sessions={sessions}
            settings={settings}
            onSelectSession={handleSelectSessionFromHistory}
          />
        )}

        {currentTab === 'edit' && (
          <DayEditView
            editingSession={editingSession}
            settings={settings}
            onSaveSession={handleAddOrUpdateSession}
            onDeleteSession={handleDeleteSession}
            onLoadDemoData={handleLoadDemoData}
            onClose={() => setCurrentTab('today')}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            sessions={sessions}
            onSaveSettings={handleSaveSettings}
            onRefreshData={() => {
              setSessions(getStoredSessions());
              setSettings(getStoredSettings());
            }}
            onLoadDemoData={handleLoadDemoData}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'edit') setEditingSession(null);
          setCurrentTab(tab);
        }}
        todayDateNumber={todayDateNumber}
        todayDayShort={todayDayShort}
      />
    </div>
  );
};
export default App;

