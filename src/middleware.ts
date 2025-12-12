import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './config';

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale
});

export default function middleware(request: NextRequest) {
    // 1. Admin Authentication Check
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/admin')) {
        // Skip check for login page itself
        if (pathname === '/admin/login') {
            return NextResponse.next();
        }

        // Check for session cookie
        const session = request.cookies.get('admin_session');
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // 2. Internationalization (for non-admin routes or if we wanted intl on admin)
    // Admin pages are currently not localized by next-intl (they are outside [locale])
    // so we only run intlMiddleware if valid locale path
    if (!pathname.startsWith('/admin')) {
        return intlMiddleware(request);
    }

    return NextResponse.next();
}

export const config = {
    // Matcher: Match all internationalized paths AND admin paths
    matcher: ['/', '/(ko|en)/:path*', '/admin/:path*'],
};
