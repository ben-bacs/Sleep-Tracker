import React, { useState, useEffect } from 'react';
import { calculateSleepCycles } from '../../services/sleepEngine';
import { audioEngine, SoundType } from '../../services/audioEngine';

export const ClockView: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [calcMode, setCalcMode] = useState<'sleep_now' | 'wake_at'>('sleep_now');
  const [targetWakeTime, setTargetWakeTime] = useState('07:00');

  // Sleep sound states
  const [activeSound, setActiveSound] = useState<SoundType | null>(null);
  const [volume, setVolume] = useState(0.6);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(30);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cycles = calculateSleepCycles(now);

  const handleToggleSound = (type: SoundType) => {
    if (activeSound === type && isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
      setActiveSound(null);
    } else {
      audioEngine.play(type, volume, timerMinutes || undefined);
      setActiveSound(type);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioEngine.setVolume(newVol);
  };

  // Reverse calculate bedtimes for wake_at
  const getBedtimesForWake = () => {
    const [h, m] = targetWakeTime.split(':').map(Number);
    const targetDate = new Date();
    targetDate.setHours(h, m, 0, 0);
    if (targetDate.getTime() < now.getTime()) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    return [6, 5, 4, 3].map(c => {
      const sleepDurationMinutes = c * 90 + 14; // +14m latency
      const bedtime = new Date(targetDate.getTime() - sleepDurationMinutes * 60 * 1000);
      return {
        cycles: c,
        hours: (c * 90) / 60,
        bedtimeStr: bedtime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
        isRecommended: c === 5
      };
    });
  };

  const reverseCycles = getBedtimesForWake();

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* View Header */}
      <div className="pt-1 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
          SLEEP CLOCK
        </h1>
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mt-0.5">
          90-Min Ultradian Cycle & Sleep Companion
        </p>
      </div>

      {/* Live Time Card */}
      <div className="bg-oled-card rounded-[22px] p-5 border border-oled-cardBorder shadow-card flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
            Current Time
          </span>
          <span className="text-3xl font-black text-white tracking-tight">
            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-stage-light/10 border border-stage-light/20 flex items-center justify-center text-stage-light text-xl animate-pulse">
          🌙
        </div>
      </div>

      {/* Sleep Cycle Calculator */}
      <div className="bg-oled-card rounded-[22px] p-5 border border-oled-cardBorder shadow-card space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-text-primary">
            Cycle Calculator
          </h2>
          <div className="flex bg-oled-darker p-0.5 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setCalcMode('sleep_now')}
              className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                calcMode === 'sleep_now' ? 'bg-white/15 text-white shadow-sm' : 'text-text-secondary'
              }`}
            >
              Sleep Now
            </button>
            <button
              onClick={() => setCalcMode('wake_at')}
              className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                calcMode === 'wake_at' ? 'bg-white/15 text-white shadow-sm' : 'text-text-secondary'
              }`}
            >
              Wake At
            </button>
          </div>
        </div>

        {calcMode === 'sleep_now' ? (
          <div>
            <p className="text-xs text-text-secondary mb-3">
              Falling asleep now (with ~14 min latency), optimal wake-up times to avoid sleep inertia:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {cycles.map(c => (
                <div
                  key={c.cycles}
                  className={`p-3 rounded-xl border transition-all ${
                    c.isRecommended
                      ? 'bg-stage-awake/10 border-stage-awake/50 shadow-glow-green'
                      : 'bg-oled-darker/60 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-text-secondary">
                      {c.cycles} Cycles ({c.hours}h)
                    </span>
                    {c.isRecommended && (
                      <span className="bg-stage-awake text-black font-extrabold text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                        Ideal
                      </span>
                    )}
                  </div>
                  <span className="text-xl font-extrabold text-white">
                    {c.wakeTime}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <label className="text-xs text-text-secondary font-medium">I need to wake up at:</label>
              <input
                type="time"
                value={targetWakeTime}
                onChange={e => setTargetWakeTime(e.target.value)}
                className="bg-oled-darker border border-white/20 rounded-lg px-2.5 py-1 text-sm font-bold text-white focus:outline-none focus:border-stage-light"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {reverseCycles.map(c => (
                <div
                  key={c.cycles}
                  className={`p-3 rounded-xl border transition-all ${
                    c.isRecommended
                      ? 'bg-stage-light/10 border-stage-light/50 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                      : 'bg-oled-darker/60 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-text-secondary">
                      {c.cycles} Cycles ({c.hours}h)
                    </span>
                    {c.isRecommended && (
                      <span className="bg-stage-light text-black font-extrabold text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                        Optimal
                      </span>
                    )}
                  </div>
                  <span className="text-xl font-extrabold text-white">
                    {c.bedtimeStr}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ambient Sound Synthesizer Card */}
      <div className="bg-oled-card rounded-[22px] p-5 border border-oled-cardBorder shadow-card space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-text-primary flex items-center gap-2">
            <span>Sleep Sound Synthesizer</span>
            {isPlaying && <span className="w-2 h-2 rounded-full bg-stage-awake animate-ping" />}
          </h2>
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider bg-oled-darker px-2 py-0.5 rounded-full border border-white/10">
            Web Audio API
          </span>
        </div>

        <p className="text-xs text-text-secondary">
          Synthesized directly in your browser with zero network streaming. Calms delta brainwaves for deeper sleep.
        </p>

        {/* Sound Selection Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { id: 'brown' as SoundType, label: 'Brown Noise', icon: '🌊', desc: 'Deep warm rumble' },
            { id: 'pink' as SoundType, label: 'Pink Noise', icon: '🍃', desc: 'Balanced natural hiss' },
            { id: 'rain' as SoundType, label: 'Gentle Rain', icon: '🌧️', desc: 'Relaxing rain shower' },
            { id: 'waves' as SoundType, label: 'Ocean Waves', icon: '🏄', desc: 'Slow tidal swells' },
          ].map(s => {
            const isThisPlaying = activeSound === s.id && isPlaying;
            return (
              <button
                key={s.id}
                onClick={() => handleToggleSound(s.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isThisPlaying
                    ? 'bg-stage-light/20 border-stage-light text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                    : 'bg-oled-darker/60 border-white/10 hover:border-white/20 text-text-secondary hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{s.icon}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isThisPlaying ? 'bg-stage-light text-black' : 'bg-white/5 text-text-secondary'
                  }`}>
                    {isThisPlaying ? 'PLAYING' : 'START'}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-white">{s.label}</div>
                  <div className="text-[10px] text-text-secondary">{s.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Volume & Timer Controls */}
        {isPlaying && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-secondary">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1 accent-stage-light h-1 bg-white/20 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-bold text-white w-8">{Math.round(volume * 100)}%</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">Timer:</span>
              <div className="flex gap-1.5">
                {[15, 30, 45, 60, null].map(t => (
                  <button
                    key={t || 'inf'}
                    onClick={() => {
                      setTimerMinutes(t);
                      if (activeSound) {
                        audioEngine.play(activeSound, volume, t || undefined);
                      }
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                      timerMinutes === t
                        ? 'bg-stage-light text-black border-stage-light'
                        : 'bg-oled-darker text-text-secondary border-white/10'
                    }`}
                  >
                    {t ? `${t}m` : '∞'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

