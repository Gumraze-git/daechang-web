import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLocale } from 'next-intl';

type NoticeDetailPageProps = {
  params: { id: string; locale: string };
};

export default function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const t = useTranslations('SupportPage');
  const tIndex = useTranslations('Index');
  const locale = useLocale();

  // Placeholder notice data (fetch from API/DB in real app)
  const noticeData = {
    '1': {
      titleKey: 'notice1_title',
      dateKey: 'notice1_date',
      content_en: 'Details about the upcoming exhibition. We invite you to visit our booth and explore our latest innovations in industrial machinery. Our team will be present to answer all your questions and provide live demonstrations.',
      content_ko: '다가오는 전시회에 대한 자세한 정보입니다. 저희 부스를 방문하셔서 산업 기계의 최신 혁신을 살펴보시기 바랍니다. 저희 팀이 모든 질문에 답변하고 라이브 시연을 제공할 것입니다.',
    },
    '2': {
      titleKey: 'notice2_title',
      dateKey: 'notice2_date',
      content_en: 'Exciting new product lineup released! We are proud to introduce our next-generation blow molding machines and extrusion lines, featuring enhanced efficiency, precision, and smart functionalities. Visit our products page for more details.',
      content_ko: '흥미로운 신제품 라인업이 출시되었습니다! 향상된 효율성, 정밀도 및 스마트 기능을 갖춘 차세대 블로우 몰딩기 및 압출 라인을 소개하게 되어 자랑스럽습니다. 자세한 내용은 제품 페이지를 참조하십시오.',
    },
    '3': {
      titleKey: 'notice3_title',
      dateKey: 'notice3_date',
      content_en: 'Annual maintenance schedule for all Daechang Machinery products. Please review the attached document for detailed information on recommended service intervals and booking procedures to ensure optimal performance and longevity of your equipment.',
      content_ko: '대창기계산업 모든 제품에 대한 연간 정기 보수 일정입니다. 장비의 최적 성능과 수명 유지를 위해 권장 서비스 간격 및 예약 절차에 대한 자세한 정보는 첨부된 문서를 참조하십시오.',
    },
  };

  const notice = noticeData[params.id as keyof typeof noticeData];

  if (!notice) {
    notFound();
  }

  const content = locale === 'en' ? notice.content_en : notice.content_ko;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">{t('notice_detail_title')}</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-3xl font-semibold mb-2">{tIndex(notice.titleKey)}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{tIndex(notice.dateKey)}</p>
        <div className="prose dark:prose-invert max-w-none">
          <p>{content}</p>
        </div>
      </div>
      <Link href={`/${locale}/support/notices`}>
        <Button variant="outline">
          {tIndex('view_all')} {/* Use view_all as 'Back to List' */}
        </Button>
      </Link>
    </div>
  );
}
