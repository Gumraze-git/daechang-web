import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Target, Lightbulb, Users, ArrowRight, Shield, TrendingUp, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getCompanySettings, type CompanySettings } from '@/lib/actions/company';

const ICON_MAP: Record<string, LucideIcon> = {
  Target,
  Lightbulb,
  Users,
  Shield,
  TrendingUp,
};

export default async function CompanyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CompanyPage' });
  const settings = await getCompanySettings();

  const getD = (ko: string, en: string) => locale === 'ko' ? ko : en;

  // Overview data from Supabase or Fallback
  const overview = [
    { label: t('info_company_name'), value: settings ? getD(settings.company_name_ko, settings.company_name_en) : t('info_company_name_value') },
    { label: t('info_ceo'), value: settings ? getD(settings.ceo_name_ko, settings.ceo_name_en) : t('info_ceo_value') },
    { label: t('info_establishment'), value: settings ? getD(settings.establishment_ko, settings.establishment_en) : t('info_establishment_value') },
    { label: t('info_employees'), value: settings ? getD(settings.employees_ko, settings.employees_en) : t('info_employees_value') },
    { label: t('info_revenue'), value: settings ? getD(settings.revenue_ko, settings.revenue_en) : t('info_revenue_value') },
    { label: t('info_address'), value: settings ? getD(settings.address_ko, settings.address_en) : t('address_road') },
  ];

  // Core values from Supabase or Fallback
  const coreValues = settings?.core_values?.length ? settings.core_values.map(v => ({
    title: getD(v.title_ko, v.title_en),
    desc: getD(v.desc_ko, v.desc_en),
    icon: ICON_MAP[v.icon] || Users,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100"
  })) : [
    {
      title: t('value_challenge'),
      desc: t('value_challenge_desc'),
      icon: TrendingUp,
      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-100"
    },
    {
      title: t('value_customer'),
      desc: t('value_customer_desc'),
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-100"
    },
    {
      title: t('value_integrity'),
      desc: t('value_integrity_desc'),
      icon: Shield,
      color: "text-green-500",
      bg: "bg-green-50",
      border: "border-green-100"
    }
  ];

  return (
    <div className="flex flex-col gap-0 pb-20">
      <div className="container mx-auto px-4 flex flex-col gap-20">
        {/* Company Overview */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-8 bg-primary rounded-full" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t('overview_title')}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
              {overview.map((item, idx) => (
                <div key={idx} className={cn("p-8 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors", idx >= 3 && "border-t border-gray-100 dark:border-gray-700")}>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{item.label}</p>
                  <p className={cn("font-bold text-gray-900 dark:text-white", item.label === t('info_address') ? "text-lg font-medium break-keep" : "text-xl")}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {/* Mission */}
          <div className="bg-blue-600 rounded-3xl p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
              <Target size={120} />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Target className="w-6 h-6" /> {settings ? getD(settings.mission_title_ko, settings.mission_title_en) : t('mission_title')}
                </h3>
                <div className="w-12 h-1 bg-white/30 mb-6 rounded-full" />
                <p className="text-xl md:text-3xl font-light leading-snug opacity-90">
                  "{settings ? getD(settings.mission_desc_ko, settings.mission_desc_en) : t('mission_desc')}"
                </p>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-gray-900 dark:bg-gray-800 rounded-3xl p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
              <Lightbulb size={120} />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-yellow-500" /> {settings ? getD(settings.vision_title_ko, settings.vision_title_en) : t('vision_title')}
                </h3>
                <div className="w-12 h-1 bg-white/30 mb-6 rounded-full" />
                <p className="text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 leading-snug">
                  {settings ? getD(settings.vision_desc_ko, settings.vision_desc_en) : t('vision_desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="flex items-center gap-4 mb-12 justify-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t('core_values_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, idx) => (
              <Card key={idx} className="border-2 border-gray-100 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group overflow-hidden">
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <div className={`w-20 h-20 rounded-2xl ${value.bg} flex items-center justify-center mb-6 transition-transform duration-300`}>
                    <value.icon className={`w-10 h-10 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// Utility imported for use in mapping
import { cn } from '@/lib/utils';
