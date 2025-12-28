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
import { ChevronLeft, Save, Wrench, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { createFacility } from '@/lib/actions/facilities';
import Image from 'next/image';

interface FacilityFormProps {
    initialData?: any;
    isEditMode?: boolean;
}

export default function FacilityForm({ initialData, isEditMode = false }: FacilityFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(initialData?.image_url || null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    const handleRemoveImage = () => {
        setPreview(null);
        // Reset file input value if possible, or just rely on state logic if we were using a ref
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            if (isEditMode) {
                // Update logic (Not implemented fully in this turn, but structure is here)
                // await updateFacility(initialData.id, formData);
                alert("수정 기능은 아직 구현되지 않았습니다.");
            } else {
                await createFacility(formData);
                // Redirect handled in action, but we can do it here too if action doesn't redirect
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || '설비 저장에 실패했습니다.');
            setIsLoading(false);
        }
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
                    {/* Image Upload */}
                    <div className="space-y-4">
                        <Label>설비 이미지</Label>
                        <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <Label htmlFor="image" className="block">
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer group">
                                <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">이미지 추가 (클릭)</span>
                                <span className="text-xs text-gray-400 mt-1">권장 사이즈: 800x600px 이상</span>
                            </div>
                        </Label>

                        {/* Preview */}
                        {preview && (
                            <div className="relative w-40 h-40 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden group">
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name_ko">설비명 (국문)</Label>
                            <Input id="name_ko" name="name_ko" placeholder="예: Hanger Shot Blast Machine" defaultValue={initialData?.name_ko} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name_en">설비명 (영문)</Label>
                            <Input id="name_en" name="name_en" placeholder="e.g. Hanger Shot Blast Machine" defaultValue={initialData?.name_en} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="type">유형</Label>
                            <Input id="type" name="type" placeholder="예: 주요 생산 설비, 검사 장비" defaultValue={initialData?.type} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="specs">제원/사양 (Specs)</Label>
                        <Textarea id="specs" name="specs" placeholder="설비의 상세 사양을 입력하세요." defaultValue={initialData?.specs} rows={6} />
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
