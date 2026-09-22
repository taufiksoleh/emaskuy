/**
 * GoldLens — About / Tentang page strings (about.md).
 * Bilingual ID/EN pairs registered at module scope.
 */
import { registerStrings } from '@/lib/i18n';

registerStrings({
  // Section 1 — Hero
  'about.hero.label': { id: 'Tentang GoldLens', en: 'About GoldLens' },
  'about.hero.title': {
    id: 'Data emas yang bisa Anda percaya',
    en: 'Gold data you can trust',
  },
  'about.hero.body': {
    id: 'GoldLens menggabungkan harga emas real-time, kurs mata uang resmi, dan data historis bank sentral menjadi satu dasbor analisis yang transparan.',
    en: 'GoldLens combines real-time gold prices, official FX rates, and central-bank historical data into one transparent analysis dashboard.',
  },
  'about.hero.scroll': { id: 'Gulir', en: 'Scroll' },

  // Section 2 — Data sources
  'about.sources.label': { id: 'Sumber Data', en: 'Data Sources' },
  'about.sources.title': {
    id: 'Dari mana data kami berasal?',
    en: 'Where does our data come from?',
  },
  'about.sources.badge': { id: 'Gratis & Terbuka', en: 'Free & Open' },
  'about.sources.lastFetched': { id: 'Diambil terakhir', en: 'Last fetched' },
  'about.sources.1.desc': {
    id: 'Harga spot emas real-time, diperbarui setiap beberapa detik. Tanpa API key.',
    en: 'Real-time spot gold prices, updated every few seconds. No API key.',
  },
  'about.sources.2.desc': {
    id: 'Kurs USD/IDR resmi harian dari Bank Sentral Eropa.',
    en: 'Official daily USD/IDR rates from the European Central Bank.',
  },
  'about.sources.3.desc': {
    id: 'Seri harga emas harian resmi sejak 2013, kami normalisasi ke harga live untuk grafik historis.',
    en: 'Official daily gold price series since 2013, normalized to the live price for historical charts.',
  },

  // Section 3 — How we calculate
  'about.calc.label': { id: 'Metodologi', en: 'Methodology' },
  'about.calc.title': { id: 'Bagaimana kami menghitung', en: 'How we calculate' },
  'about.calc.step1.title': { id: 'Ambil harga live', en: 'Fetch live price' },
  'about.calc.step1.desc': {
    id: 'XAU/USD dari gold-api.com setiap 30 detik.',
    en: 'XAU/USD from gold-api.com every 30 seconds.',
  },
  'about.calc.step2.title': { id: 'Konversi satuan & kurs', en: 'Convert units & FX' },
  'about.calc.step2.desc': {
    id: 'Harga per ons troy dikonversi ke rupiah per gram.',
    en: 'Price per troy ounce converted to rupiah per gram.',
  },
  'about.calc.step3.title': { id: 'Tampilkan & cache', en: 'Display & cache' },
  'about.calc.step3.desc': {
    id: 'Jika API gagal, data terakhir tersimpan ditampilkan dengan label.',
    en: 'On API failure, last saved data is shown with a label.',
  },
  'about.calc.formulaTooltip': {
    id: '1 ons troy = 31,1034768 gram — satuan standar pasar emas internasional.',
    en: '1 troy ounce = 31.1034768 grams — the standard unit of the international gold market.',
  },

  // Section 4 — FAQ
  'about.faq.label': { id: 'Pertanyaan Umum', en: 'FAQ' },
  'about.faq.title': {
    id: 'Pertanyaan yang sering diajukan',
    en: 'Frequently asked questions',
  },
  'about.faq.1.q': {
    id: 'Apakah harga di GoldLens real-time?',
    en: 'Is GoldLens pricing real-time?',
  },
  'about.faq.1.a': {
    id: 'Ya, harga diperbarui dengan polling setiap 30 detik. Ada jeda kecil dibanding pasar spot karena sifat API publik.',
    en: 'Yes, prices are polled every 30 seconds. There is a small delay versus the spot market due to the nature of public APIs.',
  },
  'about.faq.2.q': {
    id: 'Mengapa harga IDR/gram berbeda dari toko emas?',
    en: 'Why does IDR/gram differ from jewelry stores?',
  },
  'about.faq.2.a': {
    id: 'GoldLens menampilkan harga spot murni tanpa spread pedagang, ongkos pembuatan, atau pajak. Harga toko selalu lebih tinggi.',
    en: 'GoldLens shows pure spot prices excluding dealer spread, making charges, and taxes. Retail prices are always higher.',
  },
  'about.faq.3.q': {
    id: 'Dari mana data grafik historis?',
    en: 'Where does historical chart data come from?',
  },
  'about.faq.3.a': {
    id: 'Seri harian dari Narodowy Bank Polski (NBP) sejak 2013, dinormalisasi ke harga live saat ini.',
    en: 'Daily series from Narodowy Bank Polski (NBP) since 2013, normalized to the current live price.',
  },
  'about.faq.4.q': {
    id: 'Apakah kalkulator menjamin keuntungan?',
    en: 'Does the calculator guarantee returns?',
  },
  'about.faq.4.a': {
    id: 'Tidak. Kalkulator hanyalah simulasi dengan asumsi tetap — bukan prediksi maupun janji hasil.',
    en: 'No. The calculator is a fixed-assumption simulation — neither a prediction nor a promise of returns.',
  },
  'about.faq.5.q': { id: 'Apakah GoldLens gratis?', en: 'Is GoldLens free?' },
  'about.faq.5.a': {
    id: 'Ya, 100% gratis. Semua data berasal dari API publik yang terbuka.',
    en: 'Yes, 100% free. All data comes from open public APIs.',
  },

  // Section 5 — Disclaimer + contact
  'about.disclaimer.label': { id: 'Disclaimer', en: 'Disclaimer' },
  'about.disclaimer.title': { id: 'Bukan nasihat keuangan', en: 'Not financial advice' },
  'about.disclaimer.body': {
    id: 'Seluruh konten di GoldLens — termasuk harga, grafik, artikel analisis, dan hasil kalkulator — disediakan hanya untuk tujuan informasi dan edukasi, dan bukan merupakan nasihat keuangan, investasi, atau perdagangan. Data dapat tertunda atau tidak akurat; harga yang ditampilkan adalah harga spot indikatif. Selalu verifikasi harga dengan penyedia resmi sebelum bertransaksi. Kinerja masa lalu tidak menjamin hasil di masa depan.',
    en: 'All GoldLens content — including prices, charts, analysis articles, and calculator results — is provided for informational and educational purposes only and does not constitute financial, investment, or trading advice. Data may be delayed or inaccurate; displayed prices are indicative spot prices. Always verify prices with an official provider before transacting. Past performance does not guarantee future results.',
  },
  'about.contact.label': { id: 'Kontak', en: 'Contact' },
  'about.copyright': {
    id: '© 2026 GoldLens · Dibangun dengan data terbuka',
    en: '© 2026 GoldLens · Built on open data',
  },
});
