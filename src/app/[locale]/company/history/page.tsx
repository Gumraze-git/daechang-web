import { useTranslations } from 'next-intl';

export default function HistoryPage() {
  const t = useTranslations('CompanyPage');
  return (
    <div className="prose dark:prose-invert">
      <h2 className="text-3xl font-bold mb-4">{t('company_history')}</h2>
      <p className="mb-6">{t('history_intro')}</p>
      <ul className="space-y-4">
        <li>
          <h3 className="text-xl font-semibold">{t('history_year_1')}</h3>
          <p>{t('history_event_1')}</p>
        </li>
        <li>
          <h3 className="text-xl font-semibold">{t('history_year_2')}</h3>
          <p>{t('history_event_2')}</p>
        </li>
        <li>
          <h3 className="text-xl font-semibold">{t('history_year_3')}</h3>
          <p>{t('history_event_3')}</p>
        </li>
      </ul>
    </div>
  );
}
