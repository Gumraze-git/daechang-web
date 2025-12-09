import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';
import { NoticeCard } from '@/components/NoticeCard';


interface ProductDetailProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { slug, locale } = await params;

  const t = await getTranslations({ locale, namespace: 'ProductPage' });
  const tIndex = await getTranslations({ locale, namespace: 'Index' });

  // Placeholder product data (fetch from API/DB in real app)
  const productData = {
    'blow-molding-machine-1': {
      nameKey: 'product1_title',
      description: 'Optimized for efficient and high-quality plastic container production.',
      long_description_en: 'This high-performance blow molding machine is...',
      long_description_ko: '이 고성능 블로우 몰딩기는...',
      images: [
        '/products/product_blow_molding_1.png',
        '/products/product_blow_molding_2.png',
        '/products/product_blow_molding_3.png'
      ],
      specifications: [
        { key: 'specification_item_power', value: '220V/380V, 50/60Hz' },
        { key: 'specification_item_capacity', value: '1000-5000 pcs/hr' },
        { key: 'specification_item_dimensions', value: 'L5000 x W2000 x H3000 mm' },
        { key: 'specification_item_weight', value: '5000 kg' },
      ],
      features: [
        { key: 'feature_item_efficiency', desc_en: 'Achieve high output with minimal energy consumption.', desc_ko: '최소한의 에너지 소비로 높은 생산량을 달성합니다.' },
        { key: 'feature_item_precision', desc_en: 'Advanced sensors ensure micron-level accuracy.', desc_ko: '첨단 센서가 마이크론 수준의 정확도를 보장합니다.' },
        { key: 'feature_item_durability', desc_en: 'Built with high-grade materials for long-lasting performance.', desc_ko: '고급 재료로 제작되어 오래 지속되는 성능을 제공합니다.' },
      ],
      clients: [
        { name: 'Samsung Biologics', logo: '/logos/client_Samsung.png' },
        { name: 'LG Chem', logo: '/logos/client_LG.png' },
        { name: 'Coca Cola Korea', logo: '/logos/client_CocaCola.png' },
        { name: 'Lotte Chilsung', logo: '/logos/client_Lotte.png' },
        { name: 'AmorePacific', logo: '/logos/client_Amore.png' },
      ],
      relatedArticles: [
        { id: '1', title: 'New Blow Molding Technology Unveiled', date: '2024-03-15', category: 'Technology' },
        { id: '2', title: 'Successful Installation at Major Beverage Plant', date: '2024-02-10', category: 'Case Study' },
      ]
    },
    'extrusion-line-1': {
      nameKey: 'product2_title',
      description: 'Precision engineering for various PVC profiles and pipes.',
      long_description_en: 'Our advanced PVC extrusion line...',
      long_description_ko: '당사의 첨단 PVC 압출 라인은...',
      images: ['/products/product_extrusion_1.png', '/products/product_extrusion_2.png'],
      specifications: [
        { key: 'specification_item_power', value: '380V, 50Hz' },
        { key: 'specification_item_capacity', value: '200-800 kg/hr' },
        { key: 'specification_item_dimensions', value: 'L10000 x W2500 x H3500 mm' },
        { key: 'specification_item_weight', value: '8000 kg' },
      ],
      features: [
        { key: 'feature_item_efficiency', desc_en: 'Optimized design for energy savings...', desc_ko: '에너지 절약 및 높은 생산량을 위한 최적화된 설계.' },
        { key: 'feature_item_precision', desc_en: 'Precise temperature control...', desc_ko: '일관된 제품 품질을 위한 정밀한 온도 제어.' },
        { key: 'feature_item_durability', desc_en: 'Heavy-duty construction...', desc_ko: '안정적인 연속 작동을 위한 고강도 구조.' },
      ],
      clients: [
        { name: 'KCC Glass', logo: '/logos/client_KCC.png' },
        { name: 'Hanwha Solutions', logo: '/logos/client_Hanwha.png' },
        { name: 'LX Hausys', logo: '/logos/client_LX.png' },
      ],
      relatedArticles: [
        { id: '3', title: 'PVC Extrusion Market Trends 2024', date: '2024-01-20', category: 'Market News' },
      ]
    },
  };

  const product = productData[slug as keyof typeof productData];

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      {/* 1. Main Title: Product Name */}
      <h1 className="text-4xl font-bold text-center mb-12">{tIndex(product.nameKey)}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-12">
        {/* Left Column: Product Photo (Carousel) */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('product_photo')}</h2>
          <Carousel className="w-full max-w-sm mx-auto">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="overflow-hidden border-gray-200">
                      <CardContent className="flex aspect-square items-center justify-center p-0 bg-gray-50">
                        {/* Use real images if available */}
                        <img src={image} alt={`Product ${index + 1}`} className="max-h-full max-w-full object-contain" />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Right Column: Information */}
        <div className="space-y-4">

          {/* 2. Specifications */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">{t('specifications')}</h3>
            <ul className="space-y-3">
              {product.specifications.map((spec, index) => (
                <li key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-0">{t(spec.key)}</span>
                  <span className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">{spec.value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Features */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">{t('features')}</h3>
            <ul className="space-y-3">
              {product.features.map((feature, index) => (
                <li key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="font-bold text-gray-900 dark:text-white shrink-0">{t(feature.key)}</span>
                  <span className="hidden sm:inline-block w-px h-4 bg-gray-300 dark:bg-gray-600 mx-2" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    {locale === 'en' ? feature.desc_en : feature.desc_ko}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-0">
            <Link href={`/${locale}/support?product=${slug}`} className="block w-full">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
                {t('inquiry_product')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Related Articles (List View) - Moved UP */}
      <div className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-gray-900 dark:border-white pl-4">
          Related Articles
        </h2>
        <div className="flex flex-col border-t border-gray-200 dark:border-gray-700">
          {(product.relatedArticles || []).map((article) => (
            <Link
              key={article.id}
              href={`/${locale}/notices/${article.id}`}
              className="group flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors px-2"
            >
              <div className="mb-2 md:mb-0">
                <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 mr-2">
                  {article.category}
                </span>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors inline-block">
                  {article.title}
                </h3>
              </div>
              <span className="text-sm text-gray-500 font-normal whitespace-nowrap">
                {article.date}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 5. Major Clients (Logo Grid) - Moved DOWN */}
      <div className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Major Clients
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
          {(product.clients || []).map((client, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 group w-full">
              {/* Logo Placeholder */}
              <div className="w-full h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-white dark:group-hover:bg-gray-700 border border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-600 transition-all">
                <span className="text-xs font-bold text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white text-center px-2">
                  {client.name} Logo
                </span>
              </div>
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white hidden">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
