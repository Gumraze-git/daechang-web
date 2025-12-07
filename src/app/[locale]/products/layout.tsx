import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { ProductSidebar } from '@/components/ProductSidebar';

// This data could be moved to a shared config or fetched from an API
const categories = [
    { nameKey: 'blow_molding_machines', slug: 'blow-molding-machines' },
    { nameKey: 'extrusion_lines', slug: 'extrusion-lines' },
];

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    const t = useTranslations('Common');
    const locale = useLocale();

    return (
        <div className="flex flex-col min-h-screen">
            {/* Sub-visual Banner */}
            <div className="relative w-full h-64 md:h-80 bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-slate-900/90 z-10" />
                {/* Placeholder banner image, can be replaced with specific product banner */}
                <div className="absolute inset-0 bg-[url('/images/product_banner.png')] bg-cover bg-center" />
                <div className="relative z-10 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('products')}</h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                        {t('description')}
                    </p>
                </div>
            </div>

            {/* Main Content with Sidebar */}
            <div className="container mx-auto py-12 px-4 md:px-8">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar */}
                    <ProductSidebar categories={categories} locale={locale} />

                    {/* Main Content Area */}
                    <main className="w-full md:w-3/4 lg:w-4/5 min-h-[500px]">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
