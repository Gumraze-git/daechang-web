'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Save, Plus, Trash2, Search, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { updateHomeSettings, type HomeSettings } from '@/lib/actions/home';
import { toggleProductFeatured, type Product } from '@/lib/actions/products';
// import { useToast } from "@/hooks/use-toast"; // Toast not available yet

interface HomeSettingsFormProps {
    initialSettings: HomeSettings;
    products: Product[]; // All products to choose from
}

type ImageItem = {
    id: string; // Unique ID for key
    url: string; // Display URL (remote or data-url)
    file: File | null; // File if new, null if existing
    isNew: boolean;
};

export default function HomeSettingsForm({ initialSettings, products }: HomeSettingsFormProps) {
    // const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState<HomeSettings>(initialSettings);

    // Derived state for products
    const featuredProducts = products.filter(p => p.is_featured);
    const availableProducts = products.filter(p => !p.is_featured && p.status === 'active');

    // Unified Image State
    const [imageItems, setImageItems] = useState<ImageItem[]>(() => {
        return (initialSettings.hero_images || []).map((url, index) => ({
            id: `server-${index}-${url}`,
            url: url,
            file: null,
            isNew: false
        }));
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageItems(prev => [
                    ...prev,
                    {
                        id: `local-${Date.now()}`,
                        url: reader.result as string,
                        file: file,
                        isNew: true
                    }
                ]);
            };
            reader.readAsDataURL(file);
            // Reset input so same file can be selected again if needed
            e.target.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        setImageItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleMoveImage = (index: number, direction: 'left' | 'right') => {
        if (direction === 'left' && index === 0) return;
        if (direction === 'right' && index === imageItems.length - 1) return;

        setImageItems(prev => {
            const newItems = [...prev];
            const targetIndex = direction === 'left' ? index - 1 : index + 1;
            [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
            return newItems;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        // 1. Separate existing images (URLs) and new files
        // The server needs "current_images" (array of strings) to verify what to keep, 
        // AND "new_images" (array of Files) to upload.
        // BUT most importantly, it needs the ORDER.
        // We will send "image_layout": array of strings. 
        // If it's existing: put the URL.
        // If it's new: put a placeholder "new_file_{index}" where index aligns with the new_images array order.

        const newFiles: File[] = [];
        const layout: string[] = [];

        imageItems.forEach(item => {
            if (item.isNew && item.file) {
                // It's a new file
                layout.push(`new_file_${newFiles.length}`);
                newFiles.push(item.file);
            } else {
                // It's an existing server URL
                layout.push(item.url);
            }
        });

        // Current images just for safety/fallback (though our new server action relies on layout)
        const currentImages = imageItems.filter(i => !i.isNew).map(i => i.url);
        formData.set('current_images', JSON.stringify(currentImages));

        // The layout defining order
        formData.set('image_layout', JSON.stringify(layout));

        // The actual new files
        newFiles.forEach(file => {
            formData.append('new_images', file);
        });

        // Checkbox handling update
        if (settings.show_products_section) {
            formData.set('show_products_section', 'on');
        } else {
            formData.delete('show_products_section');
        }

        try {
            await updateHomeSettings(formData);
            alert("저장되었습니다: 홈 화면 설정이 업데이트되었습니다.");

            // Optimistically update state to reflect "saved" status (all become 'server' type theoretically)
            // Ideally we re-fetch data. But for now, we just wait for revalidatePath to kick in on refresh.
            // Or we can mark current local items as 'not new' but we don't have their real final URL yet.
            // So simpler to just rely on next page load or keep as is.
            // If user refreshes, they get fresh data.
        } catch (error: any) {
            alert("오류 발생: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleFeatured = async (productId: string, currentStatus: boolean) => {
        try {
            await toggleProductFeatured(productId, !currentStatus);
            // alert("상태 변경됨: 제품 노출 상태가 변경되었습니다."); // Too noisy for simple toggle
        } catch (error: any) {
            alert("오류: " + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">홈 화면 관리</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">홈페이지의 주요 섹션과 콘텐츠를 관리합니다.</p>
                </div>
                <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Save className="w-4 h-4" />
                    {isLoading ? '저장 중...' : '변경사항 저장'}
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
                                <Label htmlFor="hero_headline">헤드라인</Label>
                                <Input
                                    id="hero_headline"
                                    name="hero_headline"
                                    value={settings.hero_headline}
                                    onChange={e => setSettings({ ...settings, hero_headline: e.target.value })}
                                />
                                <p className="text-xs text-gray-400">메인 타이틀 텍스트입니다.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hero_subheadline">서브 헤드라인</Label>
                                <Input
                                    id="hero_subheadline"
                                    name="hero_subheadline"
                                    value={settings.hero_subheadline}
                                    onChange={e => setSettings({ ...settings, hero_subheadline: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>배경 이미지 목록 (드래그하여 순서 변경이 불가하므로 버튼을 사용하세요)</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {imageItems.map((item, i) => (
                                    <div key={item.id} className="aspect-video bg-gray-100 rounded-lg relative group overflow-hidden border border-gray-200">
                                        <Image
                                            src={item.url}
                                            alt={`배너 이미지 ${i + 1}`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
                                                    disabled={i === 0}
                                                    onClick={() => handleMoveImage(i, 'left')}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
                                                    onClick={() => handleRemoveImage(i)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
                                                    disabled={i === imageItems.length - 1}
                                                    onClick={() => handleMoveImage(i, 'right')}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-full">
                                                {i + 1} / {imageItems.length}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <label className="aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer">
                                    <Plus className="w-8 h-8 mb-2" />
                                    <span className="text-sm">이미지 추가</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
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
                        <CardDescription>홈 화면에 노출될 추천 제품을 관리합니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">제품 섹션 노출</Label>
                                <p className="text-sm text-gray-500">홈 화면에서 제품 목록 표시 여부를 설정합니다.</p>
                            </div>
                            <Switch
                                checked={settings.show_products_section}
                                onCheckedChange={checked => setSettings({ ...settings, show_products_section: checked })}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-gray-700">추천 제품 목록 ({featuredProducts.length})</h3>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Plus className="w-4 h-4 mr-2" /> 제품 추가
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>추천 제품 추가</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            {availableProducts.length > 0 ? (
                                                availableProducts.map((product) => (
                                                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                                        <div className="flex items-center gap-3">
                                                            {product.images && product.images[0] ? (
                                                                <div className="relative w-12 h-12 rounded overflow-hidden">
                                                                    <Image src={product.images[0]} alt={product.name_ko} fill className="object-cover" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                                                            )}
                                                            <div>
                                                                <p className="font-medium">{product.name_ko}</p>
                                                                <p className="text-xs text-gray-500">{product.model_no || product.category_code}</p>
                                                            </div>
                                                        </div>
                                                        <Button size="sm" onClick={() => handleToggleFeatured(product.id, false)}>
                                                            선택
                                                        </Button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-gray-500 py-8">추가 가능한 활성 제품이 없습니다.</p>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {featuredProducts.length > 0 ? (
                                featuredProducts.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center relative">
                                                {product.images && product.images[0] ? (
                                                    <Image src={product.images[0]} alt={product.name_ko} fill className="object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{product.name_ko}</p>
                                                <div className="flex gap-2 text-xs text-gray-500">
                                                    <Badge variant="secondary" className="text-[10px] h-5">{product.category_code}</Badge>
                                                    <span>{product.model_no}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={true}
                                            onCheckedChange={() => handleToggleFeatured(product.id, true)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
                                    추천할 제품을 추가해주세요.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
