import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';

interface HistoryEvent {
  day: string;
  description: string;
}

interface HistoryMonthGroup {
  month: string;
  events: HistoryEvent[];
}

interface HistoryYear {
  year: string;
  months: HistoryMonthGroup[];
}

export default async function HistoryPage() {
  const t = await getTranslations('Common');
  const tCompany = await getTranslations('CompanyPage');

  // Fetch data from Supabase
  const supabase = await createClient();
  const { data: historyItems, error } = await supabase
    .from('history')
    .select('*')
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .order('day', { ascending: false });

  if (error) {
    console.error('Error fetching history:', error);
    // Handle error (e.g., render fallback)
  }

  // Transform flat data to grouped structure
  const historyData: HistoryYear[] = [];
  const groupedByYearAndMonth: Record<string, Record<string, HistoryEvent[]>> = {};

  (historyItems || []).forEach(item => {
    if (!groupedByYearAndMonth[item.year]) {
      groupedByYearAndMonth[item.year] = {};
    }
    if (!groupedByYearAndMonth[item.year][item.month]) {
      groupedByYearAndMonth[item.year][item.month] = [];
    }

    groupedByYearAndMonth[item.year][item.month].push({
      day: item.day || '',
      description: item.content_ko // Using content_ko as description
    });
  });

  // Flatten to array structure for rendering
  Object.keys(groupedByYearAndMonth).sort((a, b) => b.localeCompare(a)).forEach(year => {
    const months: HistoryMonthGroup[] = [];
    const yearMonths = groupedByYearAndMonth[year];

    Object.keys(yearMonths).sort((a, b) => Number(b) - Number(a)).forEach(month => {
      months.push({
        month,
        events: yearMonths[month] // Days are already sorted by query
      });
    });

    historyData.push({
      year,
      months
    });
  });

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
            {tCompany('history_intro_desc')}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-0 border-l border-gray-100 dark:border-gray-800 md:border-l-0">
        {historyData.length === 0 ? (
          <p className="text-center text-gray-500 py-10">등록된 연혁이 없습니다.</p>
        ) : (
          historyData.map((yearGroup, yearIndex) => (
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
              <div className="md:col-span-8 space-y-8 pl-6 md:pl-0 z-0">
                {yearGroup.months.map((monthGroup, monthIndex) => (
                  <div
                    key={`${yearGroup.year}-${monthGroup.month}`}
                    className="relative flex flex-col sm:flex-row gap-3 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
                    style={{ animationDelay: `${monthIndex * 100}ms` }}
                  >
                    {/* Month */}
                    <div className="flex-shrink-0 w-20">
                      <span className="text-lg font-bold text-gray-900 dark:text-white inline-block border-b-2 border-gray-900 dark:border-white pb-0.5 animate-in fade-in zoom-in-50 duration-500">
                        {monthGroup.month}{t('month_unit')}
                      </span>
                    </div>

                    {/* Events List */}
                    <div className="flex-grow space-y-4 pt-0">
                      {monthGroup.events.map((event, eventIndex) => (
                        <div key={eventIndex} className="relative">
                          {/* Add dot or something maybe? Or just text. Keeping it simple as previous design. */}
                          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium hover:text-gray-900 dark:hover:text-white transition-colors">
                            {event.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
