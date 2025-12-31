'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type CompanySettings = {
    id: string;
    company_name_ko: string;
    company_name_en: string;
    ceo_name_ko: string;
    ceo_name_en: string;
    establishment_ko: string;
    establishment_en: string;
    employees_ko: string;
    employees_en: string;
    revenue_ko: string;
    revenue_en: string;
    address_ko: string;
    address_en: string;
    representative_email: string;
    representative_phone: string;
    business_registration_number: string;
    mission_title_ko: string;
    mission_title_en: string;
    mission_desc_ko: string;
    mission_desc_en: string;
    vision_title_ko: string;
    vision_title_en: string;
    vision_desc_ko: string;
    vision_desc_en: string;
    core_values: Array<{
        title_ko: string;
        title_en: string;
        desc_ko: string;
        desc_en: string;
        icon: string;
    }>;
    ceo_message_title_ko: string;
    ceo_message_title_en: string;
    ceo_message_content_ko: string;
    ceo_message_content_en: string;
    factory_images?: Array<{
        id: string;
        url: string;
        sort_order: number;
    }>;
    updated_at: string;
};

export async function getCompanySettings() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .single();

    if (error) {
        // If no row exists, we might want to return null or a default object
        // For now, let's just log and return null, handling it in UI
        console.warn('Error fetching company settings (might be empty):', error.message);
        return null;
    }

    return data as CompanySettings;
}

export async function updateFactoryImages(formData: FormData) {
    const supabase = await createClient();
    const imagesJson = formData.get('factory_images') as string;

    if (!imagesJson) {
        throw new Error('Images data is missing');
    }

    const factoryImages = JSON.parse(imagesJson);

    // Get existing settings to find ID
    const { data: existing } = await supabase.from('company_settings').select('id').limit(1).single();

    if (existing) {
        const { error } = await supabase
            .from('company_settings')
            .update({
                factory_images: factoryImages,
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);

        if (error) throw new Error('Failed to update factory images: ' + error.message);
    } else {
        // Create new if not exists (should rarely happen for this specific action)
        const { error } = await supabase
            .from('company_settings')
            .insert({
                factory_images: factoryImages
            });

        if (error) throw new Error('Failed to create company settings with images: ' + error.message);
    }

    revalidatePath('/facilities'); // Public page (all locales)
    revalidatePath('/admin/facilities'); // Admin page
    return { success: true };
}

export async function uploadFactoryImage(formData: FormData) {
    const supabase = await createClient();
    const file = formData.get('file') as File;

    if (!file) throw new Error('No file uploaded');

    const filename = `overview/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const { error } = await supabase.storage
        .from('facilities')
        .upload(filename, file);

    if (error) {
        console.error('Upload error:', error);
        throw new Error('Image upload failed');
    }

    const { data: { publicUrl } } = supabase.storage
        .from('facilities')
        .getPublicUrl(filename);

    return publicUrl;
}

export async function updateCompanySettings(formData: FormData) {
    const supabase = await createClient();

    // Define all possible fields
    const textFields = [
        'company_name_ko', 'company_name_en',
        'ceo_name_ko', 'ceo_name_en',
        'establishment_ko', 'establishment_en',
        'employees_ko', 'employees_en',
        'revenue_ko', 'revenue_en',
        'address_ko', 'address_en',
        'representative_email', 'representative_phone', 'business_registration_number',
        'mission_title_ko', 'mission_title_en',
        'mission_desc_ko', 'mission_desc_en',
        'vision_title_ko', 'vision_title_en',
        'vision_desc_ko', 'vision_desc_en',
        'ceo_message_title_ko', 'ceo_message_title_en',
        'ceo_message_content_ko', 'ceo_message_content_en'
    ];

    const payload: any = {
        updated_at: new Date().toISOString(),
    };

    // Only add text fields if they exist in formData
    textFields.forEach(field => {
        if (formData.has(field)) {
            payload[field] = formData.get(field) as string;
        }
    });

    // Handle core_values JSON specifically
    // Only update core_values if it's actually in the form data
    if (formData.has('core_values')) {
        const coreValuesString = formData.get('core_values') as string;
        payload.core_values = coreValuesString ? JSON.parse(coreValuesString) : [];
    }

    const { data: existing } = await supabase.from('company_settings').select('id').limit(1).single();

    let error;

    if (existing) {
        const { error: updateError } = await supabase
            .from('company_settings')
            .update(payload)
            .eq('id', existing.id);
        error = updateError;
    } else {
        // For insert, we might want to ensure critical fields are present, 
        // but for now, we'll allow partial insert or rely on DB defaults/nulls if completely new.
        // However, this typical use case is updating existing settings.
        const { error: insertError } = await supabase
            .from('company_settings')
            .insert(payload);
        error = insertError;
    }

    if (error) {
        throw new Error('기업 정보 저장에 실패했습니다: ' + error.message);
    }

    revalidatePath('/company');
    revalidatePath('/admin/company');
    return { success: true };
}
