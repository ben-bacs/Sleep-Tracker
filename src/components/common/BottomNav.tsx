import React from 'react';

export type NavTab = 'today' | 'clock' | 'history' | 'edit' | 'settings';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  todayDateNumber?: number;
  todayDayShort?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  todayDateNumber = 16,
  todayDayShort = 'TUE'
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#080A0F]/90 backdrop-blur-xl border-t border-white/[0.08] px-4 py-2 pb-safe max-w-md mx-auto">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Tab 1: Today */}
        <button
          onClick={() => onTabChange('today')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'today' ? 'text-white' : 'text-text-secondary/70 hover:text-text-secondary'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-md border flex flex-col items-center justify-center transition-all ${
              currentTab === 'today'
                ? 'border-white bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                : 'border-text-secondary/60 bg-transparent'
            }`}
          >
            <span className="text-[6.5px] font-bold uppercase tracking-tighter leading-none text-text-secondary">
              {todayDayShort}
            </span>
            <span className="text-[11px] font-extrabold leading-none mt-0.5">
              {todayDateNumber}
            </span>
          </div>
          <span className="text-[10px] font-semibold mt-1 tracking-tight">Today</span>
        </button>

        {/* Tab 2: Clock */}
        <button
          onClick={() => onTabChange('clock')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'clock' ? 'text-white' : 'text-text-secondary/70 hover:text-text-secondary'
          }`}
        >
          <div className="w-7 h-7 flex items-center justify-center">
            <svg
              className={`w-6 h-6 ${currentTab === 'clock' ? 'stroke-white' : 'stroke-current'}`}
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <span className="text-[10px] font-semibold mt-1 tracking-tight">Clock</span>
        </button>

        {/* Tab 3: History */}
        <button
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'history' ? 'text-white' : 'text-text-secondary/70 hover:text-text-secondary'
          }`}
        >
          <div className="w-7 h-7 flex items-center justify-center">
            {/* 3x3 Grid */}
            <svg
              className={`w-6 h-6 ${currentTab === 'history' ? 'stroke-white' : 'stroke-current'}`}
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="4" height="4" rx="1" />
              <rect x="10" y="3" width="4" height="4" rx="1" />
              <rect x="17" y="3" width="4" height="4" rx="1" />
              <rect x="3" y="10" width="4" height="4" rx="1" />
              <rect x="10" y="10" width="4" height="4" rx="1" />
              <rect x="17" y="10" width="4" height="4" rx="1" />
              <rect x="3" y="17" width="4" height="4" rx="1" />
              <rect x="10" y="17" width="4" height="4" rx="1" />
              <rect x="17" y="17" width="4" height="4" rx="1" />
            </svg>
          </div>
          <span className="text-[10px] font-semibold mt-1 tracking-tight">History</span>
        </button>

        {/* Tab 4: Day/Edit */}
        <button
          onClick={() => onTabChange('edit')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'edit' ? 'text-white' : 'text-text-secondary/70 hover:text-text-secondary'
          }`}
        >
          <div className="w-7 h-7 flex items-center justify-center">
            {/* Calendar with clock/pencil */}
            <svg
              className={`w-6 h-6 ${currentTab === 'edit' ? 'stroke-white' : 'stroke-current'}`}
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v4M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
              <path d="M12 14v4M10 16h4" />
            </svg>
          </div>
          <span className="text-[10px] font-semibold mt-1 tracking-tight">Day/Edit</span>
        </button>

        {/* Tab 5: Settings */}
        <button
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'settings' ? 'text-white' : 'text-text-secondary/70 hover:text-text-secondary'
          }`}
        >
          <div className="w-7 h-7 flex items-center justify-center">
            <svg
              className={`w-6 h-6 ${currentTab === 'settings' ? 'stroke-white' : 'stroke-current'}`}
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <span className="text-[10px] font-semibold mt-1 tracking-tight">Settings</span>
        </button>
      </div>
    </nav>
  );
};

