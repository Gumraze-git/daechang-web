import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';

export default function NoticesPage() {
  const t = useTranslations('SupportPage');
  const tIndex = useTranslations('Index'); // To get notice titles from Index namespace
  const locale = useLocale();

  // Placeholder notices data (will be fetched from API later)
  const notices = [
    { id: '1', titleKey: 'notice1_title', dateKey: 'notice1_date' },
    { id: '2', titleKey: 'notice2_title', dateKey: 'notice2_date' },
    { id: '3', titleKey: 'notice3_title', dateKey: 'notice3_date' },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">{t('notices_list_title')}</h1>
      <div className="grid gap-6">
        {notices.map((notice) => (
          <Card key={notice.id}>
            <CardHeader>
              <CardTitle>{tIndex(notice.titleKey)}</CardTitle>
              <CardDescription>{tIndex(notice.dateKey)}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/${locale}/support/notices/${notice.id}`}>
                <Button variant="link" className="px-0">
                  {tIndex('view_all')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
