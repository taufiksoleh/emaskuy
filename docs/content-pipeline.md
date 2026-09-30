# Content pipeline

EmasKuy is a static site. Its daily content is written by an AI agent that runs outside this repository: Antam prices, the AI market insight and analysis articles. The agent opens one pull request per day against `main`. CI validates the content, auto-merge merges the PR once the checks pass, and the merge deploys the site.

This document is the contract between the agent and the code. The schemas live in [`scripts/content-schema.mjs`](../scripts/content-schema.mjs) and the checks in [`scripts/validate-content.mjs`](../scripts/validate-content.mjs). If you change the contract, change all three and update the agent's prompt.

## Daily run

```sh
git fetch origin
git switch -c content/2026-09-30 origin/main   # today's date in WIB (UTC+7)
npm ci                                         # never `npm install`

# ... update the files below ...

npm run validate:content
npm test
npm run build

git add src/content/antam.json src/content/ai-insight.json   # plus articles.ts and images, if changed
git commit -m "Konten 30 Sep 2026: Antam Rp2.580.000, insight bearish"
git push -u origin content/2026-09-30
gh pr create --base main --title "Konten 30 Sep 2026: …" --body "Sources: …"
gh pr merge --auto --squash --delete-branch
```

- **Branch:** `content/YYYY-MM-DD`, dated in WIB, created from the latest `origin/main`. One PR per day. If that day's PR has already merged and you need a second update, use `content/YYYY-MM-DD-2`.
- **Staging:** stage files by path. Never use `git add -A` or `git add .`.
- **Pushing:** never push to `main` or `master`, and never force-push.
- **Failed CI:** if the PR check fails, read the annotations (`gh pr checks`, `gh run view <run-id> --log-failed`). Push a fix to the same branch. Don't work around a check.

## Files you may change

