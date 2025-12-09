'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { NoticeCard } from '@/components/NoticeCard';

export default function NoticesPage() {
  const t = useTranslations('SupportPage');
  const tIndex = useTranslations('Index');
  const tCats = useTranslations('NoticeCategories');
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const itemsPerPage = 7;

  // Placeholder notices data with categories
  // Generating more mock data to demonstrate pagination
  const notices = [
    { id: '1', titleKey: 'notice1_title', dateKey: 'notice1_date', category: 'news' },
    { id: '2', titleKey: 'notice2_title', dateKey: 'notice2_date', category: 'exhibition' },
    { id: '3', titleKey: 'notice3_title', dateKey: 'notice3_date', category: 'maintenance' },
    { id: '4', titleKey: 'notice1_title', dateKey: 'notice1_date', category: 'news' },
    { id: '5', titleKey: 'notice2_title', dateKey: 'notice2_date', category: 'exhibition' },
    { id: '6', titleKey: 'notice3_title', dateKey: 'notice3_date', category: 'maintenance' },
    { id: '7', titleKey: 'notice1_title', dateKey: 'notice1_date', category: 'news' },
    { id: '8', titleKey: 'notice2_title', dateKey: 'notice2_date', category: 'exhibition' }, // Should be on page 2
    { id: '9', titleKey: 'notice3_title', dateKey: 'notice3_date', category: 'maintenance' },
    { id: '10', titleKey: 'notice1_title', dateKey: 'notice1_date', category: 'news' },
  ];

  const categories = [
    { id: 'all', label: tCats('all') },
    { id: 'news', label: tCats('news') },
    { id: 'exhibition', label: tCats('exhibition') },
    { id: 'maintenance', label: tCats('maintenance') },
  ];

  const filteredNotices = activeTab === 'all'
    ? notices
    : notices.filter(notice => notice.category === activeTab);

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotices = filteredNotices.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset page when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 relative">
        <h1 className="text-4xl font-bold text-center md:text-left w-full md:w-auto mb-4 md:mb-0">{t('notices_list_title')}</h1>

        {/* View Toggle - Absolute on desktop to align right, relative on mobile */}
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
      <div className="flex justify-center mb-8 space-x-2 overflow-x-auto pb-2">
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
          currentNotices.map((notice, index) => (
            viewMode === 'grid' ? (
              <NoticeCard
                key={`${notice.id}-${index}`}
                title={tIndex(notice.titleKey)}
                date={tIndex(notice.dateKey)}
                category={tCats(notice.category)}
                href={`/${locale}/notices/${notice.id}`}
                locale={locale}
              />
            ) : (
              <Link key={`${notice.id}-${index}`} href={`/${locale}/notices/${notice.id}`} className="group block">
                <div className="bg-white border border-gray-100 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center gap-4 transition-all hover:shadow-md hover:border-gray-200">
                  <span className="shrink-0 w-24 text-sm text-gray-500">{tIndex(notice.dateKey)}</span>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        {tCats(notice.category)}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary transition-colors truncate">
                      {tIndex(notice.titleKey)}
                    </h3>
                  </div>
                  <div className="shrink-0 text-sm font-medium text-muted-foreground group-hover:text-primary flex items-center self-end md:self-center">
                    {tIndex('view_all')} <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            )
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 col-span-full">
            게시글이 없습니다.
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
