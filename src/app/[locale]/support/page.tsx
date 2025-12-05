import { useTranslations } from 'next-intl';

export default function SupportPage() {
  const t = useTranslations('Common');
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">{t('support')}</h1>
    </div>
  );
}
