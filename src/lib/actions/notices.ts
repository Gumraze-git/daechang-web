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
    image_urls?: string[] | null;
    views: number;
    created_at: string;
    updated_at: string;
}

import { unstable_cache, revalidateTag } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const getNotices = unstable_cache(
    async () => {
        const supabase = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data, error } = await supabase
            .from('notices')
            .select('*')
            .order('is_pinned', { ascending: false })
            .order('published_at', { ascending: false });

        if (error) {
            console.error('Error fetching notices:', error);
            return [];
        }

        return (data || []) as Notice[];
    },
    ['notices-list'],
    {
        tags: ['notices'],
        revalidate: 3600
    }
);

export async function getNotice(id: string) {
    return unstable_cache(
        async () => {
            const supabase = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data, error } = await supabase
                .from('notices')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error(`Error fetching notice (id=${id}):`, JSON.stringify(error, null, 2));
                return null;
            }
            return data as Notice;
        },
        [`notice-${id}`],
        {
            tags: ['notices', `notice-${id}`],
            revalidate: 3600
        }
    )();
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

    // Image Upload (Multiple)
    const image_urls: string[] = [];

    for (let i = 0; i < 3; i++) {
        const imageFile = formData.get(`image_${i}`) as File;
        if (imageFile && imageFile.size > 0) {
            const filename = `${Date.now()}-${i}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const { error } = await supabase.storage
                .from('notices')
                .upload(filename, imageFile);

            if (!error) {
                const { data: { publicUrl } } = supabase.storage
                    .from('notices')
                    .getPublicUrl(filename);
                image_urls.push(publicUrl);
            } else {
                console.error(`Notice image_${i} upload error:`, error);
            }
        }
    }

    // Legacy support: set image_url to the first image if exists
    const image_url = image_urls.length > 0 ? image_urls[0] : null;

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
        image_urls,
    });

    if (error) {
        console.error('Error creating notice:', error);
        throw new Error('공지사항 등록에 실패했습니다.');
    }

    revalidatePath('/admin/notices');

    revalidateTag('notices', { expire: 0 });

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
    revalidateTag('notices', { expire: 0 });
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

    // Image Upload (Multiple) handling
    // We expect the form to send for each slot 0..2:
    // - `image_${i}`: File (if new upload)
    // - `existing_image_url_${i}`: String (if keeping existing)

    const final_image_urls: string[] = [];

    for (let i = 0; i < 3; i++) {
        const newFile = formData.get(`image_${i}`) as File;
        const existingUrl = formData.get(`existing_image_url_${i}`) as string;

        if (newFile && newFile.size > 0) {
            // Case 1: New file uploaded
            const filename = `${Date.now()}-${i}-${newFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const { error } = await supabase.storage
                .from('notices')
                .upload(filename, newFile);

            if (!error) {
                const { data: { publicUrl } } = supabase.storage
                    .from('notices')
                    .getPublicUrl(filename);
                final_image_urls.push(publicUrl);
            } else {
                console.error(`Notice update image_${i} upload error:`, error);
                // If upload fails, try to fallback to existing URL if present? 
                // Or just skip? Skipping is safer than silent fail-fallback.
            }
        } else if (existingUrl && typeof existingUrl === 'string' && existingUrl.length > 0) {
            // Case 2: No new file, but keeping existing
            final_image_urls.push(existingUrl);
        }
        // Case 3: Neither (Slot cleared or empty) -> do nothing.
    }

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
        image_urls: final_image_urls,
        image_url: final_image_urls.length > 0 ? final_image_urls[0] : null, // Legacy sync
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from('notices')
        .update(updateData)
        .eq('id', id);

    if (error) {
        console.error('Error updating notice:', error);
        throw new Error('공지사항 수정에 실패했습니다.');
    }

    revalidatePath('/admin/notices');
    revalidatePath(`/admin/notices/${id}`);

    revalidateTag('notices', { expire: 0 });
    revalidateTag(`notice-${id}`, { expire: 0 });
    return { success: true };
}
