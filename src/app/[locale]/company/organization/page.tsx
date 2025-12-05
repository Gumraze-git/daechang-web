import { useTranslations } from 'next-intl';

export default function OrganizationPage() {
  const t = useTranslations('CompanyPage');
  return (
    <div className="prose dark:prose-invert">
      <h2 className="text-3xl font-bold mb-4">{t('company_organization')}</h2>
      <p className="mb-6">{t('organization_chart_desc')}</p>
      {/* Placeholder for an actual organization chart image */}
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md text-gray-500">
        조직도 이미지 자리
      </div>
    </div>
  );
}
