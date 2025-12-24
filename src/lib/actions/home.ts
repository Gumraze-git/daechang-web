'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type HomeSettings = {
    id: number;
    hero_headline: string;
    hero_subheadline: string;
    hero_images: string[];
    show_products_section: boolean;
    updated_at: string;
};

export async function getHomeSettings() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('home_settings')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching home settings:', JSON.stringify(error, null, 2));
        // Return default fallback if DB is empty or error
        return {
            hero_headline: '산업 기계의 미래를 혁신하다',
            hero_subheadline: '블로우 몰딩기 및 압출 라인의 신뢰할 수 있는 파트너.',
            hero_images: ['/hero-bg.png', '/hero-bg-2.png', '/hero-bg-3.png'],
            show_products_section: true,
        } as HomeSettings;
    }

    return data as HomeSettings;
}

export async function updateHomeSettings(formData: FormData) {
    const supabase = await createClient();

    const hero_headline = formData.get('hero_headline') as string;
    const hero_subheadline = formData.get('hero_subheadline') as string;

    // Handle images:
    // We expect a 'image_layout' JSON string which is an array of strings.
    // Each string is either a full URL (existing image) or a placeholder "new_file_{index}" (newly uploaded file).
    const imageLayoutString = formData.get('image_layout') as string;
    let imageLayout: string[] = [];

    // Fallback for backward compatibility or if JS fails: just append new to current.
    const currentImagesString = formData.get('current_images') as string;
    const currentImages = currentImagesString ? JSON.parse(currentImagesString) : [];

    if (imageLayoutString) {
        imageLayout = JSON.parse(imageLayoutString);
    } else {
        // Default behavior: append new to current
        // This path might not be taken if frontend always sends layout, but good for safety.
        imageLayout = [...currentImages];
        // We will append new files later if layout is missing
    }

    const newImagesMap: Record<string, string> = {};
    const imageFiles = formData.getAll('new_images') as File[];

    // Upload new files
    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (file.size > 0) {
            const filename = `hero-${Date.now()}-${i}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const { data, error } = await supabase.storage
                .from('products')
                .upload(`hero/${filename}`, file);

            if (!error) {
                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(`hero/${filename}`);

                // Map the placeholder to the real URL
                // The frontend should send "new_file_0", "new_file_1" corresponding to the order in generic 'new_images' list
                newImagesMap[`new_file_${i}`] = publicUrl;

                // If layout is missing, just append to layout
                if (!imageLayoutString) {
                    imageLayout.push(publicUrl);
                }
            } else {
                console.error('Hero image upload error:', error);
            }
        }
    }

    // specific reconstruction if layout exists
    const hero_images = imageLayout.map(item => {
        if (item.startsWith('new_file_')) {
            return newImagesMap[item] || null; // Return null if upload failed or bad ref
        }
        return item; // It's an existing URL
    }).filter(url => url !== null) as string[];

    const show_products_section = true; // Always show per user request

    // We assume there's only one row, so we update the one with ID=1 or the first one found.
    // Or we can just update all rows if there's only supposed to be one.
    // Let's try to get ID first or upsert.

    // First check if exists
    const { data: existing } = await supabase.from('home_settings').select('id').limit(1).single();

    let error;
    if (existing) {
        const { error: updateError } = await supabase
            .from('home_settings')
            .update({
                hero_headline,
                hero_subheadline,
                hero_images,
                show_products_section,
                updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);
        error = updateError;
    } else {
        const { error: insertError } = await supabase
            .from('home_settings')
            .insert({
                hero_headline,
                hero_subheadline,
                hero_images,
                show_products_section,
            });
        error = insertError;
    }

    if (error) {
        throw new Error('설정 저장에 실패했습니다: ' + error.message);
    }

    revalidatePath('/');
    revalidatePath('/admin/home');
    return { success: true };
}
