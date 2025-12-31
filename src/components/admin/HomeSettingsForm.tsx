'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Save, Plus, Trash2, Search, ChevronLeft, ChevronRight, Loader2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { updateHomeSettings, type HomeSettings } from '@/lib/actions/home';
import { toggleProductFeatured, type Product } from '@/lib/actions/products';

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

// Category code mapping for Korean display
const CATEGORY_MAP: Record<string, string> = {
    'blow_molding': '블로우 몰딩기',
    'extrusion_line': '압출 라인',
    'injection_molding': '사출 성형기',
    'reducer': '감속기',
    'pto': '동력 인출 장치'
};

export default function HomeSettingsForm({ initialSettings, products }: HomeSettingsFormProps) {
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
        // Clear previous status
        // setStatusMessage(''); 

        const formData = new FormData(e.currentTarget);

        // 1. Separate existing images (URLs) and new files
        const newFiles: File[] = [];
        const layout: string[] = [];

        imageItems.forEach(item => {
            if (item.isNew && item.file) {
                layout.push(`new_file_${newFiles.length}`);
                newFiles.push(item.file);
            } else {
                layout.push(item.url);
            }
        });

        // Current images just for safety/fallback
        const currentImages = imageItems.filter(i => !i.isNew).map(i => i.url);
        formData.set('current_images', JSON.stringify(currentImages));

        // The layout defining order
        formData.set('image_layout', JSON.stringify(layout));

        // The actual new files
        newFiles.forEach(file => {
            formData.append('new_images', file);
        });



        try {
            await updateHomeSettings(formData);

            // Show success state on button
            // We could add a "isSuccess" state if we want the button to turn green briefly
            // Show success state on button
            // We could add a "isSuccess" state if we want the button to turn green briefly
            // alert("저장되었습니다."); // Removed per user request to avoid checking clicks. Button loading state is sufficient.

        } catch (error: any) {
            alert("저장 중 오류가 발생했습니다: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleFeatured = async (productId: string, currentStatus: boolean) => {
        try {
            await toggleProductFeatured(productId, !currentStatus);
        } catch (error: any) {
            alert("오류 발생: " + error.message);
        }
    };

    const getCategoryName = (code: string) => {
        return CATEGORY_MAP[code] || code;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            <fieldset disabled={isLoading} className="space-y-8 disabled:opacity-80">
                <div className="flex items-center justify-between py-4 border-b -mx-6 px-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">홈 화면 관리</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">홈페이지의 주요 섹션과 콘텐츠를 관리합니다.</p>
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
                                        <div key={item.id} className="aspect-video bg-gray-100 rounded-lg relative group/hero overflow-hidden border border-gray-200">
                                            <Image
                                                src={item.url}
                                                alt={`배너 이미지 ${i + 1}`}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />

                                            {/* Overlay Actions - Only show if not disabled */}
                                            {!isLoading && (
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/hero:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
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
                                            )}
                                        </div>
                                    ))}
                                    {/* Add Image Button - Hide if disabled conceptually, or just disable interaction */}
                                    <label className={`aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 transition-colors ${isLoading ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100 hover:border-gray-400 cursor-pointer'}`}>
                                        <Plus className="w-8 h-8 mb-2" />
                                        <span className="text-sm">이미지 추가</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isLoading} />
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Section Management - Displayed Products */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-green-500" />
                                    홈 화면 노출 제품
                                </CardTitle>
                                <CardDescription>현재 홈 화면에 표시되고 있는 제품입니다. ({featuredProducts.length}개)</CardDescription>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                                        <Settings className="w-4 h-4" />
                                        제품 관리
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-3xl w-full max-h-[85vh] flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>홈 화면 노출 제품 관리</DialogTitle>
                                        <DialogDescription>
                                            홈 화면에 노출할 제품을 선택하세요. 스위치를 켜면 노출되고, 끄면 숨겨집니다.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 overflow-y-auto pr-2 mt-4">
                                        <div className="grid grid-cols-1 gap-4 pb-4">
                                            {products.map((product) => (
                                                <div key={product.id} className="relative flex h-32 bg-white rounded-lg border border-gray-200 overflow-hidden group/product-modal hover:border-blue-300 transition-colors">
                                                    {/* Image Section - Full Height */}
                                                    <div className="w-32 relative flex-shrink-0 bg-gray-100 border-r border-gray-200">
                                                        {product.images && product.images[0] ? (
                                                            <Image src={product.images[0]} alt={product.name_ko} fill className="object-cover" />
                                                        ) : (
                                                            <ImageIcon className="w-10 h-10 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                                        )}
                                                    </div>

                                                    {/* Content Section */}
                                                    <div className="flex-1 min-w-0 p-3 flex flex-col justify-center gap-1">
                                                        <div className="flex items-center text-sm">
                                                            <div className="w-[72px] flex-shrink-0 flex justify-between items-center text-gray-500 font-normal mr-2">
                                                                <span>제품명</span>
                                                                <span className="h-3 w-px bg-gray-300" aria-hidden="true" />
                                                            </div>
                                                            <span className="font-bold text-gray-900 truncate flex-1 min-w-0">{product.name_ko}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm">
                                                            <div className="w-[72px] flex-shrink-0 flex justify-between items-center text-gray-400 font-normal mr-2">
                                                                <span>카테고리</span>
                                                                <span className="h-3 w-px bg-gray-300" aria-hidden="true" />
                                                            </div>
                                                            <span className="text-gray-600 truncate font-medium flex-1 min-w-0">{getCategoryName(product.category_code)}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm">
                                                            <div className="w-[72px] flex-shrink-0 flex justify-between items-center text-gray-400 mr-2">
                                                                <span>제품 코드</span>
                                                                <span className="h-3 w-px bg-gray-300" aria-hidden="true" />
                                                            </div>
                                                            <span className="text-gray-500 truncate flex-1 min-w-0">{product.model_no}</span>
                                                        </div>
                                                    </div>

                                                    {/* Absolute Switch */}
                                                    <div className="absolute top-1/2 right-6 -translate-y-1/2">
                                                        <Switch
                                                            checked={product.is_featured}
                                                            onCheckedChange={(checked) => handleToggleFeatured(product.id, !checked)}
                                                            disabled={isLoading}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {featuredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {featuredProducts.map((product) => (
                                        <div key={product.id} className="relative flex h-32 bg-white rounded-lg border border-gray-200 overflow-hidden group/product">
                                            {/* Image Section - Full Height */}
                                            <div className="w-32 relative flex-shrink-0 bg-gray-100 border-r border-gray-200">
                                                {product.images && product.images[0] ? (
                                                    <Image src={product.images[0]} alt={product.name_ko} fill className="object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-10 h-10 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                                )}
                                            </div>

                                            {/* Content Section */}
                                            <div className="flex-1 min-w-0 p-3 flex flex-col justify-center gap-1">
                                                <div className="flex items-center text-sm">
                                                    <div className="w-[72px] flex-shrink-0 flex justify-between items-center text-gray-500 font-normal mr-2">
                                                        <span>제품명</span>
                                                        <span className="h-3 w-px bg-gray-300" aria-hidden="true" />
                                                    </div>
                                                    <span className="font-bold text-gray-900 truncate flex-1 min-w-0">{product.name_ko}</span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <div className="w-[72px] flex-shrink-0 flex justify-between items-center text-gray-400 font-normal mr-2">
                                                        <span>카테고리</span>
                                                        <span className="h-3 w-px bg-gray-300" aria-hidden="true" />
                                                    </div>
                                                    <span className="text-gray-600 truncate font-medium flex-1 min-w-0">{getCategoryName(product.category_code)}</span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <div className="w-[72px] flex-shrink-0 flex justify-between items-center text-gray-400 mr-2">
                                                        <span>제품 코드</span>
                                                        <span className="h-3 w-px bg-gray-300" aria-hidden="true" />
                                                    </div>
                                                    <span className="text-gray-500 truncate flex-1 min-w-0">{product.model_no}</span>
                                                </div>
                                            </div>

                                            {/* Absolute Delete Button */}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleToggleFeatured(product.id, true)}
                                                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                title="노출 해제"
                                                disabled={isLoading}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-lg bg-gray-50/50">
                                    <p>현재 노출 중인 제품이 없습니다.</p>
                                    <p className="text-sm mt-1">상단의 '제품 관리' 버튼을 눌러 제품을 추가해주세요.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </fieldset>
        </form>
    );
}
