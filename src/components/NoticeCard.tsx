
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pin } from 'lucide-react';

interface NoticeCardProps {
    title: string;
    date: string;
    href: string;
    category?: string;
    locale: string;
    imageUrl?: string | null;
    isPinned?: boolean;
}

export function NoticeCard({ title, date, href, category, locale, imageUrl, isPinned }: NoticeCardProps) {
    const t = useTranslations('Index');

    return (
        <Link href={href} className="group h-full block">
            <Card className="h-full transition-all duration-300 hover:shadow-lg overflow-hidden border border-gray-200 shadow-sm bg-white p-0 gap-0">
                {/* Image Placeholder or Actual Image */}
                <div className="w-full aspect-video bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gray-100 transition-colors relative overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <span>No Image</span>
                    )}
                    {isPinned && (
                        <div className="absolute top-3 right-3 bg-blue-600 text-white p-2 rounded-full shadow-md z-10 flex items-center justify-center">
                            <Pin size={14} className="fill-current" />
                        </div>
                    )}
                </div>

                <CardHeader className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                            {date}
                        </span>
                        {category && (
                            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
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
