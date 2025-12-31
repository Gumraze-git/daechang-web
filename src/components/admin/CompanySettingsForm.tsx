'use client';

import { useState } from 'react';
import { Save, Loader2, Building2, Target, Users, BookOpen, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateCompanySettings, type CompanySettings } from '@/lib/actions/company';

interface CompanySettingsFormProps {
    initialSettings: CompanySettings | null;
}

export default function CompanySettingsForm({ initialSettings }: CompanySettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState<Partial<CompanySettings>>(initialSettings || {});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        // Add core_values as JSON string
        formData.set('core_values', JSON.stringify(settings.core_values || []));

        try {
            await updateCompanySettings(formData);
            alert("저장되었습니다.");
        } catch (error: any) {
            alert("저장 중 오류가 발생했습니다: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCoreValueChange = (index: number, field: string, value: string) => {
        const newValues = [...(settings.core_values || [])];
        newValues[index] = { ...newValues[index], [field]: value };
        setSettings({ ...settings, core_values: newValues });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            <fieldset disabled={isLoading} className="space-y-8 disabled:opacity-80">
                <div className="flex items-center justify-between py-4 border-b -mx-6 px-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">기업 관리</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">기업 소개 페이지의 주요 내용을 관리합니다.</p>
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className={`gap-2 min-w-[140px] transition-all duration-300 ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>저장 중...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>변경사항 저장</span>
                            </>
                        )}
                    </Button>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> 기업 개요
                        </TabsTrigger>
                        <TabsTrigger value="philosophy" className="flex items-center gap-2">
                            <Target className="w-4 h-4" /> 경영 철학 (미션/비전/가치)
                        </TabsTrigger>
                        <TabsTrigger value="ceo" className="flex items-center gap-2">
                            <UserCircle className="w-4 h-4" /> CEO 인사말
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-blue-500" />
                                    기업 기본 정보
                                </CardTitle>
                                <CardDescription>회사의 기본적인 정보를 입력합니다.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="company_name_ko">회사명 (한글)</Label>
                                        <Input id="company_name_ko" name="company_name_ko" defaultValue={settings.company_name_ko} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company_name_en">회사명 (영문)</Label>
                                        <Input id="company_name_en" name="company_name_en" defaultValue={settings.company_name_en} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ceo_name_ko">대표이사 (한글)</Label>
                                        <Input id="ceo_name_ko" name="ceo_name_ko" defaultValue={settings.ceo_name_ko} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ceo_name_en">대표이사 (영문)</Label>
                                        <Input id="ceo_name_en" name="ceo_name_en" defaultValue={settings.ceo_name_en} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="establishment_ko">설립일 (한글)</Label>
                                        <Input id="establishment_ko" name="establishment_ko" defaultValue={settings.establishment_ko} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="establishment_en">설립일 (영문)</Label>
                                        <Input id="establishment_en" name="establishment_en" defaultValue={settings.establishment_en} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="employees_ko">임직원 수 (한글)</Label>
                                        <Input id="employees_ko" name="employees_ko" defaultValue={settings.employees_ko} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="employees_en">임직원 수 (영문)</Label>
                                        <Input id="employees_en" name="employees_en" defaultValue={settings.employees_en} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="revenue_ko">매출액 (한글)</Label>
                                        <Input id="revenue_ko" name="revenue_ko" defaultValue={settings.revenue_ko} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="revenue_en">매출액 (영문)</Label>
                                        <Input id="revenue_en" name="revenue_en" defaultValue={settings.revenue_en} />
                                    </div>

                                    {/* Contact & Registration Info */}
                                    <div className="space-y-2">
                                        <Label htmlFor="representative_email">대표 이메일</Label>
                                        <Input id="representative_email" name="representative_email" defaultValue={settings.representative_email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="representative_phone">대표 전화번호</Label>
                                        <Input id="representative_phone" name="representative_phone" defaultValue={settings.representative_phone} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="business_registration_number">사업자 등록번호</Label>
                                        <Input id="business_registration_number" name="business_registration_number" defaultValue={settings.business_registration_number} />
                                    </div>
                                    {/* Empty div for grid alignment if needed, or span 1 */}
                                    <div className="hidden md:block"></div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="address_ko">주소 (한글)</Label>
                                        <Input id="address_ko" name="address_ko" defaultValue={settings.address_ko} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="address_en">주소 (영문)</Label>
                                        <Input id="address_en" name="address_en" defaultValue={settings.address_en} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="philosophy">
                        <div className="space-y-6">
                            {/* Mission & Vision */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Target className="w-5 h-5 text-blue-500" />
                                            미션 (Mission)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="mission_title_ko">타이틀 (한글)</Label>
                                            <Input id="mission_title_ko" name="mission_title_ko" defaultValue={settings.mission_title_ko} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mission_title_en">타이틀 (영문)</Label>
                                            <Input id="mission_title_en" name="mission_title_en" defaultValue={settings.mission_title_en} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mission_desc_ko">설명 (한글)</Label>
                                            <Textarea id="mission_desc_ko" name="mission_desc_ko" defaultValue={settings.mission_desc_ko} rows={3} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mission_desc_en">설명 (영문)</Label>
                                            <Textarea id="mission_desc_en" name="mission_desc_en" defaultValue={settings.mission_desc_en} rows={3} />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-purple-500" />
                                            비전 (Vision)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="vision_title_ko">타이틀 (한글)</Label>
                                            <Input id="vision_title_ko" name="vision_title_ko" defaultValue={settings.vision_title_ko} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="vision_title_en">타이틀 (영문)</Label>
                                            <Input id="vision_title_en" name="vision_title_en" defaultValue={settings.vision_title_en} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="vision_desc_ko">설명 (한글)</Label>
                                            <Textarea id="vision_desc_ko" name="vision_desc_ko" defaultValue={settings.vision_desc_ko} rows={3} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="vision_desc_en">설명 (영문)</Label>
                                            <Textarea id="vision_desc_en" name="vision_desc_en" defaultValue={settings.vision_desc_en} rows={3} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Core Values */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-green-500" />
                                        핵심 가치 (Core Values)
                                    </CardTitle>
                                    <CardDescription>3가지 핵심 가치를 관리합니다.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8 divide-y">
                                    {(settings.core_values || []).map((value, idx) => (
                                        <div key={idx} className={idx > 0 ? "pt-8" : ""}>
                                            <h4 className="font-bold mb-4 text-gray-700">핵심 가치 {idx + 1}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>타이틀 (한글)</Label>
                                                    <Input value={value.title_ko} onChange={(e) => handleCoreValueChange(idx, 'title_ko', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>타이틀 (영문)</Label>
                                                    <Input value={value.title_en} onChange={(e) => handleCoreValueChange(idx, 'title_en', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>설명 (한글)</Label>
                                                    <Textarea value={value.desc_ko} onChange={(e) => handleCoreValueChange(idx, 'desc_ko', e.target.value)} rows={2} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>설명 (영문)</Label>
                                                    <Textarea value={value.desc_en} onChange={(e) => handleCoreValueChange(idx, 'desc_en', e.target.value)} rows={2} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="ceo">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCircle className="w-5 h-5 text-orange-500" />
                                    CEO 인사말 관리
                                </CardTitle>
                                <CardDescription>CEO 인사말 페이지의 제목과 본문 내용을 관리합니다.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="ceo_message_title_ko">제목 (한글)</Label>
                                    <Input id="ceo_message_title_ko" name="ceo_message_title_ko" defaultValue={settings.ceo_message_title_ko} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ceo_message_title_en">제목 (영문)</Label>
                                    <Input id="ceo_message_title_en" name="ceo_message_title_en" defaultValue={settings.ceo_message_title_en} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ceo_message_content_ko">본문 내용 (한글)</Label>
                                    <Textarea id="ceo_message_content_ko" name="ceo_message_content_ko" defaultValue={settings.ceo_message_content_ko} rows={12} className="whitespace-pre-wrap" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ceo_message_content_en">본문 내용 (영문)</Label>
                                    <Textarea id="ceo_message_content_en" name="ceo_message_content_en" defaultValue={settings.ceo_message_content_en} rows={12} className="whitespace-pre-wrap" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

            </fieldset>
        </form>
    );
}
