'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon, Phone } from 'lucide-react'; // Need to install lucide-react

import Image from 'next/image'; // Add Image import
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations('Common');
  const tIndex = useTranslations('Index');
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1]; // Assumes URL structure /[locale]/path

  const navItems = [
    // { name: t('home'), href: '/' }, // Removed Home
    { name: t('company'), href: '/company' },
    { name: t('products'), href: '/products' },
    { name: t('facilities'), href: '/facilities' },
    { name: t('support_notices'), href: '/notices' },
    { name: t('support'), href: '/support' },
  ];

  const LanguageSwitcher = () => (
    <div className="flex space-x-1 rounded-full p-1 bg-gray-100 dark:bg-gray-800">
      <Link href={`/ko${pathname.substring(3)}`}>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-bold transition-all inline-block",
          currentLocale === 'ko' ? "bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
        )}>KO</span>
      </Link>
      <Link href={`/en${pathname.substring(3)}`}>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-bold transition-all inline-block",
          currentLocale === 'en' ? "bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
        )}>EN</span>
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md dark:bg-black/80 border-none shadow-none">
      <div className="w-full flex h-24 items-center justify-between px-4 md:px-8 max-w-[1600px] mx-auto">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="/logo_small.png" alt="Daechang Logo" width={320} height={80} className="h-16 w-auto" unoptimized />
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(`/${currentLocale}${item.href}`);
                return (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink
                      asChild
                      active={isActive}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent text-base font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                        isActive ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-200"
                      )}
                    >
                      <Link href={`/${currentLocale}${item.href}`}>
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-4 ml-auto">
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Button asChild className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all">
              <Link href={`/${currentLocale}/support/contact`}>
                <Phone className="w-4 h-4 mr-2" />
                {t('support_contact')}
              </Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-6 pt-10">
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname.startsWith(`/${currentLocale}${item.href}`);
                    return (
                      <Button
                        key={item.name}
                        asChild
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start text-lg h-12",
                          isActive && "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        )}
                      >
                        <Link href={`/${currentLocale}${item.href}`}>
                          {item.name}
                        </Link>
                      </Button>
                    );
                  })}
                </div>

                <div className="border-t pt-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">{t('language')}</span>
                    <LanguageSwitcher />
                  </div>

                  <Button asChild className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg">
                    <Link href={`/${currentLocale}/support/contact`}>
                      <Phone className="w-5 h-5 mr-2" />
                      {t('support_contact')}
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
