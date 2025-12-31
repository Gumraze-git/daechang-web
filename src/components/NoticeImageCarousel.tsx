'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface NoticeImageCarouselProps {
    images: string[];
    altText?: string;
}

export function NoticeImageCarousel({ images, altText = 'Notice Image' }: NoticeImageCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    if (!images || images.length === 0) return null;

    if (images.length === 1) {
        return (
            <div className="w-full relative aspect-video bg-gray-100 rounded-xl mb-12 overflow-hidden group">
                <Image
                    src={images[0]}
                    alt={altText}
                    fill
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div className="relative mb-12 group">
            <div className="overflow-hidden rounded-xl bg-gray-100 aspect-video" ref={emblaRef}>
                <div className="flex h-full touch-pan-y">
                    {images.map((src, index) => (
                        <div className="relative flex-[0_0_100%] min-w-0 h-full" key={index}>
                            <Image
                                src={src}
                                alt={`${altText} ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                onClick={scrollPrev}
            >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                onClick={scrollNext}
            >
                <ChevronRight className="w-6 h-6 text-gray-800" />
            </Button>

            {/* Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {scrollSnaps.map((_, index) => (
                    <button
                        key={index}
                        className={cn(
                            "w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm",
                            index === selectedIndex ? "bg-white scale-110" : "bg-white/50 hover:bg-white/75"
                        )}
                        onClick={() => scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
