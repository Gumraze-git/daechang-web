import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function ProductsPage({ searchParams }: Props) {
  const t = useTranslations('ProductPage');
  const locale = useLocale();

  // 현재 필터 가져오기
  const categoryFilter = typeof searchParams.category === 'string' ? searchParams.category : null;
  const searchTerm = typeof searchParams.q === 'string' ? searchParams.q : '';

  // 임시 제품 데이터 (나중에 동적으로 변경 예정)
  const allProducts = [
    { id: 'blow-molding-machine-1', category: 'blow-molding-machines', nameKey: 'product1_title', descKey: 'product1_desc', imageUrl: '/product-placeholder.jpg' },
    { id: 'extrusion-line-1', category: 'extrusion-lines', nameKey: 'product2_title', descKey: 'product2_desc', imageUrl: '/product-placeholder.jpg' },
    { id: 'product-3', category: 'other', nameKey: 'product3_title', descKey: 'product3_desc', imageUrl: '/product-placeholder.jpg' }, // 테스트용 더미 제품 추가
  ];

  // 필터 로직
  const filteredProducts = allProducts.filter((product) => {
    // 1. 카테고리 필터
    if (categoryFilter && product.category !== categoryFilter) {
      return false;
    }
    // 2. 검색 필터 (서버 설정 없이 현재로서는 번역된 이름에 접근하기 어려우므로 nameKey 또는 ID로 검색)
    // 실제 앱에서는 실제 콘텐츠를 대상으로 필터링해야 합니다. 여기서는 정적 데이터 + i18n 키의 한계로 인해 엄격한 키/ID 매칭을 사용합니다.
    // 데모 목적상 검색어가 있는 경우 'category' 또는 'id'와 일치하는지 확인합니다.
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      return product.id.toLowerCase().includes(lowerTerm) ||
        product.category.toLowerCase().includes(lowerTerm);
    }
    return true;
  });

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {categoryFilter
            ? t(categoryFilter.replaceAll('-', '_')) // 슬러그를 키로 다시 매핑하는 간단한 휴리스틱
            : t('all_products')}
        </h2>
        {searchTerm && (
          <p className="text-gray-500">
            {t('search_results_for', { term: searchTerm })}
          </p>
        )}
      </div>

      {/* 제품 목록 */}
      <section>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link href={`/${locale}/products/${product.id}`} key={product.id} className="block h-full group">
                <Card className="h-full flex flex-col transition-all duration-300 group-hover:shadow-lg border-gray-200 group-hover:border-blue-200 p-0 gap-0 overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      {/* 플레이스홀더 div 또는 img 사용 */}
                      <div className="text-gray-400 group-hover:text-blue-400">Image Placeholder</div>
                    </div>
                  </CardHeader>
                  <div className="p-4 flex-grow flex flex-col">
                    <CardTitle className="mb-1 text-xl group-hover:text-blue-600 transition-colors">{t(product.nameKey)}</CardTitle>
                    <CardContent className="p-0 mb-2 text-sm text-gray-600 flex-grow">
                      {t(product.descKey)}
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            {t('no_products_found')}
          </div>
        )}
      </section>
    </div>
  );
}