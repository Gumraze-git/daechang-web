'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type Product = {
    id: string;
    name_ko: string;
    name_en: string;
    desc_ko?: string | null;
    desc_en?: string | null;
    category_code: string;
    model_no?: string | null;
    capacity?: string | null;
    specs?: any;
    status: string;
    images: string[];
    partner_id?: string | null;
    created_at: string;
    notices?: { id: string; title_ko: string }[]; // Joined data
    partner?: { id: string; name_ko: string } | null; // Joined data
}

export async function getProducts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            partner:partners(id, name_ko)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data as Product[];
}

export async function getProduct(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            partner:partners(id, name_ko),
            product_notices(
                notice:notices(id, title_ko)
            )
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    // Transform nested product_notices for easier UI consumption
    const product = {
        ...data,
        notices: data.product_notices.map((pn: any) => pn.notice)
    };

    return product as Product;
}

export async function createProduct(formData: FormData) {
    const supabase = await createClient();

    // Extract basic fields
    const name_ko = formData.get('name_ko') as string;
    const name_en = formData.get('name_en') as string;
    const desc_ko = formData.get('desc_ko') as string;
    const desc_en = formData.get('desc_en') as string;
    const category_code = formData.get('category_code') as string;
    const model_no = formData.get('model_no') as string;
    const capacity = formData.get('capacity') as string;
    const status = formData.get('status') as string;
    const partner_id = formData.get('partner_id') as string || null;

    // Extract related notices IDs (JSON string or multiple inputs)
    const noticeIdsString = formData.get('notice_ids') as string;
    const noticeIds = noticeIdsString ? JSON.parse(noticeIdsString) : [];

    // Handle Image Uploads
    const images: string[] = [];
    const imageFiles = formData.getAll('images') as File[];

    for (const file of imageFiles) {
        if (file.size > 0) {
            const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`; // Sanitize filename
            const { data, error } = await supabase.storage
                .from('products')
                .upload(filename, file);

            if (!error) {
                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filename);
                images.push(publicUrl);
            } else {
                console.error('Product image upload error:', error);
            }
        }
    }

    // Insert Product
    const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
            name_ko,
            name_en,
            desc_ko,
            desc_en,
            category_code,
            model_no,
            capacity,
            status,
            partner_id,
            images,
        })
        .select()
        .single();

    if (productError) {
        console.error('Error creating product:', productError);
        throw new Error('제품 등록에 실패했습니다: ' + productError.message);
    }

    // Insert Product-Notices Relationships
    if (noticeIds.length > 0 && product) {
        const productNotices = noticeIds.map((noticeId: string) => ({
            product_id: product.id,
            notice_id: noticeId
        }));

        const { error: relationError } = await supabase
            .from('product_notices')
            .insert(productNotices);

        if (relationError) {
            console.error('Error linking notices:', relationError);
            // Non-critical error, logic continues
        }
    }

    revalidatePath('/admin/products');
    redirect('/admin/products');
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();

    // 1. Delete associated images from storage (Optional but good practice)
    // For simplicity, we skip strictly verifying each file exists, 
    // but in production, we should list and remove them.

    // 2. Delete product (Cascade will remove product_notices)
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        throw new Error('제품 삭제에 실패했습니다.');
    }

    revalidatePath('/admin/products');
}
