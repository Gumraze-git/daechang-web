'use client';

import { use, useEffect, useState } from 'react';
import AdminForm from '@/components/admin/AdminForm';
import { getAdminById } from '@/lib/actions/admin-auth';

export default function EditAdminPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [admin, setAdmin] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminById(id).then((data) => {
            setAdmin(data);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    if (!admin) {
        return <div className="p-8 text-center text-gray-500">관리자를 찾을 수 없습니다.</div>;
    }

    return <AdminForm initialData={admin} isEditMode={true} />;
}
