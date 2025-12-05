'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NoticesPage() {
  const t = useTranslations('SupportPage');
  const tIndex = useTranslations('Index');
  const tCats = useTranslations('NoticeCategories');
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
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
      <h1 className="text-4xl font-bold text-center mb-8">{t('notices_list_title')}</h1>

      {/* Category Tabs */}
      <div className="flex justify-center mb-8 space-x-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleTabChange(cat.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="grid gap-6 mb-8">
        {currentNotices.length > 0 ? (
          currentNotices.map((notice, index) => (
            <Card key={`${notice.id}-${index}`} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded mb-2">
                      {tCats(notice.category)}
                    </span>
                    <CardTitle>{tIndex(notice.titleKey)}</CardTitle>
                  </div>
                  <CardDescription>{tIndex(notice.dateKey)}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={`/${locale}/notices/${notice.id}`}>
                  <Button variant="link" className="px-0">
                    {tIndex('view_all')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
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
