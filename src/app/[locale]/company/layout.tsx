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
    { name: t('company_ceo'), href: `/${locale}/company/ceo` },
    { name: t('company_history'), href: `/${locale}/company/history` },
    { name: t('company_organization'), href: `/${locale}/company/organization` },
    { name: t('company_location'), href: `/${locale}/company/location` },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">{t('company')}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation for Company pages */}
        <aside className="w-full md:w-1/4">
          <nav className="flex flex-col space-y-2">
            {companyNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-md text-lg font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700',
                  pathname === item.href
                    ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>
        {/* Main Content Area */}
        <main className="w-full md:w-3/4">
          {children}
        </main>
      </div>
    </div>
  );
}
