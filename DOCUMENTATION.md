# 🌙 AutoRest — Complete Project Documentation

> **AutoRest** is a production-grade, zero-server-cost, 100% private **Sleep Tracking & Sleep Debt Analytics Web Application (PWA)** deployable directly to **GitHub Pages**.  
> Inspired by the Apple Health / AutoSleep dark dashboard UI, it provides deep chronobiological insights, real-time sleep cycle calculations, procedural ambient sound synthesis, and multi-user profile management.

---

## 📑 Table of Contents
1. [Core Philosophy & Architecture](#1-core-philosophy--architecture)
2. [Scientific Foundations & Mathematical Models](#2-scientific-foundations--mathematical-models)
   - [A. Sleep Stage Architecture](#a-sleep-stage-architecture)
   - [B. 14-Day Rolling Sleep Debt ("Sleep Bank")](#b-14-day-rolling-sleep-debt-sleep-bank)
   - [C. Composite Sleep Rating Algorithm](#c-composite-sleep-rating-algorithm)
   - [D. Daily Physiological Readiness Score](#d-daily-physiological-readiness-score)
   - [E. 90-Minute Ultradian Cycle Model](#e-90-minute-ultradian-cycle-model)
3. [Visual Design System](#3-visual-design-system)
   - [Color Palette & Tokens](#color-palette--tokens)
   - [Concentric Activity Rings](#concentric-activity-rings)
   - [Multi-Stage Hypnogram with Heart Rate Dip](#multi-stage-hypnogram-with-heart-rate-dip)
4. [App Views & Feature Modules](#4-app-views--feature-modules)
   - [1. Today Dashboard](#1-today-dashboard)
   - [2. Sleep Clock & Cycle Companion](#2-sleep-clock--cycle-companion)
   - [3. History, Heatmap & Correlations](#3-history-heatmap--correlations)
   - [4. Day/Edit Sleep Logger & Clinical Simulator](#4-dayedit-sleep-logger--clinical-simulator)
   - [5. Settings & User Goals](#5-settings--user-goals)
5. [Multi-User Profile System & Data Isolation](#5-multi-user-profile-system--data-isolation)
6. [Date Manipulation & Historical Navigation](#6-date-manipulation--historical-navigation)
7. [Procedural Web Audio Synthesizer](#7-procedural-web-audio-synthesizer)
8. [Data Privacy, Persistence & Portability](#8-data-privacy-persistence--portability)
9. [Installation, Local Development & Deployment](#9-installation-local-development--deployment)

---

## 1. Core Philosophy & Architecture

AutoRest is built on four core principles:
1. **100% Privacy & Local-First:** All sleep logs, heart rate points, and profile settings are stored exclusively in the user's browser (`LocalStorage` / `IndexedDB`). No tracking, no cookies, no mandatory accounts, and zero cloud dependencies.
2. **Zero Server Operating Costs:** Built with **React 18 + TypeScript + Vite + Tailwind CSS**, designed to run completely client-side and deploy for free on **GitHub Pages**.
3. **Clinical Chronobiology Grounding:** Implements standard formulas from sleep medicine, including 14-day rolling sleep debt ("Sleep Bank"), sleep efficiency metrics (TST/TIB), nocturnal heart rate dip tracking, and 90-minute ultradian cycle calculations.
4. **PWA & Offline-First:** Fully functional without an internet connection using Service Worker caching (`public/sw.js`) and installable on iOS and Android devices.

---

## 2. Scientific Foundations & Mathematical Models

### A. Sleep Stage Architecture
Human sleep naturally cycles through four primary stages in 90–110 minute ultradian cycles:
- **Awake (Latency & WASO):** Time spent falling asleep and brief nocturnal arousals. Healthy baseline is 5%–10% of time in bed.
- **Light / Core Sleep (N1 + N2):** Non-REM sleep essential for cognitive refreshment and motor learning (~45%–55% of the night).
- **Still Sleep:** Motion-free periods of deep physical calmness.
- **Deep Sleep (N3 Slow-Wave Sleep):** Physical cellular repair, immune consolidation, and Human Growth Hormone (HGH) secretion. Healthy target is $\ge 20\%$ of total sleep time.

### B. 14-Day Rolling Sleep Debt ("Sleep Bank")
Sleep debt represents the cumulative discrepancy between a user's biological sleep target and their actual sleep duration across a 14-day window:

$$\Delta_{day} = \text{Time Asleep} - \text{Sleep Target}$$

$$\text{Net Sleep Debt} = \max\left(0, \sum_{i=1}^{14} \text{Deficit}_i - \sum_{i=1}^{14} (0.5 \times \text{Surplus}_i)\right)$$

$$\text{Sleep Bank Debt \%} = \frac{\text{Net Sleep Debt}}{\text{Total Window Target}} \times 100$$

*A sleep debt below $15\%$ maintains optimal energy levels, while carrying $>25\%$ debt triggers recovery recommendations.*

### C. Composite Sleep Rating Algorithm (0–100 Score)
Calculates a multi-variable composite score from four physiological factors:

$$\text{Score} = (0.35 \times S_{\text{duration}}) + (0.30 \times S_{\text{deep}}) + (0.20 \times S_{\text{efficiency}}) + (0.15 \times S_{\text{hr}})$$

- **Duration Score ($S_{\text{duration}}$, 35%):** $\min\left(100, \frac{\text{Time Asleep}}{\text{Target Duration}} \times 100\right)$
- **Deep Quality Score ($S_{\text{deep}}$, 30%):** $\min\left(100, \frac{\text{Deep Sleep \%}}{20\%} \times 100\right)$ (20% deep sleep yields 100 points).
- **Efficiency Score ($S_{\text{efficiency}}$, 20%):** $\min\left(100, \frac{\text{Time Asleep}}{\text{Time in Bed}} \times \frac{100}{90}\right)$ (Ideal $\ge 90\%$).
- **Resting HR Dip Score ($S_{\text{hr}}$, 15%):** Evaluates nocturnal resting heart rate compared to daytime baseline ($10\%\text{--}15\%$ drop gives maximum score).

### D. Daily Physiological Readiness Score
Generates an actionable 0–100 readiness index:
- **Debt Impact (50%):** Deducts points proportionally from accumulated 14-day sleep debt.
- **Previous Night Quality (30%):** Scores the restorative quality of the most recent sleep session.
- **Sleep Efficiency (20%):** Considers how uninterrupted the session was.

### E. 90-Minute Ultradian Cycle Model
Calculates optimal wake-up times and bedtime recommendations based on full 90-minute sleep cycles (accounting for an average 14-minute sleep latency), allowing users to wake up during light sleep rather than deep sleep inertia.

---

## 3. Visual Design System

### Color Palette & Tokens
- **Background:** Deep OLED Black (`#080A0F` / `#05070A`)
- **Card Containers:** Dark Slate Charcoal (`#141923`) with border `rgba(255, 255, 255, 0.08)`
- **Stage Colors:**
  - `AWAKE`: Neon Emerald Green (`#22C55E`)
  - `LIGHT`: Sky Blue / Cyan (`#38BDF8`)
  - `STILL`: Slate Cyan (`#0EA5E9`)
  - `DEEP`: Violet Purple (`#A855F7`)
  - `HEART RATE`: Crimson Coral (`#F43F5E`)
- **Concentric Ring Colors:**
  - `Outer Duration`: Radiant Gold (`#FACC15`)
  - `Middle Quality`: Lime Green (`#4ADE80`)
  - `Inner Efficiency`: Coral Red (`#FB7185`)

### Concentric Activity Rings
Custom animated SVG rings featuring:
- Seamless SVG `stroke-dashoffset` animation curves
- Custom pin marker icons (Moon, Star, Z badge, Heart)
- Central glowing badges (Crescent Moon `%` on dual ring, Score badge `92` on triple ring)

### Multi-Stage Hypnogram with Heart Rate Dip
- Segmented vertical time slices across the night
- Downward protruding purple bars for slow-wave deep sleep
- Overlaid continuous crimson dashed heart rate curve with live `❤️ 64` bpm badge
- Interactive hover and touch tooltips detailing the time, stage, and bpm for each segment

---

## 4. App Views & Feature Modules

### 1. Today Dashboard
- **Top Header:** Active user profile badge (`⚡ Alex ▼`), date navigation (`◀ / ▶`), direct calendar date picker, interactive tutorial guide button (`💡 Guide`), and quick log pencil button.
- **Sleep Session Card:** Interactive multi-stage hypnogram with time range (`11:28 PM - 6:51 AM`) and asleep/in-bed ratio (`🌙 6:09 / 7:23`).
- **Time Asleep Card:** Dual concentric rings with `TODAY 6h 9m` and `SLEEP BANK 30.3% debt`.
- **Sleep Rating Card:** Triple concentric rings with score `92` and breakdown (`🌙 6h 9m`, `⭐ 4h 20m`, `ⓩ 1h 20m`, `❤️ 64`).
- **Latest Bedtime Card:** Target bedtime calculation for the active profile's sleep goal.
- **Readiness Card:** Recovery level (`Optimal`, `Good`, `Moderate`, `Critical`) with chronobiology advice.
- **Lifestyle & Mood Chips:** Quick tags (☕ Caffeine, 🍷 Alcohol, 📖 Reading, etc.) and wake feeling emoji (😫 🥱 😐 😊 ⚡).

### 2. Sleep Clock & Cycle Companion
- **Real-Time Sleep Cycle Calculator:** "Sleep Now" and "Wake At" calculators showing 3, 4, 5, and 6 cycles (4.5h, 6.0h, 7.5h, 9.0h).
- **Procedural Sleep Sound Generator (Web Audio API):**
  - Synthesizes Pink Noise, Brown Noise, Rain, and Ocean Waves with slow tidal LFO modulation.
  - Zero external MP3 downloads.
  - Volume control and auto fade-out sleep timer (15m, 30m, 45m, 60m, continuous).

### 3. History, Heatmap & Correlations
- **4-Week Sleep Score Calendar Heatmap:** Color-coded matrix by rating.
- **Averages Grid:** Average duration, rating, deep sleep %, and resting HR over 7d, 14d, or 30d.
- **Stacked Stage Trend:** Horizontal architecture bars showing stage proportions across recent days.
- **Lifestyle Factor Correlations:** Statistical analysis of habits (e.g. Reading: `+5.2 pts`, Alcohol: `-12.4 pts`).

### 4. Day/Edit Sleep Logger & Clinical Simulator
- Manual date, bedtime, and wake time inputs.
- Stage adjustment sliders for Deep, Light, Still, and Awake time with live composite score updates.
- Resting heart rate slider and morning wake mood selector.
- Lifestyle factors checklist & dream journal text area.
- **"⚡ Auto-Calculate Realistic Stages"** button for instant procedural clinical hypnogram simulation.
- Confetti celebration when logging a sleep rating $\ge 90$.

### 5. Settings & User Goals
- **Active User Profile Card:** Change or add user profiles.
- **Interactive Tutorial Card:** 5-step onboarding and visual walkthrough.
- **Sleep Goals:** Custom target duration (5h to 11h), baseline daytime RHR, and target bedtime/wake times.
- **Data Portability:** 1-click JSON backup export/import and CSV export.
- **Data Reset:** Clear stored logs for the active profile.

---

## 5. Multi-User Profile System & Data Isolation

AutoRest supports multiple independent user profiles on the same device:
- **Profile Management:** Create custom profiles with names and avatars (`⚡`, `🌙`, `⭐`, `🦊`, `🚀`, `👑`).
- **Data Isolation:** Each profile's sessions and settings are saved under distinct local storage keys (`autorest_sessions_<profileId>` and `autorest_settings_<profileId>`).
- **Independent Goals & Stats:** Switching profiles immediately recomputes the 14-day rolling sleep debt, calendar heatmap, and readiness scores specifically for that user.

---

## 6. Date Manipulation & Historical Navigation

Users have complete flexibility over dates:
- **Date Picker:** Jump to any historical date in the calendar.
- **Step Navigation:** Use `◀ / ▶` to traverse day by day.
- **Empty Date Handling:** When navigating to a date without logs, users can choose **`+ Manual Log`** or **`⚡ Auto-Generate Sample Sleep`**.
- **Data Editing:** Edit or delete any past session at any time.

---

## 7. Procedural Web Audio Synthesizer

The sound player in the **Clock** tab uses the browser's native **Web Audio API**:
- **Brown Noise:** Integrated white noise filtering for a deep, warm rumble.
- **Pink Noise:** Paul Kellet's filter method for a natural $1/f$ spectral density.
- **Rain Shower:** Bandpass and lowpass filtering over noise generators.
- **Ocean Waves:** Lowpass resonance modulated by a 0.08 Hz Low-Frequency Oscillator (LFO) mimicking ocean swell.
- **Zero Asset Overhead:** Runs completely procedurally with zero external audio assets or network requests.

---

## 8. Data Privacy, Persistence & Portability

- **Local-First:** All data remains on the device.
- **JSON Backup:** Exports full JSON files (`autorest_sleep_backup.json`) containing all profiles, settings, and sessions.
- **JSON Restore:** Validates and restores backups with 1 click.
- **CSV Export:** Generates clean CSV tables formatted for Excel, Google Sheets, or data science analysis.

---

## 9. Installation, Local Development & Deployment

### Prerequisites
- Node.js 18+ and npm installed.

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build production distribution
npm run build
```

### GitHub Pages Deployment
1. Push the repository to GitHub:
   ```bash
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. The `.github/workflows/deploy.yml` workflow will automatically build and publish your app at:
   `https://<username>.github.io/<repository-name>/`
