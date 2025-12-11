'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import Image from 'next/image';

type Product = {
    title: string;
    description: string;
    href: string;
    image?: string;
};

interface ProductCarouselProps {
    products: Product[];
    locale: string;
}

export function ProductCarousel({ products, locale }: ProductCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: true });
    const t = useTranslations('Index');

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <div className="relative group">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-4">
                    {products.map((product, index) => (
                        <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4">
                            <Link href={`/${locale}${product.href}`} className="block h-full group/card">
                                <Card className="relative flex flex-col h-[500px] transition-all duration-500 hover:shadow-2xl overflow-hidden border-0 rounded-2xl group/image">
                                    {/* Background Image */}
                                    <div className="absolute inset-0 w-full h-full">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover/image:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200" />
                                        )}
                                    </div>

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity duration-300" />

                                    {/* Content */}
                                    <div className="relative z-10 mt-auto px-8 pt-8 pb-6">
                                        <CardHeader className="p-0 flex flex-col gap-0.5">
                                            <CardTitle className="text-2xl font-bold text-white leading-tight group-hover/card:text-blue-100 transition-colors">
                                                {product.title}
                                            </CardTitle>
                                            <CardDescription className="text-gray-300 line-clamp-2 text-base font-medium">
                                                {product.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <div className="mt-3 flex items-center text-blue-300 text-sm font-semibold hover:text-blue-200 transition-colors">
                                            {t('view_details')} <ChevronRight className="w-4 h-4 ml-1 group-hover/card:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* 네비게이션 버튼 */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute -left-4 md:-left-20 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-transparent hover:bg-transparent text-gray-400 hover:text-blue-600 border-none shadow-none !w-24 !h-24 md:!w-32 md:!h-32 pr-4 md:pr-5 transition-all duration-300 hover:scale-125 active:scale-95"
                onClick={scrollPrev}
            >
                <ChevronLeft className="!h-10 !w-10 md:!h-14 md:!w-14" />
                <span className="sr-only">Previous slide</span>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-4 md:-right-20 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-transparent hover:bg-transparent text-gray-400 hover:text-blue-600 border-none shadow-none !w-24 !h-24 md:!w-32 md:!h-32 pl-4 md:pl-5 transition-all duration-300 hover:scale-125 active:scale-95"
                onClick={scrollNext}
            >
                <ChevronRight className="!h-10 !w-10 md:!h-14 md:!w-14" />
                <span className="sr-only">Next slide</span>
            </Button>
        </div >
    );
}
