import { SleepSession, UserSettings, UserProfile } from '../types/sleep';
import { generate14DaySampleDataset, DEFAULT_USER_SETTINGS } from './sampleData';

const STORAGE_KEY_PROFILES = 'autorest_profiles_v1';
const STORAGE_KEY_ACTIVE_PROFILE = 'autorest_active_profile_id';
const STORAGE_KEY_SESSIONS_PREFIX = 'autorest_sessions_';
const STORAGE_KEY_SETTINGS_PREFIX = 'autorest_settings_';

const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'user-default-1',
    name: 'Alex (Main)',
    avatarEmoji: '⚡',
    targetSleepHours: 8.0,
    baselineRHR: 65,
    targetBedtime: '23:00',
    targetWakeTime: '07:00',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-default-2',
    name: 'Sarah (Partner)',
    avatarEmoji: '🌙',
    targetSleepHours: 7.5,
    baselineRHR: 60,
    targetBedtime: '22:30',
    targetWakeTime: '06:00',
    createdAt: new Date().toISOString()
  }
];

export function getProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (!raw) {
      saveProfiles(DEFAULT_PROFILES);
      return DEFAULT_PROFILES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveProfiles(DEFAULT_PROFILES);
    return DEFAULT_PROFILES;
  } catch (err) {
    console.error('Failed to load profiles:', err);
    return DEFAULT_PROFILES;
  }
}

export function saveProfiles(profiles: UserProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch (err) {
    console.error('Failed to save profiles:', err);
  }
}

export function getActiveProfileId(): string {
  try {
    const active = localStorage.getItem(STORAGE_KEY_ACTIVE_PROFILE);
    const profiles = getProfiles();
    if (active && profiles.some(p => p.id === active)) {
      return active;
    }
    const fallback = profiles[0]?.id || 'user-default-1';
    setActiveProfileId(fallback);
    return fallback;
  } catch {
    return 'user-default-1';
  }
}

export function setActiveProfileId(profileId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_PROFILE, profileId);
  } catch (err) {
    console.error('Failed to set active profile:', err);
  }
}

export function createProfile(name: string, avatarEmoji: string = '👤', targetSleepHours: number = 8.0, baselineRHR: number = 65): UserProfile {
  const profiles = getProfiles();
  const newProfile: UserProfile = {
    id: `profile-${Date.now()}`,
    name: name.trim() || 'New User',
    avatarEmoji: avatarEmoji || '👤',
    targetSleepHours,
    baselineRHR,
    targetBedtime: '23:00',
    targetWakeTime: '07:00',
    createdAt: new Date().toISOString()
  };

  const updated = [...profiles, newProfile];
  saveProfiles(updated);
  setActiveProfileId(newProfile.id);

  // Initialize with sample data for the new user
  const initialSessions = generate14DaySampleDataset();
  saveSessions(initialSessions, newProfile.id);

  return newProfile;
}

export function deleteProfile(profileId: string): UserProfile[] {
  const profiles = getProfiles();
  if (profiles.length <= 1) {
    alert('Cannot delete the only profile.');
    return profiles;
  }
  const updated = profiles.filter(p => p.id !== profileId);
  saveProfiles(updated);

  // Clean up user's data
  localStorage.removeItem(`${STORAGE_KEY_SESSIONS_PREFIX}${profileId}`);
  localStorage.removeItem(`${STORAGE_KEY_SETTINGS_PREFIX}${profileId}`);

  // Switch to first remaining profile if active profile was deleted
  if (getActiveProfileId() === profileId) {
    setActiveProfileId(updated[0].id);
  }
  return updated;
}

