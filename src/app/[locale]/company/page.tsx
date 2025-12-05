import { useTranslations } from 'next-intl';

export default function CompanyPage() {
  const t = useTranslations('CompanyPage');
  return (
    <div className="flex flex-col gap-16">
      {/* Mission Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6 text-blue-900 dark:text-blue-400">
          {t('mission_title')}
        </h2>
        <p className="text-2xl md:text-4xl font-light text-gray-800 dark:text-gray-200 leading-relaxed max-w-4xl mx-auto">
          "{t('mission_desc')}"
        </p>
      </section>

      {/* Vision Section */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          {t('vision_title')}
        </h2>
        <p className="text-4xl md:text-5xl font-extrabold text-blue-800 dark:text-blue-300">
          {t('vision_desc')}
        </p>
      </section>

      {/* Core Values Section */}
      <section>
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-white">
          {t('core_values_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Challenge */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-blue-500">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('value_challenge')}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('value_challenge_desc')}
            </p>
          </div>
          {/* Customer */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-green-500">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('value_customer')}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('value_customer_desc')}
            </p>
          </div>
          {/* Integrity */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-purple-500">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('value_integrity')}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('value_integrity_desc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
