import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from 'next-intl'; // Import useLocale to get the current locale
import { HeroCarousel } from '@/components/HeroCarousel';

export default function Home() {
  const t = useTranslations('Index');
  const locale = useLocale(); // Get the current locale

  // Placeholder product data (will be fetched from API later)
  const products = [
    {
      titleKey: 'product1_title',
      descriptionKey: 'product1_desc',
      href: '/products/blow-molding-machine-1', // Placeholder link
    },
    {
      titleKey: 'product2_title',
      descriptionKey: 'product2_desc',
      href: '/products/pvc-extrusion-line-1', // Placeholder link
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle>{t(product.titleKey)}</CardTitle>
                <CardDescription>{t(product.descriptionKey)}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Product Image Placeholder */}
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
              </CardContent>
              <CardFooter>
                <Link href={`/${locale}${product.href}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    {t('view_all')}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
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