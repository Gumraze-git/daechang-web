import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '../config';

export default getRequestConfig(async ({ locale }) => {
    // Validate locale; fallback to default locale if invalid/missing
    const resolvedLocale = locale && locales.includes(locale as any) ? locale : defaultLocale;

    return {
        locale: resolvedLocale,
        messages: (await import(`../messages/${resolvedLocale}.json`)).default
    };
});
