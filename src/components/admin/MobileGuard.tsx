'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MonitorX } from 'lucide-react';

export default function MobileGuard({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkScreenSize = () => {
            // Admin should only be accessible on desktop (>= 1024px to match Header breakpoint)
            const isMobileScreen = window.innerWidth < 1024;
            setIsMobile(isMobileScreen);
            setIsChecking(false);
        };

        // Check immediately
        checkScreenSize();

        // Check on resize
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Prevent hydration mismatch by rendering nothing or a loader until checking is done
    if (isChecking) {
        return <div className="min-h-screen bg-white" />;
    }

    if (isMobile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-sm w-full space-y-6">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <MonitorX className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-xl font-bold text-gray-900">
                            PC 환경에서 접속해주세요
                        </h1>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            관리자 페이지는 모바일 환경을 지원하지 않습니다.<br />
                            데스크톱 또는 노트북 PC를 이용해 주세요.
                        </p>
                    </div>
                    <Button asChild className="w-full" size="lg">
                        <Link href="/">홈으로 이동</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
