'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        if (!api) {
            return;
        }

        setCurrent(api.selectedScrollSnap());

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const handleThumbnailClick = (index: number) => {
        if (api) {
            api.scrollTo(index);
        }
    };

    const scrollPrev = () => api?.scrollPrev();
    const scrollNext = () => api?.scrollNext();

    return (
        <div className="w-full max-w-sm mx-auto flex flex-col gap-4 group">
            {/* Main Carousel with Custom Navigation */}
            <div className="relative">
                <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                        {images.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                    <Card className="overflow-hidden border-gray-200 shadow-sm">
                                        <CardContent className="flex aspect-square items-center justify-center p-0 bg-white dark:bg-gray-800 relative">
                                            <img
                                                src={image}
                                                alt={`${productName} ${index + 1}`}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                {/* Custom Navigation Buttons (Homepage Style) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-transparent hover:bg-transparent text-gray-400 hover:text-blue-600 border-none shadow-none h-12 w-12 transition-all duration-300 hover:scale-125 active:scale-95"
                    onClick={scrollPrev}
                >
                    <ChevronLeft className="h-8 w-8" />
                    <span className="sr-only">Previous slide</span>
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-transparent hover:bg-transparent text-gray-400 hover:text-blue-600 border-none shadow-none h-12 w-12 transition-all duration-300 hover:scale-125 active:scale-95"
                    onClick={scrollNext}
                >
                    <ChevronRight className="h-8 w-8" />
                    <span className="sr-only">Next slide</span>
                </Button>
            </div>

            {/* Thumbnails Row (Left Aligned) */}
            <div className="flex gap-2 justify-start overflow-x-auto py-2 px-1">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={cn(
                            "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0",
                            current === index
                                ? "border-blue-600 ring-2 ring-blue-100 dark:ring-blue-900"
                                : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-300 dark:hover:border-gray-600"
                        )}
                        type="button"
                        aria-label={`View image ${index + 1}`}
                        aria-current={current === index ? 'true' : 'false'}
                    >
                        <div className="absolute inset-0 bg-white dark:bg-gray-800">
                            <img
                                src={image}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
