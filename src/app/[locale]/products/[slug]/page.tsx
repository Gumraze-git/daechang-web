import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'; // Import carousel components
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';

interface ProductDetailProps {
  params: { slug: string; locale: string };
}

export default async function ProductDetailPage({ params: { slug, locale } }: ProductDetailProps) {

  const t = await getTranslations({ locale, namespace: 'ProductPage' });
  const tIndex = await getTranslations({ locale, namespace: 'Index' }); // For product titles from Index namespace

  // Placeholder product data (fetch from API/DB in real app)
  const productData = {
    'blow-molding-machine-1': {
      nameKey: 'product1_title',
      description: 'Optimized for efficient and high-quality plastic container production.',
      long_description_en: 'This high-performance blow molding machine is designed for maximum efficiency and precision in producing a wide range of plastic containers. Featuring advanced control systems and robust construction, it ensures consistent quality and high output. Ideal for various industries including food & beverage, cosmetics, and pharmaceuticals.',
      long_description_ko: '이 고성능 블로우 몰딩기는 광범위한 플라스틱 용기 생산에서 최대의 효율성과 정밀도를 위해 설계되었습니다. 첨단 제어 시스템과 견고한 구조를 특징으로 하며 일관된 품질과 높은 생산량을 보장합니다. 식품 및 음료, 화장품, 제약 등 다양한 산업에 이상적입니다.',
      images: [
        'https://placehold.co/800x600?text=High+Performance+Blow+Molding+Machine',
        'https://placehold.co/800x600?text=High+Performance+Blow+Molding+Machine',
        'https://placehold.co/800x600?text=High+Performance+Blow+Molding+Machine'
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
    },
    'extrusion-line-1': {
      nameKey: 'product2_title',
      description: 'Precision engineering for various PVC profiles and pipes.',
      long_description_en: 'Our advanced PVC extrusion line offers unparalleled precision and versatility for producing various PVC profiles, pipes, and hoses. Equipped with state-of-the-art extrusion technology, it guarantees consistent product quality, high throughput, and reduced waste. Perfect for construction, automotive, and general industrial applications.',
      long_description_ko: '당사의 첨단 PVC 압출 라인은 다양한 PVC 프로파일, 파이프 및 호스 생산을 위한 탁월한 정밀도와 다양성을 제공합니다. 최첨단 압출 기술을 탑재하여 일관된 제품 품질, 높은 처리량 및 폐기물 감소를 보장합니다. 건설, 자동차 및 일반 산업 응용 분야에 적합합니다.',
      images: ['/extrusion-detail-placeholder-1.jpg', '/extrusion-detail-placeholder-2.jpg'],
      specifications: [
        { key: 'specification_item_power', value: '380V, 50Hz' },
        { key: 'specification_item_capacity', value: '200-800 kg/hr' },
        { key: 'specification_item_dimensions', value: 'L10000 x W2500 x H3500 mm' },
        { key: 'specification_item_weight', value: '8000 kg' },
      ],
      features: [
        { key: 'feature_item_efficiency', desc_en: 'Optimized design for energy savings and high output.', desc_ko: '에너지 절약 및 높은 생산량을 위한 최적화된 설계.' },
        { key: 'feature_item_precision', desc_en: 'Precise temperature control for consistent product quality.', desc_ko: '일관된 제품 품질을 위한 정밀한 온도 제어.' },
        { key: 'feature_item_durability', desc_en: 'Heavy-duty construction for reliable, continuous operation.', desc_ko: '안정적인 연속 작동을 위한 고강도 구조.' },
      ],
    },
  };

  const product = productData[slug as keyof typeof productData];

  if (!product) {
    notFound();
  }

  // Description text is removed from UI but variable kept if needed elsewhere, or could be removed.
  // const longDescription = locale === 'en' ? product.long_description_en : product.long_description_ko;

  return (
    <div className="container mx-auto py-8">
      {/* 1. Main Title: Product Name */}
      <h1 className="text-4xl font-bold text-center mb-12">{tIndex(product.nameKey)}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
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
                        <img src={image} alt={`${tIndex(product.nameKey)} ${index + 1}`} className="max-h-full max-w-full object-contain" />
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
        <div className="space-y-8">
          {/* Note: Description text removed as requested */}

          {/* 2. Specifications */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">{t('specifications')}</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
              {product.specifications.map((spec, index) => (
                <li key={index} className="flex flex-col sm:flex-row sm:justify-between border-b sm:border-none border-gray-100 py-2 sm:py-0">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{t(spec.key)}</span>
                  <span className="text-gray-600 dark:text-gray-400 sm:text-right">{spec.value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Features */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">{t('features')}</h3>
            <ul className="space-y-3">
              {product.features.map((feature, index) => (
                <li key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <span className="font-bold block mb-1 text-gray-900 dark:text-white">{t(feature.key)}</span>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    {locale === 'en' ? feature.desc_en : feature.desc_ko}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4">
            <Link href={`/${locale}/support?product=${slug}`} className="block w-full">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
                {t('inquiry_product')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
