'use server';

import { createClient } from '@/lib/supabase/server';

export type Notice = {
    id: string;
    title_ko: string;
    title_en?: string | null;
    created_at: string;
    category?: string;
    status: string;
}

export async function getNotices() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('notices')
        .select('id, title_ko, title_en, created_at, category, status')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching notices:', error);
        return [];
    }

    return data as Notice[];
}
