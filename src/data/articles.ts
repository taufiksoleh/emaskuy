/**
 * GoldLens — shared article dataset.
 *
 * Consumed by the home preview (3 newest) and the analysis page (full index
 * + in-app reader). Each article carries a structured bilingual body
 * (`sections` of H2 + paragraphs), a pull-quote, and a `callout` key that
 * tells the reader which live-data callout panel to render.
 */
import { registerStrings } from '@/lib/i18n';

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

const TEAM = { id: 'Tim GoldLens', en: 'GoldLens Team' };

export const ARTICLES: Article[] = [
  {
    slug: 'gold-breaks-4350-rally-2026',
    category: 'market',
    featured: true,
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
    image: '/article-gold-rally.png',
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
    image: '/article-fed-rates.png',
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
            id: 'Gunakan kalkulator GoldLens untuk mensimulasikan skenario Anda sendiri dengan harga emas live hari ini, termasuk asumsi kurs USD/IDR dan horizon waktu. Angka konkret jauh lebih meyakinkan daripada artikel mana pun — termasuk artikel ini.',
            en: 'Use the GoldLens calculator to simulate your own scenario with today’s live gold price, including USD/IDR assumptions and time horizon. Concrete numbers are far more convincing than any article — including this one.',
          },
        ],
      },
    ],
    pullQuote: {
      id: 'Disiplin otomatis mengalahkan niat baik. Dalam investasi ritel, perilaku adalah variabel yang paling menentukan.',
      en: 'Automatic discipline beats good intentions. In retail investing, behavior is the variable that decides everything.',
    },
    callout: 'dca',
    image: '/article-dca-strategy.png',
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
    image: '/article-central-banks.png',
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
    image: '/article-gold-vs-stocks.png',
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
    image: '/article-silver-correlation.png',
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
