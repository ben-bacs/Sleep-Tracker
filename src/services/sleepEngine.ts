import {
  SleepStage,
  SleepSession,
  SleepStageSegment,
  HeartRatePoint,
  SleepBankDebt,
  DailyReadiness,
  TagCorrelation,
  LifestyleTag,
  TagInfo
} from '../types/sleep';

export const AVAILABLE_TAGS: TagInfo[] = [
  { id: 'caffeine', label: 'Caffeine < 6h', emoji: '☕', category: 'negative' },
  { id: 'alcohol', label: 'Alcohol', emoji: '🍷', category: 'negative' },
  { id: 'late_exercise', label: 'Late Workout', emoji: '🏃', category: 'neutral' },
  { id: 'screen_time', label: 'Screen Late', emoji: '📱', category: 'negative' },
  { id: 'meditation', label: 'Meditation', emoji: '🧘', category: 'positive' },
  { id: 'melatonin', label: 'Melatonin', emoji: '💊', category: 'neutral' },
  { id: 'heavy_meal', label: 'Heavy Meal', emoji: '🍕', category: 'negative' },
  { id: 'reading', label: 'Book Reading', emoji: '📖', category: 'positive' },
  { id: 'cold_room', label: 'Cold Room', emoji: '❄️', category: 'positive' },
  { id: 'stress', label: 'High Stress', emoji: '⚡', category: 'negative' },
];

/**
 * Calculates a composite 0-100 Sleep Rating
 * Weights: Duration 35%, Deep Quality 30%, Efficiency 20%, Resting HR Dip 15%
 */
export function calculateSleepRating(
  timeAsleepMinutes: number,
  timeInBedMinutes: number,
  deepMinutes: number,
  restingHR: number,
  targetHours: number = 8.0,
  baselineRHR: number = 65
): number {
  if (timeInBedMinutes <= 0 || timeAsleepMinutes <= 0) return 0;

  const targetMinutes = targetHours * 60;

  // 1. Duration Score (35% weight)
  const durationRatio = timeAsleepMinutes / targetMinutes;
  const durationScore = Math.min(100, durationRatio * 100);

  // 2. Quality/Deep Sleep Score (30% weight) - Target >= 20% of total sleep is 100 points
  const deepRatio = deepMinutes / Math.max(1, timeAsleepMinutes);
  const deepScore = Math.min(100, (deepRatio / 0.20) * 100);

  // 3. Efficiency Score (20% weight) - Target >= 90%
  const efficiency = (timeAsleepMinutes / timeInBedMinutes) * 100;
  const efficiencyScore = Math.min(100, (efficiency / 90) * 100);

  // 4. Resting HR Dip Score (15% weight) - 10-15% nocturnal dip is optimal
  const hrDipPercent = baselineRHR > 0 ? ((baselineRHR - restingHR) / baselineRHR) * 100 : 10;
  let hrScore = 80;
  if (hrDipPercent >= 8 && hrDipPercent <= 18) {
    hrScore = 100;
  } else if (hrDipPercent > 0) {
    hrScore = 85;
  } else {
    hrScore = 65; // Elevated HR
  }

  const composite = (
    (durationScore * 0.35) +
    (deepScore * 0.30) +
    (efficiencyScore * 0.20) +
    (hrScore * 0.15)
  );

  return Math.max(10, Math.min(100, Math.round(composite)));
}

/**
 * Calculates the 14-day rolling Sleep Bank debt & percentage
 */
export function calculate14DaySleepBank(
  sessions: SleepSession[],
  targetHours: number = 8.0
): SleepBankDebt {
  const targetMinutesDaily = targetHours * 60;
  const daysWindow = 14;

  // Sort sessions by date descending
  const sorted = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const windowSessions = sorted.slice(0, daysWindow);

  if (windowSessions.length === 0) {
    return {
      rollingDebtHours: 0,
      debtPercentage: 0,
      isSurplus: false,
      rawDebtMinutes: 0
    };
  }

  let totalDeficitMinutes = 0;
  let totalSurplusMinutes = 0;

  windowSessions.forEach(session => {
    const diff = session.timeAsleepMinutes - targetMinutesDaily;
    if (diff < 0) {
      totalDeficitMinutes += Math.abs(diff);
    } else {
      // 50% surplus recovery credit
      totalSurplusMinutes += diff * 0.5;
    }
  });

  const netDebtMinutes = Math.max(0, totalDeficitMinutes - totalSurplusMinutes);
  const totalTargetMinutesInWindow = windowSessions.length * targetMinutesDaily;

  const debtPercentage = totalTargetMinutesInWindow > 0
    ? (netDebtMinutes / totalTargetMinutesInWindow) * 100
    : 0;

  const rollingDebtHours = parseFloat((netDebtMinutes / 60).toFixed(1));

  return {
    rollingDebtHours,
    debtPercentage: parseFloat(debtPercentage.toFixed(1)),
    isSurplus: netDebtMinutes === 0 && totalSurplusMinutes > 0,
    rawDebtMinutes: netDebtMinutes
  };
}

