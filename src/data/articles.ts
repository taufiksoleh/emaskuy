/**
 * GoldLens — shared article dataset.
 *
 * Consumed by the home preview (3 newest) and the analysis page (full index
 * + reader). Page agents: add articles here, keep bilingual fields complete.
 */
import { registerStrings } from '@/lib/i18n';

registerStrings({
  'article.cat.market': { id: 'Pasar', en: 'Market' },
  'article.cat.macro': { id: 'Makro', en: 'Macro' },
  'article.cat.strategy': { id: 'Strategi', en: 'Strategy' },
  'article.cat.metals': { id: 'Logam', en: 'Metals' },
});

export type ArticleCategory = 'market' | 'macro' | 'strategy' | 'metals';

export interface Article {
  slug: string;
  category: ArticleCategory;
  title: { id: string; en: string };
  excerpt: { id: string; en: string };
  /** Body paragraphs (bilingual) for the in-app reader. */
  body: { id: string[]; en: string[] };
  image: string;
  publishedAt: number; // unix ms
  readMinutes: number;
}

export const ARTICLES: Article[] = [
  {
    slug: 'gold-rally-record-highs',
    category: 'market',
    title: {
      id: 'Reli Emas Menembus Rekor: Apa yang Mendorong Harga ke $4.300?',
      en: 'Gold Rally Breaks Records: What Is Driving Prices Past $4,300?',
    },
    excerpt: {
      id: 'Kombinasi pembelian bank sentral, ekspektasi pemangkasan suku bunga, dan permintaan safe-haven mendorong emas ke wilayah tertinggi sepanjang masa.',
      en: 'A combination of central-bank buying, rate-cut expectations, and safe-haven demand has pushed gold into all-time-high territory.',
    },
    body: {
      id: [
        'Emas mencatat reli bersejarah sepanjang tahun ini, menembus level psikologis $4.300 per troy ounce. Pendorong utamanya adalah akumulasi cadangan oleh bank sentral — terutama di Asia — yang berlangsung selama lebih dari sepuluh kuartal berturut-turut.',
        'Ekspektasi pasar terhadap siklus pemangkasan suku bunga memperkuat daya tarik emas sebagai aset tanpa imbal hasil. Ketika imbal hasil riil turun, biaya peluang memegang emas ikut menurun, dan arus masuk ke ETF emas tercatat positif selama delapan minggu beruntun.',
        'Bagi investor Indonesia, reli ini semakin terasa karena pelemahan rupiah memperbesar kenaikan harga dalam rupiah per gram. Strategi bertahap (DCA) tetap menjadi pendekatan yang disiplin di tengah volatilitas.',
      ],
      en: [
        'Gold has posted a historic rally this year, breaking through the psychological $4,300 per troy ounce level. The main driver is reserve accumulation by central banks — particularly in Asia — sustained for more than ten consecutive quarters.',
        'Market expectations of a rate-cutting cycle strengthen gold’s appeal as a non-yielding asset. As real yields fall, the opportunity cost of holding gold declines, and flows into gold ETFs have been positive for eight straight weeks.',
        'For Indonesian investors, the rally is amplified by rupiah weakness, which magnifies gains in IDR per gram. A staged (DCA) approach remains the disciplined strategy amid volatility.',
      ],
    },
    image: '/article-gold-rally.png',
    publishedAt: Date.parse('2026-09-21T08:00:00Z'),
    readMinutes: 6,
  },
  {
    slug: 'fed-rates-outlook',
    category: 'macro',
    title: {
      id: 'Suku Bunga The Fed dan Emas: Membaca Sinyal FOMC Berikutnya',
      en: 'Fed Rates and Gold: Reading the Next FOMC Signal',
    },
    excerpt: {
      id: 'Pasar memperkirakan dua pemangkasan lagi tahun ini. Bagaimana skenario hawkish dan dovish memengaruhi harga emas dalam 6 bulan ke depan.',
      en: 'Markets price in two more cuts this year. How hawkish and dovish scenarios shape gold over the next 6 months.',
    },
    body: {
      id: [
        'Rapat FOMC terakhir mempertahankan suku bunga, tetapi proyeksi dot-plot mengisyaratkan pelonggaran lebih lanjut. Secara historis, emas menguat rata-rata 8% dalam enam bulan setelah pemangkasan pertama sebuah siklus.',
        'Risiko utama bagi skenario bullish emas adalah inflasi yang kembali memanas, yang dapat memaksa The Fed menunda pemangkasan. Dalam skenario tersebut, dolar menguat dan emas biasanya terkoreksi 3–5% sebelum menemukan dukungan.',
      ],
      en: [
        'The latest FOMC meeting held rates steady, but the dot-plot projections signal further easing. Historically, gold has gained an average of 8% in the six months following the first cut of a cycle.',
        'The main risk to the bullish gold scenario is a resurgence of inflation, which could force the Fed to delay cuts. In that case, a stronger dollar typically corrects gold by 3–5% before it finds support.',
      ],
    },
    image: '/article-fed-rates.png',
    publishedAt: Date.parse('2026-09-19T10:30:00Z'),
    readMinutes: 5,
  },
  {
    slug: 'dca-gold-strategy',
    category: 'strategy',
    title: {
      id: 'Strategi DCA Emas: Simulasi 10 Tahun dengan Data Historis',
      en: 'Gold DCA Strategy: A 10-Year Simulation on Historical Data',
    },
    excerpt: {
      id: 'Menabung emas Rp 500 ribu per bulan selama satu dekade mengalahkan lump-sum di sebagian besar periode volatil. Ini datanya.',
      en: 'Saving Rp 500k per month in gold for a decade beat lump-sum in most volatile periods. Here is the data.',
    },
    body: {
      id: [
        'Dollar-cost averaging menghilangkan tekanan memilih waktu yang tepat. Simulasi kami terhadap data harga emas 2016–2026 menunjukkan DCA bulanan menghasilkan IRR yang lebih stabil dibandingkan investasi sekaligus di titik acak.',
        'Gunakan kalkulator kami untuk mensimulasikan skenario Anda sendiri dengan harga emas live hari ini, termasuk asumsi kurs USD/IDR.',
      ],
      en: [
        'Dollar-cost averaging removes the pressure of market timing. Our simulation on 2016–2026 gold price data shows monthly DCA produced a more stable IRR than a lump-sum investment at a random point.',
        'Use our calculator to simulate your own scenario with today’s live gold price, including USD/IDR assumptions.',
      ],
    },
    image: '/article-dca-strategy.png',
    publishedAt: Date.parse('2026-09-17T07:00:00Z'),
    readMinutes: 7,
  },
  {
    slug: 'central-banks-gold-demand',
    category: 'macro',
    title: {
      id: 'Bank Sentral Dunia Borong Emas: Tren yang Belum Berakhir',
      en: 'Central Banks Are Hoarding Gold: A Trend That Is Not Over',
    },
    excerpt: {
      id: 'Pembelian resmi melewati 1.000 ton per tahun tiga tahun berturut-turut — dorongan struktural yang jarang dibahas media arus utama.',
      en: 'Official purchases have topped 1,000 tonnes per year for three straight years — a structural tailwind rarely covered by mainstream media.',
    },
    body: {
      id: [
        'Diversifikasi cadangan devisa menjauhi dolar AS mendorong bank sentral menambah porsi emas. Tiongkok, Polandia, India, dan Turki termasuk pembeli terbesar tahun ini.',
        'Permintaan struktural ini menciptakan "lantai" harga yang lebih tinggi dibanding siklus sebelumnya — setiap koreksi tajam cenderung diserap pembelian resmi.',
      ],
      en: [
        'Reserve diversification away from the US dollar is driving central banks to raise their gold allocation. China, Poland, India, and Turkey are among the largest buyers this year.',
        'This structural demand creates a higher price "floor" than in previous cycles — sharp corrections tend to be absorbed by official buying.',
      ],
    },
    image: '/article-central-banks.png',
    publishedAt: Date.parse('2026-09-14T09:15:00Z'),
    readMinutes: 5,
  },
  {
    slug: 'gold-vs-stocks-2026',
    category: 'strategy',
    title: {
      id: 'Emas vs Saham 2026: Menimbang Portofolio di Tengah Ketidakpastian',
      en: 'Gold vs Stocks 2026: Weighing a Portfolio Amid Uncertainty',
    },
    excerpt: {
      id: 'Korelasi emas dengan ekuitas mendekati nol tahun ini. Berapa alokasi ideal untuk profil risiko Anda?',
      en: 'Gold’s correlation with equities is near zero this year. What allocation fits your risk profile?',
    },
    body: {
      id: [
        'Dalam portofolio 60/40 klasik, menambahkan 10% emas secara historis menurunkan drawdown maksimum sekitar 2 poin persentase tanpa banyak mengorbankan imbal hasil jangka panjang.',
        'Tahun ini korelasi rolling 90 hari antara XAU/USD dan indeks ekuitas global mendekati nol — menjadikan emas diversifier yang efektif tepat ketika obligasi kurang dapat diandalkan.',
      ],
      en: [
        'In a classic 60/40 portfolio, adding a 10% gold sleeve has historically cut the maximum drawdown by about 2 percentage points without sacrificing much long-term return.',
        'This year, the rolling 90-day correlation between XAU/USD and global equity indices is near zero — making gold an effective diversifier precisely when bonds are less reliable.',
      ],
    },
    image: '/article-gold-vs-stocks.png',
    publishedAt: Date.parse('2026-09-11T13:00:00Z'),
    readMinutes: 6,
  },
  {
    slug: 'silver-gold-ratio',
    category: 'metals',
    title: {
      id: 'Rasio Emas/Perak di 85: Sinyal Perak Tertinggal?',
      en: 'Gold/Silver Ratio at 85: Is Silver Lagging Behind?',
    },
    excerpt: {
      id: 'Rasio jauh di atas rata-rata 10 tahun (68). Secara historis, mean-reversion menguntungkan perak — tetapi waktunya tidak pasti.',
      en: 'The ratio sits far above its 10-year average (68). Historically, mean-reversion favors silver — but timing is uncertain.',
    },
    body: {
      id: [
        'Rasio emas/perak mengukur berapa ounce perak yang dibutuhkan untuk membeli satu ounce emas. Di atas 80, rasio secara historis menandakan perak relatif murah terhadap emas.',
        'Namun perak membawa volatilitas dua kali lipat. Posisi yang lebih kecil dengan horizon lebih panjang biasanya lebih masuk akal daripada mengejar mean-reversion secara agresif.',
      ],
      en: [
        'The gold/silver ratio measures how many ounces of silver are needed to buy one ounce of gold. Above 80, it has historically signaled that silver is relatively cheap versus gold.',
        'Silver, however, carries twice the volatility. A smaller position with a longer horizon usually makes more sense than aggressively chasing mean-reversion.',
      ],
    },
    image: '/article-silver-correlation.png',
    publishedAt: Date.parse('2026-09-08T06:45:00Z'),
    readMinutes: 4,
  },
];

/** Newest first. */
export function sortedArticles(): Article[] {
  return [...ARTICLES].sort((a, b) => b.publishedAt - a.publishedAt);
}
