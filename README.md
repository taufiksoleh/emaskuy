<p align="center">
  <img src="public/og-cover.png" alt="EmasKuy: live gold price intelligence for Indonesian investors" width="640" />
</p>

# EmasKuy

[![Deploy to GitHub Pages](https://github.com/taufiksoleh/emaskuy/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/taufiksoleh/emaskuy/actions/workflows/deploy-pages.yml)

**Live gold price intelligence for Indonesian investors.**

EmasKuy (*emas* is Indonesian for gold) is a real-time gold analysis terminal: live spot prices in USD per troy ounce or Indonesian rupiah (Rp) per gram, interactive charts, market analysis articles, an investment calculator and a portfolio tracker. It runs entirely in the browser, with no backend and no API keys, and is available in Indonesian and English.

**Live site: <https://emaskuy.com>**

## Features

### Dashboard (`/`)

- **Ticker strip** with live spot prices for gold (XAU), silver (XAG), platinum (XPT) and palladium (XPD), plus the USD/IDR rate and gold in Rp/gram.
- **Hero price panel.** The navbar switches the display unit between USD/oz and Rp/gram.
- **Interactive price chart** (lightweight-charts): line, area or candlestick over 1H, 24H, 7D, 30D, 90D, 1Y and ALL (daily history back to 2013).
- **AI Insight:** a daily market sentiment (bullish, bearish or neutral) with three or four short bullets.
- **Price alerts:** a toast fires when gold crosses a target above or below, in USD/oz or Rp/gram (up to 10 alerts).
- **Antam vs Spot:** Antam's 1 g base price against the live theoretical spot price (XAU/USD converted to Rp/gram), with the premium. Antam is the Indonesian state-owned miner PT Aneka Tambang, whose gold bars are the most common retail reference price in Indonesia.
- **Market stats:** 52-week high/low, 30-day volatility, a multi-metal table and a quick converter (g, oz or kg to USD and IDR, and IDR back to grams).
- Previews of the latest analysis articles.

### Analysis (`/analisis`, `/analisis/:slug`)

- Bilingual (ID/EN) market analysis articles, currently 10, with a sticky category filter, live search and a featured story.
- Article reader with a reading-progress bar, a table of contents with scroll-spy, callouts that show live prices, share buttons (X, copy link, WhatsApp) and related articles.
- Newsletter sign-up form (see [Known limitations](#known-limitations)).

### Calculator (`/kalkulator`)

- Simulates a **lump-sum** purchase or **monthly DCA** (dollar-cost averaging) in IDR or USD over 1 to 30 years, with an assumed growth of 0 to 20 % per year and a dealer buy spread. The buy price defaults to the live gold price per gram.
- Shows final value, total invested, profit, grams accumulated, effective buy price, a year-by-year table and a projection chart.
- **Scenario Lab** compares 5 % (conservative), 8 % (moderate) and 12 % (aggressive) growth side by side.
- Short educational cards. The math is described in [Calculator model](#calculator-model).

### Portfolio (`/portofolio`)

- Log gold purchases (grams, buy price per gram in Rp, date, optional note) and see total grams, amount invested, current value and profit/loss.
- Holdings are valued at the live theoretical spot price (XAU/USD converted to Rp/gram), so the figures don't reflect dealer buyback prices.
- Data stays in your browser.

### About (`/tentang`)

- Data sources, how prices are calculated, FAQ, disclaimer and contact details.

### Across the app

- **Bilingual UI** (Indonesian and English). It defaults to Indonesian unless the browser language starts with `en`, and remembers your choice.
- **Dark theme by default**, with a light theme toggle.
- **Data status** badges (`LIVE`, `CACHE`, `OFFLINE`) and an offline banner. When the APIs are unreachable the app falls back to the last data saved in localStorage.
- Responsive layout, with a bottom navigation bar on small screens.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | React 19, TypeScript ~5.9 (strict), Vite 7 |
| Routing | react-router 7, declarative `<BrowserRouter basename>` + `<Routes>` |
| Styling | Tailwind CSS 3.4 with CSS-variable design tokens (`src/index.css`); dark by default, light via `data-theme` on `<html>` |
| Charts | lightweight-charts for the price chart; hand-drawn SVG for the calculator charts |
| Motion | framer-motion; GSAP + ScrollTrigger and Lenis (smooth scroll) on the Article and About pages |
| UI | The app's own primitives in `src/components/ui-atoms/`, lucide-react icons, sonner toasts. `src/components/ui/` is a shadcn/ui scaffold of which only Slider and Accordion are used |
| Fonts | Space Grotesk (display), JetBrains Mono (numbers), Inter (body), loaded from Google Fonts |
| Tooling | ESLint 9 (flat config, typescript-eslint, react-hooks, react-refresh) and strict `tsc -b` |
| Hosting | GitHub Pages via GitHub Actions, on the custom domain emaskuy.com |

## Getting started

**Prerequisites:** Node.js 20.19+ or 22.12+ (required by Vite 7) and npm. CI runs on Node 20.

```bash
git clone https://github.com/taufiksoleh/emaskuy.git
cd emaskuy
npm ci          # or: npm install
npm run dev     # http://localhost:3000 (Vite uses the next free port if 3000 is taken)
```

No `.env` file or API key is needed: every data source is a public API called straight from the browser.

| Script | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite dev server on port 3000 with hot reload |
| `npm run build` | Type-checks (`tsc -b`) and builds the production bundle into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint on the repo |

The `@` import alias points to `src/` (for example `import { cn } from '@/lib/utils'`).

## Data sources and how it works

### Sources

| Source | Endpoint | Used for |
| --- | --- | --- |
| gold-api.com | `https://api.gold-api.com/price/{symbol}` for `XAU`, `XAG`, `XPT`, `XPD` | Spot prices in USD per troy ounce |
| Frankfurter | `https://api.frankfurter.dev/v1/latest?base=USD&symbols=IDR` | USD to IDR rate (European Central Bank reference data, published daily) |
| NBP | `https://api.nbp.pl/api/cenyzlota/...` | Daily gold fixing in PLN per gram from the National Bank of Poland, back to 2013-01-02; the basis of the 7D to ALL chart history |

All requests are plain `fetch` calls from the browser (9 s timeout, no retries, no keys). One shared poller, `useGoldPrice` in `src/hooks/useGoldPrice.ts`, refreshes the four metals and the USD/IDR rate every 30 seconds, and components read from it instead of fetching on their own. NBP history is fetched separately, per chart range.

```text
gold-api.com  (4 metals) ─┐  every 30 s
Frankfurter   (USD/IDR)  ─┴─▶ useGoldPrice ─▶ ticker, hero, alerts, Antam vs Spot, calculator, portfolio
NBP           (daily)     ──▶ useDailySeries ─▶ chart history, stats
src/data/*.ts (static)    ──▶ AI Insight, Antam price, articles
```

### Conversion

```text
Rp/gram = USD/oz ÷ 31.1034768 × USD/IDR      # 1 troy ounce = 31.1034768 g
```

### Status and fallback

Every fetch reports `live`, `cached` or `offline` (`src/lib/api.ts`). If a request fails, the last successful response is read back from localStorage and shown as `CACHE`; with no cache the value is zero and shown as `OFFLINE`. There are no mock or placeholder prices.

### What is live and what is static

| Data | Kind | Notes |
| --- | --- | --- |
| Metal spot prices, USD/IDR, Rp/gram | Live | Refreshed every 30 s |
| Price history (7D to ALL) | Live, derived | NBP daily fixings rescaled to the live XAU/USD price (see below) |
| AI Insight (`src/data/aiInsight.ts`) | Static file | Rewritten every day at 09:00 WIB (UTC+7) by a scheduled AI job that lives outside this repo, per the header comment in the file; no model is called at runtime |
| Antam 1 g base price (`src/data/antam.ts`) | Static file | Updated by the same daily job; compared with live spot in the Antam vs Spot panel |
| Articles (`src/data/articles.ts`) | Static | Bilingual, added through commits |

### How some numbers are derived

- **24 h change.** gold-api.com's free tier omits the previous close, so when no change is reported the gold change is derived from the last two NBP fixings. The other metals show the change since this browser first saw a price (a session baseline kept for up to 26 hours).
- **Price history.** NBP publishes PLN per gram. The series is multiplied by a single constant so that its last point equals the live XAU/USD price (`normalizeNbp` in `src/lib/api.ts`). The shape of the curve is faithful, but absolute historical levels are approximate because they embed USD/PLN movements.
- **1H and 24H chart.** Built from the price ticks this browser has collected in localStorage (at least 10 points for 1H, 16 for 24H). On a first visit, or when ticks are sparse, a deterministic pseudo-random path from the last NBP close to the live price is drawn instead (`src/components/home/ChartPanel.tsx`). Candlesticks are bucketed from the line series for every range, so they are not exchange OHLC data.

## Calculator model

Implemented in `src/lib/calc.ts`:

```text
r_m       = (1 + annual growth) ^ (1/12) - 1              monthly growth rate
price(m)  = buy price × (1 + r_m) ^ m                     gold price at month m
grams    += contribution ÷ (price(m) × (1 + spread))      grams bought that month
value(m)  = grams × price(m)                              portfolio value at month m
```

The initial amount is invested at month 0 in both modes; DCA additionally invests the monthly amount every month through the end. Assumptions: growth is constant and deterministic, the spread is charged on purchase only, the final value is marked at spot (no sell-side spread or buyback discount), and inflation and taxes are ignored.

## Browser storage and privacy

There is no backend. Everything the app remembers lives in your browser's localStorage:

| Key | Contents |
| --- | --- |
| `emaskuy.lang` | UI language (`id` or `en`) |
| `emaskuy.unit` | Price display unit (`usd-oz` or `idr-gr`) |
| `emaskuy.theme` | `dark` or `light` |
| `emaskuy.portfolio` | Portfolio holdings |
| `emaskuy.alerts` | Price alerts (up to 10) |
| `emaskuy.newsletter` | The email typed into the newsletter form (never sent anywhere) |
| `emaskuy.ticks.xau` | Gold price ticks from the last 24 h; feeds the 1H/24H chart |
| `emaskuy.sessionbase` | Baseline prices used for the 24 h change of the non-gold metals |
| `emaskuy.cache.*` | Last successful API responses, used as the offline fallback |

The only third-party requests are the three APIs above and Google Fonts. The code contains no analytics or trackers.

## Project structure

```text
.
├── .github/workflows/
│   ├── deploy-pages.yml     # build and deploy to GitHub Pages on push to main
│   └── pr-check.yml         # lint (non-blocking) + typecheck/build on pull requests
├── public/                  # copied as-is into dist/: CNAME, 404.html, logos, OG cover, hero and article images
├── src/
│   ├── main.tsx             # entry point: BrowserRouter with basename = Vite BASE_URL
│   ├── App.tsx              # i18n + theme providers, Layout, route table, toaster
│   ├── index.css            # design tokens (CSS variables), global styles
│   ├── pages/               # Home, Analysis, Article, Calculator, Portfolio, About
│   ├── components/
│   │   ├── home/            # dashboard sections: ticker, hero, chart, AI insight, alerts, Antam, stats
│   │   ├── analysis/        # newsletter form and live-price widgets used by the analysis pages
│   │   ├── calculator/      # inputs, results, projection and scenario charts, Scenario Lab
│   │   ├── about/           # data sources, methodology, FAQ, disclaimer
│   │   ├── ui-atoms/        # the app's own primitives (Panel, StatCard, Badge, Sparkline, ...)
│   │   ├── ui/              # shadcn/ui scaffold (only Slider and Accordion are used)
│   │   └── Layout.tsx, Navbar.tsx, Footer.tsx
│   ├── hooks/               # useGoldPrice (shared poller), useDailySeries, usePriceAlerts, useTheme
│   ├── lib/                 # api (fetch + cache), gold (units, formatters), calc, portfolio, alerts, i18n
│   └── data/                # static content: articles, aiInsight, antam
├── index.html               # entry HTML: fonts, theme bootstrap, SPA redirect restore
├── vite.config.ts           # base '/', dev server on port 3000, '@' alias for src/
└── tailwind.config.js, eslint.config.js, tsconfig*.json, components.json
```

## Deployment

Pushes to `main` deploy automatically to GitHub Pages through `.github/workflows/deploy-pages.yml`. The workflow can also be run manually (`workflow_dispatch`).

```text
push to main ─▶ npm ci ─▶ npm run build ─▶ upload dist/ ─▶ GitHub Pages ─▶ https://emaskuy.com
```

- **One-time setup:** in the repository settings, set Pages → Build and deployment → Source to **GitHub Actions**.
- **Custom domain:** `public/CNAME` contains `emaskuy.com` and is copied into `dist/` on every build.
- **SPA routing:** GitHub Pages has no server-side rewrites, so unknown paths are served `public/404.html`, which redirects `/analisis/some-article` to `/?/analisis/some-article`. An inline script in `index.html` restores the real URL with `history.replaceState` before React mounts ([spa-github-pages](https://github.com/rafgraph/spa-github-pages)). `pathSegmentsToKeep` is `0` in `public/404.html` because the custom domain serves the app from the root.
- **Base path:** `vite.config.ts` sets `base: '/'`. The router `basename` (`src/main.tsx`) and the `withBase()` helper (`src/lib/utils.ts`) both read Vite's `BASE_URL`, so links and `public/` asset paths keep working if the app is ever served from a sub-path. To host it at `https://taufiksoleh.github.io/emaskuy/`, set `base: '/emaskuy/'`, set `pathSegmentsToKeep = 1` in `public/404.html`, and drop `public/CNAME`.

## Development workflow

1. Create a branch and open a pull request against `main`.
2. The **PR Check** workflow (`.github/workflows/pr-check.yml`) runs `npm ci`, `npm run lint` and `npm run build`. Lint results are reported but don't block the PR (there is pre-existing lint debt); the build must pass. It runs a strict `tsc -b` (unused locals and parameters are errors) followed by the Vite bundle.
3. Merging to `main` deploys to production (see [Deployment](#deployment)).

There are no automated tests yet, so type-checking and the production build are the only CI gates.

Conventions:

- Import from `src/` with the `@/` alias.
- UI copy is bilingual. Register strings with `registerStrings({ key: { id: '...', en: '...' } })` and read them with `t('key')` from `useI18n()` (`src/lib/i18n.tsx`).
- Live prices come from the shared `useGoldPrice()` poller; components read from it rather than fetching on their own.
- `src/data/antam.ts` and `src/data/aiInsight.ts` are rewritten daily by a scheduled job. Keep their exported interfaces (`AntamQuote`, `AiInsight`) unchanged unless you also update that job's prompt, otherwise the next rewrite will break (both files say so in their header comments).

## Known limitations

- The newsletter form only saves the email to localStorage; it isn't connected to an email service yet.
- Price alerts are toast-only, and they are only evaluated while the Dashboard is open in a browser tab (the hook is mounted by `AlertsPanel`).
- On a first visit, or with sparse ticks, the 1H and 24H charts are synthesized rather than real intraday data (see [How some numbers are derived](#how-some-numbers-are-derived)).
- Deep links such as `/analisis/some-article` are first answered with HTTP 404 by GitHub Pages and then recovered client-side (the spa-github-pages technique), so crawlers may see a 404.
- There are no automated tests.

## Disclaimer

> EmasKuy content is for informational and educational purposes only — not financial advice. Data may be delayed. Past performance does not guarantee future results.

## Contact

[halo@emaskuy.com](mailto:halo@emaskuy.com)
