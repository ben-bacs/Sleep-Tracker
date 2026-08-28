# System Prompt & PRD: Production-Grade Sleep Tracker Web App ("AutoRest / SleepPulse")

> **Target Platform:** Client-side Progressive Web App (PWA) deployable for 100% free on **GitHub Pages**  
> **Design Language:** Exact recreation of the iconic Apple Health / AutoSleep dark dashboard UI (Dark OLED background, concentric neon activity rings, multi-stage hypnogram with heart rate overlay, modular cards, and bottom navigation).  
> **Storage & Persistence:** 100% Free & Local-First (IndexedDB + LocalStorage with JSON/CSV Import/Export).

---

## 1. Project Overview & Core Philosophy

You are an expert full-stack engineer and UI/UX designer. Your task is to build a feature-complete, highly responsive, zero-server-cost **Sleep Tracking & Sleep Debt Analytics Web Application** deployable directly to **GitHub Pages**.

The app allows any user worldwide to record, analyze, and optimize their sleep habits completely free of charge, with full privacy (all data stored locally on their device, zero tracking, zero mandatory cloud accounts).

### Key Value Propositions
1. **Zero-Friction Logging & Simulation:** Users can log sleep sessions manually (bedtime, wake time, awakenings, resting HR, lifestyle tags) or generate simulated clinical hypnogram data based on scientifically backed sleep cycle distributions.
2. **Deep Sleep Science Engine:** Computes real sleep metrics: Sleep Latency, Sleep Efficiency (TST/TIB), 14-Day Rolling Sleep Debt ("Sleep Bank"), Deep/REM/Light/Awake stage architecture, Circadian Midpoint variability, and a composite 0–100 Sleep Rating.
3. **Visually Stunning Dark Dashboard:** Faithfully reproduces the aesthetic of modern premium iOS sleep apps (AutoSleep / Apple Watch Activity rings) featuring dark slate cards, SVG/Canvas concentric rings, glowing stage hypnograms with resting heart rate curves, and floating glassmorphic navigation.
4. **PWA & Offline First:** Works offline via Service Worker, installable as a mobile app on iOS/Android, and supports complete backup/restore via JSON export/import.

---

## 2. Scientific Foundations & Algorithmic Specifications

The coding agent must implement standard sleep medicine and chronobiology formulas:

### A. Sleep Stages Architecture & Hypnogram Engine
Human sleep progresses through 90–110 minute ultradian cycles consisting of:
- **Awake (Latency & WASO):** Normal is 5%–10% of time in bed.
- **Light / Core Sleep (N1 + N2):** Normal is 45%–55% of total sleep time.
- **Still / Deep Sleep (N3 Slow-Wave Sleep):** Normal is 15%–25% (restores physical energy and GH secretion).
- **REM Sleep (Rapid Eye Movement):** Normal is 20%–25% (cognitive/emotional consolidation).

**Hypnogram Generation Rule:**
When a user logs a sleep session with bedtime $T_{bed}$ and wake time $T_{wake}$, the app generates continuous time-series stage intervals (Awake, Light, Still/REM, Deep) across 15-minute or 5-minute buckets, maintaining realistic cyclical shifts (deeper sleep in first third of the night, longer REM/Light sleep in the latter half) overlaid with Resting Heart Rate (RHR) dips during deep sleep (the "dip curve").

### B. Sleep Bank & Debt Calculation
- **Baseline Target:** Configurable user sleep need (default: $8.0\text{ hours}$ per night).
- **Daily Surplus/Deficit:** $\Delta_{day} = \text{Time Asleep} - \text{Sleep Target}$
- **14-Day Rolling Sleep Debt:**
  $$\text{Sleep Debt} = \sum_{i=1}^{14} \max(0, \text{Target}_i - \text{Asleep}_i) - \sum_{i=1}^{14} \text{Surplus Credits}_i$$
- **Sleep Bank Metric Display:** Formatted as percentage debt (e.g., `30.3% debt` when carrying significant accumulated deficit over baseline).

