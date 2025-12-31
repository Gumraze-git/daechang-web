'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type HeroCarouselProps = {
    images: string[];
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaLink: string;
};

export function HeroCarousel({
    images,
    headline,
    subheadline,
    ctaText,
    ctaLink,
}: HeroCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
        Fade(),
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    const scrollTo = useCallback(
        (index: number) => emblaApi && emblaApi.scrollTo(index),
        [emblaApi]
    );

    return (
        <section className="relative h-[80vh] overflow-hidden bg-gray-900">
            <div className="absolute inset-0 z-0" ref={emblaRef}>
                <div className="flex h-full">
                    {images.map((src, index) => (
                        <div className="relative flex-[0_0_100%] h-full" key={index}>
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${src})` }}
                            />
                            <div className="absolute inset-0 bg-black/40" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
                <div className="text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {headline}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        {subheadline}
                    </p>
                    <Link href={ctaLink}>
                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
                        >
                            {ctaText}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={cn(
                            "w-3 h-3 rounded-full transition-all duration-300",
                            index === selectedIndex ? "bg-white scale-110" : "bg-white/50 hover:bg-white/75"
                        )}
                        onClick={() => scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
