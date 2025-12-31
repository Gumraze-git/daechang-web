'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Lock, Save, Calendar, Mail, ShieldCheck } from 'lucide-react';
import { changePassword } from '@/lib/actions/admin-auth';
import { toast } from '@/components/ui/use-toast';

interface ProfileFormProps {
    admin: {
        id: string;
        email: string;
        name?: string;
        role: string;
        created_at: string;
        must_change_password?: boolean;
    };
}

export default function ProfileForm({ admin }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast({
                title: "오류",
                description: "새 비밀번호가 일치하지 않습니다.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        if (passwords.newPassword.length < 8) {
            toast({
                title: "오류",
                description: "비밀번호는 8자 이상이어야 합니다.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            const result = await changePassword(passwords.newPassword);
            if (result.success) {
                toast({
                    title: "성공",
                    description: "비밀번호가 변경되었습니다.",
                });
                setPasswords({ newPassword: '', confirmPassword: '' });
            } else {
                toast({
                    title: "실패",
                    description: result.error || "비밀번호 변경에 실패했습니다.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "오류",
                description: "서버 오류가 발생했습니다.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{admin.name || '관리자'}</h2>
                    <p className="text-gray-500">{admin.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-500" />
                            내 정보
                        </CardTitle>
                        <CardDescription>현재 로그인된 계정 정보입니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-gray-500 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5" /> 이메일
                                </Label>
                                <div className="font-medium">{admin.email}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-gray-500 flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5" /> 권한
                                </Label>
                                <div>
                                    <Badge variant="outline" className="uppercase">{admin.role}</Badge>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-gray-500 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" /> 가입일
                                </Label>
                                <div className="font-medium">{new Date(admin.created_at).toLocaleDateString()}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-gray-500">상태</Label>
                                <div>
                                    <Badge className={admin.must_change_password ? "bg-yellow-500" : "bg-green-500"}>
                                        {admin.must_change_password ? '비밀번호 변경 필요' : '정상'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Password Change Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-orange-500" />
                            비밀번호 변경
                        </CardTitle>
                        <CardDescription>새로운 비밀번호를 설정합니다.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">새 비밀번호</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                                    placeholder="8자 이상 입력"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    placeholder="비밀번호 재입력"
                                />
                            </div>
                            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
                                {isLoading ? '변경 중...' : '비밀번호 변경'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