### C. Sleep Rating Algorithm (0–100 Score)
A multi-variable composite score calculated as:
$$\text{Score} = (W_{duration} \times S_{duration}) + (W_{deep} \times S_{deep}) + (W_{efficiency} \times S_{efficiency}) + (W_{hr} \times S_{hr})$$
- **Duration Score ($S_{duration}$, Weight 35%):** $\min\left(100, \frac{\text{Time Asleep}}{\text{Target}} \times 100\right)$
- **Quality/Deep Score ($S_{deep}$, Weight 30%):** Score based on Deep Sleep % of total sleep (Target: $\ge 20\%$ yields 100 points).
- **Efficiency Score ($S_{efficiency}$, Weight 20%):** $\frac{\text{Time Asleep}}{\text{Time in Bed}} \times 100$ (Ideal $\ge 90\%$).
- **Resting HR Dip Score ($S_{hr}$, Weight 15%):** Compares average sleeping HR to baseline daytime RHR (a healthy $10\%\text{--}15\%$ nocturnal dip yields maximum score).

### D. Readiness / Recovery Score
Calculates daily physiological readiness based on:
1. Sleep debt balance (50% weight)
2. Sleep quality score from previous night (30% weight)
3. Bedtime consistency index (variance from 7-day median bedtime) (20% weight)

---

## 3. Visual Design System (Based on Reference UI)

### A. Color Palette
- **Background:** Deep OLED Black `#0B0E14` / `#080A0F`
- **Card Background:** Dark Slate Charcoal `#141923` with subtle border `rgba(255, 255, 255, 0.07)` and slight backdrop blur
- **Typography:**
  - Primary Headers: Soft Off-White / Beige `#EBEBE6`
  - Secondary Text / Subheaders: Muted Blue-Grey `#7E8B9B` / `#94A3B8`
  - Accent White: `#FFFFFF`
- **Stage Colors (Hypnogram):**
  - **Awake:** Vibrant Neon Emerald Green `#22C55E` / `#34C759`
  - **Light / Still Sleep:** Sky Blue / Cyan `#38BDF8` / `#0EA5E9`
  - **Deep Sleep:** Rich Purple / Violet `#A855F7` / `#8B5CF6`
  - **Heart Rate Line / Dots:** Crimson Coral `#F43F5E` / `#FF3B30`
- **Concentric Ring Colors:**
  - **Ring 1 (Outer / Time Asleep):** Radiant Gold/Yellow `#FACC15` / `#EAB308`
  - **Ring 2 (Middle / Deep Quality):** Lime Green `#4ADE80` / `#22C55E`
  - **Ring 3 (Inner / Resting HR & Still):** Bright Coral Red `#FB7185` / `#F43F5E`
- **Decorative Watermark:** Very faint dark multi-color mechanical cog / mesh gears in the bottom background (`opacity: 0.08` to `0.15`).

### B. Typography & Layout Metrics
- **Font Stack:** `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Segoe UI", Roboto, sans-serif`
- **Card Border Radius:** `20px` to `24px`
- **Card Padding:** `16px` to `20px`
- **Layout:** Centered mobile container on desktop (`max-w-md` or `max-w-lg`, centered with subtle outer glow or phone mockup frame) and full-width edge-to-edge on mobile screens.

---

## 4. UI Architecture & View Modules

The application consists of 5 core views accessible via the bottom tab navigation bar:

```
+--------------------------------------------------------------------+
|  TODAY                          [ Edit / New Log Button (Pencil) ]  |
|  15 MONDAY -> 16 TUESDAY                                            |
|--------------------------------------------------------------------|
|  [ Card 1: Sleep Session Hypnogram Bar Graph & HR Overlay ]        |
|    - Stages: AWAKE (Green), LIGHT (Cyan), STILL, DEEP (Purple)      |
|    - Red dashed Heart Rate line & 64 bpm badge                      |
|    - Time range: 11:28 PM - 6:51 AM  |  Moon: 6:09 / 7:23          |
|--------------------------------------------------------------------|
|  [ Card 2: Time Asleep ]         |  [ Card 3: Sleep Rating ]       |
|    - Dual Gold/Coral Rings       |    - Triple Concentric Rings    |
|    - Center Moon icon (%)        |    - Center Score Badge (92)    |
|    - TODAY: 6h 9m                |    - Moon 6h 9m (Asleep)        |
|    - SLEEP BANK: 30.3% debt      |    - Star 4h 20m (Quality)      |
|                                  |    - Z 1h 20m (Still)           |
|                                  |    - Heart 64 bpm (Avg HR)      |
|--------------------------------------------------------------------|
|  [ Card 4: Latest Bedtime ]      |  [ Card 5: Readiness Score ]    |
|    - Target vs Actual Bedtime    |    - 88% Optimal Recovery       |
|--------------------------------------------------------------------|
|  [ Bottom Navigation Bar: Today | Clock | History | Day/Edit | Settings ] |
+--------------------------------------------------------------------+
```

### Module Breakdown:

