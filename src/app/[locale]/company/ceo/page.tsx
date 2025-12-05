import { useTranslations } from 'next-intl';

export default function CeoPage() {
  const t = useTranslations('CompanyPage');
  return (
    <div className="prose dark:prose-invert">
      <h2 className="text-3xl font-bold mb-4">{t('ceo_message_title')}</h2>
      <p className="whitespace-pre-wrap">{t('ceo_message_content')}</p>
    </div>
  );
}
