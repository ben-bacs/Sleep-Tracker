import React, { useState, useEffect } from 'react';
import { SleepSession, UserSettings, UserProfile } from './types/sleep';
import {
  getProfiles,
  getActiveProfileId,
  setActiveProfileId,
  createProfile,
  deleteProfile,
  getStoredSessions,
  saveSessions,
  getStoredSettings,
  saveSettings
} from './services/storage';
import { generate14DaySampleDataset } from './services/sampleData';
import { calculate14DaySleepBank, calculateReadinessScore, generateRealisticHypnogram } from './services/sleepEngine';
import { BackgroundGears } from './components/common/BackgroundGears';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { UserProfileModal } from './components/common/UserProfileModal';
import { TodayView } from './components/views/TodayView';
import { ClockView } from './components/views/ClockView';
import { HistoryView } from './components/views/HistoryView';
import { DayEditView } from './components/views/DayEditView';
import { SettingsView } from './components/views/SettingsView';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('today');
  const [profiles, setProfiles] = useState<UserProfile[]>(getProfiles());
  const [activeProfileId, setActiveProfileIdState] = useState<string>(getActiveProfileId());
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings(activeProfileId));
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [editingSession, setEditingSession] = useState<SleepSession | null>(null);
  const [loggerTargetDate, setLoggerTargetDate] = useState<string | undefined>(undefined);

  // Load profile-specific data
  const loadUserData = (profileId: string) => {
    const loadedSessions = getStoredSessions(profileId);
    const loadedSettings = getStoredSettings(profileId);
    setSessions(loadedSessions);
    setSettings(loadedSettings);
    if (loadedSessions.length > 0) {
      setSelectedDate(loadedSessions[0].date);
    } else {
      setSelectedDate(new Date().toISOString().split('T')[0]);
    }
  };

  useEffect(() => {
    loadUserData(activeProfileId);
  }, [activeProfileId]);

  const handleSelectProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    setActiveProfileIdState(profileId);
    loadUserData(profileId);
  };

  const handleCreateProfile = (name: string, avatar: string, targetHours: number, rhr: number) => {
    const newProfile = createProfile(name, avatar, targetHours, rhr);
    setProfiles(getProfiles());
    handleSelectProfile(newProfile.id);
  };

  const handleDeleteProfile = (profileId: string) => {
    const updated = deleteProfile(profileId);
    setProfiles(updated);
    const nextActive = getActiveProfileId();
    handleSelectProfile(nextActive);
  };

  const handleSaveSessions = (newSessions: SleepSession[]) => {
    setSessions(newSessions);
    saveSessions(newSessions, activeProfileId);
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings, activeProfileId);
    setProfiles(getProfiles());
  };

  const handleLoadDemoData = () => {
    const demo = generate14DaySampleDataset();
    handleSaveSessions(demo);
    setSelectedDate(demo[0]?.date || new Date().toISOString().split('T')[0]);
  };

  const handleAddOrUpdateSession = (session: SleepSession) => {
    const existingIndex = sessions.findIndex(s => s.id === session.id || s.date === session.date);
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
    setSelectedDate(session.date);
    setCurrentTab('today');
  };

  const handleDeleteSession = (sessionId: string) => {
    const updated = sessions.filter(s => s.id !== sessionId);
    handleSaveSessions(updated);
    if (updated.length > 0) {
      setSelectedDate(updated[0].date);
    }
  };

  const handleOpenLogger = (session?: SleepSession, forDate?: string) => {
    setEditingSession(session || null);
    setLoggerTargetDate(forDate || selectedDate);
    setCurrentTab('edit');
  };

  const handleSelectSessionFromHistory = (session: SleepSession) => {
    setSelectedDate(session.date);
    setCurrentTab('today');
  };

  const handleQuickSimulateDate = (dateStr: string) => {
    const sessionDate = new Date(dateStr);
    const bedtime = new Date(sessionDate);
    bedtime.setDate(bedtime.getDate() - 1);
    bedtime.setHours(23, 15, 0, 0);

    const wakeTime = new Date(sessionDate);
    wakeTime.setHours(7, 0, 0, 0);

    const sim = generateRealisticHypnogram(bedtime, wakeTime, settings.baselineRHR);
    const dayName = sessionDate.toLocaleDateString('en-US', { weekday: 'short' });
    const prevDayName = bedtime.toLocaleDateString('en-US', { weekday: 'short' });

    const newSession: SleepSession = {
      id: `sim-session-${Date.now()}`,
      date: dateStr,
      displayDateLabel: `${prevDayName.toUpperCase()} → ${dayName.toUpperCase()}`,
      bedtime: bedtime.toISOString(),
      wakeTime: wakeTime.toISOString(),
      timeInBedMinutes: sim.timeInBedMinutes,
      timeAsleepMinutes: sim.timeAsleepMinutes,
      awakeMinutes: sim.awakeMinutes,
      lightMinutes: sim.lightMinutes,
      stillMinutes: sim.stillMinutes,
      deepMinutes: sim.deepMinutes,
      restingHeartRate: settings.baselineRHR,
      sleepRating: 88,
      sleepEfficiency: 88.5,
      stages: sim.stages,
      heartRateSeries: sim.heartRateSeries,
      tags: ['reading', 'cold_room'],
      wakeMood: 4,
      isSimulated: true
    };

    handleAddOrUpdateSession(newSession);
  };

  // Find session for currently selected date
  const currentSession = sessions.find(s => s.date === selectedDate);
  const currentSessionIndex = sessions.findIndex(s => s.date === selectedDate);

  const handleDateShift = (direction: 'prev' | 'next') => {
    if (currentSessionIndex >= 0) {
      if (direction === 'prev' && currentSessionIndex < sessions.length - 1) {
        setSelectedDate(sessions[currentSessionIndex + 1].date);
      } else if (direction === 'next' && currentSessionIndex > 0) {
        setSelectedDate(sessions[currentSessionIndex - 1].date);
      }
    } else {
      // Step by 1 calendar day
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + (direction === 'next' ? 1 : -1));
      setSelectedDate(d.toISOString().split('T')[0]);
    }
  };

  const sleepBank = calculate14DaySleepBank(sessions, settings.targetSleepHours);
  const readiness = calculateReadinessScore(currentSession, sleepBank);
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  const todayDate = new Date();
  const todayDateNumber = todayDate.getDate();
  const todayDayShort = todayDate.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="min-h-screen bg-oled text-text-primary flex justify-center relative overflow-x-hidden">
      {/* Background Decorative Animated Gears */}
      <BackgroundGears />

      {/* User Profile Switcher Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={handleSelectProfile}
        onCreateProfile={handleCreateProfile}
        onDeleteProfile={handleDeleteProfile}
      />

      {/* Main Responsive Mobile Frame */}
      <main className="w-full max-w-md min-h-screen px-4 pt-4 pb-20 relative z-10">
        {currentTab === 'today' && (
          <TodayView
            currentSession={currentSession}
            selectedDate={selectedDate}
            onSelectCustomDate={(dateStr) => setSelectedDate(dateStr)}
            activeProfile={activeProfile}
            onOpenProfileModal={() => setShowProfileModal(true)}
            allSessions={sessions}
            settings={settings}
            sleepBank={sleepBank}
            readiness={readiness}
            onOpenLogger={handleOpenLogger}
            onSelectDate={handleDateShift}
            onQuickSimulateDate={handleQuickSimulateDate}
            hasPrevDate={currentSessionIndex >= 0 ? currentSessionIndex < sessions.length - 1 : true}
            hasNextDate={currentSessionIndex >= 0 ? currentSessionIndex > 0 : true}
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
            targetDate={loggerTargetDate}
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
            profiles={profiles}
            activeProfileId={activeProfileId}
            onOpenProfileModal={() => setShowProfileModal(true)}
            onSaveSettings={handleSaveSettings}
            onRefreshData={() => {
              loadUserData(activeProfileId);
              setProfiles(getProfiles());
            }}
            onLoadDemoData={handleLoadDemoData}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'edit') {
            setEditingSession(null);
            setLoggerTargetDate(selectedDate);
          }
          setCurrentTab(tab);
        }}
        todayDateNumber={todayDateNumber}
        todayDayShort={todayDayShort}
      />
    </div>
  );
};
export default App;
