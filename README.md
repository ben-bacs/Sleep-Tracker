# 🌙 AutoRest (Sleep Tracker)

> A client-side, 100% private, zero-server-cost **Sleep Tracking & Sleep Debt Analytics Web App (PWA)** inspired by the iconic Apple Health / AutoSleep dark dashboard UI.

[![Deploy to GitHub Pages](https://github.com/actions/deploy-pages/actions/workflows/deploy.yml/badge.svg)](https://github.com)

---

## ✨ Features

- **Iconic AutoSleep OLED Dashboard**: Dark slate cards (`#141923`), subtle background mechanical gear watermark, and full mobile responsiveness.
- **Sleep Session Hypnogram**: Multi-stage vertical bars (`AWAKE` green, `LIGHT` sky blue, `STILL` cyan, and `DEEP` downward purple bars) overlaid with crimson resting heart rate line (`❤️ 64` bpm).
- **Concentric Activity Rings**:
  - Dual SVG rings (Gold duration vs goal + Coral sleep bank balance).
  - Triple SVG rings (Amber duration + Green quality + Yellow restfulness) with glowing central score badge (`92`).
- **Sleep Science Engine**:
  - 14-Day Rolling Sleep Debt ("Sleep Bank %").
  - 0–100 Composite Sleep Rating score.
  - Physiological Readiness Recovery gauge.
- **Sleep Clock & Cycle Companion**:
  - 90-minute ultradian sleep cycle calculator (Sleep Now vs Wake At modes).
  - Built-in procedural Web Audio sleep sound synthesizer (Pink Noise, Brown Noise, Rain, Ocean Waves) with fade-out timers.
- **History & Correlation Analytics**:
  - 4-Week calendar score heatmap.
  - Stacked sleep architecture trends.
  - Lifestyle tag correlation analytics (Caffeine, Alcohol, Melatonin, Late Workouts, etc.).
- **100% Private & Local-First**:
  - Data stored on device (`localStorage` + `IndexedDB`).
  - 1-click JSON backup export & import.
  - CSV spreadsheet export.
  - Instant 14-day sample dataset preloader.

---

## 🚀 Getting Started

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build static production distribution
npm run build
```

---

## 🌐 Deploy to GitHub Pages (100% Free)

1. Push this repository to GitHub.
2. In your repository on GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build and deploy the app to your GitHub Pages URL:
   `https://<your-username>.github.io/Sleep-Tracker/`

