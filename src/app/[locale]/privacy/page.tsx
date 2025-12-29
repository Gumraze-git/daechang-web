import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
    const t = useTranslations('PrivacyPolicy');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('title')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-12 pb-8 border-b border-gray-100 dark:border-gray-800">
                        {t('last_updated')}
                    </p>

                    <div className="space-y-12">
                        {/* Section 1 */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {t('section1_title')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {t('section1_content')}
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                                <li>{t('section1_list1')}</li>
                                <li>{t('section1_list2')}</li>
                            </ul>
                        </section>

                        {/* Section 2 */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {t('section2_title')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {t('section2_content')}
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                                <li>{t('section2_list1')}</li>
                                <li>{t('section2_list2')}</li>
                            </ul>
                        </section>

                        {/* Section 3 */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {t('section3_title')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {t('section3_content')}
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                                <li>{t('section3_list1')}</li>
                            </ul>
                        </section>

                        {/* Section 4 */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {t('section4_title')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {t('section4_content')}
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {t('section5_title')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {t('section5_content')}
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-4">
                                <p className="font-medium text-gray-900 dark:text-white">{t('section5_info_name')}</p>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">{t('section5_info_contact')}</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
