import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { locales, defaultLocale } from './config';

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale
});

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Admin Routes: Use Supabase Authentication
    if (pathname.startsWith('/admin')) {
        return await updateSession(request);
    }

    // 2. Public Routes: Use next-intl Middleware (i18n)
    // This handles redirects (e.g., / -> /ko) and locale cookies
    return intlMiddleware(request);
}

export const config = {
    // Matcher: Match all internationalized paths AND admin paths
    matcher: ['/', '/(ko|en)/:path*', '/admin/:path*'],
};
