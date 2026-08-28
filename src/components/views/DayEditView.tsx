import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SleepSession, UserSettings, LifestyleTag } from '../../types/sleep';
import {
  AVAILABLE_TAGS,
  calculateSleepRating,
  generateRealisticHypnogram
} from '../../services/sleepEngine';

interface DayEditViewProps {
  editingSession: SleepSession | null;
  targetDate?: string;
  settings: UserSettings;
  onSaveSession: (session: SleepSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onLoadDemoData: () => void;
  onClose: () => void;
}

export const DayEditView: React.FC<DayEditViewProps> = ({
  editingSession,
  targetDate,
  settings,
  onSaveSession,
  onDeleteSession,
  onLoadDemoData,
  onClose
}) => {
  const [date, setDate] = useState(
    editingSession ? editingSession.date : (targetDate || new Date().toISOString().split('T')[0])
  );
  const [bedtimeTime, setBedtimeTime] = useState('23:28');
  const [wakeTimeTime, setWakeTimeTime] = useState('06:51');

  const [deepMinutes, setDeepMinutes] = useState(editingSession?.deepMinutes || 30);
  const [lightMinutes, setLightMinutes] = useState(editingSession?.lightMinutes || 260);
  const [stillMinutes, setStillMinutes] = useState(editingSession?.stillMinutes || 80);
  const [awakeMinutes, setAwakeMinutes] = useState(editingSession?.awakeMinutes || 74);
  const [restingHR, setRestingHR] = useState(editingSession?.restingHeartRate || 64);
  const [tags, setTags] = useState<LifestyleTag[]>(editingSession?.tags || ['reading', 'cold_room']);
  const [wakeMood, setWakeMood] = useState<1 | 2 | 3 | 4 | 5>(editingSession?.wakeMood || 4);
  const [notes, setNotes] = useState(editingSession?.notes || '');

  // Initialize from editingSession or targetDate if present
  useEffect(() => {
    if (editingSession) {
      setDate(editingSession.date);
      const bDate = new Date(editingSession.bedtime);
      const wDate = new Date(editingSession.wakeTime);
      setBedtimeTime(`${String(bDate.getHours()).padStart(2, '0')}:${String(bDate.getMinutes()).padStart(2, '0')}`);
      setWakeTimeTime(`${String(wDate.getHours()).padStart(2, '0')}:${String(wDate.getMinutes()).padStart(2, '0')}`);
      setDeepMinutes(editingSession.deepMinutes);
      setLightMinutes(editingSession.lightMinutes);
      setStillMinutes(editingSession.stillMinutes);
      setAwakeMinutes(editingSession.awakeMinutes);
      setRestingHR(editingSession.restingHeartRate);
      setTags(editingSession.tags || []);
      setWakeMood(editingSession.wakeMood || 4);
      setNotes(editingSession.notes || '');
    }
  }, [editingSession]);

  const totalAsleep = deepMinutes + lightMinutes + stillMinutes;
  const totalInBed = totalAsleep + awakeMinutes;
  const calculatedRating = calculateSleepRating(
    totalAsleep,
    totalInBed,
    deepMinutes,
    restingHR,
    settings.targetSleepHours,
    settings.baselineRHR
  );

  const toggleTag = (tagId: LifestyleTag) => {
    if (tags.includes(tagId)) {
      setTags(tags.filter(t => t !== tagId));
    } else {
      setTags([...tags, tagId]);
    }
  };

  const handleSimulateClinicalData = () => {
    const sessionDate = new Date(date);
    const [bH, bM] = bedtimeTime.split(':').map(Number);
    const [wH, wM] = wakeTimeTime.split(':').map(Number);

    const bDate = new Date(sessionDate);
    bDate.setDate(bDate.getDate() - 1);
    bDate.setHours(bH, bM, 0, 0);

    const wDate = new Date(sessionDate);
    wDate.setHours(wH, wM, 0, 0);

    const sim = generateRealisticHypnogram(bDate, wDate, restingHR);
    setDeepMinutes(sim.deepMinutes);
    setLightMinutes(sim.lightMinutes);
    setStillMinutes(sim.stillMinutes);
    setAwakeMinutes(sim.awakeMinutes);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const sessionDate = new Date(date);
    const [bH, bM] = bedtimeTime.split(':').map(Number);
    const [wH, wM] = wakeTimeTime.split(':').map(Number);

    const bDate = new Date(sessionDate);
    bDate.setDate(bDate.getDate() - 1);
    bDate.setHours(bH, bM, 0, 0);

    const wDate = new Date(sessionDate);
    wDate.setHours(wH, wM, 0, 0);

    const sim = generateRealisticHypnogram(bDate, wDate, restingHR);

    const prevDayName = bDate.toLocaleDateString('en-US', { weekday: 'short' });
    const dayName = sessionDate.toLocaleDateString('en-US', { weekday: 'short' });

    const newSession: SleepSession = {
      id: editingSession?.id || `session-${Date.now()}`,
      date,
      displayDateLabel: `${prevDayName.toUpperCase()} → ${dayName.toUpperCase()}`,
      bedtime: bDate.toISOString(),
      wakeTime: wDate.toISOString(),
      timeInBedMinutes: totalInBed,
      timeAsleepMinutes: totalAsleep,
      deepMinutes,
      lightMinutes,
      stillMinutes,
      awakeMinutes,
      restingHeartRate: restingHR,
      sleepRating: calculatedRating,
      sleepEfficiency: parseFloat(((totalAsleep / Math.max(1, totalInBed)) * 100).toFixed(1)),
      stages: sim.stages,
      heartRateSeries: sim.heartRateSeries,
      tags,
      wakeMood,
      notes: notes.trim() || undefined
    };

    onSaveSession(newSession);

    // Trigger confetti if sleep rating >= 90
    if (calculatedRating >= 90) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (_) {}
    }

    onClose();
  };

