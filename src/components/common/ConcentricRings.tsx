import React from 'react';

export interface RingConfig {
  radius: number;
  strokeWidth: number;
  progress: number; // 0 to 100+
  color: string;
  bgColor?: string;
  markerIcon?: 'moon' | 'star' | 'heart' | 'z' | 'number';
  markerValue?: string | number;
}

interface DualRingsProps {
  outerProgress: number; // e.g. 77% (6h 9m / 8h)
  innerProgress: number; // e.g. 70%
  size?: number;
}

interface TripleRingsProps {
  score: number; // 0-100 score (e.g. 92)
  outerProgress: number; // Duration % (e.g. 77)
  middleProgress: number; // Quality % (e.g. 85)
  innerProgress: number; // Efficiency / Restfulness % (e.g. 92)
  size?: number;
}

export const DualRings: React.FC<DualRingsProps> = ({
  outerProgress,
  innerProgress,
  size = 140
}) => {
  const center = size / 2;
  const strokeWidth = 14;
  const gap = 3;

  const outerR = center - strokeWidth / 2 - 4;
  const innerR = outerR - strokeWidth - gap;

  const outerCircumference = 2 * Math.PI * outerR;
  const innerCircumference = 2 * Math.PI * innerR;

  const outerClamped = Math.min(100, Math.max(0, outerProgress));
  const innerClamped = Math.min(100, Math.max(0, innerProgress));

  const outerOffset = outerCircumference - (outerClamped / 100) * outerCircumference;
  const innerOffset = innerCircumference - (innerClamped / 100) * innerCircumference;

  // Marker angle for outer ring (starts at -90deg)
  const outerAngleDeg = -90 + (outerClamped / 100) * 360;
  const outerAngleRad = (outerAngleDeg * Math.PI) / 180;
  const outerMarkerX = center + outerR * Math.cos(outerAngleRad);
  const outerMarkerY = center + outerR * Math.sin(outerAngleRad);

  // Marker for inner ring start
  const innerMarkerAngleDeg = -90 + (innerClamped / 100) * 360;
  const innerMarkerAngleRad = (innerMarkerAngleDeg * Math.PI) / 180;
  const innerMarkerX = center + innerR * Math.cos(innerMarkerAngleRad);
  const innerMarkerY = center + innerR * Math.sin(innerMarkerAngleRad);

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background Track 1 (Outer) */}
        <circle
          cx={center}
          cy={center}
          r={outerR}
          fill="none"
          stroke="#382E0B"
          strokeWidth={strokeWidth}
          opacity="0.55"
        />
        {/* Background Track 2 (Inner) */}
        <circle
          cx={center}
          cy={center}
          r={innerR}
          fill="none"
          stroke="#3B181E"
          strokeWidth={strokeWidth}
          opacity="0.55"
        />

        {/* Outer Ring - Radiant Gold */}
        <circle
          cx={center}
          cy={center}
          r={outerR}
          fill="none"
          stroke="#FACC15"
          strokeWidth={strokeWidth}
          strokeDasharray={outerCircumference}
          strokeDashoffset={outerOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />

        {/* Inner Ring - Bright Coral */}
        <circle
          cx={center}
          cy={center}
          r={innerR}
          fill="none"
          stroke="#FB7185"
          strokeWidth={strokeWidth}
          strokeDasharray={innerCircumference}
          strokeDashoffset={innerOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Markers placed on SVG overlay */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 pointer-events-none">
        {/* Outer Ring Moon Marker */}
        <g transform={`translate(${outerMarkerX}, ${outerMarkerY})`}>
          <circle r="6" fill="#141923" stroke="#FACC15" strokeWidth="1.5" />
          <path
            d="M-2 -3.5 A3.5 3.5 0 0 0 2 3.5 A2.5 2.5 0 0 1 -2 -3.5"
            fill="#FACC15"
          />
        </g>

        {/* Inner Ring Number Marker */}
        <g transform={`translate(${innerMarkerX}, ${innerMarkerY})`}>
          <circle r="6" fill="#FB7185" />
          <text
            x="0"
            y="2.5"
            textAnchor="middle"
            fill="#141923"
            fontSize="7"
            fontWeight="bold"
            fontFamily="system-ui"
          >
            7
          </text>
        </g>
      </svg>

      {/* Center Display: Glowing Crescent Moon + % */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-14 h-14 rounded-full bg-[#080A0F]/90 border border-white/10 flex items-center justify-center shadow-inner">
          <div className="flex items-center text-ring-gold drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">
            <svg className="w-6 h-6 fill-current -mr-1" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <span className="text-[10px] font-bold mt-1 text-ring-gold/90">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TripleRings: React.FC<TripleRingsProps> = ({
  score,
  outerProgress,
  middleProgress,
  innerProgress,
  size = 140
}) => {
  const center = size / 2;
  const strokeWidth = 11;
  const gap = 2.5;

  const outerR = center - strokeWidth / 2 - 3;
  const middleR = outerR - strokeWidth - gap;
  const innerR = middleR - strokeWidth - gap;

  const outerCircumference = 2 * Math.PI * outerR;
  const middleCircumference = 2 * Math.PI * middleR;
  const innerCircumference = 2 * Math.PI * innerR;

  const outerClamped = Math.min(100, Math.max(0, outerProgress));
  const middleClamped = Math.min(100, Math.max(0, middleProgress));
  const innerClamped = Math.min(100, Math.max(0, innerProgress));

  const outerOffset = outerCircumference - (outerClamped / 100) * outerCircumference;
  const middleOffset = middleCircumference - (middleClamped / 100) * middleCircumference;
  const innerOffset = innerCircumference - (innerClamped / 100) * innerCircumference;

  // Markers
  const outerAngleRad = ((-90 + (outerClamped / 100) * 360) * Math.PI) / 180;
  const outerMarkerX = center + outerR * Math.cos(outerAngleRad);
  const outerMarkerY = center + outerR * Math.sin(outerAngleRad);

  const middleAngleRad = ((-90 + (middleClamped / 100) * 360) * Math.PI) / 180;
  const middleMarkerX = center + middleR * Math.cos(middleAngleRad);
  const middleMarkerY = center + middleR * Math.sin(middleAngleRad);

  const innerAngleRad = ((-90 + (innerClamped / 100) * 360) * Math.PI) / 180;
  const innerMarkerX = center + innerR * Math.cos(innerAngleRad);
  const innerMarkerY = center + innerR * Math.sin(innerAngleRad);

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background Tracks */}
        <circle cx={center} cy={center} r={outerR} fill="none" stroke="#3D290A" strokeWidth={strokeWidth} opacity="0.55" />
        <circle cx={center} cy={center} r={middleR} fill="none" stroke="#382E0B" strokeWidth={strokeWidth} opacity="0.55" />
        <circle cx={center} cy={center} r={innerR} fill="none" stroke="#0D2E16" strokeWidth={strokeWidth} opacity="0.55" />

        {/* Outer Ring - Amber / Yellow */}
        <circle
          cx={center}
          cy={center}
          r={outerR}
          fill="none"
          stroke="#F59E0B"
          strokeWidth={strokeWidth}
          strokeDasharray={outerCircumference}
          strokeDashoffset={outerOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />

        {/* Middle Ring - Bright Gold */}
        <circle
          cx={center}
          cy={center}
          r={middleR}
          fill="none"
          stroke="#FACC15"
          strokeWidth={strokeWidth}
          strokeDasharray={middleCircumference}
          strokeDashoffset={middleOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />

        {/* Inner Ring - Lime Green */}
        <circle
          cx={center}
          cy={center}
          r={innerR}
          fill="none"
          stroke="#22C55E"
          strokeWidth={strokeWidth}
          strokeDasharray={innerCircumference}
          strokeDashoffset={innerOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Markers */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 pointer-events-none">
        {/* Outer Ring Moon Marker */}
        <g transform={`translate(${outerMarkerX}, ${outerMarkerY})`}>
          <circle r="5" fill="#141923" stroke="#F59E0B" strokeWidth="1" />
          <path d="M-1.5 -2.5 A2.5 2.5 0 0 0 1.5 2.5 A1.8 1.8 0 0 1 -1.5 -2.5" fill="#F59E0B" />
        </g>

        {/* Middle Ring Star Marker */}
        <g transform={`translate(${middleMarkerX}, ${middleMarkerY})`}>
          <circle r="5" fill="#141923" stroke="#FACC15" strokeWidth="1" />
          <polygon points="0,-2.5 0.8,-0.8 2.5,-0.8 1.2,0.3 1.7,2.2 0,1.1 -1.7,2.2 -1.2,0.3 -2.5,-0.8 -0.8,-0.8" fill="#FACC15" />
        </g>

        {/* Inner Ring Z Marker */}
        <g transform={`translate(${innerMarkerX}, ${innerMarkerY})`}>
          <circle r="5" fill="#22C55E" />
          <text x="0" y="2" textAnchor="middle" fill="#080A0F" fontSize="5.5" fontWeight="bold" fontFamily="system-ui">z</text>
        </g>
      </svg>

      {/* Center Display: Glowing Score Badge */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-13 h-13 rounded-full bg-[#080A0F] border border-ring-scoreGreen/40 flex items-center justify-center shadow-[0_0_12px_rgba(34,197,94,0.35)]">
          <span className="text-xl font-extrabold text-white tracking-tight">
            {score}
          </span>
        </div>
      </div>
    </div>
  );
};

