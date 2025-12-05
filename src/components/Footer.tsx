import { useTranslations } from 'next-intl';

export function Footer() {
  const tCommon = useTranslations('Common');
  const tIndex = useTranslations('Index');
  const tFooter = useTranslations('Footer');
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
                <span className="font-medium text-gray-400 mr-2">도로명:</span>
                {tFooter('address_road')}
              </p>
              <p>
                <span className="font-medium text-gray-400 mr-2">지번:</span>
                {tFooter('address_lot')}
              </p>
              <p>
                <span className="font-medium text-gray-400 mr-2">우편번호:</span>
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
              <a href="#" className="hover:text-white transition-colors">
                {tFooter('privacy_policy')}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {tFooter('terms_of_service')}
              </a>
              <a href={`/ko/support`} className="hover:text-white transition-colors">
                {tCommon('support')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
