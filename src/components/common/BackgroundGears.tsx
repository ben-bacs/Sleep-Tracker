import React from 'react';

export const BackgroundGears: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center select-none">
      <svg
        className="w-[850px] h-[850px] opacity-[0.12] transform translate-y-36"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="gearGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer large cyan/slate gear */}
        <g className="animate-spin-slow origin-center" style={{ transformOrigin: '200px 200px' }}>
          <circle cx="200" cy="200" r="140" stroke="#38BDF8" strokeWidth="12" strokeDasharray="14 18" />
          <circle cx="200" cy="200" r="115" stroke="#0EA5E9" strokeWidth="4" />
          <circle cx="200" cy="200" r="70" fill="url(#gearGlow)" />
        </g>

        {/* Secondary interlocking green gear */}
        <g className="animate-spin-reverse origin-center" style={{ transformOrigin: '290px 290px' }}>
          <circle cx="290" cy="290" r="85" stroke="#22C55E" strokeWidth="10" strokeDasharray="12 14" opacity="0.8" />
          <circle cx="290" cy="290" r="65" stroke="#22C55E" strokeWidth="3" opacity="0.6" />
        </g>

        {/* Small ruby / coral gear */}
        <g className="animate-spin-slow origin-center" style={{ transformOrigin: '110px 300px' }}>
          <circle cx="110" cy="300" r="60" stroke="#FB7185" strokeWidth="8" strokeDasharray="10 12" opacity="0.7" />
          <circle cx="110" cy="300" r="45" stroke="#F43F5E" strokeWidth="2" opacity="0.5" />
        </g>

        {/* Violet upper gear */}
        <g className="animate-spin-reverse origin-center" style={{ transformOrigin: '110px 100px' }}>
          <circle cx="110" cy="100" r="75" stroke="#A855F7" strokeWidth="8" strokeDasharray="10 16" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
};

