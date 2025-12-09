import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from 'next-intl'; // Import useLocale to get the current locale
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCarousel } from '@/components/ProductCarousel';
import { NoticeCard } from '@/components/NoticeCard';

export default function Home() {
  const t = useTranslations('Index');
  const locale = useLocale(); // Get the current locale

  // Placeholder product data (will be fetched from API later)
  const products = [
    {
      title: t('product1_title'),
      description: t('product1_desc'),
      href: '/products/blow-molding-machine-1',
    },
    {
      title: t('product2_title'),
      description: t('product2_desc'),
      href: '/products/pvc-extrusion-line-1',
    },
    {
      title: t('product_reducer_title'),
      description: t('product_reducer_desc'),
      href: '/products/reducer-1',
    },
    {
      title: t('product_pto_title'),
      description: t('product_pto_desc'),
      href: '/products/power-take-off-1',
    },
  ];

  // Placeholder notices data (will be fetched from API later)
  const notices = [
    { titleKey: 'notice1_title', dateKey: 'notice1_date', href: '/support/notices/1' },
    { titleKey: 'notice2_title', dateKey: 'notice2_date', href: '/support/notices/2' },
    { titleKey: 'notice3_title', dateKey: 'notice3_date', href: '/support/notices/3' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroCarousel
        images={[
          '/hero-bg.png',
          '/hero-bg-2.png',
          '/hero-bg-3.png'
        ]}
        headline={t('hero_headline')}
        subheadline={t('hero_subheadline')}
        ctaText={t('explore_products')}
        ctaLink={`/${locale}/products`}
      />

      {/* Product Summary Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-left mb-12">
          {t('latest_products')}
        </h2>
        <ProductCarousel products={products} locale={locale} />
      </section>

      {/* Notices Section */}
      <section className="w-full py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-left mb-12">
            {t('latest_notices')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notices.map((notice, index) => (
              <NoticeCard
                key={index}
                title={t(notice.titleKey)}
                date={t(notice.dateKey)}
                href={`/${locale}${notice.href}`}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}