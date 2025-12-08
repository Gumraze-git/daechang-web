import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FacilitiesPage() {
  const t = useTranslations('FacilitiesPage');

  const equipmentList = [
    { nameKey: 'equipment_item1_name', descKey: 'equipment_item1_desc', imageUrl: '/equipment-placeholder-1.jpg' },
    { nameKey: 'equipment_item2_name', descKey: 'equipment_item2_desc', imageUrl: '/equipment-placeholder-2.jpg' },
  ];

  return (
    <div className="container mx-auto py-8">
      {/* Main Equipment Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-6">{t('equipment_section_title')}</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          {t('equipment_desc_placeholder')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {equipmentList.map((item, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                  <img src={item.imageUrl} alt={t(item.nameKey)} className="max-h-full max-w-full object-contain" />
                </div>
                <CardTitle>{t(item.nameKey)}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600">{t(item.descKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Factory View Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-6">{t('factory_view_section_title')}</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          {t('factory_view_desc_placeholder')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md">
            <img src="/factory-view-placeholder-1.jpg" alt="Factory Interior" className="max-h-full max-w-full object-cover rounded-md" />
          </div>
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md">
            <img src="/factory-view-placeholder-2.jpg" alt="Factory Exterior" className="max-h-full max-w-full object-cover rounded-md" />
          </div>
        </div>
      </section>
    </div>
  );
}