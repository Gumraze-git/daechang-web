
import Link from 'next/link';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface NoticeCardProps {
    title: string;
    date: string;
    href: string;
    category?: string;
    locale: string;
}

export function NoticeCard({ title, date, href, category, locale }: NoticeCardProps) {
    const t = useTranslations('Index');

    return (
        <Link href={href} className="group h-full block">
            <Card className="h-full transition-all duration-300 hover:shadow-lg overflow-hidden border border-gray-200 shadow-sm bg-white p-0 gap-0">
                {/* Image Placeholder */}
                <div className="w-full aspect-video bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gray-100 transition-colors">
                    Notice Image
                </div>

                <CardHeader className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                            {date}
                        </span>
                        {category && (
                            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {category}
                            </span>
                        )}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                    </CardTitle>
                </CardHeader>

                <CardFooter className="p-6 pt-0 mt-auto">
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-primary flex items-center">
                        {t('view_all')} <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                    </span>
                </CardFooter>
            </Card>
        </Link>
    );
}
