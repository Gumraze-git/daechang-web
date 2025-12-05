'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Common');
  const pathname = usePathname();
  const locale = useLocale();

  const companyNavItems = [
    { name: t('company_intro'), href: `/${locale}/company`, exact: true },
    { name: t('company_ceo'), href: `/${locale}/company/ceo` },
    { name: t('company_history'), href: `/${locale}/company/history` },
    { name: t('company_location'), href: `/${locale}/company/location` },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sub-visual Banner */}
      <div className="relative w-full h-64 md:h-80 bg-slate-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-slate-900/90 z-10" />
        <div className="absolute inset-0 bg-[url('/images/company_banner.png')] bg-cover bg-center" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('company')}</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            {t('description')}
          </p>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto py-12 px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <nav className="flex flex-col space-y-2 sticky top-24">
              <h2 className="text-xl font-bold mb-4 px-4 text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white pb-2">
                {t('company_intro')}
              </h2>
              {companyNavItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                      isActive
                        ? 'bg-blue-600 text-white shadow-md transform translate-x-1'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="w-full md:w-3/4 lg:w-4/5 min-h-[500px]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
