import { getNotices } from '@/lib/actions/notices';
import NoticeList from '@/components/NoticeList';

export default async function NoticesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const notices = await getNotices();

  return <NoticeList initialNotices={notices} locale={locale} />;
}
