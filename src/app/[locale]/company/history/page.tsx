import { useTranslations } from 'next-intl';

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
    <div className="max-w-4xl mx-auto">
      <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-4 md:ml-6 space-y-12">
        {historyData.map((yearGroup) => (
          <div key={yearGroup.year} className="relative pl-8 md:pl-12">
            {/* Year Marker */}
            <span className="absolute -left-[9px] top-0 h-5 w-5 rounded-full bg-blue-600 border-4 border-white dark:border-gray-900" />

            <h3 className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-6">
              {yearGroup.year}
            </h3>

            <div className="space-y-8">
              {yearGroup.events.map((event, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8 group">
                  <div className="flex items-center md:w-24 flex-shrink-0">
                    <span className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                      {event.month}
                    </span>
                  </div>
                  <div className="flex-grow pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                    {event.description.map((desc, i) => (
                      <p key={i} className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-1 last:mb-0">
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
