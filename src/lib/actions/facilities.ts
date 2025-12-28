'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type Facility = {
    id: string;
    name_ko: string;
    name_en?: string | null;
    type?: string | null;
    specs?: string | null;
    status: string;
    image_url?: string | null;
    created_at: string;
}

export async function getFacilities() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching facilities:', error);
        return [];
    }

    return data as Facility[];
}

export async function createFacility(formData: FormData) {
    const supabase = await createClient();

    const name_ko = formData.get('name_ko') as string;
    const name_en = formData.get('name_en') as string;
    const type = formData.get('type') as string;
    const specs = formData.get('specs') as string;
    const status = (formData.get('status') as string) || 'active'; // Default to active if not provided

    // Image Upload
    const imageFile = formData.get('image') as File;
    let image_url = null;

    if (imageFile && imageFile.size > 0) {
        const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const { error } = await supabase.storage
            .from('facilities')
            .upload(filename, imageFile);

        if (!error) {
            const { data: { publicUrl } } = supabase.storage
                .from('facilities')
                .getPublicUrl(filename);
            image_url = publicUrl;
        } else {
            console.error('Facility image upload error:', error);
        }
    }

    const { error } = await supabase.from('facilities').insert({
        name_ko,
        name_en,
        type,
        specs,
        status,
        image_url,
    });

    if (error) {
        console.error('Error creating facility:', error);
        throw new Error('설비 등록에 실패했습니다.');
    }

    revalidatePath('/admin/facilities');
    redirect('/admin/facilities');
}

export async function deleteFacility(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('facilities').delete().eq('id', id);

    if (error) {
        console.error('Error deleting facility:', error);
        throw new Error('설비 삭제에 실패했습니다.');
    }

    revalidatePath('/admin/facilities');
}
