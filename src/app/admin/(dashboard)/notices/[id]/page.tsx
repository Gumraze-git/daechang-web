import NoticeForm from '@/components/admin/NoticeForm';
import { getNotice } from '@/lib/actions/notices';
import { notFound } from 'next/navigation';

export default async function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const notice = await getNotice(id);

    if (!notice) {
        notFound();
    }

    return <NoticeForm initialData={notice} isEdit={true} />;
}
