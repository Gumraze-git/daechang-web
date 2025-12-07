'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('SupportPage');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="border-none shadow-lg bg-green-50 dark:bg-green-900/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-300" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
              {t('form_success_message')}
            </h2>
            <p className="text-green-700 dark:text-green-400 mb-8">
              담당자가 확인 후 입력하신 이메일로 연락드리겠습니다.
            </p>
            <Button
              onClick={() => setIsSuccess(false)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              추가 문의하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('contact_form_title')}</h2>
        <p className="text-gray-600 dark:text-gray-300">
          {t('contact_form_description')}
        </p>
      </div>

      <Card className="shadow-lg border-gray-100 dark:border-gray-800">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
          <CardTitle className="text-xl">문의 작성</CardTitle>
          <CardDescription>필수 항목(*)을 모두 입력해 주세요.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company">{t('form_field_company_name')}</Label>
                <Input id="company" placeholder="대창기계산업" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">{t('form_field_person_in_charge')} <span className="text-red-500">*</span></Label>
                <Input id="name" required placeholder="홍길동" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">{t('form_field_email')} <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" required placeholder="example@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('form_field_phone')} <span className="text-red-500">*</span></Label>
                <Input id="phone" type="tel" required placeholder="010-1234-5678" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">{t('form_field_inquiry_type')} <span className="text-red-500">*</span></Label>
              <Select defaultValue="product">
                <SelectTrigger>
                  <SelectValue placeholder="문의 유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{t('form_option_general_inquiry')}</SelectItem>
                  <SelectItem value="product">{t('form_option_product_inquiry')}</SelectItem>
                  <SelectItem value="tech">{t('form_option_technical_support')}</SelectItem>
                  <SelectItem value="quote">{t('form_option_quotation_request')}</SelectItem>
                  <SelectItem value="other">{t('form_option_other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{t('form_field_message')} <span className="text-red-500">*</span></Label>
              <Textarea
                id="message"
                required
                placeholder="문의하실 내용을 상세히 적어주세요."
                className="min-h-[150px]"
              />
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox id="privacy" required />
              <Label htmlFor="privacy" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('form_privacy_consent')} <span className="text-red-500">*</span>
              </Label>
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  제출 중...
                </>
              ) : (
                t('form_submit_button')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
