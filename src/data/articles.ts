/**
 * EmasKuy — shared article dataset.
 *
 * Consumed by the home preview (3 newest) and the analysis page (full index
 * + in-app reader). Each article carries a structured bilingual body
 * (`sections` of H2 + paragraphs), a pull-quote, and a `callout` key that
 * tells the reader which live-data callout panel to render.
 */
import { registerStrings } from '@/lib/i18n';
import { withBase } from '@/lib/utils';

registerStrings({
  'article.cat.market': { id: 'Harga & Tren', en: 'Price & Trends' },
  'article.cat.macro': { id: 'Bank Sentral', en: 'Central Banks' },
  'article.cat.strategy': { id: 'Strategi', en: 'Strategy' },
  'article.cat.compare': { id: 'Perbandingan', en: 'Comparisons' },
  'article.cat.metals': { id: 'Logam', en: 'Metals' },
});

export type ArticleCategory = 'market' | 'macro' | 'strategy' | 'compare' | 'metals';

/** In filter order. */
export const ARTICLE_CATEGORIES: ArticleCategory[] = ['market', 'macro', 'strategy', 'compare', 'metals'];

/** Which live-data callout panel the reader renders mid-article. */
export type ArticleCallout = 'rally' | 'rates' | 'dca' | 'reserves' | 'compare' | 'ratio';

export interface ArticleSection {
  /** H2 heading (used for the reader TOC scroll-spy). */
  heading: { id: string; en: string };
  paragraphs: { id: string; en: string }[];
}

export interface Article {
  slug: string;
  category: ArticleCategory;
  /** Headlines /analisis; at most one article sets it (else the newest leads) */
  featured?: boolean;
  title: { id: string; en: string };
  excerpt: { id: string; en: string };
  /** Structured body for the in-app reader (bilingual). */
  sections: ArticleSection[];
  /** Inline pull-quote rendered mid-article. */
  pullQuote: { id: string; en: string };
  callout: ArticleCallout;
  image: string;
  publishedAt: number; // unix ms
  readMinutes: number;
  author: { id: string; en: string };
  /** Pages the article's facts come from */
  sources?: { title: string; url: string }[];
}

const TEAM = { id: 'Tim EmasKuy', en: 'EmasKuy Team' };

