'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, LayoutGrid, List, Pin } from 'lucide-react';
import { NoticeCard } from '@/components/NoticeCard';
import type { Notice } from '@/lib/actions/notices';
import Image from 'next/image';

interface NoticeListProps {
    initialNotices: Notice[];
    locale: string;
}

export default function NoticeList({ initialNotices, locale }: NoticeListProps) {
    const t = useTranslations('SupportPage');
    const tIndex = useTranslations('Index');
    const tCats = useTranslations('NoticeCategories');
    const [activeTab, setActiveTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const itemsPerPage = 7;

    const categories = [
        { id: 'all', label: tCats('all') },
        { id: 'news', label: tCats('news') },
        { id: 'exhibition', label: tCats('exhibition') },
        { id: 'maintenance', label: tCats('maintenance') },
        // Add 'other' if used
    ];

    // Filter notices
    const filteredNotices = activeTab === 'all'
        ? initialNotices
        : initialNotices.filter(notice => notice.category === activeTab);

    // Published filter (optional: generally server filters this, but just in case)
    const publishedNotices = filteredNotices.filter(n => n.status === 'published' || n.status === 'active');
    // Note: getNotices might return all. Let's assume server filters for public. 
    // Actually getNotices currently fetches ALL. We should probably filter on server? 
    // But for now, let's filter client side to be safe.
    const validNotices = publishedNotices;


    const totalPages = Math.ceil(validNotices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentNotices = validNotices.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setCurrentPage(1);
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 relative">
                <h1 className="text-4xl font-bold text-center md:text-left w-full md:w-auto mb-4 md:mb-0">{t('notices_list_title')}</h1>

                {/* View Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            "p-2 rounded-md transition-all",
                            viewMode === 'grid' ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
                        )}
                        aria-label="Grid View"
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                            "p-2 rounded-md transition-all",
                            viewMode === 'list' ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
                        )}
                        aria-label="List View"
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex justify-center mb-8 space-x-2 overflow-x-auto py-2 px-1">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleTabChange(cat.id)}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                            activeTab === cat.id
                                ? "bg-blue-600 text-white shadow-md transform scale-105"
                                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300"
                        )}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Notices List/Grid */}
            <div className={cn(
                "mb-8",
                viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" : "flex flex-col gap-4"
            )}>
                {currentNotices.length > 0 ? (
                    currentNotices.map((notice) => {
                        const isKo = locale === 'ko';
                        const title = isKo ? notice.title_ko : (notice.title_en || notice.title_ko);
                        // Using en-US format for consistent server/client rendering if locale issues persist, 
                        // but ideally passing locale should work. If it fails, we can suppressHydrationWarning.
                        // Let's try passing 'ko-KR' explicitly if locale is 'ko', else 'en-US'.
                        const dateLocale = locale === 'ko' ? 'ko-KR' : 'en-US';
                        const date = new Date(notice.published_at).toLocaleDateString(dateLocale, {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        });

                        return viewMode === 'grid' ? (
                            <NoticeCard
                                key={notice.id}
                                title={title}
                                date={date}
                                category={notice.category} // Pass raw category, or map if needed
                                href={`/${locale}/notices/${notice.id}`}
                                locale={locale}
                                imageUrl={notice.image_urls?.[0] || notice.image_url}
                                isPinned={notice.is_pinned}
                            />
                        ) : (
                            <Link key={notice.id} href={`/${locale}/notices/${notice.id}`} className="group block">
                                <div className={cn(
                                    "border rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center gap-4 transition-all hover:shadow-md",
                                    notice.is_pinned
                                        ? "bg-blue-50/50 border-blue-100 border-l-[3px] border-l-blue-500 dark:bg-blue-900/20 dark:border-blue-800"
                                        : "bg-white border-gray-100 hover:border-gray-200 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-gray-700"
                                )}>
                                    <div className="shrink-0 w-24 h-16 relative bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                                        {(notice.image_urls?.[0] || notice.image_url) ? (
                                            <Image src={notice.image_urls?.[0] || notice.image_url!} alt={title} fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                                        )}
                                        {/* Optional: Small dot for pinned items in list view if needed, but background distinguishes it enough? Or keep badge? */}
                                        {/* Let's keep it clean as requested. Maybe just icon in text area. */}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {notice.is_pinned && (
                                                <Pin size={12} className="text-blue-600 fill-current" />
                                            )}
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{date}</span>
                                            <span className="text-gray-300 dark:text-gray-600">|</span>
                                            <span className={cn(
                                                "text-xs font-semibold px-1.5 py-0.5 rounded uppercase",
                                                "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                            )}>
                                                {notice.category}
                                            </span>
                                        </div>
                                        <h3 className={cn(
                                            "text-lg font-medium transition-colors truncate",
                                            notice.is_pinned ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-200 group-hover:text-primary"
                                        )}>
                                            {title}
                                        </h3>
                                    </div>
                                    <div className="shrink-0 text-sm font-medium text-muted-foreground group-hover:text-primary flex items-center self-end md:self-center">
                                        {tIndex('view_all')} <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="text-center py-12 text-gray-500 col-span-full">
                        {t('no_posts')}
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                        {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
