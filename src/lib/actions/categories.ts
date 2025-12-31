'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type Category = {
    id: string;
    code: string;
    name_ko: string;
    name_en: string | null;
    created_at: string;
    product_count?: number;
}

export async function getCategories() {
    const supabase = await createClient();

    // Fetch categories
    const { data: categories, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    // To get product counts, we can do a separate query or join.
    // Since Supabase doesn't support easy "count" in select without foreign key setup perfectly for aggregation sometimes, 
    // let's do a separate count or use the foreign key if possible.
    // A simple approach is iterating or a group by query if we had a dedicated RPC. 
    // Without RPC, let's just fetch all products (heavy?) or just counts.
    // Better: use specialized query or join. 
    // For now, let's keep it simple: just list categories. 
    // If stats are needed, we can do:

    const { data: products } = await supabase.from('products').select('category_code');

    const categoriesWithCount = categories.map(cat => ({
        ...cat,
        product_count: products?.filter((p: any) => p.category_code === cat.code).length || 0
    }));

    return categoriesWithCount as Category[];
}

export async function createCategory(formData: FormData) {
    const supabase = await createClient();

    const code = formData.get('code') as string;
    const name_ko = formData.get('name_ko') as string;
    const name_en = formData.get('name_en') as string;

    if (!code || !name_ko) {
        throw new Error('필수 정보가 누락되었습니다.');
    }

    const { error } = await supabase
        .from('product_categories')
        .insert({ code, name_ko, name_en });

    if (error) {
        console.error('Error creating category:', error);
        if (error.code === '23505') { // Unique violation
            throw new Error('이미 존재하는 카테고리 코드입니다.');
        }
        throw new Error('카테고리 생성에 실패했습니다.');
    }

    revalidatePath('/admin/products');
    return { success: true };
}

export async function deleteCategory(code: string) {
    const supabase = await createClient();

    // Check if products exist
    const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_code', code);

    if (count && count > 0) {
        throw new Error(`이 카테고리를 사용하는 제품이 ${count}개 있습니다. 제품을 먼저 삭제하거나 변경해주세요.`);
    }

    const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('code', code);

    if (error) {
        console.error('Error deleting category:', error);
        throw new Error('카테고리 삭제에 실패했습니다.');
    }

    revalidatePath('/admin/products');
    return { success: true };
}
