import { getFacilities } from '@/lib/actions/facilities';
import FacilitiesClient from '@/components/FacilitiesClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FacilitiesPage({ params }: Props) {
  const { locale } = await params;
  const facilities = await getFacilities();

  return <FacilitiesClient facilities={facilities} locale={locale} />;
}