import ProductForm from '@/components/admin/ProductForm';
import { getPartners } from '@/lib/actions/partners';
import { getNotices } from '@/lib/actions/notices';

export default async function NewProductPage() {
    const partners = await getPartners();
    const notices = await getNotices();

    return <ProductForm partners={partners} notices={notices} />;
}
