import { getTranslations } from 'next-intl/server';

import { ProductSidebar } from '@/components/ProductSidebar';

import { getCategories } from '@/lib/actions/categories'; // Import action


export default async function ProductLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
    const categories = await getCategories(); // Fetch real data
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'ProductPage' });
    const commonT = await getTranslations({ locale, namespace: 'Common' }); // Keep Common for existing usage if any

    const sidebarTranslations = {
        products: t('products'),
        search_placeholder: t('search_placeholder'),
        all_products: t('all_products'),
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Sub-visual Banner */}
            <div className="relative w-full h-64 md:h-80 bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-slate-900/90 z-10" />
                {/* Placeholder banner image, can be replaced with specific product banner */}
                <div className="absolute inset-0 bg-[url('/images/products_banner.png')] bg-cover bg-center" />
                <div className="relative z-10 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{commonT('products')}</h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                        {commonT('description')}
                    </p>
                </div>
            </div>

            {/* Main Content with Sidebar */}
            <div className="container mx-auto py-12 px-4 md:px-8">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar */}
                    <ProductSidebar categories={categories} locale={locale} translations={sidebarTranslations} />

                    {/* Main Content Area */}
                    <main className="w-full md:w-3/4 lg:w-4/5 min-h-[500px]">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
