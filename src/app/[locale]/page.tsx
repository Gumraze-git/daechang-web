import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { useLocale } from 'next-intl'; // Removed as it is a hook
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCarousel } from '@/components/ProductCarousel';
import { NoticeCard } from '@/components/NoticeCard';
import { getNotices } from '@/lib/actions/notices';

import { getHomeSettings } from '@/lib/actions/home'; // New import
import { getRecommendedProducts } from '@/lib/actions/products'; // New import (+ type)

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Index');

  // Fetch real data
  const homeSettings = await getHomeSettings();
  const recommendedProducts = await getRecommendedProducts();
  const allNotices = await getNotices();
  const recentNotices = allNotices.slice(0, 3);

  // Map DB products to UI format
  const products = recommendedProducts.map(p => ({
    id: p.id, // Ensure ID is passed if component needs it, or just use href
    title: locale === 'ko' ? p.name_ko : p.name_en,
    description: (locale === 'ko' ? p.desc_ko : p.desc_en) || '', // Ensure string
    href: `/products/${p.id}`, // Use ID for now, or Slug if available (we used ID in new code)
    image: p.images && p.images[0] ? p.images[0] : '/placeholder.jpg',
  }));

  // Fallback if no products (optional, or just show empty)
  // If show_products_section is false, we might want to hide it.

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroCarousel
        images={homeSettings.hero_images && homeSettings.hero_images.length > 0 ? homeSettings.hero_images : ['/hero-bg.png']}
        headline={homeSettings.hero_headline}
        subheadline={homeSettings.hero_subheadline}
        ctaText={t('explore_products')}
        ctaLink={`/${locale}/products`}
      />

      {/* Product Summary Section */}
      {homeSettings.show_products_section && (
        <section className="container mx-auto py-16 px-4">
          <h2 className="text-3xl font-bold text-left mb-6">
            {t('latest_products')}
          </h2>
          <ProductCarousel products={products} locale={locale} />
        </section>
      )}

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