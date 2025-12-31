import ProductForm from '@/components/admin/ProductForm';
import { getPartners } from '@/lib/actions/partners';
import { getNotices } from '@/lib/actions/notices';
import { getCategories } from '@/lib/actions/categories';

export default async function NewProductPage() {
    const partners = await getPartners();
    const notices = await getNotices();
    const categories = await getCategories();

    return <ProductForm partners={partners} notices={notices} categories={categories} />;
}
