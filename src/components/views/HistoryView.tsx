import React, { useState } from 'react';
import { SleepSession, UserSettings } from '../../types/sleep';
import { formatHoursMinutes, calculateTagCorrelations, AVAILABLE_TAGS } from '../../services/sleepEngine';

interface HistoryViewProps {
  sessions: SleepSession[];
  settings: UserSettings;
  onSelectSession: (session: SleepSession) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  sessions,
  settings,
  onSelectSession
}) => {
  const [activeRange, setActiveRange] = useState<'7d' | '14d' | '30d'>('14d');

  const daysCount = activeRange === '7d' ? 7 : activeRange === '14d' ? 14 : 30;
  const filteredSessions = sessions.slice(0, daysCount);

  // Averages
  const totalDuration = filteredSessions.reduce((acc, s) => acc + s.timeAsleepMinutes, 0);
  const avgDurationMin = filteredSessions.length > 0 ? totalDuration / filteredSessions.length : 0;
  const avgRating = filteredSessions.length > 0
    ? Math.round(filteredSessions.reduce((acc, s) => acc + s.sleepRating, 0) / filteredSessions.length)
    : 0;
  const avgDeepMin = filteredSessions.length > 0
    ? filteredSessions.reduce((acc, s) => acc + s.deepMinutes, 0) / filteredSessions.length
    : 0;
  const avgDeepPercent = avgDurationMin > 0 ? Math.round((avgDeepMin / avgDurationMin) * 100) : 0;
  const avgRHR = filteredSessions.length > 0
    ? Math.round(filteredSessions.reduce((acc, s) => acc + s.restingHeartRate, 0) / filteredSessions.length)
    : 0;

  // Tag correlations
  const correlations = calculateTagCorrelations(sessions);

  // Heatmap generation for past 28 days
  const today = new Date();
  const calendarDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (27 - i));
    const dateStr = d.toISOString().split('T')[0];
    const session = sessions.find(s => s.date === dateStr);
    return {
      date: d,
      dateStr,
      dayNum: d.getDate(),
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      session
    };
  });

  const getScoreColor = (rating?: number) => {
    if (!rating) return 'bg-oled-subtle/50 text-text-secondary/40 border-white/5';
    if (rating >= 88) return 'bg-stage-awake/25 text-stage-awake border-stage-awake/40 shadow-[0_0_8px_rgba(34,197,94,0.3)]';
    if (rating >= 75) return 'bg-stage-light/25 text-stage-light border-stage-light/40';
    if (rating >= 60) return 'bg-ring-amber/25 text-ring-amber border-ring-amber/40';
    return 'bg-stage-hr/25 text-stage-hr border-stage-hr/40';
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pt-1 px-1">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            HISTORY
          </h1>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mt-0.5">
            Trends, Heatmap & Sleep Debt Analytics
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex bg-oled-card p-0.5 rounded-xl border border-white/10 text-xs">
          {(['7d', '14d', '30d'] as const).map(r => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeRange === r ? 'bg-white/15 text-white' : 'text-text-secondary'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Averages 4-Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-oled-card rounded-[20px] p-3.5 border border-oled-cardBorder shadow-card">
          <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">
            Avg Duration
          </span>
          <span className="text-xl font-black text-white">
            {formatHoursMinutes(avgDurationMin)}
          </span>
          <span className="text-[10px] text-text-secondary block mt-0.5">
            Target: {settings.targetSleepHours}h
          </span>
        </div>

        <div className="bg-oled-card rounded-[20px] p-3.5 border border-oled-cardBorder shadow-card">
          <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">
            Avg Rating
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-white">{avgRating}</span>
            <span className="text-[11px] font-bold text-ring-green">/ 100</span>
          </div>
          <span className="text-[10px] text-text-secondary block mt-0.5">
            Composite Score
          </span>
        </div>

        <div className="bg-oled-card rounded-[20px] p-3.5 border border-oled-cardBorder shadow-card">
          <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">
            Deep Sleep %
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-stage-deep">{avgDeepPercent}%</span>
            <span className="text-[10px] text-text-secondary">({formatHoursMinutes(avgDeepMin)})</span>
          </div>
          <span className="text-[10px] text-text-secondary block mt-0.5">
            Goal: &ge; 20%
          </span>
        </div>

        <div className="bg-oled-card rounded-[20px] p-3.5 border border-oled-cardBorder shadow-card">
          <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">
            Resting HR
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-stage-hr">{avgRHR}</span>
            <span className="text-[10px] text-text-secondary">bpm</span>
          </div>
          <span className="text-[10px] text-text-secondary block mt-0.5">
            Baseline: {settings.baselineRHR} bpm
          </span>
        </div>
      </div>

      {/* Calendar Heatmap Card */}
      <div className="bg-oled-card rounded-[22px] p-4 border border-oled-cardBorder shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-text-primary">
            Sleep Rating Heatmap (Last 4 Weeks)
          </h2>
          <div className="flex items-center gap-1.5 text-[9px] text-text-secondary">
            <span>Low</span>
            <div className="w-2 h-2 rounded-sm bg-stage-hr/40" />
            <div className="w-2 h-2 rounded-sm bg-ring-amber/40" />
            <div className="w-2 h-2 rounded-sm bg-stage-light/40" />
            <div className="w-2 h-2 rounded-sm bg-stage-awake/40" />
            <span>High</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((cd, idx) => {
            const hasSession = !!cd.session;
            return (
              <button
                key={idx}
                disabled={!hasSession}
                onClick={() => cd.session && onSelectSession(cd.session)}
                className={`h-11 rounded-xl border flex flex-col items-center justify-center p-1 transition-all ${getScoreColor(
                  cd.session?.sleepRating
                )} ${hasSession ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-default'}`}
              >
                <span className="text-[9px] font-bold">{cd.dayNum}</span>
                {hasSession ? (
                  <span className="text-[11px] font-extrabold">{cd.session?.sleepRating}</span>
                ) : (
                  <span className="text-[9px] opacity-30">-</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stacked Stage Distribution Trend Chart */}
      <div className="bg-oled-card rounded-[22px] p-4 border border-oled-cardBorder shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-text-primary">
            Sleep Stage Architecture Trend
          </h2>
          <div className="flex items-center gap-2 text-[10px] font-medium">
            <span className="flex items-center gap-1 text-stage-awake">
              <span className="w-2 h-2 rounded-full bg-stage-awake" /> Awake
            </span>
            <span className="flex items-center gap-1 text-stage-light">
              <span className="w-2 h-2 rounded-full bg-stage-light" /> Light
            </span>
            <span className="flex items-center gap-1 text-stage-deep">
              <span className="w-2 h-2 rounded-full bg-stage-deep" /> Deep
            </span>
          </div>
        </div>

        {/* Horizontal Stacked Bars for Recent Sessions */}
        <div className="space-y-2 pt-1">
          {filteredSessions.slice(0, 7).map(s => {
            const total = Math.max(1, s.timeInBedMinutes);
            const deepPct = (s.deepMinutes / total) * 100;
            const lightPct = ((s.lightMinutes + s.stillMinutes) / total) * 100;
            const awakePct = (s.awakeMinutes / total) * 100;

            const dateObj = new Date(s.date);
            const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <div
                key={s.id}
                onClick={() => onSelectSession(s)}
                className="group cursor-pointer hover:bg-white/[0.02] p-1.5 rounded-lg transition-all"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-text-primary">
                    {dayLabel} {dateObj.getDate()}
                  </span>
                  <span className="text-text-secondary font-medium">
                    {formatHoursMinutes(s.timeAsleepMinutes)} (Score: {s.sleepRating})
                  </span>
                </div>
                {/* Segmented Bar */}
                <div className="h-3.5 w-full bg-oled-darker rounded-full overflow-hidden flex border border-white/10">
                  <div style={{ width: `${deepPct}%` }} className="bg-stage-deep h-full" title={`Deep: ${s.deepMinutes}m`} />
                  <div style={{ width: `${lightPct}%` }} className="bg-stage-light h-full" title={`Light: ${s.lightMinutes + s.stillMinutes}m`} />
                  <div style={{ width: `${awakePct}%` }} className="bg-stage-awake h-full" title={`Awake: ${s.awakeMinutes}m`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tag Correlation Analytics */}
      <div className="bg-oled-card rounded-[22px] p-4 border border-oled-cardBorder shadow-card space-y-3">
        <h2 className="text-[15px] font-bold text-text-primary">
          Lifestyle Factor Correlations
        </h2>
        <p className="text-xs text-text-secondary">
          Impact of daily habits on your overall Sleep Rating:
        </p>

        {correlations.length > 0 ? (
          <div className="space-y-2">
            {correlations.map(c => {
              const tagInfo = AVAILABLE_TAGS.find(t => t.id === c.tag);
              const isPos = c.diff > 0;
              return (
                <div
                  key={c.tag}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-oled-darker/60 border border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tagInfo?.emoji || '🏷️'}</span>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {tagInfo?.label || c.tag}
                      </span>
                      <span className="text-[10px] text-text-secondary">
                        Logged in {c.count} session{c.count > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      isPos ? 'bg-stage-awake/20 text-stage-awake' : 'bg-stage-hr/20 text-stage-hr'
                    }`}>
                      {isPos ? `+${c.diff}` : `${c.diff}`} pts
                    </span>
                    <span className="text-[10px] text-text-secondary block mt-0.5">
                      Avg: {c.avgRatingWith} vs {c.avgRatingWithout}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-xs text-text-secondary">
            Log habits like Caffeine, Alcohol, or Meditation in Day/Edit to see correlations.
          </div>
        )}
      </div>
    </div>
  );
};

