'use client';

import Image from 'next/image';
import { Image as ImageIcon, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function HomeManagementPage() {
    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">홈 화면 관리</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">홈페이지의 주요 섹션과 콘텐츠를 관리합니다.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Save className="w-4 h-4" />
                    변경사항 저장
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8">

                {/* Main Hero Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-blue-500" />
                            홈페이지 헤드라인 관리
                        </CardTitle>
                        <CardDescription>홈페이지 최상단 영웅(Hero) 영역의 이미지와 문구를 관리합니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>헤드라인</Label>
                                <Input defaultValue="산업 기계의 미래를 혁신하다" />
                                <p className="text-xs text-gray-400">메인 타이틀 텍스트입니다.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>서브 헤드라인</Label>
                                <Input defaultValue="블로우 몰딩기 및 압출 라인의 신뢰할 수 있는 파트너." />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>배경 이미지 목록</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="aspect-video bg-gray-100 rounded-lg relative group overflow-hidden border border-gray-200">
                                        <Image
                                            src={`/images/hero-bg-test.jpg`}
                                            alt="메인 배너 이미지"
                                            width={400}
                                            height={225}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button variant="destructive" size="icon" className="h-8 w-8">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer">
                                    <Plus className="w-8 h-8 mb-2" />
                                    <span className="text-sm">이미지 추가</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Product Section Management */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-green-500" />
                            제품 섹션 설정
                        </CardTitle>
                        <CardDescription>홈 화면에 노출될 제품 카드를 관리합니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">제품 섹션 노출</Label>
                                <p className="text-sm text-gray-500">홈 화면에서 제품 목록 표시 여부를 설정합니다.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium">고성능 블로우 몰딩기</p>
                                        <p className="text-xs text-gray-500">카테고리: Blow Molding</p>
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium">첨단 PVC 압출 라인</p>
                                        <p className="text-xs text-gray-500">카테고리: Extrusion Line</p>
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
