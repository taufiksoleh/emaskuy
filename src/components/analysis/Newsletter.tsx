/**
 * Newsletter — gold-glow panel with email signup. The address goes to the
 * hosted email provider (lib/newsletter.ts), which sends a confirmation
 * link; nothing is stored in the browser. Renders nothing when no provider
 * is configured. Success state draws a check via stroke anim.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { isEmail, newsletterEnabled, subscribe } from '@/lib/newsletter';

registerStrings({
  'news.title': { id: 'Dapatkan analisis mingguan', en: 'Get weekly analysis' },
  'news.desc': {
    id: 'Ringkasan pasar emas mingguan langsung ke email. Tanpa spam, berhenti kapan saja.',
    en: 'A weekly gold-market briefing in your inbox. No spam, unsubscribe anytime.',
  },
  'news.email': { id: 'Alamat email', en: 'Email address' },
  'news.placeholder': { id: 'email@anda.com', en: 'you@email.com' },
  'news.subscribe': { id: 'Berlangganan', en: 'Subscribe' },
  'news.sending': { id: 'Mengirim…', en: 'Sending…' },
  'news.thanks': { id: 'Cek email Anda', en: 'Check your inbox' },
  'news.thanksSub': {
    id: 'Kami mengirim link konfirmasi. Klik link tersebut untuk mulai berlangganan.',
    en: 'We sent you a confirmation link. Click it to start your subscription.',
  },
  'news.invalid': { id: 'Masukkan alamat email yang valid', en: 'Enter a valid email address' },
  'news.failed': {
    id: 'Gagal mengirim. Periksa koneksi Anda lalu coba lagi.',
    en: 'Could not send. Check your connection and try again.',
  },
  'news.consent': {
    id: 'Email Anda dikelola oleh penyedia newsletter kami hanya untuk mengirim ringkasan ini.',
    en: 'Your email is handled by our newsletter provider only to send this briefing.',
  },
});

type Phase = 'idle' | 'sending' | 'done' | 'failed';

export function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [trap, setTrap] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');

  if (!newsletterEnabled) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setInvalid(true);
      return;
    }
    // Bots fill every field; people never see this one.
    if (trap) {
      setPhase('done');
      return;
    }
    setPhase('sending');
    setPhase((await subscribe(email)) ? 'done' : 'failed');
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
        {phase === 'done' ? (
          <div className="flex flex-col items-center" role="status">
            <svg viewBox="0 0 52 52" className="h-12 w-12" aria-hidden>
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
                <span className="sr-only">{t('news.email')}</span>
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-t3" />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setInvalid(false);
                    if (phase === 'failed') setPhase('idle');
                  }}
                  placeholder={t('news.placeholder')}
                  aria-invalid={invalid}
                  className="w-full rounded-lg border border-hairline bg-bg3 py-2.5 pl-9 pr-3 font-mono text-sm text-t1 placeholder:text-t3 focus:border-gold/60 focus:outline-none"
                />
              </label>
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
                className="hidden"
                aria-hidden
              />
              <button
                type="submit"
                disabled={phase === 'sending'}
                className="cursor-pointer rounded-lg bg-gold px-5 py-2.5 font-display text-sm font-semibold text-bg0 transition-transform duration-150 hover:bg-goldbright active:scale-[0.97] disabled:cursor-wait disabled:opacity-70"
              >
                {phase === 'sending' ? t('news.sending') : t('news.subscribe')}
              </button>
            </form>
            {invalid && <p className="mt-2 text-xs text-down">{t('news.invalid')}</p>}
            {phase === 'failed' && (
              <p className="mt-2 text-xs text-down" role="alert">
                {t('news.failed')}
              </p>
            )}
            <p className="mt-3 text-[11px] leading-relaxed text-t3">{t('news.consent')}</p>
          </>
        )}
      </div>
    </section>
  );
}
