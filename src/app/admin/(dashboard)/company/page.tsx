import { getCompanySettings } from '@/lib/actions/company';
import CompanySettingsForm from '@/components/admin/CompanySettingsForm';

export default async function AdminCompanyPage() {
    const settings = await getCompanySettings();

    return (
        <div className="max-w-6xl mx-auto">
            <CompanySettingsForm initialSettings={settings} />
        </div>
    );
}
