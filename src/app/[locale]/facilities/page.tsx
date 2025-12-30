import { getFacilities } from '@/lib/actions/facilities';
import { getCompanySettings } from '@/lib/actions/company';
import FacilitiesClient from '@/components/FacilitiesClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FacilitiesPage({ params }: Props) {
  const { locale } = await params;
  const facilities = await getFacilities();
  const settings = await getCompanySettings();

  return <FacilitiesClient facilities={facilities} locale={locale} factoryImages={settings?.factory_images} />;
}