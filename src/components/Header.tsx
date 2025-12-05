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
import { MenuIcon } from 'lucide-react'; // Need to install lucide-react

export function Header() {
  const t = useTranslations('Common');
  const tIndex = useTranslations('Index');
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1]; // Assumes URL structure /[locale]/path

  const navItems = [
    { name: t('home'), href: '/' },
    { name: t('company'), href: '/company' },
    { name: t('products'), href: '/products' },
    { name: t('facilities'), href: '/facilities' },
    { name: t('support'), href: '/support' },
  ];

  const LanguageSwitcher = () => (
    <div className="flex space-x-2">
      <Button asChild variant={currentLocale === 'ko' ? 'secondary' : 'ghost'} size="sm">
        <Link href={`/ko${pathname.substring(3)}`}>KO</Link>
      </Button>
      <Button asChild variant={currentLocale === 'en' ? 'secondary' : 'ghost'} size="sm">
        <Link href={`/en${pathname.substring(3)}`}>EN</Link>
      </Button>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-black/95">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-lg">{tIndex('title')}</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-4">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuLink asChild active={pathname.endsWith(item.href)} className={navigationMenuTriggerStyle()}>
                  <Link href={`/${currentLocale}${item.href}`} className="text-base font-medium">
                    {item.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 pt-6">
                {navItems.map((item) => (
                  <Button key={item.name} asChild variant="ghost" className="w-full justify-start">
                    <Link href={`/${currentLocale}${item.href}`}>
                      {item.name}
                    </Link>
                  </Button>
                ))}
                <LanguageSwitcher />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