/**
 * Calculates Daily Physiological Readiness
 */
export function calculateReadinessScore(
  todaySession: SleepSession | undefined,
  sleepBank: SleepBankDebt
): DailyReadiness {
  if (!todaySession) {
    return {
      score: 75,
      level: 'Good',
      summary: 'Baseline Readiness',
      advice: 'Log your sleep to get precise recovery insights.'
    };
  }

  // Debt impact (0-50 pts)
  const debtPenalty = Math.min(50, sleepBank.debtPercentage * 1.2);
  const debtScore = Math.max(0, 50 - debtPenalty);

  // Quality score impact (0-30 pts)
  const qualityScore = (todaySession.sleepRating / 100) * 30;

  // Efficiency impact (0-20 pts)
  const efficiencyScore = (todaySession.sleepEfficiency / 100) * 20;

  const total = Math.min(100, Math.max(20, Math.round(debtScore + qualityScore + efficiencyScore)));

  if (total >= 85) {
    return {
      score: total,
      level: 'Optimal',
      summary: 'Optimal Recovery',
      advice: 'Your body and mind are primed for peak mental focus and intense workouts today.'
    };
  } else if (total >= 70) {
    return {
      score: total,
      level: 'Good',
      summary: 'Good Energy',
      advice: 'Balanced recovery. Maintain regular hydration and stick to your consistent bedtime tonight.'
    };
  } else if (total >= 50) {
    return {
      score: total,
      level: 'Moderate',
      summary: 'Moderate Fatigue',
      advice: 'Carrying slight sleep debt. Consider an early 20-min power nap or a 30-min earlier bedtime.'
    };
  } else {
    return {
      score: total,
      level: 'Critical',
      summary: 'High Sleep Debt',
      advice: 'Severe deficit detected. Minimize stimulants after 12 PM and prioritize restorative sleep tonight.'
    };
  }
}

/**
 * Formats minutes into "Xh Ym" or "X:YY"
 */
export function formatHoursMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatDigitalTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  return `${hours}:${mins < 10 ? '0' : ''}${mins}`;
}

/**
 * Calculates 90-minute sleep cycles from a given date/time
 */
export function calculateSleepCycles(fallAsleepTime: Date) {
  const latencyMinutes = 14; // average time to fall asleep
  const cycleMinutes = 90;

  const baseTime = new Date(fallAsleepTime.getTime() + latencyMinutes * 60 * 1000);

  return [3, 4, 5, 6].map(cycles => {
    const wakeDate = new Date(baseTime.getTime() + cycles * cycleMinutes * 60 * 1000);
    const totalSleepHours = (cycles * 90) / 60;
    return {
      cycles,
      hours: totalSleepHours,
      wakeTime: wakeDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
      wakeDate,
      isRecommended: cycles === 5 // 7.5 hrs is golden standard
    };
  });
}

/**
 * Generates continuous realistic sleep stage intervals & heart rate curve
 */
