'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';


export type Partner = {
    id: string;
    name_ko: string;
    name_en?: string | null;
    logo_url?: string | null;
    website_url?: string | null;
    type?: 'client' | 'supplier' | 'manufacturer';
    created_at: string;
}

export async function getPartners() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching partners:', error);
        return [];
    }

    return data as Partner[];
}

export async function createPartner(formData: FormData) {
    const supabase = await createClient();

    const name_ko = formData.get('name_ko') as string;
    const name_en = formData.get('name_en') as string;
    const website_url = formData.get('website_url') as string;
    const type = formData.get('type') as string;
    const logoFile = formData.get('logo') as File;

    let logo_url = null;

    if (logoFile && logoFile.size > 0) {
        const filename = `${Date.now()}-${logoFile.name}`;
        const { data, error } = await supabase.storage
            .from('partners')
            .upload(filename, logoFile);

        if (error) {
            console.error('Upload error:', error);
            // Continue without image or handle error
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('partners')
                .getPublicUrl(filename);
            logo_url = publicUrl;
        }
    }

    const { error } = await supabase.from('partners').insert({
        name_ko,
        name_en,
        website_url,
        type,
        logo_url,
    });

    if (error) {
        console.error('Error creating partner:', error);
        // Handle error (e.g., return error message)
        throw new Error('협력사 등록에 실패했습니다.');
    }

    revalidatePath('/admin/partners');
    return { success: true };
}

export async function deletePartner(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('partners').delete().eq('id', id);

    if (error) {
        console.error('Error deleting partner:', error);
        throw new Error('협력사 삭제에 실패했습니다.');
    }

    revalidatePath('/admin/partners');
}
