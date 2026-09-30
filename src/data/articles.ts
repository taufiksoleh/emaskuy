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
}

const TEAM = { id: 'Tim EmasKuy', en: 'EmasKuy Team' };

export const ARTICLES: Article[] = [
  {
    slug: 'gold-rebound-triple-data',
    category: 'market',
    featured: true,
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

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Up to `count` related articles from the same category (falls back to newest). */
export function relatedArticles(article: Article, count = 2): Article[] {
  const same = sortedArticles().filter((a) => a.slug !== article.slug && a.category === article.category);
  const rest = sortedArticles().filter((a) => a.slug !== article.slug && a.category !== article.category);
  return [...same, ...rest].slice(0, count);
}
