import { getHomeSettings } from '@/lib/actions/home';
import { getProducts } from '@/lib/actions/products';
import HomeSettingsForm from '@/components/admin/HomeSettingsForm';

export default async function HomeManagementPage() {
    const settings = await getHomeSettings();
    const products = await getProducts();

    return <HomeSettingsForm initialSettings={settings} products={products} />;
}
