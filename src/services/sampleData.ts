import { SleepSession, UserSettings } from '../types/sleep';
import { generateRealisticHypnogram } from './sleepEngine';

export const DEFAULT_USER_SETTINGS: UserSettings = {
  targetSleepHours: 8.0,
  targetBedtime: '23:00',
  targetWakeTime: '07:00',
  baselineRHR: 65,
  name: 'Sleep Explorer',
  theme: 'oled'
};

/**
 * Creates the exact reference session from the AutoSleep iOS screenshot
 */
export function getHeroSession(): SleepSession {
  const baseDate = new Date();
  const dateStr = baseDate.toISOString().split('T')[0];

  const bedtime = new Date(baseDate);
  bedtime.setHours(23, 28, 0, 0); // 11:28 PM

  const wakeTime = new Date(baseDate);
  wakeTime.setDate(wakeTime.getDate() + 1);
  wakeTime.setHours(6, 51, 0, 0); // 6:51 AM

  const { stages, heartRateSeries } = generateRealisticHypnogram(bedtime, wakeTime, 64);

  return {
    id: 'hero-session-001',
    date: dateStr,
    displayDateLabel: '15 MONDAY → 16 TUESDAY',
    bedtime: bedtime.toISOString(),
    wakeTime: wakeTime.toISOString(),
    timeInBedMinutes: 443, // 7h 23m
    timeAsleepMinutes: 369, // 6h 9m
    awakeMinutes: 74, // 1h 14m
    lightMinutes: 260, // 4h 20m quality/light
    stillMinutes: 80,  // 1h 20m restful still
    deepMinutes: 29,
    restingHeartRate: 64,
    sleepRating: 92,
    sleepEfficiency: 83.3,
    stages,
    heartRateSeries,
    tags: ['reading', 'cold_room'],
    wakeMood: 4,
    notes: 'Felt well-rested despite waking up early for morning run.'
  };
}

/**
 * Generates 14 days of realistic sample sleep logs for new users
 */
export function generate14DaySampleDataset(): SleepSession[] {
  const sessions: SleepSession[] = [];
  const hero = getHeroSession();
  sessions.push(hero);

  const dayOffsets = [
    { daysAgo: 1, durationH: 7.2, deepMin: 90, rhr: 63, rating: 89, tags: ['meditation', 'reading'] },
    { daysAgo: 2, durationH: 6.5, deepMin: 70, rhr: 66, rating: 78, tags: ['caffeine', 'screen_time'] },
    { daysAgo: 3, durationH: 7.8, deepMin: 110, rhr: 62, rating: 94, tags: ['cold_room', 'reading'] },
    { daysAgo: 4, durationH: 5.8, deepMin: 45, rhr: 70, rating: 68, tags: ['alcohol', 'heavy_meal', 'stress'] },
    { daysAgo: 5, durationH: 8.1, deepMin: 120, rhr: 61, rating: 96, tags: ['meditation', 'cold_room'] },
    { daysAgo: 6, durationH: 7.0, deepMin: 85, rhr: 65, rating: 84, tags: ['late_exercise'] },
    { daysAgo: 7, durationH: 6.8, deepMin: 75, rhr: 64, rating: 81, tags: ['screen_time'] },
    { daysAgo: 8, durationH: 7.5, deepMin: 95, rhr: 63, rating: 91, tags: ['reading'] },
    { daysAgo: 9, durationH: 6.2, deepMin: 60, rhr: 67, rating: 75, tags: ['caffeine', 'stress'] },
    { daysAgo: 10, durationH: 8.0, deepMin: 105, rhr: 62, rating: 95, tags: ['meditation'] },
    { daysAgo: 11, durationH: 7.3, deepMin: 88, rhr: 64, rating: 87, tags: ['cold_room'] },
    { daysAgo: 12, durationH: 5.5, deepMin: 40, rhr: 72, rating: 62, tags: ['alcohol', 'late_exercise'] },
    { daysAgo: 13, durationH: 7.7, deepMin: 100, rhr: 63, rating: 92, tags: ['melatonin', 'reading'] },
  ];

  const now = new Date();

  dayOffsets.forEach((item, index) => {
    const sessionDate = new Date(now);
    sessionDate.setDate(sessionDate.getDate() - item.daysAgo);
    const dateStr = sessionDate.toISOString().split('T')[0];

    const bedtime = new Date(sessionDate);
    bedtime.setDate(bedtime.getDate() - 1);
    bedtime.setHours(23, Math.floor(Math.random() * 40), 0, 0);

    const wakeTime = new Date(sessionDate);
    const wakeHour = 6 + Math.floor(item.durationH - 6);
    const wakeMin = Math.round((item.durationH % 1) * 60);
    wakeTime.setHours(wakeHour, wakeMin, 0, 0);

    const timeAsleepMinutes = Math.round(item.durationH * 60);
    const timeInBedMinutes = timeAsleepMinutes + Math.round(35 + Math.random() * 30);
    const awakeMinutes = timeInBedMinutes - timeAsleepMinutes;
    const stillMinutes = Math.round(timeAsleepMinutes * 0.22);
    const lightMinutes = timeAsleepMinutes - item.deepMin - stillMinutes;

    const { stages, heartRateSeries } = generateRealisticHypnogram(bedtime, wakeTime, item.rhr);

    const dayName = sessionDate.toLocaleDateString('en-US', { weekday: 'short' });
    const prevDayName = new Date(bedtime).toLocaleDateString('en-US', { weekday: 'short' });

    sessions.push({
      id: `sample-session-${index + 2}`,
      date: dateStr,
      displayDateLabel: `${prevDayName.toUpperCase()} → ${dayName.toUpperCase()}`,
      bedtime: bedtime.toISOString(),
      wakeTime: wakeTime.toISOString(),
      timeInBedMinutes,
      timeAsleepMinutes,
      awakeMinutes,
      lightMinutes,
      stillMinutes,
      deepMinutes: item.deepMin,
      restingHeartRate: item.rhr,
      sleepRating: item.rating,
      sleepEfficiency: parseFloat(((timeAsleepMinutes / timeInBedMinutes) * 100).toFixed(1)),
      stages,
      heartRateSeries,
      tags: item.tags as any,
      wakeMood: item.rating > 85 ? 4 : item.rating > 70 ? 3 : 2,
      notes: index % 3 === 0 ? 'Standard sleep cycle, felt refreshed.' : undefined
    });
  });

  return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