### 1. `Today` (Main Dashboard - Primary Focus)
- **Top Header:** Current Day Header ("TODAY"), date transition ("15 MONDAY → 16 TUESDAY"), and a fast "+ Log" pencil action button.
- **Sleep Session Card:**
  - Interactive SVG/Canvas Hypnogram with segmented vertical bars per time slice.
  - Stage Labels on Y-axis: `AWAKE`, `LIGHT`, `STILL`, `DEEP`.
  - Continuous/Dotted Red Heart Rate overlay with pulse points and live badge (e.g. `❤️ 64`).
  - Baseline horizontal indicator lines.
  - X-axis hours (`11 PM`, `12`, `1`, `2`, `3`, `4`, `5`, `6 AM`).
  - Bottom summary row: Asleep timespan (`11:28 PM - 6:51 AM`) and Asleep/In-Bed ratio (`🌙 6:09 / 7:23`).
- **Time Asleep Card (Dual Ring):**
  - Outer Gold Ring: Progress towards daily sleep goal (e.g. 6h 9m / 8h = 77%).
  - Inner Coral Ring: Sleep efficiency / deficit balance.
  - Central Moon icon with `%`.
  - Metrics below: `TODAY 6h 9m` and `SLEEP BANK 30.3% debt`.
- **Sleep Rating Card (Triple Ring):**
  - Outer Amber Ring: Duration score.
  - Middle Green Ring: Quality/Deep sleep score.
  - Inner Yellow-Green Ring: Restfulness & Heart Rate efficiency.
  - Central badge with glowing score number (e.g. `92`).
  - Stat list with matching iconography: Total asleep (`🌙 6h 9m`), Quality (`⭐ 4h 20m`), Restful Still (`ⓩ 1h 20m`), Resting HR (`❤️ 64`).
- **Secondary Cards:**
  - **Latest Bedtime:** Recommended bedtime based on circadian rhythm and target wake time.
  - **Readiness:** Daily recovery gauge (0–100%) with actionable sleep advice.

### 2. `Clock` (Live Sleep Companion & Cycle Calculator)
- **Real-time 90-Min Sleep Cycle Calculator:** "If you fall asleep now at 10:45 PM, best wake times are: 5:45 AM (4 cycles), 7:15 AM (5 cycles), 8:45 AM (6 cycles)".
- **Smart Bedtime Alarm & Wind-Down Timer.**
- **Built-in Ambient Sound Generator (Web Audio API):** Pink noise, rain, gentle ocean waves, brown noise (synthesized directly in browser with zero external audio files needed).

### 3. `History` (Trends, Calendar Heatmap & Analytics)
- **Calendar Heatmap:** Monthly matrix colored by Sleep Rating (Green/Yellow/Red).
- **Weekly & Monthly Aggregates:** Average sleep duration, average deep sleep %, total accumulated sleep debt trend over time.
- **Sleep Stage Distribution Chart:** Stacked percentage bar chart across the past 7, 14, and 30 days.
- **Correlation Insights:** Visual correlation between tags (e.g., Caffeine after 4 PM, Alcohol, Late Workout, Screen Time) and Sleep Quality.

### 4. `Day/Edit` (Manual Entry, Edit & Log Management)
- **Comprehensive Sleep Logger:**
  - Date & Times (Bedtime, Fall Asleep Time, Wake Time, Out of Bed Time).
  - Sleep Stage Sliders or Percentage breakdown (Deep %, Light %, REM %, Awake min).
  - Resting Heart Rate input (bpm) & Nocturnal Dip.
  - Tags / Lifestyle Factors (☕ Caffeine, 🍷 Alcohol, 🏃 Late Exercise, 📱 Blue Light, 🧘 Meditation, 💊 Melatonin).
  - Subjective Wake Feeling / Mood Rating (1 to 5 stars / emojis: 😫 🥱 😐 😊 ⚡).
  - Free-text Sleep Notes & Dream Journal.
- **Pre-populated Sample Data Button:** "Load Sample AutoSleep Data" (instantly loads 14 days of realistic sleep sessions so new users can explore the full UI immediately).

### 5. `Settings` (Preferences & Data Portability)
- **User Goals:** Target Sleep Duration (e.g., 7.5h, 8h, 9h), Ideal Bedtime, Ideal Wake time.
- **Data Backup & Restore:**
  - Export All Data as `sleep_tracker_backup.json` (Full local backup).
  - Export Data as CSV for Excel / Google Sheets analysis.
  - Import JSON backup with validation and merge/overwrite options.
