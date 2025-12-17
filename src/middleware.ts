import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { locales, defaultLocale } from './config';

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale
});

export async function middleware(request: NextRequest) {
    // 1. Admin Authentication Check via Supabase
    // updateSession handles token refresh and redirects for protected routes
    return await updateSession(request);

    // Note: We are currently delegating all middleware logic to Supabase 'updateSession'.
    // If you need next-intl middleware to run AFTER auth check, you need to combine them.
    // However, updateSession already returns a response.
    // For now, let's prioritize Admin Auth. 
    // If public pages need i18n middleware, we need to merge the logic in src/lib/supabase/middleware.ts
    // or chain them here.
}

export const config = {
    // Matcher: Match all internationalized paths AND admin paths
    matcher: ['/', '/(ko|en)/:path*', '/admin/:path*'],
};
