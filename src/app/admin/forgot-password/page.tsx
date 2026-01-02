'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { requestPasswordReset } from '@/lib/actions/auth';
import { useToast } from '@/components/ui/use-toast';

export default function ForgotPasswordPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('email', email);

            const result = await requestPasswordReset(formData);

            if (result.success) {
                setIsSent(true);
                toast({
                    variant: 'success',
                    title: "이메일 발송 완료",
                    description: "비밀번호 재설정 링크가 이메일로 전송되었습니다.",
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: "발송 실패",
                    description: result.error || "이메일 전송 중 오류가 발생했습니다.",
                });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "오류 발생",
                description: "예기치 않은 오류가 발생했습니다.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gray-50/50 p-4">
                <Card className="w-full max-w-md shadow-xl border-gray-100 bg-white">
                    <CardHeader className="flex flex-col items-center text-center pb-8 pt-10">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                            이메일 전송 완료
                        </CardTitle>
                        <CardDescription className="text-gray-500 max-w-xs">
                            <span className="font-semibold text-gray-900">{email}</span>으로<br />비밀번호 재설정 링크를 보냈습니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                            이메일을 확인하고 링크를 클릭하여<br />새로운 비밀번호를 설정해주세요.
                        </p>
                    </CardContent>
                    <CardFooter className="pt-2 pb-8 flex flex-col gap-3">
                        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                            <Link href="/admin/login">로그인으로 돌아가기</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white overflow-hidden">
            <div className="flex flex-col items-center justify-center w-full max-w-md relative z-10 animate-fade-in-up px-4">
                <Card className="w-full shadow-xl border-gray-100/50 bg-white/80 backdrop-blur-xl">
                    <CardHeader className="flex flex-col space-y-3 items-center text-center pb-8 pt-10">
                        <div className="relative w-48 h-12 mb-4">
                            <Image src="/logo_small.png" alt="Daechang Logo" fill className="object-contain" unoptimized priority />
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-bold text-gray-900">비밀번호 재설정</CardTitle>
                            <CardDescription>
                                가입하신 이메일 주소를 입력해 주세요.
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">이메일</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@daechang.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all pl-10"
                                    />
                                    <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-4 pb-8 flex flex-col gap-4">
                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                                disabled={isLoading || !email}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        전송 중...
                                    </>
                                ) : (
                                    '재설정 링크 받기'
                                )}
                            </Button>

                            <Link
                                href="/admin/login"
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> 로그인으로 돌아가기
                            </Link>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
