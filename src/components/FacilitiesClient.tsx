'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, X } from 'lucide-react';
import { Facility } from '@/lib/actions/facilities';

interface FacilitiesClientProps {
    facilities: Facility[];
    locale: string;
}

export default function FacilitiesClient({ facilities, locale }: FacilitiesClientProps) {
    const t = useTranslations('FacilitiesPage');
    const [selectedEquipment, setSelectedEquipment] = useState<Facility | null>(null);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (selectedEquipment) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedEquipment]);

    const stats = [
        { labelKey: 'stat_production', valueKey: 'stat_production_value' },
        { labelKey: 'stat_facilities', valueKey: 'stat_facilities_value' },
        { labelKey: 'stat_area', valueKey: 'stat_area_value' },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Main Equipment Section */}
            <section id="equipment-section" className="bg-white py-16 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">{t('equipment_section_title')}</h2>
                    <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                        {t('equipment_desc_placeholder')}
                    </p>

                    {facilities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {facilities.map((item) => {
                                const name = locale === 'ko' ? item.name_ko : (item.name_en || item.name_ko);

                                return (
                                    <Card
                                        key={item.id}
                                        className="relative flex flex-col h-[400px] transition-all duration-500 hover:shadow-2xl overflow-hidden border-0 rounded-2xl group/image cursor-pointer"
                                        onClick={() => setSelectedEquipment(item)}
                                    >
                                        {/* Background Image */}
                                        <div className="absolute inset-0 w-full h-full">
                                            {item.image_url ? (
                                                <Image
                                                    src={item.image_url}
                                                    alt={name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover/image:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover/image:opacity-90 transition-opacity duration-300" />

                                        {/* Content */}
                                        <div className="relative z-10 mt-auto px-6 pt-8 pb-6">
                                            <CardHeader className="p-0 flex flex-col gap-0.5">
                                                <CardTitle className="text-xl font-bold text-white leading-tight group-hover/image:text-blue-100 transition-colors">
                                                    {name}
                                                </CardTitle>
                                                <p className="text-gray-300 line-clamp-2 text-sm font-medium">
                                                    {item.type}
                                                </p>
                                            </CardHeader>
                                            <div className="mt-3 flex items-center text-blue-300 text-sm font-semibold hover:text-blue-200 transition-colors">
                                                {t('view_details')} <ChevronRight className="w-4 h-4 ml-1 group-hover/image:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                            등록된 설비가 없습니다.
                        </div>
                    )}
                </div>
            </section>

            {/* Factory View Section (Static) */}
            <section className="bg-white dark:bg-gray-900 py-16 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">{t('factory_view_section_title')}</h2>
                    <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                        {t('factory_view_desc_placeholder')}
                    </p>
                    <div className="flex flex-col gap-6">
                        {/* ... Existing static factory view images ... */}
                        <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-all relative">
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">Main Production Floor</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="w-full h-72 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-all relative">
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">Exterior</div>
                            </div>
                            <div className="w-full h-72 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-all relative">
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">Interior</div>
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
                typeof document !== 'undefined' ? (
                    createPortal(
                        <div
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
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
                                <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-8 min-h-[300px]">
                                    {selectedEquipment.image_url ? (
                                        <img
                                            src={selectedEquipment.image_url}
                                            alt={locale === 'ko' ? selectedEquipment.name_ko : selectedEquipment.name_en || ''}
                                            className="max-w-full max-h-80 object-contain drop-shadow-md"
                                        />
                                    ) : (
                                        <span className="text-gray-400">No Image</span>
                                    )}
                                </div>

                                {/* Info Section */}
                                <div className="w-full md:w-1/2 p-8 flex flex-col">
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                            {locale === 'ko' ? selectedEquipment.name_ko : (selectedEquipment.name_en || selectedEquipment.name_ko)}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                            {selectedEquipment.type}
                                        </p>
                                    </div>

                                    <div className="flex-grow space-y-8">
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-widest mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                                                Specifications
                                            </h4>
                                            {selectedEquipment.specs ? (
                                                <div className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm whitespace-pre-wrap">
                                                    {selectedEquipment.specs}
                                                </div>
                                            ) : (
                                                <p className="text-gray-400 text-sm">스펙 정보가 없습니다.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )
                ) : null
            )}
        </div>
    );
}
