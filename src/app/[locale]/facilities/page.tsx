'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Factory, Cog, Ruler, X } from 'lucide-react';

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

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedEquipment) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedEquipment]);

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
    { labelKey: 'stat_production', valueKey: 'stat_production_value' },
    { labelKey: 'stat_facilities', valueKey: 'stat_facilities_value' },
    { labelKey: 'stat_area', valueKey: 'stat_area_value' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Equipment Section */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">{t('equipment_section_title')}</h2>
          <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            {t('equipment_desc_placeholder')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipmentList.map((item, index) => (
              <Card
                key={index}
                className="flex flex-col group hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer overflow-hidden"
                onClick={() => setSelectedEquipment(item)}
              >
                <CardHeader>
                  <div className="w-full h-48 bg-gray-50 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center overflow-hidden relative">
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
        </div>
      </section>

      {/* Factory View Section */}
      <section className="bg-white dark:bg-gray-900 py-16 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">{t('factory_view_section_title')}</h2>
          <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            {t('factory_view_desc_placeholder')}
          </p>
          <div className="flex flex-col gap-6">
            {/* Row 1: 1 Image */}
            <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-all relative">
              <img src="/daechang_factory_main.png" alt="Daechang Main Production Floor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>

            {/* Row 2: 2 Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full h-72 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-all relative">
                <img src="/daechang_factory_exterior.png" alt="Daechang Factory Exterior" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="w-full h-72 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-all relative">
                <img src="/daechang_hightech_interior.png" alt="High Tech Manufacturing" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </div>

            {/* Row 3: 3 Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-all relative">
                <img src="/daechang_detail_gears.png" alt="Precision Gears" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-all relative">
                <img src="/daechang_detail_tablet.png" alt="Smart Factory Management" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-all relative">
                <img src="/daechang_detail_conveyor.png" alt="Automated Conveyor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center justify-center text-center">
                <h3 className="text-5xl font-extrabold text-blue-600 mb-2 tracking-tight">{t(stat.valueKey)}</h3>
                <p className="text-gray-500 font-medium text-lg">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Equipment Detail Modal */}
      {selectedEquipment && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[55vh] p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedEquipment(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
              onClick={() => setSelectedEquipment(null)}
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-8">
              <img
                src={selectedEquipment.imageUrl}
                alt={t(selectedEquipment.nameKey)}
                className="max-w-full max-h-80 object-contain drop-shadow-md"
              />
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t(selectedEquipment.nameKey)}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t('equipment_desc_placeholder')}
                </p>
              </div>

              <div className="flex-grow space-y-8">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-widest mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {t(selectedEquipment.descKey)}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-widest mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">Technical Specs</h4>
                  <dl className="space-y-3">
                    {selectedEquipment.specs.map((spec, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800 last:border-0 border-dashed">
                        <dt className="text-gray-500 dark:text-gray-400 font-medium text-sm">{t(spec.labelKey)}</dt>
                        <dd className="font-semibold text-gray-900 dark:text-gray-100 text-sm bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}