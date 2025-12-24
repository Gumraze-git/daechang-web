import { getTranslations } from 'next-intl/server';
import { getCompanySettings } from '@/lib/actions/company';

export default async function CeoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CompanyPage' });
  const settings = await getCompanySettings();

  const getD = (ko: string, en: string) => locale === 'ko' ? ko : en;

  const title = settings ? getD(settings.ceo_message_title_ko, settings.ceo_message_title_en) : t('ceo_message_title');
  const content = settings ? getD(settings.ceo_message_content_ko, settings.ceo_message_content_en) : t('ceo_message_content');
  const ceoName = settings ? getD(settings.ceo_name_ko, settings.ceo_name_en) : '김 주 훈';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white border-b pb-4 border-gray-200 dark:border-gray-700">
          {title}
        </h2>

        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-line text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-12">
            {content}
          </p>
        </div>

        <div className="flex flex-col items-end mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
          <div className="text-right">
            <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {locale === 'ko' ? '대창기계산업(주) 대표이사' : 'CEO, Daechang Machinery Industry Co., Ltd.'}
            </p>
            <p className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
              {ceoName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
