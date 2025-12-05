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
                            <Card className="flex flex-col h-full">
                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{product.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    {/* Product Image Placeholder */}
                                    <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-400">
                                        Image Placeholder
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link href={`/${locale}${product.href}`} className="w-full">
                                        <Button variant="outline" className="w-full">
                                            {t('view_all')}
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 hidden group-hover:flex bg-white/80 backdrop-blur-sm shadow-md rounded-full"
                onClick={scrollPrev}
            >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous slide</span>
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 hidden group-hover:flex bg-white/80 backdrop-blur-sm shadow-md rounded-full"
                onClick={scrollNext}
            >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next slide</span>
            </Button>
        </div>
    );
}
