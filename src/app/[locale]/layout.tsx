import { NextIntlClientProvider } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { locales, defaultLocale } from '@/config';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale }).catch((err) => {
    console.error('Failed to load messages:', err);
    return {}; // Fallback to empty messages to avoid 404
  });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow animate-fade-in-up">
          {children}
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
