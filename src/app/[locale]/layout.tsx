import { NextIntlClientProvider } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { locales, defaultLocale } from '@/config';
import { getMessages } from 'next-intl/server';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = locales.includes(rawLocale as any) ? rawLocale : defaultLocale;

  const messages = await getMessages({ locale }).catch((err) => {
    console.error('Failed to load messages:', err);
    return {}; // Fallback to empty messages to avoid 404
  });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
