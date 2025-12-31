'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Tag } from 'lucide-react';
import { createCategory, deleteCategory, type Category } from '@/lib/actions/categories';

interface CategoryManagerProps {
    categories: Category[];
}

export default function CategoryManager({ categories }: CategoryManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (formData: FormData) => {
        setIsLoading(true);
        try {
            await createCategory(formData);
            setIsAdding(false);
            // Form reset happens automatically if we used a ref, or we can just reload.
            // With revalidatePath in action, the page should reload data.
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (code: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            await deleteCategory(code);
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl">제품 카테고리 관리</CardTitle>
                    <CardDescription>제품 분류를 위한 카테고리를 추가하고 관리합니다.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsAdding(!isAdding)}>
                    <Plus className="w-4 h-4 mr-2" /> 새 카테고리
                </Button>
            </CardHeader>
            <CardContent>
                {/* Add Form */}
                {isAdding && (
                    <form action={handleCreate} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="space-y-2">
                                <Label>코드 (영문 소문자)</Label>
                                <Input name="code" placeholder="e.g. extrusion" required pattern="[a-z0-9_]+" />
                            </div>
                            <div className="space-y-2">
                                <Label>이름 (국문)</Label>
                                <Input name="name_ko" placeholder="예: 압출기" required />
                            </div>
                            <div className="space-y-2">
                                <Label>이름 (영문)</Label>
                                <Input name="name_en" placeholder="e.g. Extrusion" />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>취소</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? '추가 중...' : '카테고리 추가'}
                            </Button>
                        </div>
                    </form>
                )}

                {/* List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                        <div key={cat.id} className="p-4 border rounded-lg flex flex-col justify-between hover:bg-gray-50 transition-colors">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">{cat.name_ko}</span>
                                    <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-500">{cat.code}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{cat.name_en}</p>
                                <div className="flex items-center text-xs text-blue-600 font-medium">
                                    <Tag className="w-3 h-3 mr-1" />
                                    제품 {cat.product_count}개
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-red-500"
                                    onClick={() => handleDelete(cat.code)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            등록된 카테고리가 없습니다.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
