'use client';

import { useState, useRef } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Calendar, ChevronLeft, Save, Upload, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { createNotice, updateNotice, type Notice } from '@/lib/actions/notices';
import { type NoticeCategory } from '@/lib/actions/notice-categories';
import Image from 'next/image';
import DeleteAlertDialog from '@/components/admin/DeleteAlertDialog';
import TiptapEditor from '@/components/admin/TiptapEditor';

interface NoticeFormProps {
    initialData?: Notice;
    categories?: NoticeCategory[];
    isEdit?: boolean;
}

export default function NoticeForm({ initialData, categories = [], isEdit = false }: NoticeFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Initialize previews
    const initialUrls = initialData?.image_urls && initialData.image_urls.length > 0
        ? initialData.image_urls
        : (initialData?.image_url ? [initialData.image_url] : []);

    const [previews, setPreviews] = useState<(string | null)[]>([
        initialUrls[0] || null,
        initialUrls[1] || null,
        initialUrls[2] || null
    ]);

    // Tiptap Editor States
    const [bodyKo, setBodyKo] = useState(initialData?.body_ko || '');
    const [bodyEn, setBodyEn] = useState(initialData?.body_en || '');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviews(prev => {
                const newPreviews = [...prev];
                newPreviews[index] = url;
                return newPreviews;
            });
        }
    };

    const removeImage = (index: number) => {
        setPreviews(prev => {
            const newPreviews = [...prev];
            newPreviews[index] = null;
            return newPreviews;
        });
        // Clear file input value
        if (fileInputRefs.current[index]) {
            fileInputRefs.current[index]!.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            if (isEdit) {
                if (!initialData?.id) throw new Error('공지사항 ID가 없습니다.');
                await updateNotice(initialData.id, formData);
            } else {
                await createNotice(formData);
            }

            router.push('/admin/notices');
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.message || '오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto pb-20">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/notices">
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" type="button">
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">{isEdit ? '공지사항 수정' : '새 공지사항 작성'}</h1>
                            <p className="text-gray-500 text-sm">{isEdit ? '기존 공지사항 정보를 수정합니다.' : '새로운 공지사항을 등록합니다.'}</p>
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
                        <Card>
                            <CardContent className="px-6 pt-2 pb-6 space-y-8">
                                {/* Image Upload (Multiple) */}
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-lg">대표 이미지 (최대 3장)</h3>
                                        <span className="text-sm text-gray-500">순서대로 표시됩니다.</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[0, 1, 2].map((index) => (
                                            <div key={index} className="space-y-2">
                                                <Label htmlFor={`image-upload-${index}`} className="block w-full">
                                                    <div className="relative w-full aspect-[4/3] border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer group overflow-hidden bg-gray-50">
                                                        {previews[index] ? (
                                                            <Image src={previews[index]!} alt={`Preview ${index + 1}`} fill className="object-cover" />
                                                        ) : (
                                                            <>
                                                                <Upload className="w-8 h-8 mb-2 group-hover:text-blue-600 transition-colors" />
                                                                <span className="text-sm font-medium">이미지 {index + 1}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <Input
                                                        id={`image-upload-${index}`}
                                                        name={`image_${index}`}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleImageChange(e, index)}
                                                        ref={el => { fileInputRefs.current[index] = el; }}
                                                    />
                                                    {previews[index] && !previews[index]!.startsWith('blob:') && (
                                                        <input type="hidden" name={`existing_image_url_${index}`} value={previews[index]!} />
                                                    )}
                                                </Label>
                                                {previews[index] && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        type="button"
                                                        className="text-red-500 w-full"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" /> 삭제
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-200" />

                                {/* Korean Content */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h3 className="font-semibold text-lg">국문 내용</h3>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="title_ko">제목 (국문) *</Label>
                                        <Input id="title_ko" name="title_ko" placeholder="공지사항 제목을 입력하세요" defaultValue={initialData?.title_ko} required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="body_ko">본문 (국문)</Label>
                                        <TiptapEditor
                                            value={bodyKo}
                                            onChange={setBodyKo}
                                            placeholder="내용을 입력하세요..."
                                        />
                                        <input type="hidden" name="body_ko" value={bodyKo} />
                                    </div>
                                </div>

                                <div className="border-t border-gray-200" />

                                {/* English Content */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h3 className="font-semibold text-lg">영문 내용</h3>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="title_en">제목 (영문)</Label>
                                        <Input id="title_en" name="title_en" placeholder="Enter notice title" defaultValue={initialData?.title_en || ''} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="body_en">본문 (영문)</Label>
                                        <TiptapEditor
                                            value={bodyEn}
                                            onChange={setBodyEn}
                                            placeholder="Enter content..."
                                        />
                                        <input type="hidden" name="body_en" value={bodyEn} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Settings (Right Column) */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="px-6 pt-2 pb-6 space-y-6">
                                <h3 className="font-semibold text-lg mb-4">게시 설정</h3>

                                <div className="space-y-2">
                                    <Label>상태</Label>
                                    <Select name="status" defaultValue={initialData?.status || 'draft'}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="상태 선택" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-800" align="start">
                                            <SelectItem value="draft">작성중 (Draft)</SelectItem>
                                            <SelectItem value="published">게시됨 (Published)</SelectItem>
                                            <SelectItem value="archived">보관됨 (Archived)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>카테고리</Label>
                                    <Select name="category" defaultValue={initialData?.category || (categories[0]?.name_ko || 'news')}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="카테고리 선택" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-800" align="start">
                                            {categories.length > 0 ? (
                                                categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.name_ko}>
                                                        {cat.name_ko}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <>
                                                    <SelectItem value="news">뉴스</SelectItem>
                                                    <SelectItem value="notice">공지사항</SelectItem>
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>게시 날짜</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            name="published_at"
                                            className="pl-9"
                                            type="date"
                                            defaultValue={initialData?.published_at ? initialData.published_at.split('T')[0] : new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="is_pinned">상단 고정</Label>
                                    <div className="flex items-center justify-between h-10 px-3 border border-gray-200 rounded-md bg-gray-50/50">
                                        <span className="text-sm text-gray-500">목록 최상단 고정</span>
                                        <Switch id="is_pinned" name="is_pinned" defaultChecked={initialData?.is_pinned} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </>
    );
}
