import React, { useState } from 'react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tutorial' | 'legend' | 'scores'>('tutorial');
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const totalSteps = 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="bg-oled-card border border-white/20 rounded-[28px] max-w-lg w-full max-h-[88vh] overflow-y-auto p-5 shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight leading-none">
                Website Tutorial & User Guide
              </h2>
              <p className="text-[10px] text-text-secondary mt-0.5">
                Learn how to track, analyze, and optimize your sleep
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all text-sm font-bold active:scale-90"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-oled-darker p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('tutorial')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'tutorial' ? 'bg-white/15 text-white shadow-sm' : 'text-text-secondary hover:text-white'
            }`}
          >
            🚀 Quick Tutorial
          </button>
          <button
            onClick={() => setActiveTab('legend')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'legend' ? 'bg-white/15 text-white shadow-sm' : 'text-text-secondary hover:text-white'
            }`}
          >
            🎨 Color Legend
          </button>
          <button
            onClick={() => setActiveTab('scores')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'scores' ? 'bg-white/15 text-white shadow-sm' : 'text-text-secondary hover:text-white'
            }`}
          >
            📊 Scoring Science
          </button>
        </div>

        {/* TAB 1: Step-by-Step Interactive Tutorial */}
        {activeTab === 'tutorial' && (
          <div className="space-y-4">
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between text-xs font-bold text-text-secondary px-1">
              <span>Step {step} of {totalSteps}</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all ${
                      s === step ? 'w-6 bg-stage-light' : s < step ? 'w-3 bg-stage-awake' : 'w-3 bg-white/15'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Dashboard & Switching Users */}
            {step === 1 && (
              <div className="p-4 rounded-2xl bg-oled-darker border border-white/10 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stage-light/20 border border-stage-light/40 flex items-center justify-center text-xl">
                    👥
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">1. Multi-User Accounts & Profiles</h3>
                    <p className="text-xs text-text-secondary">Different users have distinct stats and goals</p>
                  </div>
                </div>
                <div className="text-xs text-text-primary space-y-2 leading-relaxed">
                  <p>
                    • Tap the <strong>User Profile Badge</strong> (e.g. <span className="text-stage-light font-bold">⚡ Alex ▼</span>) at the top of any page.
                  </p>
                  <p>
                    • You can switch between users (e.g. <em>Alex</em>, <em>Sarah</em>, <em>Guest</em>) or click <strong>➕ Add New User</strong> to create your personal profile.
                  </p>
                  <p>
                    • Each profile saves its own independent sleep sessions, 14-day sleep bank debt, and statistics 100% locally in your browser.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Date Manipulation */}
            {step === 2 && (
              <div className="p-4 rounded-2xl bg-oled-darker border border-white/10 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ring-gold/20 border border-ring-gold/40 flex items-center justify-center text-xl">
                    📅
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">2. Date Manipulation & Navigation</h3>
                    <p className="text-xs text-text-secondary">Inspect past days or log any date</p>
                  </div>
                </div>
                <div className="text-xs text-text-primary space-y-2 leading-relaxed">
                  <p>
                    • Use the <strong>◀ and ▶ arrows</strong> on the Today dashboard to flip through days.
                  </p>
                  <p>
                    • Or click the <strong>📅 Date Picker</strong> to jump directly to any specific date in history.
                  </p>
                  <p>
                    • If a date has no data, click <strong>⚡ Auto-Generate</strong> for instant clinical simulation or <strong>+ Manual Log</strong> to enter your hours.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Sleep Session Hypnogram & Rings */}
            {step === 3 && (
              <div className="p-4 rounded-2xl bg-oled-darker border border-white/10 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stage-deep/20 border border-stage-deep/40 flex items-center justify-center text-xl">
                    📈
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">3. Reading Hypnograms & Concentric Rings</h3>
                    <p className="text-xs text-text-secondary">Apple Watch / AutoSleep visual style</p>
                  </div>
                </div>
                <div className="text-xs text-text-primary space-y-2 leading-relaxed">
                  <p>
                    • <strong>Sleep Session Chart:</strong> Shows stages across the night. Deep sleep extends downward in violet purple, while heart rate is drawn as a red dashed curve.
                  </p>
                  <p>
                    • <strong>Time Asleep (Dual Rings):</strong> Outer gold ring shows progress to your target (e.g. 8 hrs); inner coral ring tracks your rolling 14-day sleep debt.
                  </p>
                  <p>
                    • <strong>Sleep Rating (Triple Rings):</strong> Displays your composite 0–100 score (e.g. <strong>92</strong>) based on duration, deep quality, efficiency, and heart dip.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Sleep Clock & Sounds */}
            {step === 4 && (
              <div className="p-4 rounded-2xl bg-oled-darker border border-white/10 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stage-awake/20 border border-stage-awake/40 flex items-center justify-center text-xl">
                    ⏰
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">4. 90-Min Sleep Cycles & Sleep Sounds</h3>
                    <p className="text-xs text-text-secondary">Wake up at the peak of a natural cycle</p>
                  </div>
                </div>
                <div className="text-xs text-text-primary space-y-2 leading-relaxed">
                  <p>
                    • Go to the <strong>Clock tab</strong> to see optimal wake-up times (e.g. 5:45 AM, 7:15 AM) if you fall asleep now.
                  </p>
                  <p>
                    • Play built-in soothing <strong>Pink Noise, Brown Noise, Rain, or Ocean Waves</strong> synthesized directly client-side with an auto-timer.
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Logging, Editing & Data Portability */}
            {step === 5 && (
              <div className="p-4 rounded-2xl bg-oled-darker border border-white/10 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ring-coral/20 border border-ring-coral/40 flex items-center justify-center text-xl">
                    ✏️
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">5. Logging, Editing & Backups</h3>
                    <p className="text-xs text-text-secondary">Full control over all your sleep data</p>
                  </div>
                </div>
                <div className="text-xs text-text-primary space-y-2 leading-relaxed">
                  <p>
                    • Tap the <strong>Pencil icon</strong> or go to <strong>Day/Edit</strong> to adjust stage sliders, resting heart rate, caffeine/alcohol tags, and mood.
                  </p>
                  <p>
                    • Go to <strong>Settings</strong> to set your sleep goals, export complete JSON/CSV backups, or reload the sample dataset.
                  </p>
                </div>
              </div>
            )}

            {/* Tutorial Stepper Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
                className="px-3.5 py-1.5 rounded-xl bg-oled-darker border border-white/10 text-text-secondary hover:text-white disabled:opacity-30 text-xs font-bold transition-all"
              >
                ◀ Previous
              </button>

              {step < totalSteps ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-4 py-1.5 rounded-xl bg-stage-light hover:bg-white text-black font-bold text-xs transition-all shadow-md active:scale-95"
                >
                  Next Step ▶
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-xl bg-stage-awake hover:bg-white text-black font-extrabold text-xs transition-all shadow-glow-green active:scale-95"
                >
                  Start Tracking! ✓
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Color Legend */}
        {activeTab === 'legend' && (
          <div className="space-y-3 text-xs text-text-secondary">
            <p className="text-white font-semibold">
              Understanding the Sleep Session Hypnogram Colors:
            </p>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-oled-darker/60 border border-white/5 flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-stage-awake mt-0.5 shrink-0 shadow-glow-green" />
                <div>
                  <span className="font-bold text-white block">AWAKE (Emerald Green)</span>
                  <span>Time falling asleep or brief awakenings. Normal is 5%–10% of time in bed.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-oled-darker/60 border border-white/5 flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-stage-light mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-white block">LIGHT / REM SLEEP (Sky Blue)</span>
                  <span>Mental restoration, memory consolidation, and dreams (~50% of the night).</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-oled-darker/60 border border-white/5 flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-stage-still mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-white block">STILL SLEEP (Slate Cyan)</span>
                  <span>Periods of calm, motionless, restful physiological stillness.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-oled-darker/60 border border-white/5 flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-stage-deep mt-0.5 shrink-0 shadow-glow-purple" />
                <div>
                  <span className="font-bold text-white block">DEEP SLEEP (Violet Purple - Downward Bars)</span>
                  <span>Slow-wave physical repair where growth hormone is secreted (target &ge; 20%).</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-oled-darker/60 border border-white/5 flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-stage-hr mt-0.5 shrink-0 shadow-glow-coral" />
                <div>
                  <span className="font-bold text-white block">HEART RATE (Red Dashed Line & Badge)</span>
                  <span>Resting BPM trendline dipping during restorative deep sleep.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Scoring Science */}
        {activeTab === 'scores' && (
          <div className="space-y-3 text-xs text-text-secondary">
            <div className="p-3 rounded-xl bg-oled-darker/60 border border-white/5 space-y-1">
              <span className="font-bold text-ring-gold block text-sm">Sleep Rating (0–100 Score)</span>
              <p>A multi-variable composite score calculated from 4 proven sleep medicine metrics:</p>
              <ul className="list-disc list-inside space-y-0.5 pt-1 text-[11px] text-white">
                <li><strong>Duration (35%):</strong> Progress towards your sleep target (e.g. 8 hrs).</li>
                <li><strong>Deep Quality (30%):</strong> Reaching &ge; 20% deep sleep yields max score.</li>
                <li><strong>Efficiency (20%):</strong> Time asleep vs total time in bed (&ge; 90% ideal).</li>
                <li><strong>Resting HR Dip (15%):</strong> 10%–15% nocturnal dip vs daytime baseline.</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-oled-darker/60 border border-white/5 space-y-1">
              <span className="font-bold text-stage-light block text-sm">Sleep Bank (14-Day Rolling Debt)</span>
              <p>
                Calculates cumulative deficits vs your target. Surplus sleep days replenish your balance. Keeping debt under 15% maintains optimal energy.
              </p>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
        >
          Close Guide
        </button>
      </div>
    </div>
  );
};
