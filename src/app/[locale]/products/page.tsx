import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducts } from '@/lib/actions/products';
import Image from 'next/image';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ProductPage' });

  const { category, q } = await searchParams;
  const categoryFilter = typeof category === 'string' ? category : null;
  const searchTerm = typeof q === 'string' ? q : '';

  // Fetch real products
  const allProducts = await getProducts();

  // Filter Logic
  const filteredProducts = allProducts.filter((product) => {
    // 1. Category Filter
    if (categoryFilter && product.category_code !== categoryFilter) {
      // Map legacy category slugs if necessary, or ensure category_code matches what's used in URL
      // URL uses 'blow-molding-machines', DB uses 'blow_molding'?
      // We should standardise. For now, strict check.
      // Actually, let's normalize.
      const normalizedFilter = categoryFilter.replace(/-/g, '_');
      if (product.category_code !== normalizedFilter && product.category_code !== categoryFilter) return false;
    }
    // 2. Search Filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      return product.name_ko.toLowerCase().includes(lowerTerm) ||
        product.name_en.toLowerCase().includes(lowerTerm) ||
        (product.model_no && product.model_no.toLowerCase().includes(lowerTerm));
    }
    return true;
  });

  // Display public/active products only
  const activeProducts = filteredProducts.filter(p => p.status === 'active');

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {categoryFilter
            ? (categoryFilter.replace(/-/g, ' ').toUpperCase()) // Simple display for now or use translation if keys align
            : t('all_products')}
        </h2>
        {searchTerm && (
          <p className="text-gray-500">
            Search results for "{searchTerm}"
          </p>
        )}
      </div>

      {/* Product List */}
      <section>
        {activeProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeProducts.map((product) => (
              <Link href={`/${locale}/products/${product.id}`} key={product.id} className="block h-full group">
                <Card className="h-full flex flex-col transition-all duration-300 group-hover:shadow-lg border-gray-200 group-hover:border-blue-200 p-0 gap-0 overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name_en}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="text-gray-400 group-hover:text-blue-400">No Image</div>
                      )}
                    </div>
                  </CardHeader>
                  <div className="p-4 flex-grow flex flex-col">
                    <CardTitle className="mb-1 text-xl group-hover:text-blue-600 transition-colors">
                      {locale === 'ko' ? product.name_ko : product.name_en}
                    </CardTitle>
                    <CardContent className="p-0 mb-2 text-sm text-gray-600 flex-grow line-clamp-2">
                      {locale === 'ko' ? product.desc_ko : product.desc_en}
                    </CardContent>
                    <div className="mt-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                      {product.model_no}
                    </div>
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