'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  const t = useTranslations('SupportPage');
  const [formData, setFormData] = useState({
    companyName: '',
    personInCharge: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
    privacyConsent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, inquiryType: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, privacyConsent: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send formData to your backend API
    console.log('Form submitted:', formData);
    alert(t('form_success_message'));
    // Reset form or redirect
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-8">{t('contact_form_title')}</h1>
      <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-8">
        {t('contact_form_description')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div>
          <Label htmlFor="companyName">{t('form_field_company_name')}</Label>
          <Input
            id="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="personInCharge">{t('form_field_person_in_charge')}</Label>
          <Input
            id="personInCharge"
            type="text"
            value={formData.personInCharge}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">{t('form_field_email')}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">{t('form_field_phone')}</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="inquiryType">{t('form_field_inquiry_type')}</Label>
          <Select onValueChange={handleSelectChange} value={formData.inquiryType} required>
            <SelectTrigger id="inquiryType">
              <SelectValue placeholder={t('form_field_inquiry_type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">{t('form_option_general_inquiry')}</SelectItem>
              <SelectItem value="product">{t('form_option_product_inquiry')}</SelectItem>
              <SelectItem value="technical">{t('form_option_technical_support')}</SelectItem>
              <SelectItem value="quotation">{t('form_option_quotation_request')}</SelectItem>
              <SelectItem value="other">{t('form_option_other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="message">{t('form_field_message')}</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="privacyConsent"
            checked={formData.privacyConsent}
            onCheckedChange={handleCheckboxChange}
            required
          />
          <Label htmlFor="privacyConsent">
            {t('form_privacy_consent')}
          </Label>
        </div>
        <Button type="submit" className="w-full">
          {t('form_submit_button')}
        </Button>
      </form>
    </div>
  );
}