  const moodEmojis: { mood: 1 | 2 | 3 | 4 | 5; emoji: string; label: string }[] = [
    { mood: 1, emoji: '😫', label: 'Exhausted' },
    { mood: 2, emoji: '🥱', label: 'Tired' },
    { mood: 3, emoji: '😐', label: 'Neutral' },
    { mood: 4, emoji: '😊', label: 'Refreshed' },
    { mood: 5, emoji: '⚡', label: 'Energized' },
  ];

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pt-1 px-1">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            {editingSession ? 'EDIT SLEEP' : 'LOG SLEEP'}
          </h1>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mt-0.5">
            Manual Sleep Entry & Simulation Engine
          </p>
        </div>

        <button
          onClick={onLoadDemoData}
          className="bg-oled-card hover:bg-oled-subtle border border-ring-gold/40 text-ring-gold text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95"
        >
          Load 14-Day Demo Data
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Date & Time Settings Card */}
        <div className="bg-oled-card rounded-[22px] p-5 border border-oled-cardBorder shadow-card space-y-4">
          <h2 className="text-[15px] font-bold text-text-primary flex items-center justify-between">
            <span>Session Times</span>
            <span className="text-xs font-normal text-text-secondary">📅</span>
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Wake Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-oled-darker border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-stage-light font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Bedtime (Night)</label>
                <input
                  type="time"
                  value={bedtimeTime}
                  onChange={e => setBedtimeTime(e.target.value)}
                  className="w-full bg-oled-darker border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-stage-light font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Wake Time (Morning)</label>
                <input
                  type="time"
                  value={wakeTimeTime}
                  onChange={e => setWakeTimeTime(e.target.value)}
                  className="w-full bg-oled-darker border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-stage-light font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSimulateClinicalData}
              className="text-xs text-stage-light hover:text-white font-semibold flex items-center gap-1 bg-stage-light/10 hover:bg-stage-light/20 px-3 py-1 rounded-lg border border-stage-light/30 transition-all"
            >
              <span>⚡</span> Auto-Calculate Realistic Stages
            </button>
          </div>
        </div>

        {/* Stages Breakdown Sliders */}
        <div className="bg-oled-card rounded-[22px] p-5 border border-oled-cardBorder shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-text-primary">
              Sleep Stages Breakdown
            </h2>
            <span className="text-xs font-bold text-ring-gold">
              Rating: {calculatedRating} / 100
            </span>
          </div>

          <div className="space-y-3">
            {/* Deep Sleep Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stage-deep flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-stage-deep" /> Deep Sleep (N3)
                </span>
                <span className="text-white font-bold">{Math.floor(deepMinutes / 60)}h {deepMinutes % 60}m</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={deepMinutes}
                onChange={e => setDeepMinutes(Number(e.target.value))}
                className="w-full accent-stage-deep h-1.5 bg-oled-darker rounded-lg cursor-pointer"
              />
            </div>

            {/* Light / REM Sleep Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stage-light flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-stage-light" /> Light & REM Sleep
                </span>
                <span className="text-white font-bold">{Math.floor(lightMinutes / 60)}h {lightMinutes % 60}m</span>
              </div>
              <input
                type="range"
                min="60"
                max="480"
                step="10"
                value={lightMinutes}
                onChange={e => setLightMinutes(Number(e.target.value))}
                className="w-full accent-stage-light h-1.5 bg-oled-darker rounded-lg cursor-pointer"
              />
            </div>

            {/* Still Sleep Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stage-still flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-stage-still" /> Restful Still Sleep
                </span>
                <span className="text-white font-bold">{Math.floor(stillMinutes / 60)}h {stillMinutes % 60}m</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={stillMinutes}
                onChange={e => setStillMinutes(Number(e.target.value))}
                className="w-full accent-stage-still h-1.5 bg-oled-darker rounded-lg cursor-pointer"
              />
            </div>

            {/* Awake Time Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-stage-awake flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-stage-awake" /> Awake / Latency
                </span>
                <span className="text-white font-bold">{Math.floor(awakeMinutes / 60)}h {awakeMinutes % 60}m</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={awakeMinutes}
                onChange={e => setAwakeMinutes(Number(e.target.value))}
                className="w-full accent-stage-awake h-1.5 bg-oled-darker rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Resting HR & Wake Mood */}
        <div className="bg-oled-card rounded-[22px] p-5 border border-oled-cardBorder shadow-card space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-stage-hr flex items-center gap-1">
                ❤️ Resting Heart Rate
              </span>
              <span className="text-white font-bold">{restingHR} bpm</span>
            </div>
            <input
              type="range"
              min="45"
              max="95"
              step="1"
              value={restingHR}
              onChange={e => setRestingHR(Number(e.target.value))}
              className="w-full accent-stage-hr h-1.5 bg-oled-darker rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-2">
              Morning Wake Feeling
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moodEmojis.map(m => (
                <button
                  type="button"
                  key={m.mood}
                  onClick={() => setWakeMood(m.mood)}
                  className={`py-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    wakeMood === m.mood
                      ? 'bg-stage-light/20 border-stage-light shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                      : 'bg-oled-darker/60 border-white/10 text-text-secondary'
                  }`}
                >
                  <span className="text-xl">{m.emoji}</span>
                  <span className="text-[9px] font-bold mt-0.5">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lifestyle Factors & Tags */}
        <div className="bg-oled-card rounded-[22px] p-5 border border-oled-cardBorder shadow-card space-y-3">
          <h2 className="text-[15px] font-bold text-text-primary">
            Lifestyle Factors
          </h2>
          <p className="text-xs text-text-secondary">
            Select habits associated with this sleep session:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {AVAILABLE_TAGS.map(t => {
              const isSelected = tags.includes(t.id);
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => toggleTag(t.id)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-stage-awake/20 border-stage-awake text-white shadow-glow-green'
                      : 'bg-oled-darker/60 border-white/10 text-text-secondary hover:text-white'
                  }`}
                >
                  <span>{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes & Dream Journal */}
        <div className="bg-oled-card rounded-[22px] p-5 border border-oled-cardBorder shadow-card space-y-2">
          <h2 className="text-[15px] font-bold text-text-primary">
            Sleep Notes & Dreams
          </h2>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Log dreams, awakenings, room temperature, or any thoughts..."
            rows={2}
            className="w-full bg-oled-darker border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-stage-light resize-none"
          />
        </div>

        {/* Save & Delete Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="submit"
            className="w-full py-3.5 bg-stage-light text-black font-extrabold rounded-2xl shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:bg-white active:scale-98 transition-all text-sm uppercase tracking-wider"
          >
            Save Sleep Session
          </button>

          {editingSession && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this sleep log?')) {
                  onDeleteSession(editingSession.id);
                  onClose();
                }
              }}
              className="w-full py-2.5 bg-stage-hr/10 hover:bg-stage-hr/20 text-stage-hr border border-stage-hr/30 font-bold rounded-2xl transition-all text-xs"
            >
              Delete Session
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