| File | Content |
| --- | --- |
| `src/content/antam.json` | Antam prices ([below](#antamjson)) |
| `src/content/ai-insight.json` | The daily AI insight ([below](#ai-insightjson)) |
| `src/data/articles.ts` | Analysis articles ([below](#articles)) |
| `public/article-<name>.png` or `.jpg` | Article images |

On a `content/*` branch, a change to any other file fails CI. That includes `package.json`, `package-lock.json`, `.github/`, `README.md`, `index.html`, `public/CNAME`, `public/404.html` and all code.

The old `src/data/antam.ts` and `src/data/aiInsight.ts` are gone. Don't recreate them.

## antam.json

| Field | Meaning |
| --- | --- |
| `schemaVersion` | Always `1` |
| `priceDate` | Date the prices apply to, `YYYY-MM-DD` in WIB. Not in the future. |
| `updatedAt` | When you wrote the file, ISO 8601 in WIB, e.g. `2026-09-30T09:05:00+07:00` |
| `source` | `{ name, url }` of the page you actually read the prices from. If it was a news article quoting Logam Mulia, name the outlet. |
| `note` | `{ id, en }`, 10–300 characters each, shown under the Antam panel. Use it for context such as "1 g price down Rp17,000". |
| `antam.buybackPerGram` | Antam's buyback price **per gram**, in rupiah |
| `antam.sizes` | `[{ grams, sell }]`. `sell` is the price of **one whole bar** in rupiah, not the price per gram. Must include the 1 g bar. `grams` is one of 0.5, 1, 2, 3, 5, 10, 25, 50, 100, 250, 500, 1000. |
| `others` | Optional `{ galeri24?, ubs? }`, each `{ sellPerGram, buybackPerGram }` for that brand's 1 g bar. Shown in a brand comparison, and used to value UBS and Galeri24 bars in the portfolio. |
| `history` | `[{ date, sell1g, buyback }]`: one entry per price day, oldest first, at most 400. `buyback` is `null` when unknown. |

All amounts are whole rupiah written as JSON numbers: `2580000`, not `"2.580.000"`.

**Updating the file:**

```js
file.priceDate = today;                  // WIB date of the prices
file.updatedAt = nowInWib;               // "2026-09-30T09:05:00+07:00"
file.source = { name, url };
file.note = { id, en };
file.antam = { buybackPerGram, sizes };  // only the sizes today's source lists
if (brandQuotes) file.others = brandQuotes; else delete file.others;
file.history = file.history
  .filter((h) => h.date !== today)
  .concat({ date: today, sell1g: sizes.find((s) => s.grams === 1).sell, buyback: buybackPerGram })
  .sort((a, b) => a.date.localeCompare(b.date))
  .slice(-400);
```

Rules:

- **Only today's prices from a source you opened.** If you can't find today's Antam price, leave `antam.json` unchanged; the site shows how old the prices are. Never copy yesterday's prices under a new date.
- **Never compute a size.** List only the sizes your source lists; don't derive, say, 5 g from the 1 g price. The same applies to `others`: include a brand only with today's quote for it, and otherwise remove it instead of keeping an old one.
- **Bar sizes are priced per bar and buyback per gram.** A 5 g bar costs about five times the 1 g price.

Example (illustrative numbers):

```json
{
  "schemaVersion": 1,
  "priceDate": "2026-09-30",
  "updatedAt": "2026-09-30T09:05:00+07:00",
  "source": { "name": "Logam Mulia", "url": "https://www.logammulia.com/id/harga-emas-hari-ini" },
  "note": {
    "id": "Harga Antam 1 gram naik Rp8.000 dari kemarin.",
    "en": "The Antam 1 g price rose Rp8,000 from yesterday."
  },
  "antam": {
    "buybackPerGram": 2383000,
    "sizes": [
      { "grams": 0.5, "sell": 1344000 },
      { "grams": 1, "sell": 2588000 },
      { "grams": 5, "sell": 12715000 },
      { "grams": 10, "sell": 25375000 }
    ]
  },
  "others": {
    "galeri24": { "sellPerGram": 2535000, "buybackPerGram": 2387000 }
  },
  "history": [
    { "date": "2026-09-29", "sell1g": 2580000, "buyback": 2375000 },
    { "date": "2026-09-30", "sell1g": 2588000, "buyback": 2383000 }
  ]
}
```

## ai-insight.json

| Field | Meaning |
| --- | --- |
| `schemaVersion` | Always `1` |
| `generatedAt` | When you wrote it, ISO 8601 in WIB (`+07:00`). Not in the future. |
| `sentiment` | `bullish`, `bearish` or `neutral` |
| `bullets` | 3 or 4 items of `{ id, en }`, 20–450 characters each. Both languages say the same thing. |
| `sources` | Optional, up to 10 `{ title, url }`: the pages the bullets are based on. They are shown under the insight. |

Every number in a bullet must come from a source you read. Describe what the market did and what traders are watching; don't give investment advice.

## Articles

Add a new article at the top of `ARTICLES` in `src/data/articles.ts`, following the `Article` interface and the existing entries:

- **`slug`:** unique, lowercase words joined with hyphens.
- **Bilingual fields:** `title`, `excerpt`, every heading and paragraph in `sections`, and `pullQuote` all need `{ id, en }`.
- **`category`:** one of `market`, `macro`, `strategy`, `compare` or `metals`.
- **`callout`:** one of `rally`, `rates`, `dca`, `reserves`, `compare` or `ratio`. It picks the live-price widget shown mid-article.
- **`image`:** `withBase('/article-<name>.jpg')`, always wrapped in `withBase`. The file must be a PNG or JPG directly in `public/`, 16:9, at least 1280 px wide and at most 400 KB (JPG suits photos). The build makes the WebP and link-preview copies itself.
- **`publishedAt`:** `Date.parse('2026-09-30T02:00:00Z')`, not in the future.
- **`readMinutes`** and **`author`:** `author: TEAM`.
- **`sources`:** the pages the article's facts come from, as `[{ title, url }]` with full `https://` addresses. They are listed under the article and in its structured data. Every number in the text must come from one of them.
- **`featured`:** optional, and at most one article may set `featured: true`. That article headlines `/analisis`; without it, the newest article does.

Every article gets its own prerendered page in both languages (`/analisis/<slug>` and `/en/analysis/<slug>`) and an entry in the sitemap and both RSS feeds. Don't edit older articles, except to fix a factual error; to move the headline, move the `featured` flag.

## What CI checks

`npm run validate:content` runs on every PR and before every deploy. Its errors fail the check; its warnings show on the PR but don't block it. It compares the change with the PR's base branch, or locally with `origin/main`, so run `git fetch origin` first.

| Errors | Warnings |
| --- | --- |
| Schema violations: missing or extra fields, wrong types, timestamps not in `+07:00` | The 1 g price moved more than 5% since the base branch |
| `priceDate`, `generatedAt` or `publishedAt` in the future | Antam prices more than 3 days old |
| No 1 g bar, or a size listed twice | AI insight more than 3 days old |
| Buyback not below the selling price, or an Antam spread outside 2–20% | |
| A size priced outside 0.9–1.25× the 1 g price per gram (usually a per-gram price typed as the bar price) | |
| A 1 g price below half or above double the base branch's | |
| A brand in `others` priced outside 0.8–1.25× the Antam 1 g price, or with buyback not below sell | |
| `history` not sorted, a date listed twice, or its last entry not matching `priceDate`, the 1 g price and the buyback | |
| Article image not wrapped in `withBase`, missing, not PNG/JPG, or over 400 KB; a duplicate slug | |
| More than one `featured: true`, or a source `url` that isn't a full `https://` address | |
| On a `content/*` branch: a file outside the list above | |
| On any branch: `package-lock.json` changed without `package.json` | |

`node scripts/validate-content.mjs --print-schema` prints both schemas as JSON Schema.

## One-time setup (repository owner)

1. **Token for the agent.** Create a fine-grained personal access token, or a GitHub App, limited to this repository with *Contents: read and write* and *Pull requests: read and write*. Don't grant *Workflows*: GitHub then refuses any push that changes `.github/workflows`, which is a second guard. Don't use an Actions `GITHUB_TOKEN`: pull requests it opens don't trigger CI, so they would never be checked or merged.
2. **Auto-merge.** Settings → General → Pull Requests → *Allow auto-merge*.
3. **Protect `main`.** Add a branch rule or ruleset that requires a pull request, with 0 approvals if merges should be fully automatic. Require the `check` status check (the PR Check workflow). Leaving *Require branches to be up to date* off means daily PRs don't need rebasing.
4. **Point the agent here.** Replace its old instructions, which wrote `src/data/*.ts` and pushed to `master`, with a link to this document. Once it has switched, delete the `master` branch.
