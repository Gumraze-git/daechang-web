
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getNotice } from '@/lib/actions/notices';
import { NoticeImageCarousel } from '@/components/NoticeImageCarousel';
import { sanitizeHtml } from '@/lib/sanitize';

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  const t = await getTranslations('Index');
  const tDetail = await getTranslations('NoticeDetail');

  const notice = await getNotice(id);

  if (!notice) {
    notFound();
  }

  // Determine content based on locale
  const isKo = locale === 'ko';
  const title = isKo ? notice.title_ko : (notice.title_en || notice.title_ko);
  const body = isKo ? notice.body_ko : (notice.body_en || notice.body_ko);
  const category = notice.category; // Assuming category is a code or english string like 'news'

  // Increment view count (This should ideally be a separate server action or handled by the getNotice if updated)
  // For now, we just display the data.

  return (
    <div className="container mx-auto py-16 px-4 max-w-4xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-primary font-medium mb-4">
          <Tag className="w-4 h-4" />
          <span className="uppercase">{category}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 break-keep">
          {title}
        </h1>
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(notice.published_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Featured Image - Only show if image available */}
      {/* Featured Images */}
      <NoticeImageCarousel
        images={
          notice.image_urls && notice.image_urls.length > 0
            ? notice.image_urls
            : (notice.image_url ? [notice.image_url] : [])
        }
        altText={title || 'Notice Image'}
      />

      {/* Content Section */}
      <div
        className="prose prose-lg max-w-none text-gray-700 mb-16 break-all"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(body || '') }}
      />

      {/* Footer / Navigation */}
      <div className="border-t pt-8 flex justify-between items-center">
        <Link href={`/${locale}/notices`}>
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {tDetail('back_to_list')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
