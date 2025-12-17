'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type HistoryItem = {
    id: string;
    year: string;
    month: string;
    content_ko: string;
    content_en?: string | null;
    created_at: string;
}

export async function getHistory() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('history')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

    if (error) {
        console.error('Error fetching history:', error);
        return [];
    }

    return data as HistoryItem[];
}

export async function createHistory(formData: FormData) {
    const supabase = await createClient();

    const year = formData.get('year') as string;
    const month = formData.get('month') as string;
    const content_ko = formData.get('content_ko') as string;
    const content_en = formData.get('content_en') as string;

    const { error } = await supabase.from('history').insert({
        year,
        month,
        content_ko,
        content_en,
    });

    if (error) {
        console.error('Error creating history:', error);
        throw new Error('연혁 등록에 실패했습니다.');
    }

    revalidatePath('/admin/history');
    redirect('/admin/history');
}

export async function deleteHistory(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('history').delete().eq('id', id);

    if (error) {
        console.error('Error deleting history:', error);
        throw new Error('연혁 삭제에 실패했습니다.');
    }

    revalidatePath('/admin/history');
}