export function generateRealisticHypnogram(
  bedtimeDate: Date,
  wakeTimeDate: Date,
  avgRestingHR: number = 64
): {
  stages: SleepStageSegment[];
  heartRateSeries: HeartRatePoint[];
  awakeMinutes: number;
  lightMinutes: number;
  stillMinutes: number;
  deepMinutes: number;
  timeInBedMinutes: number;
  timeAsleepMinutes: number;
} {
  const totalDurationMs = wakeTimeDate.getTime() - bedtimeDate.getTime();
  const totalMinutes = Math.max(60, Math.floor(totalDurationMs / (60 * 1000)));

  const bucketMinutes = 15; // 15-min buckets
  const numBuckets = Math.floor(totalMinutes / bucketMinutes);

  const stages: SleepStageSegment[] = [];
  const heartRateSeries: HeartRatePoint[] = [];

  let awakeMin = 0;
  let lightMin = 0;
  let stillMin = 0;
  let deepMin = 0;

  for (let i = 0; i < numBuckets; i++) {
    const bucketStart = new Date(bedtimeDate.getTime() + i * bucketMinutes * 60 * 1000);
    const bucketEnd = new Date(bedtimeDate.getTime() + (i + 1) * bucketMinutes * 60 * 1000);
    const progress = i / numBuckets; // 0 to 1 across the night

    let stage: SleepStage;

    // Ultradian progression:
    // First 15 min: usually awake latency
    if (i === 0) {
      stage = 'awake';
      awakeMin += bucketMinutes;
    } else if (i === numBuckets - 1) {
      // Waking up
      stage = 'awake';
      awakeMin += bucketMinutes;
    } else if (progress < 0.40) {
      // First half has heavy deep sleep cycles and still sleep
      const cyclePos = (i % 6);
      if (cyclePos === 2 || cyclePos === 3) {
        stage = 'deep';
        deepMin += bucketMinutes;
      } else if (cyclePos === 1 || cyclePos === 4) {
        stage = 'still';
        stillMin += bucketMinutes;
      } else {
        stage = 'light';
        lightMin += bucketMinutes;
      }
    } else if (progress < 0.75) {
      // Mid night has alternating light, still, occasional deep
      const cyclePos = (i % 6);
      if (cyclePos === 2) {
        stage = 'deep';
        deepMin += bucketMinutes;
      } else if (cyclePos === 4) {
        stage = 'awake'; // Brief nocturnal arousal
        awakeMin += bucketMinutes;
      } else if (cyclePos === 1 || cyclePos === 3) {
        stage = 'light';
        lightMin += bucketMinutes;
      } else {
        stage = 'still';
        stillMin += bucketMinutes;
      }
    } else {
      // Later morning: predominantly light & REM with a wake stretch
      const cyclePos = (i % 5);
      if (cyclePos === 2) {
        stage = 'awake';
        awakeMin += bucketMinutes;
      } else if (cyclePos === 0 || cyclePos === 3) {
        stage = 'still';
        stillMin += bucketMinutes;
      } else {
        stage = 'light';
        lightMin += bucketMinutes;
      }
    }

    stages.push({
      id: `seg-${i}`,
      startTime: bucketStart.toISOString(),
      endTime: bucketEnd.toISOString(),
      stage,
      durationMinutes: bucketMinutes
    });

    // Generate HR curve: dips lowest during deep sleep, rises slightly in REM/awake
    let hrOffset = 0;
    if (stage === 'deep') hrOffset = -6;
    else if (stage === 'still') hrOffset = -3;
    else if (stage === 'light') hrOffset = 1;
    else if (stage === 'awake') hrOffset = 7;

    // smooth natural nocturnal curve (dipping in the middle)
    const nocturnalDip = Math.sin(progress * Math.PI) * 4;
    const bucketBpm = Math.round(avgRestingHR + hrOffset - nocturnalDip + (Math.sin(i * 1.5) * 2));

    heartRateSeries.push({
      time: bucketStart.toISOString(),
      bpm: Math.max(48, Math.min(110, bucketBpm))
    });
  }

  const timeAsleepMinutes = lightMin + stillMin + deepMin;

  return {
    stages,
    heartRateSeries,
    awakeMinutes: awakeMin,
    lightMinutes: lightMin,
    stillMinutes: stillMin,
    deepMinutes: deepMin,
    timeInBedMinutes: totalMinutes,
    timeAsleepMinutes
  };
}

/**
 * Calculates lifestyle tag correlations with Sleep Rating
 */
export function calculateTagCorrelations(sessions: SleepSession[]): TagCorrelation[] {
  if (sessions.length < 3) return [];

  const overallAvg = sessions.reduce((sum, s) => sum + s.sleepRating, 0) / sessions.length;

  return AVAILABLE_TAGS.map((tagInfo): TagCorrelation => {
    const withTag = sessions.filter(s => s.tags?.includes(tagInfo.id));
    const withoutTag = sessions.filter(s => !s.tags?.includes(tagInfo.id));

    if (withTag.length === 0) {
      return {
        tag: tagInfo.id,
        count: 0,
        avgRatingWith: overallAvg,
        avgRatingWithout: overallAvg,
        diff: 0,
        impact: 'neutral'
      };
    }

    const avgWith = withTag.reduce((sum, s) => sum + s.sleepRating, 0) / withTag.length;
    const avgWithout = withoutTag.length > 0
      ? withoutTag.reduce((sum, s) => sum + s.sleepRating, 0) / withoutTag.length
      : overallAvg;

    const diff = parseFloat((avgWith - avgWithout).toFixed(1));
    let impact: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (diff >= 3) impact = 'positive';
    else if (diff <= -3) impact = 'negative';

    return {
      tag: tagInfo.id,
      count: withTag.length,
      avgRatingWith: Math.round(avgWith),
      avgRatingWithout: Math.round(avgWithout),
      diff,
      impact
    };
  }).filter(c => c.count > 0).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
}

