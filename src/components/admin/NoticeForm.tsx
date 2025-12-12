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
import { Switch } from '@/components/ui/switch';
import { Calendar, ChevronLeft, Save, Upload, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface NoticeFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function NoticeForm({ initialData, isEdit = false }: NoticeFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect back to list
        router.push('/admin/notices');
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/notices">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
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
                        {isLoading ? '저장 중...' : '변경사항 저장'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Image Upload */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-semibold text-lg">대표 이미지</h3>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer group">
                                <Upload className="w-8 h-8 mb-2 group-hover:text-blue-600 transition-colors" />
                                <span className="text-sm font-medium">이미지 업로드</span>
                                <span className="text-xs text-gray-400 mt-1">권장 사이즈: 1200x630 (OG Image)</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Korean Content */}
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">KO</span>
                                <h3 className="font-semibold text-lg">국문 내용</h3>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title_ko">제목 (국문)</Label>
                                <Input id="title_ko" placeholder="공지사항 제목을 입력하세요" defaultValue={initialData?.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="body_ko">본문 (국문)</Label>
                                <Textarea id="body_ko" className="min-h-[200px] font-sans" placeholder="내용을 입력하세요..." defaultValue={initialData?.body_ko} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* English Content */}
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center">EN</span>
                                <h3 className="font-semibold text-lg">영문 내용</h3>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title_en">제목 (영문)</Label>
                                <Input id="title_en" placeholder="Enter notice title" defaultValue={initialData?.title_en} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="body_en">본문 (영문)</Label>
                                <Textarea id="body_en" className="min-h-[200px] font-sans" placeholder="Enter content..." defaultValue={initialData?.body_en} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Settings (Right Column) */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <h3 className="font-semibold text-lg mb-4">게시 설정</h3>

                            <div className="space-y-2">
                                <Label>상태</Label>
                                <Select defaultValue={initialData?.status || 'draft'}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="상태 선택" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-800" align="end">
                                        <SelectItem value="draft">작성중 (Draft)</SelectItem>
                                        <SelectItem value="published">게시됨 (Published)</SelectItem>
                                        <SelectItem value="archived">보관됨 (Archived)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>카테고리</Label>
                                <div className="flex gap-2">
                                    <Select defaultValue={initialData?.category || 'news'}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="카테고리 선택" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-800">
                                            <SelectItem value="news">뉴스</SelectItem>
                                            <SelectItem value="exhibition">전시회</SelectItem>
                                            <SelectItem value="maintenance">유지보수</SelectItem>
                                            <SelectItem value="other">기타</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" size="icon" type="button" title="카테고리 추가">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>게시 날짜</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input className="pl-9" type="date" defaultValue={initialData?.date || new Date().toISOString().split('T')[0]} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">상단 고정</Label>
                                    <p className="text-sm text-gray-500">목록 최상단에 고정합니다</p>
                                </div>
                                <Switch defaultChecked={initialData?.pinned} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
