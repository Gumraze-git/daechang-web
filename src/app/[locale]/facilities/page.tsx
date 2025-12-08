'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { X } from 'lucide-react';

interface EquipmentSpec {
  labelKey: string;
  value: string;
}

interface EquipmentItem {
  nameKey: string;
  descKey: string;
  imageUrl: string;
  specs: EquipmentSpec[];
}

export default function FacilitiesPage() {
  const t = useTranslations('FacilitiesPage');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);

  const equipmentList: EquipmentItem[] = [
    {
      nameKey: 'equipment_item1_name',
      descKey: 'equipment_item1_desc',
      imageUrl: '/equipment-placeholder-1.jpg',
      specs: [
        { labelKey: 'precision', value: '±0.01mm' },
        { labelKey: 'automation_level', value: 'Semi-Auto' }
      ]
    },
    {
      nameKey: 'equipment_item2_name',
      descKey: 'equipment_item2_desc',
      imageUrl: '/equipment-placeholder-2.jpg',
      specs: [
        { labelKey: 'capacity', value: '100 units/hr' },
        { labelKey: 'automation_level', value: 'Full-Auto' }
      ]
    },
  ];

  const stats = [
    { labelKey: 'stat_production', valueKey: 'stat_production_value', icon: '🏭' },
    { labelKey: 'stat_facilities', valueKey: 'stat_facilities_value', icon: '⚙️' },
    { labelKey: 'stat_area', valueKey: 'stat_area_value', icon: '📐' },
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
            <Card
              key={index}
              className="flex flex-col group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-blue-200/50 cursor-pointer"
              onClick={() => setSelectedEquipment(item)}
            >
              <CardHeader>
                <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-md mb-4 flex items-center justify-center overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={t(item.nameKey)}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay Hint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full shadow-sm transition-opacity">
                      Click for Details
                    </span>
                  </div>
                </div>
                <CardTitle className="group-hover:text-blue-600 transition-colors duration-300">{t(item.nameKey)}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{t(item.descKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Factory View Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-6">{t('factory_view_section_title')}</h2>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          {t('factory_view_desc_placeholder')}
        </p>
        <div className="flex flex-col gap-6">
          {/* Row 1: 1 Image */}
          <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group shadow-sm hover:shadow-md transition-all relative">
            <img src="/daechang_factory_main.png" alt="Daechang Main Production Floor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>

          {/* Row 2: 2 Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group shadow-sm hover:shadow-md transition-all relative">
              <img src="/daechang_factory_exterior.png" alt="Daechang Factory Exterior" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group shadow-sm hover:shadow-md transition-all relative">
              <img src="/daechang_hightech_interior.png" alt="High Tech Manufacturing" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>

          {/* Row 3: 3 Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group shadow-sm hover:shadow-md transition-all relative">
              <img src="/daechang_detail_gears.png" alt="Precision Gears" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group shadow-sm hover:shadow-md transition-all relative">
              <img src="/daechang_detail_tablet.png" alt="Smart Factory Management" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group shadow-sm hover:shadow-md transition-all relative">
              <img src="/daechang_detail_conveyor.png" alt="Automated Conveyor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section (Moved to Bottom) */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-800">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <h3 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">{t(stat.valueKey)}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t(stat.labelKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Equipment Detail Modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedEquipment(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedEquipment(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="grid md:grid-cols-2">
              <div className="bg-gray-100 dark:bg-gray-800 p-8 flex items-center justify-center">
                <img src={selectedEquipment.imageUrl} alt={t(selectedEquipment.nameKey)} className="max-w-full max-h-64 object-contain" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">{t(selectedEquipment.nameKey)}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{t(selectedEquipment.descKey)}</p>

                <h4 className="font-semibold mb-3 border-b pb-2">Technical Specifications</h4>
                <ul className="space-y-2">
                  {selectedEquipment.specs.map((spec, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{t(spec.labelKey)}</span>
                      <span className="font-medium">{spec.value}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-4 border-t">
                  <button
                    onClick={() => setSelectedEquipment(null)}
                    className="w-full py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    {t('close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}