import { NextIntlClientProvider } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { locales, defaultLocale } from '@/config';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Omit<Props, 'children'>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Index' });

  return {
    title: t('title'),
    description: t('description'),
    icons: {
      icon: '/favicon_v3.png',
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://daechang-web.vercel.app/${locale}`,
      siteName: '대창기계산업(주)',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      type: 'website',
    },
  };
}

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
