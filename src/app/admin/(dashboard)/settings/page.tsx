'use client';

import { Save, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">환경 설정</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">사이트 기본 정보와 보안 설정을 관리합니다.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Save className="w-4 h-4" />
                    변경사항 저장
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Site Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-500" />
                            사이트 기본 정보
                        </CardTitle>
                        <CardDescription>푸터(Footer) 및 메타 데이터에 사용되는 정보입니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>사이트 제목</Label>
                                <Input defaultValue="(주)대창기계" />
                            </div>
                            <div className="space-y-2">
                                <Label>대표 이메일</Label>
                                <Input defaultValue="contact@daechang.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>대표 전화번호</Label>
                                <Input defaultValue="032-123-4567" />
                            </div>
                            <div className="space-y-2">
                                <Label>사업자 등록번호</Label>
                                <Input defaultValue="123-45-67890" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>회사 주소</Label>
                            <Input defaultValue="인천광역시 남동구 남동서로 123" />
                        </div>
                    </CardContent>
                </Card>

                {/* Admin Security */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-500" />
                            관리자 보안
                        </CardTitle>
                        <CardDescription>계정 보호 및 보안 관련 설정을 관리합니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">


                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">비밀번호 만료 정책</Label>
                                <p className="text-sm text-gray-500">90일마다 비밀번호 변경을 강제합니다.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">세션 타임아웃</Label>
                                <p className="text-sm text-gray-500">30분 동안 활동이 없으면 자동으로 로그아웃합니다.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
