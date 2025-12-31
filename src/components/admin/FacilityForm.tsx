'use client';

import { useState, useEffect } from 'react';
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
import { ChevronLeft, Save, Wrench, Upload, X, Plus, Trash2, FileText, Table as TableIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { createFacility, updateFacility } from '@/lib/actions/facilities';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/components/ui/use-toast";

interface FacilityFormProps {
    initialData?: any;
    isEditMode?: boolean;
}

interface SpecRow {
    id: string;
    category: string;
    item: string;
    unit: string;
    value: string;
}

interface SpecData {
    modelName: string;
    description?: string;
    table: SpecRow[];
}

export default function FacilityForm({ initialData, isEditMode = false }: FacilityFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(initialData?.image_url || null);

    // Specification State
    const [specData, setSpecData] = useState<SpecData>({
        modelName: '',
        description: '',
        table: []
    });

    useEffect(() => {
        if (initialData?.specs) {
            try {
                const parsed = JSON.parse(initialData.specs);
                if (parsed.table && Array.isArray(parsed.table)) {
                    setSpecData({
                        modelName: parsed.modelName || '',
                        description: parsed.description || '',
                        table: parsed.table.map((row: any) => ({ ...row, id: Math.random().toString(36).substr(2, 9) }))
                    });
                }
            } catch (e) {
                // Ignore legacy text specs
            }
        }
    }, [initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    const handleRemoveImage = () => {
        setPreview(null);
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const addSpecRow = () => {
        setSpecData(prev => ({
            ...prev,
            table: [...prev.table, { id: Math.random().toString(36).substr(2, 9), category: '', item: '', unit: '', value: '' }]
        }));
    };

    const removeSpecRow = (id: string) => {
        setSpecData(prev => ({
            ...prev,
            table: prev.table.filter(row => row.id !== id)
        }));
    };

    const updateSpecRow = (id: string, field: keyof SpecRow, value: string) => {
        setSpecData(prev => ({
            ...prev,
            table: prev.table.map(row => row.id === id ? { ...row, [field]: value } : row)
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        // Always save as JSON
        const cleanTable = specData.table.map(({ id, ...rest }) => rest);
        const jsonSpecs = JSON.stringify({
            modelName: specData.modelName,
            description: specData.description,
            table: cleanTable
        });
        formData.set('specs', jsonSpecs);

        try {
            if (isEditMode) {
                if (!initialData?.id) throw new Error('설비 ID가 없습니다.');
                await updateFacility(initialData.id, formData);
                toast({ title: "수정 완료", description: "설비 정보가 수정되었습니다." });
            } else {
                await createFacility(formData);
                toast({ title: "등록 완료", description: "새로운 설비가 등록되었습니다." });
            }
        } catch (error: any) {
            console.error(error);
            toast({
                title: "저장 실패",
                description: error.message || '설비 저장에 실패했습니다.',
                variant: 'destructive'
            });
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-20">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>기본 정보</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Image Upload */}
                            <div className="space-y-3">
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
                                    <div className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer group relative overflow-hidden">
                                        {preview ? (
                                            <Image
                                                src={preview}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                                                <span className="text-xs font-medium">이미지 업로드</span>
                                            </>
                                        )}
                                        {preview && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white text-sm font-medium">이미지 변경</span>
                                            </div>
                                        )}
                                    </div>
                                </Label>
                                {preview && (
                                    <Button type="button" variant="destructive" size="sm" onClick={handleRemoveImage} className="w-full">
                                        이미지 삭제
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name_ko">설비명 (국문)</Label>
                                <Input id="name_ko" name="name_ko" placeholder="예: Hanger Shot Blast Machine" defaultValue={initialData?.name_ko} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name_en">설비명 (영문)</Label>
                                <Input id="name_en" name="name_en" placeholder="e.g. Hanger Shot Blast Machine" defaultValue={initialData?.name_en} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">유형 (Type) - 국문</Label>
                                <Input id="type" name="type" placeholder="예: 주요 생산 설비" defaultValue={initialData?.type} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type_en">유형 (Type) - 영문</Label>
                                <Input id="type_en" name="type_en" placeholder="예: Production Equipment" defaultValue={initialData?.type_en} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Specs */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="space-y-1">
                                <CardTitle>제원/사양 (Specifications)</CardTitle>
                                <CardDescription>설비의 상세 스펙을 입력합니다.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 animate-in fade-in duration-200">
                                <div className="space-y-2">
                                    <Label>모델명 (Unit / Model)</Label>
                                    <Input
                                        value={specData.modelName}
                                        onChange={(e) => setSpecData({ ...specData, modelName: e.target.value })}
                                        placeholder="예: Mynx - 650/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">간단한 설명</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="설비에 대한 간단한 설명을 입력하세요."
                                        value={specData.description || ''}
                                        onChange={(e) => setSpecData({ ...specData, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>스펙 상세 항목</Label>
                                        <Button type="button" size="sm" variant="outline" onClick={addSpecRow} className="h-8 gap-1">
                                            <Plus className="w-3 h-3" /> 항목 추가
                                        </Button>
                                    </div>

                                    <div className="border rounded-lg overflow-hidden">
                                        <div className="grid grid-cols-12 bg-gray-50 border-b p-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <div className="col-span-3 px-2">분류 (Category)</div>
                                            <div className="col-span-3 px-2">항목 (Item)</div>
                                            <div className="col-span-2 px-2">단위 (Unit)</div>
                                            <div className="col-span-3 px-2">값 (Value)</div>
                                            <div className="col-span-1 px-2 text-center">삭제</div>
                                        </div>
                                        <div className="divide-y max-h-[500px] overflow-y-auto">
                                            {specData.table.length > 0 ? (
                                                specData.table.map((row, index) => (
                                                    <div key={row.id} className="grid grid-cols-12 p-2 gap-2 items-center hover:bg-gray-50/50">
                                                        <div className="col-span-3">
                                                            <Input
                                                                className="h-8 text-sm"
                                                                placeholder="이송량"
                                                                value={row.category}
                                                                onChange={(e) => updateSpecRow(row.id, 'category', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-span-3">
                                                            <Input
                                                                className="h-8 text-sm"
                                                                placeholder="X 축"
                                                                value={row.item}
                                                                onChange={(e) => updateSpecRow(row.id, 'item', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Input
                                                                className="h-8 text-sm"
                                                                placeholder="mm"
                                                                value={row.unit}
                                                                onChange={(e) => updateSpecRow(row.id, 'unit', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-span-3">
                                                            <Input
                                                                className="h-8 text-sm"
                                                                placeholder="1,300"
                                                                value={row.value}
                                                                onChange={(e) => updateSpecRow(row.id, 'value', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-span-1 flex justify-center">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-gray-400 hover:text-red-500"
                                                                onClick={() => removeSpecRow(row.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-gray-400 text-sm">
                                                    등록된 항목이 없습니다. '항목 추가' 버튼을 눌러 스펙을 입력하세요.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Using a hidden input to sync structured specs back to FormData logic if we wanted, 
                                    but handleSubmit handles it manually. */}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
