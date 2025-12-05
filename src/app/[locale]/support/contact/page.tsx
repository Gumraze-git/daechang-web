'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('SupportPage');

  const handleEmailInquiry = () => {
    window.location.href = 'mailto:info@daechang.co.kr';
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{t('contact_form_title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {t('contact_form_description')}
        </p>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-300" />
          </div>
          <h3 className="text-xl font-bold mb-2">이메일 문의</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            제품에 대한 궁금한 점이나 견적 문의를 이메일로 보내주세요.<br />
            담당자가 확인 후 신속하게 답변 드리겠습니다.
          </p>

          <Button
            onClick={handleEmailInquiry}
            className="w-full md:w-auto px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            이메일로 문의하기
          </Button>
        </div>
      </div>
    </div>
  );
}
