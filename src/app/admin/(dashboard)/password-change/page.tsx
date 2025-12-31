'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Save } from 'lucide-react';
import { changePassword } from '@/lib/actions/admin-auth';
import { toast } from '@/components/ui/use-toast';

export default function PasswordChangePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.newPassword !== formData.confirmPassword) {
            toast({
                title: "Error",
                description: "새 비밀번호가 일치하지 않습니다.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        if (formData.newPassword.length < 8) {
            toast({
                title: "Error",
                description: "비밀번호는 8자 이상이어야 합니다.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            const result = await changePassword(formData.newPassword);

            if (result.success) {
                toast({
                    title: "Success",
                    description: "비밀번호가 성공적으로 변경되었습니다.",
                });
                router.push('/admin/home');
                router.refresh(); // Refresh to update middleware state check if needed
            } else {
                toast({
                    title: "Error",
                    description: result.error || "비밀번호 변경에 실패했습니다.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "오류가 발생했습니다.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-20 px-4">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <Lock className="w-6 h-6 text-blue-600" />
                        비밀번호 변경
                    </CardTitle>
                    <CardDescription>
                        보안을 위해 비밀번호를 변경해주세요.<br />
                        최초 로그인 시 비밀번호 변경이 필요합니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">새 비밀번호</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="8자 이상 입력하세요"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="새 비밀번호를 다시 입력하세요"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                            disabled={isLoading}
                        >
                            <Save className="w-4 h-4" />
                            {isLoading ? '변경 중...' : '비밀번호 변경하기'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
