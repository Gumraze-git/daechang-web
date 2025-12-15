import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryEvent {
  month: string;
  description: string[];
}

interface HistoryYear {
  year: string;
  events: HistoryEvent[];
}

const historyData: HistoryYear[] = [
  {
    year: '2009',
    events: [
      { month: '08', description: ['history_2009'] },
    ]
  },
  {
    year: '2008',
    events: [
      { month: '12', description: ['history_2008_12_1', 'history_2008_12_2'] },
      { month: '08', description: ['history_2008_08'] },
      { month: '02', description: ['history_2008_02'] },
    ]
  },
  {
    year: '2007',
    events: [
      { month: '12', description: ['history_2007_12_1', 'history_2007_12_2'] },
      { month: '03', description: ['history_2007_03'] },
    ]
  },
  {
    year: '2006',
    events: [
      { month: '07', description: ['history_2006'] },
    ]
  },
  {
    year: '2004',
    events: [
      { month: '08', description: ['history_2004_08'] },
      { month: '05', description: ['history_2004_05'] },
      { month: '03', description: ['history_2004_03_1', 'history_2004_03_2', 'history_2004_03_3'] },
    ]
  },
];

export default function HistoryPage() {
  const t = useTranslations('Common');
  const tCompany = useTranslations('CompanyPage');

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 md:px-12">
      {/* Visual Header */}
      <div className="relative w-full h-[250px] md:h-[300px] rounded-3xl overflow-hidden mb-20 group">
        <Image
          src="/daechang_factory_main.png"
          alt="History Banner"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {t('company_history')}
          </h2>
          <div className="w-16 h-1 bg-blue-500 rounded-full mb-6" />
          <p className="text-lg md:text-xl text-gray-200 font-light max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            대창기계산업이 걸어온 혁신과 도전의 발자취를 소개합니다.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-0 border-l border-gray-100 dark:border-gray-800 md:border-l-0">
        {historyData.map((yearGroup, index) => (
          <div
            key={yearGroup.year}
            className="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 py-10 border-b border-gray-100 dark:border-gray-800 last:border-0"
          >
            {/* Sticky Year Column */}
            <div className="md:col-span-4 pl-6 md:pl-0 z-10">
              <div className="sticky top-24 transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none py-2 md:py-0">
                <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-100 dark:text-gray-800/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-500 select-none tracking-tighter">
                  {yearGroup.year}
                </h3>
                <div className="hidden md:block w-8 h-1 bg-blue-600 mt-3 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </div>

            {/* Content Column */}
            <div className="md:col-span-8 space-y-5 pl-6 md:pl-0 z-0">
              {yearGroup.events.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className="relative flex flex-col sm:flex-row gap-3 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${eventIndex * 100}ms` }}
                >
                  {/* Month */}
                  <div className="flex-shrink-0 pt-1">
                    <span className="text-lg font-bold text-gray-900 dark:text-white inline-block border-b-2 border-gray-900 dark:border-white pb-0.5 animate-in fade-in zoom-in-50 duration-500">
                      {event.month}{t('month_unit')}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="flex-grow space-y-2">
                    {event.description.map((desc, i) => (
                      <p key={i} className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium hover:text-gray-900 dark:hover:text-white transition-colors">
                        {tCompany(desc)}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
