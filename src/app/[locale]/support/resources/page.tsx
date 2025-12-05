import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';

export default function ResourcesPage() {
  const t = useTranslations('SupportPage');
  const locale = useLocale();

  // Placeholder resources data (will be fetched from API later)
  const resources = [
    { id: '1', titleKey: 'resource_item1_title', descKey: 'resource_item1_desc', downloadLink: '/resources/company-brochure.pdf' },
    { id: '2', titleKey: 'resource_item2_title', descKey: 'resource_item2_desc', downloadLink: '/resources/product-catalog-2025.pdf' },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">{t('resources_list_title')}</h1>
      <div className="grid gap-6">
        {resources.map((resource) => (
          <Card key={resource.id}>
            <CardHeader>
              <CardTitle>{t(resource.titleKey)}</CardTitle>
              <CardDescription>{t(resource.descKey)}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={resource.downloadLink} target="_blank" rel="noopener noreferrer">
                <Button>
                  {t('view_all')} {/* Using view_all as 'Download' button text for now */}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
