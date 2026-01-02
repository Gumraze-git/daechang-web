'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { MenuIcon, Phone, Globe, ChevronRight, Building2, Package, Factory, Megaphone, HeadphonesIcon, X } from 'lucide-react';

import Image from 'next/image'; // Add Image import
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations('Common');
  const tIndex = useTranslations('Index');
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1]; // Assumes URL structure /[locale]/path
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    // { name: t('home'), href: '/' }, // Removed Home
    { name: t('company'), href: '/company', icon: Building2 },
    { name: t('products'), href: '/products', icon: Package },
    { name: t('facilities'), href: '/facilities', icon: Factory },
    { name: t('support_notices'), href: '/notices', icon: Megaphone },
    { name: t('support'), href: '/support', icon: HeadphonesIcon },
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md dark:bg-black/80 border-none shadow-none transition-all duration-300">
      <div className="w-full flex justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] h-24 items-center px-4 md:px-8 max-w-[1600px] mx-auto gap-4">
        {/* Logo - Start aligned */}
        <Link href="/" className="flex items-center justify-self-start shrink-0">
          <Image
            src="/logo_small.png"
            alt="Daechang Logo"
            width={320}
            height={80}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation - Center aligned */}
        <div className="hidden lg:flex justify-center justify-self-center w-full">
          <NavigationMenu>
            <NavigationMenuList className="gap-1 lg:gap-2">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(`/${currentLocale}${item.href}`);
                return (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink
                      asChild
                      active={isActive}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent text-base font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800",
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

        {/* Desktop Utilities - End aligned */}
        <div className="flex items-center space-x-4 justify-self-end ml-auto lg:ml-0">
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <Button asChild className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all">
              <Link href={`/${currentLocale}/support/contact`}>
                <Phone className="w-4 h-4 mr-2" />
                {t('support_contact')}
              </Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" suppressHydrationWarning>
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col p-0 border-l border-gray-100 dark:border-gray-800 bg-white/95 backdrop-blur-xl dark:bg-gray-950/95 overflow-hidden">
              <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              {/* Mobile Menu Header with Logo */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <Image src="/logo_small.png" alt="Daechang Logo" width={160} height={40} className="h-8 w-auto" />
                </Link>
                {/* Close button is handled by SheetPrimitive.Close, but we can have custom one here if needed, or rely on default */}
              </div>

              <div className="flex-1 overflow-y-auto py-8 px-6">
                <motion.nav
                  className="flex flex-col space-y-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {navItems.map((item) => {
                    const isActive = pathname.startsWith(`/${currentLocale}${item.href}`);
                    const Icon = item.icon || ChevronRight;
                    return (
                      <motion.div key={item.name} variants={itemVariants}>
                        <Link
                          href={`/${currentLocale}${item.href}`}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center px-4 py-4 rounded-2xl text-lg font-medium transition-all duration-300 group relative overflow-hidden",
                            isActive
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-semibold shadow-sm"
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                          )}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeNavIndicator"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-blue-600 rounded-r-full"
                            />
                          )}
                          <span className={cn(
                            "mr-4 p-2 rounded-lg transition-colors",
                            isActive ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40" : "bg-gray-100 text-gray-500 dark:bg-gray-800 group-hover:bg-white group-hover:shadow-sm"
                          )}>
                            <Icon className="w-5 h-5" />
                          </span>
                          <span className={cn("relative z-10", isActive ? "translate-x-1" : "group-hover:translate-x-1 transition-transform")}>
                            {item.name}
                          </span>
                          {isActive && <ChevronRight className="ml-auto w-5 h-5 opacity-50" />}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.nav>
              </div>

              <div className="mt-auto p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80 space-y-6 backdrop-blur-sm">
                {/* Language Switcher Row */}
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-950 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <Globe className="w-4 h-4" />
                    </div>
                    {t('language')}
                  </div>
                  <LanguageSwitcher />
                </div>

                <Button asChild className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all h-14 text-lg font-semibold">
                  <Link href={`/${currentLocale}/support/contact`} onClick={() => setIsOpen(false)}>
                    <Phone className="w-5 h-5 mr-3" />
                    {t('support_contact')}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
