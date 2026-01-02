import { createAdminClient } from '@/lib/supabase/admin';
import { headers } from 'next/headers';

export async function checkRateLimit(action: string, limit: number, windowSeconds: number): Promise<{ success: boolean; message?: string }> {
    try {
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || 'unknown';

        // Use Admin Client to bypass RLS for logging
        const supabaseAdmin = createAdminClient();

        const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString();

        // 1. Count recent requests
        const { count, error } = await supabaseAdmin
            .from('rate_limit_logs')
            .select('*', { count: 'exact', head: true })
            .eq('ip', ip)
            .eq('action', action)
            .gte('created_at', windowStart);

        if (error) {
            console.error('Rate limit check error:', error);
            // Fail open (allow request) if DB error, to prevent blocking valid users during outages?
            // Or fail closed. Better to fail open for UX if it's just a log error.
            return { success: true };
        }

        if (count !== null && count >= limit) {
            return { success: false, message: 'Too many requests. Please try again later.' };
        }

        // 2. Log this request
        // Don't await this if you want speed, but for strictness usually await.
        // Given it's a small app, await is safer to ensure log is written.
        await supabaseAdmin
            .from('rate_limit_logs')
            .insert({ ip, action });

        return { success: true };

    } catch (err) {
        console.error('Rate limit unhandled error:', err);
        return { success: true };
    }
}
