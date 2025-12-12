'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, Save, Upload, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ProductFormProps {
    initialData?: any;
    isEditMode?: boolean;
}

export default function ProductForm({ initialData, isEditMode = false }: ProductFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        alert(isEditMode ? '제품 정보가 수정되었습니다. (Mock)' : '제품이 성공적으로 등록되었습니다. (Mock)');
        // Redirect back to list
        router.push('/admin/products');
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{isEditMode ? '제품 수정' : '새 제품 등록'}</h1>
                        <p className="text-gray-500 text-sm">{isEditMode ? '등록된 제품의 정보를 수정합니다.' : '새로운 제품 정보를 입력하여 등록합니다.'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" type="button" onClick={() => router.back()}>취소</Button>
                    <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 gap-2 text-white">
                        <Save className="w-4 h-4" />
                        {isLoading ? '저장 중...' : (isEditMode ? '변경사항 저장' : '제품 저장')}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Images (Moved to Top) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>제품 이미지</CardTitle>
                            <CardDescription>대표 이미지와 상세 갤러리 이미지를 업로드합니다. (다중 업로드 가능)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>이미지 업로드</Label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer group">
                                    <Upload className="w-8 h-8 mb-2 group-hover:text-blue-600 transition-colors" />
                                    <span className="text-sm font-medium">이미지 드래그 앤 드롭 또는 클릭</span>
                                    <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB (최대 10장)</span>
                                </div>
                                <Input type="file" className="hidden" multiple />
                            </div>
                            {/* Mock Preview */}
                            <div className="grid grid-cols-4 gap-4 pt-4">
                                <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-400">Preview 1</div>
                                <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-400">Preview 2</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>기본 정보</CardTitle>
                            <CardDescription>제품의 기본적인 이름과 설명을 입력합니다.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name_ko">제품명 (국문)</Label>
                                    <Input id="name_ko" placeholder="예: DA 시리즈" defaultValue={initialData?.name_ko} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name_en">제품명 (영문)</Label>
                                    <Input id="name_en" placeholder="e.g. DA Series" defaultValue={initialData?.name_en || initialData?.name} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="desc_ko">요약 설명 (국문)</Label>
                                <Textarea id="desc_ko" placeholder="제품에 대한 간단한 설명을 입력하세요." defaultValue={initialData?.desc_ko} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="desc_en">요약 설명 (영문)</Label>
                                <Textarea id="desc_en" placeholder="Brief description of the product." defaultValue={initialData?.desc_en} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Settings (Right Column) */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <h3 className="font-semibold text-lg mb-4">제품 설정</h3>

                            <div className="space-y-2">
                                <Label>상태</Label>
                                <Select defaultValue={initialData?.status?.toLowerCase() || "active"}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="상태 선택" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-800" align="end">
                                        <SelectItem value="active">판매중</SelectItem>
                                        <SelectItem value="draft">초안 (작성중)</SelectItem>
                                        <SelectItem value="hidden">숨김 (비공개)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>카테고리</Label>
                                <div className="flex gap-2">
                                    <Select defaultValue={initialData?.category_code}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="카테고리 선택" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-800">
                                            <SelectItem value="blow_molding">브로우 성형기</SelectItem>
                                            <SelectItem value="extrusion">압출기</SelectItem>
                                            <SelectItem value="accessory">주변 기기</SelectItem>
                                            <SelectItem value="recycling">리사이클링</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" size="icon" type="button" title="카테고리 추가" onClick={() => alert('카테고리 추가 기능 (Mock)')}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">상세 사양 (Specs)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>모델 번호</Label>
                                <Input placeholder="예: DA-500" defaultValue={initialData?.model_no} />
                            </div>
                            <div className="space-y-2">
                                <Label>생산 능력</Label>
                                <Input placeholder="예: 1000 pcs/hr" defaultValue={initialData?.capacity} />
                            </div>
                            <Button variant="outline" type="button" className="w-full gap-2 text-gray-500">
                                <Plus className="w-4 h-4" /> 사양 항목 추가
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
