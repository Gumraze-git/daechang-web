'use client';

import { use, useEffect, useState } from 'react';
import FacilityForm from '@/components/admin/FacilityForm';

// Mock data fetcher
const getFacility = async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        id,
        name: 'Hanger Shot Blast Machine',
        type_code: 'welding',
        specs: 'Capacity: 500kg/h',
        status: 'Active',
    };
};

export default function EditFacilityPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [facility, setFacility] = useState<any>(null);

    useEffect(() => {
        getFacility(id).then(setFacility);
    }, [id]);

    if (!facility) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    return <FacilityForm initialData={facility} isEditMode={true} />;
}
