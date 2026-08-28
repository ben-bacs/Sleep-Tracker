import { SleepSession, UserSettings } from '../types/sleep';
import { generate14DaySampleDataset, DEFAULT_USER_SETTINGS } from './sampleData';

const STORAGE_KEY_SESSIONS = 'autorest_sleep_sessions_v1';
const STORAGE_KEY_SETTINGS = 'autorest_user_settings_v1';

export function getStoredSessions(): SleepSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!raw) {
      const initial = generate14DaySampleDataset();
      saveSessions(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const initial = generate14DaySampleDataset();
    saveSessions(initial);
    return initial;
  } catch (err) {
    console.error('Failed to load sessions from storage:', err);
    return generate14DaySampleDataset();
  }
}

export function saveSessions(sessions: SleepSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save sessions to storage:', err);
  }
}

export function getStoredSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
      saveSettings(DEFAULT_USER_SETTINGS);
      return DEFAULT_USER_SETTINGS;
    }
    return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load settings:', err);
    return DEFAULT_USER_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function exportBackupJSON(): string {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: getStoredSettings(),
    sessions: getStoredSessions()
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonStr: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || !Array.isArray(data.sessions)) {
      return { success: false, message: 'Invalid backup file format: missing sessions list.' };
    }
    saveSessions(data.sessions);
    if (data.settings) {
      saveSettings(data.settings);
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

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY_SESSIONS);
  localStorage.removeItem(STORAGE_KEY_SETTINGS);
}

