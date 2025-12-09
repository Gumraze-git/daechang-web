'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type Product = {
    title: string;
    description: string;
    href: string;
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
                                <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <div className="p-4 pb-0">
                                        <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 group-hover/card:bg-gray-100 transition-colors">
                                            Image Placeholder
                                        </div>
                                    </div>
                                    <CardHeader className="pt-4">
                                        <CardTitle className="line-clamp-1 text-lg group-hover/card:text-primary transition-colors">{product.title}</CardTitle>
                                        <CardDescription className="line-clamp-2 mt-2">{product.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            {/* Navigation Buttons */}
            <Button
                variant="outline"
                size="icon"
                className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 shadow-lg hover:shadow-xl border-gray-100 hover:border-blue-100 rounded-full w-10 h-10 md:w-14 md:h-14 transition-all duration-300 hover:scale-110 active:scale-95"
                onClick={scrollPrev}
            >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous slide</span>
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 shadow-lg hover:shadow-xl border-gray-100 hover:border-blue-100 rounded-full w-10 h-10 md:w-14 md:h-14 transition-all duration-300 hover:scale-110 active:scale-95"
                onClick={scrollNext}
            >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next slide</span>
            </Button>
        </div >
    );
}
