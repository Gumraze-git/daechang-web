'use client';

import { useTranslations } from 'next-intl';

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    const t = useTranslations('Index'); // Using Index for hero_headline/subheadline or Common for products title

    return (
        <div className="flex flex-col min-h-screen">
            {/* Sub-visual Banner */}
            <div className="relative w-full h-64 md:h-80 bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-slate-900/90 z-10" />
                <div className="absolute inset-0 bg-[url('/images/products_banner.png')] bg-cover bg-center" />
                <div className="relative z-10 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('latest_products')}</h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                        {t('hero_subheadline')}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}
