---
name: gold-daily-content
description: Daily EmasKuy content run. Researches today's gold news and prices, updates the Antam prices (src/content/antam.json) and the AI insight (src/content/ai-insight.json), writes a new bilingual analysis article in src/data/articles.ts, renders a text-free cover image in the site's dark-gold style, then validates, builds and pushes. Use when asked to update Antam prices, refresh the AI insight, write today's gold article, or "do the daily gold content".
---

# EmasKuy daily gold content

Repeats the daily run: research, Antam prices, AI insight, one article, one cover image, validate, push.
The contract for every file is `docs/content-pipeline.md`. Read it first each run; if it disagrees with this skill, the doc wins.

## 0. Plan and set up

1. Create a task list: research, Antam + insight, article, cover image, validate + push.
2. Get today's date and time in WIB: `TZ=Asia/Jakarta date -Iseconds`. Every date and timestamp below uses it.
3. Branch:
   - If the session names a development branch, work on that branch.
   - Otherwise follow the doc: `git fetch origin && git switch -c content/YYYY-MM-DD origin/main`.
4. `npm ci` (never `npm install`). It is needed for sharp, tests and the build.
5. Read the current state: `src/content/antam.json`, `src/content/ai-insight.json`, and the first article in `src/data/articles.ts`. Note yesterday's Antam 1 g price and buyback, and which article has `featured: true`.

## 1. Research (verify every number on a page you opened)

Search in Indonesian and English, then **open the pages**. Search-result summaries can be wrong; never use a number you only saw in a summary.

| Need | Where to look | Notes |
| --- | --- | --- |
| Antam 1 g, buyback, all bar sizes | `harga emas antam hari ini <tanggal>`: Bloomberg Technoz, Suara.com, LiputanOke, Kompas, Sumeks | logammulia.com usually returns 403. Several outlets copy **yesterday's** price in the morning. Prefer an article that states the update time (e.g. "pukul 08:48 WIB") and the change vs yesterday, and cross-check two outlets. |
| Galeri24 and UBS 1 g sell + buyback | `https://galeri24.co.id/harga-emas/` | Works with WebFetch and lists both brands for today. |
| Spot gold level and move | Kitco news, Trading Economics `/commodity/gold`, Bloomberg Technoz (spot at a WIB time) | |
| US data (PCE, CPI, GDP, ADP, NFP, ISM, claims) | Kitco, IndexBox, Investing.com, Reuters via Investing.com | CNBC, USAGold, Babypips, qz.com often return 403. Use an alternative outlet. |
| Fed odds, yields, dollar, oil | Trading Economics, Investing.com analysis, Yahoo Finance | |
| Technical levels, structural demand (central banks, ETFs) | Investing.com analysis, Gold Stock Canada post-market summary | |

Write down each fact with its source URL. Keep only facts from the last 1–2 days unless they are context (record high, quarterly central-bank buying).

## 2. Update `src/content/antam.json`

Rules from the doc, which CI enforces:
- Only today's prices from a source you opened. If you can't confirm today's price, leave the file unchanged.
- Never compute a size. List only sizes the source lists. `sell` is the price of one whole bar; buyback is per gram.
- `others`: include a brand only with today's sell **and** buyback; otherwise delete it.
- `source` is the page you actually read the table from, e.g. `{ "name": "Logam Mulia (dikutip Suara.com)", "url": "…" }`.
- `note.id` / `note.en`: 10–300 chars, the 1 g change in rupiah, the buyback, the spread.

Update it with a script rather than by hand:

```sh
node -e "
const fs=require('fs');const p='src/content/antam.json';const f=JSON.parse(fs.readFileSync(p));
const today='YYYY-MM-DD';
const sizes=[[0.5,0],[1,0] /* … exactly as the source lists … */].map(([grams,sell])=>({grams,sell}));
f.priceDate=today; f.updatedAt='YYYY-MM-DDTHH:MM:00+07:00';
f.source={name:'…',url:'https://…'};
f.note={id:'…',en:'…'};
f.antam={buybackPerGram:0,sizes};
f.others={galeri24:{sellPerGram:0,buybackPerGram:0},ubs:{sellPerGram:0,buybackPerGram:0}}; // or delete f.others
f.history=f.history.filter(h=>h.date!==today).concat({date:today,sell1g:sizes.find(s=>s.grams===1).sell,buyback:f.antam.buybackPerGram}).sort((a,b)=>a.date.localeCompare(b.date)).slice(-400);
fs.writeFileSync(p,JSON.stringify(f,null,2)+'\n');"
```

