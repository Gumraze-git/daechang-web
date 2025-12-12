import NoticeForm from '@/components/admin/NoticeForm';

export default function EditNoticePage({ params }: { params: { id: string } }) {
    // Mock data for editing
    const initialData = {
        id: params.id,
        title: '전시회 참가 안내 (K-Machinery 2025)',
        title_en: 'Exhibition Notice (K-Machinery 2025)',
        body_ko: '대창기계산업이 2025년 K-Machinery 전시회에 참가합니다. 많은 관심 부탁드립니다.\n\n날짜: 2025.11.28 ~ 11.30\n위치: KINTEX 1홀',
        body_en: 'Daechang Machinery will participate in K-Machinery 2025. Please visit our booth.\n\nDate: Nov 28-30, 2025\nLocation: KINTEX Hall 1',
        category: 'exhibition',
        status: 'published',
        date: '2025-11-28',
        pinned: true,
    };

    return <NoticeForm initialData={initialData} isEdit={true} />;
}
