import React, { useState } from 'react';
import { SleepSession, UserSettings, SleepBankDebt, DailyReadiness } from '../../types/sleep';
import { HypnogramChart } from '../common/HypnogramChart';
import { DualRings, TripleRings } from '../common/ConcentricRings';
import { formatHoursMinutes, AVAILABLE_TAGS } from '../../services/sleepEngine';
import { GuideModal } from '../common/GuideModal';

interface TodayViewProps {
  currentSession: SleepSession;
  allSessions: SleepSession[];
  settings: UserSettings;
  sleepBank: SleepBankDebt;
  readiness: DailyReadiness;
  onOpenLogger: (session?: SleepSession) => void;
  onSelectDate: (direction: 'prev' | 'next') => void;
  hasPrevDate: boolean;
  hasNextDate: boolean;
}

export const TodayView: React.FC<TodayViewProps> = ({
  currentSession,
  settings,
  sleepBank,
  readiness,
  onOpenLogger,
  onSelectDate,
  hasPrevDate,
  hasNextDate
}) => {
  const [showGuide, setShowGuide] = useState(false);
  const [showLegendDetails, setShowLegendDetails] = useState(false);

  // Target calculations
  const targetMinutes = settings.targetSleepHours * 60;
  const durationProgress = (currentSession.timeAsleepMinutes / targetMinutes) * 100;
  const deepProgress = (currentSession.deepMinutes / Math.max(1, currentSession.timeAsleepMinutes * 0.20)) * 100;
  const efficiencyProgress = currentSession.sleepEfficiency;

  // Breakdown values matching reference screenshot
  const totalAsleepStr = formatHoursMinutes(currentSession.timeAsleepMinutes);
  const qualityStr = formatHoursMinutes(currentSession.lightMinutes);
  const stillStr = formatHoursMinutes(currentSession.stillMinutes);
  const restingHR = currentSession.restingHeartRate;

  // Target bedtime calculation
  const targetWakeTime = settings.targetWakeTime || '07:00';
  const [targetWakeH, targetWakeM] = targetWakeTime.split(':').map(Number);
  const idealBedHour = (targetWakeH - Math.floor(settings.targetSleepHours) + 24) % 24;
  const idealBedMin = (targetWakeM - Math.round((settings.targetSleepHours % 1) * 60) + 60) % 60;
  const idealBedtimeStr = `${idealBedHour > 12 ? idealBedHour - 12 : idealBedHour || 12}:${idealBedMin < 10 ? '0' : ''}${idealBedMin} ${idealBedHour >= 12 ? 'PM' : 'AM'}`;

  // Mood emoji mapping
  const moodEmojis = ['', '😫', '🥱', '😐', '😊', '⚡'];

  return (
    <div className="space-y-3.5 pb-20 select-none">
      {/* Interactive Guide & Legend Modal */}
      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />

      {/* Top Header */}
      <div className="flex items-center justify-between pt-1 px-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
              TODAY
            </h1>
            {/* Quick date switcher */}
            <div className="flex items-center gap-1 bg-oled-card/80 border border-white/10 rounded-full px-2 py-0.5 ml-1">
              <button
                disabled={!hasPrevDate}
                onClick={() => onSelectDate('prev')}
                className="text-text-secondary hover:text-white disabled:opacity-30 text-xs px-1"
                title="Previous Day"
              >
                ◀
              </button>
              <button
                disabled={!hasNextDate}
                onClick={() => onSelectDate('next')}
                className="text-text-secondary hover:text-white disabled:opacity-30 text-xs px-1"
                title="Next Day"
              >
                ▶
              </button>
            </div>
          </div>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mt-0.5">
            {currentSession.displayDateLabel || currentSession.date}
          </p>
        </div>

        {/* Header Action Buttons: Guide & Edit */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(true)}
            className="h-10 px-3 rounded-xl bg-oled-card border border-stage-light/40 hover:border-stage-light text-stage-light hover:text-white flex items-center gap-1.5 transition-all shadow-card active:scale-95 text-xs font-bold"
            title="How to use & Color Legend"
          >
            <span>💡</span>
            <span>Guide</span>
          </button>

          <button
            onClick={() => onOpenLogger(currentSession)}
            className="w-10 h-10 rounded-xl bg-oled-card border border-white/10 hover:border-white/25 flex items-center justify-center text-text-primary hover:text-white transition-all shadow-card active:scale-95"
            title="Edit or Log Session"
          >
            <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>
        </div>
      </div>

      {/* CARD 1: Sleep Session Card (Hypnogram) */}
      <div className="bg-oled-card rounded-[22px] p-4 border border-oled-cardBorder shadow-card backdrop-blur-md space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-text-primary tracking-tight">
            Sleep Session
          </h2>
          <button
            onClick={() => setShowLegendDetails(!showLegendDetails)}
            className="text-[11px] text-stage-light hover:underline font-semibold flex items-center gap-1"
          >
            <span>{showLegendDetails ? 'Hide' : 'Show'} Legend</span>
            <span className="text-[9px]">ℹ️</span>
          </button>
        </div>

        <HypnogramChart session={currentSession} />

        {/* Interactive Inline Quick Legend */}
        {showLegendDetails && (
          <div className="mt-2 pt-2.5 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-text-secondary bg-oled-darker/60 p-2.5 rounded-xl animate-in fade-in">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stage-awake shrink-0" />
              <span><strong>Awake (Green):</strong> Time awake / latency</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stage-light shrink-0" />
              <span><strong>Light (Cyan):</strong> Core memory rest</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stage-deep shrink-0" />
              <span><strong>Deep (Purple):</strong> Physical repair</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stage-hr shrink-0" />
              <span><strong>Heart (Red):</strong> Resting BPM curve</span>
            </div>
          </div>
        )}
      </div>

      {/* ROW 2: Dual Column (Time Asleep + Sleep Rating) */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Card 2: Time Asleep */}
        <div className="bg-oled-card rounded-[22px] p-4 border border-oled-cardBorder shadow-card flex flex-col justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-text-primary tracking-tight">
              Time Asleep
            </h2>
            <div className="py-2.5 flex justify-center">
              <DualRings
                outerProgress={durationProgress}
                innerProgress={Math.max(10, 100 - sleepBank.debtPercentage)}
                size={130}
              />
            </div>
          </div>

          <div className="mt-1 space-y-1.5 border-t border-white/[0.05] pt-2">
            <div>
              <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">
                TODAY
              </span>
              <span className="text-[16px] font-extrabold text-white tracking-tight">
                {totalAsleepStr}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">
                SLEEP BANK
              </span>
              <span className={`text-[13px] font-bold tracking-tight ${
                sleepBank.isSurplus ? 'text-ring-green' : 'text-text-primary'
              }`}>
                {sleepBank.debtPercentage}% {sleepBank.isSurplus ? 'surplus' : 'debt'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Sleep Rating */}
        <div className="bg-oled-card rounded-[22px] p-4 border border-oled-cardBorder shadow-card flex flex-col justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-text-primary tracking-tight">
              Sleep Rating
            </h2>
            <div className="py-2.5 flex justify-center">
              <TripleRings
                score={currentSession.sleepRating}
                outerProgress={durationProgress}
                middleProgress={deepProgress}
                innerProgress={efficiencyProgress}
                size={130}
              />
            </div>
          </div>

          {/* Breakdown Stats matching reference list */}
          <div className="space-y-1.5 border-t border-white/[0.05] pt-2 text-[13px] font-bold">
            <div className="flex items-center gap-1.5 text-white">
              <span className="text-ring-gold text-xs">🌙</span>
              <span>{totalAsleepStr}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <span className="text-amber-400 text-xs">⭐</span>
              <span>{qualityStr}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <span className="w-3.5 h-3.5 rounded-full bg-stage-awake/20 text-stage-awake text-[9px] flex items-center justify-center font-bold">
                ⓩ
              </span>
              <span>{stillStr}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <span className="text-stage-hr text-xs">❤️</span>
              <span>{restingHR}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: Secondary Summary Cards (Latest Bedtime & Readiness) */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Latest Bedtime Card */}
        <div className="bg-oled-card rounded-[22px] p-4 border border-oled-cardBorder shadow-card">
          <h3 className="text-[15px] font-bold text-text-primary tracking-tight mb-2 flex items-center justify-between">
            <span>Latest Bedtime</span>
            <span className="text-xs text-text-secondary font-normal">⏰</span>
          </h3>
          <p className="text-xl font-black text-white tracking-tight">
            {idealBedtimeStr}
          </p>
          <p className="text-[11px] text-text-secondary mt-1">
            Target: {settings.targetSleepHours}h sleep
          </p>
        </div>

        {/* Readiness Card */}
        <div className="bg-oled-card rounded-[22px] p-4 border border-oled-cardBorder shadow-card">
          <h3 className="text-[15px] font-bold text-text-primary tracking-tight mb-2 flex items-center justify-between">
            <span>Readiness</span>
            <span className="text-xs text-ring-green font-bold">● {readiness.level}</span>
          </h3>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{readiness.score}%</span>
            <span className="text-xs text-text-secondary font-medium">{readiness.summary}</span>
          </div>
          <p className="text-[10.5px] text-text-secondary/90 mt-1 leading-snug line-clamp-2">
            {readiness.advice}
          </p>
        </div>
      </div>

      {/* Session Tags & Wake Mood Pill Bar */}
      {(currentSession.tags?.length > 0 || currentSession.wakeMood) && (
        <div className="bg-oled-card/70 rounded-[18px] px-3.5 py-2.5 border border-oled-cardBorder flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-text-secondary text-[11px] font-medium mr-0.5">Factors:</span>
            {currentSession.tags?.map(t => {
              const tagInfo = AVAILABLE_TAGS.find(at => at.id === t);
              return tagInfo ? (
                <span
                  key={t}
                  className="bg-oled-subtle/80 text-text-primary px-2 py-0.5 rounded-full border border-white/10 text-[11px] flex items-center gap-1"
                >
                  <span>{tagInfo.emoji}</span>
                  <span>{tagInfo.label}</span>
                </span>
              ) : null;
            })}
          </div>

          {currentSession.wakeMood && (
            <div className="flex items-center gap-1 pl-2 border-l border-white/10 text-sm" title="Wake Mood">
              <span>{moodEmojis[currentSession.wakeMood]}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