## 3. Update `src/content/ai-insight.json`

- `generatedAt`: now in WIB with `+07:00`, not in the future.
- `sentiment`: `bullish`, `bearish` or `neutral`, judged from the facts. Mixed data means `neutral`.
- `bullets`: 3–4 items, each `{ id, en }` of 20–450 chars, both languages saying the same thing. A good set:
  1. What the market did and why (the data, the move in gold).
  2. Rates, yields, dollar and oil, and the bigger picture (distance from the record, monthly move).
  3. Key support and resistance levels and the next data releases.
  4. Antam, buyback, spread, other brands, plus a structural note (central banks, ETFs).
- `sources`: up to 10 `{ title, url }` with full `https://` URLs. Every number in a bullet must come from one of them. They render as source chips; follow [Sources and chips](#sources-and-chips).
- Describe what happened and what traders watch. No investment advice.
- Don't claim a direction you can't source (e.g. "Galeri24 naik") when the previous file shows the same price.

## 4. Write the article in `src/data/articles.ts`

Insert a new object at the top of `ARTICLES` and follow the `Article` interface and the latest entry's shape.

- `slug`: unique, lowercase, hyphenated, in English (e.g. `gold-mixed-data-4100-test`).
- `category`: `market`, `macro`, `strategy`, `compare` or `metals`.
- `featured: true` on the new article; **remove** it from the previous featured article (at most one is allowed).
- `title`, `excerpt`, every `heading` and paragraph, and `pullQuote`: `{ id, en }`. Indonesian is primary; English says the same.
- Body: about 5 sections with 2 paragraphs each. A proven outline:
  1. What happened (the data and the price reaction, with numbers).
  2. Why it matters, or why the move is not enough (rates, yields, dollar, oil).
  3. Big picture and levels (record high, drawdown, support and resistance, upcoming data).
  4. Antam and other brands (price, buyback, spread in rupiah and %, brand comparison).
  5. Playbook (structural demand, DCA framing, then the disclaimer: "Artikel ini analisis edukatif, bukan nasihat keuangan personal…").
- Tone: like the existing articles. Concrete numbers, short paragraphs, plain explanations for IDR investors, scenario-based rather than predictive.
- Number formats: Indonesian `$4.152`, `2,2%`, `Rp2.581.000`; English `$4,152`, `2.2%`, `Rp2,581,000`. Use `’` for apostrophes inside single-quoted strings.
- Calculated figures (spread %, price gaps) must be arithmetic on sourced numbers. Check them.
- `callout`: `rally`, `rates`, `dca`, `reserves`, `compare` or `ratio` (the live widget mid-article). Use `rates` for Fed/yields, `compare` for brand or asset comparisons, `dca` for strategy.
- `image: withBase('/article-<name>.png')`. Always wrap it in `withBase`.
- `publishedAt: Date.parse('YYYY-MM-DDTHH:MM:00Z')`, in UTC and not in the future.
- `readMinutes`, `author: TEAM`, and `sources`: every page the article's numbers come from. They render as source chips at the end of the article; follow [Sources and chips](#sources-and-chips).

Insert with a small Python or Node script that also strips the old `featured: true`, then check with `grep -n "featured: true\|slug:" src/data/articles.ts | head`.

## Sources and chips

The site shows each source as a chip with the site's favicon and short name, such as Kitco or Bloomberg Technoz. Clicking a chip opens the source in a new tab. The full `title` appears only as the tooltip and the screen-reader label. The AI insight and the articles share one component, `src/components/ui-atoms/SourceChips.tsx`. The name and icon come from the URL through `src/lib/sourceSite.ts`.

The content files keep the same `{ title, url }` format, so nothing extra is written. To make the chips read well:

- **`url` is the exact page you read**, such as the article, not the outlet's home page. The chip name and icon come from its host.
- **`title` reads `Outlet: headline`**, for example `Kitco: Gold price rockets to session highs …`. The chip drops the duplicate outlet from the label, so this stays short for screen readers.
- **Prefer one source per outlet.** Two chips with the same name look like a mistake. Keep a second page from the same outlet only when it carries different facts.
- **Order sources by importance:** the main market story first, Antam and brand prices last. Five to eight chips read best. The schema allows up to 10 for the insight.
- **Unknown outlets show their bare domain,** such as `example.co.id`, with the site's favicon or a globe. That is fine. Better names live in the `SITE_NAMES` map in `src/lib/sourceSite.ts`, but that is code. **Never edit it on a `content/*` branch,** because CI fails on code changes there. Mention the outlet in your report so it can be added in a separate PR.

To see which outlets already have names, read `SITE_NAMES` in `src/lib/sourceSite.ts`. Subdomains, such as `money.kompas.com`, use their parent's name.

## 5. Render the cover image (no text)

EmasKuy is bilingual, so covers carry **no words or numbers**: only the chart, dashed level lines, arrows, mini bar cards, a "?" mark and a gold-bar icon. The style is a dark radial background, a faint grid, a glowing gold line, and red for the decline.

1. Write a spec to the scratchpad that tells the day's story:

```json
{
  "points": [4170,4166,4172,4164,4168,4160,4166,4162,4170,4176,4195,4213,4204,4198,4190,4186,4178,4180,4170,4166,4160,4163,4156,4152],
  "pivot": 11,
  "before": "gold",
  "after": "red",
  "levels": [{ "value": 4213, "tone": "grey" }, { "value": 4100, "tone": "gold" }],
  "projection": "down",
  "question": true,
  "cards": [
    { "dir": "down", "tone": "green", "bars": [70, 58, 64, 40] },
    { "dir": "up", "tone": "red", "bars": [38, 46, 52, 76] },
    { "dir": "up", "tone": "red", "bars": [44, 30, 36, 72] }
  ],
  "icon": "bar"
}
```

   The points are an illustrative path through real levels (open, spike, current), not tick data. Cards stand for the day's data releases: green with a down arrow for gold-friendly (cooler) data, red with an up arrow for hawkish (hotter) data.

2. Render from the repo root so sharp resolves:

```sh
node .claude/skills/gold-daily-content/render-cover.mjs <scratchpad>/cover.json public/article-<name>.png
```

3. Open the PNG with the Read tool and look at it. Check nothing overlaps and nothing is cut off. Re-render if needed.
4. Limits: PNG or JPG directly in `public/`, 16:9, at least 1280 px wide, at most 400 KB. The script outputs 1280×720, usually 30–40 KB.

## 6. Validate, build, commit, push

```sh
git fetch origin main -q
npm run validate:content     # must print OK; read any warnings
npm test
npm run build
find dist -path "*<slug>*"   # expect dist/analisis/<slug>.html and dist/en/analysis/<slug>.html
```

Optional check of the chips: run `npx vite`, open the article and the home page, and confirm each source shows a sensible name and opens the right URL. Headless Chromium in a sandbox may fail to load favicons because of the proxy certificate. Launch it with `--ignore-certificate-errors`, or accept the globe fallback there.

- Stage by path only: `git add src/content/antam.json src/content/ai-insight.json src/data/articles.ts public/article-<name>.png`. Never `git add -A`.
- On a `content/*` branch, changing any other file fails CI, so this skill folder must never be edited on a content branch.
- Commit message style: `Konten D Mon YYYY: artikel "<short title>" + insight + Antam Rp<1g price>` with a short bullet body.
- Push with `git push -u origin <branch>`. Never push to `main` and never force-push.
- Open a PR only if the user asked, or when following the doc's automated flow on a `content/*` branch.

## 7. Report back

Tell the user, briefly:
- The Antam 1 g price, buyback and change, plus Galeri24 and UBS, in a small table.
- Where the prices came from, and any source conflicts (e.g. outlets still showing yesterday's price).
- The insight sentiment and its main points.
- The outlets cited. Flag any that show as a bare domain, so a name can be added to `SITE_NAMES` in a separate PR.
- The article title and slug, and that it is now featured.
- The cover image (send it with SendUserFile), and that validation, tests and build passed.
