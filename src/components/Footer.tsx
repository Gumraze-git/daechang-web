import { useTranslations } from 'next-intl';

export function Footer() {
  const tCommon = useTranslations('Common');
  const tIndex = useTranslations('Index');
  return (
    <footer className="mt-auto w-full border-t bg-gray-100 py-6 dark:bg-gray-900">
      <div className="container flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} {tIndex('title')}. All rights reserved.
        </div>
        <div className="flex space-x-4">
          {/* Social media links or other footer navigation can go here */}
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
