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
    features?: any; // New: JSONB
    status: string;
    images: string[];
    partner_id?: string | null; // Keep for legacy if needed, but primary will be partners
    created_at: string;
    notices?: { id: string; title_ko: string; title_en?: string | null }[]; // Joined data
    partners?: { id: string; name_ko: string; name_en?: string | null }[]; // New: Multiple partners
    category?: { code: string; name_ko: string }; // New: Joined category
    is_featured: boolean;
}


export async function getProducts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            product_partners(
                partner:partners(id, name_ko, name_en, logo_url)
            ),
            category:product_categories(code, name_ko)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    // Transform joined partners
    const products = (data || []).map((p: any) => ({
        ...p,
        partners: p.product_partners?.map((pp: any) => pp.partner) || [],
        // category is already an object { code, name_ko } thanks to the query alias, but Supabase might return it as array if not 1:1, but here it is M:1 so it returns object if referenced correctly or array?
        // Actually for Many-to-One, it usually returns object if hinted or single? 
        // Let's check runtime. Normally: category:object.
        // But referencing foreign key directly. 
        // If it's an array, take the first one.
        category: Array.isArray(p.category) ? p.category[0] : p.category
    }));

    return products as Product[];
}

export async function getRecommendedProducts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            product_partners(
                partner:partners(id, name_ko, name_en, logo_url)
            )
        `)
        .eq('status', 'active') // Only active products
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6); // Limit to reasonable number

    if (error) {
        // Quietly fail for feature flag errors if column doesn't exist yet
        if (error.code === '42703') return [];
        console.error('Error fetching recommended products:', error);
        return [];
    }

    const products = (data || []).map((p: any) => ({
        ...p,
        partners: p.product_partners?.map((pp: any) => pp.partner) || []
    }));

    return products as Product[];
}

export async function getProduct(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            product_partners(
                partner:partners(id, name_ko, name_en, logo_url)
            ),
            product_notices(
                notice:notices(id, title_ko, title_en)
            )
        `)
        .eq('id', id)
        .single();

    if (error) {
        // PGRST116: No rows found (when using .single())
        // 22P02: Invalid UUID format (e.g. visiting /products/some-text-slug)
        if (error.code === 'PGRST116' || error.code === '22P02') {
            return null;
        }
        console.error('Error fetching product:', JSON.stringify(error, null, 2));
        return null;
    }

    // Transform nested data for easier UI consumption
    const product = {
        ...data,
        notices: (data.product_notices || []).map((pn: any) => pn.notice),
        partners: (data.product_partners || []).map((pp: any) => pp.partner)
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
    const is_featured = formData.get('is_featured') === 'on';

    // We will use partner_ids instead of a single partner_id
    const partnerIdsString = formData.get('partner_ids') as string;
    const partnerIds = partnerIdsString ? JSON.parse(partnerIdsString) : [];

    // Extract related notices IDs
    const noticeIdsString = formData.get('notice_ids') as string;
    const noticeIds = noticeIdsString ? JSON.parse(noticeIdsString) : [];

    // Extract Specs and Features
    const specsString = formData.get('specs') as string;
    const specs = specsString ? JSON.parse(specsString) : [];

    const featuresString = formData.get('features') as string;
    const features = featuresString ? JSON.parse(featuresString) : [];

    // Handle Image Uploads
    const images: string[] = [];
    const imageFiles = formData.getAll('images') as File[];

    for (const file of imageFiles) {
        if (file.size > 0) {
            // ... (image upload logic remains same, skipping for brevity in viewing but needed in full context)
            const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
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
            is_featured,
            images,
            specs,
            features
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
        }
    }

    // Insert Product-Partners Relationships
    if (partnerIds.length > 0 && product) {
        const productPartners = partnerIds.map((partnerId: string) => ({
            product_id: product.id,
            partner_id: partnerId
        }));

        const { error: partnerError } = await supabase
            .from('product_partners')
            .insert(productPartners);

        if (partnerError) {
            console.error('Error linking partners:', partnerError);
        }
    }

    revalidatePath('/admin/products');
    return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
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
    const is_featured = formData.get('is_featured') === 'on';

    const partnerIdsString = formData.get('partner_ids') as string;
    const partnerIds = partnerIdsString ? JSON.parse(partnerIdsString) : [];

    const noticeIdsString = formData.get('notice_ids') as string;
    const noticeIds = noticeIdsString ? JSON.parse(noticeIdsString) : [];

    // Extract Specs and Features
    const specsString = formData.get('specs') as string;
    const specs = specsString ? JSON.parse(specsString) : [];

    const featuresString = formData.get('features') as string;
    const features = featuresString ? JSON.parse(featuresString) : [];

    // Current images from previews (existing ones)
    const currentImagesString = formData.get('current_images') as string;
    const currentImages = currentImagesString ? JSON.parse(currentImagesString) : [];

    // Handle New Image Uploads
    const newImages: string[] = [];
    const imageFiles = formData.getAll('images') as File[];

    for (const file of imageFiles) {
        if (file.size > 0) {
            const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const { data, error } = await supabase.storage
                .from('products')
                .upload(filename, file);

            if (!error) {
                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filename);
                newImages.push(publicUrl);
            }
        }
    }

    const allImages = [...currentImages, ...newImages];

    // Update Product
    const { error: productError } = await supabase
        .from('products')
        .update({
            name_ko,
            name_en,
            desc_ko,
            desc_en,
            category_code,
            model_no,
            capacity,
            status,
            is_featured,
            images: allImages,
            specs,
            features
        })
        .eq('id', id);


    if (productError) {
        throw new Error('제품 수정에 실패했습니다: ' + productError.message);
    }

    // Update Relationships (Delete old and insert new)
    // 1. Notices
    await supabase.from('product_notices').delete().eq('product_id', id);
    if (noticeIds.length > 0) {
        const productNotices = noticeIds.map((noticeId: string) => ({
            product_id: id,
            notice_id: noticeId
        }));
        await supabase.from('product_notices').insert(productNotices);
    }

    // 2. Partners
    await supabase.from('product_partners').delete().eq('product_id', id);
    if (partnerIds.length > 0) {
        const productPartners = partnerIds.map((partnerId: string) => ({
            product_id: id,
            partner_id: partnerId
        }));
        await supabase.from('product_partners').insert(productPartners);
    }

    revalidatePath('/admin/products');
    return { success: true };
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

export async function toggleProductFeatured(id: string, isFeatured: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('products')
        .update({ is_featured: isFeatured })
        .eq('id', id);

    if (error) {
        throw new Error('상태 변경 실패: ' + error.message);
    }

    revalidatePath('/admin/home');
    revalidatePath('/');
}
