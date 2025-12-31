import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '../config';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;
    // Validate locale; fallback to default locale if invalid/missing
    if (!locale || !locales.includes(locale as any)) {
        locale = defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
