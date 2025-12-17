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
import { ChevronLeft, Save, Upload, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createPartner } from '@/lib/actions/partners';
import Image from 'next/image';

interface PartnerFormProps {
    initialData?: any;
    isEditMode?: boolean;
}

export default function PartnerForm({ initialData, isEditMode = false }: PartnerFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.logo_url || null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            await createPartner(formData);
            // Redirect is handled by the server action
        } catch (error) {
            console.error(error);
            alert('오류가 발생했습니다.');
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/partners">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" type="button">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{isEditMode ? '협력사 수정' : '새 협력사 등록'}</h1>
                        <p className="text-gray-500 text-sm">관련 회사 정보를 관리합니다.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" type="button" onClick={() => router.back()}>취소</Button>
                    <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 gap-2 text-white">
                        <Save className="w-4 h-4" />
                        {isLoading ? '저장 중...' : '저장'}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>기본 정보</CardTitle>
                    <CardDescription>회사 이름과 로고 등을 입력하세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                        <Label>로고 이미지</Label>
                        <div className="flex items-start gap-4">
                            <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden relative">
                                {previewUrl ? (
                                    <Image src={previewUrl} alt="Preview" fill className="object-contain p-2" />
                                ) : (
                                    <span className="text-xs text-gray-400">No Image</span>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="logo" className="cursor-pointer">
                                    <div className="border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 inline-flex">
                                        <Upload className="w-4 h-4" />
                                        이미지 선택
                                    </div>
                                    <Input
                                        id="logo"
                                        name="logo"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </Label>
                                <p className="text-xs text-gray-500">투명 배경의 PNG 이미지를 권장합니다.</p>
                                {previewUrl && (
                                    <Button variant="ghost" size="sm" type="button" className="text-red-500 h-8 px-2" onClick={() => setPreviewUrl(null)}>
                                        <Trash2 className="w-3 h-3 mr-1" /> 로고 삭제
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name_ko">회사명 (국문) *</Label>
                            <Input id="name_ko" name="name_ko" placeholder="예: 삼성전자" required defaultValue={initialData?.name_ko} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name_en">회사명 (영문)</Label>
                            <Input id="name_en" name="name_en" placeholder="e.g. Samsung Electronics" defaultValue={initialData?.name_en} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website_url">웹사이트 URL</Label>
                        <Input id="website_url" name="website_url" type="url" placeholder="https://..." defaultValue={initialData?.website_url} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">구분</Label>
                        <Select name="type" defaultValue={initialData?.type || "client"}>
                            <SelectTrigger>
                                <SelectValue placeholder="구분 선택" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-800">
                                <SelectItem value="client">고객사 (Client)</SelectItem>
                                <SelectItem value="supplier">공급사 (Supplier)</SelectItem>
                                <SelectItem value="manufacturer">제조사 (Manufacturer)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
