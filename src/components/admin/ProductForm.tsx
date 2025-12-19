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
import { createProduct, type Product } from '@/lib/actions/products';
import { type Partner } from '@/lib/actions/partners';
import { type Notice } from '@/lib/actions/notices';
import { type Category } from '@/lib/actions/categories';
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

    // Image State
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>(initialData?.images || []);

    // Relationships State
    const [selectedNoticeIds, setSelectedNoticeIds] = useState<string[]>(
        initialData?.notices?.map(n => n.id) || []
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

        try {
            // For now, only Create is fully implemented with new logic
            if (!isEditMode) {
                await createProduct(formData);
            } else {
                // updateProduct(formData); // To be implemented
                alert('수정 기능은 아직 구현 중입니다.');
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
            <div className="flex items-center justify-between mb-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>제품 이미지</CardTitle>
                            <CardDescription>대표 이미지와 상세 갤러리 이미지를 업로드합니다.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
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
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                            {new Date(notice.created_at).toLocaleDateString()}
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
                        <CardContent className="p-6 space-y-6">
                            <h3 className="font-semibold text-lg mb-4">설정</h3>

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

                            <div className="space-y-2">
                                <Label>카테고리</Label>
                                <Select name="category_code" defaultValue={initialData?.category_code}>
                                    <SelectTrigger>
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
                                {categories.length === 0 && (
                                    <p className="text-xs text-red-500">
                                        * 등록된 카테고리가 없습니다. <Link href="/admin/products" className="underline">관리하기</Link>
                                    </p>
                                )}
                            </div>

                            {/* Partner Selection */}
                            <div className="space-y-2">
                                <Label>협력사 (제조사/공급사)</Label>
                                <Select name="partner_id" defaultValue={initialData?.partner_id || undefined}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="협력사 선택 (선택사항)" />
                                    </SelectTrigger>
                                    <SelectContent align="start">
                                        <SelectItem value="none">선택 안함</SelectItem>
                                        {partners.map(p => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name_ko}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                            <CardTitle className="text-base">상세 사양</CardTitle>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
