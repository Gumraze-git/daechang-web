'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { createInquiry } from '@/lib/actions/inquiries';
import { useToast } from '@/components/ui/use-toast';
import { getProductCategories } from '@/lib/actions/products';

function ContactForm() {
  const t = useTranslations('SupportPage');
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // State for form fields
  const [inquiryType, setInquiryType] = useState('product');
  const [productCategory, setProductCategory] = useState('');
  const [categories, setCategories] = useState<{ code: string; name_ko: string; name_en: string }[]>([]);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    const categoryParam = searchParams.get('category');

    if (typeParam) {
      setInquiryType(typeParam);
    }
    if (categoryParam) {
      setProductCategory(categoryParam);
    }

    const fetchCategories = async () => {
      try {
        const data = await getProductCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, [searchParams]);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // Manually append select values
    formData.set('inquiry_type', inquiryType);
    if (productCategory) formData.set('product_category', productCategory);

    try {
      const result = await createInquiry(formData);

      if (result.success) {
        setIsSuccess(true);
        toast({
          variant: "success",
          title: t('submit_success_title'),
          description: t('submit_success_desc'),
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 px-4 sm:px-6 py-20">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('submit_success_title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
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
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-none border border-gray-100 dark:border-gray-800">

          <div className="mb-10 text-center md:text-left border-b border-gray-100 dark:border-gray-800 pb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('form_title')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t('form_required_guides')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 group">
                <Label htmlFor="company" className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group-focus-within:text-blue-600 transition-colors">
                  {t('form_field_company_name')}
                </Label>
                <Input
                  id="company"
                  name="company_name"
                  placeholder={t('placeholder_company')}
                  className="h-14 bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300"
                />
              </div>
              <div className="space-y-3 group">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group-focus-within:text-blue-600 transition-colors">
                  {t('form_field_person_in_charge')} <span className="text-blue-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="person_name"
                  required
                  placeholder={t('placeholder_name')}
                  className="h-14 bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300"
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
                  name="email"
                  type="email"
                  required
                  placeholder={t('placeholder_email')}
                  className="h-14 bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300"
                />
              </div>
              <div className="space-y-3 group">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group-focus-within:text-blue-600 transition-colors">
                  {t('form_field_phone')} <span className="text-blue-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder={t('placeholder_phone')}
                  className="h-14 bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 group">
                <Label htmlFor="type" className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group-focus-within:text-blue-600 transition-colors">
                  {t('form_field_inquiry_type')} <span className="text-blue-500">*</span>
                </Label>
                <Select value={inquiryType} onValueChange={setInquiryType}>
                  <SelectTrigger className="h-14 bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 data-[state=open]:bg-white dark:data-[state=open]:bg-gray-900 focus:border-blue-500 rounded-xl text-lg px-4 relative z-10">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent align="start" className="rounded-xl border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-900 z-50">
                    <SelectItem value="general" className="text-base py-3 cursor-pointer">{t('form_option_general_inquiry')}</SelectItem>
                    <SelectItem value="product" className="text-base py-3 cursor-pointer">{t('form_option_product_inquiry')}</SelectItem>
                    <SelectItem value="tech" className="text-base py-3 cursor-pointer">{t('form_option_technical_support')}</SelectItem>
                    <SelectItem value="quote" className="text-base py-3 cursor-pointer">{t('form_option_quotation_request')}</SelectItem>
                    <SelectItem value="other" className="text-base py-3 cursor-pointer">{t('form_option_other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 group">
                <Label htmlFor="category" className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group-focus-within:text-blue-600 transition-colors">
                  {t('form_field_product_category')}
                </Label>
                <Select value={productCategory} onValueChange={setProductCategory}>
                  <SelectTrigger className="h-14 bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 data-[state=open]:bg-white dark:data-[state=open]:bg-gray-900 focus:border-blue-500 rounded-xl text-lg px-4 relative z-10">
                    <SelectValue placeholder={t('placeholder_select_category')} />
                  </SelectTrigger>
                  <SelectContent align="start" className="rounded-xl border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-900 z-50">
                    {categories.map((category) => (
                      <SelectItem key={category.code} value={category.code} className="text-base py-3 cursor-pointer">
                        {category.name_ko} {category.name_en ? `(${category.name_en})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 group">
              <Label htmlFor="message" className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider group-focus-within:text-blue-600 transition-colors">
                {t('form_field_message')} <span className="text-blue-500">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                required
                placeholder={t('placeholder_message')}
                className="min-h-[200px] bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-lg p-5 resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300"
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
                className="w-full h-16 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    문의 발송 중...
                  </>
                ) : (
                  t('form_submit_button')
                )}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>}>
      <ContactForm />
    </Suspense>
  );
}
