# 🌙 AutoRest — AutoSleep-Inspired Sleep Tracker (PWA)

> A client-side, 100% private, zero-server-cost **Sleep Tracking & Sleep Debt Analytics Web App (PWA)** deployable for free on **GitHub Pages**.  
> Faithfully recreates the iconic Apple Health / AutoSleep dark OLED dashboard UI with multi-user support, sleep debt science, and procedural audio synthesis.

[![Deploy to GitHub Pages](https://github.com/actions/deploy-pages/actions/workflows/deploy.yml/badge.svg)](https://github.com)

---

## 🌟 Key Highlights

- **Dark OLED Dashboard**: Deep slate containers (`#141923`), faint ambient mechanical gears watermark, and mobile-optimized responsiveness.
- **Sleep Session Hypnogram**: Multi-stage vertical bars (`AWAKE` green, `LIGHT` sky blue, `STILL` cyan, `DEEP` downward purple bars) overlaid with crimson resting heart rate trendline (`❤️ 64` bpm) and live hover/touch tooltips.
- **Concentric Activity Rings**: Dual and triple animated SVG rings tracking sleep duration, quality, efficiency, and sleep debt balance.
- **Deep Sleep Science Engine**:
  - 14-Day Rolling Sleep Debt ("Sleep Bank %") with surplus credits.
  - 0–100 Composite Sleep Rating.
  - Daily Physiological Readiness Recovery score.
  - 90-Minute Ultradian Sleep Cycle calculator.
- **Sleep Clock & Procedural Audio Synthesizer**: Built-in Pink Noise, Brown Noise, Rain, and Ocean Wave generators synthesized directly via Web Audio API (0 network audio files).
- **Multi-User Profile System**: Switch between user profiles with independent goals, sleep logs, and isolated local storage.
- **Date Manipulation & History**: Direct calendar picker to navigate and log any historical date, 4-week calendar score heatmap, and lifestyle habit correlations (Caffeine, Alcohol, Reading, etc.).
- **100% Private & Local-First**: Zero cloud dependencies, offline PWA support, 1-click JSON backup/restore, and CSV export.

---

## 📖 Documentation

For full architectural details, mathematical formulas, and feature breakdowns, see **[DOCUMENTATION.md](./DOCUMENTATION.md)**.

---

## 🚀 Quick Start

### 1. Local Development

```bash
# Clone the repository
git clone https://github.com/ben-bacs/Sleep-Tracker.git
cd Sleep-Tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

---

### 2. Free GitHub Pages Deployment

1. Push your repository to GitHub:
   ```bash
   git push -u origin main
   ```
2. In your repository on GitHub:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. GitHub Actions will automatically build and publish your app at:
   `https://<YOUR_GITHUB_USERNAME>.github.io/Sleep-Tracker/`

---

## 📄 License
Open-source under the MIT License.
