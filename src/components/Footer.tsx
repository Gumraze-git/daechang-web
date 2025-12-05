import { useTranslations } from 'next-intl';

export function Footer() {
  const tCommon = useTranslations('Common');
  const tIndex = useTranslations('Index');
  const tFooter = useTranslations('Footer');
  return (
    <footer className="mt-auto w-full border-t bg-gray-100 py-8 dark:bg-gray-900">
      <div className="container flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
        <div className="flex flex-col items-center md:items-start space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="font-semibold text-base text-gray-900 dark:text-gray-100 mb-1">
            {tIndex('title')}
          </div>
          <div className="flex flex-col items-center md:items-start space-y-1">
            <p>도로명: {tFooter('address_road')}</p>
            <p>지번: {tFooter('address_lot')}</p>
            <p>우편번호: {tFooter('zip_code')}</p>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {tIndex('title')}. All rights reserved.
          </div>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
