import NoticeForm from '@/components/admin/NoticeForm';
import { getNotice } from '@/lib/actions/notices';
import { getNoticeCategories } from '@/lib/actions/notice-categories';
import { notFound } from 'next/navigation';

export default async function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [notice, categories] = await Promise.all([
        getNotice(id),
        getNoticeCategories()
    ]);

    if (!notice) {
        notFound();
    }

    return <NoticeForm initialData={notice} isEdit={true} categories={categories} />;
}
