import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { useLocale } from 'next-intl'; // Removed as it is a hook
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCarousel } from '@/components/ProductCarousel';
import { NoticeCard } from '@/components/NoticeCard';
import { getNotices } from '@/lib/actions/notices';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Index'); // use getTranslations for Server Components
  // Actually, in Server Components we should use getTranslations, but useTranslations hook works if provider is set.
  // However, next-intl recommends getTranslations for async Server Components.
  // Existing code used useTranslations, so let's check if it needs to change.
  // src/app/[locale]/layout.tsx sets up NextIntlClientProvider, but this page is server component.
  // The official way for SC is getTranslations.
  // But wait, the previous code was `export default function Home() ... useTranslations`. 
  // It was likely a "Server Component using hooks" which is deprecated/tricky or relying on the provider being up the tree? 
  // Next.js 13+ SCs can't use hooks. So `page.tsx` MUST have been a Client Component or `next-intl` does magic.
  // But `getNotices` is a Server Action/function.

  // Let's make this a proper Server Component using `getTranslations`.
  const allNotices = await getNotices();
  const recentNotices = allNotices.slice(0, 3);

  // Placeholder product data (will be fetched from API later)
  const products = [
    {
      title: t('product1_title'),
      description: t('product1_desc'),
      href: '/products/blow-molding-machine-1',
      image: '/products/blow_molding_machine.png',
    },
    {
      title: t('product2_title'),
      description: t('product2_desc'),
      href: '/products/pvc-extrusion-line-1',
      image: '/products/pvc_extrusion_line.png',
    },
    {
      title: t('product_reducer_title'),
      description: t('product_reducer_desc'),
      href: '/products/reducer-1',
      image: '/products/reducer.png',
    },
    {
      title: t('product_pto_title'),
      description: t('product_pto_desc'),
      href: '/products/power-take-off-1',
      image: '/products/pto.png',
    },
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
        <h2 className="text-3xl font-bold text-left mb-6">
          {t('latest_products')}
        </h2>
        <ProductCarousel products={products} locale={locale} />
      </section>

      {/* Notices Section */}
      <section className="w-full py-8 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-left mb-6">
            {t('latest_notices')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentNotices.length > 0 ? (
              recentNotices.map((notice, index) => {
                const isKo = locale === 'ko';
                const title = isKo ? notice.title_ko : (notice.title_en || notice.title_ko);
                // Date formatting
                const dateLocale = locale === 'ko' ? 'ko-KR' : 'en-US';
                const date = new Date(notice.published_at).toLocaleDateString(dateLocale, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                });

                return (
                  <NoticeCard
                    key={notice.id}
                    title={title}
                    date={date}
                    href={`/${locale}/notices/${notice.id}`}
                    locale={locale}
                    category={notice.category}
                    imageUrl={notice.image_url}
                  />
                );
              })
            ) : (
              <div className="text-gray-500">
                {t('no_notices')}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}