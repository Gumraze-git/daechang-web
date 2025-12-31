import { useTranslations } from 'next-intl';

export default function TermsPage() {
    const t = useTranslations('TermsOfService');

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
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                                {t('intro')}
                            </p>
                        </div>

                        {/* Articles */}
                        <div className="space-y-8">
                            <section className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg inline-block">
                                    {t('section1_title')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-1">
                                    {t('section1_content')}
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg inline-block">
                                    {t('section2_title')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-1">
                                    {t('section2_content')}
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg inline-block">
                                    {t('section3_title')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-1">
                                    {t('section3_content')}
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg inline-block">
                                    {t('section4_title')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-1">
                                    {t('section4_content')}
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg inline-block">
                                    {t('section5_title')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-1">
                                    {t('section5_content')}
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg inline-block">
                                    {t('section6_title')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-1">
                                    {t('section6_content')}
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
