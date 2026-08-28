import React, { useState } from 'react';
import { SleepSession, SleepStage } from '../../types/sleep';

interface HypnogramChartProps {
  session: SleepSession;
}

export const HypnogramChart: React.FC<HypnogramChartProps> = ({ session }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const stages = session.stages || [];
  const hrSeries = session.heartRateSeries || [];

  // Dimensions
  const height = 160;
  const baselineY = 118; // Base line separating deep sleep (below) from light/awake (above)
  const awakeY = 24;
  const lightY = 65;
  const stillY = 96;
  const deepBottomY = 148;

  // Generate hourly tick marks based on start time
  const startDate = new Date(session.bedtime);
  const startHour = startDate.getHours(); // e.g. 23 (11 PM)

  const hoursList = [
    { label: '12', hour: 0 },
    { label: '1', hour: 1 },
    { label: '2', hour: 2 },
    { label: '3', hour: 3 },
    { label: '4', hour: 4 },
    { label: '5', hour: 5 },
    { label: '6', hour: 6 },
  ];

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  const startTimeStr = formatTime(session.bedtime);
  const endTimeStr = formatTime(session.wakeTime);

  const asleepHours = Math.floor(session.timeAsleepMinutes / 60);
  const asleepMins = Math.round(session.timeAsleepMinutes % 60);
  const inBedHours = Math.floor(session.timeInBedMinutes / 60);
  const inBedMins = Math.round(session.timeInBedMinutes % 60);

  const numSegments = Math.max(1, stages.length);

  return (
    <div className="w-full select-none">
      {/* Chart Canvas Area */}
      <div className="relative w-full h-[180px] bg-transparent">
        {/* Y-Axis Labels */}
        <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between text-[10px] font-semibold text-text-secondary/70 pointer-events-none z-10">
          <span className="text-stage-awake/90 leading-none">AWAKE</span>
          <span className="text-stage-light/90 leading-none">LIGHT</span>
          <span className="text-stage-still/80 leading-none">STILL</span>
          <span className="text-stage-deep/90 leading-none">DEEP</span>
        </div>

        {/* SVG Visualization */}
        <svg className="w-full h-full" viewBox="0 0 360 180" preserveAspectRatio="none">
          {/* Subtle Grid Guidelines */}
          <line x1="48" y1={awakeY} x2="350" y2={awakeY} stroke="#22C55E" strokeWidth="0.8" strokeOpacity="0.4" />
          <line x1="48" y1={lightY} x2="350" y2={lightY} stroke="#38BDF8" strokeWidth="0.5" strokeOpacity="0.2" />
          <line x1="48" y1={baselineY} x2="350" y2={baselineY} stroke="#475569" strokeWidth="0.8" strokeOpacity="0.5" />

          {/* Segmented Hypnogram Bars */}
          {stages.map((seg, idx) => {
            const barWidth = Math.max(4, (350 - 52) / numSegments - 2.5);
            const x = 52 + idx * ((350 - 52) / numSegments);

            let y = baselineY;
            let barHeight = 0;
            let fill = '#38BDF8';
            let rx = 1.5;

            if (seg.stage === 'awake') {
              y = awakeY;
              barHeight = baselineY - awakeY;
              fill = '#22C55E';
            } else if (seg.stage === 'light') {
              y = lightY;
              barHeight = baselineY - lightY;
              fill = '#38BDF8';
            } else if (seg.stage === 'still') {
              y = stillY;
              barHeight = baselineY - stillY;
              fill = '#0EA5E9';
            } else if (seg.stage === 'deep') {
              y = baselineY + 2;
              barHeight = deepBottomY - baselineY;
              fill = '#A855F7';
            }

            const isHovered = hoveredIndex === idx;

            return (
              <g
                key={seg.id || idx}
                className="cursor-pointer transition-opacity duration-150"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setHoveredIndex(isHovered ? null : idx)}
              >
                {/* Clickable hit area */}
                <rect
                  x={x - 1}
                  y={awakeY - 4}
                  width={barWidth + 2}
                  height={deepBottomY - awakeY + 8}
                  fill="transparent"
                />
                {/* Visible stage bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(3, barHeight)}
                  rx={rx}
                  fill={fill}
                  opacity={hoveredIndex !== null && !isHovered ? 0.4 : 0.95}
                  className="transition-all duration-200"
                />
              </g>
            );
          })}

          {/* Red Dotted / Segmented Heart Rate Overlay Line */}
          {hrSeries.length > 1 && (
            <g>
              {hrSeries.map((pt, idx) => {
                if (idx === hrSeries.length - 1) return null;
                const nextPt = hrSeries[idx + 1];

                const x1 = 52 + idx * ((350 - 52) / Math.max(1, hrSeries.length - 1));
                const x2 = 52 + (idx + 1) * ((350 - 52) / Math.max(1, hrSeries.length - 1));

                // Map bpm (e.g. 50 to 90) to y-axis (range: 110 to 30)
                const minBpm = 50;
                const maxBpm = 95;
                const normalized1 = (pt.bpm - minBpm) / (maxBpm - minBpm);
                const normalized2 = (nextPt.bpm - minBpm) / (maxBpm - minBpm);

                const y1 = 115 - normalized1 * 75;
                const y2 = 115 - normalized2 * 75;

                return (
                  <line
                    key={`hr-seg-${idx}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#F43F5E"
                    strokeWidth="2.2"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Heart Rate Endpoint Badge: Heart icon + 64 */}
              <g transform="translate(345, 58)">
                <circle cx="0" cy="0" r="3" fill="#F43F5E" />
              </g>
            </g>
          )}
        </svg>

        {/* Resting HR Badge in top-right of chart */}
        <div className="absolute right-1 top-8 flex items-center gap-1 bg-oled/90 px-1.5 py-0.5 rounded border border-stage-hr/30 shadow-sm">
          <span className="text-[10px] text-stage-hr animate-pulse">❤️</span>
          <span className="text-[11px] font-bold text-white tracking-tight">{session.restingHeartRate}</span>
        </div>

        {/* Hover / Touch Tooltip */}
        {hoveredIndex !== null && stages[hoveredIndex] && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-oled-card/95 border border-white/20 px-3 py-1.5 rounded-lg shadow-xl text-xs z-20 flex items-center gap-3 backdrop-blur-md">
            <span className="font-semibold text-white uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded" style={{
              backgroundColor:
                stages[hoveredIndex].stage === 'awake' ? '#22C55E' :
                stages[hoveredIndex].stage === 'light' ? '#38BDF8' :
                stages[hoveredIndex].stage === 'still' ? '#0EA5E9' : '#A855F7',
              color: '#080A0F'
            }}>
              {stages[hoveredIndex].stage}
            </span>
            <span className="text-text-secondary text-[11px]">
              {formatTime(stages[hoveredIndex].startTime)}
            </span>
            {hrSeries[hoveredIndex] && (
              <span className="text-stage-hr font-bold text-[11px] flex items-center gap-0.5">
                ❤️ {hrSeries[hoveredIndex].bpm} bpm
              </span>
            )}
          </div>
        )}

        {/* X-Axis Hour Labels & Dots matching reference UI */}
        <div className="absolute left-12 right-2 bottom-0 flex items-center justify-between text-[11px] font-medium text-text-secondary/70">
          {hoursList.map((h, i) => (
            <React.Fragment key={h.label}>
              <span className="hover:text-white transition-colors">{h.label}</span>
              {i < hoursList.length - 1 && <span className="text-[8px] opacity-40">•</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bottom Summary Row: Timespan & Asleep/In-Bed */}
      <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-white/[0.06] text-xs font-semibold text-text-primary">
        <span className="text-text-secondary font-medium tracking-wide">
          {startTimeStr} - {endTimeStr}
        </span>
        <div className="flex items-center gap-1 text-white">
          <span className="text-ring-gold text-sm">🌙</span>
          <span className="tracking-tight font-bold">{asleepHours}:{asleepMins < 10 ? '0' : ''}{asleepMins}</span>
          <span className="text-text-secondary/60 font-normal">/</span>
          <span className="text-text-secondary font-normal">{inBedHours}:{inBedMins < 10 ? '0' : ''}{inBedMins}</span>
        </div>
      </div>
    </div>
  );
};

