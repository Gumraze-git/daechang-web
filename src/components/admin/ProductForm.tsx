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
import { ChevronLeft, Save, Upload, Plus, X, Check, Search } from 'lucide-react';
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox"
import { createProduct, updateProduct, type Product } from '@/lib/actions/products';
import { type Partner } from '@/lib/actions/partners';
import { type Notice } from '@/lib/actions/notices';
import { type Category } from '@/lib/actions/categories';
import { CategoryModal } from './CategoryModal';
import Image from 'next/image';

interface ProductFormProps {
    initialData?: Product;
    isEditMode?: boolean;
    partners: Partner[];
    notices: Notice[];
    categories: Category[];
}

export default function ProductForm({ initialData, isEditMode = false, partners, notices, categories }: ProductFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [partnerSearchTerm, setPartnerSearchTerm] = useState("");

    // Image State
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>(initialData?.images || []);

    // Relationships State
    const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>(
        initialData?.partners?.map(p => p.id) || []
    );
    const [selectedNoticeIds, setSelectedNoticeIds] = useState<string[]>(
        initialData?.notices?.map(n => n.id) || []
    );

    // Dynamic Fields State
    const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
        initialData?.specs || []
    );
    const [features, setFeatures] = useState<{ key: string; desc_ko: string; desc_en: string }[]>(
        initialData?.features || []
    );

    const filteredNotices = notices.filter(notice =>
        notice.title_ko.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setImageFiles(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const toggleNotice = (id: string, checked: boolean | string) => {
        if (checked === true) {
            setSelectedNoticeIds(prev => [...prev, id]);
        } else {
            setSelectedNoticeIds(prev => prev.filter(p => p !== id));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        // Append all new image files manually
        imageFiles.forEach(file => {
            formData.append('images', file);
        });

        // Append notice_ids as JSON string
        formData.append('notice_ids', JSON.stringify(selectedNoticeIds));

        // Append current images as JSON string for edit mode
        if (isEditMode) {
            const currentImages = previews.filter(p => p.startsWith('http'));
            formData.append('current_images', JSON.stringify(currentImages));
        }

        try {
            if (!isEditMode) {
                await createProduct(formData);
            } else if (initialData?.id) {
                await updateProduct(initialData.id, formData);
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || '오류가 발생했습니다.');
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" type="button">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{isEditMode ? '제품 수정' : '새 제품 등록'}</h1>
                        <p className="text-gray-500 text-sm">협력사 및 관련 공지사항을 포함한 제품 정보를 등록합니다.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>제품 이미지</CardTitle>
                            <CardDescription>대표 이미지와 상세 갤러리 이미지를 업로드합니다.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>이미지 업로드</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="image-upload"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                <Label htmlFor="image-upload" className="block">
                                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer group">
                                        <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium">이미지 추가 (클릭)</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                                    </div>
                                </Label>
                            </div>

                            {/* Previews */}
                            {previews.length > 0 && (
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 pt-4">
                                    {previews.map((src, idx) => (
                                        <div key={idx} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative group">
                                            <Image src={src} alt={`Preview ${idx}`} fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>기본 정보</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name_ko">제품명 (국문) *</Label>
                                    <Input id="name_ko" name="name_ko" placeholder="예: DA 시리즈" defaultValue={initialData?.name_ko} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name_en">제품명 (영문) *</Label>
                                    <Input id="name_en" name="name_en" placeholder="e.g. DA Series" defaultValue={initialData?.name_en} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="desc_ko">요약 설명 (국문)</Label>
                                <Textarea id="desc_ko" name="desc_ko" placeholder="제품 설명" defaultValue={initialData?.desc_ko || ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="desc_en">요약 설명 (영문)</Label>
                                <Textarea id="desc_en" name="desc_en" placeholder="Product description" defaultValue={initialData?.desc_en || ''} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notice Linking */}
                    <Card>
                        <CardHeader>
                            <CardTitle>관련 공지사항 연결</CardTitle>
                            <CardDescription>이 제품과 관련된 뉴스나 공지사항을 선택하세요.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Search Filter */}
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="공지사항 검색..."
                                        className="pl-9"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Scrollable List */}
                                <div className="border rounded-md h-[250px] overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                                    {filteredNotices.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-8">검색 결과가 없습니다.</p>
                                    ) : (
                                        filteredNotices.map((notice) => (
                                            <div key={notice.id} className="flex items-start space-x-3 p-2 hover:bg-white rounded-md transition-colors border border-transparent hover:border-gray-200">
                                                <Checkbox
                                                    id={`notice-${notice.id}`}
                                                    checked={selectedNoticeIds.includes(notice.id)}
                                                    onCheckedChange={(checked) => toggleNotice(notice.id, checked)}
                                                />
                                                <div className="grid gap-1.5 leading-none">
                                                    <label
                                                        htmlFor={`notice-${notice.id}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        {notice.title_ko}
                                                    </label>
                                                    {notice.created_at && (
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 text-right">
                                    선택됨: {selectedNoticeIds.length}개
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Status & Category */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">설정</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>상태</Label>
                                <Select name="status" defaultValue={initialData?.status || "active"}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent align="start">
                                        <SelectItem value="active">공개 (Public)</SelectItem>
                                        <SelectItem value="draft">비공개 (Private)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Category Select with Modal */}
                            <div className="space-y-2">
                                <Label>카테고리</Label>
                                <div className="flex gap-2">
                                    <Select name="category_code" defaultValue={initialData?.category_code}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="카테고리 선택" />
                                        </SelectTrigger>
                                        <SelectContent align="start">
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.code}>
                                                    {category.name_ko}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <CategoryModal />
                                </div>
                                {categories.length === 0 && (
                                    <p className="text-xs text-red-500">
                                        * 등록된 카테고리가 없습니다. 새 카테고리를 추가해주세요.
                                    </p>
                                )}
                            </div>

                            {/* Partner Selection (max 5) */}
                            <div className="space-y-2">
                                <Label>협력사 (최대 5개)</Label>
                                <div className="space-y-4">
                                    {/* Partner Search Filter */}
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            placeholder="협력사 검색..."
                                            className="pl-9"
                                            value={partnerSearchTerm}
                                            onChange={(e) => setPartnerSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    {/* Partner Checkbox List */}
                                    <div className="border rounded-md h-[200px] overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                                        {partners.filter(p => p.name_ko.toLowerCase().includes(partnerSearchTerm.toLowerCase())).map((partner) => (
                                            <div key={partner.id} className="flex items-start space-x-3 p-1 hover:bg-white rounded-md transition-colors border border-transparent hover:border-gray-200">
                                                <Checkbox
                                                    id={`partner-${partner.id}`}
                                                    checked={selectedPartnerIds.includes(partner.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            if (selectedPartnerIds.length >= 5) {
                                                                alert('협력사는 최대 5개까지 선택할 수 있습니다.');
                                                                return;
                                                            }
                                                            setSelectedPartnerIds((prev) => [...prev, partner.id]);
                                                        } else {
                                                            setSelectedPartnerIds((prev) => prev.filter((id) => id !== partner.id));
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`partner-${partner.id}`}
                                                    className="text-sm font-medium leading-none cursor-pointer flex-1"
                                                >
                                                    {partner.name_ko}
                                                </label>
                                            </div>
                                        ))}
                                        {partners.length === 0 && (
                                            <p className="text-sm text-gray-500 text-center py-8">등록된 협력사가 없습니다.</p>
                                        )}
                                        {partners.length > 0 && partners.filter(p => p.name_ko.toLowerCase().includes(partnerSearchTerm.toLowerCase())).length === 0 && (
                                            <p className="text-sm text-gray-500 text-center py-8">검색 결과가 없습니다.</p>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 text-right">
                                        선택됨: {selectedPartnerIds.length}개 (최대 5개)
                                    </div>
                                </div>
                                <input type="hidden" name="partner_ids" value={JSON.stringify(selectedPartnerIds)} />
                                {partners.length === 0 && (
                                    <p className="text-xs text-red-500">
                                        * 등록된 협력사가 없습니다. <Link href="/admin/partners/new" className="underline">추가하기</Link>
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Specs */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center justify-between">
                                상세 사양
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSpecs(prev => [...prev, { key: '', value: '' }])}
                                >
                                    <Plus className="w-4 h-4 mr-1" /> 추가
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>모델 번호</Label>
                                <Input name="model_no" placeholder="예: DA-500" defaultValue={initialData?.model_no || ''} />
                            </div>
                            <div className="space-y-2">
                                <Label>생산 능력</Label>
                                <Input name="capacity" placeholder="예: 1000 pcs/hr" defaultValue={initialData?.capacity || ''} />
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <Label>추가 사양 (Specs)</Label>
                                {specs.map((spec, index) => (
                                    <div key={index} className="flex gap-2 items-start">
                                        <Input
                                            placeholder="항목 (예: Power)"
                                            value={spec.key}
                                            onChange={(e) => {
                                                const newSpecs = [...specs];
                                                newSpecs[index].key = e.target.value;
                                                setSpecs(newSpecs);
                                            }}
                                            className="flex-1"
                                        />
                                        <Input
                                            placeholder="값 (예: 220V)"
                                            value={spec.value}
                                            onChange={(e) => {
                                                const newSpecs = [...specs];
                                                newSpecs[index].value = e.target.value;
                                                setSpecs(newSpecs);
                                            }}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setSpecs(prev => prev.filter((_, i) => i !== index));
                                            }}
                                            className="h-10 w-10 text-gray-400 hover:text-red-500"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                {specs.length === 0 && (
                                    <p className="text-xs text-center text-gray-400 py-2">추가 사양이 없습니다.</p>
                                )}
                                <input type="hidden" name="specs" value={JSON.stringify(specs)} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center justify-between">
                                제품 특징 (Features)
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFeatures(prev => [...prev, { key: '', desc_ko: '', desc_en: '' }])}
                                >
                                    <Plus className="w-4 h-4 mr-1" /> 추가
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {features.map((feature, index) => (
                                <div key={index} className="space-y-2 p-3 bg-gray-50 rounded-lg relative group">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setFeatures(prev => prev.filter((_, i) => i !== index));
                                        }}
                                        className="absolute top-1 right-1 h-8 w-8 text-gray-400 hover:text-red-500 opacity-50 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>

                                    <div>
                                        <Label className="text-xs text-gray-500">특징 키워드 (Key)</Label>
                                        <Input
                                            placeholder="예: feature_efficiency (또는 고효율)"
                                            value={feature.key}
                                            onChange={(e) => {
                                                const newFeatures = [...features];
                                                newFeatures[index].key = e.target.value;
                                                setFeatures(newFeatures);
                                            }}
                                            className="mt-1 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500">설명 (국문)</Label>
                                        <Input
                                            placeholder="설명 (국문) 입력"
                                            value={feature.desc_ko}
                                            onChange={(e) => {
                                                const newFeatures = [...features];
                                                newFeatures[index].desc_ko = e.target.value;
                                                setFeatures(newFeatures);
                                            }}
                                            className="mt-1 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500">설명 (영문)</Label>
                                        <Input
                                            placeholder="Description (English)"
                                            value={feature.desc_en}
                                            onChange={(e) => {
                                                const newFeatures = [...features];
                                                newFeatures[index].desc_en = e.target.value;
                                                setFeatures(newFeatures);
                                            }}
                                            className="mt-1 bg-white"
                                        />
                                    </div>
                                </div>
                            ))}
                            {features.length === 0 && (
                                <p className="text-xs text-center text-gray-400 py-4">등록된 특징이 없습니다.</p>
                            )}
                            <input type="hidden" name="features" value={JSON.stringify(features)} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
