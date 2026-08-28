/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        oled: {
          DEFAULT: '#080A0F',
          darker: '#05070A',
          card: '#141923',
          cardBorder: 'rgba(255, 255, 255, 0.08)',
          subtle: '#1C2331',
        },
        stage: {
          awake: '#22C55E',      // Green
          light: '#38BDF8',      // Sky Blue
          still: '#0EA5E9',      // Slate Cyan / Still
          deep: '#A855F7',       // Purple / Violet
          hr: '#F43F5E',         // Crimson / Heart Rate
        },
        ring: {
          gold: '#FACC15',       // Radiant Yellow / Gold
          amber: '#F59E0B',      // Amber
          green: '#4ADE80',      // Lime Green
          coral: '#FB7185',      // Bright Coral / Red
          scoreGreen: '#22C55E', // Score Green
        },
        text: {
          primary: '#EBEBE6',
          secondary: '#7E8B9B',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'Inter',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.35)',
        'glow-gold': '0 0 20px rgba(250, 204, 21, 0.35)',
        'glow-coral': '0 0 20px rgba(251, 113, 133, 0.35)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.35)',
        'card': '0 4px 24px -1px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 120s linear infinite',
        'spin-reverse': 'spin 90s linear infinite reverse',
      }
    },
  },
  plugins: [],
}

