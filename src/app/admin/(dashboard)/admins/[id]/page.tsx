'use client';

import { use, useEffect, useState } from 'react';
import AdminForm from '@/components/admin/AdminForm';

// Mock data fetcher
const getAdmin = async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        id,
        name: '홍길동',
        email: 'hong@daechang.com',
        role_code: 'admin',
        status: 'Active',
    };
};

export default function EditAdminPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [admin, setAdmin] = useState<any>(null);

    useEffect(() => {
        getAdmin(id).then(setAdmin);
    }, [id]);

    if (!admin) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    return <AdminForm initialData={admin} isEditMode={true} />;
}
