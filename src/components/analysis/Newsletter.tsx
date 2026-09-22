/**
 * Newsletter — gold-glow panel with email signup (client-side only,
 * persisted to localStorage). Success state draws a check via stroke anim.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';

registerStrings({
  'news.title': { id: 'Dapatkan analisis mingguan', en: 'Get weekly analysis' },
  'news.desc': {
    id: 'Ringkasan pasar emas setiap Senin pagi — tanpa spam, berhenti kapan saja.',
    en: 'A gold-market briefing every Monday morning — no spam, unsubscribe anytime.',
  },
  'news.placeholder': { id: 'email@anda.com', en: 'you@email.com' },
  'news.subscribe': { id: 'Berlangganan', en: 'Subscribe' },
  'news.thanks': { id: 'Terima kasih!', en: 'Thank you!' },
  'news.thanksSub': {
    id: 'Anda terdaftar. Analisis berikutnya tiba Senin pagi.',
    en: 'You are subscribed. The next briefing arrives Monday morning.',
  },
  'news.invalid': { id: 'Masukkan alamat email yang valid', en: 'Enter a valid email address' },
});

const LS_KEY = 'emaskuy.newsletter';

export function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [done, setDone] = useState(() => {
    try {
      return Boolean(localStorage.getItem(LS_KEY));
    } catch {
      return false;
    }
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(true);
      return;
    }
    try {
      localStorage.setItem(LS_KEY, email);
    } catch {
      /* non-fatal */
    }
    setDone(true);
  };

  return (
    <section className="panel-glow relative overflow-hidden rounded-[10px] border border-goldline bg-bg1 px-6 py-10 text-center md:px-10">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(500px 220px at 50% 0%, rgba(245,185,62,0.12), transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-md">
        {done ? (
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 52 52" className="h-12 w-12">
              <motion.circle
                cx="26"
                cy="26"
                r="24"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }}
              />
              <motion.path
                d="M14 27l8 8 16-16"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              />
            </svg>
            <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-t1">
              {t('news.thanks')}
            </h3>
            <p className="mt-2 text-sm text-t2">{t('news.thanksSub')}</p>
          </div>
        ) : (
          <>
            <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-t1">
              {t('news.title')}
            </h3>
            <p className="mt-2 text-sm text-t2">{t('news.desc')}</p>
            <form onSubmit={submit} className="mt-5 flex flex-col gap-2 sm:flex-row" noValidate>
              <label className="relative flex-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-t3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(false);
                  }}
                  placeholder={t('news.placeholder')}
                  className="w-full rounded-lg border border-hairline bg-bg3 py-2.5 pl-9 pr-3 font-mono text-sm text-t1 placeholder:text-t3 focus:border-gold/60 focus:outline-none"
                />
              </label>
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-gold px-5 py-2.5 font-display text-sm font-semibold text-bg0 transition-transform duration-150 hover:bg-goldbright active:scale-[0.97]"
              >
                {t('news.subscribe')}
              </button>
            </form>
            {error && <p className="mt-2 text-xs text-down">{t('news.invalid')}</p>}
          </>
        )}
      </div>
    </section>
  );
}