- **Clear All Data:** Secure reset option with confirmation modal.
- **GitHub Pages Deployment Guide Modal:** Step-by-step instructions showing how users can fork the repo and host their own instance.

---

## 5. Technical Stack & Implementation Guidelines

### Suggested Tech Stack (Zero Build Step or Single-Bundle Vite):
1. **Framework:** React 18 / TypeScript OR Modern Vanilla ES6+ Web Components / Tailwind CSS.
2. **Icons:** Lucide-React / Lucide Icons SVG.
3. **Charts & Rings:** Pure SVG rendering for pixel-perfect concentric rings (with smooth CSS `stroke-dashoffset` transitions) and Canvas/SVG for the hypnogram bar graph.
4. **Data Layer:** `localStorage` / `IndexedDB` (using `idb-keyval` or lightweight custom wrapper) with a comprehensive default state.
5. **Deployment:** Single repository ready for `gh-pages` branch or GitHub Actions build (`npm run build` -> `dist/`).

### Critical Architectural Features:
- **No External Paid API Dependencies:** All calculations, hypnograms, audio generators, and analytics run client-side.
- **Mobile Responsive & Touch-Optimized:** Full swipe gestures between tabs, smooth haptic visual feedback, responsive font scaling, safe-area-inset padding for notched iOS/Android screens.
- **PWA Manifest & Service Worker:** Full offline caching (`manifest.webmanifest` + `sw.js`).

---

## 6. Prompt to Give to the Coding Agent

Copy and execute the prompt below in your AI coding environment (Cursor, Claude Code, Windsurf, Devin, GitHub Copilot):

```markdown
# TASK: Build "AutoRest" - Open Source AutoSleep-Inspired Web App for GitHub Pages

Build a complete, production-ready, highly polished Sleep Tracker web application that strictly matches the visual style and functional depth of the attached AutoSleep iOS screenshot.

### Core Requirements:
1. **Visual Fidelity:**
   - Dark OLED slate background (`#0B0E14`), rounded card containers (`#141923`), subtle background gear/cog watermark silhouettes.
   - Recreate the 4 primary cards:
     a. **Sleep Session Hypnogram:** Segmented vertical bars for AWAKE (green), LIGHT (sky blue), STILL (slate cyan), and DEEP (violet purple), with an overlaid crimson heart rate trendline and '64' bpm marker, sleep duration range `11:28 PM - 6:51 AM`, and `🌙 6:09 / 7:23`.
     b. **Time Asleep Ring:** Dual gold/coral concentric SVG rings with center moon icon, displaying today's sleep duration and rolling 14-day sleep bank debt.
     c. **Sleep Rating Ring:** Triple concentric rings (Amber, Green, Coral) with center score circle (e.g. '92'), breaking down total asleep, quality deep sleep, still restful sleep, and resting heart rate.
     d. **Latest Bedtime & Readiness Cards:** Clean summary indicators.
   - Bottom Tab Navigation: [Today | Clock | History | Day/Edit | Settings] with active glowing state and calendar badge for Today.

2. **Functional Features:**
   - **Local Storage Persistence:** All logged sleep data persists across reloads via LocalStorage / IndexedDB.
   - **Demo Data Preloader:** Provide a prominent "Load Demo Data" button on initial launch so the UI is immediately populated with 14 days of realistic sleep hypnograms and ratings.
   - **Manual & Auto Sleep Logger:** Allow users to log bedtime, wake time, deep/light/REM stages, awakenings, resting HR, lifestyle tags (caffeine, alcohol, workout), and wake mood.
   - **Hypnogram Renderer:** Generate clean, interactive SVG hypnogram graphs based on logged times with hover/touch tooltips showing stage details at specific hours.
   - **Sleep Science Engine:** Compute Sleep Rating (0-100), Sleep Bank Debt %, Sleep Efficiency %, and Readiness Recovery.
   - **Clock & Cycle Tool:** Calculate optimal 90-minute wake-up times and provide a Web Audio browser-synthesized pink/brown noise sleep sound player.
   - **History & Analytics:** Heatmap calendar, 7-day/30-day sleep trends, tag correlation analysis.
   - **Data Portability:** 1-click JSON Export & Import, CSV Export.
   - **GitHub Pages Ready:** Must build cleanly with zero errors to static HTML/CSS/JS or Vite static build (`base: './'`).

Ensure the app is fully responsive, clean, bug-free, and delivers an exquisite native-app feel on both desktop and mobile.
```
