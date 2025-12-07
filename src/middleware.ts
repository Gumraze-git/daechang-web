import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './config';

console.log('Middleware loaded');

export default createMiddleware({
    // A list of all locales that are supported
    locales,

    // Used when no locale matches
    defaultLocale
});

export const config = {
    matcher: ['/', '/(ko|en)/:path*'],
};
