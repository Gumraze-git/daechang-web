import { getNotices } from '@/lib/actions/notices';
import { getNoticeCategories } from '@/lib/actions/notice-categories';
import NoticeList from '@/components/NoticeList';

export default async function NoticesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const notices = await getNotices();
  const categories = await getNoticeCategories();

  return <NoticeList initialNotices={notices} categories={categories} locale={locale} />;
}