export function getStoredSessions(profileId?: string): SleepSession[] {
  const activeId = profileId || getActiveProfileId();
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_SESSIONS_PREFIX}${activeId}`);
    if (!raw) {
      const initial = generate14DaySampleDataset();
      saveSessions(initial, activeId);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    const initial = generate14DaySampleDataset();
    saveSessions(initial, activeId);
    return initial;
  } catch (err) {
    console.error('Failed to load sessions:', err);
    return generate14DaySampleDataset();
  }
}

export function saveSessions(sessions: SleepSession[], profileId?: string): void {
  const activeId = profileId || getActiveProfileId();
  try {
    localStorage.setItem(`${STORAGE_KEY_SESSIONS_PREFIX}${activeId}`, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save sessions:', err);
  }
}

export function getStoredSettings(profileId?: string): UserSettings {
  const activeId = profileId || getActiveProfileId();
  const profiles = getProfiles();
  const profile = profiles.find(p => p.id === activeId);

  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_SETTINGS_PREFIX}${activeId}`);
    if (!raw) {
      const defaults: UserSettings = {
        ...DEFAULT_USER_SETTINGS,
        targetSleepHours: profile?.targetSleepHours || 8.0,
        baselineRHR: profile?.baselineRHR || 65,
        name: profile?.name || 'Sleep Explorer'
      };
      saveSettings(defaults, activeId);
      return defaults;
    }
    return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load settings:', err);
    return DEFAULT_USER_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings, profileId?: string): void {
  const activeId = profileId || getActiveProfileId();
  try {
    localStorage.setItem(`${STORAGE_KEY_SETTINGS_PREFIX}${activeId}`, JSON.stringify(settings));

    // Also sync to profile metadata
    const profiles = getProfiles();
    const idx = profiles.findIndex(p => p.id === activeId);
    if (idx >= 0) {
      profiles[idx].targetSleepHours = settings.targetSleepHours;
      profiles[idx].baselineRHR = settings.baselineRHR;
      profiles[idx].targetBedtime = settings.targetBedtime;
      profiles[idx].targetWakeTime = settings.targetWakeTime;
      if (settings.name) profiles[idx].name = settings.name;
      saveProfiles(profiles);
    }
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function exportBackupJSON(profileId?: string): string {
  const activeId = profileId || getActiveProfileId();
  const data = {
    version: 2,
    exportedAt: new Date().toISOString(),
    profileId: activeId,
    profiles: getProfiles(),
    settings: getStoredSettings(activeId),
    sessions: getStoredSessions(activeId)
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonStr: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || !Array.isArray(data.sessions)) {
      return { success: false, message: 'Invalid backup file format: missing sessions list.' };
    }
    const activeId = getActiveProfileId();
    saveSessions(data.sessions, activeId);
    if (data.settings) {
      saveSettings(data.settings, activeId);
    }
    if (data.profiles && Array.isArray(data.profiles)) {
      saveProfiles(data.profiles);
    }
    return { success: true, message: `Successfully restored ${data.sessions.length} sleep sessions!` };
  } catch (err) {
    return { success: false, message: 'JSON syntax error: Unable to parse backup file.' };
  }
}

export function exportSessionsToCSV(sessions: SleepSession[]): string {
  const headers = [
    'Date',
    'Bedtime',
    'WakeTime',
    'TimeInBedMinutes',
    'TimeAsleepMinutes',
    'SleepRating',
    'SleepEfficiencyPercent',
    'DeepMinutes',
    'LightMinutes',
    'StillMinutes',
    'AwakeMinutes',
    'RestingHeartRate',
    'WakeMood',
    'Tags',
    'Notes'
  ];

  const rows = sessions.map(s => [
    s.date,
    s.bedtime,
    s.wakeTime,
    s.timeInBedMinutes,
    s.timeAsleepMinutes,
    s.sleepRating,
    s.sleepEfficiency,
    s.deepMinutes,
    s.lightMinutes,
    s.stillMinutes,
    s.awakeMinutes,
    s.restingHeartRate,
    s.wakeMood || '',
    (s.tags || []).join(';'),
    `"${(s.notes || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function clearAllData(profileId?: string): void {
  const activeId = profileId || getActiveProfileId();
  localStorage.removeItem(`${STORAGE_KEY_SESSIONS_PREFIX}${activeId}`);
  localStorage.removeItem(`${STORAGE_KEY_SETTINGS_PREFIX}${activeId}`);
}
