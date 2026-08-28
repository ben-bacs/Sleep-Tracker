export type SleepStage = 'awake' | 'light' | 'still' | 'deep';

export interface SleepStageSegment {
  id: string;
  startTime: string; // ISO string or HH:mm
  endTime: string;   // ISO string or HH:mm
  stage: SleepStage;
  durationMinutes: number;
}

export interface HeartRatePoint {
  time: string; // ISO or HH:mm
  bpm: number;
}

export type LifestyleTag =
  | 'caffeine'
  | 'alcohol'
  | 'late_exercise'
  | 'screen_time'
  | 'meditation'
  | 'melatonin'
  | 'heavy_meal'
  | 'reading'
  | 'cold_room'
  | 'stress';

export interface TagInfo {
  id: LifestyleTag;
  label: string;
  emoji: string;
  category: 'positive' | 'negative' | 'neutral';
}

export interface SleepSession {
  id: string;
  date: string; // YYYY-MM-DD (session wake date)
  displayDateLabel?: string; // e.g. "15 MONDAY → 16 TUESDAY"
  bedtime: string; // ISO string
  wakeTime: string; // ISO string
  timeInBedMinutes: number; // e.g. 443 = 7h 23m
  timeAsleepMinutes: number; // e.g. 369 = 6h 9m
  awakeMinutes: number;
  lightMinutes: number;
  stillMinutes: number;
  deepMinutes: number;
  restingHeartRate: number; // e.g. 64 bpm
  sleepRating: number; // 0-100 composite score (e.g. 92)
  sleepEfficiency: number; // e.g. 83.3%
  stages: SleepStageSegment[];
  heartRateSeries: HeartRatePoint[];
  tags: LifestyleTag[];
  wakeMood?: 1 | 2 | 3 | 4 | 5; // 1: 😫, 2: 🥱, 3: 😐, 4: 😊, 5: ⚡
  notes?: string;
  isSimulated?: boolean;
}

export interface UserSettings {
  targetSleepHours: number; // default: 8.0
  targetBedtime: string; // "23:00"
  targetWakeTime: string; // "07:00"
  baselineRHR: number; // default: 65 bpm
  name?: string;
  theme?: 'oled' | 'midnight';
}

export interface SleepBankDebt {
  rollingDebtHours: number;
  debtPercentage: number; // e.g. 30.3% debt
  isSurplus: boolean;
  rawDebtMinutes: number;
}

export interface DailyReadiness {
  score: number; // 0 - 100
  level: 'Optimal' | 'Good' | 'Moderate' | 'Low' | 'Critical';
  summary: string;
  advice: string;
}

export interface TagCorrelation {
  tag: LifestyleTag;
  count: number;
  avgRatingWith: number;
  avgRatingWithout: number;
  diff: number;
  impact: 'positive' | 'negative' | 'neutral';
}

