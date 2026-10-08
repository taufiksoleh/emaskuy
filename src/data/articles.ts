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
    slug: 'gold-fomc-minutes-hawkish-4100-test',
    category: 'macro',
    featured: true,
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
            id: 'Pandangan analis pun terbelah. Marc Chandler dari Bannockburn melihat peluang naik ke $4.280–4.300 dan mencari kesempatan beli di Oktober sebelum musim kuat November–Januari. Sebaliknya, Alex Kuptsikevich dari FxPro membuka peluang uji $4.000. Rentang skenario selebar ini wajar ketika pasar menunggu data.',
            en: 'Analysts are split too. Marc Chandler of Bannockburn sees room for a move to $4,280–4,300 and is looking for a buying opportunity in October before the strong November–January season. On the other side, Alex Kuptsikevich of FxPro sees a possible test of $4,000. A scenario range this wide is normal when markets are waiting for data.',
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
