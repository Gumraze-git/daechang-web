'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type Notice = {
    id: string;
    title_ko: string;
    title_en?: string | null;
    body_ko?: string | null;
    body_en?: string | null;
    category: string;
    status: string;
    is_pinned: boolean;
    published_at: string;
    image_url?: string | null;
    views: number;
    created_at: string;
    updated_at: string;
}

export async function getNotices() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Error fetching notices:', error);
        return [];
    }

    return data as Notice[];
}

export async function getNotice(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching notice:', error);
        return null;
    }

    return data as Notice;
}

export async function createNotice(formData: FormData) {
    const supabase = await createClient();

    const title_ko = formData.get('title_ko') as string;
    const title_en = formData.get('title_en') as string;
    const body_ko = formData.get('body_ko') as string;
    const body_en = formData.get('body_en') as string;
    const category = formData.get('category') as string;
    const status = formData.get('status') as string;
    const published_at = formData.get('published_at') as string;
    const is_pinned = formData.get('is_pinned') === 'on';

    // Image Upload
    const imageFile = formData.get('image') as File;
    let image_url = null;

    if (imageFile && imageFile.size > 0) {
        const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const { error } = await supabase.storage
            .from('notices')
            .upload(filename, imageFile);

        if (!error) {
            const { data: { publicUrl } } = supabase.storage
                .from('notices')
                .getPublicUrl(filename);
            image_url = publicUrl;
        } else {
            console.error('Notice image upload error:', error);
        }
    }

    const { error } = await supabase.from('notices').insert({
        title_ko,
        title_en,
        body_ko,
        body_en,
        category,
        status,
        published_at: published_at || new Date().toISOString(),
        is_pinned,
        image_url,
    });

    if (error) {
        console.error('Error creating notice:', error);
        throw new Error('공지사항 등록에 실패했습니다.');
    }

    revalidatePath('/admin/notices');
    return { success: true };
}

export async function deleteNotice(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('notices').delete().eq('id', id);

    if (error) {
        console.error('Error deleting notice:', error);
        throw new Error('공지사항 삭제에 실패했습니다.');
    }

    revalidatePath('/admin/notices');
}

export async function updateNotice(id: string, formData: FormData) {
    const supabase = await createClient();

    const title_ko = formData.get('title_ko') as string;
    const title_en = formData.get('title_en') as string;
    const body_ko = formData.get('body_ko') as string;
    const body_en = formData.get('body_en') as string;
    const category = formData.get('category') as string;
    const status = formData.get('status') as string;
    const published_at = formData.get('published_at') as string;
    const is_pinned = formData.get('is_pinned') === 'on';

    // Image Upload (only if new image is provided)
    const imageFile = formData.get('image') as File;
    let image_url = undefined; // Undefined means "don't update" in Supabase update call if we omit it, but here we need to be explicit.

    // Construct update object
    const updateData: any = {
        title_ko,
        title_en,
        body_ko,
        body_en,
        category,
        status,
        published_at: published_at || new Date().toISOString(),
        is_pinned,
        updated_at: new Date().toISOString(),
    };

    if (imageFile && imageFile.size > 0) {
        // New image uploaded
        const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const { error } = await supabase.storage
            .from('notices')
            .upload(filename, imageFile);

        if (!error) {
            const { data: { publicUrl } } = supabase.storage
                .from('notices')
                .getPublicUrl(filename);
            updateData.image_url = publicUrl;
        } else {
            console.error('Notice image upload error:', error);
            // Optionally throw error or continue without updating image
        }
    } else {
        // If user deleted the image (handled by a hidden input or just implicit?)
        // In this simple form, if no new file, we assume keep existing.
        // If we want to support deleting image, we need a flag.
        // For now, let's assume if no file, we keep existing. 
        // NoticeForm handles previewUrl. If previewUrl is null but imageFile is empty, it means user removed it?
        // Let's check NoticeForm logic later. For now, standard behavior: no file = no change.
    }

    // However, if we want to support "remove image", we need to know.
    // The current form doesn't seem to pass "image_deleted" flag. 
    // Let's implement basic update first.

    const { error } = await supabase
        .from('notices')
        .update(updateData)
        .eq('id', id);

    if (error) {
        console.error('Error updating notice:', error);
        throw new Error('공지사항 수정에 실패했습니다.');
    }

    revalidatePath('/admin/notices');
    revalidatePath(`/admin/notices/${id}`); // Revalidate detail page (though admin detail might not exist, public one does)
    return { success: true };
}
