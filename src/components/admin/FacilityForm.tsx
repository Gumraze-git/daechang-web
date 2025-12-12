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
import { ChevronLeft, Save, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface FacilityFormProps {
    initialData?: any;
    isEditMode?: boolean;
}

export default function FacilityForm({ initialData, isEditMode = false }: FacilityFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        alert(isEditMode ? '설비 정보가 수정되었습니다. (Mock)' : '설비가 성공적으로 등록되었습니다. (Mock)');
        // Redirect back to list
        router.push('/admin/facilities');
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/facilities">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{isEditMode ? '설비 수정' : '새 설비 등록'}</h1>
                        <p className="text-gray-500 text-sm">{isEditMode ? '설비 정보를 수정합니다.' : '새로운 설비를 등록합니다.'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" type="button" onClick={() => router.back()}>취소</Button>
                    <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 gap-2 text-white">
                        <Save className="w-4 h-4" />
                        {isLoading ? '저장 중...' : (isEditMode ? '변경사항 저장' : '설비 저장')}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>설비 정보</CardTitle>
                    <CardDescription>설비의 기본 정보와 사양을 입력합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">설비명</Label>
                        <Input id="name" placeholder="예: Hanger Shot Blast Machine" defaultValue={initialData?.name} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="type">유형</Label>
                            <Select defaultValue={initialData?.type_code || "welding"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="유형 선택" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-800">
                                    <SelectItem value="welding">용접 (Welding)</SelectItem>
                                    <SelectItem value="inspection">검사 (Inspection)</SelectItem>
                                    <SelectItem value="machining">가공 (Machining)</SelectItem>
                                    <SelectItem value="painting">도장 (Painting)</SelectItem>
                                    <SelectItem value="assembly">조립 (Assembly)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">상태</Label>
                            <Select defaultValue={initialData?.status?.toLowerCase() || "active"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="상태 선택" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-800" align="end">
                                    <SelectItem value="active">가동중 (Active)</SelectItem>
                                    <SelectItem value="maintenance">점검중 (Maintenance)</SelectItem>
                                    <SelectItem value="inactive">비가동 (Inactive)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="specs">제원/사양 (Specs)</Label>
                        <Textarea id="specs" placeholder="설비의 상세 사양을 입력하세요." defaultValue={initialData?.specs} rows={4} />
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
