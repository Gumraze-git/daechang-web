import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { NoticeCard } from '@/components/NoticeCard';
import { ProductGallery } from '@/components/ProductGallery';
import { getProduct } from '@/lib/actions/products';
import Image from 'next/image';

interface ProductDetailProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { slug, locale } = await params;

  const t = await getTranslations({ locale, namespace: 'ProductPage' });
  const tIndex = await getTranslations({ locale, namespace: 'Index' });

  // Fetch product from DB (slug is treated as ID here)
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // Helper for locale text
  const getLocText = (ko?: string | null, en?: string | null) => {
    return locale === 'ko' ? (ko || en) : (en || ko);
  };

  const name = getLocText(product.name_ko, product.name_en);
  const desc = getLocText(product.desc_ko, product.desc_en);

  return (
    <div className="container mx-auto py-8">
      {/* 1. Main Title: Product Name */}
      <h1 className="text-4xl font-bold text-center mb-12">{name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-12">
        {/* Left Column: Product Photo (Carousel) */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('product_photo')}</h2>
          <ProductGallery images={product.images || []} productName={name || ''} />
        </div>

        {/* Right Column: Information */}
        <div className="space-y-4">

          {/* 2. Specifications */}
          {product.specs && product.specs.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-4 border-b pb-2">{t('specifications')}</h3>
              <ul className="space-y-3">
                {product.specs.map((spec: any, index: number) => (
                  <li key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <span className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-0">
                      {spec.key}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">{spec.value}</span>
                  </li>
                ))}
                {/* Basic Fixed Specs */}
                {product.model_no && (
                  <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <span className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-0">Model No</span>
                    <span className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">{product.model_no}</span>
                  </li>
                )}
                {product.capacity && (
                  <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <span className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-0">Capacity</span>
                    <span className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">{product.capacity}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* 3. Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-4 border-b pb-2">{t('features')}</h3>
              <ul className="space-y-3">
                {product.features.map((feature: any, index: number) => (
                  <li key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="font-bold text-gray-900 dark:text-white shrink-0">
                      {feature.key}
                    </span>
                    <span className="hidden sm:inline-block w-px h-4 bg-gray-300 dark:bg-gray-600 mx-2" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      {getLocText(feature.desc_ko, feature.desc_en)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description Fallback if no specs/features for some reason */}
          {(!product.specs?.length && !product.features?.length) && desc && (
            <div className="prose dark:prose-invert">
              <p>{desc}</p>
            </div>
          )}

          <div className="pt-8">
            <Link href={`/${locale}/support/contact?type=product&product_id=${product.id}`} className="block w-full">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
                {t('inquiry_product')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Related Articles (Notices) */}
      {(product.notices && product.notices.length > 0) && (
        <div className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-gray-900 dark:border-white pl-4">
            {t('related_articles')}
          </h2>
          <div className="flex flex-col border-t border-gray-200 dark:border-gray-700">
            {product.notices.map((notice: any) => (
              <Link
                key={notice.id}
                href={`/${locale}/notices/${notice.id}`}
                className="group flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors px-2"
              >
                <div className="mb-2 md:mb-0">
                  <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 mr-2">
                    Notice
                  </span>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors inline-block">
                    {notice.title_ko}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 5. Major Clients (Partners) */}
      {(product.partners && product.partners.length > 0) && (
        <div className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {t('major_clients')}
          </h2>
          <div className="flex flex-wrap gap-8 items-center justify-center transition-all duration-500">
            {product.partners.map((partner: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center gap-3 group">
                {partner.logo_url ? (
                  <div className="relative w-full h-20 px-6 flex items-center justify-center">
                    <Image
                      src={partner.logo_url}
                      alt={partner.name_ko}
                      width={120}
                      height={60}
                      className="object-contain max-h-16 w-auto"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-6 py-4 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-gray-700 border border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-600 transition-all shadow-sm">
                    <span className="text-base font-bold text-gray-600 group-hover:text-gray-900 dark:group-hover:text-white text-center">
                      {partner.name_ko}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
