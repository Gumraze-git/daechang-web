import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';

export default function ProductsPage() {
  const t = useTranslations('ProductPage');
  const locale = useLocale();

  // Placeholder for product categories
  const categories = [
    { nameKey: 'blow_molding_machines', slug: 'blow-molding-machines' },
    { nameKey: 'extrusion_lines', slug: 'extrusion-lines' },
  ];

  // Placeholder products (will be dynamic later)
  const products = [
    { id: 'blow-molding-machine-1', category: 'blow-molding-machines', nameKey: 'product1_title', descKey: 'product1_desc', imageUrl: '/product-placeholder.jpg' },
    { id: 'extrusion-line-1', category: 'extrusion-lines', nameKey: 'product2_title', descKey: 'product2_desc', imageUrl: '/product-placeholder.jpg' },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">{t('product_list_title')}</h1>

      {/* Product Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">{t('product_categories')}</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Link key={category.slug} href={`/${locale}/products?category=${category.slug}`}>
              <Button variant="outline" className="px-6 py-3 text-lg">
                {t(category.nameKey)}
              </Button>
            </Link>
          ))}
        </div>
      </section>

      {/* Product List */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                  <img src={product.imageUrl} alt={product.nameKey} className="max-h-full max-w-full object-contain" />
                </div>
                <CardTitle>{t(product.nameKey)}</CardTitle>
                <CardContent className="px-0 py-2 text-sm text-gray-600">
                  {t(product.descKey)}
                </CardContent>
              </CardHeader>
              <div className="p-6 pt-0">
                <Link href={`/${locale}/products/${product.id}`}>
                  <Button className="w-full">{t('view_all')}</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}