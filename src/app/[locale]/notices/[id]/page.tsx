'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';
import { use } from 'react';

// Mock data for notices (in a real app, this would come from an API or database)
const noticesData: Record<string, { titleKey: string; dateKey: string; content: string; category: string }> = {
  '1': {
    titleKey: 'notice1_title',
    dateKey: 'notice1_date',
    category: 'News',
    content: `
      <p>대창기계산업(주)가 2024년 신제품 라인업을 공개했습니다. 이번 신제품은 기존 모델 대비 생산성을 30% 향상시켰으며, 에너지 효율 또한 대폭 개선되었습니다.</p>
      <br />
      <h3>주요 특징</h3>
      <ul>
        <li>고속 생산 가능</li>
        <li>에너지 절감 기술 적용</li>
        <li>사용자 친화적 인터페이스</li>
      </ul>
      <br />
      <p>자세한 내용은 제품 소개 페이지에서 확인하실 수 있습니다. 앞으로도 끊임없는 기술 개발로 고객 여러분께 최고의 가치를 제공하겠습니다.</p>
    `
  },
  '2': {
    titleKey: 'notice2_title',
    dateKey: 'notice2_date',
    category: 'Exhibition',
    content: `
      <p>대창기계산업(주)가 오는 10월 개최되는 K-PLASTICS 2024 전시회에 참가합니다.</p>
      <br />
      <p>이번 전시회에서는 당사의 최신 블로우 몰딩기와 압출 라인을 직접 시연할 예정이오니, 많은 관심과 방문 부탁드립니다.</p>
      <br />
      <ul>
        <li>일시: 2024년 10월 15일 ~ 18일</li>
        <li>장소: KINTEX 제1전시장</li>
        <li>부스 번호: A-102</li>
      </ul>
    `
  },
  '3': {
    titleKey: 'notice3_title',
    dateKey: 'notice3_date',
    category: 'Maintenance',
    content: `
      <p>보다 안정적인 서비스 제공을 위해 정기 서버 점검이 진행될 예정입니다.</p>
      <br />
      <p>점검 시간 동안 홈페이지 접속이 원활하지 않을 수 있으니 양해 부탁드립니다.</p>
      <br />
      <p>일시: 2024년 9월 20일 00:00 ~ 04:00 (4시간)</p>
    `
  }
};

export default function NoticeDetailPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = use(params);
  const t = useTranslations('Index');
  const tDetail = useTranslations('NoticeDetail');

  const notice = noticesData[id];

  if (!notice) {
    notFound();
  }

  return (
    <div className="container mx-auto py-16 px-4 max-w-4xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-primary font-medium mb-4">
          <Tag className="w-4 h-4" />
          <span>{notice.category}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t(notice.titleKey)}
        </h1>
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{t(notice.dateKey)}</span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="w-full aspect-video bg-gray-200 rounded-xl mb-12 flex items-center justify-center text-gray-400">
        <span className="text-lg">Featured Image Placeholder</span>
      </div>

      {/* Content Section */}
      <div
        className="prose prose-lg max-w-none text-gray-700 mb-16"
        dangerouslySetInnerHTML={{ __html: notice.content }}
      />

      {/* Footer / Navigation */}
      <div className="border-t pt-8 flex justify-between items-center">
        <Link href={`/${locale}/notices`}>
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {tDetail('back_to_list')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
