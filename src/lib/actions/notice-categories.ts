'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type NoticeCategory = {
    id: string;
    name_ko: string;
    name_en?: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    post_count?: number; // Added for UI convenience
};

export async function getNoticeCategories() {
    const supabase = await createClient();

    // Get categories
    const { data: categories, error } = await supabase
        .from('notice_categories')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    // Get post counts for each category
    // Since 'category' in 'notices' is currently just a string, we group by that string.
    // Ideally we should match by name_ko or id. 
    // For this MVP, we assume notices.category matches notice_categories.name_ko OR notice_categories.id
    // But existing notices use string names. Let's count by matching name_ko.

    const { data: notices } = await supabase
        .from('notices')
        .select('category');

    const counts: Record<string, number> = {};
    notices?.forEach((n: { category: string }) => {
        counts[n.category] = (counts[n.category] || 0) + 1;
    });

    return categories.map((cat: NoticeCategory) => ({
        ...cat,
        post_count: counts[cat.name_ko] || 0
    }));
}

export async function createNoticeCategory(formData: FormData) {
    const supabase = await createClient();
    const name_ko = formData.get('name_ko') as string;
    const name_en = formData.get('name_en') as string;
    const sort_order = parseInt(formData.get('sort_order') as string || '0');

    if (!name_ko) throw new Error('Category name (KO) is required');

    const { error } = await supabase.from('notice_categories').insert({
        name_ko,
        name_en,
        sort_order,
        is_active: true
    });

    if (error) throw new Error('Failed to create category: ' + error.message);

    revalidatePath('/admin/notices/categories');
    return { success: true };
}

export async function updateNoticeCategory(id: string, formData: FormData) {
    const supabase = await createClient();
    const name_ko = formData.get('name_ko') as string;
    const name_en = formData.get('name_en') as string;
    const sort_order = parseInt(formData.get('sort_order') as string || '0');

    // If updating name, we might want to update existing notices too?
    // For now, let's keep it simple. If name changes, old notices might become "uncategorized" or keep old string.
    // Better to encourage not changing names of categories used by many posts without migration.

    const { error } = await supabase.from('notice_categories').update({
        name_ko,
        name_en,
        sort_order
    }).eq('id', id);

    if (error) throw new Error('Failed to update category: ' + error.message);

    revalidatePath('/admin/notices/categories');
    return { success: true };
}

export async function deleteNoticeCategory(id: string) {
    const supabase = await createClient();

    // 1. Get the category name first
    const { data: category, error: fetchError } = await supabase
        .from('notice_categories')
        .select('name_ko')
        .eq('id', id)
        .single();

    if (fetchError || !category) {
        throw new Error('Category not found');
    }

    // 2. Check if any notices use this category
    const { count, error: countError } = await supabase
        .from('notices')
        .select('*', { count: 'exact', head: true })
        .eq('category', category.name_ko);

    if (countError) {
        throw new Error('Error checking category usage');
    }

    if (count && count > 0) {
        throw new Error(`이 카테고리를 사용하는 게시글이 ${count}개 있습니다. 게시글을 삭제하거나 카테고리를 변경한 후 삭제해주세요.`);
    }

    // 3. Delete if safe
    const { error } = await supabase.from('notice_categories').delete().eq('id', id);

    if (error) throw new Error('Failed to delete category: ' + error.message);

    revalidatePath('/admin/notices/categories');
}

export async function reorderNoticeCategories(items: { id: string; sort_order: number }[]) {
    const supabase = await createClient();

    // Use a transaction-like approach or Promise.all for multiple updates
    // Since Supabase JS client doesn't support bulk update with different values easily in one query without RPC,
    // we'll run parallel updates. For a small number of categories (usually < 20), this is acceptable.
    const updates = items.map(item =>
        supabase
            .from('notice_categories')
            .update({ sort_order: item.sort_order })
            .eq('id', item.id)
    );

    await Promise.all(updates);

    revalidatePath('/admin/notices'); // Revalidate the main notices page where categories are shown
    revalidatePath('/admin/notices/categories');

    return { success: true };
}
