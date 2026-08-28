import React, { useState } from 'react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'legend' | 'scores' | 'features'>('legend');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="bg-oled-card border border-white/15 rounded-[24px] max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              AutoRest Guide & Legend
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-oled-darker p-1 rounded-xl border border-white/10 text-xs">
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
            📊 How Scores Work
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'features' ? 'bg-white/15 text-white shadow-sm' : 'text-text-secondary hover:text-white'
            }`}
          >
            🧭 App Navigation
          </button>
        </div>

        {/* TAB 1: Color Legend */}
        {activeTab === 'legend' && (
          <div className="space-y-3.5 text-xs text-text-secondary">
            <p className="text-white font-semibold">
              Understanding the Sleep Session Hypnogram:
            </p>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-oled-darker/60 border border-white/5 flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-stage-awake mt-0.5 shrink-0 shadow-glow-green" />
                <div>
                  <span className="font-bold text-white block">AWAKE (Emerald Green)</span>
                  <span>Time falling asleep (latency) or brief night awakenings. Normal is 5%–10% of time in bed.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-oled-darker/60 border border-white/5 flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-stage-light mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-white block">LIGHT / REM SLEEP (Sky Blue)</span>
                  <span>Core restorative sleep for mental processing, memory consolidation, and dreams (~50% of night).</span>
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
                  <span>Slow-wave physical repair sleep where growth hormone is released. Target is $\ge 20\%$ of total sleep.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-oled-darker/60 border border-white/5 flex items-start gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-stage-hr mt-0.5 shrink-0 shadow-glow-coral" />
                <div>
                  <span className="font-bold text-white block">HEART RATE (Red Dashed Line & Badge)</span>
                  <span>Continuous nocturnal heart rate curve. Healthy sleep exhibits a 10%–15% dip during deep sleep cycles.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: How Scores Work */}
        {activeTab === 'scores' && (
          <div className="space-y-3 text-xs text-text-secondary">
            <div className="p-3 rounded-xl bg-oled-darker/60 border border-white/5 space-y-1">
              <span className="font-bold text-ring-gold block text-sm">Sleep Rating (0–100 Score)</span>
              <p>A multi-variable composite score calculated from 4 proven sleep medicine metrics:</p>
              <ul className="list-disc list-inside space-y-0.5 pt-1 text-[11px] text-white">
                <li><strong>Duration (35%):</strong> How close you were to your nightly target (e.g. 8 hrs).</li>
                <li><strong>Deep Quality (30%):</strong> Reaching at least 20% deep sleep yields top points.</li>
                <li><strong>Efficiency (20%):</strong> Time asleep vs total time in bed (ideal &ge; 90%).</li>
                <li><strong>Resting HR Dip (15%):</strong> Healthy dip during sleep compared to daytime baseline.</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-oled-darker/60 border border-white/5 space-y-1">
              <span className="font-bold text-stage-light block text-sm">Sleep Bank & Debt %</span>
              <p>
                Tracks your cumulative surplus or deficit over a rolling 14-day window. If you sleep less than your target, debt accumulates. Consistent recovery sleep refills your bank.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-oled-darker/60 border border-white/5 space-y-1">
              <span className="font-bold text-stage-awake block text-sm">Icon Breakdown</span>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-white">
                <span className="flex items-center gap-1.5">🌙 <strong>Moon:</strong> Total Time Asleep</span>
                <span className="flex items-center gap-1.5">⭐ <strong>Star:</strong> Quality / Light Sleep</span>
                <span className="flex items-center gap-1.5">ⓩ <strong>Z Badge:</strong> Still Restful Sleep</span>
                <span className="flex items-center gap-1.5">❤️ <strong>Heart:</strong> Average Sleeping HR</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Feature Walkthrough */}
        {activeTab === 'features' && (
          <div className="space-y-2.5 text-xs text-text-secondary">
            <div className="p-2.5 rounded-xl bg-oled-darker/60 border border-white/5">
              <span className="font-bold text-white block">📅 1. Today View</span>
              <span>Your primary dashboard. Use the ◀ / ▶ arrows to view previous days or tap the pencil icon to edit.</span>
            </div>

            <div className="p-2.5 rounded-xl bg-oled-darker/60 border border-white/5">
              <span className="font-bold text-white block">⏰ 2. Sleep Clock</span>
              <span>Calculate 90-minute sleep cycles to wake up feeling fresh, and play soothing built-in sounds (Rain, Waves, Brown Noise).</span>
            </div>

            <div className="p-2.5 rounded-xl bg-oled-darker/60 border border-white/5">
              <span className="font-bold text-white block">📊 3. History & Trends</span>
              <span>View your 4-week calendar heatmap and see how caffeine, alcohol, or late exercise correlate with your sleep scores.</span>
            </div>

            <div className="p-2.5 rounded-xl bg-oled-darker/60 border border-white/5">
              <span className="font-bold text-white block">📝 4. Day / Edit</span>
              <span>Log new sleep sessions manually or click "Auto-Calculate Realistic Stages" to simulate a full clinical hypnogram!</span>
            </div>

            <div className="p-2.5 rounded-xl bg-oled-darker/60 border border-white/5">
              <span className="font-bold text-white block">⚙️ 5. Settings</span>
              <span>Adjust your sleep goals and export complete JSON / CSV backups with 1 click.</span>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-stage-light text-black font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md active:scale-98"
        >
          Got It, Let's Track!
        </button>
      </div>
    </div>
  );
};
