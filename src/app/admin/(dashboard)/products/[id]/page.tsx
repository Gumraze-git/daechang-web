import ProductForm from '@/components/admin/ProductForm';
import { getProduct } from '@/lib/actions/products';
import { getPartners } from '@/lib/actions/partners';
import { getNotices } from '@/lib/actions/notices';
import { getCategories } from '@/lib/actions/categories';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch all data in parallel
    const [product, partners, notices, categories] = await Promise.all([
        getProduct(id),
        getPartners(),
        getNotices(),
        getCategories()
    ]);

    if (!product) {
        notFound();
    }

    return (
        <ProductForm
            initialData={product}
            isEditMode={true}
            partners={partners}
            notices={notices}
            categories={categories}
        />
    );
}
