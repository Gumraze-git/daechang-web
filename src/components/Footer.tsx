import { getTranslations, getLocale } from 'next-intl/server';

export async function Footer() {
  const tCommon = await getTranslations('Common');
  const tIndex = await getTranslations('Index');
  const tFooter = await getTranslations('Footer');
  const locale = await getLocale();

  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Company Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-white">
              {tIndex('title')}
            </h3>
            <p className="text-sm text-gray-400">
              {tIndex('description')}
            </p>
            <div className="text-sm text-gray-500 mt-auto pt-4">
              &copy; {new Date().getFullYear()} {tIndex('title')}. All rights reserved.
            </div>
          </div>

          {/* Column 2: Contact Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-white">
              {tFooter('contact_info')}
            </h3>
            <div className="flex flex-col space-y-2 text-sm">
              <p>
                <span className="font-medium text-gray-400 mr-2">{tFooter('label_road')}:</span>
                {tFooter('address_road')}
              </p>
              <p>
                <span className="font-medium text-gray-400 mr-2">{tFooter('label_lot')}:</span>
                {tFooter('address_lot')}
              </p>
              <p>
                <span className="font-medium text-gray-400 mr-2">{tFooter('label_phone')}:</span>
                {tFooter('phone')}
              </p>
              <p>
                <span className="font-medium text-gray-400 mr-2">{tFooter('label_zip')}:</span>
                {tFooter('zip_code')}
              </p>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-white">
              {tFooter('quick_links')}
            </h3>
            <div className="flex flex-col space-y-2 text-sm">
              <a href={`/${locale}/privacy`} className="hover:text-white transition-colors">
                {tFooter('privacy_policy')}
              </a>
              <a href={`/${locale}/terms`} className="hover:text-white transition-colors">
                {tFooter('terms_of_service')}
              </a>
              <a href={`/${locale}/support`} className="hover:text-white transition-colors">
                {tCommon('support')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
