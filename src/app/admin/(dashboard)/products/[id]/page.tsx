'use client';

import { use, useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';

// Mock data fetcher
const getProduct = async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        id,
        name_ko: 'DA 시리즈',
        name_en: 'DA Series',
        desc_ko: 'DA 시리즈는 고성능 브로우 성형기입니다.',
        desc_en: 'DA Series is a high performance blow molding machine.',
        status: 'Active',
        category_code: 'blow_molding',
        model_no: 'DA-500',
        capacity: '1000 pcs/hr',
    };
};

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        getProduct(id).then(setProduct);
    }, [id]);

    if (!product) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    return <ProductForm initialData={product} isEditMode={true} />;
}
