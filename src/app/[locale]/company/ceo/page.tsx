import { useTranslations } from 'next-intl';

export default function CeoPage() {
  const t = useTranslations('CompanyPage');
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white border-b pb-4 border-gray-200 dark:border-gray-700">
          {t('ceo_message_title')}
        </h2>

        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-line text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-12">
            {t('ceo_message_content')}
          </p>
        </div>

        <div className="flex flex-col items-end mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
          <div className="text-right">
            <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              대창기계산업(주) 대표이사
            </p>
            <p className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
              김 주 훈
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
