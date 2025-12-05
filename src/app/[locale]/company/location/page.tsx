import { useTranslations } from 'next-intl';

export default function LocationPage() {
  const t = useTranslations('CompanyPage');
  return (
    <div className="prose dark:prose-invert">
      <h2 className="text-3xl font-bold mb-4">{t('company_location')}</h2>
      <p className="mb-6">{t('location_desc')}</p>
      <div className="space-y-2 mb-6">
        <p className="whitespace-pre-wrap">{t('address')}</p>
        <p>{t('phone')}</p>
        <p>{t('fax')}</p>
        <p>{t('email')}</p>
      </div>
      {/* Placeholder for a map integration (e.g., Google Maps iframe) */}
      <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md text-gray-500">
        지도 API 연동 (예: 구글 지도)
      </div>
    </div>
  );
}