export const ARTICLES: Article[] = [
  {
    slug: 'gold-reclaims-4000-before-fed-antam-up-10000',
    category: 'market',
    featured: true,
    title: {
      id: 'Emas Rebut Lagi $4.000 Jelang Fed, Antam Naik Rp10.000 ke Rp2.550.000',
      en: 'Gold Reclaims $4,000 Ahead of the Fed, Antam Up Rp10,000 to Rp2,550,000',
    },
    excerpt: {
      id: 'Emas kembali di atas $4.000 setelah menyentuh $3.975 Jumat lalu, dibantu minyak yang turun. Pasar memperkirakan Fed menahan suku bunga Rabu, tetapi peluang kenaikan Desember sekitar 82%. Harga Antam 1 gram naik Rp10.000 ke Rp2.550.000, kenaikan pertama setelah sepekan melemah.',
      en: 'Gold is back above $4,000 after touching $3,975 last Friday, helped by lower oil. Markets expect the Fed to hold on Wednesday, but put the odds of a December hike at about 82%. Antam’s 1-gram price rose Rp10,000 to Rp2,550,000, its first rise after a week of declines.',
    },
    sections: [
      {
        heading: { id: 'Pemulihan Kecil di Atas $4.000', en: 'A Small Recovery Above $4,000' },
        paragraphs: [
          {
            id: 'Jumat lalu emas turun ke $3.975, level terendah sejak 20 Juli. Senin, Kitco mencatat spot naik 0,50% ke sekitar $4.014,49, dan emas ditutup kembali di atas $4.000 di sesi AS. Pemicunya bukan data baru, melainkan minyak yang mereda karena diplomasi di Selat Hormuz.',
            en: 'Last Friday gold fell to $3,975, its lowest since July 20. On Monday, Kitco had spot up 0.50% to about $4,014.49, and gold closed back above $4,000 in the US session. The trigger was not new data but cooler oil prices on diplomacy around the Strait of Hormuz.',
          },
          {
            id: 'Selasa pagi, Trading Economics menunjukkan emas sekitar $4.010, turun tipis 0,16%. Jadi pemulihan ini masih kecil: dalam sebulan emas tetap turun 2,54%. Pasar menunggu Fed sebelum mengambil posisi besar.',
            en: 'On Tuesday morning, Trading Economics shows gold at about $4,010, down a slight 0.16%. So the recovery is still small: gold remains down 2.54% on the month. The market is waiting for the Fed before taking big positions.',
          },
        ],
      },
      {
        heading: { id: 'Minyak Turun, tetapi Ancaman Kenaikan Bunga Tetap', en: 'Oil Eases, but the Rate-Hike Threat Remains' },
        paragraphs: [
          {
            id: 'Brent ditutup turun 0,8% di $115,81 dan WTI sekitar $102. Minyak yang lebih murah mengurangi kekhawatiran inflasi, dan yield Treasury 10 tahun bertahan di bawah 4,98%, turun dari puncak 5,31%. Bagi emas yang tidak memberi bunga, yield yang turun sedikit mengurangi tekanan.',
            en: 'Brent settled down 0.8% at $115.81 and WTI was near $102. Cheaper oil eases inflation worries, and the 10-year Treasury yield is holding below 4.98%, down from a 5.31% peak. For gold, which pays no interest, slightly lower yields ease the pressure.',
          },
          {
            id: 'Namun arah kebijakan belum berubah. Pasar memperkirakan Fed menahan suku bunga di 3,75–4,00% pekan ini (peluang sekitar 90%), tetapi CME FedWatch menempatkan peluang kenaikan Desember sekitar 82%. Nowcast Cleveland Fed menunjukkan PCE inti 3,1% dan PCE umum 3,6% secara tahunan, masih jauh di atas target 2%.',
            en: 'But the policy path has not changed. Markets expect the Fed to hold at 3.75–4.00% this week (about 90% odds), but CME FedWatch puts the odds of a December hike at about 82%. The Cleveland Fed nowcast shows core PCE at 3.1% and headline PCE at 3.6% year on year, still far above the 2% target.',
          },
        ],
      },
      {
        heading: { id: 'Gambaran Besar dan Level yang Dipantau', en: 'The Big Picture and Levels to Watch' },
        paragraphs: [
          {
            id: 'Di sekitar $4.010, emas masih sekitar 28,5% di bawah rekor $5.608,35 pada Januari 2026. Resistance terdekat di $4.032, lalu $4.075; tembus ke atas membuka target $4.160–4.180. Support di $3.963 dan $3.946, dengan target turun $3.890 lalu $3.800.',
            en: 'At about $4,010, gold is still about 28.5% below its $5,608.35 record from January 2026. The nearest resistance is $4,032, then $4,075; a break higher opens targets of $4,160–4,180. Support is at $3,963 and $3,946, with downside targets of $3,890, then $3,800.',
          },
          {
            id: 'Agendanya padat: durable goods September malam ini pukul 19.30 WIB dan keyakinan konsumen Oktober pukul 21.00 WIB. Keputusan Fed keluar Kamis pukul 01.00 WIB, disusul konferensi pers Ketua Fed Kevin Warsh. Kamis pukul 19.30 WIB ada PDB kuartal III dan PCE September. Nada Warsh soal Desember kemungkinan lebih penting daripada keputusan menahan itu sendiri.',
            en: 'The agenda is busy: September durable goods tonight at 19:30 WIB and October consumer confidence at 21:00 WIB. The Fed decision is out at 01:00 WIB Thursday, followed by Fed Chair Kevin Warsh’s press conference. Q3 GDP and September PCE follow on Thursday at 19:30 WIB. Warsh’s tone on December likely matters more than the hold itself.',
          },
        ],
      },
      {
        heading: { id: 'Antam Naik, Galeri24 dan UBS Tetap', en: 'Antam Up, Galeri24 and UBS Steady' },
        paragraphs: [
          {
            id: 'Harga Antam 1 gram naik Rp10.000 ke Rp2.550.000, kenaikan pertama setelah sepekan melemah dari Rp2.574.000 pada 19 Oktober. Buyback juga naik Rp10.000 ke Rp2.345.000 per gram, sehingga spread tetap Rp205.000, sekitar 8,0%. Batangan 10 gram kini Rp25.050.000.',
            en: 'Antam’s 1-gram price rose Rp10,000 to Rp2,550,000, its first rise after a week of declines from Rp2,574,000 on October 19. Buyback also rose Rp10,000 to Rp2,345,000 per gram, so the spread stays at Rp205,000, about 8.0%. The 10-gram bar is now Rp25,050,000.',
          },
          {
            id: 'Galeri24 tidak berubah di Rp2.467.000 (buyback Rp2.326.000, spread sekitar 5,7%), dan UBS tetap Rp2.491.000 (buyback Rp2.301.000, spread sekitar 7,6%). Karena hanya Antam yang naik, selisihnya dengan Galeri24 melebar ke Rp83.000 per gram, dan dengan UBS ke Rp59.000.',
            en: 'Galeri24 is unchanged at Rp2,467,000 (buyback Rp2,326,000, spread about 5.7%), and UBS stays at Rp2,491,000 (buyback Rp2,301,000, spread about 7.6%). Since only Antam rose, its gap over Galeri24 widens to Rp83,000 per gram, and over UBS to Rp59,000.',
          },
        ],
      },
      {
        heading: { id: 'Playbook Pekan Fed', en: 'Fed-Week Playbook' },
        paragraphs: [
          {
            id: 'Dua skenario utama: jika Warsh terdengar sabar dan PCE Kamis lebih dingin dari nowcast, emas punya ruang menguji $4.075 lalu $4.160. Jika Fed memberi sinyal kenaikan Desember dan PCE panas, support $3.946 dan $3.890 kembali jadi fokus. Dengan spread Antam sekitar 8%, pergerakan harian beberapa puluh dolar jarang cukup untuk menutup biaya jual-beli jangka pendek.',
            en: 'Two main scenarios: if Warsh sounds patient and Thursday’s PCE is cooler than the nowcast, gold has room to test $4,075, then $4,160. If the Fed signals a December hike and PCE runs hot, support at $3,946 and $3,890 is back in focus. With Antam’s spread at about 8%, daily moves of a few tens of dollars rarely cover the cost of a short-term round trip.',
          },
          {
            id: 'Bagi penabung rutin, pekan yang bergejolak seperti ini adalah alasan untuk menyebar pembelian (DCA) alih-alih menebak satu hari terbaik, dan membandingkan spread antarmerek sebelum membeli. Artikel ini analisis edukatif, bukan nasihat keuangan personal; sesuaikan keputusan dengan tujuan dan profil risiko Anda.',
            en: 'For regular savers, a volatile week like this is a reason to spread purchases out (DCA) instead of guessing the single best day, and to compare spreads across brands before buying. This article is educational analysis, not personal financial advice; match your decisions to your own goals and risk profile.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Fed hampir pasti menahan suku bunga; yang menggerakkan emas adalah nada Warsh soal Desember.',
      en: 'The Fed is all but certain to hold; what moves gold is Warsh’s tone on December.',
    },
    callout: 'rates',
    image: withBase('/article-gold-reclaims-4000-before-fed.png'),
    publishedAt: Date.parse('2026-10-27T02:50:00Z'),
    readMinutes: 5,
    author: TEAM,
    sources: [
      { title: 'Kitco: Gold holds above $4,000 as Hormuz diplomacy cools crude ahead of Fed decision', url: 'https://www.kitco.com/news/article/2026-10-26/gold-holds-above-4000-hormuz-diplomacy-cools-crude-ahead-fed-decision-kitco' },
      { title: 'Kitco: Gold rebounds above $4,000 as lower oil prices ease Fed tightening concerns', url: 'https://www.kitco.com/news/article/2026-10-26/gold-rebounds-above-4000-lower-oil-prices-ease-fed-tightening-concerns' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'FinanceFeeds: Gold Price Today: $4,010 Into Fed Week, Bull $4,075, Bear $3,890', url: 'https://financefeeds.com/gold-price-today-4010-monday-fed-week-28-october-pce-29-october-bull-4075-bear-3890' },
      { title: 'Suara.com: Tahan Beli Dulu, Harga Emas Antam Mulai Naik Jadi Rp2,55 Juta/Gram', url: 'https://www.suara.com/bisnis/2026/10/27/093606/tahan-beli-dulu-harga-emas-antam-mulai-naik-jadi-rp255-jutagram' },
      { title: 'Sumeks: Harga Emas Antam Naik Rp10.000 per Gram pada Selasa 27 Oktober 2026', url: 'https://sumeks.disway.id/headline/read/799731/harga-emas-antam-naik-rp10000-per-gram-pada-selasa-27-oktober-2026' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-near-4000-fed-week-opens-antam-flat',
    category: 'market',
    title: {
      id: 'Emas Bertahan di Dekat $4.000 Saat Pekan Fed Dibuka, Antam Tetap Rp2.540.000',
      en: 'Gold Holds Near $4,000 as Fed Week Opens, Antam Steady at Rp2,540,000',
    },
    excerpt: {
      id: 'Emas membuka Senin di sekitar $3.986–3.994, dekat level terendah lebih dari tiga bulan, sementara Brent turun ke $114,54. Pasar memperkirakan Fed menahan suku bunga Rabu, tetapi peluang kenaikan Desember sekitar 80%. Harga Antam 1 gram tidak berubah di Rp2.540.000, turun Rp34.000 dalam sepekan.',
      en: 'Gold opened Monday around $3,986–3,994, near its lowest in more than three months, while Brent slipped to $114.54. Markets expect the Fed to hold on Wednesday, but put the odds of a December hike at about 80%. Antam’s 1-gram price is unchanged at Rp2,540,000, down Rp34,000 on the week.',
    },
    sections: [
      {
        heading: { id: 'Senin Pagi: Tidak Ada Pemulihan', en: 'Monday Morning: No Rebound' },
        paragraphs: [
          {
            id: 'Pasar emas dibuka kembali tanpa perubahan arah. Reuters mencatat emas spot di $3.986,16 di awal sesi Asia, sedikit lebih rendah, dan Trading Economics menunjukkan sekitar $3.993,79. Emas masih di dekat level terendah lebih dari tiga bulan yang dicapai Jumat lalu.',
            en: 'The gold market reopened without a change in direction. Reuters had spot gold at $3,986.16 early in the Asian session, slightly lower, and Trading Economics shows about $3,993.79. Gold is still near the more-than-three-month low it hit last Friday.',
          },
          {
            id: 'CNBC Indonesia mencatat spot di $3.999,16 pada pagi hari, naik tipis 0,1%, jadi harga bergerak di kisaran sempit tepat di bawah $4.000. Dalam sebulan emas turun 2,95%. Pergerakan sempit seperti ini wajar menjelang pekan dengan keputusan bank sentral dan data inflasi besar.',
            en: 'CNBC Indonesia had spot at $3,999.16 in the morning, up a slight 0.1%, so the price is moving in a narrow range just below $4,000. Gold is down 2.95% on the month. A narrow range like this is normal ahead of a week with a central bank decision and major inflation data.',
          },
        ],
      },
      {
        heading: { id: 'Minyak Mereda, Suku Bunga Belum', en: 'Oil Eases, Rates Don’t' },
        paragraphs: [
          {
            id: 'Minyak, pendorong utama penurunan pekan lalu, sedikit mereda. Brent turun 1,87% ke $114,54 dan WTI turun 2,13% ke $101,07. Namun yield Treasury 10 tahun masih di 4,967% dan indeks dolar di 101,60, jadi biaya memegang emas yang tidak berbunga tetap tinggi.',
            en: 'Oil, the main driver of last week’s decline, eased a little. Brent fell 1.87% to $114.54 and WTI fell 2.13% to $101.07. But the 10-year Treasury yield is still at 4.967% and the dollar index at 101.60, so the cost of holding non-yielding gold remains high.',
          },
          {
            id: 'Pasar memperkirakan Fed menahan suku bunga di 3,75–4,00% pada Rabu dengan peluang sekitar 90%, tetapi peluang kenaikan pada Desember sekitar 80%. Pekan ini lima bank sentral besar memutuskan suku bunga. Fed, ECB, dan Bank of Japan diperkirakan menahan, sementara Bank of Canada dan RBNZ diperkirakan bisa menaikkan.',
            en: 'Markets expect the Fed to hold at 3.75–4.00% on Wednesday with about 90% odds, but put the odds of a December hike at about 80%. Five major central banks set rates this week. The Fed, the ECB and the Bank of Japan are expected to hold, while the Bank of Canada and the RBNZ are priced for a possible hike.',
          },
        ],
      },
      {
        heading: { id: 'Jadwal dan Level Kunci', en: 'Schedule and Key Levels' },
        paragraphs: [
          {
            id: 'Keputusan Fed diumumkan Rabu 28 Oktober pukul 14.00 waktu AS, atau Kamis 01.00 WIB. Kamis 29 Oktober pukul 08.30 waktu AS (19.30 WIB) menyusul PCE September dan PDB kuartal III. Harga Antam baru bisa mencerminkan kedua peristiwa itu pada pembaruan Kamis dan Jumat pagi.',
            en: 'The Fed decision is announced on Wednesday, October 28 at 2 pm US time, or 01:00 WIB on Thursday. September PCE and third-quarter GDP follow on Thursday, October 29 at 8:30 am US time (19:30 WIB). Antam’s price can only reflect the two events in its Thursday and Friday morning updates.',
          },
          {
            id: 'Level yang dipantau: resistance intraday $4.021–4.039, lalu $4.075; support $3.963 dan $3.946, dengan target turun $3.890. Dalam skenario lunak (PCE dingin, peluang Desember turun), $4.150 terbuka. Dalam skenario keras, $3.890 menjadi sasaran. Emas kini sekitar 28,8% di bawah rekor $5.608,35 dari Januari.',
            en: 'Levels watched: intraday resistance at $4,021–4,039, then $4,075; support at $3,963 and $3,946, with a downside target of $3,890. In a soft scenario (cool PCE, lower December odds), $4,150 opens up. In a hawkish one, $3,890 is the target. Gold is now about 28.8% below its $5,608.35 January record.',
          },
        ],
      },
      {
        heading: { id: 'Antam dan Merek Lain', en: 'Antam and Other Brands' },
        paragraphs: [
          {
            id: 'Logam Mulia membuka pekan tanpa perubahan: Antam 1 gram tetap Rp2.540.000 dan buyback Rp2.335.000, sama dengan Jumat. Spread Rp205.000, atau sekitar 8,1%. Dalam sepekan, harga 1 gram turun Rp34.000 dari Rp2.574.000 pada 19 Oktober.',
            en: 'Logam Mulia opened the week unchanged: Antam’s 1-gram bar stays at Rp2,540,000 with a Rp2,335,000 buyback, the same as Friday. The spread is Rp205,000, or about 8.1%. On the week, the 1-gram price is down Rp34,000 from Rp2,574,000 on October 19.',
          },
          {
            id: 'Galeri24 di Rp2.467.000 dengan buyback Rp2.326.000 (spread Rp141.000, sekitar 5,7%), dan UBS di Rp2.491.000 dengan buyback Rp2.301.000 (spread Rp190.000, sekitar 7,6%). Galeri24 Rp73.000 per gram lebih murah dari Antam, dan UBS Rp49.000 lebih murah. Ketiganya belum bergerak sejak akhir pekan.',
            en: 'Galeri24 is at Rp2,467,000 with a Rp2,326,000 buyback (a Rp141,000 spread, about 5.7%), and UBS at Rp2,491,000 with a Rp2,301,000 buyback (a Rp190,000 spread, about 7.6%). Galeri24 is Rp73,000 a gram cheaper than Antam, and UBS Rp49,000 cheaper. None of the three has moved since the weekend.',
          },
        ],
      },
      {
        heading: { id: 'Cara Menyikapi Pekan Ini', en: 'How to Approach This Week' },
        paragraphs: [
          {
            id: 'Harga Antam yang stagnan bukan berarti risikonya hilang. Emas global masih bisa bergerak tajam setelah keputusan Fed dan data PCE, dan perubahan itu akan masuk ke harga Antam sekaligus. Spread sekitar 8,1% juga berarti harga perlu naik cukup jauh sebelum posisi baru impas.',
            en: 'A flat Antam price does not mean the risk is gone. Global gold can still move sharply after the Fed decision and the PCE data, and that move will hit Antam’s price all at once. A spread of about 8.1% also means the price has to rise a fair way before a new position breaks even.',
          },
          {
            id: 'Bagi penabung rutin, membeli bertahap (DCA) mengurangi risiko masuk tepat sebelum hari yang bergejolak, dan membandingkan spread antarmerek bisa menghemat puluhan ribu rupiah per gram. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan keputusan dengan tujuan dan profil risiko Anda.',
            en: 'For regular savers, buying in steps (DCA) reduces the risk of entering just before a volatile day, and comparing spreads between brands can save tens of thousands of rupiah per gram. This article is educational analysis, not personal financial advice. Match decisions to your own goals and risk profile.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Minyak sedikit mereda, tetapi yield dekat 5% dan peluang kenaikan Desember sekitar 80% tetap menahan emas di bawah $4.000.',
      en: 'Oil eased a little, but yields near 5% and roughly 80% odds of a December hike keep gold pinned below $4,000.',
    },
    callout: 'rates',
    image: withBase('/article-gold-near-4000-fed-week-opens.png'),
    publishedAt: Date.parse('2026-10-26T03:20:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Investing.com (Reuters): Currency markets subdued ahead of pivotal central bank week', url: 'https://www.investing.com/news/economy-news/currency-markets-subdued-ahead-of-pivotal-central-bank-week-4971353' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'FinanceFeeds: Gold Price Today: $3,996 Into the Fed, Bull $4,150, Bear $3,890', url: 'https://financefeeds.com/gold-price-today-3996-saturday-week-ahead-fed-28-october-silver-year-low-bull-4150-bear-3890/' },
      { title: 'CNBC Indonesia: Harga Emas Antam Logam Mulia Hari Ini Tak Bergerak', url: 'https://www.cnbcindonesia.com/research/20261026090029-128-779344/harga-emas-antam-logam-mulia-hari-ini-tak-bergerak-buback-berapa' },
      { title: 'ANTARA: Harga emas Antam Senin stabil Rp2,540 juta/gr', url: 'https://kalsel.antaranews.com/berita/541059/harga-emas-antam-senin-stabil-rp2540-juta-gr' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-below-4000-fed-pce-week-ahead',
    category: 'macro',
    title: {
      id: 'Emas di $3.994 Jelang Pekan Fed: Rabu Keputusan, Kamis PCE',
      en: 'Gold at $3,994 Into Fed Week: Decision Wednesday, PCE Thursday',
    },
    excerpt: {
      id: 'Emas menutup pekan di $3.993,96, hampir 4% lebih rendah dalam sepekan, dengan Brent di $116,72 dan yield 10 tahun di sekitar 5%. Pekan ini pasar menunggu keputusan Fed pada 28 Oktober dan data PCE pada 29 Oktober. Harga Antam tidak berubah pada Minggu, sementara Galeri24 dan UBS turun sekitar Rp10.000.',
      en: 'Gold ended the week at $3,993.96, almost 4% lower on the week, with Brent at $116.72 and the 10-year yield near 5%. This week the market waits for the Fed decision on October 28 and PCE data on October 29. Antam’s price did not change on Sunday, while Galeri24 and UBS fell about Rp10,000.',
    },
    sections: [
      {
        heading: { id: 'Titik Awal: Di Bawah $4.000', en: 'The Starting Point: Below $4,000' },
        paragraphs: [
          {
            id: 'Pasar emas tutup pada akhir pekan, jadi harga Jumat menjadi titik awal pekan depan. Trading Economics mencatat emas di $3.993,96, turun 0,77% pada hari itu, hampir 4% sepekan dan 6,57% sebulan. Itu level terendah sejak pertengahan Juli, dengan low intraday sekitar $3.975.',
            en: 'The gold market is closed for the weekend, so Friday’s price is the starting point for the week ahead. Trading Economics shows gold at $3,993.96, down 0.77% on the day, almost 4% on the week and 6.57% on the month. That is the lowest since mid-July, with an intraday low of about $3,975.',
          },
          {
            id: 'Perak lebih lemah lagi. Di sekitar $53,90, perak turun di bawah $54 untuk pertama kalinya pada 2026 dan berada sekitar 55% di bawah puncak Januari di dekat $121. Penurunan Kamis saja sekitar 2,8% untuk emas, atau sekitar $120.',
            en: 'Silver is weaker still. At about $53.90, it fell below $54 for the first time in 2026 and sits about 55% below its January peak near $121. Thursday’s drop alone was about 2.8% for gold, or roughly $120.',
          },
        ],
      },
      {
        heading: { id: 'Minyak, Yield dan Dolar Masih Menekan', en: 'Oil, Yields and the Dollar Still Weigh' },
        paragraphs: [
          {
            id: 'Brent ditutup di $116,72 pada Jumat, naik 3,14% dan penutupan tertinggi sejak 29 April. Minyak yang mahal membuat pasar khawatir inflasi AS bertahan tinggi, sehingga suku bunga juga tinggi lebih lama. Yield Treasury 10 tahun berada di sekitar 5,0% dan 2 tahun di sekitar 4,77%.',
            en: 'Brent settled at $116.72 on Friday, up 3.14% and its highest settlement since April 29. Expensive oil makes the market worry that US inflation stays high, and so do rates. The 10-year Treasury yield is near 5.0% and the 2-year near 4.77%.',
          },
          {
            id: 'Indeks dolar di sekitar 101,8. Bagi emas, yang tidak memberi bunga, yield 5% dan dolar kuat adalah kombinasi berat: memegang obligasi AS jadi lebih menarik, dan emas lebih mahal bagi pembeli di luar AS.',
            en: 'The dollar index is about 101.8. For gold, which pays no interest, a 5% yield and a strong dollar are a heavy mix: holding US bonds becomes more attractive, and gold costs more for buyers outside the US.',
          },
        ],
      },
      {
        heading: { id: 'Dua Hari yang Menentukan', en: 'Two Days That Decide It' },
        paragraphs: [
          {
            id: 'Rabu 28 Oktober pukul 14.00 waktu AS, Fed mengumumkan keputusan dengan kisaran saat ini 3,75–4,00%, diikuti konferensi pers Ketua Kevin Warsh. CME FedWatch memberi peluang tahan sekitar 90% dan kenaikan sekitar 10%. Yang lebih penting adalah Desember: Trading Economics mencatat peluang kenaikan hingga Desember sekitar 80%.',
            en: 'On Wednesday, October 28 at 2 pm US time, the Fed announces its decision with the range at 3.75–4.00%, followed by Chair Kevin Warsh’s press conference. CME FedWatch puts a hold at about 90% and a hike at about 10%. December matters more: Trading Economics puts the odds of a hike by December at about 80%.',
          },
          {
            id: 'Kamis 29 Oktober pukul 08.30 waktu AS, PCE September dan PDB kuartal III rilis bersamaan. Data PMI awal Oktober sudah kuat: manufaktur 56,0 (perkiraan 55,6) dan komposit 57,6. Jika PCE juga panas, pasar bisa makin yakin pada kenaikan Desember.',
            en: 'On Thursday, October 29 at 8:30 am US time, September PCE and third-quarter GDP come out together. The preliminary October PMIs were already firm: manufacturing at 56.0 (55.6 expected) and the composite at 57.6. If PCE is also hot, the market could grow more confident in a December hike.',
          },
        ],
      },
      {
        heading: { id: 'Level dan Skenario', en: 'Levels and Scenarios' },
        paragraphs: [
          {
            id: 'Kitco mencatat resistance di $4.075 serta support di $3.963 dan $3.946, dengan target turun $3.890. Skenario dasar adalah emas bergerak di kisaran $3.946–$4.075 menjelang data. Skenario lunak, yaitu PCE dingin dan peluang kenaikan Desember turun, membuka jalan ke $4.150. Skenario keras, yaitu Fed memberi sinyal kenaikan Desember, PCE panas dan minyak di atas $115, mengarah ke $3.890.',
            en: 'Kitco has resistance at $4,075 and support at $3,963 and $3,946, with a downside target of $3,890. The base case is gold churning in a $3,946–$4,075 range into the data. A soft scenario, with cool PCE and lower December hike odds, opens the way to $4,150. A hawkish one, with the Fed signaling a December hike, hot PCE and oil above $115, points to $3,890.',
          },
          {
            id: 'Gambaran besarnya: emas sekitar 28,8% di bawah rekor $5.608,35 dari Januari. Namun produsen masih untung besar. Newmont melaporkan biaya all-in sustaining $1.454/oz pada kuartal III, jauh di bawah harga saat ini.',
            en: 'The bigger picture: gold is about 28.8% below its $5,608.35 January record. Producers still earn a lot, though. Newmont reported all-in sustaining costs of $1,454/oz in the third quarter, far below the current price.',
          },
        ],
      },
      {
        heading: { id: 'Antam, Galeri24 dan UBS', en: 'Antam, Galeri24 and UBS' },
        paragraphs: [
          {
            id: 'Logam Mulia tidak memperbarui harga pada Minggu. Data terakhir Antam 1 gram Rp2.540.000 dengan buyback Rp2.335.000, sehingga spread Rp205.000 atau sekitar 8,1%. Pembaruan berikutnya dijadwalkan Senin 26 Oktober pukul 08.30 WIB, jadi itulah saat pertama penurunan emas global di bawah $4.000 bisa terlihat di harga Antam.',
            en: 'Logam Mulia did not update its prices on Sunday. Antam’s latest 1-gram price is Rp2,540,000 with a Rp2,335,000 buyback, a spread of Rp205,000, or about 8.1%. The next update is due Monday, October 26 at 08:30 WIB, the first chance for gold’s drop below $4,000 to show up in Antam’s price.',
          },
          {
            id: 'Galeri24 turun Rp11.000 ke Rp2.467.000 dengan buyback Rp2.326.000 (spread Rp141.000, sekitar 5,7%). UBS turun Rp10.000 ke Rp2.491.000 dengan buyback Rp2.301.000 (spread Rp190.000, sekitar 7,6%). Galeri24 kini Rp73.000 lebih murah dari Antam per gram, dan UBS Rp49.000 lebih murah.',
            en: 'Galeri24 fell Rp11,000 to Rp2,467,000 with a Rp2,326,000 buyback (a Rp141,000 spread, about 5.7%). UBS fell Rp10,000 to Rp2,491,000 with a Rp2,301,000 buyback (a Rp190,000 spread, about 7.6%). Galeri24 is now Rp73,000 a gram cheaper than Antam, and UBS Rp49,000 cheaper.',
          },
        ],
      },
      {
        heading: { id: 'Cara Menyikapi Pekan Ini', en: 'How to Approach This Week' },
        paragraphs: [
          {
            id: 'Permintaan struktural belum hilang: bank sentral membeli 289 ton emas pada kuartal II 2026, naik 62% secara tahunan, meski ETF Amerika Utara mencatat arus keluar 61 ton pada semester I. Pekan dengan dua data besar biasanya bergejolak, dan harga Antam baru bereaksi sehari setelahnya.',
            en: 'Structural demand has not gone away: central banks bought 289 tonnes of gold in the second quarter of 2026, up 62% year on year, even as North American ETFs saw 61 tonnes of outflows in the first half. A week with two major releases is usually volatile, and Antam’s price reacts only a day later.',
          },
          {
            id: 'Bagi penabung rutin, membeli bertahap (DCA) mengurangi risiko masuk di hari yang salah, dan selisih spread antarmerek layak dibandingkan sebelum membeli. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan keputusan dengan tujuan dan profil risiko Anda.',
            en: 'For regular savers, buying in steps (DCA) reduces the risk of entering on the wrong day, and the spread gap between brands is worth comparing before buying. This article is educational analysis, not personal financial advice. Match decisions to your own goals and risk profile.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Pasar sudah memperkirakan Fed menahan suku bunga pada Rabu. Yang dinilai emas adalah sinyal untuk Desember dan angka PCE pada Kamis.',
      en: 'The market already expects the Fed to hold on Wednesday. What gold is pricing is the signal for December and Thursday’s PCE number.',
    },
    callout: 'rates',
    image: withBase('/article-gold-fed-pce-week-ahead.png'),
    publishedAt: Date.parse('2026-10-25T02:50:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'FinanceFeeds: Gold Price Today: $3,996 Into the Fed, Bull $4,150, Bear $3,890', url: 'https://financefeeds.com/gold-price-today-3996-saturday-week-ahead-fed-28-october-silver-year-low-bull-4150-bear-3890/' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Crux Investor: Central banks bought 289 tonnes of gold while Western ETFs sold 61 tonnes', url: 'https://www.cruxinvestor.com/posts/central-banks-bought-289-tonnes-of-gold-while-western-etfs-sold-61-tonnes-supporting-long-term-gold-demand' },
      { title: 'Surabaya Inside: Harga Emas Hari Ini, 25 Oktober 2026: Antam Bertahan di Rp 2,54 Juta per Gram', url: 'https://www.surabayainside.com/39096/harga-emas-hari-ini-25-oktober-2026-antam-bertahan-di-rp-254-juta-per-gram' },
      { title: 'Industry.co.id: Harga Emas Hari Ini 25 Oktober 2026: Antam, UBS, dan Galeri 24 Lengkap', url: 'https://www.industry.co.id/read/157924/harga-emas-hari-ini-25-oktober-2026-antam-ubs-dan-galeri-24-lengkap' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-breaks-4000-weekly-loss-brent-117',
    category: 'market',
    title: {
      id: 'Emas Jebol $4.000, Turun 3,87% Sepekan; Brent Tembus $117',
      en: 'Gold Breaks $4,000 and Loses 3.87% on the Week as Brent Tops $117',
    },
    excerpt: {
      id: 'Emas turun 0,70% ke sekitar $3.995,81 pada Jumat dan ditutup sepekan turun 3,87%, karena Brent naik di atas $117 dan ekspektasi inflasi AS naik. Harga resmi Antam belum diperbarui karena situs Logam Mulia sedang pemeliharaan, sementara Galeri24 dan UBS turun lebih dari Rp20.000.',
      en: 'Gold fell 0.70% to about $3,995.81 on Friday and finished the week down 3.87% as Brent rose above $117 and US inflation expectations climbed. Antam’s official price has not been updated because the Logam Mulia site is under maintenance, while Galeri24 and UBS fell more than Rp20,000.',
    },
    sections: [
      {
        heading: { id: 'Batas $4.000 Akhirnya Tembus', en: 'The $4,000 Line Finally Gives Way' },
        paragraphs: [
          {
            id: 'Sehari setelah anjlok 2,88%, emas melanjutkan penurunan pada Jumat. Kitco mencatat emas di sekitar $3.995,81, turun 0,70%, dan perak turun 1,26% ke sekitar $53,90. Trading Economics mencatat emas di $3.993,96, turun $30,86, di bawah $4.000 untuk pertama kalinya sejak pertengahan Juli.',
            en: 'A day after its 2.88% slump, gold kept falling on Friday. Kitco had gold near $3,995.81, down 0.70%, and silver down 1.26% at about $53.90. Trading Economics shows gold at $3,993.96, down $30.86, below $4,000 for the first time since mid-July.',
          },
          {
            id: 'Secara mingguan, kerugiannya besar. Tabel penutupan New York dari PMI mencatat emas di $4.000,14 pada Jumat, dari $4.161,10 sepekan sebelumnya: turun $160,96 atau 3,87%. Perak turun 5,42% ke $54,05 dan platinum turun 4,48% ke $1.557,25 dalam periode yang sama.',
            en: 'On the week, the loss was large. PMI’s New York closing table has gold at $4,000.14 on Friday, from $4,161.10 a week earlier: down $160.96, or 3.87%. Silver fell 5.42% to $54.05 and platinum 4.48% to $1,557.25 over the same period.',
          },
        ],
      },
      {
        heading: { id: 'Minyak dan Ekspektasi Inflasi', en: 'Oil and Inflation Expectations' },
        paragraphs: [
          {
            id: 'Minyak tetap menjadi pemicu utama. Kitco mencatat Brent naik di atas $117 per barel, tertinggi dalam lebih dari empat tahun, dan WTI di atas $103 karena ketegangan di Selat Hormuz. Minyak mahal menjaga kekhawatiran inflasi tetap hidup, sehingga pasar memperkirakan suku bunga tinggi lebih lama.',
            en: 'Oil remained the main trigger. Kitco reports Brent rose above $117 a barrel, its highest in more than four years, and WTI above $103 on Strait of Hormuz tension. Expensive oil keeps inflation worries alive, so markets expect rates to stay higher for longer.',
          },
          {
            id: 'Data AS menambah tekanan. PMI komposit awal Oktober turun ke 57,6 dari 58,4, tetapi manufaktur naik ke 56,0, di atas perkiraan 55,5. Ekspektasi inflasi setahun University of Michigan naik ke 4,7% dan jangka panjang ke 3,5%, keduanya tertinggi sejak Mei. Yield Treasury 10 tahun di sekitar 5,0%, dan CME FedWatch memberi peluang kenaikan Fed sekitar 80% untuk Desember.',
            en: 'US data added pressure. The preliminary October composite PMI fell to 57.6 from 58.4, but manufacturing rose to 56.0, above the 55.5 forecast. University of Michigan year-ahead inflation expectations rose to 4.7% and longer-term ones to 3.5%, both the highest since May. The 10-year Treasury yield is near 5.0%, and CME FedWatch puts the odds of a December Fed hike at about 80%.',
          },
        ],
      },
      {
        heading: { id: 'Gambaran Besar dan Level Teknikal', en: 'The Big Picture and Technical Levels' },
        paragraphs: [
          {
            id: 'Trading Economics mencatat emas turun 6,57% sebulan. Di $3.995,81, emas berada sekitar 28,8% di bawah rekor Januari $5.608,35. Indeks dolar di sekitar 101,75, relatif stabil, sehingga tekanan pada emas lebih banyak datang dari ekspektasi suku bunga daripada dari dolar.',
            en: 'Trading Economics shows gold down 6.57% on the month. At $3,995.81, gold sits about 28.8% below its January record of $5,608.35. The dollar index is near 101.75 and fairly steady, so the pressure on gold comes more from rate expectations than from the dollar.',
          },
          {
            id: 'Level dari Kitco: resistance $4.075; support $3.963, lalu $3.946, dengan target turun lebih dalam $3.890. PMI melihat support pekan depan di $4.008 dan $3.942. Agenda: rapat Fed 27–28 Oktober dengan keputusan pada Rabu 28 Oktober, lalu data inflasi PCE September pada Kamis 29 Oktober.',
            en: 'Kitco’s levels: resistance at $4,075; support at $3,963, then $3,946, with a deeper downside target of $3,890. PMI sees next week’s support at $4,008 and $3,942. Agenda: the October 27–28 Fed meeting with the decision on Wednesday, October 28, then September PCE inflation data on Thursday, October 29.',
          },
        ],
      },
      {
        heading: { id: 'Antam Menunggu Update, Galeri24 dan UBS Turun', en: 'Antam Awaits an Update as Galeri24 and UBS Fall' },
        paragraphs: [
          {
            id: 'Harga resmi Antam terakhir Rp2.540.000 per gram dengan buyback Rp2.335.000, per 23 Oktober, sehingga spread Rp205.000 atau sekitar 8,1%. Investor.id melaporkan harga stabil pada Sabtu, tetapi Surabaya Inside mencatat situs Logam Mulia sedang pemeliharaan dan update resmi belum keluar. Karena itu panel Antam EmasKuy tetap memakai harga 23 Oktober.',
            en: 'Antam’s last official price is Rp2,540,000 per gram with a Rp2,335,000 buyback, as of October 23, a spread of Rp205,000 or about 8.1%. Investor.id reports the price unchanged on Saturday, but Surabaya Inside notes the Logam Mulia site is under maintenance and the official update is not out. EmasKuy’s Antam panel therefore keeps the October 23 prices.',
          },
          {
            id: 'Galeri24 turun Rp21.000 ke Rp2.478.000 dengan buyback Rp2.335.000: Rp62.000 lebih murah dari harga Antam terakhir, dengan spread Rp143.000 atau sekitar 5,8%. UBS turun Rp23.000 ke Rp2.501.000 dengan buyback Rp2.310.000: Rp39.000 lebih murah dari Antam, dengan spread Rp191.000 atau sekitar 7,6%. Buyback Galeri24 kini sama dengan buyback Antam terakhir.',
            en: 'Galeri24 fell Rp21,000 to Rp2,478,000 with a Rp2,335,000 buyback: Rp62,000 cheaper than Antam’s last price, with a Rp143,000 spread, about 5.8%. UBS fell Rp23,000 to Rp2,501,000 with a Rp2,310,000 buyback: Rp39,000 cheaper than Antam, with a Rp191,000 spread, about 7.6%. Galeri24’s buyback now equals Antam’s last buyback.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: Pekan Fed dan PCE', en: 'Playbook: Fed Week and PCE' },
        paragraphs: [
          {
            id: 'Skenario dekat: kembali ke atas $4.008 dan $4.075 bisa meredakan tekanan; tembus di bawah $3.963 dan $3.946 membuka $3.890. Minyak tetap variabel kunci. Kitco mencatat inflasi yang lebih lunak bisa mengurangi ekspektasi kenaikan Desember, sementara minyak yang terus naik bisa memperkuatnya.',
            en: 'Near-term scenarios: regaining $4,008 and $4,075 could ease the pressure; a break below $3,963 and $3,946 opens $3,890. Oil remains the key variable. Kitco notes that softer inflation could reduce expectations of a December hike, while oil that keeps rising could strengthen them.',
          },
          {
            id: 'Bagi investor rupiah, harga Antam sudah turun Rp34.000 sejak 19 Oktober, dan spread sekitar 8,1% berarti harga perlu naik cukup jauh sebelum posisi baru impas. DCA dengan nominal tetap meratakan harga beli di kedua skenario. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, Antam has fallen Rp34,000 since October 19, and a spread of about 8.1% means prices must rise a fair way before a new position breaks even. Fixed-amount DCA averages the purchase price in either scenario. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Selama minyak terus naik, pasar membaca setiap data sebagai alasan suku bunga tinggi lebih lama.',
      en: 'As long as oil keeps rising, the market reads every data point as a reason for higher rates for longer.',
    },
    callout: 'rates',
    image: withBase('/article-gold-breaks-4000-weekly-loss-brent-117.png'),
    publishedAt: Date.parse('2026-10-24T02:50:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Kitco: Gold, silver extend weekly losses as Hormuz tensions push crude above $116 - Kitco PM Report', url: 'https://www.kitco.com/news/article/2026-10-23/gold-silver-extend-weekly-losses-hormuz-tensions-push-crude-above-116-kitco' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'PMI: The Precious Metals Week in Review – October 23rd, 2026', url: 'https://blog.pmi.ky/2026/10/23/the-precious-metals-week-in-review-october-23srd-2026/' },
      { title: 'Investor.id: Harga Emas Antam (ANTM) Hari Ini, Sabtu 24 Oktober 2026: Tak Goyah', url: 'https://investor.id/market/459272/harga-emas-antam-antm-hari-ini-sabtu-24-oktober-2026-tak-goyah' },
      { title: 'Surabaya Inside: Harga Emas Hari Ini, 24 Oktober 2026: Update Resmi Belum Keluar', url: 'https://www.surabayainside.com/38980/harga-emas-hari-ini-24-oktober-2026-update-resmi-belum-keluar-ini-harga-terakhir-antam-rp-2540000-per-gram' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-plunges-4021-lowest-since-august-hormuz',
    category: 'market',
    title: {
      id: 'Emas Anjlok 2,88% ke $4.021, Terendah Sejak Agustus; Antam Rp2.540.000',
      en: 'Gold Plunges 2.88% to $4,021, the Lowest Since August; Antam at Rp2,540,000',
    },
    excerpt: {
      id: 'Emas jatuh $119,10 ke sekitar $4.021,20 pada Kamis karena ketegangan di Selat Hormuz mendorong Brent di atas $113 dan saham AI dijual. Penurunan ini menghapus seluruh kenaikan sejak musim panas. Antam turun Rp10.000 ke Rp2.540.000, sementara buyback anjlok Rp30.000.',
      en: 'Gold fell $119.10 to about $4,021.20 on Thursday as Strait of Hormuz tension pushed Brent above $113 and AI stocks were sold. The drop erased all of the gains since the summer. Antam fell Rp10,000 to Rp2,540,000, while buyback dropped Rp30,000.',
    },
    sections: [
      {
        heading: { id: 'Penurunan Terdalam dalam Berbulan-bulan', en: 'The Deepest Drop in Months' },
        paragraphs: [
          {
            id: 'Emas mengalami hari yang berat pada Kamis. Kitco mencatat emas di sekitar $4.021,20 pada sore hari, turun $119,10 atau 2,88%, dan perak anjlok 5,90% ke sekitar $54,44. Vibiznews mencatat emas spot ditutup di $4.024,44, terendah sejak Agustus, dan futures Desember turun sekitar 2,16% ke $4.060.',
            en: 'Gold had a heavy day on Thursday. Kitco had gold near $4,021.20 in the afternoon, down $119.10 or 2.88%, and silver down 5.90% at about $54.44. Vibiznews says spot gold closed at $4,024.44, the lowest since August, and December futures fell about 2.16% to $4,060.',
          },
          {
            id: 'Harga menembus $4.100 dan support $4.073 yang bertahan sejak awal Oktober, menurut Vibiznews. Kitco mengutip analis Jesse Colombo yang menyebut pergerakan ini "sangat aneh": emas menghapus seluruh kenaikan sejak musim panas dan kini menguji area $4.000–$3.900, tempat harga memantul pada musim panas lalu.',
            en: 'Prices broke $4,100 and the $4,073 support that had held since early October, according to Vibiznews. Kitco quotes analyst Jesse Colombo calling the move "very bizarre": gold erased all of its gains since the summer and is now testing the $4,000–$3,900 area where it bounced last summer.',
          },
        ],
      },
      {
        heading: { id: 'Minyak, Saham AI, dan Yield yang Tak Menolong', en: 'Oil, AI Stocks, and Yields That Did Not Help' },
        paragraphs: [
          {
            id: 'Kitco mengaitkan penurunan dengan ketegangan baru di Selat Hormuz antara AS dan Iran, yang mendorong Brent di atas $113 per barel dan WTI mendekati $100. Minyak mahal menghidupkan lagi kekhawatiran inflasi: CPI September 3,7% dan PPI 6,3% secara tahunan. Pasar memperkirakan peluang kenaikan suku bunga Fed pada Desember sekitar 89–94%.',
            en: 'Kitco links the drop to renewed US–Iran tension in the Strait of Hormuz, which pushed Brent above $113 a barrel and WTI toward $100. Expensive oil revived inflation worries: September CPI was 3.7% and PPI 6.3% year on year. Markets put the odds of a December Fed rate hike at about 89–94%.',
          },
          {
            id: 'Saham teknologi juga dijual: Nasdaq turun 2,60% dan S&P 500 turun 1,21%, penurunan harian terbesar sejak Juli. Biasanya yield yang turun membantu emas, tetapi kali ini tidak. Kitco membaca ini sebagai tekanan likuidasi, ketika investor menjual logam mulia untuk menutup kerugian di tempat lain. Colombo juga menduga ada intervensi yen.',
            en: 'Tech stocks were sold too: the Nasdaq fell 2.60% and the S&P 500 1.21%, its largest daily drop since July. Falling yields usually help gold, but not this time. Kitco reads this as liquidation pressure, with investors selling precious metals to cover losses elsewhere. Colombo also suspects yen intervention.',
          },
        ],
      },
      {
        heading: { id: 'Gambaran Besar dan Level Teknikal', en: 'The Big Picture and Technical Levels' },
        paragraphs: [
          {
            id: 'Trading Economics mencatat emas turun sekitar 5,9% sebulan. Di $4.021,20, emas berada sekitar 28% di bawah rekor Januari $5.608,35. Data tenaga kerja tetap kuat: Kitco mencatat klaim pengangguran turun ke 194.000, di bawah perkiraan 200.000, yang ikut menjaga ekspektasi Fed tetap ketat.',
            en: 'Trading Economics shows gold down about 5.9% on the month. At $4,021.20, gold sits about 28% below its January record of $5,608.35. Labor data stay firm: Kitco reports jobless claims fell to 194,000, below the 200,000 forecast, which also keeps Fed expectations tight.',
          },
          {
            id: 'Level dari Kitco: resistance $4.068 dan $4.079, lalu $4.124,25 dan $4.142; support $4.038, lalu area $4.000. Vibiznews melihat support spot $3.983–$3.942 dan resistance $4.103–$4.182. Agenda: PMI awal Oktober dan sentimen konsumen final University of Michigan (Jumat), rapat Fed 27–28 Oktober, lalu PCE September pada 29 Oktober.',
            en: 'Kitco’s levels: resistance at $4,068 and $4,079, then $4,124.25 and $4,142; support at $4,038, then the $4,000 area. Vibiznews sees spot support at $3,983–$3,942 and resistance at $4,103–$4,182. Agenda: preliminary October PMIs and final University of Michigan consumer sentiment (Friday), the October 27–28 Fed meeting, then September PCE on October 29.',
          },
        ],
      },
      {
        heading: { id: 'Antam Turun, Buyback Anjlok Lebih Dalam', en: 'Antam Falls, Buyback Drops Further' },
        paragraphs: [
          {
            id: 'Harga Antam 1 gram turun Rp10.000 ke Rp2.540.000, penurunan hari keempat, menurut detikFinance. Buyback turun lebih dalam, Rp30.000 ke Rp2.335.000 per gram, sehingga spread melebar dari Rp185.000 ke Rp205.000, sekitar 8,1%. Batangan 10 gram kini Rp24.895.000 dan 100 gram Rp248.212.000.',
            en: 'Antam’s 1-gram price fell Rp10,000 to Rp2,540,000, a fourth daily decline, according to detikFinance. Buyback fell further, by Rp30,000 to Rp2,335,000 per gram, widening the spread from Rp185,000 to Rp205,000, about 8.1%. The 10-gram bar now costs Rp24,895,000 and the 100-gram bar Rp248,212,000.',
          },
          {
            id: 'Galeri24 turun Rp5.000 ke Rp2.499.000 dengan buyback Rp2.354.000: Rp41.000 lebih murah dari Antam dengan spread Rp145.000, sekitar 5,8%. UBS turun Rp4.000 ke Rp2.524.000 dengan buyback Rp2.328.000: Rp16.000 lebih murah dari Antam dengan spread Rp196.000, sekitar 7,8%. Buyback Galeri24 kini Rp19.000 di atas Antam.',
            en: 'Galeri24 fell Rp5,000 to Rp2,499,000 with a Rp2,354,000 buyback: Rp41,000 cheaper than Antam with a Rp145,000 spread, about 5.8%. UBS fell Rp4,000 to Rp2,524,000 with a Rp2,328,000 buyback: Rp16,000 cheaper than Antam with a Rp196,000 spread, about 7.8%. Galeri24’s buyback is now Rp19,000 above Antam’s.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: $4.000 Jadi Ujian', en: 'Playbook: $4,000 Is the Test' },
        paragraphs: [
          {
            id: 'Skenario dekat: bertahan di atas $4.038 dan $4.000 lalu kembali ke atas $4.079 bisa membuka $4.124,25; tembus di bawah $4.000 membuka $3.983–$3.942. Vibiznews mencatat rebound teknikal mungkin terjadi jika minyak terkoreksi, tetapi tekanan bisa berlanjut jika minyak naik dan yield tetap tinggi menjelang rapat Fed.',
            en: 'Near-term scenarios: holding above $4,038 and $4,000 and then regaining $4,079 could open $4,124.25; a break below $4,000 opens $3,983–$3,942. Vibiznews notes that a technical rebound is possible if oil corrects, but pressure could continue if oil rises and yields stay high ahead of the Fed meeting.',
          },
          {
            id: 'Bagi investor rupiah, Antam sudah turun Rp34.000 dalam empat hari, dari Rp2.574.000 pada 19 Oktober, dan buyback turun Rp54.000 dari Rp2.389.000. Spread yang melebar membuat harga jual kembali makin jauh dari harga beli. DCA dengan nominal tetap meratakan harga beli di kedua skenario. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, Antam has fallen Rp34,000 in four days, from Rp2,574,000 on October 19, and buyback has fallen Rp54,000 from Rp2,389,000. The wider spread pushes the sell-back price further from the purchase price. Fixed-amount DCA averages the purchase price in either scenario. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Saat yield turun tetapi emas tetap anjlok, pasar sedang menjual apa saja untuk menutup kerugian di tempat lain.',
      en: 'When yields fall and gold still slumps, the market is selling whatever it can to cover losses elsewhere.',
    },
    callout: 'rates',
    image: withBase('/article-gold-plunges-4021-lowest-since-august-hormuz.png'),
    publishedAt: Date.parse('2026-10-23T03:10:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Kitco: Precious metals tumble despite falling yields as Hormuz tensions intensify - Kitco PM Report', url: 'https://www.kitco.com/news/article/2026-10-22/precious-metals-tumble-despite-falling-yields-hormuz-tensions-intensify' },
      { title: 'Kitco: ‘Very bizarre action’ as gold retraces entire summer rally to test $4,000/oz', url: 'https://www.kitco.com/news/article/2026-10-22/very-bizarre-action-gold-retraces-entire-summer-rally-test-4000oz-ai' },
      { title: 'Kitco: Gold prices struggling as U.S. weekly jobless claims fall to three-month low', url: 'https://www.kitco.com/news/article/2026-10-22/gold-prices-struggling-us-weekly-jobless-claims-fall-three-month-low' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Vibiznews: Harga Beli Emas Antam Hari ini Jumat 23 Oktober 2026 Turun Rp10.000; Harga Buyback Merosot Rp30.000', url: 'https://vibiznews.com/index.php/2026/10/23/harga-beli-emas-antam-hari-ini-jumat-23-oktober-2026-turun-rp10-000-harga-buyback-merosot-rp30-000/' },
      { title: 'detikFinance: Harga Emas Antam Ambles Rp 10.000, Buyback Anjlok Rp 30.000!', url: 'https://finance.detik.com/berita-ekonomi-bisnis/d-8720100/harga-emas-antam-ambles-rp-10-000-buyback-anjlok-rp-30-000' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-rebound-erased-4118-oil-december-hike',
    category: 'market',
    title: {
      id: 'Rebound Emas ke $4.141 Terhapus, Kembali ke $4.118; Antam Rp2.550.000',
      en: 'Gold’s Rebound to $4,141 Is Erased, Back to $4,118; Antam at Rp2,550,000',
    },
    excerpt: {
      id: 'Emas sempat naik 0,66% ke sekitar $4.141 pada Rabu setelah empat sesi turun, tetapi Kamis pagi turun 0,55% ke $4.118,53 karena minyak kembali naik. Peluang kenaikan Fed Desember tetap sekitar 89–94%. Antam turun Rp4.000 ke Rp2.550.000, penurunan hari ketiga.',
      en: 'Gold rose 0.66% to about $4,141 on Wednesday after four losing sessions, but on Thursday morning fell 0.55% to $4,118.53 as oil rose again. The odds of a December Fed hike remain about 89–94%. Antam fell Rp4,000 to Rp2,550,000, a third daily decline.',
    },
    sections: [
      {
        heading: { id: 'Rebound Rabu, Turun Lagi Kamis', en: 'A Wednesday Rebound, a Thursday Slide' },
        paragraphs: [
          {
            id: 'Emas memutus empat sesi penurunan pada Rabu. Vibiznews mencatat emas spot sempat jatuh ke $4.116, terendah sejak 15 Oktober, sebelum aksi beli saat harga turun mengangkatnya pada sesi AS. Kitco mencatat emas di sekitar $4.141,01 pada sore hari, naik 0,66%, dan perak di sekitar $57,976, naik 0,34%.',
            en: 'Gold broke a four-session losing streak on Wednesday. Vibiznews reports that spot gold dipped to $4,116, the lowest since October 15, before dip buying lifted it in the US session. Kitco had gold near $4,141.01 in the afternoon, up 0.66%, and silver near $57.976, up 0.34%.',
          },
          {
            id: 'Kenaikan itu tidak bertahan. Kamis pagi Trading Economics mencatat emas turun 0,55% ke $4.118,53 dan bergerak ke arah $4.100, menghapus kenaikan sesi sebelumnya. Penyebabnya ketegangan baru di Timur Tengah yang kembali mendorong harga minyak dan kekhawatiran inflasi.',
            en: 'The gain did not last. On Thursday morning Trading Economics had gold down 0.55% at $4,118.53 and heading toward $4,100, erasing the previous session’s gain. The cause was renewed Middle East tension, which again pushed up oil prices and inflation worries.',
          },
        ],
      },
      {
        heading: { id: 'Minyak dan Peluang Kenaikan Fed', en: 'Oil and the Odds of a Fed Hike' },
        paragraphs: [
          {
            id: 'Pada Rabu minyak sempat melunak: Kitco mencatat WTI Desember ditutup di $97,15, turun 0,7%, dan Brent di sekitar $108,82, meski stok minyak mentah AS turun 3,1 juta barel, jauh di atas perkiraan penurunan sekitar 300.000 barel. Kamis, Trading Economics mencatat minyak kembali naik.',
            en: 'Oil eased on Wednesday: Kitco had December WTI settling at $97.15, down 0.7%, and Brent near $108.82, even though US crude stocks fell 3.1 million barrels, far more than the expected draw of about 300,000 barrels. On Thursday, Trading Economics shows oil rising again.',
          },
          {
            id: 'Minyak mahal menjaga ekspektasi Fed tetap ketat. Vibiznews mencatat pasar memperkirakan peluang kenaikan suku bunga pada Desember sekitar 89–94%, dan sekitar 17% untuk rapat 27–28 Oktober. Pejabat Fed sedang dalam masa tenang sebelum rapat. Yield 10 tahun di sekitar 5,09% dan indeks dolar sekitar 101,64.',
            en: 'Expensive oil keeps Fed expectations tight. Vibiznews says markets put the odds of a December rate hike at about 89–94%, and about 17% for the October 27–28 meeting. Fed officials are in their pre-meeting blackout. The 10-year yield is near 5.09% and the dollar index near 101.64.',
          },
        ],
      },
      {
        heading: { id: 'Gambaran Besar dan Level Teknikal', en: 'The Big Picture and Technical Levels' },
        paragraphs: [
          {
            id: 'Trading Economics mencatat emas turun sekitar 4% sebulan. Di $4.118,53, emas berada sekitar 26,6% di bawah rekor Januari $5.608,35. Data AS tetap lemah: Kitco mencatat pending home sales September turun 7,3%, setelah housing starts turun 5,2% ke 1,221 juta, tetapi data lemah belum cukup mengimbangi tekanan minyak dan yield.',
            en: 'Trading Economics shows gold down about 4% on the month. At $4,118.53, gold sits about 26.6% below its January record of $5,608.35. US data remain weak: Kitco reports that September pending home sales fell 7.3%, after housing starts fell 5.2% to 1.221 million, but weak data have not been enough to offset the pressure from oil and yields.',
          },
          {
            id: 'Level dari Kitco: resistance $4.142,52 dan $4.162, lalu $4.180 dan $4.217; support $4.127,10 dan $4.098,63, lalu $4.066 dan $3.942. Agenda: klaim pengangguran mingguan (Kamis), PMI manufaktur dan jasa awal Oktober serta sentimen konsumen final University of Michigan (Jumat), lalu keputusan Fed pekan depan.',
            en: 'Kitco’s levels: resistance at $4,142.52 and $4,162, then $4,180 and $4,217; support at $4,127.10 and $4,098.63, then $4,066 and $3,942. Agenda: weekly jobless claims (Thursday), preliminary October manufacturing and services PMIs and final University of Michigan consumer sentiment (Friday), then the Fed decision next week.',
          },
        ],
      },
      {
        heading: { id: 'Antam Turun Hari Ketiga', en: 'Antam Falls for a Third Day' },
        paragraphs: [
          {
            id: 'Harga Antam 1 gram turun Rp4.000 ke Rp2.550.000 pada pembaruan pukul 08.50 WIB, penurunan hari ketiga, dengan buyback turun Rp4.000 ke Rp2.365.000 per gram. Spread-nya tetap Rp185.000, sekitar 7,3%. Batangan 10 gram kini Rp24.995.000 dan 100 gram Rp249.212.000.',
            en: 'Antam’s 1-gram price fell Rp4,000 to Rp2,550,000 in the 08:50 WIB update, a third daily decline, with buyback down Rp4,000 to Rp2,365,000 per gram. The spread stays at Rp185,000, about 7.3%. The 10-gram bar now costs Rp24,995,000 and the 100-gram bar Rp249,212,000.',
          },
          {
            id: 'Galeri24 turun Rp6.000 ke Rp2.504.000 dengan buyback turun Rp5.000 ke Rp2.358.000: Rp46.000 lebih murah dari Antam dengan spread Rp146.000, sekitar 5,8%. UBS turun Rp6.000 ke Rp2.528.000 dengan buyback Rp2.332.000: Rp22.000 lebih murah dari Antam dengan spread Rp196.000, sekitar 7,8%. Buyback Antam Rp7.000 di atas Galeri24.',
            en: 'Galeri24 fell Rp6,000 to Rp2,504,000, with buyback down Rp5,000 to Rp2,358,000: Rp46,000 cheaper than Antam with a Rp146,000 spread, about 5.8%. UBS fell Rp6,000 to Rp2,528,000 with a Rp2,332,000 buyback: Rp22,000 cheaper than Antam with a Rp196,000 spread, about 7.8%. Antam’s buyback is Rp7,000 above Galeri24’s.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: $4.098 Jadi Garis Penentu', en: 'Playbook: $4,098 Is the Deciding Line' },
        paragraphs: [
          {
            id: 'Skenario dekat: kembali di atas $4.142,52 dan $4.162 membuka jalan ke $4.180; turun di bawah $4.098,63 bisa membuka $4.066 lalu $3.942. Penggeraknya tetap minyak, yield dan dolar. Di sisi fisik, Vibiznews mencatat permintaan tetap kuat, termasuk penjualan perak dan platinum yang mencetak rekor dan permintaan yang kembali di Royal Mint.',
            en: 'Near-term scenarios: regaining $4,142.52 and $4,162 opens the way to $4,180; a break below $4,098.63 could open $4,066, then $3,942. Oil, yields and the dollar remain the drivers. On the physical side, Vibiznews notes that demand stays strong, including record silver and platinum sales and renewed demand at the Royal Mint.',
          },
          {
            id: 'Bagi investor rupiah, Antam sudah turun Rp24.000 dalam tiga hari, dari Rp2.574.000 pada 19 Oktober. DCA dengan nominal tetap meratakan harga beli di kedua skenario, dan perbedaan spread, dari sekitar 5,8% hingga 7,8%, layak diperhitungkan jika Anda berencana menjual kembali. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, Antam has fallen Rp24,000 in three days, from Rp2,574,000 on October 19. Fixed-amount DCA averages the purchase price in either scenario, and the different spreads, from about 5.8% to 7.8%, are worth factoring in if you plan to sell back. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Satu hari rebound tidak mengubah arah selama minyak mahal menjaga peluang kenaikan Fed Desember di atas 89%.',
      en: 'One day of rebound does not change the direction while expensive oil keeps the odds of a December Fed hike above 89%.',
    },
    callout: 'rates',
    image: withBase('/article-gold-rebound-erased-4118-oil-december-hike.png'),
    publishedAt: Date.parse('2026-10-22T02:52:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Kitco: Gold gains as Treasury yields stabilize, Nasdaq surges despite Fed tightening concerns - Kitco PM Report', url: 'https://www.kitco.com/news/article/2026-10-21/gold-gains-treasury-yields-stabilize-nasdaq-surges-despite-fed-tightening' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Vibiznews: Harga Beli dan Buyback Emas Antam Hari ini Kamis 22 Oktober 2026, Kompak Turun Rp4.000', url: 'https://vibiznews.com/index.php/2026/10/22/harga-beli-dan-buyback-emas-antam-hari-ini-kamis-22-oktober-2026-kompak-turun-rp4-000/' },
      { title: 'Periskop: Harga Emas Antam Hari Ini Turun Rp4.000 Jadi Rp2,550 Juta per Gram', url: 'https://periskop.id/investasi/20261022/harga-emas-antam-turun-rp2-550-juta-per-gram' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-fourth-decline-4119-oil-111-cibc-cut',
    category: 'market',
    title: {
      id: 'Emas Turun Hari Keempat ke $4.119; Brent $111 dan CIBC Pangkas Proyeksi',
      en: 'Gold Falls a Fourth Day to $4,119; Brent at $111 and CIBC Cuts Its Forecast',
    },
    excerpt: {
      id: 'Emas turun 0,48% ke sekitar $4.120 pada Selasa meski data perumahan AS lemah, dan bertahan di sekitar $4.119 pada Rabu pagi, penurunan sesi keempat. Brent naik ke sekitar $111,30, tertinggi sejak Mei, dan CIBC memangkas proyeksi kuartal IV ke $4.500. Antam turun Rp10.000 ke Rp2.554.000.',
      en: 'Gold fell 0.48% to about $4,120 on Tuesday despite weak US housing data and held near $4,119 on Wednesday morning, a fourth losing session. Brent rose to about $111.30, its highest since May, and CIBC cut its Q4 forecast to $4,500. Antam fell Rp10,000 to Rp2,554,000.',
    },
    sections: [
      {
        heading: { id: 'Data Perumahan Lemah, Emas Tetap Turun', en: 'Weak Housing Data, Gold Still Falls' },
        paragraphs: [
          {
            id: 'Data perumahan AS pada Selasa jelas lemah. Kitco mencatat housing starts September turun 5,2% ke laju tahunan 1,221 juta, 7,4% di bawah setahun lalu, dan izin bangunan turun tipis ke 1,400 juta. Sehari sebelumnya indeks pasar perumahan NAHB jatuh ke 29, terendah sejak Juni 2012.',
            en: 'US housing data on Tuesday were clearly weak. Kitco reported that September housing starts fell 5.2% to a 1.221 million annual rate, 7.4% below a year earlier, and building permits slipped to 1.400 million. A day earlier the NAHB housing market index dropped to 29, the lowest since June 2012.',
          },
          {
            id: 'Data lemah biasanya membantu emas, tetapi kali ini tidak cukup. Emas spot turun 0,48% ke sekitar $4.120,10 menurut Kitco, dan Rabu pagi Trading Economics mencatat emas di sekitar $4.118,90, turun 0,14%, penurunan sesi keempat beruntun. Perak justru menguat: futures ditutup $58,14, naik 1,59%, dan rasio emas-perak turun hampir 2% ke 71,11.',
            en: 'Weak data usually help gold, but not enough this time. Spot gold fell 0.48% to about $4,120.10 according to Kitco, and on Wednesday morning Trading Economics had gold near $4,118.90, down 0.14%, a fourth straight losing session. Silver instead firmed: futures closed at $58.14, up 1.59%, and the gold-silver ratio fell nearly 2% to 71.11.',
          },
        ],
      },
      {
        heading: { id: 'Minyak $111 Menjaga Kekhawatiran Inflasi', en: 'Oil at $111 Keeps Inflation Worries Alive' },
        paragraphs: [
          {
            id: 'Penekannya ada di minyak. Kitco mencatat Brent di sekitar $111,30, tertinggi sejak Mei, dan WTI sekitar $100,64. Trading Economics menyebut minyak naik setelah seorang diplomat meredam laporan kesepakatan cepat untuk mengakhiri konflik AS-Iran, sementara serangan terhadap tanker di Selat Hormuz menambah kekhawatiran pasokan.',
            en: 'The pressure comes from oil. Kitco had Brent near $111.30, its highest since May, and WTI near $100.64. Trading Economics says oil rose after a diplomat played down reports of an imminent deal to end the US-Iran conflict, while attacks on tankers in the Strait of Hormuz add to supply worries.',
          },
          {
            id: 'Minyak mahal menjaga inflasi tetap panas: CPI September naik 3,7% setahun dan PPI 6,3%. Pasar memperkirakan Fed menahan suku bunga pada 27–28 Oktober dengan peluang sekitar 83%, tetapi peluang suku bunga lebih tinggi pada 9 Desember sekitar 93,6%. Yield 10 tahun di sekitar 5,13% dan indeks dolar sekitar 101,77.',
            en: 'Expensive oil keeps inflation hot: September CPI rose 3.7% y/y and PPI 6.3%. Markets expect the Fed to hold on October 27–28 with about 83% odds, but put the chance of higher rates by December 9 at about 93.6%. The 10-year yield is near 5.13% and the dollar index near 101.77.',
          },
        ],
      },
      {
        heading: { id: 'Gambaran Besar dan Level Teknikal', en: 'The Big Picture and Technical Levels' },
        paragraphs: [
          {
            id: 'Trading Economics mencatat emas turun sekitar 5,6% sebulan tetapi masih naik sekitar 0,45% setahun. Di sekitar $4.119, emas berada sekitar 26,6% di bawah rekor Januari $5.608,35. CIBC memangkas proyeksi rata-rata kuartal IV ke $4.500 dari $6.500 dan proyeksi 2027 ke $5.200, tetapi masih melihat pemulihan ke level itu tahun depan.',
            en: 'Trading Economics shows gold down about 5.6% on the month but still up about 0.45% on the year. Near $4,119, gold sits about 26.6% below its January record of $5,608.35. CIBC cut its Q4 average forecast to $4,500 from $6,500 and its 2027 forecast to $5,200, but still sees a recovery to that level next year.',
          },
          {
            id: 'Level dari Kitco: resistance $4.141,97 dan $4.145,47, lalu $4.199,08 dan $4.217,40; support $4.073,55 dan $4.066,54, lalu $3.942,10. Agenda: pending home sales, klaim pengangguran (Kamis), PMI manufaktur dan jasa awal Oktober serta sentimen konsumen final University of Michigan (Jumat).',
            en: 'Kitco’s levels: resistance at $4,141.97 and $4,145.47, then $4,199.08 and $4,217.40; support at $4,073.55 and $4,066.54, then $3,942.10. Agenda: pending home sales, jobless claims (Thursday), preliminary October manufacturing and services PMIs and final University of Michigan consumer sentiment (Friday).',
          },
        ],
      },
      {
        heading: { id: 'Antam, Galeri24 dan UBS Kompak Turun', en: 'Antam, Galeri24 and UBS All Fall' },
        paragraphs: [
          {
            id: 'Harga Antam 1 gram turun Rp10.000 ke Rp2.554.000, penurunan hari kedua, dengan buyback turun Rp10.000 ke Rp2.369.000 per gram. Spread-nya tetap Rp185.000, sekitar 7,2%. Batangan 10 gram kini Rp25.035.000 dan 100 gram Rp249.612.000.',
            en: 'Antam’s 1-gram price fell Rp10,000 to Rp2,554,000, a second daily decline, with buyback down Rp10,000 to Rp2,369,000 per gram. The spread stays at Rp185,000, about 7.2%. The 10-gram bar now costs Rp25,035,000 and the 100-gram bar Rp249,612,000.',
          },
          {
            id: 'Galeri24 turun Rp16.000 ke Rp2.510.000 dengan buyback turun Rp17.000 ke Rp2.363.000: Rp44.000 lebih murah dari Antam dengan spread Rp147.000, sekitar 5,9%. UBS turun Rp17.000 ke Rp2.534.000 dengan buyback Rp2.338.000: Rp20.000 lebih murah dari Antam dengan spread Rp196.000, sekitar 7,7%. Buyback Antam kini kembali Rp6.000 di atas Galeri24.',
            en: 'Galeri24 fell Rp16,000 to Rp2,510,000, with buyback down Rp17,000 to Rp2,363,000: Rp44,000 cheaper than Antam with a Rp147,000 spread, about 5.9%. UBS fell Rp17,000 to Rp2,534,000 with a Rp2,338,000 buyback: Rp20,000 cheaper than Antam with a Rp196,000 spread, about 7.7%. Antam’s buyback is back Rp6,000 above Galeri24’s.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: $4.073 Jadi Garis Berikutnya', en: 'Playbook: $4,073 Is the Next Line' },
        paragraphs: [
          {
            id: 'Skenario dekat: kembali di atas $4.141,97 dan $4.145,47 membuka jalan ke $4.199,08; gagal bertahan bisa menguji $4.073,55 lalu $4.066,54. Penggeraknya tetap minyak, yield dan dolar. Di sisi struktural, CIBC mencatat bank sentral membeli 345 ton emas pada semester I 2026, dengan 289 ton di kuartal II, dan menilai emas tetap aset cadangan strategis.',
            en: 'Near-term scenarios: regaining $4,141.97 and $4,145.47 opens the way to $4,199.08; failing to hold could test $4,073.55, then $4,066.54. Oil, yields and the dollar remain the drivers. Structurally, CIBC notes that central banks bought 345 tonnes of gold in the first half of 2026, 289 tonnes of it in Q2, and sees gold as a strategic reserve asset.',
          },
          {
            id: 'Bagi investor rupiah, Antam sudah turun Rp20.000 dalam dua hari. DCA dengan nominal tetap meratakan harga beli di kedua skenario, dan perbedaan spread, dari sekitar 5,9% hingga 7,7%, layak diperhitungkan jika Anda berencana menjual kembali. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, Antam has fallen Rp20,000 in two days. Fixed-amount DCA averages the purchase price in either scenario, and the different spreads, from about 5.9% to 7.7%, are worth factoring in if you plan to sell back. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Data perumahan yang lemah tidak cukup menolong emas selama minyak di atas $110 menjaga inflasi dan peluang kenaikan Fed Desember tetap tinggi.',
      en: 'Weak housing data cannot rescue gold while oil above $110 keeps inflation, and the odds of a December Fed hike, high.',
    },
    callout: 'rates',
    image: withBase('/article-gold-fourth-decline-4119-oil-111-cibc-cut.png'),
    publishedAt: Date.parse('2026-10-21T03:10:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Kitco: Gold weaker, silver mixed as weak housing data offsets rising oil prices - Kitco AM Report', url: 'https://www.kitco.com/news/article/2026-10-20/gold-weaker-silver-mixed-weak-housing-data-offsets-rising-oil-prices-kitco' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Kitco: Gold falls for a third straight session as silver extends gains and the gold-silver ratio slips', url: 'https://www.kitco.com/opinion/2026-10-20/gold-falls-third-straight-session-silver-extends-gains-and-gold-silver-ratio' },
      { title: 'Kitco: CIBC slashes gold price forecasts but sees recovery to $5,200 in 2027 as central bank demand offsets Fed headwinds', url: 'https://www.kitco.com/news/article/2026-10-20/cibc-slashes-gold-price-forecasts-sees-recovery-5200-2027-central-bank' },
      { title: 'Kontan: Harga Emas Antam Hari Ini (21/10) Turun ke Rp 2.554.000 per Gram, Buyback Merosot', url: 'https://momsmoney.kontan.co.id/news/harga-emas-antam-hari-ini-2110-turun-ke-rp-2554000-per-gram-buyback-merosot' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-third-decline-4139-yields-december-hike',
    category: 'market',
    title: {
      id: 'Emas Turun Hari Ketiga ke $4.139; Yield 5,14% dan Peluang Kenaikan Desember 94%',
      en: 'Gold Falls a Third Day to $4,139; 5.14% Yields and 94% December Hike Odds',
    },
    excerpt: {
      id: 'Emas ditutup Senin turun 0,63% ke sekitar $4.137,80 dan bertahan di sekitar $4.139 pada Selasa pagi, menembus support $4.142. Dolar menguat, yield 10 tahun naik ke sekitar 5,14%, dan pasar memperkirakan peluang kenaikan Fed Desember sekitar 94%. Antam turun Rp10.000 ke Rp2.564.000.',
      en: 'Gold closed Monday down 0.63% near $4,137.80 and held near $4,139 on Tuesday morning, breaking $4,142 support. The dollar firmed, the 10-year yield rose to about 5.14%, and markets price about a 94% chance of a December Fed hike. Antam fell Rp10,000 to Rp2,564,000.',
    },
    sections: [
      {
        heading: { id: 'Senin: Kenaikan Pagi Hilang, Ditutup Turun 0,63%', en: 'Monday: Morning Gains Fade, a 0.63% Loss at the Close' },
        paragraphs: [
          {
            id: 'Emas sempat bertahan pada Senin pagi waktu AS. Kitco mencatat emas spot di sekitar $4.159,70, turun hanya $4,40 atau 0,11%, saat harga minyak dan yield Treasury melandai. Namun laporan sore Kitco yang dikutip Rio Times menunjukkan emas ditutup di sekitar $4.137,80, turun 0,63%, tertekan dolar yang lebih kuat dan yield yang naik.',
            en: 'Gold held up on Monday morning in the US. Kitco had spot gold near $4,159.70, down just $4.40, or 0.11%, as oil prices and Treasury yields eased. But Kitco’s evening report, cited by the Rio Times, showed gold closing near $4,137.80, down 0.63%, pressured by a firmer dollar and rising yields.',
          },
          {
            id: 'Selasa pagi tekanannya berlanjut tipis. Trading Economics mencatat emas di sekitar $4.139,17, turun 0,04%, dan menyebutnya penurunan hari ketiga beruntun dengan harga bergerak ke arah $4.100. ETF emas GLD turun 0,61% dan saham tambang GDX turun 1,41% pada Senin, sementara perak justru naik 0,12% ke sekitar $56,93.',
            en: 'On Tuesday morning the pressure continued, if only slightly. Trading Economics had gold near $4,139.17, down 0.04%, and called it a third straight daily decline, with prices moving toward $4,100. The GLD gold ETF fell 0.61% and the GDX miners ETF 1.41% on Monday, while silver bucked the move, rising 0.12% to about $56.93.',
          },
        ],
      },
      {
        heading: { id: 'Fed Jeda Oktober, tetapi Desember Makin Pasti', en: 'A Fed Pause in October, but December Looks Ever More Certain' },
        paragraphs: [
          {
            id: 'Fed diperkirakan menahan suku bunga pada rapat 27–28 Oktober: Kitco mencatat peluang kenaikan Oktober hanya sekitar 15%. Masalahnya ada di rapat berikutnya. Peluang kenaikan 25 bp pada Desember sekitar 89% menurut Kitco pada Senin pagi, dan Trading Economics kini mencatat sekitar 94%. Inflasi masih panas: CPI September naik 3,7% setahun dan PPI 6,3%.',
            en: 'The Fed is expected to hold at its October 27–28 meeting: Kitco puts the odds of an October hike at only about 15%. The problem is the next meeting. The odds of a 25 bp hike in December were about 89% according to Kitco on Monday morning, and Trading Economics now puts them at about 94%. Inflation is still hot: September CPI rose 3.7% y/y and PPI 6.3%.',
          },
          {
            id: 'Yield Treasury 10 tahun berbalik naik ke sekitar 5,14% dari sekitar 5,08% pada Senin pagi, yang saat itu dekat level terendah empat pekan. Indeks dolar di sekitar 101,9. Minyak tetap mahal: Kitco mencatat Brent sekitar $107,55 dan WTI $97,19 pada Senin pagi, dan Trading Economics menyebut harga minyak yang lebih tinggi menambah kekhawatiran inflasi.',
            en: 'The 10-year Treasury yield turned higher to about 5.14% from about 5.08% on Monday morning, when it had been near a four-week low. The dollar index is near 101.9. Oil remains expensive: Kitco had Brent near $107.55 and WTI at $97.19 on Monday morning, and Trading Economics says higher oil prices are adding to inflation worries.',
          },
        ],
      },
      {
        heading: { id: 'Gambaran Besar dan Level Teknikal', en: 'The Big Picture and Technical Levels' },
        paragraphs: [
          {
            id: 'Trading Economics mencatat emas turun sekitar 4,7% sebulan tetapi masih naik sekitar 0,4% setahun. Di sekitar $4.139, emas berada sekitar 26,2% di bawah rekor Januari $5.608,35. Selama sepekan terakhir emas tertahan di rentang $4.100–$4.200, dan kini kembali ke paruh bawahnya.',
            en: 'Trading Economics shows gold down about 4.7% on the month but still up about 0.4% on the year. Near $4,139, gold sits about 26.2% below its January record of $5,608.35. Over the past week gold has been stuck in a $4,100–$4,200 range, and it is now back in the lower half.',
          },
          {
            id: 'Level dari Kitco: emas sudah di bawah support $4.150,72 dan $4.142,03, sehingga target turun berikutnya $4.118,63 lalu $4.066,71. Resistance pertama $4.170,55, lalu $4.193,95 dan zona $4.193,95–$4.202,64. Agenda pekan ini: housing starts (Selasa), klaim pengangguran (Kamis), survei aktivitas bisnis awal dan sentimen konsumen final Oktober (Jumat).',
            en: 'Kitco’s levels: gold is already below the $4,150.72 and $4,142.03 supports, so the next downside targets are $4,118.63, then $4,066.71. First resistance is $4,170.55, then $4,193.95 and the $4,193.95–$4,202.64 zone. This week’s agenda: housing starts (Tuesday), jobless claims (Thursday), preliminary business activity surveys and final October consumer sentiment (Friday).',
          },
        ],
      },
      {
        heading: { id: 'Antam Turun Rp10.000, Galeri24 dan UBS Naik Tipis', en: 'Antam Falls Rp10,000, Galeri24 and UBS Edge Up' },
        paragraphs: [
          {
            id: 'Harga Antam 1 gram turun Rp10.000 ke Rp2.564.000, memutus kenaikan tiga hari beruntun, dengan buyback turun Rp10.000 ke Rp2.379.000 per gram. Spread-nya tetap Rp185.000, sekitar 7,2%. Batangan 10 gram kini Rp25.135.000 dan 100 gram Rp250.612.000.',
            en: 'Antam’s 1-gram price fell Rp10,000 to Rp2,564,000, ending a three-day winning streak, with buyback down Rp10,000 to Rp2,379,000 per gram. The spread stays at Rp185,000, about 7.2%. The 10-gram bar now costs Rp25,135,000 and the 100-gram bar Rp250,612,000.',
          },
          {
            id: 'Galeri24 justru naik Rp3.000 ke Rp2.526.000 dengan buyback naik Rp5.000 ke Rp2.380.000: Rp38.000 lebih murah dari Antam dengan spread Rp146.000, sekitar 5,8%. UBS naik Rp3.000 ke Rp2.551.000 dengan buyback Rp2.354.000: Rp13.000 lebih murah dari Antam dengan spread Rp197.000, sekitar 7,7%. Buyback Galeri24 kini Rp1.000 di atas Antam.',
            en: 'Galeri24 instead rose Rp3,000 to Rp2,526,000, with buyback up Rp5,000 to Rp2,380,000: Rp38,000 cheaper than Antam with a Rp146,000 spread, about 5.8%. UBS rose Rp3,000 to Rp2,551,000 with a Rp2,354,000 buyback: Rp13,000 cheaper than Antam with a Rp197,000 spread, about 7.7%. Galeri24’s buyback is now Rp1,000 above Antam’s.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: Menguji $4.100 Jelang Fed', en: 'Playbook: Testing $4,100 Ahead of the Fed' },
        paragraphs: [
          {
            id: 'Skenario dekat: kembali di atas $4.150,72 lalu $4.170,55 membuka jalan ke $4.193,95; gagal bertahan bisa menguji $4.118,63 lalu $4.066,71. Penggeraknya tetap yield, dolar dan minyak. Di sisi struktural, Kitco mencatat kepemilikan ETF emas yang dilacak Bloomberg mencapai puncak tahun ini 101,3 juta ons pada 8 Oktober dan bertahan di atas 101 juta ons sejak itu.',
            en: 'Near-term scenarios: regaining $4,150.72, then $4,170.55, opens the way to $4,193.95; failing to hold could test $4,118.63, then $4,066.71. Yields, the dollar and oil remain the drivers. Structurally, Kitco notes that Bloomberg-tracked gold ETF holdings hit a 2026 peak of 101.3 million ounces on October 8 and have stayed above 101 million ounces since.',
          },
          {
            id: 'Bagi investor rupiah, penurunan Rp10.000 sehari tidak mengubah gambaran besar. DCA dengan nominal tetap meratakan harga beli di kedua skenario, dan perbedaan spread, dari sekitar 5,8% hingga 7,7%, layak diperhitungkan jika Anda berencana menjual kembali. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, a Rp10,000 daily drop does not change the big picture. Fixed-amount DCA averages the purchase price in either scenario, and the different spreads, from about 5.8% to 7.7%, are worth factoring in if you plan to sell back. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Pasar sudah menerima jeda Fed Oktober; yang kini menekan emas adalah peluang kenaikan Desember yang mendekati pasti.',
      en: 'Markets have accepted an October Fed pause; what now weighs on gold is a December hike that looks close to certain.',
    },
    callout: 'rates',
    image: withBase('/article-gold-third-decline-4139-yields-december-hike.png'),
    publishedAt: Date.parse('2026-10-20T03:10:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Kitco: Gold slips, silver gains as oil retreats and Fed-pause expectations hold - Kitco AM Report', url: 'https://www.kitco.com/news/article/2026-10-19/gold-slips-silver-gains-oil-retreats-and-fed-pause-expectations-hold-kitco' },
      { title: 'Rio Times: Gold Fund Slips 0.61% as Silver Fund Edges Up', url: 'https://riotimesonline.com/gold-silver-precious-metals-monday-october-19-2026' },
      { title: 'Kitco: Gold and silver prices pressured by hot inflation, but gold ETF holdings buck trend to hit 2026 highs', url: 'https://www.kitco.com/news/article/2026-10-19/gold-and-silver-prices-pressured-hot-inflation-gold-etf-holdings-buck-trend' },
      { title: 'Kontan: Harga Emas Antam Hari Ini 20 Oktober 2026 Turun Rp10.000', url: 'https://finansial.kontan.co.id/news/harga-emas-antam-hari-ini-20-oktober-2026-turun-rp10000-jadi-segini-per-gram' },
      { title: 'Riau Realita: Harga Emas Antam Turun Rp10 Ribu Jadi Rp2.564.000 per Gram', url: 'https://riaurealita.com/detail/34953/harga-emas-antam-turun-rp10-ribu-jadi-rp2564000-per-gram' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-opens-week-4175-fed-pause-oil-100',
    category: 'market',
    title: {
      id: 'Emas Buka Pekan Naik Tipis ke $4.175; Peluang Jeda Fed 84%, Minyak Tetap di Atas $100',
      en: 'Gold Opens the Week Slightly Higher at $4,175; Fed Pause Odds at 84%, Oil Stays Above $100',
    },
    excerpt: {
      id: 'Emas naik 0,20% ke sekitar $4.175 pada Senin pagi setelah ditutup di $4.164 pada Jumat. Peluang Fed menahan suku bunga naik ke sekitar 84%, tetapi Brent di $109,86 menjaga kekhawatiran inflasi. Antam naik Rp2.000 ke Rp2.574.000, kenaikan hari ketiga.',
      en: 'Gold rose 0.20% to about $4,175 on Monday morning after closing at $4,164 on Friday. The odds of a Fed hold rose to about 84%, but Brent at $109.86 keeps inflation worries alive. Antam rose Rp2,000 to Rp2,574,000, a third daily gain.',
    },
    sections: [
      {
        heading: { id: 'Senin Pagi: Naik Tipis dari $4.164', en: 'Monday Morning: A Small Gain from $4,164' },
        paragraphs: [
          {
            id: 'Emas spot dibuka menguat pada awal pekan. Trading Economics mencatat sekitar $4.174,77, naik $8,38 atau 0,20% sehari, dan analisis Mitrade menyebut emas di sekitar $4.183 pada Senin pagi. Kenaikan ini melanjutkan pantulan dari zona support $4.064–$4.074 yang tersentuh pekan lalu.',
            en: 'Spot gold opened the week firmer. Trading Economics put it at about $4,174.77, up $8.38, or 0.20%, on the day, and Mitrade’s analysis had gold near $4,183 on Monday morning. The gain extends the rebound from the $4,064–$4,074 support zone touched last week.',
          },
          {
            id: 'Jumat lalu ceritanya berbeda. Emas spot sempat ke $4.199,50 lalu ditutup di $4.164,10 di New York, turun $5,70 atau 0,14%, saat aksi jual saham teknologi meluas: Nasdaq turun 2,1% hari itu dan 4,5% sepekan, terburuk sejak Juni. Kontrak emas Desember ditutup di $4.181,10, naik 0,26%.',
            en: 'Last Friday was a different story. Spot gold reached $4,199.50, then closed at $4,164.10 in New York, down $5.70, or 0.14%, as a tech selloff deepened: the Nasdaq fell 2.1% on the day and 4.5% on the week, its worst week since June. December gold futures settled at $4,181.10, up 0.26%.',
          },
        ],
      },
      {
        heading: { id: 'Fed Diperkirakan Jeda, tetapi Minyak Menahan', en: 'The Fed Is Expected to Pause, but Oil Holds Gold Back' },
        paragraphs: [
          {
            id: 'Ketua Fed Kevin Warsh tidak memberi sinyal kenaikan suku bunga Oktober. Peluang Fed menahan suku bunga pada rapat 27–28 Oktober naik ke sekitar 83% dari 72% menurut Mitrade, dan sekitar 84% menurut Trading Economics. Yield Treasury 10 tahun ditutup di 5,097%, Treasury mencatat pekan terbaik sejak pertengahan Februari, dan dolar menuju penurunan mingguan pertama dalam lima pekan.',
            en: 'Fed Chair Kevin Warsh gave no signal of an October rate hike. The odds of a Fed hold at the October 27–28 meeting rose to about 83% from 72% according to Mitrade, and about 84% according to Trading Economics. The 10-year Treasury yield closed at 5.097%, Treasuries had their best week since mid-February, and the dollar was headed for its first weekly decline in five weeks.',
          },
          {
            id: 'Penahannya tetap minyak. Brent ditutup di $109,86 dan WTI Desember naik 2,61% ke $99,02, sementara kontrak terdekat WTI menembus $100 untuk pertama kali sejak September, karena serangan terhadap kapal di sekitar Selat Hormuz meningkat. Harga impor AS September naik 8,1% setahun, terbesar sejak Juli 2022. Minyak mahal memperkuat alasan Fed tetap ketat, dan pasar masih condong ke pengetatan lanjutan pada Desember.',
            en: 'Oil is still the brake. Brent settled at $109.86 and December WTI rose 2.61% to $99.02, while front-month WTI broke above $100 for the first time since September as attacks on shipping around the Strait of Hormuz intensified. US import prices rose 8.1% y/y in September, the most since July 2022. Expensive oil strengthens the case for a restrictive Fed, and markets still lean toward further tightening in December.',
          },
        ],
      },
      {
        heading: { id: 'Gambaran Besar dan Level Teknikal', en: 'The Big Picture and Technical Levels' },
        paragraphs: [
          {
            id: 'Trading Economics mencatat emas turun sekitar 3,9% sebulan dan sekitar 4,2% setahun. Di sekitar $4.175, emas berada sekitar 25,6% di bawah rekor Januari $5.608,35. Pekan lalu rentangnya lebar, dari terendah $4.073,35 pada Rabu hingga mendekati $4.200 pada Jumat.',
            en: 'Trading Economics shows gold down about 3.9% on the month and about 4.2% on the year. Near $4,175, gold sits about 25.6% below its January record of $5,608.35. Last week’s range was wide, from a $4,073.35 low on Wednesday to near $4,200 on Friday.',
          },
          {
            id: 'Level dari Mitrade: resistance pertama $4.185–$4.195, lalu $4.215–$4.227 dan $4.276–$4.289. Support pertama $4.141–$4.150, lalu $4.104–$4.113 dan $4.064–$4.074. Agenda pekan ini: housing starts (Selasa), klaim pengangguran (Kamis), PMI flash Oktober (Jumat), lalu rapat Fed 27–28 Oktober.',
            en: 'Mitrade’s levels: first resistance at $4,185–$4,195, then $4,215–$4,227 and $4,276–$4,289. First support at $4,141–$4,150, then $4,104–$4,113 and $4,064–$4,074. This week’s agenda: housing starts (Tuesday), jobless claims (Thursday), October flash PMIs (Friday), then the October 27–28 Fed meeting.',
          },
        ],
      },
      {
        heading: { id: 'Antam Naik Hari Ketiga, Galeri24 dan UBS Tetap', en: 'Antam Rises a Third Day, Galeri24 and UBS Hold' },
        paragraphs: [
          {
            id: 'Harga Antam 1 gram naik Rp2.000 ke Rp2.574.000, kenaikan hari ketiga beruntun, dengan buyback naik Rp2.000 ke Rp2.389.000 per gram. Spread-nya tetap Rp185.000, sekitar 7,2%. Batangan 10 gram kini Rp25.235.000 dan 100 gram Rp251.612.000.',
            en: 'Antam’s 1-gram price rose Rp2,000 to Rp2,574,000, a third straight daily gain, with buyback up Rp2,000 to Rp2,389,000 per gram. The spread stays at Rp185,000, about 7.2%. The 10-gram bar now costs Rp25,235,000 and the 100-gram bar Rp251,612,000.',
          },
          {
            id: 'Galeri24 tetap di Rp2.523.000 dengan buyback Rp2.375.000: Rp51.000 lebih murah dari Antam dengan spread Rp148.000, sekitar 5,9%. UBS tetap di Rp2.548.000 dengan buyback Rp2.349.000: Rp26.000 lebih murah dari Antam dengan spread Rp199.000, sekitar 7,8%. Buyback Antam kini Rp14.000 di atas Galeri24 dan Rp40.000 di atas UBS.',
            en: 'Galeri24 held at Rp2,523,000 with a Rp2,375,000 buyback: Rp51,000 cheaper than Antam with a Rp148,000 spread, about 5.9%. UBS held at Rp2,548,000 with a Rp2,349,000 buyback: Rp26,000 cheaper than Antam with a Rp199,000 spread, about 7.8%. Antam’s buyback is now Rp14,000 above Galeri24’s and Rp40,000 above UBS’s.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: Menunggu Fed di Bawah $4.200', en: 'Playbook: Waiting for the Fed Below $4,200' },
        paragraphs: [
          {
            id: 'Skenario dekat: menembus $4.195 lalu $4.227 membuka jalan kembali ke atas $4.200; gagal di $4.141 bisa menguji $4.104 lalu $4.064. Penggeraknya jelas: harga minyak dan arah yield menjelang rapat Fed. Peluang jeda yang tinggi membantu, tetapi minyak di atas $100 membuat pengetatan Desember tetap terbuka.',
            en: 'Near-term scenarios: breaking $4,195, then $4,227, opens the way back above $4,200; losing $4,141 could test $4,104, then $4,064. The drivers are clear: oil prices and the direction of yields ahead of the Fed meeting. High pause odds help, but oil above $100 keeps a December tightening on the table.',
          },
          {
            id: 'Bagi investor rupiah, kenaikan Rp2.000 sehari tidak mengubah gambaran besar. DCA dengan nominal tetap meratakan harga beli di kedua skenario, dan spread yang berbeda, dari sekitar 5,9% hingga 7,8%, layak diperhitungkan jika Anda berencana menjual kembali. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, a Rp2,000 daily gain does not change the big picture. Fixed-amount DCA averages the purchase price in either scenario, and the different spreads, from about 5.9% to 7.8%, are worth factoring in if you plan to sell back. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Pasar yakin Fed akan jeda Oktober, tetapi minyak di atas $100 membuat emas tetap tertahan di bawah $4.200.',
      en: 'Markets are confident the Fed will pause in October, but oil above $100 keeps gold capped below $4,200.',
    },
    callout: 'rates',
    image: withBase('/article-gold-opens-week-4175-fed-pause-oil-100.png'),
    publishedAt: Date.parse('2026-10-19T03:10:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Guardian Gold: Overnight Summary - Precious Metals Prices 19/10/2026', url: 'https://guardian-gold.com.au/market-updates/overnight-summary-precious-metals-prices-19-10-2026/' },
      { title: 'Mitrade: Gold price analysis today - Fed pause odds and crude rally', url: 'https://www.mitrade.com/insights/commodity-analysis/gold/gold-fed-pause-odds-crude-rally' },
      { title: 'Kitco: Wall Street undecided on gold’s near-term trajectory, Main Street flirts with bearish bias after gold hits $4,200/oz ceiling', url: 'https://www.kitco.com/news/article/2026-10-16/wall-street-undecided-golds-near-term-trajectory-main-street-flirts-bearish' },
      { title: 'Suara.com: Harga Emas Antam Naik Tipis Jadi Rp2.574.000/Gram', url: 'https://www.suara.com/bisnis/2026/10/19/094121/harga-emas-antam-naik-tipis-jadi-rp2574000gram' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-weekly-survey-neutral-4165',
    category: 'market',
    title: {
      id: 'Emas Turun 0,58% Sepekan ke $4.165; Survei Kitco: Wall Street Netral, Main Street Condong Bearish',
      en: 'Gold Slips 0.58% on the Week to $4,165; Kitco Survey: Wall Street Neutral, Main Street Leans Bearish',
    },
    excerpt: {
      id: 'Emas mengakhiri pekan volatil di sekitar $4.165 setelah jatuh ke $4.073 karena CPI panas lalu gagal menembus $4.200. Separuh analis Wall Street kini netral, sementara Main Street sedikit condong bearish. Galeri24 dan UBS naik pada Minggu, Antam bertahan di Rp2.572.000.',
      en: 'Gold ended a volatile week near $4,165 after falling to $4,073 on hot CPI and then failing to break $4,200. Half of Wall Street analysts are now neutral, while Main Street leans slightly bearish. Galeri24 and UBS rose on Sunday, while Antam held at Rp2,572,000.',
    },
    sections: [
      {
        heading: { id: 'Pekan Ini: Dari $4.217 ke $4.073, Lalu Kembali', en: 'This Week: From $4,217 to $4,073, Then Back' },
        paragraphs: [
          {
            id: 'Emas spot membuka pekan di $4.193,59 pada Minggu malam dan naik ke puncak mingguan $4.216,91 pada Senin. Lalu CPI September naik 3,7% yoy, di atas perkiraan, disusul PPI yang juga lebih panas. Emas jatuh ke terendah mingguan $4.073,35 pada Rabu siang.',
            en: 'Spot gold opened the week at $4,193.59 on Sunday evening and rose to a weekly high of $4,216.91 on Monday. Then September CPI rose 3.7% y/y, above expectations, followed by a hotter-than-expected PPI. Gold fell to a weekly low of $4,073.35 at midday Wednesday.',
          },
          {
            id: 'Pemulihannya cepat, tetapi tidak cukup. Menurut Kitco, emas terakhir diperdagangkan di sekitar $4.165,42, turun 0,58% sepekan dan 0,13% pada Jumat. Trading Economics mencatat $4.166,39, turun 0,11% sehari. Di kedua kasus, $4.200 kembali menjadi atap.',
            en: 'The recovery was quick, but not enough. According to Kitco, gold last traded near $4,165.42, down 0.58% on the week and 0.13% on Friday. Trading Economics put it at $4,166.39, down 0.11% on the day. Either way, $4,200 again acted as a ceiling.',
          },
        ],
      },
      {
        heading: { id: 'Survei Kitco: Analis Terbelah, Ritel Ragu', en: 'Kitco Survey: Analysts Split, Retail Doubtful' },
        paragraphs: [
          {
            id: 'Dari 12 analis Wall Street, 6 (50%) memperkirakan emas bergerak datar pekan depan, 4 (33%) memperkirakan naik dan 2 (17%) turun. Di Main Street, dari 139 responden, 63 (45%) bearish, 60 (43%) bullish dan 16 (12%) memperkirakan konsolidasi. Selisih tiga suara itu menunjukkan ritel nyaris terbelah dua.',
            en: 'Of 12 Wall Street analysts, 6 (50%) expect gold to trade sideways next week, 4 (33%) expect it to rise and 2 (17%) expect a fall. On Main Street, of 139 respondents, 63 (45%) are bearish, 60 (43%) bullish and 16 (12%) expect consolidation. The three-vote gap shows retail is split almost evenly.',
          },
          {
            id: 'Pandangannya beragam. Stanley dari Forex.com melihat kenaikan selama $4.000 bertahan, dan Kuptsikevich dari FxPro melihat peluang ke $4.400–$4.500 sebelum pemilu sela. Sebaliknya, Razaqzada dari StoneX Bullion sedikit bearish sampai resistance tembus, dan Massabni dari XS.com bearish karena konflik Timur Tengah belum ada jalan keluarnya.',
            en: 'Views vary. Stanley of Forex.com sees upside as long as $4,000 holds, and Kuptsikevich of FxPro sees room toward $4,400–$4,500 before the midterms. On the other side, Razaqzada of StoneX Bullion is modestly bearish until resistance breaks, and Massabni of XS.com is bearish because the Middle East conflict has no resolution in sight.',
          },
        ],
      },
      {
        heading: { id: 'Yield, Dolar dan Fed', en: 'Yields, the Dollar and the Fed' },
        paragraphs: [
          {
            id: 'Yield Treasury 10 tahun sempat ke 5,299%, tepat di bawah puncak sebelumnya di sekitar 5,32%, lalu turun tajam pada Kamis. Dolar menguat di awal pekan, tetapi melemah pada Kamis dan Jumat, pelemahan pertama dalam lima pekan. Bagi emas, keduanya membantu meredam tekanan setelah CPI.',
            en: 'The 10-year Treasury yield peaked at 5.299%, just below its prior high of about 5.32%, then fell sharply on Thursday. The dollar strengthened early in the week but weakened on Thursday and Friday, the first time it weakened in five weeks. For gold, both helped ease the pressure after CPI.',
          },
          {
            id: 'Namun ekspektasi pengetatan belum hilang. Ketua Fed Kevin Warsh tidak memberi sinyal kenaikan Oktober, tetapi kurva suku bunga masih memperhitungkan kenaikan sekitar 70 bps, dan Trading Economics mencatat peluang kenaikan Desember sekitar 92%. Pavilonis menilai emas diuntungkan jika yield 10 tahun turun di bawah 5%, tetapi bisa jatuh ke setidaknya $3.500 jika yield naik ke 8%.',
            en: 'Tightening expectations have not gone away, though. Fed Chair Kevin Warsh did not signal an October hike, but the rate curve still prices about 70 bps of hikes, and Trading Economics puts the odds of a December hike at about 92%. Pavilonis says gold would benefit if the 10-year yield falls below 5%, but could drop to at least $3,500 if yields rise to 8%.',
          },
        ],
      },
      {
        heading: { id: 'Gambaran Besar dan Agenda Pekan Depan', en: 'The Big Picture and Next Week’s Agenda' },
        paragraphs: [
          {
            id: 'Emas turun sekitar 4% dalam sebulan dan berada sekitar 25,7% di bawah rekor $5.608,35 pada Januari. Level yang disebut analis: support $4.154 dan resistance $4.179, lalu support yang lebih dalam di dekat $4.100. Di atas, puncak mingguan $4.216,91 menjadi ujian berikutnya; di bawah, terendah $4.073,35.',
            en: 'Gold is down about 4% on the month and sits about 25.7% below the $5,608.35 record set in January. Levels analysts cite: support at $4,154 and resistance at $4,179, then deeper support near $4,100. Above, the weekly high of $4,216.91 is the next test; below, the $4,073.35 low.',
          },
          {
            id: 'Kalender pekan depan relatif sepi: housing starts, izin bangunan dan pending home sales September (Selasa), klaim pengangguran mingguan (Kamis), lalu PMI flash S&P Global dan sentimen konsumen final Oktober dari University of Michigan (Jumat). Sesudahnya, fokus beralih ke rapat Fed 27–28 Oktober.',
            en: 'Next week’s calendar is light: September housing starts, building permits and pending home sales (Tuesday), weekly jobless claims (Thursday), then the S&P Global flash PMIs and the University of Michigan’s final October consumer sentiment (Friday). After that, focus shifts to the October 27–28 Fed meeting.',
          },
        ],
      },
      {
        heading: { id: 'Antam dan Brand Lain Hari Minggu', en: 'Antam and Other Brands on Sunday' },
        paragraphs: [
          {
            id: 'Harga Antam terakhir yang terkonfirmasi tetap Rp2.572.000 per gram dengan buyback Rp2.387.000, sehingga spread Rp185.000 atau sekitar 7,2%. Belum ada pembaruan Logam Mulia yang terkonfirmasi untuk Minggu, jadi angka ini masih harga Sabtu.',
            en: 'Antam’s latest confirmed price stays at Rp2,572,000 per gram with a Rp2,387,000 buyback, a Rp185,000 spread, or about 7.2%. There is no confirmed Logam Mulia update for Sunday yet, so this is still Saturday’s price.',
          },
          {
            id: 'Galeri24 naik Rp6.000 ke Rp2.523.000 dengan buyback Rp2.375.000: Rp49.000 lebih murah dari Antam dengan spread Rp148.000, sekitar 5,9%. UBS naik Rp7.000 ke Rp2.548.000 dengan buyback Rp2.349.000: Rp24.000 lebih murah dari Antam dengan spread Rp199.000, sekitar 7,8%. Buyback Galeri24 kini hanya Rp12.000 di bawah Antam.',
            en: 'Galeri24 rose Rp6,000 to Rp2,523,000 with a Rp2,375,000 buyback: Rp49,000 cheaper than Antam with a Rp148,000 spread, about 5.9%. UBS rose Rp7,000 to Rp2,548,000 with a Rp2,349,000 buyback: Rp24,000 cheaper than Antam with a Rp199,000 spread, about 7.8%. Galeri24’s buyback is now only Rp12,000 below Antam’s.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: Pekan Sepi, Arah Belum Jelas', en: 'Playbook: A Quiet Week, No Clear Direction' },
        paragraphs: [
          {
            id: 'Survei yang terbelah cocok dengan grafiknya: emas terjebak antara $4.073 dan $4.217. Skenario dekat: menembus $4.179 lalu $4.217 membuka jalan kembali ke atas $4.200; gagal di $4.154 bisa menguji $4.100 lalu $4.073. Secara struktural, Trading Economics mencatat cadangan emas China naik ke 2.346,43 ton per Juni 2026 dari 2.313,46 ton.',
            en: 'The split survey matches the chart: gold is trapped between $4,073 and $4,217. Near-term scenarios: breaking $4,179, then $4,217, opens the way back above $4,200; losing $4,154 could test $4,100, then $4,073. Structurally, Trading Economics shows China’s gold reserves rising to 2,346.43 tonnes as of June 2026 from 2,313.46 tonnes.',
          },
          {
            id: 'Bagi investor rupiah, pekan dengan data sepi bukan alasan untuk menebak arah. DCA dengan nominal tetap meratakan harga beli di kedua skenario, dan perbedaan spread antarbrand, dari sekitar 5,9% hingga 7,8%, layak diperhitungkan jika Anda berencana menjual kembali. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, a quiet data week is no reason to guess the direction. Fixed-amount DCA averages the purchase price in either scenario, and the difference in spreads across brands, from about 5.9% to 7.8%, is worth factoring in if you plan to sell back. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Separuh analis Wall Street netral, dan Main Street terbelah hanya tiga suara: emas menunggu katalis berikutnya.',
      en: 'Half of Wall Street analysts are neutral, and Main Street is split by just three votes: gold is waiting for its next catalyst.',
    },
    callout: 'rates',
    image: withBase('/article-gold-weekly-survey-neutral-4165.png'),
    publishedAt: Date.parse('2026-10-18T02:55:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Kitco: Wall Street undecided on gold’s near-term trajectory, Main Street flirts with bearish bias after gold hits $4,200/oz ceiling', url: 'https://www.kitco.com/news/article/2026-10-16/wall-street-undecided-golds-near-term-trajectory-main-street-flirts-bearish' },
      { title: 'Kitco: Gold, silver diverge as Fed-pause expectations collide with rising crude prices - Kitco PM Report', url: 'https://www.kitco.com/news/article/2026-10-16/gold-silver-diverge-fed-pause-expectations-collide-rising-crude-prices' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Industry.co.id: Harga Emas Hari Ini 18 Oktober 2026: Antam, UBS, dan Galeri 24 Lengkap', url: 'https://www.industry.co.id/read/157568/harga-emas-hari-ini-18-oktober-2026-antam-ubs-dan-galeri-24-lengkap' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-flat-4168-warsh-neutral-oil-110',
    category: 'macro',
    title: {
      id: 'Emas Datar di $4.168 Usai Warsh Netral, Brent Dekati $110; Antam Naik ke Rp2.572.000',
      en: 'Gold Flat at $4,168 After a Neutral Warsh as Brent Nears $110; Antam Rises to Rp2,572,000',
    },
    excerpt: {
      id: 'Emas sempat mendekati $4.200 setelah Ketua Fed Kevin Warsh menolak memberi sinyal kebijakan, tetapi ditutup nyaris datar di sekitar $4.167,90 karena yield pulih dan minyak melonjak. Antam naik Rp7.000 ke Rp2.572.000, kenaikan hari kedua.',
      en: 'Gold neared $4,200 after Fed Chair Kevin Warsh declined to signal policy, but settled nearly flat around $4,167.90 as yields recovered and oil jumped. Antam rose Rp7,000 to Rp2,572,000, a second daily gain.',
    },
    sections: [
      {
        heading: { id: 'Jumat: Mendekati $4.200, Lalu Kembali', en: 'Friday: Near $4,200, Then Back' },
        paragraphs: [
          {
            id: 'Di sesi Asia, emas spot naik ke sekitar $4.178,50 dari sekitar $4.148 pada Kamis sore, dengan puncak harian sekitar $4.186. Pemicunya Ketua Fed Kevin Warsh. Dalam diskusi bersama Direktur Pelaksana IMF Kristalina Georgieva di Bangkok, ia berkata, "Saya tidak percaya pada pre-judging rapat," dan tidak memberi petunjuk soal suku bunga.',
            en: 'In the Asian session, spot gold rose to about $4,178.50 from about $4,148 on Thursday afternoon, with a daily high near $4,186. The trigger was Fed Chair Kevin Warsh. In a fireside chat with IMF Managing Director Kristalina Georgieva in Bangkok, he said, "I don’t believe in pre-judging meetings," and gave no hint on rates.',
          },
          {
            id: 'Kenaikan itu tidak bertahan. Pada akhir sesi AS, Kitco mencatat spot di sekitar $4.167,90, turun $1,90 atau 0,05%. Perak turun 0,78% ke sekitar $56,85. Emas gagal menembus zona $4.185–$4.201, yang menjadi target berikutnya bagi pembeli.',
            en: 'The gain did not hold. By the end of the US session, Kitco put spot near $4,167.90, down $1.90, or 0.05%. Silver fell 0.78% to about $56.85. Gold failed to break the $4,185–$4,201 zone, which is buyers’ next target.',
          },
        ],
      },
      {
        heading: { id: 'Peluang Jeda Naik, Tetapi Minyak Menahan', en: 'Pause Odds Rise, but Oil Holds Gold Back' },
        paragraphs: [
          {
            id: 'Sikap netral Warsh menurunkan taruhan kenaikan Oktober. Peluang Fed menahan suku bunga pada rapat 27–28 Oktober naik ke sekitar 83% dari sekitar 72% pada Kamis. Namun pasar masih melihat peluang tinggi kenaikan pada Desember, dan suku bunga saat ini berada di 3,75–4,00%.',
            en: 'Warsh’s neutral stance lowered October hike bets. The odds of a Fed hold at the October 27–28 meeting rose to about 83% from about 72% on Thursday. But markets still see a high chance of a December hike, and the policy rate currently sits at 3.75–4.00%.',
          },
          {
            id: 'Penahannya adalah minyak dan yield. Brent ditutup di $109,86 dan WTI naik ke sekitar $101,41, di atas $100 untuk pertama kali sejak September, setelah Iran memberi sinyal serangan lanjutan menyusul blokade AS atas pelabuhannya. Yield Treasury 10 tahun pulih ke sekitar 5,12% dari terendah beberapa pekan pada Kamis. Harga impor September naik 1,1% sebulan dan 8,1% setahun, terbesar sejak Juli 2022, sementara produksi industri naik 0,7%, di atas perkiraan.',
            en: 'The drag was oil and yields. Brent settled at $109.86 and WTI rose to about $101.41, above $100 for the first time since September, after Iran signaled further strikes following a US blockade of its ports. The 10-year Treasury yield recovered to about 5.12% from Thursday’s multi-week low. September import prices rose 1.1% on the month and 8.1% on the year, the largest since July 2022, while industrial production rose 0.7%, above expectations.',
          },
        ],
      },
      {
        heading: { id: 'Gambaran Besar dan Peta Level', en: 'The Big Picture and the Level Map' },
        paragraphs: [
          {
            id: 'Pekan ini emas sempat jatuh ke sekitar $4.073 setelah CPI panas, lalu bangkit lebih dari $90. Meski begitu, emas masih turun sekitar 4% dalam sebulan dan berada sekitar $1.440 atau 26% di bawah rekor $5.608 pada Januari. Nasdaq turun 2,1% pada Jumat dan 4,5% sepekan, tetapi aksi jual saham kali ini tidak lagi mengangkat emas.',
            en: 'This week gold fell to about $4,073 after the hot CPI, then bounced more than $90. Even so, gold is still down about 4% on the month and sits about $1,440, or 26%, below the $5,608 record set in January. The Nasdaq fell 2.1% on Friday and 4.5% on the week, but this time the stock selloff did not lift gold.',
          },
          {
            id: 'Kitco menandai resistance di $4.176, lalu zona $4.185–$4.201, dengan target $4.218 dan $4.240 jika tembus. Support ada di $4.148, $4.132 dan $4.111. Pekan depan: housing starts September (Selasa), klaim pengangguran mingguan (Kamis) dan sentimen konsumen final Oktober (Jumat), lalu keputusan Fed 27–28 Oktober dan PCE September pada 29 Oktober.',
            en: 'Kitco marks resistance at $4,176, then the $4,185–$4,201 zone, with targets of $4,218 and $4,240 on a break. Support sits at $4,148, $4,132 and $4,111. Next week: September housing starts (Tuesday), weekly jobless claims (Thursday) and final October consumer sentiment (Friday), then the Fed decision on October 27–28 and September PCE on October 29.',
          },
        ],
      },
      {
        heading: { id: 'Antam dan Brand Lain Hari Ini', en: 'Antam and Other Brands Today' },
        paragraphs: [
          {
            id: 'Antam 1 gram naik Rp7.000 ke Rp2.572.000, kenaikan hari kedua setelah naik Rp4.000 pada Jumat. Buyback naik Rp12.000 ke Rp2.387.000, sehingga spread menyempit ke Rp185.000, sekitar 7,2% dari harga jual. Dibanding Rabu di Rp2.574.000, harga jual kini hanya Rp2.000 lebih rendah.',
            en: 'Antam’s 1-gram bar rose Rp7,000 to Rp2,572,000, a second daily gain after a Rp4,000 rise on Friday. Buyback rose Rp12,000 to Rp2,387,000, narrowing the spread to Rp185,000, about 7.2% of the selling price. Compared with Wednesday’s Rp2,574,000, the selling price is now just Rp2,000 lower.',
          },
          {
            id: 'Galeri24 naik Rp8.000 ke Rp2.517.000 dengan buyback Rp2.369.000: Rp55.000 lebih murah dari Antam dengan spread Rp148.000, sekitar 5,9%. UBS naik Rp8.000 ke Rp2.541.000 dengan buyback Rp2.343.000: Rp31.000 lebih murah dari Antam dengan spread Rp198.000, sekitar 7,8%. Buyback Galeri24 hanya Rp18.000 di bawah Antam, sehingga Galeri24 tetap yang paling efisien untuk beli lalu jual kembali.',
            en: 'Galeri24 rose Rp8,000 to Rp2,517,000 with a Rp2,369,000 buyback: Rp55,000 cheaper than Antam with a Rp148,000 spread, about 5.9%. UBS rose Rp8,000 to Rp2,541,000 with a Rp2,343,000 buyback: Rp31,000 cheaper than Antam with a Rp198,000 spread, about 7.8%. Galeri24’s buyback is only Rp18,000 below Antam’s, so Galeri24 remains the most efficient for a buy-then-sell round trip.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: Menunggu Arah dari Fed dan Minyak', en: 'Playbook: Waiting for Direction from the Fed and Oil' },
        paragraphs: [
          {
            id: 'Emas kini terjepit dua kekuatan. Peluang jeda Fed di Oktober mendukung, tetapi minyak di dekat $110 menjaga inflasi dan yield tetap tinggi, sehingga kenaikan Desember masih terbuka. Skenario dekat: bertahan di atas $4.201 membuka $4.218 lalu $4.240; gagal di $4.148 bisa menguji $4.132 lalu $4.111.',
            en: 'Gold is now squeezed between two forces. Fed pause odds for October are supportive, but oil near $110 keeps inflation and yields high, so a December hike remains on the table. Near-term scenarios: holding above $4,201 opens $4,218, then $4,240; losing $4,148 could test $4,132, then $4,111.',
          },
          {
            id: 'Bagi investor rupiah, Antam yang bergerak beberapa ribu rupiah sehari memberi ruang untuk tetap disiplin. DCA dengan nominal tetap meratakan harga beli di kedua skenario, dan selisih spread antarbrand hingga Rp50.000 layak diperhitungkan jika Anda berencana menjual kembali. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, an Antam price that moves a few thousand rupiah a day leaves room to stay disciplined. Fixed-amount DCA averages the purchase price in either scenario, and the gap in spreads across brands, up to Rp50,000, is worth factoring in if you plan to sell back. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Warsh membuka ruang jeda di Oktober, tetapi minyak di dekat $110 membuat emas belum bisa menembus $4.200.',
      en: 'Warsh left room for an October pause, but oil near $110 kept gold from breaking $4,200.',
    },
    callout: 'rates',
    image: withBase('/article-gold-flat-4168-warsh-neutral-oil-110.png'),
    publishedAt: Date.parse('2026-10-17T02:55:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Kitco: Gold, silver diverge as Fed-pause expectations collide with rising crude prices - Kitco PM Report', url: 'https://www.kitco.com/news/article/2026-10-16/gold-silver-diverge-fed-pause-expectations-collide-rising-crude-prices' },
      { title: 'FinanceFeeds: Gold Price $4,178: Warsh Won’t Pre-Judge, $4,200 in Sight', url: 'https://financefeeds.com/gold-price-4178-warsh-bangkok-fed-hike-odds-bull-4330-bear-4000/' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Periskop.id: Harga Emas Antam Hari Ini Naik Rp7.000 Jadi Rp2,572 Juta per Gram', url: 'https://periskop.id/investasi/20261017/harga-emas-antam-naik-rp2-572-juta-per-gram-2' },
      { title: 'kumparan: Harga Emas Antam Naik Rp 7.000 ke Rp 2,57 Juta/Gram, Galeri24 Jadi Rp 2,51 Juta', url: 'https://kumparan.com/kumparanbisnis/harga-emas-antam-naik-rp-7-000-ke-rp-2-57-juta-gram-galeri24-jadi-rp-2-51-juta-28OJSQtT79S' },
      { title: 'Ngopibareng: Harga Emas Sabtu 17 Oktober 2026: Antam, Galeri24 dan UBS Kompak Naik', url: 'https://www.ngopibareng.id/read/harga-emas-sabtu-17-oktober-2026-antam-galeri24-dan-ubs-kompak-naik-cek-tabel-terbaru' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-rebounds-4171-hot-ppi-safe-haven',
    category: 'macro',
    title: {
      id: 'Emas Bangkit ke $4.171 Meski CPI dan PPI Panas; Antam Naik Tipis ke Rp2.565.000',
      en: 'Gold Rebounds to $4,171 Despite Hot CPI and PPI; Antam Edges Up to Rp2,565,000',
    },
    excerpt: {
      id: 'CPI September yang panas sempat menjatuhkan emas ke terendah sepekan pada Rabu, tetapi pada Kamis spot ditutup naik 1,59% di $4.171 karena yield dan dolar mundur di tengah aksi jual saham global. Antam turun Rp13.000 lalu naik Rp4.000 ke Rp2.565.000.',
      en: 'A hot September CPI briefly knocked gold to a one-week low on Wednesday, but on Thursday spot settled up 1.59% at $4,171 as yields and the dollar retreated amid a global equity selloff. Antam fell Rp13,000, then rose Rp4,000 to Rp2,565,000.',
    },
    sections: [
      {
        heading: { id: 'Dua Hari, Dua Arah', en: 'Two Days, Two Directions' },
        paragraphs: [
          {
            id: 'Rabu malam, CPI September AS keluar lebih panas dari perkiraan: inflasi tahunan 3,7% dibanding perkiraan 3,6%, dan inflasi inti naik 0,3% sebulan, di atas perkiraan 0,2%. Kontrak emas Desember turun sekitar $69, dari $4.177,30 ke $4.107,90, dan spot jatuh ke level terendah sepekan.',
            en: 'On Wednesday night, the US September CPI came in hotter than expected: annual inflation of 3.7% versus a 3.6% forecast, and core inflation up 0.3% on the month, above the 0.2% forecast. December gold futures fell about $69, from $4,177.30 to $4,107.90, and spot dropped to a one-week low.',
          },
          {
            id: 'Kamis justru berbalik. PPI September melonjak 1,3% sebulan dan 6,3% setahun, jauh di atas perkiraan 5,5% dan kenaikan tahunan terbesar sejak Desember 2022. Namun emas tetap naik. Spot ditutup menguat 1,59% di $4.171 dan kontrak Desember naik 1,5% ke $4.170, menghapus seluruh penurunan Rabu.',
            en: 'Thursday turned the other way. September PPI jumped 1.3% on the month and 6.3% on the year, far above the 5.5% forecast and the largest annual gain since December 2022. Yet gold still rose. Spot settled up 1.59% at $4,171 and December futures rose 1.5% to $4,170, erasing all of Wednesday’s drop.',
          },
        ],
      },
      {
        heading: { id: 'Mengapa Data Panas Tidak Menjatuhkan Emas', en: 'Why Hot Data Did Not Sink Gold' },
        paragraphs: [
          {
            id: 'Kuncinya ada di yield dan dolar. Yield Treasury 10 tahun turun ke sekitar 5,08%, terendah dalam sekitar tiga pekan, dan indeks dolar mundur ke sekitar 102,1 dari puncak 18 bulan pada Rabu. Aksi jual saham global ikut mendorong dana ke aset aman: Kospi Korea Selatan anjlok 7,6% dan Nikkei Jepang 4,9%.',
            en: 'The key was yields and the dollar. The 10-year Treasury yield fell to about 5.08%, its lowest in about three weeks, and the dollar index eased to about 102.1 from Wednesday’s 18-month high. A global equity selloff also pushed money into safe havens: South Korea’s Kospi plunged 7.6% and Japan’s Nikkei 4.9%.',
          },
          {
            id: 'Lonjakan PPI sebagian besar berasal dari energi, yang naik 10,8% dan menyumbang lebih dari 80% kenaikan bulanan, sehingga emas kembali dilirik sebagai lindung nilai inflasi. Penjualan ritel naik 0,8%, tetapi kelompok kontrol hanya naik 0,1%, tanda belanja di luar BBM melemah. Pasar memberi peluang sekitar 29–32% kenaikan suku bunga pada rapat 27–28 Oktober dan sekitar 90% hingga Desember.',
            en: 'Most of the PPI jump came from energy, which rose 10.8% and accounted for more than 80% of the monthly gain, so gold drew interest again as an inflation hedge. Retail sales rose 0.8%, but the control group rose just 0.1%, a sign of weaker spending outside fuel. Markets price about a 29–32% chance of a rate hike at the October 27–28 meeting and about 90% by December.',
          },
        ],
      },
      {
        heading: { id: 'Gambaran Besar dan Peta Level', en: 'The Big Picture and the Level Map' },
        paragraphs: [
          {
            id: 'Rebound ini belum mengubah gambaran besar. Emas masih turun sekitar 4% dalam sebulan dan berada sekitar $1.437 atau 26% di bawah rekor $5.608 pada Januari. Brent bertahan di sekitar $104, sehingga tekanan inflasi dari energi belum reda dan peluang kenaikan suku bunga tetap tinggi.',
            en: 'This rebound has not changed the big picture. Gold is still down about 4% on the month and sits about $1,437, or 26%, below the $5,608 record set in January. Brent held near $104, so energy-driven inflation pressure has not eased and rate-hike odds remain high.',
          },
          {
            id: 'Kitco menandai resistance di $4.181, lalu $4.217 dan $4.267. Support ada di $4.128 dan $4.107, lalu $4.088, dengan zona $4.000–$4.075 sebagai lantai yang lebih dalam. Jumat ini pasar menyimak pidato Ketua Fed Kevin Warsh dan data produksi industri AS September.',
            en: 'Kitco marks resistance at $4,181, then $4,217 and $4,267. Support sits at $4,128 and $4,107, then $4,088, with the $4,000–$4,075 zone as a deeper floor. On Friday the market watches a speech by Fed Chair Kevin Warsh and US September industrial production data.',
          },
        ],
      },
      {
        heading: { id: 'Antam dan Brand Lain Hari Ini', en: 'Antam and Other Brands Today' },
        paragraphs: [
          {
            id: 'Antam 1 gram turun Rp13.000 ke Rp2.561.000 pada Kamis, lalu naik Rp4.000 ke Rp2.565.000 pada Jumat. Buyback naik Rp5.000 ke Rp2.375.000, sehingga spread menjadi Rp190.000, sekitar 7,4% dari harga jual. Dibanding Rabu di Rp2.574.000, harga jual masih Rp9.000 lebih rendah.',
            en: 'Antam’s 1-gram bar fell Rp13,000 to Rp2,561,000 on Thursday, then rose Rp4,000 to Rp2,565,000 on Friday. Buyback rose Rp5,000 to Rp2,375,000, leaving a Rp190,000 spread, about 7.4% of the selling price. Compared with Wednesday’s Rp2,574,000, the selling price is still Rp9,000 lower.',
          },
          {
            id: 'Galeri24 di Rp2.509.000 dengan buyback Rp2.362.000: Rp56.000 lebih murah dari Antam dengan spread Rp147.000, sekitar 5,9%. UBS di Rp2.533.000 dengan buyback Rp2.337.000: Rp32.000 lebih murah dari Antam dengan spread Rp196.000, sekitar 7,7%. Buyback Galeri24 hanya Rp13.000 di bawah Antam, sehingga Galeri24 tetap yang paling efisien untuk beli lalu jual kembali.',
            en: 'Galeri24 is at Rp2,509,000 with a Rp2,362,000 buyback: Rp56,000 cheaper than Antam with a Rp147,000 spread, about 5.9%. UBS is at Rp2,533,000 with a Rp2,337,000 buyback: Rp32,000 cheaper than Antam with a Rp196,000 spread, about 7.7%. Galeri24’s buyback is only Rp13,000 below Antam’s, so Galeri24 remains the most efficient for a buy-then-sell round trip.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: Dua Wajah Inflasi', en: 'Playbook: Inflation’s Two Faces' },
        paragraphs: [
          {
            id: 'Pekan ini menunjukkan dua wajah inflasi bagi emas. Inflasi panas menaikkan taruhan kenaikan suku bunga dan menekan emas, tetapi jika disertai yield dan dolar yang mundur serta pasar saham yang goyah, emas justru dicari sebagai pelindung. Skenario dekat: bertahan di atas $4.181 membuka $4.217; gagal di sana bisa menguji $4.128 lalu $4.107.',
            en: 'This week showed inflation’s two faces for gold. Hot inflation raises rate-hike bets and pressures gold, but when it comes with falling yields, a weaker dollar and shaky stocks, gold is sought as protection instead. Near-term scenarios: holding above $4,181 opens $4,217; failing there could test $4,128, then $4,107.',
          },
          {
            id: 'Bagi investor rupiah, Antam yang hanya bergerak beberapa ribu rupiah sehari memberi ruang untuk tetap disiplin. DCA dengan nominal tetap meratakan harga beli di kedua skenario, dan selisih spread antarbrand hingga Rp49.000 layak diperhitungkan jika Anda berencana menjual kembali. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, an Antam price that moves only a few thousand rupiah a day leaves room to stay disciplined. Fixed-amount DCA averages the purchase price in either scenario, and the gap in spreads across brands, up to Rp49,000, is worth factoring in if you plan to sell back. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'CPI dan PPI sama-sama panas, tetapi yield dan dolar yang mundur di tengah aksi jual saham membuat emas tetap naik.',
      en: 'CPI and PPI both ran hot, but falling yields and a weaker dollar amid a stock selloff kept gold rising.',
    },
    callout: 'rates',
    image: withBase('/article-gold-rebounds-4171-hot-ppi-safe-haven.png'),
    publishedAt: Date.parse('2026-10-16T02:55:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Kitco: Gold, silver rebound as Treasury yields tumble despite hot PPI - Kitco AM Report', url: 'https://www.kitco.com/news/article/2026-10-15/gold-silver-rebound-treasury-yields-tumble-despite-hot-ppi-kitco-am-report' },
      { title: 'FinanceFeeds: Gold Price at $4,148 After Hot PPI: Bull $4,320, Bear $3,980', url: 'https://financefeeds.com/gold-price-4148-hot-ppi-cpi-retail-sales-bull-4320-bear-3980/' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Vibiznews: Harga Beli Emas Antam Hari ini Jumat 16 Oktober 2026 Naik Rp4.000; Harga Buyback Naik Rp5.000', url: 'https://vibiznews.com/index.php/2026/10/16/harga-beli-emas-antam-hari-ini-jumat-16-oktober-2026-naik-rp4-000-harga-buyback-naik-rp5-000/' },
      { title: 'Medcom.id: Emas Antam Hari Ini Naik Tipis, Berapa Harga Buyback?', url: 'https://www.medcom.id/ekonomi/bisnis/JKR2aQxK-emas-antam-hari-ini-naik-tipis-berapa-harga-buyback' },
      { title: 'Journalarta: Harga Emas Antam Hari Ini Turun Rp 13.000', url: 'https://journalarta.com/news/2026/10/16/harga-emas-antam-hari-ini-turun/' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-holds-4160-dollar-high-cpi-test',
    category: 'macro',
    title: {
      id: 'Emas Tertahan di $4.161 Jelang CPI, Dolar di Puncak 18 Bulan; Antam Stagnan Rp2.574.000',
      en: 'Gold Stalls at $4,161 Ahead of CPI as the Dollar Sits at an 18-Month High; Antam Flat at Rp2,574,000',
    },
    excerpt: {
      id: 'Emas spot turun 0,3% pada Selasa karena dolar bertahan dekat level tertinggi sejak April 2025, meski yield mundur. Malam ini CPI September AS menjadi ujian: inflasi tahunan diperkirakan naik ke sekitar 3,7%. Antam stagnan di Rp2.574.000 setelah turun Rp20.000 sehari sebelumnya.',
      en: 'Spot gold fell 0.3% on Tuesday as the dollar held near its highest level since April 2025, even as yields eased. Tonight the US September CPI is the test: annual inflation is expected to rise to about 3.7%. Antam is flat at Rp2,574,000 after a Rp20,000 drop the day before.',
    },
    sections: [
      {
        heading: { id: 'Selasa: Naik di Pagi, Turun di Sore', en: 'Tuesday: Up in the Morning, Down by the Close' },
        paragraphs: [
          {
            id: 'Emas sempat menguat di awal sesi AS. Laporan pagi Kitco mencatat spot di sekitar $4.186,90, naik 0,39%, karena dolar, yield dan minyak sama-sama mundur. Namun kenaikan itu tidak bertahan. Spot ditutup turun 0,3% di $4.161,20, sementara kontrak berjangka Desember naik tipis 0,2% ke $4.184,30.',
            en: 'Gold firmed early in the US session. Kitco’s morning report put spot near $4,186.90, up 0.39%, as the dollar, yields and oil all retreated. But the gain did not hold. Spot settled down 0.3% at $4,161.20, while December futures edged up 0.2% to $4,184.30.',
          },
          {
            id: 'Penekannya adalah dolar. Indeks dolar sempat menyentuh level tertinggi sejak April 2025 sebelum mundur ke sekitar 102,4. Dolar yang kuat membuat emas lebih mahal bagi pembeli di luar AS, dan pelaku pasar enggan mengambil posisi besar sebelum data inflasi keluar.',
            en: 'The drag was the dollar. The dollar index touched its highest level since April 2025 before easing to about 102.4. A strong dollar makes gold dearer for buyers outside the US, and traders were reluctant to take big positions before the inflation data.',
          },
        ],
      },
      {
        heading: { id: 'Yield Mundur, Tetapi Taruhan Kenaikan Belum Hilang', en: 'Yields Ease, but Hike Bets Have Not Gone Away' },
        paragraphs: [
          {
            id: 'Yield Treasury 10 tahun turun 3,9 basis poin ke 5,209%, melanjutkan mundurnya dari puncak pekan lalu. Data tenaga kerja September juga lemah: hanya 29.000 pekerjaan baru, pengangguran 4,2%, dan data Juli serta Agustus direvisi turun total 60.000. Biasanya, kombinasi ini mendukung emas.',
            en: 'The 10-year Treasury yield fell 3.9 basis points to 5.209%, extending its retreat from last week’s peak. September jobs data was also weak: just 29,000 new jobs, 4.2% unemployment, and July and August revised down by a combined 60,000. Normally that mix supports gold.',
          },
          {
            id: 'Masalahnya, Fed belum melunak. Pasar memberi peluang sekitar 19% kenaikan suku bunga Oktober dan sekitar 85% setidaknya satu kenaikan hingga Desember. Presiden Fed New York John Williams memperkirakan satu kenaikan lagi tahun ini, meski tidak melihat perlunya kenaikan pada 2027. Brent bertahan di atas $104 setelah serangan Houthi ke bandara Arab Saudi, menjaga kekhawatiran inflasi.',
            en: 'The problem is that the Fed has not softened. Markets price about a 19% chance of an October hike and about 85% of at least one hike by December. New York Fed President John Williams expects one more hike this year, though he sees no need for further hikes in 2027. Brent held above $104 after Houthi attacks on a Saudi airport, keeping inflation worries alive.',
          },
        ],
      },
      {
        heading: { id: 'CPI Malam Ini dan Peta Level', en: 'Tonight’s CPI and the Level Map' },
        paragraphs: [
          {
            id: 'CPI September AS dirilis Rabu pukul 08.30 waktu New York, atau 19.30 WIB. Inflasi tahunan diperkirakan naik ke sekitar 3,7% karena harga energi, sementara inflasi inti diperkirakan melambat. Inti yang jinak bisa menurunkan peluang kenaikan Desember dan memberi ruang bagi emas. Inti yang panas bisa membangkitkan lagi taruhan kenaikan dan menekan emas. Kamis menyusul data PPI dan penjualan ritel.',
            en: 'The US September CPI comes out on Wednesday at 08:30 New York time, or 19:30 WIB. Annual inflation is expected to rise to about 3.7% on energy prices, while core inflation is expected to slow. A tame core reading could lower December hike odds and give gold room. A hot core reading could revive hike bets and pressure gold. PPI and retail sales follow on Thursday.',
          },
          {
            id: 'Kitco menandai resistance di $4.207, lalu zona $4.217–$4.227, kemudian $4.273 dan $4.316. Support ada di $4.181 dan $4.155, lalu $4.110 dan $4.067, dekat titik terendah pekan lalu di sekitar $4.066. Emas masih turun sekitar 3% dalam sebulan dan sekitar $1.447 atau 26% di bawah rekor $5.608 pada Januari.',
            en: 'Kitco marks resistance at $4,207, then the $4,217–$4,227 zone, then $4,273 and $4,316. Support sits at $4,181 and $4,155, then $4,110 and $4,067, near last week’s low of about $4,066. Gold is still down about 3% on the month and about $1,447, or 26%, below the $5,608 record set in January.',
          },
        ],
      },
      {
        heading: { id: 'Antam dan Brand Lain Hari Ini', en: 'Antam and Other Brands Today' },
        paragraphs: [
          {
            id: 'Antam 1 gram stagnan di Rp2.574.000 pada Rabu (pantauan 08.48 WIB), sama dengan Selasa yang turun Rp20.000. Dibanding Sabtu di Rp2.592.000, harganya turun Rp18.000. Buyback tetap Rp2.383.000, juga Rp18.000 di bawah Sabtu, sehingga spread bertahan di Rp191.000, sekitar 7,4% dari harga jual.',
            en: 'Antam’s 1-gram bar is flat at Rp2,574,000 on Wednesday (checked at 08:48 WIB), the same as Tuesday, when it fell Rp20,000. Compared with Saturday’s Rp2,592,000, it is down Rp18,000. Buyback holds at Rp2,383,000, also Rp18,000 below Saturday, so the spread stays at Rp191,000, about 7.4% of the selling price.',
          },
          {
            id: 'Galeri24 di Rp2.521.000 dengan buyback Rp2.374.000: Rp53.000 lebih murah dari Antam dengan spread Rp147.000, sekitar 5,8%. UBS di Rp2.546.000 dengan buyback Rp2.348.000: Rp28.000 lebih murah dari Antam dengan spread Rp198.000, sekitar 7,8%. Buyback Galeri24 kini hanya Rp9.000 di bawah Antam, sehingga Galeri24 tetap yang paling efisien untuk beli lalu jual kembali.',
            en: 'Galeri24 is at Rp2,521,000 with a Rp2,374,000 buyback: Rp53,000 cheaper than Antam with a Rp147,000 spread, about 5.8%. UBS is at Rp2,546,000 with a Rp2,348,000 buyback: Rp28,000 cheaper than Antam with a Rp198,000 spread, about 7.8%. Galeri24’s buyback is now only Rp9,000 below Antam’s, so Galeri24 remains the most efficient for a buy-then-sell round trip.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: Biarkan Data yang Bicara', en: 'Playbook: Let the Data Speak' },
        paragraphs: [
          {
            id: 'Di balik gejolak harian, permintaan struktural tetap kuat. ETF emas global mencatat arus masuk rekor $31 miliar pada kuartal III dengan kepemilikan bertambah 211 ton, dan bank sentral China memperpanjang pembelian emasnya menjadi 23 bulan berturut-turut. Skenario dekat: CPI inti panas menguji $4.155 lalu $4.110; CPI inti jinak membuka $4.207 lalu zona $4.217–$4.227.',
            en: 'Behind the daily swings, structural demand stays strong. Global gold ETFs posted record Q3 inflows of $31 billion, with holdings up 211 tonnes, and China’s central bank extended its gold buying to 23 straight months. Near-term scenarios: a hot core CPI tests $4,155, then $4,110; a tame core CPI opens $4,207, then the $4,217–$4,227 zone.',
          },
          {
            id: 'Bagi investor rupiah, harga Antam yang stagnan memberi jeda sebelum data besar. Tidak perlu menebak hasil CPI: DCA dengan nominal tetap meratakan harga beli di kedua skenario, dan selisih spread antarbrand yang mencapai Rp51.000 layak diperhitungkan jika Anda berencana menjual kembali. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, the flat Antam price is a pause before big data. There is no need to guess the CPI outcome: fixed-amount DCA averages the purchase price in either scenario, and the gap in spreads across brands, up to Rp51,000, is worth factoring in if you plan to sell back. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Yield mundur dan data kerja lemah, tetapi dolar yang kuat dan taruhan kenaikan Fed menahan emas. Malam ini CPI yang memutuskan.',
      en: 'Yields eased and jobs data was weak, but a strong dollar and Fed hike bets held gold back. Tonight, CPI decides.',
    },
    callout: 'rates',
    image: withBase('/article-gold-holds-4160-dollar-high-cpi-test.png'),
    publishedAt: Date.parse('2026-10-14T03:30:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Investing.com: Gold prices mixed amid weaker dollar and subdued oil, focus now on U.S. CPI data', url: 'https://www.investing.com/news/commodities-news/gold-slips-near-4160-as-middle-east-tensions-fuel-ratehike-concerns-4945298' },
      { title: 'Kitco: Gold firms as dollar, yields and oil retreat before CPI - Kitco AM Report', url: 'https://www.kitco.com/news/article/2026-10-13/gold-firms-dollar-yields-and-oil-retreat-cpi-kitco-am-report' },
      { title: 'FX Leaders: Gold Price Forecast: XAU/USD Eyes $4,216 Breakout Ahead of CPI', url: 'https://www.fxleaders.com/news/2026/10/13/gold-price-forecast-4216-breakout-cpi-fed-outlook/' },
      { title: 'Golden State Mint: On the Spot with GSM, precious metals market report for 10/13/2026', url: 'https://www.goldenstatemint.com/blog/on-the-spot-with-gsm-precious-metals-market-report-for-10-13-2026/' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'ANTARA Sumbar: Harga emas Antam pada Rabu ini stabil di angka Rp2,574 juta/gr', url: 'https://sumbar.antaranews.com/berita/782801/harga-emas-antam-pada-rabu-ini-stabil-di-angka-rp2574-jutagr' },
      { title: 'Bloomberg Technoz: Harga Emas Antam Hari Ini Tak Ada Perubahan, Sama dengan Kemarin', url: 'https://www.bloombergtechnoz.com/detail-news/124519/harga-emas-antam-hari-ini-tak-ada-perubahan-sama-dengan-kemarin' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-rebounds-weak-sentiment-cpi-ahead',
    category: 'market',
    title: {
      id: 'Emas Bangkit ke $4.194 Usai Sentimen Konsumen Lesu, Antam Naik ke Rp2.592.000',
      en: 'Gold Rebounds to $4,194 After Weak Consumer Sentiment, Antam Rises to Rp2,592,000',
    },
    excerpt: {
      id: 'Emas naik 1,5% pada Jumat dan menuju kenaikan mingguan sekitar 1,3%, dibantu sentimen konsumen AS yang lemah dan minyak yang mereda. Peluang kenaikan suku bunga Desember masih 84%, jadi data CPI pekan depan menjadi penentu. Antam naik Rp20.000 dan spreadnya menyempit.',
      en: 'Gold rose 1.5% on Friday and headed for a weekly gain of about 1.3%, helped by weak US consumer sentiment and easing oil. The odds of a December rate hike are still 84%, so next week’s CPI data is the decider. Antam rose Rp20,000 and its spread narrowed.',
    },
    sections: [
      {
        heading: { id: 'Jumat: Emas Pulih dari Terendah Dua Bulan', en: 'Friday: Gold Recovers From a Two-Month Low' },
        paragraphs: [
          {
            id: 'Dua hari setelah menyentuh level terendah dua bulan, emas bangkit. Spot naik 1,5% ke $4.194,36 pada sore waktu AS, kenaikan hari kedua berturut-turut, dan menuju kenaikan mingguan sekitar 1,3%. Kontrak berjangka Desember ditutup naik 1,4% di $4.216,3. Perak ikut naik 2,4% ke $60,77.',
            en: 'Two days after touching a two-month low, gold bounced. Spot rose 1.5% to $4,194.36 in the US afternoon, its second straight daily gain, and headed for a weekly gain of about 1.3%. December futures settled up 1.4% at $4,216.3. Silver rose 2.4% to $60.77.',
          },
          {
            id: 'Data sentimen konsumen Universitas Michigan menambah dorongan. Angka awal Oktober turun ke 46,3, di bawah perkiraan 47,6 dan angka September 48,1. Ekspektasi inflasi setahun naik ke 4,7% dari 4,6%, dan ekspektasi jangka panjang ke 3,5% dari 3,4%, keduanya tertinggi sejak Mei.',
            en: 'The University of Michigan consumer sentiment data added a push. The preliminary October reading fell to 46.3, below the 47.6 forecast and September’s 48.1. One-year inflation expectations rose to 4.7% from 4.6%, and long-run expectations to 3.5% from 3.4%, both the highest since May.',
          },
        ],
      },
      {
        heading: { id: 'Minyak Mereda, Tetapi Fed Belum Melunak', en: 'Oil Eases, but the Fed Has Not Softened' },
        paragraphs: [
          {
            id: 'Pemicu kedua datang dari geopolitik. Trump menyebut pembicaraan dengan Iran produktif dan mengatakan tidak ada serangan sebelum pemilu sela 3 November. Brent turun dari atas $104 ke sekitar $102,6, WTI di sekitar $90,4, dan yield 10 tahun mundur ke sekitar 5,25% dari puncak dua dekade yang dicapai Rabu.',
            en: 'The second trigger was geopolitics. Trump called talks with Iran productive and said there would be no attack before the November 3 midterms. Brent fell from above $104 to about $102.6, WTI was near $90.4, and the 10-year yield eased to about 5.25% from the two-decade high reached on Wednesday.',
          },
          {
            id: 'Namun ini belum mengubah arah Fed. CME FedWatch memberi peluang 19% kenaikan suku bunga Oktober dan 84% setidaknya satu kenaikan hingga Desember. Presiden Fed St. Louis Alberto Musalem mengatakan suku bunga perlu dinaikkan sekali lagi untuk membawa inflasi ke 2%. Ekspektasi inflasi yang naik justru mendukung pandangan itu.',
            en: 'But this has not changed the Fed’s course. CME FedWatch puts the odds of an October hike at 19% and of at least one hike by December at 84%. St. Louis Fed President Alberto Musalem said rates need one more hike to bring inflation to 2%. Rising inflation expectations actually support that view.',
          },
        ],
      },
      {
        heading: { id: 'Gambaran Besar dan Peta Level', en: 'The Big Picture and the Level Map' },
        paragraphs: [
          {
            id: 'Meski pulih, emas masih turun 2,86% dalam sebulan dan berada sekitar $1.414 atau 25% di bawah rekor $5.608 pada Januari. Kitco menandai resistance di $4.225, lalu $4.271 dan $4.311. Support ada di $4.184, $4.142 dan $4.103. StoneX melihat lantai mulai terbentuk di sekitar $4.000.',
            en: 'Despite the rebound, gold is still down 2.86% on the month and sits about $1,414, or 25%, below the $5,608 record set in January. Kitco marks resistance at $4,225, then $4,271 and $4,311. Support sits at $4,184, $4,142 and $4,103. StoneX sees a floor building around $4,000.',
          },
          {
            id: 'Pekan depan, data CPI dan PPI AS bulan September menjadi pemicu utama. Inflasi yang panas bisa menguatkan taruhan kenaikan Desember dan menekan emas kembali ke zona $4.100. Inflasi yang lebih jinak bisa membuka jalan untuk menguji $4.225 dan seterusnya. StoneX sendiri menilai tanpa kejutan besar, emas sulit menembus naik dengan meyakinkan.',
            en: 'Next week, the US September CPI and PPI data are the main catalysts. Hot inflation could firm up December hike bets and push gold back toward the $4,100 zone. Tamer inflation could open the way to test $4,225 and beyond. StoneX itself thinks that without a major shock, gold will struggle to break convincingly higher.',
          },
        ],
      },
      {
        heading: { id: 'Antam dan Brand Lain Hari Ini', en: 'Antam and Other Brands Today' },
        paragraphs: [
          {
            id: 'Antam 1 gram naik Rp20.000 ke Rp2.592.000 pada Sabtu, setelah naik Rp7.000 pada Jumat. Dalam dua hari, harganya naik Rp27.000 dari Rp2.565.000. Buyback naik lebih cepat, Rp25.000 ke Rp2.401.000, sehingga spread menyempit dari Rp196.000 ke Rp191.000, sekitar 7,4% dari harga jual.',
            en: 'Antam’s 1-gram bar rose Rp20,000 to Rp2,592,000 on Saturday, after a Rp7,000 rise on Friday. Over two days it is up Rp27,000 from Rp2,565,000. Buyback rose faster, by Rp25,000 to Rp2,401,000, so the spread narrowed from Rp196,000 to Rp191,000, about 7.4% of the selling price.',
          },
          {
            id: 'Galeri24 di Rp2.516.000 dengan buyback Rp2.371.000: Rp76.000 lebih murah dari Antam dengan spread Rp145.000, sekitar 5,8%. UBS di Rp2.539.000 dengan buyback Rp2.345.000, Rp53.000 lebih murah dari Antam dengan spread Rp194.000, sekitar 7,6%. Karena buyback Antam naik, kini buyback Galeri24 Rp30.000 di bawah Antam.',
            en: 'Galeri24 is at Rp2,516,000 with a Rp2,371,000 buyback: Rp76,000 cheaper than Antam with a Rp145,000 spread, about 5.8%. UBS is at Rp2,539,000 with a Rp2,345,000 buyback, Rp53,000 cheaper than Antam with a Rp194,000 spread, about 7.6%. Because Antam’s buyback rose, Galeri24’s buyback is now Rp30,000 below Antam’s.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: Lantai $4.000 dan Pembeli Bank Sentral', en: 'Playbook: The $4,000 Floor and Central Bank Buyers' },
        paragraphs: [
          {
            id: 'Permintaan struktural tetap menjadi penopang. Bank sentral China membeli 21 ton emas pada September, pembelian bulanan terbesar dalam tiga tahun, sehingga cadangannya mencapai 2.196 ton, bulan ke-23 berturut-turut. Skenario dekat: CPI panas menguji $4.142 lalu $4.103; CPI jinak membuka $4.225 lalu $4.271.',
            en: 'Structural demand remains a support. China’s central bank bought 21 tonnes of gold in September, its largest monthly purchase in three years, lifting its reserves to 2,196 tonnes in its 23rd straight month of buying. Near-term scenarios: hot CPI tests $4,142, then $4,103; tame CPI opens $4,225, then $4,271.',
          },
          {
            id: 'Bagi investor rupiah, rebound ini belum mengubah gambaran: harga masih jauh di bawah rekor dan arah jangka pendek bergantung pada data inflasi. DCA dengan nominal tetap membantu meratakan harga beli tanpa menebak arah, dan membandingkan harga serta spread antarbrand tetap layak dilakukan. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, this rebound has not changed the picture: prices are still far below the record and the short-term direction hinges on inflation data. Fixed-amount DCA helps average the purchase price without guessing the direction, and comparing prices and spreads across brands is still worth doing. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Emas mendapat napas dari minyak yang mereda dan konsumen yang lesu, tetapi arah berikutnya ditentukan oleh data inflasi pekan depan.',
      en: 'Gold got breathing room from easing oil and gloomy consumers, but its next move will be decided by next week’s inflation data.',
    },
    callout: 'rally',
    image: withBase('/article-gold-rebounds-weak-sentiment-cpi-ahead.png'),
    publishedAt: Date.parse('2026-10-10T02:55:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Kitco: Gold hits one-week high, heads for weekly gain on bargain-hunting', url: 'https://www.kitco.com/news/off-the-wire/2026-10-09/gold-hits-one-week-high-heads-weekly-gain-bargain-hunting' },
      { title: 'Kitco: Gold price trades near high after preliminary Consumer Sentiment falls to 46.3, inflation expectations rise', url: 'https://www.kitco.com/news/article/2026-10-09/gold-price-trades-near-high-after-preliminary-consumer-sentiment-falls-463' },
      { title: 'Kitco: Gold, silver rebound as dollar, yields and oil ease - Kitco AM Report', url: 'https://www.kitco.com/news/article/2026-10-09/gold-silver-rebound-dollar-yields-and-oil-ease-kitco-am-report' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Yahoo Finance: Gold price today, Friday, October 9, 2026', url: 'https://finance.yahoo.com/personal-finance/investing/article/gold-price-today-friday-october-9-2026-gold-prices-see-modest-gains-after-productive-discussions-with-iran-105955527.html' },
      { title: 'Kitco: China’s central bank buys 21 tonnes of gold in September, largest monthly purchase in 3 years', url: 'https://www.kitco.com/news/article/2026-10-07/chinas-central-bank-buys-21-tonnes-gold-september-largest-monthly-purchase' },
      { title: 'ANTARA: Harga emas Antam naik Rp20.000 jadi Rp2,592 juta/gr di Sabtu ini', url: 'https://antaranews.com/berita/5779596/harga-emas-antam-naik-rp20000-jadi-rp2592-juta-gr-di-sabtu-ini' },
      { title: 'Industry.co.id: Harga Emas Hari Ini 10 Oktober 2026: Antam, UBS, dan Galeri 24 Lengkap', url: 'https://www.industry.co.id/read/157210/harga-emas-hari-ini-10-oktober-2026-antam-ubs-dan-galeri-24-lengkap' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-fomc-minutes-hawkish-4100-test',
    category: 'macro',
    title: {
      id: 'Risalah FOMC Hawkish: Emas Diuji di $4.100, Antam Turun ke Rp2.565.000',
      en: 'Hawkish FOMC Minutes: Gold Tested at $4,100, Antam Falls to Rp2,565,000',
    },
    excerpt: {
      id: 'Risalah Fed menunjukkan sebagian besar pejabat memperkirakan satu kenaikan suku bunga lagi tahun ini. Emas turun 1,34% ke $4.108,8, terendah sebulan, sebelum pulih ke sekitar $4.137. Antam turun Rp15.000 dan spreadnya melebar.',
      en: 'The Fed minutes showed most officials expect one more rate hike this year. Gold fell 1.34% to $4,108.8, a one-month low, before recovering to about $4,137. Antam fell Rp15,000 and its spread widened.',
    },
    sections: [
      {
        heading: { id: 'Rabu: Emas Tembus di Bawah $4.100', en: 'Wednesday: Gold Breaks Below $4,100' },
        paragraphs: [
          {
            id: 'Tekanan sudah terasa sebelum risalah terbit. Emas turun ke $4.138,10 pada pagi waktu AS, lalu sempat menembus di bawah $4.100, level terendah sejak 5 Agustus, dengan penurunan intraday lebih dari 2%. Emas ditutup turun 1,34% ke $4.108,8, terendah dalam sekitar sebulan.',
            en: 'The pressure was there before the minutes came out. Gold slid to $4,138.10 in the US morning, then briefly broke below $4,100, its lowest since August 5, with an intraday drop of more than 2%. It closed down 1.34% at $4,108.8, its lowest in about a month.',
          },
          {
            id: 'Risalah rapat 15–16 September kemudian mengonfirmasi nada keras. Seluruh pejabat mendukung kenaikan suku bunga September ke 3,75–4,00%, dan sebagian besar memperkirakan satu kenaikan lagi sebelum akhir tahun. Kamis pagi emas pulih 0,63% ke sekitar $4.137, tetapi masih dekat level terendah sejak awal Agustus.',
            en: 'The minutes of the September 15–16 meeting then confirmed the hawkish tone. Every official backed the September hike to 3.75–4.00%, and most expect one more hike before year-end. On Thursday morning gold recovered 0.63% to about $4,137, but it is still close to its lowest since early August.',
          },
        ],
      },
      {
        heading: { id: 'Yield 2002, Dolar Kuat, Minyak $100', en: '2002-Level Yields, a Strong Dollar, $100 Oil' },
        paragraphs: [
          {
            id: 'Tiga tekanan datang bersamaan. Yield 10 tahun sempat ke 5,32%, level yang terakhir terlihat pada 2002, dan yield 30 tahun sekitar 5,70%. Indeks dolar di sekitar 102,2, dekat level terkuat sejak awal 2025. Brent kembali di atas $100 dan Kamis naik ke sekitar $102 karena ketegangan AS-Iran.',
            en: 'Three pressures arrived at once. The 10-year yield touched 5.32%, a level last seen in 2002, and the 30-year yield was around 5.70%. The dollar index is near 102.2, close to its strongest since early 2025. Brent is back above $100 and rose to about $102 on Thursday on US-Iran tensions.',
          },
          {
            id: 'Bagi emas yang tidak memberi bunga, kombinasi ini berat. Yield tinggi menaikkan biaya memegang emas, dolar kuat membuat emas lebih mahal bagi pembeli di luar AS, dan minyak mahal menjaga kekhawatiran inflasi yang membuat Fed tetap keras. Pasar memperkirakan Fed menahan suku bunga pada 28 Oktober, tetapi peluang kenaikan Desember sekitar 78%.',
            en: 'For gold, which pays no interest, the combination is heavy. High yields raise the cost of holding gold, a strong dollar makes it pricier for buyers outside the US, and expensive oil keeps alive the inflation worries that keep the Fed hawkish. Markets expect the Fed to hold on October 28, but put the odds of a December hike at about 78%.',
          },
        ],
      },
      {
        heading: { id: 'Gambaran Besar dan Peta Level', en: 'The Big Picture and the Level Map' },
        paragraphs: [
          {
            id: 'Dalam sebulan emas sudah turun hampir 6% dan berada sekitar $1.470 atau 26% di bawah rekor $5.608 pada Januari. $4.100 kini menjadi garis pertahanan utama. Jika tembus dengan meyakinkan, zona $4.000–4.020 menjadi sasaran berikutnya. Di atas, resistance ada di $4.180–4.190.',
            en: 'Over the month gold has fallen almost 6% and sits about $1,470, or 26%, below the $5,608 record set in January. $4,100 is now the main line of defense. A convincing break would put the $4,000–4,020 zone next in line. Above, resistance sits at $4,180–4,190.',
          },
          {
            id: 'Data berikutnya: klaim pengangguran AS pada Kamis malam WIB dan sentimen konsumen pada Jumat. Data tenaga kerja yang lemah sempat menurunkan peluang kenaikan suku bunga. Data yang lebih kuat bisa memperkuat skenario kenaikan Desember dan menekan emas lagi.',
            en: 'Next up: US jobless claims on Thursday evening WIB and consumer sentiment on Friday. Weak labor data had lowered the odds of a hike. Stronger data could firm up the December hike scenario and pressure gold again.',
          },
        ],
      },
      {
        heading: { id: 'Antam dan Brand Lain Hari Ini', en: 'Antam and Other Brands Today' },
        paragraphs: [
          {
            id: 'Antam 1 gram turun Rp15.000 ke Rp2.565.000, menghapus kenaikan Rp10.000 kemarin. Buyback turun lebih dalam, Rp25.000 ke Rp2.366.000, sehingga spread melebar dari Rp189.000 ke Rp199.000, sekitar 7,8% dari harga jual. Artinya, pembeli hari ini perlu kenaikan harga lebih besar untuk impas.',
            en: 'Antam’s 1-gram bar fell Rp15,000 to Rp2,565,000, erasing yesterday’s Rp10,000 gain. Buyback fell further, by Rp25,000 to Rp2,366,000, so the spread widened from Rp189,000 to Rp199,000, about 7.8% of the selling price. That means today’s buyers need a bigger price rise to break even.',
          },
          {
            id: 'Galeri24 justru naik tipis ke Rp2.516.000 dengan buyback Rp2.368.000: Rp49.000 lebih murah dari Antam dengan spread Rp148.000, sekitar 5,9%. Buyback Galeri24 kini bahkan Rp2.000 di atas buyback Antam. UBS di Rp2.539.000 dengan buyback Rp2.343.000, Rp26.000 lebih murah dari Antam dengan spread Rp196.000, sekitar 7,7%.',
            en: 'Galeri24 actually edged up to Rp2,516,000 with a Rp2,368,000 buyback: Rp49,000 cheaper than Antam with a Rp148,000 spread, about 5.9%. Galeri24’s buyback is now even Rp2,000 above Antam’s. UBS is at Rp2,539,000 with a Rp2,343,000 buyback, Rp26,000 cheaper than Antam with a Rp196,000 spread, about 7.7%.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: Pembeli Saat Turun Masih Ada', en: 'Playbook: Dip Buyers Are Still There' },
        paragraphs: [
          {
            id: 'Di balik tekanan Fed, permintaan struktural belum hilang. Kepemilikan ETF SPDR Gold naik ke 1.056,27 ton per 5 Oktober dari 1.042,36 ton di akhir Agustus. Bank sentral membeli 39 ton pada Agustus, dan bank sentral China menambah 20,2 ton, pembelian bersih 22 bulan berturut-turut. Skenario dekat: data kuat menguji $4.100 lalu $4.000–4.020; data lemah membuka jalan ke $4.180–4.190.',
            en: 'Behind the Fed pressure, structural demand has not gone away. SPDR Gold ETF holdings rose to 1,056.27 tonnes on October 5 from 1,042.36 tonnes at end-August. Central banks bought 39 tonnes in August, and the People’s Bank of China added 20.2 tonnes, its 22nd straight month of net buying. Near-term scenarios: strong data tests $4,100, then $4,000–4,020; weak data opens the way to $4,180–4,190.',
          },
          {
            id: 'Bagi investor rupiah, harga yang turun terasa menarik, tetapi spread Antam yang melebar mengurangi keuntungannya. DCA dengan nominal tetap membantu meratakan harga beli tanpa menebak dasar pasar, dan membandingkan brand tetap layak dilakukan. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, lower prices look tempting, but Antam’s wider spread eats into the benefit. Fixed-amount DCA helps average the purchase price without guessing the bottom, and comparing brands is still worth doing. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Risalah Fed tidak membawa kejutan baru, tetapi mengonfirmasi apa yang paling ditakuti emas: satu kenaikan suku bunga lagi tahun ini.',
      en: 'The Fed minutes brought no new surprise, but they confirmed what gold fears most: one more rate hike this year.',
    },
    callout: 'rates',
    image: withBase('/article-gold-fomc-minutes-hawkish-4100-test.png'),
    publishedAt: Date.parse('2026-10-08T03:00:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Bloomberg Technoz: Harga Emas Antam Hari Ini Turun Rp15.000, Buyback Lebih Dalam', url: 'https://www.bloombergtechnoz.com/detail-news/123972/harga-emas-antam-hari-ini-turun-rp15-000-buyback-lebih-dalam' },
      { title: 'BigGo Finance: Spot Gold Breaks Below $4,100 as High Treasury Yields and Strong Dollar Weigh', url: 'https://finance.biggo.com/news/c819a459-c0ad-4642-ac8a-93d30fbc1685' },
      { title: 'Yahoo Finance: Gold price today, Wednesday, October 7, 2026', url: 'https://finance.yahoo.com/personal-finance/investing/article/gold-price-today-wednesday-october-7-2026-gold-prices-losing-ground-ahead-of-fed-minutes-105600743.html' },
      { title: 'Trading Economics: US 10-year Treasury yield', url: 'https://tradingeconomics.com/united-states/government-bond-yield' },
      { title: 'Trading Economics: US Dollar Index', url: 'https://tradingeconomics.com/united-states/currency' },
      { title: 'Trading Economics: Brent crude oil', url: 'https://tradingeconomics.com/commodity/brent-crude-oil' },
      { title: 'Kitco: Metals rise as oil steadies, yields pull back from 24-year highs - Kitco PM Report', url: 'https://www.kitco.com/news/article/2026-10-06/metals-rise-oil-steadies-yields-pull-back-24-year-highs-kitco-pm-report' },
      { title: 'ANTARA: Harga emas Antam turun Rp15.000 ke angka Rp2,565 juta/gr pada Kamis (8/10/2026)', url: 'https://megapolitan.antaranews.com/berita/553601/harga-emas-antam-turun-rp15000-ke-angka-rp2565-juta-gr-pada-kamis-8-10-2026-hari-ini' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-yields-ease-oil-rebound-fomc-minutes',
    category: 'market',
    title: {
      id: 'Yield Mundur, Minyak Naik Lagi: Emas Bolak-balik di $4.150 Jelang Risalah FOMC',
      en: 'Yields Ease, Oil Rebounds: Gold Whipsaws Around $4,150 Ahead of the FOMC Minutes',
    },
    excerpt: {
      id: 'Emas naik ke $4.165 saat yield AS mundur dari puncak 24 tahun, lalu turun lagi ke $4.146 ketika minyak naik akibat serangan tanker di Hormuz. Antam naik Rp10.000 ke Rp2.580.000 dan spreadnya menyempit.',
      en: 'Gold rose to $4,165 as US yields eased from 24-year highs, then slipped back to $4,146 as oil climbed on tanker attacks near Hormuz. Antam rose Rp10,000 to Rp2,580,000 and its spread narrowed.',
    },
    sections: [
      {
        heading: { id: 'Selasa: Yield Mundur, Emas Naik', en: 'Tuesday: Yields Ease, Gold Rises' },
        paragraphs: [
          {
            id: 'Emas mendapat ruang bernapas pada Selasa. Yield obligasi AS 10 tahun mundur ke kisaran 5,27–5,3% dari level tertinggi dalam 24 tahun, dan dolar ikut melemah dari puncak 18 bulan. Di sesi pagi AS emas sempat di $4.175,30 (naik 0,86%), lalu Kitco mencatat spot di $4.165,40, naik 0,63%, menjelang penutupan.',
            en: 'Gold got some breathing room on Tuesday. The US 10-year yield eased to the 5.27–5.3% area from a 24-year high, and the dollar slipped from an 18-month peak. Gold was at $4,175.30 (up 0.86%) in the US morning, then Kitco had spot at $4,165.40, up 0.63%, late in the session.',
          },
          {
            id: 'Latar belakangnya masih data tenaga kerja yang lemah: payroll September hanya bertambah 29.000 dengan pengangguran 4,2% dan upah naik 0,1% sebulan. Data ini menahan peluang kenaikan suku bunga bulan ini di 19–23%. Namun ISM Jasa menunjukkan indeks harga di 74,0, sehingga kekhawatiran inflasi belum hilang.',
            en: 'The backdrop is still weak jobs data: September payrolls rose just 29,000, with unemployment at 4.2% and wages up 0.1% on the month. That keeps the odds of a rate hike this month at 19–23%. But ISM Services showed a prices index of 74.0, so inflation worries have not gone away.',
          },
        ],
      },
      {
        heading: { id: 'Rabu: Minyak Menghapus Sebagian Kenaikan', en: 'Wednesday: Oil Erases Part of the Gain' },
        paragraphs: [
          {
            id: 'Rabu pagi emas turun 0,44% ke $4.146,42, kembali di bawah $4.150. Pemicunya minyak: Brent naik 0,82% ke $101,41 setelah UKMTO mencatat sembilan insiden serangan tanker Iran di Selat Hormuz bulan ini, dan koalisi Saudi mencegat rudal balistik Houthi yang menyasar Khamis Mushait.',
            en: 'On Wednesday morning gold fell 0.44% to $4,146.42, back below $4,150. Oil was the trigger: Brent rose 0.82% to $101.41 after UKMTO counted nine Iranian tanker-attack incidents in the Strait of Hormuz this month, and the Saudi-led coalition intercepted a Houthi ballistic missile aimed at Khamis Mushait.',
          },
          {
            id: 'Mengapa minyak menekan emas, padahal emas sering dianggap aset aman saat konflik? Saat ini pasar membaca minyak mahal sebagai bahan bakar inflasi, yang menjaga yield tinggi dan membuka peluang Fed menaikkan suku bunga lagi. Indeks dolar juga bertahan di sekitar 102,06. Bagi emas yang tidak memberi bunga, itu tekanan.',
            en: 'Why does oil weigh on gold, when gold is often seen as a haven in conflicts? Right now markets read expensive oil as fuel for inflation, which keeps yields high and leaves the Fed room to hike again. The dollar index also holds near 102.06. For gold, which pays no interest, that is pressure.',
          },
        ],
      },
      {
        heading: { id: 'Gambaran Besar dan Peta Level', en: 'The Big Picture and the Level Map' },
        paragraphs: [
          {
            id: 'Dalam sebulan emas sudah turun 4,81% dan berada sekitar $1.462 atau 26% di bawah rekor $5.608 pada Januari. Kitco menandai resistance di $4.180–4.190, lalu $4.214 dan $4.238. Support terdekat di $4.142,71, lalu zona $4.000–4.020. Harga Rabu pagi berada tepat di atas support pertama itu.',
            en: 'Over the month gold has fallen 4.81% and sits about $1,462, or 26%, below the $5,608 record set in January. Kitco marks resistance at $4,180–4,190, then $4,214 and $4,238. Nearest support is $4,142.71, then the $4,000–4,020 zone. Wednesday morning’s price sits just above that first support.',
          },
          {
            id: 'Ujian utamanya adalah risalah FOMC September, Rabu pukul 14.00 ET atau Kamis dini hari WIB. Pasar memperkirakan sekitar 80% peluang Fed menahan suku bunga bulan ini, tetapi Kitco mencatat peluang kenaikan pada Desember jauh lebih besar. Setelah itu ada klaim pengangguran Kamis dan sentimen konsumen Jumat.',
            en: 'The main test is the September FOMC minutes, Wednesday at 2:00 p.m. ET, or early Thursday WIB. Markets price about an 80% chance the Fed holds rates this month, but Kitco notes the odds of a December hike are materially higher. After that come jobless claims on Thursday and consumer sentiment on Friday.',
          },
        ],
      },
      {
        heading: { id: 'Antam dan Brand Lain Hari Ini', en: 'Antam and Other Brands Today' },
        paragraphs: [
          {
            id: 'Antam 1 gram naik Rp10.000 ke Rp2.580.000, mengikuti kenaikan emas dunia pada Selasa. Buyback naik lebih banyak, Rp15.000 ke Rp2.391.000, sehingga spread menyempit dari Rp194.000 ke Rp189.000, sekitar 7,3% dari harga jual. Antam masih sekitar 19% di bawah rekornya Rp3.168.000 pada 29 Januari.',
            en: 'Antam’s 1-gram bar rose Rp10,000 to Rp2,580,000, following global gold’s Tuesday gain. Buyback rose more, by Rp15,000 to Rp2,391,000, so the spread narrowed from Rp194,000 to Rp189,000, about 7.3% of the selling price. Antam is still about 19% below its Rp3,168,000 record of January 29.',
          },
          {
            id: 'Galeri24 justru turun tipis ke Rp2.510.000 dengan buyback Rp2.366.000: Rp70.000 lebih murah dari Antam dengan spread Rp144.000, sekitar 5,7%. UBS di Rp2.534.000 dengan buyback Rp2.340.000, Rp46.000 lebih murah dari Antam tetapi dengan spread Rp194.000, sekitar 7,7%. Selisih harga Antam dengan Galeri24 kini melebar dari Rp57.000 kemarin.',
            en: 'Galeri24 actually edged lower to Rp2,510,000 with a Rp2,366,000 buyback: Rp70,000 cheaper than Antam with a Rp144,000 spread, about 5.7%. UBS is at Rp2,534,000 with a Rp2,340,000 buyback, Rp46,000 cheaper than Antam but with a Rp194,000 spread, about 7.7%. The gap between Antam and Galeri24 has widened from Rp57,000 yesterday.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: Bank Sentral Tetap Membeli', en: 'Playbook: Central Banks Keep Buying' },
        paragraphs: [
          {
            id: 'Di balik gejolak harian, permintaan struktural tetap ada. Bank sentral membeli bersih 39 ton emas pada Agustus, dipimpin China 20 ton, Polandia dan Uzbekistan masing-masing 8 ton. Sejak awal tahun Polandia sudah menambah 98 ton dan China 80 ton. Skenario dekat: risalah keras dan minyak naik menguji $4.142 lalu $4.000–4.020; risalah sabar membuka jalan ke $4.180–4.190.',
            en: 'Behind the daily swings, structural demand is still there. Central banks bought a net 39 tonnes of gold in August, led by China with 20 tonnes and Poland and Uzbekistan with 8 tonnes each. Year to date, Poland has added 98 tonnes and China 80 tonnes. Near-term scenarios: hawkish minutes and higher oil test $4,142, then $4,000–4,020; patient minutes open the way to $4,180–4,190.',
          },
          {
            id: 'Bagi investor rupiah, spread Antam yang menyempit sedikit membantu, tetapi selisih Rp70.000 dengan Galeri24 tetap layak dibandingkan sebelum membeli. DCA dengan nominal tetap lebih masuk akal daripada menebak isi risalah. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, Antam’s slightly narrower spread helps a little, but the Rp70,000 gap with Galeri24 is still worth comparing before buying. Fixed-amount DCA makes more sense than guessing what the minutes will say. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Yield yang mundur memberi emas ruang naik, tetapi minyak di atas $100 kembali mengingatkan pasar pada inflasi dan Fed.',
      en: 'Easing yields gave gold room to rise, but oil above $100 is reminding markets of inflation and the Fed again.',
    },
    callout: 'rates',
    image: withBase('/article-gold-yields-ease-oil-rebound-fomc-minutes.png'),
    publishedAt: Date.parse('2026-10-07T03:00:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Kitco: Metals rise as oil steadies, yields pull back from 24-year highs - Kitco PM Report', url: 'https://www.kitco.com/news/article/2026-10-06/metals-rise-oil-steadies-yields-pull-back-24-year-highs-kitco-pm-report' },
      { title: 'Kitco: Gold, silver prices rise as yields ease but December Fed risk remains - Kitco AM Report', url: 'https://www.kitco.com/news/article/2026-10-06/gold-silver-prices-rise-yields-ease-december-fed-risk-remains-kitco-am' },
      { title: 'Kitco: Central banks add 39 net tonnes of gold in August with China, Uzbekistan and Poland leading purchases', url: 'https://www.kitco.com/news/article/2026-10-06/central-banks-add-39-net-tonnes-gold-august-china-uzbekistan-and-poland' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Trading Economics: Brent crude oil', url: 'https://tradingeconomics.com/commodity/brent-crude-oil' },
      { title: 'Trading Economics: US Dollar Index', url: 'https://tradingeconomics.com/united-states/currency' },
      { title: 'detikFinance: Harga emas Antam naik segini', url: 'https://finance.detik.com/berita-ekonomi-bisnis/d-8695895/harga-emas-antam-naik-segini' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-ism-prices-yields-4100-support',
    category: 'macro',
    title: {
      id: 'Indeks Harga ISM di 74: Yield 5,31% Menahan Emas di Bawah $4.150',
      en: 'ISM Prices at 74: A 5.31% Yield Keeps Gold Below $4,150',
    },
    excerpt: {
      id: 'Aktivitas jasa AS melambat ke 54,9, tetapi biaya naik paling cepat sejak 2022. Yield 10 tahun bertahan di 5,31% dan emas tertahan di sekitar $4.135 menjelang risalah FOMC. Antam turun Rp10.000 ke Rp2.570.000.',
      en: 'US services activity slowed to 54.9, but costs rose at the fastest pace since 2022. The 10-year yield held at 5.31% and gold stalled near $4,135 ahead of the FOMC minutes. Antam fell Rp10,000 to Rp2,570,000.',
    },
    sections: [
      {
        heading: { id: 'Data Jasa: Melambat, tapi Biaya Memanas', en: 'Services Data: Slower, but Costs Heat Up' },
        paragraphs: [
          {
            id: 'ISM Jasa September turun ke 54,9 dari 55,4, sedikit di bawah perkiraan 55,0. Pesanan baru turun 1,1 poin ke 59,8, sementara indeks tenaga kerja naik ke 50,1, kembali ke zona ekspansi untuk pertama kali dalam tiga bulan. Sekilas, ini data yang biasanya ramah bagi emas.',
            en: 'September ISM Services fell to 54.9 from 55.4, slightly below the 55.0 forecast. New orders fell 1.1 points to 59.8, while the employment index rose to 50.1, back in expansion for the first time in three months. At first glance, that is data that usually suits gold.',
          },
          {
            id: 'Masalahnya ada di indeks harga, yang naik ke 74,0, tertinggi sejak Juli 2022 dan keenam kalinya dalam tujuh bulan di atas 70. Responden menyebut tarif dan biaya bahan bakar. Emas sempat di $4.141,73 setelah rilis, lalu Kitco mencatat spot di $4.137,70 (turun 0,05%) menjelang penutupan.',
            en: 'The problem is the prices index, which rose to 74.0, the highest since July 2022 and the sixth reading above 70 in seven months. Respondents cited tariffs and fuel costs. Gold was at $4,141.73 after the release, then Kitco had spot at $4,137.70 (down 0.05%) late in the session.',
          },
        ],
      },
      {
        heading: { id: 'Mengapa Emas Tidak Bisa Naik', en: 'Why Gold Can’t Rally' },
        paragraphs: [
          {
            id: 'Biaya yang memanas menjaga yield tetap tinggi. Yield obligasi AS 10 tahun bertahan sekitar 5,31%, tertinggi sejak April 2002. Karena emas tidak memberi bunga, yield setinggi ini menaikkan biaya peluang untuk memegangnya. Indeks dolar juga naik ke 102,18, dekat level terkuat sejak April 2025, terbantu ketidakpastian politik dan fiskal di Eropa.',
            en: 'Hotter costs keep yields high. The US 10-year yield held near 5.31%, the highest since April 2002. Because gold pays no interest, yields this high raise the opportunity cost of holding it. The dollar index also rose to 102.18, near its strongest since April 2025, helped by political and fiscal uncertainty in Europe.',
          },
          {
            id: 'Ada penahan dari sisi lain. Setelah data tenaga kerja yang lemah, pasar memperkirakan sekitar 78% peluang Fed menahan suku bunga bulan ini, dan Kitco mencatat peluang kenaikan Oktober tinggal 22–24%. Minyak juga turun: Brent melemah 1,9% ke $100,32 dan WTI 1,8% ke $89,43. Hasilnya, emas bergerak datar, bukan jatuh.',
            en: 'There is support from the other side. After weak jobs data, markets price about a 78% chance the Fed holds rates this month, and Kitco notes October hike odds are down to 22–24%. Oil also fell: Brent slipped 1.9% to $100.32 and WTI 1.8% to $89.43. The result is gold moving sideways, not falling.',
          },
        ],
      },
      {
        heading: { id: 'Gambaran Besar dan Peta Level', en: 'The Big Picture and the Level Map' },
        paragraphs: [
          {
            id: 'Selasa pagi emas di $4.134,47, turun 0,13%. Dalam sebulan emas sudah turun 6,14% dan berada sekitar $1.474 atau 26% di bawah rekor $5.608 pada Januari. Kitco menandai support di $4.101,35 dan resistance di $4.164,44 lalu $4.203,61. Selama yield bertahan di atas 5,3%, rentang ini cenderung sulit ditembus ke atas.',
            en: 'On Tuesday morning gold was at $4,134.47, down 0.13%. Over the month it has fallen 6.14% and sits about $1,474, or 26%, below the $5,608 record set in January. Kitco marks support at $4,101.35 and resistance at $4,164.44, then $4,203.61. While yields stay above 5.3%, the top of that range is hard to break.',
          },
          {
            id: 'Ujian berikutnya adalah risalah rapat FOMC September yang terbit Rabu. Lalu klaim pengangguran Kamis, sentimen konsumen Jumat, dan CPI AS 14 Oktober. Risalah yang menekankan inflasi bisa menekan emas ke $4.100; nada yang lebih sabar bisa membuka jalan ke $4.164–4.204.',
            en: 'The next test is Wednesday’s release of the September FOMC minutes. Then come jobless claims on Thursday, consumer sentiment on Friday and US CPI on October 14. Minutes that stress inflation could push gold to $4,100; a more patient tone could open the way to $4,164–4,204.',
          },
        ],
      },
      {
        heading: { id: 'Antam dan Brand Lain Hari Ini', en: 'Antam and Other Brands Today' },
        paragraphs: [
          {
            id: 'Antam 1 gram turun Rp10.000 ke Rp2.570.000 setelah sempat naik ke Rp2.580.000 kemarin. Buyback ikut turun Rp10.000 ke Rp2.376.000, jadi spreadnya tetap Rp194.000, sekitar 7,5% dari harga jual. Antam kini sekitar 19% di bawah rekornya Rp3.168.000 pada 29 Januari, koreksi yang lebih ringan daripada 26% emas dunia dalam dolar.',
            en: 'Antam’s 1-gram bar fell Rp10,000 to Rp2,570,000 after rising to Rp2,580,000 yesterday. Buyback also fell Rp10,000 to Rp2,376,000, so the spread holds at Rp194,000, about 7.5% of the selling price. Antam is now about 19% below its Rp3,168,000 record of January 29, a milder drop than global gold’s 26% in dollar terms.',
          },
          {
            id: 'Galeri24 1 gram di Rp2.513.000 dengan buyback Rp2.369.000: Rp57.000 lebih murah dari Antam dengan spread Rp144.000, sekitar 5,7%. UBS di Rp2.536.000 dengan buyback Rp2.343.000, Rp34.000 lebih murah dari Antam tetapi dengan spread Rp193.000, sekitar 7,6%. Untuk pembelian rutin, spread yang kecil berarti titik impas yang lebih cepat.',
            en: 'Galeri24’s 1-gram bar is at Rp2,513,000 with a Rp2,369,000 buyback: Rp57,000 cheaper than Antam with a Rp144,000 spread, about 5.7%. UBS is at Rp2,536,000 with a Rp2,343,000 buyback, Rp34,000 cheaper than Antam but with a Rp193,000 spread, about 7.6%. For regular buying, a smaller spread means reaching breakeven sooner.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: Menunggu Risalah FOMC', en: 'Playbook: Waiting for the FOMC Minutes' },
        paragraphs: [
          {
            id: 'Skenario pertama, risalah bernada keras dan yield naik lagi: $4.101 diuji dan Antam bisa ikut turun. Skenario kedua, risalah lebih sabar dan dolar melemah: emas berpeluang ke $4.164 lalu $4.204. Skenario ketiga, pasar menunggu CPI 14 Oktober dan emas bergerak menyamping di sekitar $4.100–4.165.',
            en: 'Scenario one, hawkish minutes and higher yields: $4,101 gets tested and Antam could follow lower. Scenario two, patient minutes and a weaker dollar: gold has room toward $4,164, then $4,204. Scenario three, markets wait for October 14 CPI and gold drifts sideways around $4,100–4,165.',
          },
          {
            id: 'Bagi investor rupiah, pelemahan Antam yang lebih ringan dari emas dunia menunjukkan peran kurs sebagai bantalan. DCA dengan nominal tetap dan memperhatikan spread tetap lebih masuk akal daripada menebak hasil risalah. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, Antam’s milder decline than global gold shows the exchange rate acting as a cushion. Fixed-amount DCA with an eye on the spread still makes more sense than guessing the minutes. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Aktivitas melambat, tetapi biaya naik paling cepat sejak 2022; selama yield bertahan di 5,31%, emas sulit naik.',
      en: 'Activity is slowing, but costs are rising at the fastest pace since 2022; while yields hold at 5.31%, gold struggles to rally.',
    },
    callout: 'rates',
    image: withBase('/article-gold-ism-prices-yields-4100-support.png'),
    publishedAt: Date.parse('2026-10-06T03:00:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Kitco: Gold holds near $4,138 as ISM prices keep yields elevated - Kitco PM Report', url: 'https://www.kitco.com/news/article/2026-10-05/gold-holds-near-4138-ism-prices-keep-yields-elevated-kitco-pm-report' },
      { title: 'Kitco: Gold dips to $4,141/oz after ISM Services PMI falls to 54.9 in September', url: 'https://www.kitco.com/news/article/2026-10-05/gold-dips-4141oz-after-ism-services-pmi-falls-549-september' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Trading Economics: US Dollar Index', url: 'https://tradingeconomics.com/united-states/currency' },
      { title: 'investingLive: Week ahead: ISM services, Fed minutes and Canadian jobs lead the economic calendar', url: 'https://investinglive.com/news/week-ahead-ism-services-fed-minutes-and-canadian-jobs-lead-the-economic-calendar-be-aware/' },
      { title: 'Liputan6: Harga emas Antam 6 Oktober 2026 turun Rp10.000, cek rinciannya', url: 'https://www.liputan6.com/bisnis/read/8306794/harga-emas-antam-6-oktober-2026-turun-rp-10000-cek-rinciannya' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-week-ahead-ism-fomc-minutes-4100',
    category: 'market',
    title: {
      id: 'Pekan Penentuan Emas: ISM Jasa, Risalah FOMC, dan Ujian $4.100',
      en: 'A Deciding Week for Gold: ISM Services, FOMC Minutes and the $4,100 Test',
    },
    excerpt: {
      id: 'Emas menutup pekan di $4.140, turun 3,09%, dan survei Kitco menunjukkan analis Wall Street condong bearish. Pekan ini ISM Jasa, risalah FOMC dan dua lelang obligasi bisa menentukan apakah $4.100 bertahan. Antam tertahan di Rp2.574.000 selama akhir pekan.',
      en: 'Gold ended the week at $4,140, down 3.09%, and Kitco’s survey shows Wall Street analysts leaning bearish. This week ISM Services, the FOMC minutes and two bond auctions could decide whether $4,100 holds. Antam stays at Rp2,574,000 over the weekend.',
    },
    sections: [
      {
        heading: { id: 'Pekan Lalu dalam Angka', en: 'Last Week in Numbers' },
        paragraphs: [
          {
            id: 'Emas spot dibuka pekan lalu di $4.277,90 dan sempat menyentuh $4.280,56, tetapi ditutup Jumat di $4.140,52. Itu penurunan 3,09% dalam sepekan dan pelemahan mingguan kedua beruntun. Low pekan di $4.110,95 hanya sekitar $11 di atas $4.100, level yang banyak analis sebut sebagai garis pertahanan utama.',
            en: 'Spot gold opened last week at $4,277.90 and briefly touched $4,280.56, but closed Friday at $4,140.52. That is a 3.09% weekly drop and a second straight weekly loss. The weekly low of $4,110.95 sat only about $11 above $4,100, the level many analysts call the main line of defense.',
          },
          {
            id: 'Data tenaga kerja yang lemah, hanya 29 ribu lapangan kerja di September, sempat memangkas peluang kenaikan suku bunga Fed Oktober ke sekitar 20%. Namun Trading Economics mencatat peluang kenaikan Desember masih di atas 80%. Itulah sebabnya lonjakan Jumat tidak bertahan: pasar melihat jeda, bukan akhir dari siklus pengetatan.',
            en: 'Weak jobs data, just 29,000 jobs in September, briefly cut the odds of an October Fed hike to about 20%. But Trading Economics notes that December hike odds remain above 80%. That is why Friday’s spike did not last: markets see a pause, not the end of the tightening cycle.',
          },
        ],
      },
      {
        heading: { id: 'Sentimen Berbalik ke Arah Hati-hati', en: 'Sentiment Turns Cautious' },
        paragraphs: [
          {
            id: 'Survei mingguan Kitco menunjukkan perubahan suasana. Dari 13 analis Wall Street, 6 memperkirakan emas turun pekan ini, hanya 3 yang memperkirakan naik, dan 4 netral. Di Main Street, 85 dari 182 responden masih bullish (47%) dan 60 bearish (33%), tapi untuk pertama kali sejak akhir Juli mayoritas bullish itu hilang.',
            en: 'Kitco’s weekly survey shows a shift in mood. Of 13 Wall Street analysts, 6 expect gold to fall this week, only 3 expect a rise and 4 are neutral. On Main Street, 85 of 182 respondents are still bullish (47%) and 60 bearish (33%), but for the first time since late July that bullish majority is gone.',
          },
          {
            id: 'Pandangan analis pun terbelah. Marc Chandler dari Bannockburn melihat peluang naik ke $4.280–4.300 dan mencari kesempatan beli di Oktober sebelum musim kuat November–Januari. Sebaliknya, Kuptsikevich dari FxPro membuka peluang uji $4.000. Rentang skenario selebar ini wajar ketika pasar menunggu data.',
            en: 'Analysts are split too. Marc Chandler of Bannockburn sees room for a move to $4,280–4,300 and is looking for a buying opportunity in October before the strong November–January season. On the other side, Kuptsikevich of FxPro sees a possible test of $4,000. A scenario range this wide is normal when markets are waiting for data.',
          },
        ],
      },
      {
        heading: { id: 'Agenda Pekan Ini dan Peta Level', en: 'This Week’s Agenda and the Level Map' },
        paragraphs: [
          {
            id: 'Senin, ISM Jasa September diperkirakan 55,1 dari 55,4; komponen harga dan tenaga kerja akan lebih diperhatikan daripada angka utamanya. Rabu ada risalah rapat FOMC 15–16 September dan lelang obligasi 10 tahun, Kamis klaim pengangguran (perkiraan 200 ribu) dan lelang 30 tahun, lalu Jumat sentimen konsumen Michigan. CPI AS baru keluar 14 Oktober.',
            en: 'On Monday, September ISM Services is forecast at 55.1 from 55.4; the prices and employment components will matter more than the headline. Wednesday brings the minutes of the September 15–16 FOMC meeting and a 10-year bond auction, Thursday jobless claims (forecast 200,000) and a 30-year auction, then Friday Michigan consumer sentiment. US CPI comes on October 14.',
          },
          {
            id: 'Lelang obligasi penting karena yield 10 tahun sudah di level tertinggi sejak 2002, dan indeks dolar di 101,93 menuju kenaikan mingguan ketiga, naik 3,06% dalam sebulan. Permintaan lelang yang lemah bisa mendorong yield lebih tinggi lagi. Di grafik, $4.100 adalah support utama dengan low Juni $4.009 di bawahnya, sementara $4.200 lalu $4.280–4.300 menjadi resistance.',
            en: 'The auctions matter because the 10-year yield is already at its highest since 2002, and the dollar index at 101.93 is headed for a third weekly gain, up 3.06% over the month. Weak auction demand could push yields higher still. On the chart, $4,100 is the main support with the June low of $4,009 below it, while $4,200 and then $4,280–4,300 act as resistance.',
          },
        ],
      },
      {
        heading: { id: 'Antam Diam di Akhir Pekan, Brand Lain Bergerak', en: 'Antam Holds Over the Weekend, Other Brands Move' },
        paragraphs: [
          {
            id: 'Logam Mulia tidak memperbarui harga pada Sabtu–Minggu, jadi acuan Antam tetap Rp2.574.000 per gram dengan buyback Rp2.380.000. Spreadnya Rp194.000, sekitar 7,5% dari harga jual. Sepanjang pekan lalu, Antam turun Rp23.000 dari Rp2.597.000 pada Senin, atau sekitar 0,9%, jauh lebih kecil dari penurunan 3,09% emas dunia dalam dolar.',
            en: 'Logam Mulia does not update prices on Saturday and Sunday, so the Antam reference stays at Rp2,574,000 per gram with a Rp2,380,000 buyback. The spread is Rp194,000, about 7.5% of the selling price. Over last week, Antam fell Rp23,000 from Rp2,597,000 on Monday, about 0.9%, far less than global gold’s 3.09% drop in dollar terms.',
          },
          {
            id: 'Galeri24 justru bergerak hari ini: 1 gram turun Rp5.000 ke Rp2.506.000 dengan buyback Rp2.364.000, sehingga Rp68.000 lebih murah dari Antam dengan spread Rp142.000 atau sekitar 5,7%. UBS turun Rp5.000 ke Rp2.530.000 dengan buyback Rp2.338.000, spread Rp192.000 atau sekitar 7,6%. Di Pegadaian, Antam 1 gram dijual Rp2.613.000.',
            en: 'Galeri24 did move today: its 1-gram bar fell Rp5,000 to Rp2,506,000 with a Rp2,364,000 buyback, making it Rp68,000 cheaper than Antam with a spread of Rp142,000, about 5.7%. UBS fell Rp5,000 to Rp2,530,000 with a Rp2,338,000 buyback, a spread of Rp192,000, about 7.6%. At Pegadaian, a 1-gram Antam bar sells for Rp2,613,000.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: Tiga Skenario untuk Pekan Ini', en: 'Playbook: Three Scenarios for the Week' },
        paragraphs: [
          {
            id: 'Skenario pertama, data jasa dan risalah FOMC bernada keras serta yield naik: $4.100 diuji dan $4.009 menjadi acuan berikutnya. Skenario kedua, data melunak dan lelang berjalan lancar: emas berpeluang kembali ke $4.200. Skenario ketiga, data campuran: emas bergerak menyamping menunggu CPI. Fondasi permintaan tetap ada, dengan pembelian bank sentral 289 ton di Q2 2026.',
            en: 'Scenario one, hawkish services data and FOMC minutes with rising yields: $4,100 gets tested and $4,009 becomes the next reference. Scenario two, softer data and smooth auctions: gold has room to return to $4,200. Scenario three, mixed data: gold drifts sideways ahead of CPI. The demand base remains, with central banks buying 289 tonnes in Q2 2026.',
          },
          {
            id: 'Bagi investor rupiah, harga Antam yang tertahan di akhir pekan memberi waktu untuk menyusun rencana, bukan menebak arah. DCA dengan nominal tetap dan memilih brand dengan spread kecil tetap menjadi cara paling sederhana menghadapi pekan yang penuh data. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, Antam’s weekend pause gives time to build a plan rather than guess direction. Fixed-amount DCA and choosing a brand with a small spread remain the simplest way through a data-heavy week. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Pasar sudah memperhitungkan jeda di Oktober; pekan ini menguji apakah kenaikan Desember juga masih layak diperhitungkan.',
      en: 'Markets have priced a pause in October; this week tests whether a December hike still deserves to be priced too.',
    },
    callout: 'rates',
    image: withBase('/article-gold-week-ahead-ism-fomc-minutes-4100.png'),
    publishedAt: Date.parse('2026-10-04T02:55:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Kitco: Wall Street on the brink of bearish majority after gold’s post-payrolls slide, Main Street abandons bullish bias', url: 'https://www.kitco.com/news/article/2026-10-02/wall-street-brink-bearish-majority-after-golds-post-payrolls-slide-main' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Trading Economics: US Dollar Index', url: 'https://tradingeconomics.com/united-states/currency' },
      { title: 'Kitco: Metals give back jobs-report bounce as oil, yields stay elevated - Kitco PM Report', url: 'https://www.kitco.com/news/article/2026-10-02/metals-give-back-jobs-report-bounce-oil-yields-stay-elevated-kitco-pm' },
      { title: 'investingLive: Week ahead: ISM services, Fed minutes and Canadian jobs lead the economic calendar', url: 'https://investinglive.com/news/week-ahead-ism-services-fed-minutes-and-canadian-jobs-lead-the-economic-calendar-be-aware/' },
      { title: 'Investing.com: Gold’s $4,100 test could decide whether the 2026 bull market holds', url: 'https://www.investing.com/analysis/golds-4100-test-could-decide-whether-the-2026-bull-market-holds-200688549' },
      { title: 'Kliksumut: Harga emas hari ini 4 Oktober 2026, cek harga Antam, UBS dan Galeri 24', url: 'https://kliksumut.com/harga-emas-hari-ini-4-oktober-2026-antam-turun-cek-harga-antam-ubs-dan-galeri-24/' },
      { title: 'Liputan6: Harga emas Antam sepekan turun Rp23.000', url: 'https://www.liputan6.com/bisnis/read/8305479/harga-emas-antam-sepekan-turun-rp-23000' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-weak-payrolls-bounce-fades',
    category: 'market',
    title: {
      id: 'NFP Cuma 29 Ribu, Tapi Emas Malah Ditutup Turun: Mengapa Lonjakan Itu Cepat Padam',
      en: 'Payrolls Add Just 29K, Yet Gold Closes Lower: Why the Spike Faded So Fast',
    },
    excerpt: {
      id: 'Data tenaga kerja AS jauh di bawah perkiraan dan emas sempat melonjak ke $4.223. Tapi yield dan dolar tetap kuat, sehingga emas ditutup turun ke sekitar $4.141 dan mencatat pelemahan mingguan kedua. Antam turun Rp2.000 ke Rp2.574.000, sementara buyback turun lebih dalam.',
      en: 'US jobs data came in far below forecasts and gold briefly jumped to $4,223. But yields and the dollar stayed firm, so gold closed lower near $4,141 and logged a second weekly loss. Antam fell Rp2,000 to Rp2,574,000, while buyback fell further.',
    },
    sections: [
      {
        heading: { id: 'Data Lemah, Reaksi Singkat', en: 'Weak Data, Short Reaction' },
        paragraphs: [
          {
            id: 'Laporan Non-Farm Payrolls September yang dirilis Jumat malam, 2 Oktober, menunjukkan ekonomi AS hanya menambah 29 ribu lapangan kerja, jauh di bawah konsensus sekitar 89 ribu sampai 90 ribu. Tingkat pengangguran naik ke 4,2% dari perkiraan 4,1%, dan upah per jam hanya naik 0,1% dibanding perkiraan 0,3%, atau 3,0% dalam setahun.',
            en: 'The September non-farm payrolls report released on Friday evening, October 2, showed the US economy added just 29,000 jobs, far below the consensus of about 89,000 to 90,000. Unemployment rose to 4.2% against a 4.1% forecast, and hourly pay rose only 0.1% versus the expected 0.3%, or 3.0% over the year.',
          },
          {
            id: 'Data bulan sebelumnya juga direvisi turun: Agustus menjadi 133 ribu dari 162 ribu, dan Juli menjadi 21 ribu dari 31 ribu. Emas langsung merespons. Kitco mencatat emas spot naik sekitar 1% ke $4.223 sesaat setelah rilis, karena pasar menilai pasar kerja yang melemah mengurangi alasan Fed untuk menaikkan suku bunga.',
            en: 'Earlier months were revised down too: August to 133,000 from 162,000, and July to 21,000 from 31,000. Gold reacted at once. Kitco recorded spot gold up about 1% at $4,223 shortly after the release, as markets judged that a weakening labor market reduces the Fed’s case for raising rates.',
          },
        ],
      },
      {
        heading: { id: 'Mengapa Lonjakan Itu Habis', en: 'Why the Spike Ran Out' },
        paragraphs: [
          {
            id: 'Lonjakan itu tidak bertahan sampai penutupan. Emas spot berakhir di sekitar $4.142, turun 0,83% menurut Kitco, dan Trading Economics mencatat $4.140, turun 0,90%. Penyebabnya, yield obligasi AS 10 tahun yang sempat turun kembali ke kisaran 5,25%. Sehari sebelumnya, yield 10 dan 30 tahun bahkan menyentuh level tertinggi sejak 2002.',
            en: 'The spike did not last to the close. Spot gold ended near $4,142, down 0.83% according to Kitco, and Trading Economics recorded $4,140, down 0.90%. The reason: the US 10-year Treasury yield, which had dipped, climbed back to around 5.25%. A day earlier, 10- and 30-year yields had even touched their highest levels since 2002.',
          },
          {
            id: 'Peluang kenaikan suku bunga Fed di Oktober kini sekitar 22%, jauh di bawah kisaran 70% awal pekan. Tapi pasar belum menghapus risiko kenaikan Desember: sebelum data keluar, peluangnya masih sekitar 79%. Ditambah dolar yang menguat sepanjang pekan dan Brent di $101 per barel, emas tetap menghadapi biaya peluang yang tinggi untuk aset tanpa imbal hasil.',
            en: 'Odds of an October Fed hike are now about 22%, far below the roughly 70% seen early in the week. But markets have not erased December hike risk: before the data, those odds stood near 79%. Add a dollar that firmed over the week and Brent at $101 a barrel, and gold still faces a high opportunity cost as an asset with no yield.',
          },
        ],
      },
      {
        heading: { id: 'Gambaran Besar dan Peta Level', en: 'The Big Picture and the Level Map' },
        paragraphs: [
          {
            id: 'Emas mencatat pelemahan mingguan kedua beruntun, setelah turun lebih dari 3% sepanjang pekan bahkan sebelum NFP. Dalam sebulan, emas turun 7,5%, meski masih naik 6,5% dibanding setahun lalu. Di sekitar $4.141, emas berada kira-kira 26% di bawah rekor Januari $5.608.',
            en: 'Gold logged a second straight weekly loss, having fallen more than 3% over the week even before payrolls. Over the month it is down 7.5%, though still up 6.5% from a year ago. At around $4,141, gold sits roughly 26% below its January record of $5,608.',
          },
          {
            id: 'Level teknis dari Kitco: resistance di $4.204 sampai $4.231, support di $4.150 lalu $4.111. Di bawahnya, $4.100 tetap menjadi garis pertahanan utama, dengan low Juni di $4.009. Data berikutnya yang diperhatikan pasar adalah ISM Jasa pada Senin dan inflasi CPI AS pada 14 Oktober, yang bisa kembali menggeser peluang kenaikan Desember.',
            en: 'Technical levels from Kitco: resistance at $4,204 to $4,231, support at $4,150 then $4,111. Below that, $4,100 remains the main line of defense, with the June low at $4,009. The next data markets are watching are ISM Services on Monday and US CPI inflation on October 14, which could shift December hike odds again.',
          },
        ],
      },
      {
        heading: { id: 'Antam Turun Tipis, Buyback Turun Lebih Dalam', en: 'Antam Edges Down, Buyback Falls Further' },
        paragraphs: [
          {
            id: 'Antam 1 gram turun Rp2.000 ke Rp2.574.000, koreksi hari ketiga beruntun, sementara buyback turun Rp6.000 ke Rp2.380.000 per gram. Karena buyback turun lebih dalam dari harga jual, spread melebar dari Rp190.000 menjadi Rp194.000, atau sekitar 7,5% dari harga jual. Artinya, pembeli hari ini butuh kenaikan harga sedikit lebih besar untuk mencapai titik impas.',
            en: 'Antam’s 1-gram bar fell Rp2,000 to Rp2,574,000, a third straight daily drop, while buyback fell Rp6,000 to Rp2,380,000 per gram. Because buyback fell more than the selling price, the spread widened from Rp190,000 to Rp194,000, about 7.5% of the selling price. That means today’s buyers need a slightly larger price rise to break even.',
          },
          {
            id: 'Galeri24 1 gram di Rp2.511.000 dengan buyback Rp2.370.000, Rp63.000 lebih murah dari Antam dengan spread Rp141.000 atau sekitar 5,6%. Buyback Galeri24 kini hanya Rp10.000 di bawah buyback Antam. UBS di Rp2.535.000 dengan buyback Rp2.344.000, Rp39.000 lebih murah dari Antam, dengan spread Rp191.000 atau sekitar 7,5%.',
            en: 'Galeri24’s 1-gram bar is at Rp2,511,000 with a Rp2,370,000 buyback, Rp63,000 cheaper than Antam with a spread of Rp141,000, about 5.6%. Galeri24’s buyback is now just Rp10,000 below Antam’s. UBS is at Rp2,535,000 with a Rp2,344,000 buyback, Rp39,000 cheaper than Antam, with a spread of Rp191,000, about 7.5%.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: Data Lemah Bukan Tiket Otomatis', en: 'Playbook: Weak Data Is Not an Automatic Ticket' },
        paragraphs: [
          {
            id: 'Pelajaran dari Jumat: data yang secara teori bagus untuk emas belum cukup selama yield dan dolar bertahan tinggi. Di sisi lain, fondasi permintaan struktural tetap ada. Bank sentral membeli 289 ton emas di Q2 2026, dan kepemilikan ETF emas bertambah 50 ton sepanjang September meski harga turun. Selama $4.100 bertahan, koreksi ini masih bisa dibaca sebagai fase konsolidasi; jika tembus, $4.009 menjadi acuan berikutnya.',
            en: 'The lesson from Friday: data that is good for gold in theory is not enough while yields and the dollar stay high. On the other hand, the structural demand base remains. Central banks bought 289 tonnes of gold in Q2 2026, and gold ETF holdings grew by 50 tonnes through September even as prices fell. As long as $4,100 holds, this correction can still be read as consolidation; if it breaks, $4,009 becomes the next reference.',
          },
          {
            id: 'Bagi investor rupiah, akhir pekan adalah waktu yang baik untuk meninjau rencana, bukan bereaksi pada satu angka. DCA dengan nominal tetap membuat Anda membeli lebih banyak gram saat harga turun, dan memilih brand dengan spread kecil mempercepat titik impas. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, the weekend is a good time to review the plan rather than react to a single number. Fixed-amount DCA buys you more grams when prices fall, and choosing a brand with a small spread reaches break-even sooner. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Pasar kerja melemah, tapi yield tetap di puncak 24 tahun: selama itu bertahan, kabar baik bagi emas hanya bertahan beberapa jam.',
      en: 'The labor market is weakening, but yields sit at 24-year highs: while that holds, good news for gold lasts only a few hours.',
    },
    callout: 'rates',
    image: withBase('/article-gold-weak-payrolls-bounce-fades.png'),
    publishedAt: Date.parse('2026-10-03T02:55:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Kitco: Metals give back jobs-report bounce as oil, yields stay elevated - Kitco PM Report', url: 'https://www.kitco.com/news/article/2026-10-02/metals-give-back-jobs-report-bounce-oil-yields-stay-elevated-kitco-pm' },
      { title: 'Kitco: Gold prices see solid bid as U.S. economy created 29k jobs in September', url: 'https://www.kitco.com/news/article/2026-10-02/gold-prices-see-sold-bid-us-economy-created-29k-jobs-september' },
      { title: 'Kitco: Gold, silver rise as weak payrolls cut Fed-hike odds - Kitco AM Report', url: 'https://www.kitco.com/news/article/2026-10-02/gold-silver-rise-weak-payrolls-cut-fed-hike-odds-kitco-am-report' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'MyJoyOnline: Gold slips before US payrolls data, set for second weekly loss', url: 'https://www.myjoyonline.com/gold-slips-before-us-payrolls-data-set-for-second-weekly-loss/' },
      { title: 'Investing.com: Gold’s $4,100 test could decide whether the 2026 bull market holds', url: 'https://www.investing.com/analysis/golds-4100-test-could-decide-whether-the-2026-bull-market-holds-200688549' },
      { title: 'Periskop: Harga emas Antam hari ini turun Rp2.000 jadi Rp2,574 juta per gram', url: 'https://periskop.id/investasi/20261003/harga-emas-antam-turun-rp2-574-juta-per-gram' },
      { title: 'CNBC Indonesia: Harga emas Antam Logam Mulia hari ini turun jadi segini', url: 'https://www.cnbcindonesia.com/research/20261003090620-128-773026/harga-emas-antam-logam-mulia-hari-ini-turun-jadi-segini' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-input-prices-payrolls-4200-ceiling',
    category: 'market',
    title: {
      id: 'Harga Input Melonjak, Emas Tertahan di Bawah $4.200: Semua Mata ke NFP Malam Ini',
      en: 'Input Prices Jump, Gold Stalls Below $4,200: All Eyes on Tonight’s Payrolls',
    },
    excerpt: {
      id: 'Klaim pengangguran AS turun ke 197 ribu dan indeks harga input ISM melonjak ke 77,9. Emas naik tipis ke sekitar $4.186 tapi belum mampu menembus $4.200. Antam justru turun Rp5.000 ke Rp2.576.000. Inilah peta level dan skenario jelang Non-Farm Payrolls.',
      en: 'US jobless claims fell to 197K and the ISM prices-paid index jumped to 77.9. Gold edged up to about $4,186 but has yet to break $4,200. Antam instead fell Rp5,000 to Rp2,576,000. Here is the map of levels and scenarios ahead of non-farm payrolls.',
    },
    sections: [
      {
        heading: { id: 'Kamis yang Tenang di Permukaan', en: 'A Quiet Thursday on the Surface' },
        paragraphs: [
          {
            id: 'Setelah gejolak PCE hari Rabu, emas spot menutup Kamis, 1 Oktober, hanya naik 0,10% di $4.159. Di balik angka yang datar itu, harga sempat naik ke $4.181 pagi hari, lalu turun ke titik terendah $4.139 setelah rilis ISM, sebelum kembali ke kisaran awal. Pagi ini, Jumat 2 Oktober, Trading Economics mencatat emas di sekitar $4.186, naik 0,19%.',
            en: 'After Wednesday’s PCE swings, spot gold closed Thursday, October 1, up just 0.10% at $4,159. Behind that flat figure, the price climbed to $4,181 in the morning, then dropped to a $4,139 low after the ISM release before returning to where it started. This Friday, October 2, Trading Economics shows gold near $4,186, up 0.19%.',
          },
          {
            id: 'Dua data menjelaskan tarik-ulur itu. Klaim pengangguran awal turun ke 197 ribu, di bawah perkiraan 201 ribu, tanda PHK masih rendah. ISM Manufaktur September turun tipis ke 54,5 dari 54,6, di bawah konsensus 55. Tapi angka yang paling diperhatikan adalah indeks harga input, yang melonjak ke 77,9 dari 71,1.',
            en: 'Two releases explain the tug-of-war. Initial jobless claims fell to 197,000, below the 201,000 forecast, a sign layoffs remain low. September ISM Manufacturing slipped to 54.5 from 54.6, below the 55 consensus. But the number that drew the most attention was the prices-paid index, which jumped to 77.9 from 71.1.',
          },
        ],
      },
      {
        heading: { id: 'Mengapa Harga Input Penting bagi Emas', en: 'Why Input Prices Matter for Gold' },
        paragraphs: [
          {
            id: 'Indeks harga input mengukur biaya yang dibayar pabrik untuk bahan baku. Lonjakan hampir 7 poin dalam sebulan berarti tekanan biaya belum reda, dan biaya itu cepat atau lambat bisa diteruskan ke konsumen. Ini melemahkan kabar baik dari PCE inti kemarin, karena pasar kembali bertanya apakah inflasi benar-benar sudah turun.',
            en: 'The prices-paid index measures what factories pay for inputs. A jump of nearly 7 points in a month means cost pressure has not eased, and those costs can sooner or later be passed on to consumers. That undercuts the good news from Wednesday’s core PCE, because markets are again asking whether inflation is really falling.',
          },
          {
            id: 'Peluang kenaikan suku bunga Fed di Oktober kini sekitar 37%, jauh di bawah kisaran 70% awal pekan. Namun yield obligasi AS 10 tahun bertahan di kisaran 5,30%, indeks dolar sempat ditutup di 101,45, tertinggi sejak akhir Juli, dan minyak Brent bergerak di sekitar $100 per barel karena ketegangan AS-Iran. Selama tiga beban ini bertahan, ruang naik emas tetap sempit.',
            en: 'Odds of an October Fed hike are now about 37%, far below the roughly 70% seen early in the week. Yet the US 10-year Treasury yield holds around 5.30%, the dollar index closed at 101.45, its highest since late July, and Brent crude trades around $100 a barrel on US-Iran tensions. As long as these three weights stay in place, gold’s upside remains narrow.',
          },
        ],
      },
      {
        heading: { id: 'Peta Level Jelang NFP', en: 'The Level Map Ahead of Payrolls' },
        paragraphs: [
          {
            id: 'Gambaran besarnya: emas turun 6,4% dalam sebulan dan menuju pelemahan mingguan kedua beruntun, meski masih naik 7,7% dibanding setahun lalu dan sekitar 25% di bawah rekor Januari di kisaran $5.590 sampai $5.608. September sendiri ditutup dengan penurunan 6,7%, walau kuartal ketiga secara keseluruhan masih naik 3,7%.',
            en: 'The big picture: gold is down 6.4% over the month and heading for a second straight weekly loss, though it is still up 7.7% from a year ago and about 25% below its January record in the $5,590 to $5,608 range. September alone ended with a 6.7% drop, although the third quarter as a whole still rose 3.7%.',
          },
          {
            id: 'Level teknis dari Kitco: resistance di $4.190 sampai $4.211, support di $4.160 lalu $4.112. Di bawahnya, $4.100 dan $4.000 tetap menjadi garis pertahanan utama. Penentunya adalah Non-Farm Payrolls September malam ini pukul 19.30 WIB, dengan konsensus sekitar 90 ribu. Angka jauh di atas itu berisiko mendorong yield dan dolar; angka lemah bisa membuka jalan menembus $4.200.',
            en: 'Technical levels from Kitco: resistance at $4,190 to $4,211, support at $4,160 then $4,112. Below that, $4,100 and $4,000 remain the main lines of defense. The decider is September non-farm payrolls tonight at 19:30 WIB, with consensus near 90,000. A print well above that risks lifting yields and the dollar; a weak one could open the way through $4,200.',
          },
        ],
      },
      {
        heading: { id: 'Antam Turun Saat Emas Dunia Naik', en: 'Antam Falls While World Gold Rises' },
        paragraphs: [
          {
            id: 'Di dalam negeri, arah harga berlawanan dengan pasar global. Antam 1 gram turun Rp5.000 ke Rp2.576.000, koreksi hari kedua beruntun, dan buyback ikut turun Rp5.000 ke Rp2.386.000 per gram. Spread tetap Rp190.000 atau sekitar 7,4% dari harga jual. Bloomberg Technoz mencatat penurunan ini terjadi justru saat emas dunia menguat, karena harga Antam disesuaikan harian dan tidak selalu mengikuti spot secara langsung.',
            en: 'At home, prices moved against the global market. Antam’s 1-gram bar fell Rp5,000 to Rp2,576,000, a second straight daily drop, and buyback also fell Rp5,000 to Rp2,386,000 per gram. The spread held at Rp190,000, about 7.4% of the selling price. Bloomberg Technoz noted the drop came even as world gold strengthened, because Antam prices are adjusted daily and do not always track spot directly.',
          },
          {
            id: 'Brand lain turun lebih dalam. Galeri24 1 gram turun Rp16.000 ke Rp2.511.000 dengan buyback Rp2.370.000, kini Rp65.000 lebih murah dari Antam dengan spread sekitar 5,6%. UBS turun Rp17.000 ke Rp2.535.000 dengan buyback Rp2.344.000, spread sekitar 7,5%. Untuk tabungan jangka panjang, spread yang lebih kecil berarti titik impas yang lebih cepat tercapai.',
            en: 'Other brands fell further. Galeri24’s 1-gram bar dropped Rp16,000 to Rp2,511,000 with a Rp2,370,000 buyback, now Rp65,000 cheaper than Antam with a spread of about 5.6%. UBS fell Rp17,000 to Rp2,535,000 with a Rp2,344,000 buyback, a spread of about 7.5%. For long-term saving, a smaller spread means reaching break-even sooner.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: Biarkan Data yang Bicara', en: 'Playbook: Let the Data Speak' },
        paragraphs: [
          {
            id: 'Fondasi permintaan struktural belum goyah. Bank sentral membeli 289 ton emas di Q2 2026, dan kepemilikan ETF emas bertambah 50 ton sepanjang September meski harga turun. Permintaan inilah yang menahan koreksi agar tidak berubah menjadi aksi jual panik saat yield dan dolar menekan.',
            en: 'The structural demand base has not wavered. Central banks bought 289 tonnes of gold in Q2 2026, and gold ETF holdings grew by 50 tonnes through September even as prices fell. This demand is what keeps the correction from turning into panic selling while yields and the dollar press down.',
          },
          {
            id: 'Bagi investor rupiah, NFP malam ini bisa menggerakkan emas beberapa puluh dolar dalam hitungan menit, dan harga Antam baru menyesuaikan besok pagi. Menebak satu angka bukan strategi. DCA dengan nominal tetap, ditambah memilih brand dengan spread terkecil, membuat hasil Anda tidak bergantung pada satu malam. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, tonight’s payrolls can move gold by tens of dollars in minutes, and Antam prices only adjust the next morning. Guessing one number is not a strategy. Fixed-amount DCA, plus choosing the brand with the smallest spread, keeps your results from hinging on a single night. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Pabrik membayar lebih mahal, pasar kerja tetap kuat: selama dua hal ini bertahan, $4.200 akan tetap menjadi atap bagi emas.',
      en: 'Factories paying more, a labor market still strong: as long as both hold, $4,200 will stay a ceiling for gold.',
    },
    callout: 'compare',
    image: withBase('/article-gold-input-prices-payrolls.png'),
    publishedAt: Date.parse('2026-10-02T08:05:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Kitco: Gold holds firm despite elevated yields as Fed bets soften - Kitco PM Report', url: 'https://www.kitco.com/news/article/2026-10-01/gold-holds-firm-despite-elevated-yields-fed-bets-soften-kitco-pm-report' },
      { title: 'Kitco: Gold price at $4,158/oz after ISM Manufacturing PMI dips to 54.5, prices shoot higher', url: 'https://www.kitco.com/news/article/2026-10-01/gold-price-4158oz-after-ism-manufacturing-pmi-dips-545-prices-shoot-higher' },
      { title: 'Kitco: Gold, silver rise as jobless claims temper PCE-driven Fed repricing - Kitco AM Report', url: 'https://www.kitco.com/news/article/2026-10-01/gold-silver-rise-jobless-claims-temper-pce-driven-fed-repricing-kitco-am' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Rio Times: Gold price slips to US$4,156 as yields erase PCE lift', url: 'https://www.riotimesonline.com/gold-silver-precious-metals-thursday-october-1-2026/' },
      { title: 'Investing.com: Gold’s $4,100 test could decide whether the 2026 bull market holds', url: 'https://www.investing.com/analysis/golds-4100-test-could-decide-whether-the-2026-bull-market-holds-200688549' },
      { title: 'Bloomberg Technoz: Harga emas Antam malah turun saat emas dunia naik', url: 'https://www.bloombergtechnoz.com/detail-news/123415/harga-emas-antam-malah-turun-saat-emas-dunia-naik' },
      { title: 'Suara.com: Harga emas Antam anjlok lagi dibanderol Rp2.386.000/gram', url: 'https://www.suara.com/bisnis/2026/10/02/102143/buruan-beli-harga-emas-antam-anjlok-lagi-dibanderol-rp2386000gram' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-mixed-data-4100-test',
    category: 'market',
    title: {
      id: 'PCE Lunak, Emas Tetap Loyo: Data AS Campur Aduk dan Ujian $4.100 Jelang NFP',
      en: 'Soft PCE, Sluggish Gold: Mixed US Data and the $4,100 Test Ahead of Payrolls',
    },
    excerpt: {
      id: 'Inflasi PCE inti Agustus lebih jinak dari perkiraan, tapi PDB Q2 direvisi naik ke 2,2% dan ADP mencetak 90 ribu. Emas sempat melonjak ke $4.213 lalu memudar ke $4.150-an. Antam ikut turun Rp14.000 ke Rp2.581.000. Inilah yang membuat kabar baik belum cukup bagi emas.',
      en: 'August core PCE came in softer than expected, but Q2 GDP was revised up to 2.2% and ADP printed 90K. Gold spiked to $4,213, then faded to the $4,150s. Antam fell Rp14,000 to Rp2,581,000. Here is why good news is not yet enough for gold.',
    },
    sections: [
      {
        heading: { id: 'Hari Data yang Saling Bertabrakan', en: 'A Day of Colliding Data' },
        paragraphs: [
          {
            id: 'Rabu, 30 September, pasar menerima tiga rilis besar yang menunjuk ke arah berbeda. PCE inti Agustus, ukuran inflasi favorit The Fed, hanya naik 0,2% secara bulanan dan 3,0% tahunan, di bawah konsensus 0,3% dan 3,3%. PCE utama naik 3,4% tahunan, juga di bawah perkiraan 3,7%. Dari sisi inflasi, ini kabar yang ditunggu pemegang emas.',
            en: 'On Wednesday, September 30, markets received three major releases pointing in different directions. August core PCE, the Fed’s preferred inflation gauge, rose just 0.2% month-on-month and 3.0% year-on-year, below consensus of 0.3% and 3.3%. Headline PCE rose 3.4% year-on-year, also below the 3.7% forecast. On inflation alone, this was the news gold holders were waiting for.',
          },
          {
            id: 'Namun sisi pertumbuhan justru kuat. Estimasi ketiga PDB Q2 direvisi naik ke 2,2% dari 1,5%, dan ADP mencatat sektor swasta menambah 90 ribu pekerjaan di September, di atas perkiraan 70 ribu dan jauh dari 36 ribu bulan sebelumnya. Emas spot sempat melesat ke $4.213 saat PCE keluar, lalu memudar sepanjang sore. Pagi ini, Kamis 1 Oktober, harga berada di sekitar $4.152 menurut Bloomberg Technoz.',
            en: 'The growth side, however, was strong. The third Q2 GDP estimate was revised up to 2.2% from 1.5%, and ADP reported that the private sector added 90,000 jobs in September, above the 70,000 forecast and far above the prior month’s 36,000. Spot gold briefly jumped to $4,213 when PCE hit, then faded through the afternoon. This Thursday morning, October 1, it was near $4,152 according to Bloomberg Technoz.',
          },
        ],
      },
      {
        heading: { id: 'Mengapa Kabar Baik Belum Cukup', en: 'Why Good News Is Not Enough Yet' },
        paragraphs: [
          {
            id: 'PCE yang lunak memang menurunkan peluang kenaikan suku bunga Fed di Oktober ke sekitar 38% dari 51%. Tapi pasar tidak hanya membaca inflasi. Ekonomi yang tumbuh 2,2% dan pasar kerja yang kembali menggeliat memberi The Fed alasan untuk tetap waspada. Pengamat yang dikutip Kitco menyebutnya pesan campur aduk: pertumbuhan solid, tapi inflasi masih di atas 3%.',
            en: 'The soft PCE did cut the odds of an October Fed hike to about 38% from 51%. But markets read more than inflation. An economy growing 2.2% and a labor market picking up again give the Fed reason to stay vigilant. Commentators quoted by Kitco called it a mixed message: solid growth, but inflation still above 3%.',
          },
          {
            id: 'Beban terbesar emas adalah yield. Obligasi AS 10 tahun berada di 5,22%, tertinggi sejak Juli 2007. Artinya setiap $1.000 di obligasi menghasilkan $52,20 per tahun, sementara emas tidak memberi bunga sama sekali. Ditambah harga minyak yang tetap tinggi karena negosiasi AS-Iran belum menemui titik terang, inflasi berbasis energi terus menahan harapan pelonggaran.',
            en: 'Gold’s biggest burden is yields. The US 10-year Treasury sits at 5.22%, the highest since July 2007. That means every $1,000 in bonds earns $52.20 a year, while gold pays no interest at all. Add oil prices that stay elevated because US-Iran talks have made little progress, and energy-driven inflation keeps holding back hopes of easing.',
          },
        ],
      },
      {
        heading: { id: 'Ujian $4.100 dan Garis Merah $4.000', en: 'The $4,100 Test and the $4,000 Red Line' },
        paragraphs: [
          {
            id: 'Konteks besarnya tidak boleh dilupakan. Emas mencetak rekor di kisaran $5.590 sampai $5.608 pada Januari 2026, dan kini sekitar 26% di bawahnya. Dalam sebulan terakhir harga turun lebih dari 5%, meski masih sekitar 8% lebih tinggi dibanding setahun lalu. Ini koreksi dalam di dalam tren naik jangka panjang, bukan sekadar goyangan harian.',
            en: 'The bigger context must not be forgotten. Gold set a record in the $5,590 to $5,608 range in January 2026 and now sits about 26% below it. Over the past month the price has fallen more than 5%, though it is still about 8% higher than a year ago. This is a deep correction inside a long-term uptrend, not just a daily wobble.',
          },
          {
            id: 'Level yang diawasi pasar jelas. Support pertama di $4.100, lalu $4.000 yang dekat dengan titik terendah 25 Juni di $4.009. Penembusan bertahan di bawah $4.000 akan membentuk lower low dan menandai koreksi 2026 berubah menjadi fase bearish yang lebih dalam. Di atas, $4.300 menjadi resistance. Penentunya datang cepat: ISM Manufaktur dan klaim pengangguran hari ini, lalu Non-Farm Payrolls hari Jumat.',
            en: 'The levels markets are watching are clear. First support is $4,100, then $4,000, close to the June 25 low of $4,009. A sustained break below $4,000 would form a lower low and signal that the 2026 correction is turning into a deeper bearish phase. Above, $4,300 is resistance. The deciders come quickly: ISM Manufacturing and jobless claims today, then non-farm payrolls on Friday.',
          },
        ],
      },
      {
        heading: { id: 'Antam Turun, Brand Lain Lebih Murah', en: 'Antam Slips, Other Brands Are Cheaper' },
        paragraphs: [
          {
            id: 'Di dalam negeri, Antam membuka Oktober dengan koreksi. Harga 1 gram turun Rp14.000 ke Rp2.581.000, hampir menghapus kenaikan Rp15.000 kemarin. Buyback ikut turun Rp14.000 ke Rp2.391.000 per gram, sehingga spread tetap Rp190.000 atau sekitar 7,4% dari harga jual. Membeli lalu langsung menjual kembali masih berarti rugi lebih dari 7% sebelum biaya lain.',
            en: 'At home, Antam opened October with a correction. The 1-gram price fell Rp14,000 to Rp2,581,000, nearly erasing yesterday’s Rp15,000 gain. Buyback also fell Rp14,000 to Rp2,391,000 per gram, so the spread held at Rp190,000, about 7.4% of the selling price. Buying and selling straight back still means losing more than 7% before other costs.',
          },
          {
            id: 'Perbandingan brand memberi pilihan. Galeri24 1 gram dijual Rp2.527.000 dengan buyback Rp2.374.000, atau Rp54.000 lebih murah dari Antam dengan spread sekitar 6,1%. UBS dijual Rp2.552.000 dengan buyback Rp2.348.000, spread sekitar 8,0%. Untuk tabungan jangka panjang, selisih harga beli dan spread layak dibandingkan sebelum memilih brand.',
            en: 'The brand comparison offers choices. Galeri24’s 1-gram bar sells for Rp2,527,000 with a Rp2,374,000 buyback, Rp54,000 cheaper than Antam with a spread of about 6.1%. UBS sells for Rp2,552,000 with a Rp2,348,000 buyback, a spread of about 8.0%. For long-term saving, the purchase price and spread are worth comparing before choosing a brand.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: Tunggu Data, Tetap Disiplin', en: 'Playbook: Await the Data, Stay Disciplined' },
        paragraphs: [
          {
            id: 'Fondasi struktural emas belum berubah. Bank sentral membeli rekor 289 ton di Q2 2026, dan kepemilikan ETF emas bertambah 50 ton sepanjang September meski harga turun. Permintaan inilah yang menjadi bantal ketika yield dan dolar menekan dari atas.',
            en: 'Gold’s structural foundation has not changed. Central banks bought a record 289 tonnes in Q2 2026, and gold ETF holdings grew by 50 tonnes through September even as prices fell. This demand is the cushion when yields and the dollar press from above.',
          },
          {
            id: 'Bagi investor rupiah, minggu ini bukan waktu untuk menebak arah lewat satu transaksi besar. DCA dengan nominal tetap tetap paling masuk akal: jika NFP lemah dan emas memantul, Anda sudah punya posisi; jika NFP kuat dan $4.100 jebol, pembelian berikutnya lebih murah. Artikel ini analisis edukatif, bukan nasihat keuangan personal. Sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'For rupiah investors, this week is not the time to bet on direction with one large purchase. Fixed-amount DCA still makes the most sense: if payrolls disappoint and gold bounces, you already hold a position; if payrolls are strong and $4,100 breaks, your next purchase is cheaper. This article is educational analysis, not personalized financial advice. Tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Inflasi yang melunak tidak cukup selama yield bertahan di level tertinggi sejak 2007: emas butuh data yang dingin di semua lini, bukan hanya satu.',
      en: 'Softer inflation is not enough while yields hold at their highest since 2007: gold needs cool data across the board, not just one print.',
    },
    callout: 'rates',
    image: withBase('/article-mixed-data.png'),
    publishedAt: Date.parse('2026-10-01T03:30:00Z'),
    readMinutes: 6,
    author: TEAM,
    sources: [
      { title: 'Kitco: Gold price rockets to session highs as US economy rises 2.2% in Q2, PCE inflation rises 0.2% in August', url: 'https://www.kitco.com/news/article/2026-09-30/gold-price-rockets-session-highs-us-economy-rises-22-q2-pce-inflation-rises' },
      { title: 'IndexBox: ADP private employers add 90,000 jobs in September, beating expectations', url: 'https://www.indexbox.io/blog/adp-private-employers-add-90000-jobs-in-september-beating-expectations/' },
      { title: 'Trading Economics: Gold price', url: 'https://tradingeconomics.com/commodity/gold' },
      { title: 'Investing.com: Gold’s $4,100 test could decide whether the 2026 bull market holds', url: 'https://www.investing.com/analysis/golds-4100-test-could-decide-whether-the-2026-bull-market-holds-200688549' },
      { title: 'Gold Stock Canada: Post-market summary for precious metals, September 30, 2026', url: 'https://goldstockcanada.com/news/post-market-summary-for-precious-metals-september-30-2026-3313' },
      { title: 'Bloomberg Technoz: Harga emas Antam awali Oktober dengan koreksi', url: 'https://www.bloombergtechnoz.com/detail-news/123244/harga-emas-antam-awali-oktober-dengan-koreksi' },
      { title: 'Suara.com: Harga emas Antam merosot jadi Rp2.581.000/gram', url: 'https://www.suara.com/bisnis/2026/10/01/095801/kesempatan-beli-harga-emas-antam-merosot-jadi-rp2581000gram' },
      { title: 'Galeri 24: Harga emas hari ini', url: 'https://galeri24.co.id/harga-emas/' },
    ],
  },
  {
    slug: 'gold-rebound-triple-data',
    category: 'market',
    title: {
      id: 'Emas Rebound 1,6% ke $4.180: Titik Balik atau Jebakan? Triple Data AS Hari Ini Penentunya',
      en: 'Gold Rebounds 1.6% to $4,180: Turning Point or Trap? Today\u2019s US Data Triple-Header Decides',
    },
    excerpt: {
      id: 'Setelah crash 4%, emas memantul dua hari beruntun ke $4.180,54 dengan futures di $4.212. Tapi harga masih di bawah EMA50 dan RSI sudah overbought. Triple data AS hari ini — ADP, PDB Q2, dan PCE — menentukan apakah ini titik balik atau dead cat bounce.',
      en: 'After a 4% crash, gold has bounced two days straight to $4,180.54 with futures at $4,212. But price remains below the 50-day EMA and RSI is already overbought. Today\u2019s US data triple-header — ADP, Q2 GDP, and PCE — decides whether this is a turning point or a dead cat bounce.',
    },
    sections: [
      {
        heading: { id: 'Tiga Hari yang Menguji Nyali', en: 'Three Days That Tested Nerves' },
        paragraphs: [
          {
            id: 'Kronologinya cepat dan brutal. Senin, 28 September, emas spot crash sekitar 4% hingga menyentuh $4.139,69 — kejatuhan harian terdalam dalam berbulan-bulan. Selasa, tekanan mereda dan harga rebound 0,7% ke $4.142,89. Rabu pagi ini, 30 September, pantulan berlanjut sekitar 1,6% ke $4.180,54, dengan futures naik 0,8% ke $4.212,01.',
            en: 'The sequence was fast and brutal. On Monday, September 28, spot gold crashed around 4% to touch $4,139.69 — the deepest daily drop in months. On Tuesday, pressure eased and price rebounded 0.7% to $4,142.89. This Wednesday morning, September 30, the bounce extended roughly 1.6% to $4,180.54, with futures up 0.8% at $4,212.01.',
          },
          {
            id: 'Pemicunya bukan berita emas, melainkan pasar energi: harga minyak yang turun meredakan kekhawatiran inflasi dan sedikit mengendurkan ekspektasi kenaikan suku bunga Fed. Masalahnya, bantalan ini rapuh — yield obligasi tetap tinggi, sehingga rebound berjalan di atas fondasi yang belum benar-benar membaik.',
            en: 'The trigger was not gold news but the energy market: falling oil prices eased inflation worries and slightly loosened expectations of a Fed rate hike. The problem is that this cushion is fragile — bond yields remain high, so the rebound is running on a foundation that has not truly improved.',
          },
        ],
      },
      {
        heading: { id: 'Mengapa Rebound Ini Belum Aman', en: 'Why This Rebound Is Not Safe Yet' },
        paragraphs: [
          {
            id: 'Secara teknikal, tren jangka pendek masih bearish. Harga masih berada di bawah EMA50, dan RSI intraday justru sudah overbought setelah dua hari memantul — kombinasi yang membuat rebound rawan kehilangan momentum tepat saat ritel mulai berani masuk. Level yang perlu diawasi: support $4.157, lalu $4.100, dan terakhir $4.000; resistance $4.313 lalu $4.400.',
            en: 'Technically, the short-term trend is still bearish. Price remains below the 50-day EMA, and intraday RSI is already overbought after two days of bouncing — a combination that makes the rebound prone to losing momentum just as retail traders get brave. Levels to watch: support at $4,157, then $4,100, and finally $4,000; resistance at $4,313 then $4,400.',
          },
          {
            id: 'Latar makronya juga belum berubah. DXY bertengger di sekitar 101,40 — tertinggi sejak Juli. Yield 10-tahun AS menembus di atas 5% ke 5,106%, level tertinggi sejak 2007, dan peluang kenaikan Fed Oktober sempat menyentuh 70,9% pekan lalu. Tak heran para strategis menegaskan: pandangan bearish baru batal jika emas mampu ditutup di atas $4.400 — jauh dari harga sekarang.',
            en: 'The macro backdrop has not changed either. The DXY sits around 101.40 — its highest since July. The 10-year US yield broke above 5% to 5.106%, the highest since 2007, and odds of an October Fed hike touched 70.9% last week. No wonder strategists insist: the bearish view is only invalidated on a close above $4,400 — a long way from current prices.',
          },
        ],
      },
      {
        heading: { id: 'Triple Data Hari Ini: ADP, PDB, PCE', en: 'Today\u2019s Triple-Header: ADP, GDP, PCE' },
        paragraphs: [
          {
            id: 'Rabu ini pasar menghadapi tiga rilis sekaligus. ADP September (sebelumnya hanya 38 ribu, terlemah sejak Januari) menguji seberapa cepat pasar tenaga kerja mendingin. Estimasi ketiga PDB Q2 (sebelumnya 1,5%) memastikan apakah ekonomi benar-benar melambat. Dan PCE Agustus (sebelumnya 3,7%, core 3,3%) menjadi ukuran inflasi favorit The Fed menjelang keputusan Oktober.',
            en: 'This Wednesday, markets face three releases at once. September ADP (previously just 38K, the weakest since January) tests how fast the labor market is cooling. The third Q2 GDP estimate (previously 1.5%) confirms whether the economy is truly slowing. And August PCE (previously 3.7%, core 3.3%) is the Fed\u2019s preferred inflation gauge ahead of the October decision.',
          },
          {
            id: 'Skenarionya dua arah dan tegas. Jika data panas — ADP kuat, PDB direvisi naik, PCE lengket — ekspektasi kenaikan Oktober menguat, dolar dan yield naik, dan emas berisiko menembus $4.157 menuju $4.100 lalu $4.000. Jika data dingin, rebound bisa berlanjut ke resistance $4.313, bahkan menguji $4.400. Dan ini belum final: besok ada jobless claims dan PMI, lalu Jumat NFP (sebelumnya 162 ribu, unemployment 4,1%).',
            en: 'The scenarios are two-sided and clear-cut. If data runs hot — strong ADP, an upward GDP revision, sticky PCE — October hike expectations firm up, the dollar and yields rise, and gold risks breaking $4,157 toward $4,100 then $4,000. If data runs cold, the rebound could extend to $4,313 resistance, even testing $4,400. And this is not the finale: jobless claims and PMI land tomorrow, then Friday\u2019s NFP (previously 162K, unemployment 4.1%).',
          },
        ],
      },
      {
        heading: { id: 'Antam Ikut Memantul', en: 'Antam Bounces Along' },
        paragraphs: [
          {
            id: 'Harga dasar Antam 1 gram naik Rp15.000 ke Rp2.595.000 pada Rabu pagi — rebound tepat sehari setelah mencetak Rp2.580.000, level terendah sejak 9 Januari 2026. Harga buyback ikut naik Rp30.000 ke Rp2.405.000 per gram, sehingga spread jual–buyback mengecil ke Rp190.000 dari Rp205.000 kemarin — biaya transaksi sedikit lebih bersahabat.',
            en: 'Antam\u2019s 1-gram base price rose Rp15,000 to Rp2,595,000 on Wednesday morning — a rebound just one day after printing Rp2,580,000, its lowest since January 9, 2026. The buyback price also climbed Rp30,000 to Rp2,405,000 per gram, narrowing the sell–buyback spread to Rp190,000 from Rp205,000 yesterday — transaction costs just got a bit friendlier.',
          },
          {
            id: 'Faktor kurs masih bekerja dua arah. Rupiah bertahan di kisaran Rp17.942–18.000 per dolar, menahan penurunan harga emas versi rupiah agar lebih dangkal dari versi dolar. Bagi pemegang IDR ini bantal; tapi ingat, jika rupiah menguat saat harga dunia masih tertekan, diskon domestik bisa muncul lagi.',
            en: 'The exchange-rate factor still cuts both ways. The rupiah is holding around Rp17,942–18,000 per dollar, keeping the rupiah-denominated gold decline shallower than the dollar one. For IDR holders this is a cushion; but remember, if the rupiah strengthens while world prices stay under pressure, a domestic discount can reappear.',
          },
        ],
      },
      {
        heading: { id: 'Playbook: DCA, Bukan All-In', en: 'Playbook: DCA, Not All-In' },
        paragraphs: [
          {
            id: 'Bantal struktural emas tidak hilang karena satu minggu yang buruk. Bank sentral global membeli 289 ton di Q2 2026 — rekor kuartalan, naik 62% year-on-year. Goldman Sachs mempertahankan target $4.650 untuk akhir 2026, dan proyeksi 12 bulan Trading Economics berada di $4.705. Rebound dua hari ini bisa jadi awal pemulihan, bisa jadi jebakan — pasar sendiri belum tahu sebelum data keluar.',
            en: 'Gold\u2019s structural cushion did not vanish because of one bad week. Global central banks bought 289 tonnes in Q2 2026 — a quarterly record, up 62% year-on-year. Goldman Sachs holds its $4,650 target for end-2026, and Trading Economics\u2019 12-month projection sits at $4,705. This two-day rebound could be the start of a recovery or a trap — the market itself will not know until the data lands.',
          },
          {
            id: 'Karena itu strategi paling rasional tetap sama: DCA terjadwal dengan nominal tetap, bukan all-in menebak titik balik. Jika triple data hari ini dingin, Anda sudah punya posisi; jika panas dan harga menembus $4.100, pembelian berikutnya justru lebih murah. Artikel ini analisis edukatif, bukan nasihat keuangan personal — sesuaikan dengan profil risiko dan horizon Anda.',
            en: 'That is why the most rational strategy stays the same: scheduled DCA with a fixed amount, not all-in bets on a turning point. If today\u2019s triple-header runs cold, you already hold a position; if it runs hot and price breaks $4,100, your next purchase simply gets cheaper. This article is educational analysis, not personalized financial advice — tailor it to your own risk profile and horizon.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Rebound dua hari bukan titik balik sampai data membuktikannya — pasar yang overbought di bawah EMA50 adalah pasar yang rawan jebakan.',
      en: 'A two-day rebound is not a turning point until the data proves it — an overbought market below the 50-day EMA is a market prone to traps.',
    },
    callout: 'rates',
    image: withBase('/article-rebound-data.png'),
    publishedAt: Date.parse('2026-09-30T03:30:00Z'),
    readMinutes: 6,
    author: TEAM,
  },
  {
    slug: 'antam-terendah-rupiah-18000',
    category: 'market',
    title: {
      id: 'Antam Sentuh Rp2,58 Juta — Terendah Sejak Januari. Saatnya Akumulasi?',
      en: 'Antam Hits Rp2.58M — Lowest Since January. Time to Accumulate?',
    },
    excerpt: {
      id: 'Harga Antam turun Rp17.000 ke Rp2.580.000 per gram — terendah sejak 9 Januari 2026 dan 18,6% di bawah rekor. Kabar baiknya: rupiah yang mendekati Rp18.000 menahan penurunan versi rupiah lebih dangkal. Begini cara membacanya.',
      en: 'Antam fell Rp17,000 to Rp2,580,000 per gram — the lowest since January 9, 2026 and 18.6% below its record. The silver lining: a rupiah nearing Rp18,000 keeps the rupiah-denominated decline shallower. Here is how to read it.',
    },
    sections: [
      {
        heading: { id: 'Apa yang Terjadi Hari Ini', en: 'What Happened Today' },
        paragraphs: [
          {
            id: 'Selasa pagi, 29 September 2026, harga dasar emas Antam 1 gram resmi turun Rp17.000 ke Rp2.580.000 — meneruskan penurunan dari Rp2.613.000 (26 Sep) dan Rp2.597.000 (28 Sep). Ini adalah level terendah Antam sejak 9 Januari 2026, dan berarti harga kini terpangkas 18,6% dari rekor tertinggi sepanjang masa Rp3.168.000 yang tercetak 29 Januari lalu.',
            en: 'On Tuesday morning, September 29, 2026, Antam\u2019s 1-gram base price officially fell Rp17,000 to Rp2,580,000 — extending the slide from Rp2,613,000 (Sep 26) and Rp2,597,000 (Sep 28). This is Antam\u2019s lowest level since January 9, 2026, and means the price is now 18.6% below its all-time high of Rp3,168,000 set on January 29.',
          },
          {
            id: 'Yang tak kalah penting: harga buyback ikut anjlok Rp47.000 ke Rp2.375.000. Galeri24 bernasib serupa — turun Rp22.000 ke Rp2.527.000 per gram dengan buyback Rp2.379.000. Koreksi ini bukan fenomena satu merek, melainkan penyesuaian seluruh pasar emas fisik domestik terhadap jatuhnya harga dunia.',
            en: 'Just as important: the buyback price plunged Rp47,000 to Rp2,375,000. Galeri24 fared similarly — down Rp22,000 to Rp2,527,000 per gram with a buyback of Rp2,379,000. This correction is not a single-brand phenomenon but a market-wide adjustment of domestic physical gold to falling global prices.',
          },
        ],
      },
      {
        heading: { id: 'Dua Mesin Penurunan — Satu Bantal Lokal', en: 'Two Engines of Decline — One Local Cushion' },
        paragraphs: [
          {
            id: 'Mesin pertama berada di pasar global. Emas spot anjlok 2,95% ke $4.159,92 pada 28 September — total -6,65% dalam sebulan dan -18% lebih dari ATH $5.597. Penyebabnya: The Fed yang hawkish di bawah Kevin Warsh, dolar AS yang kuat, dan — seperti dicatat WSJ — reli minyak yang justru memperkuat ekspektasi kenaikan suku bunga Oktober, membuat futures emas jatuh 3% dalam sehari.',
            en: 'The first engine sits in global markets. Spot gold plunged 2.95% to $4,159.92 on September 28 — down 6.65% over the month and over 18% from its $5,597 ATH. The causes: a hawkish Fed under Kevin Warsh, a strong US dollar, and — as the WSJ noted — an oil rally that is actually strengthening expectations of an October rate hike, sending gold futures down 3% in a day.',
          },
          {
            id: 'Mesin kedua justru bekerja melawan arah di Indonesia. Rupiah melemah mendekati Rp18.000 per dolar (penutupan 28 Sep) di tengah ambruknya IHSG ke 6.147 dan net sell asing Rp1,13 triliun. Karena harga emas domestik dihitung dari harga dunia dikali kurs, rupiah yang lemah menahan penurunan versi rupiah: andai rupiah stabil di 17.500, harga Antam hari ini bisa lebih murah lagi. Bagi pembeli IDR, ini bantal — sekaligus pengingat bahwa koreksi belum tentu selesai jika rupiah menguat kembali.',
            en: 'The second engine works in the opposite direction in Indonesia. The rupiah weakened toward Rp18,000 per dollar (September 28 close) as the JCI tumbled to 6,147 on Rp1.13 trillion of foreign net selling. Because domestic gold prices are global prices times the exchange rate, a weak rupiah cushions the rupiah-denominated decline: had the rupiah held at 17,500, Antam would be even cheaper today. For IDR buyers this is a cushion — and a reminder that the correction may not be over if the rupiah strengthens again.',
          },
        ],
      },
      {
        heading: { id: 'Membaca Spread Rp205 Ribu yang Melebar', en: 'Reading the Widening Rp205K Spread' },
        paragraphs: [
          {
            id: 'Dengan harga jual Rp2.580.000 dan buyback Rp2.375.000, spread transaksi Antam kini Rp205.000 per gram — sekitar 7,9% dari harga jual. Artinya, jika Anda membeli hari ini dan langsung menjualnya kembali, Anda otomatis rugi hampir 8% sebelum biaya lain. Spread yang melebar di pasar volatile adalah cara gerai melindungi diri dari ayunan harga harian.',
            en: 'With a selling price of Rp2,580,000 and a buyback of Rp2,375,000, Antam\u2019s transaction spread is now Rp205,000 per gram — about 7.9% of the selling price. In other words, buying today and selling straight back locks in a loss of nearly 8% before any other costs. A widening spread in volatile markets is how dealers protect themselves from daily price swings.',
          },
          {
            id: 'Pelajarannya klasik namun sering dilupakan saat pasar merah: emas fisik adalah permainan jangka panjang, bukan trading harian. Investor yang panik menjual di fase seperti ini membayar dua kali — harga yang sedang turun dan spread yang sedang lebar. Sebaliknya, horizon multi-tahun membuat spread Rp205 ribu relatif kecil dibanding potensi apresiasi.',
            en: 'The lesson is classic but easily forgotten when markets are red: physical gold is a long-term game, not day trading. Investors who panic-sell in phases like this pay twice — a falling price and a wide spread. Conversely, a multi-year horizon makes a Rp205K spread relatively small against potential appreciation.',
          },
        ],
      },
      {
        heading: { id: 'Data yang Menahan Kejatuhan Lebih Dalam', en: 'The Data Holding Back a Deeper Fall' },
        paragraphs: [
          {
            id: 'Fondasi struktural emas belum runtuh. Permintaan bank sentral global tetap kuat di rata-rata sekitar 91 ton per bulan — naik drastis dari sekitar 17 ton per bulan sebelum 2022. Goldman Sachs pun tetap mematok target $4.650 untuk akhir 2026, jauh di atas harga spot hari ini.',
            en: 'Gold\u2019s structural foundation has not collapsed. Global central-bank demand remains strong at roughly 91 tonnes per month on average — up sharply from about 17 tonnes per month before 2022. Goldman Sachs also still targets $4,650 by end-2026, well above today\u2019s spot price.',
          },
          {
            id: 'Dalam jangka sangat pendek, arah ditentukan hari ini: rilis JOLTS dan CB Consumer Confidence (29 Sep) akan menguji apakah support $4.157 bertahan. Data tenaga kerja yang kuat memperbesar peluang tembus ke $4.000; data yang melemah bisa memicu pantulan menuju resistance $4.313 lalu $4.441. Besok menyusul ADP dan PDB Q2, lalu PMI pada 1 Oktober.',
            en: 'In the very short term, direction is decided today: the JOLTS and CB Consumer Confidence releases (Sep 29) will test whether $4,157 support holds. Strong labor data raises the odds of a break toward $4,000; weak data could spark a rebound toward resistance at $4,313 and then $4,441. ADP and Q2 GDP follow tomorrow, then PMI on October 1.',
          },
        ],
      },
      {
        heading: { id: 'Playbook Investor Ritel', en: 'The Retail Investor\u2019s Playbook' },
        paragraphs: [
          {
            id: 'Pertama, akumulasi bertahap (DCA) terjadwal tetap strategi paling masuk akal: alih-alih menebak titik dasar, beli dalam nominal tetap setiap periode sehingga harga rata-rata ikut turun saat pasar koreksi. Kedua, pecah ukuran gram sesuai bujet — denominasi kecil membuat jadwal DCA lebih fleksibel meski premi per gramnya sedikit lebih tinggi.',
            en: 'First, scheduled gradual accumulation (DCA) remains the most sensible strategy: rather than guessing the bottom, buy a fixed amount every period so your average cost falls as the market corrects. Second, split gram sizes to fit your budget — smaller denominations make a DCA schedule more flexible even if the per-gram premium is slightly higher.',
          },
          {
            id: 'Ketiga, bandingkan sebelum membeli: hari ini Antam Rp2.580.000 versus Galeri24 Rp2.527.000 — selisih lebih dari Rp50.000 per gram dengan kualitas 99,99% yang sama. Pantau juga harga spot IDR live di situs kami untuk melihat seberapa jauh premi fisik dari harga dunia.',
            en: 'Third, compare before you buy: today Antam is Rp2,580,000 versus Galeri24 at Rp2,527,000 — a gap of over Rp50,000 per gram for the same 99.99% purity. Also track our site\u2019s live IDR spot price to see how far the physical premium stretches above world prices.',
          },
          {
            id: 'Artikel ini adalah analisis edukatif, bukan nasihat keuangan personal. Harga emas bisa bergerak tajam dua arah — sesuaikan keputusan dengan profil risiko, horizon investasi, dan kondisi keuangan Anda masing-masing.',
            en: 'This article is educational analysis, not personalized financial advice. Gold prices can move sharply in either direction — tailor any decision to your own risk profile, investment horizon, and financial situation.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Rupiah yang mendekati Rp18.000 adalah bantal sekaligus peringatan: penurunan Antam lebih dangkal dari emas dunia, tetapi belum tentu selesai.',
      en: 'A rupiah nearing Rp18,000 is both a cushion and a warning: Antam\u2019s decline is shallower than world gold\u2019s, but it may not be over.',
    },
    callout: 'dca',
    image: withBase('/article-antam-rupiah.png'),
    publishedAt: Date.parse('2026-09-29T04:00:00Z'),
    readMinutes: 6,
    author: TEAM,
  },
  {
    slug: 'gold-pullback-data-week-ahead',
    category: 'market',
    title: {
      id: 'Emas Turun ke $4.200-an: Pekan Data AS yang Menentukan Arah Selanjutnya',
      en: 'Gold Falls to the $4,200s: The US Data Week That Will Decide What Comes Next',
    },
    excerpt: {
      id: 'Konsolidasi dua minggu di $4.300–4.400 pecah: emas turun 1,7% ke $4.211 dan -5% dalam sebulan. Pekan ini, JOLTS, ADP, PDB, dan PMI akan menentukan apakah ini koreksi sehat atau awal penurunan lebih dalam.',
      en: 'The two-week $4,300–4,400 consolidation has broken: gold fell 1.7% to $4,211 and is down 5% over the month. This week, JOLTS, ADP, GDP, and PMI will decide whether this is a healthy correction or the start of a deeper slide.',
    },
    sections: [
      {
        heading: { id: 'Konsolidasi Pecah ke Bawah', en: 'The Consolidation Breaks Lower' },
        paragraphs: [
          {
            id: 'Setelah dua minggu bergerak sideways di kisaran $4.300–4.400, emas akhirnya menyerah. Pada perdagangan Senin (28 September) pagi, spot merosot 1,71% ke $4.211,74 — kembali diperdagangkan di sekitar $4.253 setelahnya, tetapi kerusakan teknis sudah terjadi. Total penurunan sebulan kini mencapai 5,17%, meski secara year-on-year harga masih unggul 9,87%.',
            en: 'After two weeks of sideways trading in the $4,300–4,400 range, gold finally gave way. In Monday morning trade (September 28), spot fell 1.71% to $4,211.74 — it has since recovered to around $4,253, but the technical damage is done. The monthly decline now totals 5.17%, even as prices remain up 9.87% year-on-year.',
          },
          {
            id: 'Kontrak futures Desember yang dibuka di $4.309,50 pada 25 September kini tertinggal jauh di belakang harga pasar, tanda bahwa ekspektasi telah direvisi turun cepat. Level $4.200 menjadi garis pertahanan pertama yang diuji hari ini.',
            en: 'December futures, which opened at $4,309.50 on September 25, now sit far below where the market expects prices to settle — a sign that expectations have been revised down fast. The $4,200 level becomes the first line of defense being tested today.',
          },
        ],
      },
      {
        heading: { id: 'Trio Penekan Harga', en: 'A Trio of Price Pressures' },
        paragraphs: [
          {
            id: 'Ada tiga kekuatan makro yang menekan emas secara bersamaan. Pertama, dolar AS yang menguat — emas dalam denominasi dolar otomatis lebih mahal bagi pembeli global. Kedua, yield Treasury AS yang berada di level tertinggi hampir dua dekade, membuat obligasi jadi pesaing serius aset tanpa imbal hasil. Ketiga, the Fed yang ternyata lebih hawkish dari dugaan: setelah menaikkan suku bunga 25 basis poin ke 3,75–4,00% pada 16 September di bawah ketua baru Kevin Warsh, dot plot median mematok 4,1% untuk akhir 2026, dan 16 dari 18 pejabat memproyeksikan setidaknya satu kenaikan lagi.',
            en: 'Three macro forces are pressing gold at once. First, a stronger US dollar — dollar-denominated gold automatically becomes pricier for global buyers. Second, Treasury yields at near two-decade highs, making bonds a serious rival to a zero-yield asset. Third, a Fed that turned out more hawkish than expected: after raising rates 25 basis points to 3.75–4.00% on September 16 under new Chair Kevin Warsh, the median dot plot pins 4.1% for end-2026, and 16 of 18 officials project at least one more hike.',
          },
          {
            id: 'Akibatnya, CME FedWatch kini mematok sekitar 69% peluang kenaikan lagi pada FOMC 27–28 Oktober. Di saat yang sama, premi geopolitik menyusut: KTT AS–China berakhir pada 25 September, dan pembicaraan AS–Iran membuka harapan Selat Hormuz kembali normal — menggerus permintaan safe-haven meski minyak bertahan di atas $100 per barel dan diesel mencetak rekor $6,31 per galon.',
            en: 'As a result, CME FedWatch now prices roughly 69% odds of another hike at the October 27–28 FOMC. At the same time, the geopolitical premium is shrinking: the US–China summit wrapped up on September 25, and US–Iran talks have raised hopes of the Strait of Hormuz reopening — eroding safe-haven demand even as oil holds above $100 a barrel and diesel hits a record $6.31 a gallon.',
          },
        ],
      },
      {
        heading: { id: 'Kalender Pekan Ini: Empat Rilis Penentu', en: 'This Week\u2019s Calendar: Four Decisive Releases' },
        paragraphs: [
          {
            id: 'Pekan ini padat data dan setiap rilis berpotensi menggerakkan emas dua arah. Selasa 29 September: CB Consumer Confidence dan JOLTS Agustus — lowongan kerja yang masih tinggi akan memperkuat argumen Fed untuk mengetat. Rabu 30 September: laporan pekerjaan ADP September dan PDB Q2 AS, dua pengukur langsung kekuatan ekonomi. Kamis 1 Oktober: jobless claims mingguan dan PMI manufaktur September sebagai penutup.',
            en: 'This week is packed with data, and each release can move gold in either direction. Tuesday, September 29: CB Consumer Confidence and August JOLTS — still-elevated job openings would strengthen the Fed\u2019s case for tightening. Wednesday, September 30: the September ADP employment report and Q2 US GDP, two direct gauges of economic strength. Thursday, October 1: weekly jobless claims and September manufacturing PMI to close it out.',
          },
          {
            id: 'Skenarionya sederhana. Jika data ternyata kuat — pasar tenaga kerja ketat, ekonomi tangguh — pasar akan semakin yakin Fed menaikkan suku bunga Oktober, dan emas berisiko menembus support $4.200 menuju $4.157, bahkan $4.000. Sebaliknya, data yang melemah bisa memangkas odds kenaikan itu dan memicu pantulan ke resistance $4.313, lalu $4.376 dan $4.441.',
            en: 'The scenarios are simple. If the data comes in strong — a tight labor market, a resilient economy — markets will grow more convinced the Fed hikes in October, and gold risks breaking $4,200 support toward $4,157 and even $4,000. Conversely, weak data could slash those hike odds and spark a rebound toward resistance at $4,313, then $4,376 and $4,441.',
          },
          {
            id: 'Yang patut dicatat, 60-day moving average sudah membuktikan diri: pada 16 September ia menahan penurunan tepat di titik terendah $4.235. Garis itu kini kembali menjadi wasit teknikal utama pekan ini.',
            en: 'Notably, the 60-day moving average has already proven itself: on September 16 it contained the decline right at the $4,235 low. That line is once again the key technical referee this week.',
          },
        ],
      },
      {
        heading: { id: 'Yang Menahan dari Jatuh Lebih Dalam', en: 'What\u2019s Keeping the Floor Intact' },
        paragraphs: [
          {
            id: 'Di balik tekanan jangka pendek, fondasi struktural emas belum runtuh. Bank sentral global membeli rekor 288,9 ton pada Q2 2026 — diversifikasi cadangan devisa dari dolar terus berjalan apapun keputusan Fed.',
            en: 'Beneath the short-term pressure, gold\u2019s structural foundation has not collapsed. Global central banks bought a record 288.9 tonnes in Q2 2026 — reserve diversification away from the dollar continues regardless of what the Fed does.',
          },
          {
            id: 'Target institusional pun masih jauh di atas harga sekarang. Goldman Sachs memang merevisi turun proyeksi akhir 2026 ke $4.650 (dari $4.900) pasca kenaikan Fed, tetapi itu tetap menyiratkan kenaikan sekitar 10% dari level hari ini. JPMorgan mematok $4.500 untuk Q4, dan model Trading Economics memproyeksikan $4.289 di akhir kuartal ini serta $4.705 dalam 12 bulan.',
            en: 'Institutional targets also remain well above current prices. Goldman Sachs did cut its end-2026 projection to $4,650 (from $4,900) after the Fed hike, but that still implies roughly 10% upside from today\u2019s level. JPMorgan pegs Q4 at $4,500, and Trading Economics\u2019 model projects $4,289 by quarter-end and $4,705 over 12 months.',
          },
        ],
      },
      {
        heading: { id: 'Sudut Investor Indonesia', en: 'The Indonesian Investor\u2019s Angle' },
        paragraphs: [
          {
            id: 'Di pasar domestik, koreksi ikut terasa: harga dasar Antam turun dua hari beruntun dari Rp2.630.000 (23 September) ke Rp2.590.000 (25 September), sebelum rebound Rp23.000 ke Rp2.613.000 pada 26 September — dengan buyback di Rp2.438.000. Jarak dari rekor Rp3.168.000 (29 Januari 2026) kini sekitar 17%.',
            en: 'Domestically, the correction is being felt too: Antam\u2019s base price fell two straight days from Rp2,630,000 (September 23) to Rp2,590,000 (September 25), before rebounding Rp23,000 to Rp2,613,000 on September 26 — with buyback at Rp2,438,000. It now sits roughly 17% below the Rp3,168,000 record (January 29, 2026).',
          },
          {
            id: 'Bagi investor jangka panjang, koreksi 5% dalam sebulan lebih tepat dibaca sebagai window akumulasi bertahap (dollar-cost averaging), bukan alasan panik — terutama selama support $4.200 dan $4.157 bertahan. Namun pekan ini volatilitas akan tinggi, jadi disiplin porsi lebih penting dari timing. Konten ini bersifat edukatif dan bukan saran keuangan.',
            en: 'For long-term investors, a 5% monthly correction is better read as a window for gradual accumulation (dollar-cost averaging), not a reason to panic — especially while $4,200 and $4,157 support holds. That said, this week\u2019s volatility will be high, so position discipline matters more than timing. This content is educational and not financial advice.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Data kuat bisa menyeret emas ke $4.000; data lemah bisa memantulkannya ke $4.441. Pekan ini, kalender ekonomi-lah wasitnya.',
      en: 'Strong data could drag gold toward $4,000; weak data could rebound it to $4,441. This week, the economic calendar is the referee.',
    },
    callout: 'rates',
    image: withBase('/article-data-week.png'),
    publishedAt: Date.parse('2026-09-28T02:30:00Z'),
    readMinutes: 6,
    author: TEAM,
  },
  {
    slug: 'gold-futures-curve-after-fed-hike',
    category: 'market',
    title: {
      id: 'Seminggu Pasca Kenaikan Fed: Apa yang Dikatakan Kurva Futures Emas?',
      en: "One Week After the Fed Hike: What Gold's Futures Curve Is Saying",
    },
    excerpt: {
      id: 'Debu pasca kenaikan suku bunga mulai turun dan pasar berjangka memberi sinyal langka: kurva menanjak rapi hingga 2027. Kami bedah artinya — plus mengapa JPMorgan dan Goldman tidak sepakat.',
      en: 'The dust from the rate hike is settling and the futures market is sending a rare signal: a clean upward slope into 2027. We break down what it means — plus why JPMorgan and Goldman disagree.',
    },
    sections: [
      {
        heading: { id: 'Debu Pasca-Keputusan Mulai Turun', en: 'The Post-Decision Dust Is Settling' },
        paragraphs: [
          {
            id: 'Seminggu setelah FOMC menaikkan suku bunga 25 basis poin ke 3,75–4,00% pada 16 September — kenaikan pertama dalam tiga tahun — emas berhenti jatuh. Spot diperdagangkan di sekitar $4.347 pada 23 September, memantul dari titik terendah mingguan $4.290. Koreksi sebulan memang masih sekitar 6%, tetapi penurunan harian sudah terhenti: pola klasik "jual rumor, beli berita".',
            en: 'One week after the FOMC raised rates by 25 basis points to 3.75–4.00% on September 16 — the first hike in three years — gold has stopped falling. Spot traded near $4,347 on September 23, rebounding from a weekly low of $4,290. The monthly correction is still around 6%, but the daily slide has halted: the classic "sell the rumor, buy the news" pattern.',
          },
          {
            id: 'Pola ini konsisten dengan sejarah. Emas biasanya tertekan menjelang keputusan Fed yang tidak pasti — posisi berjangka sempat sangat padat, sekitar 228 ribu kontrak net long, memasuki rapat lalu — lalu stabil begitu ketidakpastian hilang. Bahkan sehari setelah pengumuman, emas justru ditutup menguat 2,4% karena dolar melemah. Kejutan hawkish telah sepenuhnya tercerna harga.',
            en: 'The pattern is consistent with history. Gold typically sells off ahead of an uncertain Fed decision — futures positioning was crowded at roughly 228,000 net-long contracts going into the meeting — then stabilizes once uncertainty clears. A day after the announcement, gold actually closed up 2.4% as the dollar weakened. The hawkish surprise has been fully digested.',
          },
        ],
      },
      {
        heading: { id: 'Kurva Futures Sedang Bicara', en: 'The Futures Curve Is Talking' },
        paragraphs: [
          {
            id: 'Pasar berjangka memberikan sinyal yang jarang disorot media: kurva emas berada dalam contango yang rapi. Kontrak Desember 2026 dihargai $4.400, Januari 2027 $4.426, dan Mei 2027 $4.469 — setiap bulan berturut-turut lebih mahal. Dengan kata lain, uang institusional memproyeksikan pemulihan bertahap, bukan koreksi yang berlanjut.',
            en: 'The futures market is sending a signal the headlines rarely highlight: gold\u2019s curve sits in clean contango. December 2026 trades at $4,400, January 2027 at $4,426, and May 2027 at $4,469 — each successive month priced higher. In plain terms, institutional money projects a gradual recovery, not a continued decline.',
          },
          {
            id: 'Namun contango bukan kepastian. Perbedaan target antarbank sedang selebar-lebarnya: JPMorgan membidik $6.300 untuk akhir 2026 sementara Goldman Sachs $5.400 — selisih $900 yang menunjukkan betapa tidak pastinya lanskap makro saat ini. Yang bisa diambil dari kurva futures adalah arah, bukan jadwal; dan arahnya saat ini menanjak.',
            en: 'Contango is not certainty, though. The spread between bank targets is at its widest: JPMorgan targets $6,300 for year-end 2026 while Goldman Sachs models $5,400 — a $900 gap that shows how unsettled the macro landscape is. What the curve offers is direction, not a schedule; and right now it slopes upward.',
          },
        ],
      },
      {
        heading: { id: 'Bagi Investor Indonesia', en: 'For Indonesian Investors' },
        paragraphs: [
          {
            id: 'Dalam rupiah, harga emas bertahan di kisaran Rp2,49 juta per gram dengan kurs USD/IDR di 17.820. Fase sideways seperti ini secara historis justru fase paling produktif bagi penabung DCA: volatilitas mereda, dan setiap pembelian rutin memperbaiki harga rata-rata kepemilikan tanpa perlu menebak arah pasar.',
            en: 'In rupiah terms, gold is holding around Rp2.49 million per gram with USD/IDR at 17,820. Sideways phases like this have historically been the most productive for DCA savers: volatility cools, and every routine purchase improves average cost without needing to call market direction.',
          },
          {
            id: 'Yang patut diawasi minggu ini: data inflasi PCE AS berikutnya dan nada para pejabat Fed pasca-kenaikan. Selama harga bertahan di atas titik terendah minggu ini di $4.290, struktur pemulihan belum rusak. Gunakan kalkulator EmasKuy untuk menguji skenario Anda pada harga live hari ini — angka konkret selalu lebih berguna daripada headline.',
            en: 'What to watch this week: the next US PCE inflation print and the tone of Fed officials post-hike. As long as price holds above this week\u2019s $4,290 low, the recovery structure remains intact. Use the EmasKuy calculator to test your own scenario at today\u2019s live price — concrete numbers always beat headlines.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Kurva futures memberi arah, bukan jadwal — dan arahnya saat ini menanjak.',
      en: 'The futures curve gives direction, not a schedule — and right now it slopes upward.',
    },
    callout: 'rally',
    image: withBase('/article-gold-rally.png'),
    publishedAt: Date.parse('2026-09-23T08:00:00Z'),
    readMinutes: 6,
    author: TEAM,
  },
  {
    slug: 'fed-first-hike-gold-holds-4300',
    category: 'macro',
    title: {
      id: 'Fed Naikkan Suku Bunga Pertama Kali dalam 3 Tahun — Mengapa Emas Bertahan di $4.300?',
      en: "The Fed's First Rate Hike in 3 Years — Why Is Gold Holding $4,300?",
    },
    excerpt: {
      id: 'Kenaikan 25 bps pada 16 September seharusnya menjadi kabar buruk bagi emas. Namun koreksinya terbatas dan harga bertahan di atas $4.300. Kami bedah tiga alasan di balik ketahanan ini.',
      en: 'The 25bp hike on September 16 should have been bad news for gold. Yet the correction was contained and price holds above $4,300. We break down the three reasons behind this resilience.',
    },
    sections: [
      {
        heading: { id: 'Keputusan yang Mengejutkan — Sebentar Saja', en: 'The Decision That Shocked Markets — Briefly' },
        paragraphs: [
          {
            id: 'FOMC pada 16 September 2026 menaikkan suku bunga dana federal 25 basis poin ke kisaran 3,75–4,00% — kenaikan pertama dalam tiga tahun, disahkan secara bulat 12-0 di bawah kepemimpinan Ketua Kevin Warsh. Sinyalnya bahkan lebih hawkish dari keputusannya: 16 dari 18 pejabat memproyeksikan satu kenaikan lagi sebelum akhir tahun. Emas merespons seketika — spot turun ke sekitar $4.310 dalam hitungan jam dan melengkapi penurunan bulanan sekitar 6%.',
            en: 'The FOMC raised the federal funds rate by 25 basis points to a 3.75–4.00% range on September 16, 2026 — the first hike in three years, passed unanimously 12-0 under Chair Kevin Warsh. The signal was even more hawkish than the decision: 16 of 18 officials project one more hike before year-end. Gold reacted instantly — spot dropped toward $4,310 within hours, completing a monthly decline of roughly 6%.',
          },
          {
            id: 'Secara historis, kenaikan suku bunga adalah momok bagi emas karena memperbesar biaya peluang memegang aset tanpa kupon. Namun koreksi kali ini berhenti jauh di atas level yang dikhawatirkan banyak analis. Pada kisaran $4.330, harga masih membukukan kenaikan sekitar 16% secara tahun-ke-tahun — pasar memperlakukan kenaikan ini sebagai guncangan taktis, bukan perubahan rezim.',
            en: 'Historically, rate hikes are gold’s bogeyman because they raise the opportunity cost of holding a coupon-less asset. Yet this correction stalled well above the levels many analysts feared. Around $4,330, price is still up roughly 16% year-over-year — the market is treating this hike as a tactical shock, not a regime change.',
          },
        ],
      },
      {
        heading: { id: 'Tiga Alasan Emas Menolak Ambruk', en: 'Three Reasons Gold Refuses to Break' },
        paragraphs: [
          {
            id: 'Pertama, bank sentral. Pembelian bersih sektor resmi mencapai 288,9 ton pada kuartal kedua 2026, dan survei terbaru menunjukkan 89% bank sentral berencana menambah porsi emas dalam cadangannya. Lantai permintaan struktural ini menjelaskan mengapa setiap koreksi sejak 2022 cenderung dangkal dan singkat — ada pembeli raksasa yang tidak membaca grafik.',
            en: 'First, central banks. Official-sector net purchases reached 288.9 tonnes in Q2 2026, and the latest survey shows 89% of central banks plan to increase the gold share of their reserves. This structural demand floor explains why every correction since 2022 has been shallow and brief — a giant buyer exists that does not read charts.',
          },
          {
            id: 'Kedua, risiko inflasi belum hilang: ketegangan AS–Iran yang mengangkat harga energi menjaga permintaan safe-haven tetap hidup, setelah ETF emas mencetak rekor arus masuk $89 miliar pada 2025. Ketiga, Wall Street tidak mundur — target akhir tahun JPMorgan ($4.500), Wells Fargo ($4.900–5.100), dan UBS ($5.500) semuanya berada di atas harga spot. Konsensus institusional membaca koreksi ini sebagai jeda, bukan akhir reli.',
            en: 'Second, inflation risk is not gone: US–Iran tension lifting energy prices keeps safe-haven demand alive, after gold ETFs posted record inflows of $89 billion in 2025. Third, Wall Street is not backing off — year-end targets from JPMorgan ($4,500), Wells Fargo ($4,900–5,100), and UBS ($5,500) all sit above spot. The institutional consensus reads this correction as a pause, not the end of the rally.',
          },
        ],
      },
      {
        heading: { id: 'Artinya bagi Investor Indonesia', en: 'What It Means for Indonesian Investors' },
        paragraphs: [
          {
            id: 'Di pasar domestik, koreksi terasa lebih jinak. Harga Antam turun sekitar Rp71.000 per gram antara 1–16 September — dari Rp2.664.000 ke Rp2.593.000 — tetapi sebagian penurunan spot tertahan oleh rupiah yang berada di kisaran Rp17.800 per dolar. Bagi penabung berjangka, fase seperti ini justru memperbaiki harga rata-rata kepemilikan.',
            en: 'In the domestic market, the correction feels milder. Antam’s price fell about Rp71,000 per gram between September 1–16 — from Rp2,664,000 to Rp2,593,000 — but part of the spot decline was absorbed by the rupiah trading near 17,800 per dollar. For periodic savers, phases like this actually improve their average cost of ownership.',
          },
          {
            id: 'Strategi kami tidak berubah: jangan mencoba menebak langkah The Fed berikutnya. Selama bank sentral dunia terus menimbun dan imbal hasil riil tidak melonjak, koreksi berbasis FOMC secara historis adalah jendela akumulasi, bukan sinyal keluar. Gunakan kalkulator EmasKuy untuk menyesuaikan nominal bulanan Anda dengan harga live hari ini.',
            en: 'Our strategy is unchanged: do not try to guess the Fed’s next move. As long as global central banks keep accumulating and real yields do not spike, FOMC-driven corrections have historically been accumulation windows, not exit signals. Use the EmasKuy calculator to size your monthly allocation against today’s live price.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Pasar memperlakukan kenaikan pertama dalam tiga tahun ini sebagai guncangan taktis, bukan perubahan rezim — lantai bank sentral menahan sisanya.',
      en: 'The market is treating the first hike in three years as a tactical shock, not a regime change — the central-bank floor holds the rest.',
    },
    callout: 'rates',
    image: withBase('/article-fed-rates.png'),
    publishedAt: Date.parse('2026-09-22T08:00:00Z'),
    readMinutes: 7,
    author: TEAM,
  },
  {
    slug: 'gold-breaks-4350-rally-2026',
    category: 'market',
    title: {
      id: 'Emas Menembus $4.350: Apa yang Mendorong Reli 2026?',
      en: "Gold Breaks $4,350: What's Driving the 2026 Rally?",
    },
    excerpt: {
      id: 'Kombinasi pembelian bank sentral, ekspektasi pemangkasan suku bunga, dan permintaan safe-haven mendorong harga ke rekor baru. Kami membedah tiga mesin reli ini — dan apa yang bisa menghentikannya.',
      en: 'Central-bank buying, rate-cut expectations, and safe-haven demand push prices to new records. We break down the rally’s three engines — and what could stop them.',
    },
    sections: [
      {
        heading: { id: 'Tiga Mesin Reli', en: 'The Rally’s Three Engines' },
        paragraphs: [
          {
            id: 'Emas menembus $4.350 per troy ounce minggu ini, melengkapi kenaikan tahun-ke-tahun yang belum pernah terjadi dalam sejarah pasar bullion modern. Reli ini bukan peristiwa tunggal melainkan konvergensi tiga kekuatan: pembelian bank sentral yang tak pernah surut selama lebih dari sepuluh kuartal, ekspektasi pasar terhadap siklus pemangkasan suku bunga AS, dan aliran safe-haven yang dipicu ketegangan geopolitik serta kekhawatiran fiskal di ekonomi utama.',
            en: 'Gold pushed through $4,350 per troy ounce this week, completing a year-over-year advance unmatched in the modern bullion market. The rally is not a single event but the convergence of three forces: central-bank buying that has not paused for more than ten consecutive quarters, market expectations of a US rate-cutting cycle, and safe-haven flows triggered by geopolitical tension and fiscal anxiety across major economies.',
          },
          {
            id: 'Yang membedakan reli 2026 dari episode sebelumnya adalah lebarnya partisipasi. Bukan hanya dana lindung nilai dan bank sentral — arus masuk ETF emas tercatat positif delapan minggu berturut-turut, permintaan koin dan batangan ritel di Asia naik dua digit, dan bahkan alokasi dana pensiun institusional mulai bergeser ke logam mulia sebagai aset strategis, bukan sekadar lindung nilai taktis.',
            en: 'What distinguishes the 2026 rally from previous episodes is the breadth of participation. It is not only hedge funds and central banks — gold ETF inflows have been positive for eight straight weeks, retail coin and bar demand across Asia is up double digits, and even institutional pension allocations are beginning to treat bullion as a strategic asset rather than a tactical hedge.',
          },
        ],
      },
      {
        heading: { id: 'Peran Imbal Hasil Riil', en: 'The Real-Yield Transmission' },
        paragraphs: [
          {
            id: 'Hubungan terbalik antara emas dan imbal hasil riil Treasury 10-tahun kembali bekerja dengan rapi. Ketika imbal hasil riil turun di bawah 1%, biaya peluang memegang aset tanpa kupon menyempit, dan model valuasi berbasis regresi menempatkan nilai wajar emas di kisaran $4.100–$4.500. Harga saat ini berada tepat di tengah pita tersebut — reli ini, dengan kata lain, memiliki justifikasi makro, bukan sekadar euforia.',
            en: 'The inverse relationship between gold and 10-year real Treasury yields is working cleanly again. With real yields slipping below 1%, the opportunity cost of holding a coupon-less asset narrows, and regression-based valuation models place gold’s fair value in a $4,100–$4,500 band. Spot sits squarely in the middle of that band — this rally, in other words, has macro justification rather than pure euphoria.',
          },
          {
            id: 'Namun korelasi bukan jaminan. Jika inflasi AS kembali memanas dan memaksa The Fed menahan suku bunga lebih lama, imbal hasil riil dapat rebound dengan cepat. Skenario itu secara historis memicu koreksi emas 5–8% dalam hitungan minggu — tajam, tetapi dalam setiap episode sejak 2022 koreksi semacam itu diserap oleh pembelian resmi dalam waktu kurang dari dua bulan.',
            en: 'Correlation is no guarantee, however. If US inflation re-accelerates and forces the Fed to hold rates longer, real yields can rebound quickly. That scenario has historically triggered 5–8% gold corrections within weeks — sharp, but in every episode since 2022 such drawdowns were absorbed by official-sector buying in under two months.',
          },
        ],
      },
      {
        heading: { id: 'Implikasi untuk Investor Indonesia', en: 'What It Means for Indonesian Investors' },
        paragraphs: [
          {
            id: 'Bagi investor Indonesia, reli global diperkuat oleh faktor kurs. Pelemahan rupiah terhadap dolar berarti harga emas dalam rupiah per gram naik lebih cepat daripada harga spot USD. Pemegang emas lokal menikmati dua mesin sekaligus — apresiasi logam dan depresiasi mata uang — yang secara historis menjadikan emas salah satu pelindung daya beli paling konsisten di pasar domestik.',
            en: 'For Indonesian investors, the global rally is amplified by the exchange rate. Rupiah softness against the dollar means the IDR-per-gram price rises faster than USD spot. Local holders enjoy two engines at once — metal appreciation and currency depreciation — which has historically made gold one of the most consistent preservers of purchasing power in the domestic market.',
          },
          {
            id: 'Kesimpulan kami: tren struktural masih utuh, tetapi mengejar harga di rekor tertinggi bukanlah strategi. Pendekatan bertahap — akumulasi berkala dengan ukuran posisi tetap — tetap menjadi cara paling disiplin untuk berpartisipasi dalam reli tanpa menanggung risiko waktu masuk yang buruk.',
            en: 'Our conclusion: the structural trend remains intact, but chasing prices at record highs is not a strategy. A staged approach — periodic accumulation with fixed position sizing — remains the most disciplined way to participate in the rally without bearing the risk of poor entry timing.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Reli ini memiliki justifikasi makro, bukan sekadar euforia — tetapi rekor tertinggi bukan undangan untuk mengejar harga.',
      en: 'This rally has macro justification, not mere euphoria — but record highs are not an invitation to chase.',
    },
    callout: 'rally',
    image: withBase('/article-gold-rally.png'),
    publishedAt: Date.parse('2026-09-21T08:00:00Z'),
    readMinutes: 8,
    author: TEAM,
  },
  {
    slug: 'the-fed-and-gold-rate-signals',
    category: 'macro',
    title: {
      id: 'The Fed dan Emas: Membaca Sinyal Suku Bunga',
      en: 'The Fed and Gold: Reading Rate Signals',
    },
    excerpt: {
      id: 'Pasar memperkirakan dua pemangkasan lagi tahun ini. Dot-plot, pasar berjangka, dan bahasa Powell sering berkata hal berbeda — begini cara membacanya untuk harga emas 6 bulan ke depan.',
      en: 'Markets price in two more cuts this year. The dot-plot, futures, and Powell’s language often say different things — here is how to read them for gold over the next 6 months.',
    },
    sections: [
      {
        heading: { id: 'Apa Kata Dot-Plot Terakhir', en: 'What the Latest Dot-Plot Says' },
        paragraphs: [
          {
            id: 'FOMC mempertahankan suku bunga dana federal pada rapat terakhir, tetapi proyeksi median dot-plot mengisyaratkan dua pemangkasan tambahan sebelum akhir tahun. Pasar berjangka fed funds saat ini menghargai probabilitas sekitar 70% untuk pemangkasan pertama pada kuartal berikutnya — konsensus yang jarang selama siklus ini.',
            en: 'The FOMC held the federal funds rate at its latest meeting, but the median dot-plot projection signals two additional cuts before year-end. Fed funds futures currently price roughly a 70% probability of the first cut next quarter — a rare alignment between officials and markets this cycle.',
          },
          {
            id: 'Secara historis, emas menguat rata-rata 8% dalam enam bulan setelah pemangkasan pertama sebuah siklus pelonggaran. Polanya konsisten sejak 1984: bukan pemangkasan itu sendiri yang menggerakkan harga, melainkan penurunan imbal hasil riil dan pelemahan dolar yang biasanya menyertainya.',
            en: 'Historically, gold has gained an average of 8% in the six months following the first cut of an easing cycle. The pattern is consistent back to 1984: it is not the cut itself that moves prices, but the fall in real yields and the dollar softness that typically accompany it.',
          },
        ],
      },
      {
        heading: { id: 'Skenario Hawkish vs Dovish', en: 'Hawkish vs Dovish Scenarios' },
        paragraphs: [
          {
            id: 'Skenario dovish — inflasi terus melandai menuju 2% dan pasar tenaga kerja mendingin — membuka jalan bagi tiga hingga empat pemangkasan dalam 12 bulan. Dalam skenario itu, model kami memproyeksikan emas menguji $4.600–$4.800, dengan dolar yang lebih lemah menjadi pendorong sekunder.',
            en: 'The dovish scenario — inflation gliding toward 2% and the labor market cooling — opens the door to three or four cuts within 12 months. In that scenario, our models project gold testing $4,600–$4,800, with a weaker dollar acting as a secondary driver.',
          },
          {
            id: 'Skenario hawkish adalah risiko utamanya: inflasi jasa yang lengket memaksa The Fed menunda, pasar menghapus ekspektasi pemangkasan, dan dolar menguat. Dalam episode serupa, emas terkoreksi 3–5% sebelum menemukan dukungan — biasanya tepat di level di mana pembelian bank sentral kembali aktif.',
            en: 'The hawkish scenario is the key risk: sticky services inflation forces the Fed to delay, markets unwind cut expectations, and the dollar strengthens. In similar episodes, gold has corrected 3–5% before finding support — usually right at levels where central-bank buying re-engages.',
          },
        ],
      },
      {
        heading: { id: 'Cara Membaca Powell', en: 'How to Read Powell' },
        paragraphs: [
          {
            id: 'Yang paling penting bagi pedagang emas bukanlah keputusan suku bunga, melainkan konferensi pers. Kata-kata seperti "tergantung data" dan "belum cukup yakin" secara empiris berkorelasi dengan volatilitas emas 1,5–2% dalam 24 jam. Kami menyarankan untuk mencatat perubahan nada, bukan keputusan — nada bergerak lebih dulu daripada dot-plot.',
            en: 'What matters most for gold traders is not the rate decision but the press conference. Phrases like "data-dependent" and "not yet confident" empirically correlate with 1.5–2% gold volatility within 24 hours. Track the shift in tone, not the decision — tone moves before the dots do.',
          },
          {
            id: 'Untuk investor jangka panjang, noise rapat-ke-rapat sebaiknya diabaikan. Yang relevan adalah arah imbal hasil riil 6–12 bulan ke depan, dan saat ini arah itu menurun. Selama tren tersebut bertahan, setiap koreksi berbasis FOMC adalah peluang akumulasi, bukan sinyal keluar.',
            en: 'For long-term investors, meeting-to-meeting noise is best ignored. What matters is the direction of real yields 6–12 months out, and right now that direction is down. As long as the trend holds, every FOMC-driven dip is an accumulation opportunity, not an exit signal.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Nada Powell bergerak lebih dulu daripada dot-plot — dan emas mengetahuinya.',
      en: 'Powell’s tone moves before the dots do — and gold knows it.',
    },
    callout: 'rates',
    image: withBase('/article-fed-rates.png'),
    publishedAt: Date.parse('2026-09-19T10:30:00Z'),
    readMinutes: 6,
    author: TEAM,
  },
  {
    slug: 'gold-dca-no-panic-strategy',
    category: 'strategy',
    title: {
      id: 'DCA Emas: Strategi Menabung Emas Anti-Panik',
      en: 'Gold DCA: The No-Panic Savings Strategy',
    },
    excerpt: {
      id: 'Menabung emas dalam jumlah tetap setiap bulan menghilangkan keputusan tersulit dalam investasi: kapan harus membeli. Simulasi 10 tahun menunjukkan mengapa strategi membosankan ini justru menang.',
      en: 'Saving a fixed amount of gold every month removes the hardest decision in investing: when to buy. A 10-year simulation shows why this boring strategy wins.',
    },
    sections: [
      {
        heading: { id: 'Mengapa Waktu Pasar Gagal', en: 'Why Market Timing Fails' },
        paragraphs: [
          {
            id: 'Dollar-cost averaging (DCA) adalah strategi membeli emas dengan nominal tetap pada interval teratur — misalnya Rp 500 ribu setiap tanggal gajian — tanpa memedulikan harga. Ketika harga turun, nominal yang sama membeli lebih banyak gram; ketika naik, lebih sedikit. Hasilnya adalah harga rata-rata yang secara otomatis lebih rendah dari rata-rata aritmetika harga pada periode tersebut.',
            en: 'Dollar-cost averaging (DCA) means buying gold with a fixed amount at regular intervals — say Rp 500k every payday — regardless of price. When prices fall, the same amount buys more grams; when they rise, fewer. The result is an average cost automatically lower than the arithmetic mean of prices over the period.',
          },
          {
            id: 'Simulasi kami atas data 2016–2026 menunjukkan DCA bulanan menghasilkan IRR yang lebih stabil daripada investasi sekaligus di titik acak. Lump-sum memang menang di sekitar 60% periode karena pasar lebih sering naik — tetapi ketika kalah, kekalahannya jauh lebih menyakitkan, terutama bagi investor yang membeli tepat sebelum koreksi besar.',
            en: 'Our simulation on 2016–2026 data shows monthly DCA produced a more stable IRR than a lump sum invested at a random point. Lump-sum wins about 60% of periods because markets rise more often — but when it loses, the losses are far more painful, especially for investors who bought right before a major correction.',
          },
        ],
      },
      {
        heading: { id: 'Matematika di Balik "Membosankan"', en: 'The Math Behind "Boring"' },
        paragraphs: [
          {
            id: 'Keunggulan DCA bukan pada imbal hasil maksimum, melainkan pada rasio risiko-terhadap-hasil. Volatilitas nilai portofolio DCA dalam simulasi kami sekitar 30% lebih rendah daripada lump-sum pada periode yang sama. Bagi mayoritas penabung — yang tujuan utamanya adalah melindungi daya beli, bukan mengalahkan indeks — stabilitas itu jauh lebih berharga daripada poin persentase tambahan.',
            en: 'DCA’s edge is not maximum return but risk-adjusted return. Portfolio volatility in our DCA simulation ran about 30% lower than lump-sum over the same periods. For most savers — whose primary goal is preserving purchasing power, not beating an index — that stability is worth far more than an extra percentage point.',
          },
          {
            id: 'Ada pula manfaat perilaku yang sulit diukur tetapi nyata: DCA menghapus keputusan. Tidak ada lagi menunggu "harga turun dulu", tidak ada penyesalan setelah membeli di puncak lokal. Disiplin otomatis mengalahkan niat baik — dan dalam investasi ritel, perilaku adalah variabel yang paling menentukan hasil akhir.',
            en: 'There is also a behavioral benefit that is hard to quantify but very real: DCA removes the decision. No more waiting for "a dip first", no regret after buying a local top. Automatic discipline beats good intentions — and in retail investing, behavior is the single variable that most determines the outcome.',
          },
        ],
      },
      {
        heading: { id: 'Menjalankannya dalam Praktik', en: 'Putting It into Practice' },
        paragraphs: [
          {
            id: 'Aturan praktisnya sederhana: tentukan nominal bulanan yang nyaman (idealnya 5–10% dari penghasilan), pilih tanggal tetap, dan jangan pernah melewatkannya karena alasan pasar. Lewatkan hanya karena alasan pribadi — dana darurat selalu didahulukan. Evaluasi portofolio setahun sekali, bukan setiap hari.',
            en: 'The practical rules are simple: pick a comfortable monthly amount (ideally 5–10% of income), choose a fixed date, and never skip it for market reasons. Skip only for personal reasons — the emergency fund always comes first. Review the portfolio once a year, not every day.',
          },
          {
            id: 'Gunakan kalkulator EmasKuy untuk mensimulasikan skenario Anda sendiri dengan harga emas live hari ini, termasuk asumsi kurs USD/IDR dan horizon waktu. Angka konkret jauh lebih meyakinkan daripada artikel mana pun — termasuk artikel ini.',
            en: 'Use the EmasKuy calculator to simulate your own scenario with today’s live gold price, including USD/IDR assumptions and time horizon. Concrete numbers are far more convincing than any article — including this one.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Disiplin otomatis mengalahkan niat baik. Dalam investasi ritel, perilaku adalah variabel yang paling menentukan.',
      en: 'Automatic discipline beats good intentions. In retail investing, behavior is the variable that decides everything.',
    },
    callout: 'dca',
    image: withBase('/article-dca-strategy.png'),
    publishedAt: Date.parse('2026-09-15T07:00:00Z'),
    readMinutes: 7,
    author: TEAM,
  },
  {
    slug: 'why-central-banks-hoard-gold',
    category: 'macro',
    title: {
      id: 'Mengapa Bank Sentral Dunia Menimbun Emas?',
      en: 'Why Are Central Banks Hoarding Gold?',
    },
    excerpt: {
      id: 'Pembelian resmi melewati 1.000 ton per tahun tiga tahun berturut-turut — dorongan struktural yang jarang dibahas media arus utama, dan alasan utama koreksi emas kini dangkal.',
      en: 'Official purchases have topped 1,000 tonnes a year for three straight years — a structural tailwind mainstream coverage rarely explains, and the main reason gold dips are now shallow.',
    },
    sections: [
      {
        heading: { id: 'Diversifikasi dari Dolar', en: 'Diversifying Away from the Dollar' },
        paragraphs: [
          {
            id: 'Sejak cadangan Rusia dibekukan pada 2022, bank sentral di seluruh dunia mendapat pelajaran mahal: aset cadangan dalam mata uang asing hanya aman selama hubungan politik aman. Emas tidak memiliki risiko lawan, tidak dapat dibekukan oleh pihak ketiga, dan tidak bergantung pada sistem pembayaran mana pun. Hasilnya adalah gelombang diversifikasi cadangan devisa yang belum pernah terjadi sejak era Bretton Woods.',
            en: 'Since Russia’s reserves were frozen in 2022, central banks worldwide learned an expensive lesson: foreign-currency reserve assets are only safe while politics are safe. Gold has no counterparty risk, cannot be frozen by a third party, and depends on no payment system. The result is a wave of reserve diversification unseen since the Bretton Woods era.',
          },
          {
            id: 'Tiongkok, Polandia, India, dan Turki termasuk pembeli terbesar tahun ini, tetapi fenomena ini jauh lebih luas: survei World Gold Council menunjukkan mayoritas bank sentral berencana menambah porsi emas dalam 12 bulan ke depan — proporsi tertinggi sejak survei dimulai.',
            en: 'China, Poland, India, and Turkey are among this year’s largest buyers, but the phenomenon is far broader: World Gold Council surveys show a majority of central banks plan to increase their gold share over the next 12 months — the highest proportion since the survey began.',
          },
        ],
      },
      {
        heading: { id: 'Lantai Harga yang Baru', en: 'A New Price Floor' },
        paragraphs: [
          {
            id: 'Permintaan struktural sebesar 1.000+ ton per tahun mengubah matematika pasar. Tambang dunia hanya memproduksi sekitar 3.500 ton per tahun, sehingga pembelian resmi kini menyerap hampir sepertiga pasokan baru. Setiap koreksi tajam sejak 2022 cenderung dangkal dan singkat — bukan karena spekulan lebih berani, tetapi karena ada pembeli besar yang tidak peduli dengan grafik.',
            en: 'Structural demand of 1,000+ tonnes per year changes the market’s math. Global mines produce only about 3,500 tonnes annually, so official buying now absorbs nearly a third of new supply. Every sharp correction since 2022 has been shallow and brief — not because speculators grew braver, but because a large buyer exists that does not care about charts.',
          },
          {
            id: 'Inilah alasan strategi "beli saat turun" bekerja lebih baik pada emas dekade ini dibanding dekade sebelumnya. Lantai yang diciptakan bank sentral tidak menjamin harga naik, tetapi secara material membatasi kedalaman penurunan — asimetris yang menguntungkan pemegang jangka panjang.',
            en: 'This is why buy-the-dip has worked better on gold this decade than the last. The central-bank floor does not guarantee higher prices, but it materially limits drawdown depth — an asymmetry that favors long-term holders.',
          },
        ],
      },
      {
        heading: { id: 'Apa yang Bisa Menghentikannya', en: 'What Could Stop It' },
        paragraphs: [
          {
            id: 'Tren ini tidak kebal. Rekonsiliasi geopolitik besar, reformasi sistem pembayaran internasional, atau periode panjang stabilitas dolar dapat mengurangi urgensi diversifikasi. Namun tidak satu pun dari skenario itu tampak dekat — dan cadangan bank sentral bergerak lambat, sehingga tren ini diukur dalam tahun, bukan kuartal.',
            en: 'The trend is not invincible. A major geopolitical reconciliation, reform of international payment systems, or a long stretch of dollar stability could reduce the urgency to diversify. None of these scenarios looks near, however — and central-bank reserves move slowly, so this trend is measured in years, not quarters.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Emas tidak dapat dibekukan oleh pihak ketiga — dan bagi bank sentral pasca-2022, kalimat itu bernilai 1.000 ton per tahun.',
      en: 'Gold cannot be frozen by a third party — and to post-2022 central banks, that sentence is worth 1,000 tonnes a year.',
    },
    callout: 'reserves',
    image: withBase('/article-central-banks.png'),
    publishedAt: Date.parse('2026-09-10T09:15:00Z'),
    readMinutes: 9,
    author: TEAM,
  },
  {
    slug: 'gold-vs-stocks-2026',
    category: 'compare',
    title: {
      id: 'Emas vs Saham: Mana yang Lebih Baik untuk 2026?',
      en: 'Gold vs Stocks: Which Wins in 2026?',
    },
    excerpt: {
      id: 'Korelasi emas dengan ekuitas mendekati nol tahun ini — tepat ketika obligasi gagal menjadi diversifier. Kami menimbang data return, risiko, dan alokasi ideal untuk tiap profil investor.',
      en: 'Gold’s correlation with equities is near zero this year — precisely when bonds have failed as diversifiers. We weigh return, risk, and the right allocation for each investor profile.',
    },
    sections: [
      {
        heading: { id: 'Membandingkan yang Tak Sebanding', en: 'Comparing the Incomparable' },
        paragraphs: [
          {
            id: 'Pertanyaan "mana yang lebih baik" sebenarnya keliru, karena emas dan saham menjawab kebutuhan berbeda. Saham adalah klaim atas pertumbuhan ekonomi dan laba perusahaan; emas adalah asuransi terhadap kegagalan sistem moneter dan gejolak. Portofolio yang sehat bukan memilih salah satu, melainkan menentukan dosis masing-masing.',
            en: 'The question "which is better" is the wrong one, because gold and stocks answer different needs. Equities are a claim on economic growth and corporate earnings; gold is insurance against monetary-system stress and upheaval. A healthy portfolio does not pick one — it doses both.',
          },
          {
            id: 'Dalam 25 tahun terakhir, emas membukukan imbal hasil tahunan yang mengejutkan banyak orang: bersaing ketat dengan indeks saham global, dengan drawdown yang lebih dangkal pada setiap krisis besar — 2008, 2020, dan episode 2022. Yang sering dilupakan adalah bahwa perbandingan selalu sensitif terhadap titik awal; dekade 2010-an milik saham, dekade 2020-an sejauh ini milik emas.',
            en: 'Over the past 25 years, gold’s annualized return has surprised many: running neck-and-neck with global equity indices, with shallower drawdowns in every major crisis — 2008, 2020, and the 2022 episode. What is often forgotten is that the comparison is start-point sensitive; the 2010s belonged to stocks, the 2020s so far belong to gold.',
          },
        ],
      },
      {
        heading: { id: 'Korelasi Nol Adalah Hadiah', en: 'Zero Correlation Is the Gift' },
        paragraphs: [
          {
            id: 'Korelasi rolling 90 hari antara XAU/USD dan indeks ekuitas global saat ini mendekati nol. Dalam bahasa portofolio, itu berarti emas memberikan manfaat diversifikasi maksimum tepat ketika diversifier tradisional — obligasi pemerintah — gagal menjalankan tugasnya seperti pada 2022, ketika saham dan obligasi jatuh bersamaan.',
            en: 'The rolling 90-day correlation between XAU/USD and global equity indices currently sits near zero. In portfolio terms, that means gold delivers maximum diversification benefit precisely when traditional diversifiers — government bonds — failed at their job, as in 2022 when stocks and bonds fell together.',
          },
          {
            id: 'Simulasi portofolio menunjukkan menambahkan alokasi emas 10% ke portofolio 60/40 klasik secara historis menurunkan drawdown maksimum sekitar 2 poin persentase tanpa banyak mengorbankan imbal hasil jangka panjang. Rasio Sharpe portofolio justru membaik.',
            en: 'Portfolio simulations show that adding a 10% gold sleeve to a classic 60/40 portfolio has historically cut the maximum drawdown by about 2 percentage points without sacrificing much long-term return. The portfolio’s Sharpe ratio actually improves.',
          },
        ],
      },
      {
        heading: { id: 'Alokasi untuk Tiap Profil', en: 'Allocations by Profile' },
        paragraphs: [
          {
            id: 'Sebagai kerangka kasar: investor konservatif dapat mempertimbangkan 15–20% emas, profil moderat 8–12%, dan agresif 5% sebagai penyeimbang. Angka pasti bergantung pada horizon, kewajiban, dan toleransi melihat angka merah. Yang pasti salah adalah alokasi 0% di tengah rezim ketidakpastian makro seperti sekarang.',
            en: 'As a rough framework: conservative investors might consider 15–20% in gold, moderate profiles 8–12%, and aggressive ones 5% as a ballast. The exact number depends on horizon, liabilities, and tolerance for seeing red. What is clearly wrong is a 0% allocation amid the current regime of macro uncertainty.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Portofolio yang sehat bukan memilih emas atau saham — melainkan menentukan dosis masing-masing.',
      en: 'A healthy portfolio does not choose gold or stocks — it doses both.',
    },
    callout: 'compare',
    image: withBase('/article-gold-vs-stocks.png'),
    publishedAt: Date.parse('2026-09-05T13:00:00Z'),
    readMinutes: 8,
    author: TEAM,
  },
  {
    slug: 'gold-silver-ratio-hidden-signal',
    category: 'market',
    title: {
      id: 'Rasio Emas-Perak: Sinyal Tersembunyi Pasar Logam',
      en: "The Gold-Silver Ratio: The Metals Market's Hidden Signal",
    },
    excerpt: {
      id: 'Rasio di atas 80 secara historis menandakan perak relatif murah. Tetapi mean-reversion tanpa jadwal bukanlah strategi — begini cara menggunakan rasio dengan benar.',
      en: 'A ratio above 80 has historically flagged silver as relatively cheap. But mean-reversion without a schedule is not a strategy — here is how to use the ratio properly.',
    },
    sections: [
      {
        heading: { id: 'Apa Arti Rasio Ini', en: 'What the Ratio Means' },
        paragraphs: [
          {
            id: 'Rasio emas/perak mengukur berapa ounce perak yang dibutuhkan untuk membeli satu ounce emas. Rata-rata 10 tahun berada di kisaran 68; ketika rasio menembus 80, perak secara historis tergolong murah relatif terhadap emas. Rasio ini adalah salah satu indikator tertua di pasar komoditas — digunakan pedagang sejak abad ke-19.',
            en: 'The gold-silver ratio measures how many ounces of silver are needed to buy one ounce of gold. The 10-year average sits around 68; when the ratio breaks above 80, silver has historically been cheap relative to gold. It is one of the oldest indicators in commodity markets — used by traders since the 19th century.',
          },
          {
            id: 'Logika ekonominya sederhana: emas adalah logam moneter murni, sedangkan perak adalah hibrida — separuh permintaannya industri (panel surya, elektronik, kendaraan listrik). Ketika pasar takut, uang mengalir ke emas lebih dulu dan rasio melebar; ketika kepercayaan pulih, perak mengejar dengan beta sekitar dua kali lipat.',
            en: 'The economic logic is simple: gold is a pure monetary metal, while silver is a hybrid — half its demand is industrial (solar panels, electronics, EVs). When fear dominates, money flows into gold first and the ratio widens; when confidence returns, silver catches up with roughly twice the beta.',
          },
        ],
      },
      {
        heading: { id: 'Mean-Reversion Tanpa Jadwal', en: 'Mean-Reversion Without a Schedule' },
        paragraphs: [
          {
            id: 'Masalahnya: rasio tinggi bisa bertahan bertahun-tahun. Rasio di atas 80 di awal 1990-an butuh hampir satu dekade untuk kembali ke rata-rata. Mean-reversion adalah hukum statistik, bukan janji waktu. Investor yang masuk terlalu awal dengan posisi terlalu besar sering menyerah tepat sebelum pembalikan terjadi.',
            en: 'The catch: a high ratio can persist for years. The above-80 readings of the early 1990s took nearly a decade to revert to average. Mean-reversion is a statistical law, not a schedule. Investors who enter too early with oversized positions often capitulate just before the reversal.',
          },
          {
            id: 'Pendekatan yang lebih masuk akal adalah memperlakukan rasio sebagai penentu porsi, bukan pemicu masuk. Ketika rasio jauh di atas rata-rata, arahkan sebagian kecil alokasi logam ke perak dengan horizon multi-tahun; ketika jatuh di bawah 60, pertimbangkan kembali ke emas. Volatilitas perak dua kali lipat — ukuran posisi harus mencerminkan itu.',
            en: 'A saner approach treats the ratio as a position sizer, not an entry trigger. When the ratio sits far above average, direct a small slice of your metals allocation to silver with a multi-year horizon; when it falls below 60, consider rotating back to gold. Silver’s volatility is double — position size should reflect that.',
          },
        ],
      },
      {
        heading: { id: 'Situasi Saat Ini', en: 'Where We Stand Now' },
        paragraphs: [
          {
            id: 'Dengan rasio di wilayah 80-an, sinyal historis mengatakan perak tertinggal — dan defisit pasokan fisik perak lima tahun berturut-turut memperkuat argumen itu. Namun katalisnya kemungkinan siklikal: percepatan industri hijau atau reli emas fase akhir, ketika uang ritel mencari "emas yang lebih murah". Keduanya sulit dijadwalkan; karena itu, porsi kecil dan kesabaran panjang adalah satu-satunya cara bermain yang rasional.',
            en: 'With the ratio in the 80s, the historical signal says silver is lagging — and five consecutive years of physical silver supply deficits strengthen that case. But the catalyst is likely cyclical: an acceleration of green industry, or the late phase of a gold rally when retail money hunts for "cheaper gold". Neither can be scheduled; a small position and long patience are the only rational way to play it.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Mean-reversion adalah hukum statistik, bukan janji waktu. Rasio menentukan porsi, bukan pemicu masuk.',
      en: 'Mean-reversion is a statistical law, not a schedule. The ratio sizes positions — it does not trigger entries.',
    },
    callout: 'ratio',
    image: withBase('/article-silver-correlation.png'),
    publishedAt: Date.parse('2026-09-01T06:45:00Z'),
    readMinutes: 6,
    author: TEAM,
  },
];

/** Newest first. */
export function sortedArticles(): Article[] {
  return [...ARTICLES].sort((a, b) => b.publishedAt - a.publishedAt);
}

/** The article flagged `featured`, else the newest. */
export function featuredArticle(sorted: Article[]): Article | undefined {
  return sorted.find((a) => a.featured) ?? sorted[0];
}

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Up to `count` related articles from the same category (falls back to newest). */
export function relatedArticles(article: Article, count = 2): Article[] {
  const same = sortedArticles().filter((a) => a.slug !== article.slug && a.category === article.category);
  const rest = sortedArticles().filter((a) => a.slug !== article.slug && a.category !== article.category);
  return [...same, ...rest].slice(0, count);
}
