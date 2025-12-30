'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { updateFactoryImages, uploadFactoryImage } from '@/lib/actions/company';

interface FactoryImage {
    id: string;
    url: string;
    sort_order: number;
}

interface FactoryImagesManagerProps {
    initialImages?: FactoryImage[];
}

export default function FactoryImagesManager({ initialImages = [] }: FactoryImagesManagerProps) {
    const { toast } = useToast();
    const [images, setImages] = useState<FactoryImage[]>(
        initialImages.length > 0
            ? initialImages
            : [
                { id: '1', url: '', sort_order: 1 },
                { id: '2', url: '', sort_order: 2 },
                { id: '3', url: '', sort_order: 3 },
            ]
    );
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleFileChange = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingId(id);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const publicUrl = await uploadFactoryImage(formData);
            setImages(prev => prev.map(img => img.id === id ? { ...img, url: publicUrl } : img));
            toast({ title: "이미지 업로드 성공", description: "이미지가 임시 저장되었습니다. '저장' 버튼을 눌러 확정하세요." });
        } catch (error) {
            console.error(error);
            toast({ title: "업로드 실패", description: "이미지 업로드 중 오류가 발생했습니다.", variant: "destructive" });
        } finally {
            setUploadingId(null);
        }
    };

    const handleRemoveImage = (id: string) => {
        setImages(prev => prev.map(img => img.id === id ? { ...img, url: '' } : img));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('factory_images', JSON.stringify(images));
            await updateFactoryImages(formData);
            toast({ title: "저장 완료", description: "공장 전경 이미지가 업데이트되었습니다." });
        } catch (error) {
            console.error(error);
            toast({ title: "저장 실패", description: "설정 저장 중 오류가 발생했습니다.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const getSlotLabel = (order: number) => {
        switch (order) {
            case 1: return 'Main Image';
            case 2: return 'Exterior';
            case 3: return 'Interior';
            default: return `Slot ${order}`;
        }
    };

    return (
        <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                    <CardTitle>공장 전경 이미지 관리</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">공개 페이지 하단에 표시될 공장 전경 이미지 3장을 관리합니다.</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    변경사항 저장
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {images.map((img) => (
                        <div key={img.id} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold text-gray-700">{getSlotLabel(img.sort_order)}</Label>
                            </div>

                            <div className="aspect-[4/3] relative bg-gray-100 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden group hover:border-blue-400 transition-colors">
                                {img.url ? (
                                    <>
                                        <Image src={img.url} alt={getSlotLabel(img.sort_order)} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            <Label htmlFor={`upload-${img.id}`} className="cursor-pointer">
                                                <div className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-md text-xs backdrop-blur-sm transition-colors flex items-center gap-1">
                                                    <Upload className="w-3 h-3" /> 교체
                                                </div>
                                            </Label>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="h-7 text-xs px-2"
                                                onClick={() => handleRemoveImage(img.id)}
                                            >
                                                <X className="w-3 h-3 mr-1" /> 삭제
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <Label htmlFor={`upload-${img.id}`} className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-blue-500 hover:bg-blue-50/10 transition-colors">
                                        {uploadingId === img.id ? (
                                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 mb-2" />
                                                <span className="text-xs">이미지 업로드</span>
                                            </>
                                        )}
                                    </Label>
                                )}
                                <Input
                                    id={`upload-${img.id}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(img.id, e)}
                                    disabled={uploadingId === img.id}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
