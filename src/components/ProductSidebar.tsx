'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce'; // Assuming this hook exists or I will implement a simple one

type Category = {
    nameKey: string;
    slug: string;
};

export function ProductSidebar({ categories, locale }: { categories: Category[], locale: string }) {
    const t = useTranslations('ProductPage');
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategory = searchParams.get('category');
    const currentSearch = searchParams.get('q') || '';

    const [searchTerm, setSearchTerm] = useState(currentSearch);

    // Debounce search update
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== currentSearch) {
                const params = new URLSearchParams(searchParams);
                if (searchTerm) {
                    params.set('q', searchTerm);
                } else {
                    params.delete('q');
                }
                router.push(`${pathname}?${params.toString()}`);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, currentSearch, pathname, router, searchParams]);

    return (
        <aside className="w-full md:w-1/4 lg:w-1/5">
            <nav className="flex flex-col space-y-6 sticky top-24">
                {/* Title */}
                <h2 className="text-xl font-bold px-4 text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white pb-2">
                    {t('products')}
                </h2>

                {/* Search Input */}
                <div className="px-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder={t('search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-white"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-col space-y-1">
                    <Link
                        href={`/${locale}/products`}
                        className={cn(
                            'px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                            !currentCategory
                                ? 'bg-blue-600 text-white shadow-md transform translate-x-1'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                        )}
                    >
                        {t('all_products')}
                    </Link>

                    {categories.map((category) => {
                        const isActive = currentCategory === category.slug;
                        return (
                            <Link
                                key={category.slug}
                                href={`/${locale}/products?category=${category.slug}`}
                                className={cn(
                                    'px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md transform translate-x-1'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                                )}
                            >
                                {t(category.nameKey)}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </aside>
    );
}
