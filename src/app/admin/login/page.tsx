'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight } from 'lucide-react';

import { login } from '@/lib/actions/auth';

export default function AdminLoginPage() {
    const router = useRouter(); // router might not be needed for redirect in server action, but kept for now or safe removal
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (formData: FormData) => {
        setIsLoading(true);
        // Server Action 호출
        const result = await login(formData); // login import 필요

        if (result?.error) {
            alert(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-white overflow-hidden">
            <div className="flex flex-col items-center justify-center w-full max-w-md relative z-10 animate-fade-in-up">
                <Link href="/" className="mb-8 flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors px-4 py-2 text-sm font-medium group">
                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> 홈으로 돌아가기
                </Link>

                <Card className="w-full shadow-xl border-gray-100/50 bg-white/80 backdrop-blur-xl">
                    <CardHeader className="flex flex-col space-y-3 items-center text-center pb-10 pt-12">

                        <div className="relative w-60 h-16">
                            <Image src="/logo_small.png" alt="Daechang Logo" fill className="object-contain" unoptimized priority />
                        </div>
                    </CardHeader>
                    <form action={handleLogin}>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">이메일</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        name="email"
                                        type="text"
                                        placeholder="admin@daechang.com"
                                        required
                                        className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all pl-10"
                                    />
                                    <Loader2 className="w-5 h-5 absolute left-3 top-3 text-gray-400 opacity-0" />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-5 h-5 absolute left-3 top-3 text-gray-400"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">비밀번호</Label>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all pl-10"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-5 h-5 absolute left-3 top-3 text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-6 pb-8">
                            <Button type="submit" className="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        인증 중...
                                    </>
                                ) : (
                                    '관리자 로그인'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <p className="mt-8 text-center text-xs text-gray-400 font-medium">
                    &copy; 2024 Daechang Machinery Ind. Co., Ltd. <br />All rights reserved.
                </p>
            </div>
        </div>
    );
}
