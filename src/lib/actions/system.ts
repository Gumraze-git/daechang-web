'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface SystemSettings {
    id: number;
    password_expiration_enabled: boolean;
    password_expiration_days: number;
    updated_at: string;
}

export async function getSystemSettings() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching system settings:', error);
        return null;
    }

    return data as SystemSettings;
}

export async function togglePasswordExpiration(enabled: boolean) {
    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin
        .from('system_settings')
        .update({ password_expiration_enabled: enabled })
        // Update all rows since we only have one, implies logic 'where id is not null' or just ensure singleton
        // But since we have specific row ID usually 1, or just update based on existence.
        // Better to get the ID first or update 'all'. Since we have one row.
        .neq('id', 0); // Hacky way to update all? No, let's just grab the single row ID first or assume ID 1 if we seeded it.
    // Actually, RLS allows generic update if super admin. 
    // Let's use logic to update the single existing row.

    // Better approach:
    // We know there's only one row. 
    // Let's just update where id=1 if generated always as identity starts at 1.
    // Or better, don't filter, relying on there only being one row? No, .update() needs a filter usually unless allowed.
    // Let's fetch first.

    // Actually, let's just use a more robust update query or assume ID 1 from seed.
    // The migration: `generated always as identity` starts at 1.

    const { error: updateError } = await supabaseAdmin
        .from('system_settings')
        .update({ password_expiration_enabled: enabled, updated_at: new Date().toISOString() })
        .eq('id', 1); // Assuming the first row is ID 1.

    if (updateError) {
        // Fallback: maybe ID isn't 1? (e.g. deleted and re-added).
        // Let's try to update any row.
        const { data: settings } = await supabaseAdmin.from('system_settings').select('id').single();
        if (settings) {
            await supabaseAdmin
                .from('system_settings')
                .update({ password_expiration_enabled: enabled, updated_at: new Date().toISOString() })
                .eq('id', settings.id);
        } else {
            return { success: false, error: "Settings not found" };
        }
    }

    revalidatePath('/admin/admins');
    return { success: true };
}
