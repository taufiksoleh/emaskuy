import { Globe } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';

registerStrings({
  'stub.about': { id: 'Tentang GoldLens', en: 'About GoldLens' },
  'stub.soonAbout': {
    id: 'Halaman ini sedang dibangun — metodologi & sumber data akan tampil di sini.',
    en: 'This page is under construction — methodology & data sources will appear here.',
  },
});

export default function About() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-24 text-center md:px-6">
      <Globe className="h-10 w-10 text-gold" />
      <h1 className="mt-4 font-display text-4xl font-bold tracking-[-0.02em] text-t1">
        {t('stub.about')}
      </h1>
      <p className="mt-3 max-w-md text-sm text-t2">{t('stub.soonAbout')}</p>
    </div>
  );
}
