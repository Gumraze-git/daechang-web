import NoticeForm from '@/components/admin/NoticeForm';
import { getNoticeCategories } from '@/lib/actions/notice-categories';

export default async function NewNoticePage() {
    const categories = await getNoticeCategories();
    return <NoticeForm categories={categories} />;
}
