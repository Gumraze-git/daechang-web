import { useTranslations } from 'next-intl';
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
      { month: '08', description: ['화성공장 확장이전'] },
    ]
  },
  {
    year: '2008',
    events: [
      { month: '12', description: ['유성볼밀 냉각시스템 특허출원', '이노비즈 기업인증'] },
      { month: '08', description: ['나노금속분말제조용 유성볼밀 냉각시스템 개발'] },
      { month: '02', description: ['HOIST, AIR WINCH 개발 (고려호이스트, 대우조선, 현대중공업 납품)'] },
    ]
  },
  {
    year: '2007',
    events: [
      { month: '12', description: ['벤처기업등록', '호이스트용 감속기 개발'] },
      { month: '03', description: ['나노연마재용 분석설비 개발 납품 (삼성코닝, 테크노세미켐)'] },
    ]
  },
  {
    year: '2006',
    events: [
      { month: '07', description: ['시화공장 확장이전'] },
    ]
  },
  {
    year: '2004',
    events: [
      { month: '08', description: ['콘크리트 펌프카용 Reduction Gear Box 개발 (KCP중공업 납품)'] },
      { month: '05', description: ['콘크리트 펌프카용 P.T.O 개발 (KCP중공업 납품)'] },
      { month: '03', description: ['대창기계산업(주) 설립', '이태리 수입무역', 'Ring Gear 수입무역'] },
    ]
  },
];

export default function HistoryPage() {
  const t = useTranslations('Common');

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 md:px-12">
      {/* Header */}
      <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">

        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
          {t('company_history')}
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-light">
          대창기계산업이 걸어온 혁신과 도전의 발자취를 소개합니다.
        </p>
      </div>

      <div className="flex flex-col gap-0 border-l border-gray-100 dark:border-gray-800 md:border-l-0">
        {historyData.map((yearGroup, index) => (
          <div
            key={yearGroup.year}
            className="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-10 md:py-16 border-b border-gray-100 dark:border-gray-800 last:border-0"
          >
            {/* Sticky Year Column */}
            <div className="md:col-span-4 pl-6 md:pl-0 z-10">
              <div className="sticky top-24 transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none py-2 md:py-0">
                <h3 className="text-5xl md:text-7xl font-black text-gray-100 dark:text-gray-800/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-500 select-none tracking-tighter">
                  {yearGroup.year}
                </h3>
                <div className="hidden md:block w-8 h-1 bg-blue-600 mt-3 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </div>

            {/* Content Column */}
            <div className="md:col-span-8 space-y-6 pl-6 md:pl-0 z-0">
              {yearGroup.events.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${eventIndex * 100}ms` }}
                >
                  {/* Month */}
                  <div className="flex-shrink-0 pt-1">
                    <span className="text-lg font-bold text-gray-900 dark:text-white inline-block border-b-2 border-gray-900 dark:border-white pb-0.5">
                      {event.month}월
                    </span>
                  </div>

                  {/* Description */}
                  <div className="flex-grow space-y-2">
                    {event.description.map((desc, i) => (
                      <p key={i} className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                        {desc}
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
