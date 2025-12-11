'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card'; // Title/Header removed from Card for cleaner look
import { Loader2, CheckCircle2, Send } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('SupportPage');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto py-32 px-4">
        <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl text-center border border-gray-100 dark:border-gray-700">
          <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-8 mx-auto animate-in zoom-in-50 duration-500">
            <CheckCircle2 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            {t('submit_success_title')}
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
            {t('submit_success_desc')}
          </p>
          <Button
            onClick={() => setIsSuccess(false)}
            size="lg"
            className="w-full h-14 text-lg bg-gray-900 hover:bg-black text-white rounded-xl transition-all"
          >
            {t('btn_submit_more')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-12">

        {/* Header: Left Aligned & Refined */}
        <div className="max-w-3xl mx-auto pl-2 md:pl-0 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            {t('contact_form_title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-normal max-w-2xl">
            {t('contact_form_description')}
          </p>
        </div>

        {/* Form Container: Floating, Modern */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-gray-800">

          <div className="mb-10 text-center md:text-left border-b border-gray-100 dark:border-gray-800 pb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('form_title')}</h2>
            <p className="text-gray-400 mt-1">{t('form_required_guides')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 group">
                <Label htmlFor="company" className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group-focus-within:text-blue-600 transition-colors">
                  {t('form_field_company_name')}
                </Label>
                <Input
                  id="company"
                  placeholder={t('placeholder_company')}
                  className="h-14 bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-lg placeholder:text-gray-400/50 dark:placeholder:text-gray-600/50 transition-all duration-300"
                />
              </div>
              <div className="space-y-3 group">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group-focus-within:text-blue-600 transition-colors">
                  {t('form_field_person_in_charge')} <span className="text-blue-500">*</span>
                </Label>
                <Input
                  id="name"
                  required
                  placeholder={t('placeholder_name')}
                  className="h-14 bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-lg placeholder:text-gray-400/50 dark:placeholder:text-gray-600/50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 group">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group-focus-within:text-blue-600 transition-colors">
                  {t('form_field_email')} <span className="text-blue-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder={t('placeholder_email')}
                  className="h-14 bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-lg placeholder:text-gray-400/50 dark:placeholder:text-gray-600/50 transition-all duration-300"
                />
              </div>
              <div className="space-y-3 group">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group-focus-within:text-blue-600 transition-colors">
                  {t('form_field_phone')} <span className="text-blue-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  placeholder={t('placeholder_phone')}
                  className="h-14 bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-lg placeholder:text-gray-400/50 dark:placeholder:text-gray-600/50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-3 group">
              <Label htmlFor="type" className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group-focus-within:text-blue-600 transition-colors">
                {t('form_field_inquiry_type')} <span className="text-blue-500">*</span>
              </Label>
              <Select defaultValue="product">
                <SelectTrigger className="h-14 bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 rounded-xl text-lg px-4">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 dark:border-gray-800 shadow-xl">
                  <SelectItem value="general" className="text-base py-3 cursor-pointer">{t('form_option_general_inquiry')}</SelectItem>
                  <SelectItem value="product" className="text-base py-3 cursor-pointer">{t('form_option_product_inquiry')}</SelectItem>
                  <SelectItem value="tech" className="text-base py-3 cursor-pointer">{t('form_option_technical_support')}</SelectItem>
                  <SelectItem value="quote" className="text-base py-3 cursor-pointer">{t('form_option_quotation_request')}</SelectItem>
                  <SelectItem value="other" className="text-base py-3 cursor-pointer">{t('form_option_other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 group">
              <Label htmlFor="message" className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group-focus-within:text-blue-600 transition-colors">
                {t('form_field_message')} <span className="text-blue-500">*</span>
              </Label>
              <Textarea
                id="message"
                required
                placeholder={t('placeholder_message')}
                className="min-h-[200px] bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-lg p-5 resize-none placeholder:text-gray-400/50 dark:placeholder:text-gray-600/50 transition-all duration-300"
              />
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <Checkbox id="privacy" required className="w-5 h-5 border-2 border-gray-300 rounded data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all" />
              <Label htmlFor="privacy" className="text-sm text-gray-500 dark:text-gray-400 font-medium cursor-pointer select-none">
                {t('form_privacy_consent')} <span className="text-blue-500">*</span>
              </Label>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-16 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {t('form_submit_button')}
                    <Send className="w-5 h-5 ml-1" />
                  </>
                )}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
