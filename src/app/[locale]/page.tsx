import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from 'next-intl'; // Import useLocale to get the current locale
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCarousel } from '@/components/ProductCarousel';

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
      title: 'Product 3',
      description: 'Description for Product 3',
      href: '/products/product-3',
    },
    {
      title: 'Product 4',
      description: 'Description for Product 4',
      href: '/products/product-4',
    },
    {
      title: 'Product 5',
      description: 'Description for Product 5',
      href: '/products/product-5',
    },
    {
      title: 'Product 6',
      description: 'Description for Product 6',
      href: '/products/product-6',
    },
    {
      title: 'Product 7',
      description: 'Description for Product 7',
      href: '/products/product-7',
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
        <h2 className="text-3xl font-bold text-center mb-12">
          {t('latest_products')}
        </h2>
        <ProductCarousel products={products} locale={locale} />
        <div className="mt-8 text-center">
          <Link href={`/${locale}/products`}>
            <Button variant="outline" size="lg">
              {t('view_all')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Notices Section */}
      <section className="container mx-auto py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t('latest_notices')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notices.map((notice, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{t(notice.titleKey)}</CardTitle>
                <CardDescription>{t(notice.dateKey)}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={`/${locale}${notice.href}`}>
                  <Button variant="link" className="px-0">
                    {t('view_all')}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}