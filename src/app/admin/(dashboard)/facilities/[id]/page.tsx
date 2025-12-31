import FacilityForm from '@/components/admin/FacilityForm';
import { getFacility } from '@/lib/actions/facilities';
import { notFound } from 'next/navigation';

export default async function EditFacilityPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const facility = await getFacility(id);

    if (!facility) {
        notFound();
    }

    return <FacilityForm initialData={facility} isEditMode={true} />;
}
