import { useTranslations } from 'next-intl';
import { Calendar, User, TrendingUp, Users } from 'lucide-react';

export default function CompanyPage() {
  const t = useTranslations('CompanyPage');
  return (
    <div className="flex flex-col gap-16">


      {/* Mission Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6 text-blue-900 dark:text-blue-400">
          {t('mission_title')}
        </h2>
        <p className="text-2xl md:text-4xl font-light text-gray-800 dark:text-gray-200 leading-relaxed max-w-4xl mx-auto">
          "{t('mission_desc')}"
        </p>
      </section>

      {/* Vision Section */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          {t('vision_title')}
        </h2>
        <p className="text-4xl md:text-5xl font-extrabold text-blue-800 dark:text-blue-300">
          {t('vision_desc')}
        </p>
      </section>

      {/* Core Values Section */}
      <section>
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-white">
          {t('core_values_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Challenge */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-blue-500">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('value_challenge')}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('value_challenge_desc')}
            </p>
          </div>
          {/* Customer */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-green-500">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('value_customer')}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('value_customer_desc')}
            </p>
          </div>
          {/* Integrity */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-purple-500">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('value_integrity')}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('value_integrity_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Company Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: t('info_establishment'),
            value: t('info_establishment_value'),
            icon: Calendar,
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-900/20"
          },
          {
            label: t('info_ceo'),
            value: t('info_ceo_value'),
            icon: User,
            color: "text-green-600",
            bg: "bg-green-50 dark:bg-green-900/20"
          },
          {
            label: t('info_revenue'),
            value: t('info_revenue_value'),
            icon: TrendingUp,
            color: "text-purple-600",
            bg: "bg-purple-50 dark:bg-purple-900/20"
          },
          {
            label: t('info_employees'),
            value: t('info_employees_value'),
            icon: Users,
            color: "text-orange-600",
            bg: "bg-orange-50 dark:bg-orange-900/20"
          },
        ].map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center group">
            <div className={`w-16 h-16 rounded-full ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <item.icon className={`w-8 h-8 ${item.color}`} />
            </div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{item.label}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
