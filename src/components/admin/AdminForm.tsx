'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, Save, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createAdminUser, updateAdminUser } from '@/lib/actions/admin-auth';
import { toast } from '@/components/ui/use-toast';

interface AdminFormProps {
    initialData?: any;
    isEditMode?: boolean;
}

export default function AdminForm({ initialData, isEditMode = false }: AdminFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        role: initialData?.role || 'admin',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isEditMode) {
                const result = await updateAdminUser(initialData.id, {
                    name: formData.name,
                    role: formData.role
                });

                if (result.success) {
                    toast({
                        title: "Success",
                        description: "관리자 정보가 수정되었습니다.",
                    });
                    router.push('/admin/admins');
                } else {
                    toast({
                        title: "Error",
                        description: result.error || "수정에 실패했습니다.",
                        variant: "destructive",
                    });
                }
            } else {
                const result = await createAdminUser({
                    name: formData.name,
                    email: formData.email,
                    role: formData.role
                });

                if (result.success) {
                    // Show temp password
                    alert(`[관리자 생성 완료]\n\n임시 비밀번호: ${result.tempPassword}\n\n이모지 비밀번호는 이메일로도 전송됩니다(로그참고). 창을 닫으면 비밀번호를 다시 확인할 수 없습니다.`);

                    toast({
                        title: "Success",
                        description: "관리자 계정이 생성되었습니다.",
                    });
                    router.push('/admin/admins');
                } else {
                    toast({
                        title: "Error",
                        description: result.error || "계정 생성에 실패했습니다.",
                        variant: "destructive",
                    });
                }
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "작업 중 오류가 발생했습니다.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/admins">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{isEditMode ? '관리자 정보 수정' : '새 관리자 등록'}</h1>
                        <p className="text-gray-500 text-sm">{isEditMode ? '관리자 계정 정보를 수정합니다.' : '새로운 관리자를 초대하고 권한을 부여합니다.'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" type="button" onClick={() => router.back()}>취소</Button>
                    <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 gap-2 text-white">
                        {isEditMode ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                        {isLoading ? '처리 중...' : (isEditMode ? '정보 수정' : '계정 등록')}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>계정 정보</CardTitle>
                    <CardDescription>관리자의 기본 정보와 권한을 설정하세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">이름</Label>
                            <Input
                                id="name"
                                placeholder="홍길동"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">이메일</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="hong@daechang.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                disabled={isEditMode} // Email cannot be changed
                                className={isEditMode ? "bg-gray-100" : ""}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">권한 (Role)</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(val) => setFormData({ ...formData, role: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="권한 선택" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-800">
                                <SelectItem value="super_admin">최고 관리자 (모든 권한)</SelectItem>
                                <SelectItem value="admin">일반 관리자 (계정 관리 제외)</SelectItem>
                                <SelectItem value="editor">에디터 (컨텐츠 수정만 가능)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 pt-1">
                            * <strong>최고 관리자</strong>: 모든 메뉴 접근 및 관리자 계정 관리 가능<br />
                            * <strong>일반 관리자</strong>: 컨텐츠 및 제품 관리 가능, 관리자 관리 불가<br />
                            * <strong>에디터</strong>: 공지사항 작성 및 조회만 가능
                        </p>
                    </div>

                    {!isEditMode && (
                        <div className="space-y-2 pt-4 border-t">
                            <Label>비밀번호 설정</Label>
                            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-200">
                                보안을 위해 <strong>초기 비밀번호는 자동으로 생성</strong>되어 해당 이메일(로그)로 전송됩니다.
                                <br />관리자는 첫 로그인 시 비밀번호를 변경해야 합니다.
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </form>
    );
}
