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

  // Get current filters
  const categoryFilter = typeof searchParams.category === 'string' ? searchParams.category : null;
  const searchTerm = typeof searchParams.q === 'string' ? searchParams.q : '';

  // Placeholder products (will be dynamic later)
  const allProducts = [
    { id: 'blow-molding-machine-1', category: 'blow-molding-machines', nameKey: 'product1_title', descKey: 'product1_desc', imageUrl: '/product-placeholder.jpg' },
    { id: 'extrusion-line-1', category: 'extrusion-lines', nameKey: 'product2_title', descKey: 'product2_desc', imageUrl: '/product-placeholder.jpg' },
    { id: 'product-3', category: 'other', nameKey: 'product3_title', descKey: 'product3_desc', imageUrl: '/product-placeholder.jpg' }, // Added dummy product for testing
  ];

  // Filter Logic
  const filteredProducts = allProducts.filter((product) => {
    // 1. Category Filter
    if (categoryFilter && product.category !== categoryFilter) {
      return false;
    }
    // 2. Search Filter (by nameKey or ID for now, as we don't have translated names accessible easily on server without extensive setup)
    // In a real app, you'd filter against the actual content. Here strict matching against keys/ids is a limitation of static data + i18n keys
    // For demo purposes, we will match against 'category' or 'id' if search term exists
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
            ? t(categoryFilter.replaceAll('-', '_')) // Simple heuristic to map slug back to key
            : t('all_products')}
        </h2>
        {searchTerm && (
          <p className="text-gray-500">
            {t('search_results_for', { term: searchTerm })}
          </p>
        )}
      </div>

      {/* Product List */}
      <section>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link href={`/${locale}/products/${product.id}`} key={product.id} className="block h-full group">
                <Card className="h-full flex flex-col transition-all duration-300 group-hover:shadow-lg border-gray-200 group-hover:border-blue-200 p-0 gap-0 overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      {/* Use a placeholder div or img */}
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