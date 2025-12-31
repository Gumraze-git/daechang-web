'use client';

import { useState, useEffect } from 'react';
import { NoticeCategory, createNoticeCategory, deleteNoticeCategory, updateNoticeCategory, reorderNoticeCategories } from '@/lib/actions/notice-categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Loader2, Save, GripVertical, Check, X } from 'lucide-react'; // Added GripVertical, Check, X
import { useToast } from '@/components/ui/use-toast';
import DeleteAlertDialog from '@/components/admin/DeleteAlertDialog';
import AlertMessageDialog from '@/components/admin/AlertMessageDialog';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface NoticeCategoriesManagerProps {
    categories: NoticeCategory[];
}

// Sortable Item Component
function SortableCategoryItem({ category }: { category: NoticeCategory }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={`flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm group ${isDragging ? 'border-blue-500 ring-2 ring-blue-100' : ''}`}>
            <div className="flex items-center gap-3">
                <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{category.name_ko}</span>
                    {category.name_en && <span className="text-xs text-gray-500">{category.name_en}</span>}
                </div>
            </div>
        </div>
    );
}

export default function NoticeCategoriesManager({ categories: initialCategories }: NoticeCategoriesManagerProps) {
    const { toast } = useToast();
    const [categories, setCategories] = useState(initialCategories);
    const [isLoading, setIsLoading] = useState(false);

    // Sync props to state if props change (unlikely in this client component unless parent re-renders)
    useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    // Reorder State
    const [isReordering, setIsReordering] = useState(false);

    // Add/Edit State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<NoticeCategory | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Error Modal State
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setCategories((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleReorderSave = async () => {
        setIsLoading(true);
        try {
            // Map current order to new sort_order values (0-indexed)
            const reorderedItems = categories.map((cat, index) => ({
                id: cat.id,
                sort_order: index + 1, // Start from 1
            }));
            await reorderNoticeCategories(reorderedItems);
            toast({ title: "순서가 변경되었습니다." });
            setIsReordering(false);
        } catch (error: any) {
            toast({ title: "순서 변경 실패", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReorderCancel = () => {
        setCategories(initialCategories);
        setIsReordering(false);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            if (editingCategory) {
                await updateNoticeCategory(editingCategory.id, formData);
                toast({ title: "수정되었습니다." });
            } else {
                await createNoticeCategory(formData);
                toast({ title: "생성되었습니다." });
            }
            setIsDialogOpen(false);
            setEditingCategory(null);

            // Reload to reflect changes
            window.location.reload();
        } catch (error: any) {
            toast({ title: "오류 발생", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setIsLoading(true);
        try {
            await deleteNoticeCategory(deleteId);
            toast({ title: "삭제되었습니다." });
            window.location.reload();
        } catch (error: any) {
            // Display error in modal instead of toast
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
            setDeleteId(null); // Close confirm dialog
        }
    };

    const openEdit = (cat: NoticeCategory) => {
        setEditingCategory(cat);
        setIsDialogOpen(true);
    };

    const openCreate = () => {
        setEditingCategory(null);
        setIsDialogOpen(true);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Category List */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>카테고리 목록</CardTitle>
                    <div className="flex gap-2">
                        {isReordering ? (
                            <>
                                <Button onClick={handleReorderSave} size="sm" variant="default" disabled={isLoading} className="gap-1 bg-green-600 hover:bg-green-700 text-white">
                                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} 저장
                                </Button>
                                <Button onClick={handleReorderCancel} size="sm" variant="outline" disabled={isLoading} className="gap-1">
                                    <X className="w-3 h-3" /> 취소
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => setIsReordering(true)} size="sm" variant="outline" className="gap-2">
                                    <GripVertical className="w-3 h-3" /> 순서 변경
                                </Button>
                                <Button onClick={openCreate} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                                    <Plus className="w-4 h-4" /> 추가
                                </Button>
                            </>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {isReordering ? (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={categories.map(c => c.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {categories.map((cat) => (
                                        <SortableCategoryItem key={cat.id} category={cat} />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        ) : (
                            categories.map((cat) => (
                                <div key={cat.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm group">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">{cat.name_ko}</span>
                                            {cat.name_en && <span className="text-xs text-gray-500">{cat.name_en}</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(cat)} className="h-8 w-8 text-gray-400 hover:text-blue-600">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(cat.id)} className="h-8 w-8 text-gray-400 hover:text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Right: Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>카테고리별 통계</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>카테고리</TableHead>
                                <TableHead className="text-right">게시글 수</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map(cat => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.name_ko}</TableCell>
                                    <TableCell className="text-right font-bold text-blue-600">
                                        {cat.post_count || 0}개
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create/Edit Dialog - Styled like History Page */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto !top-[15vh] !translate-y-0 !rounded-2xl !shadow-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? '카테고리 수정' : '새 카테고리 추가'}</DialogTitle>
                        <DialogDescription>
                            공지사항 카테고리의 이름과 정렬 순서를 관리합니다.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name_ko">카테고리명 (국문) <span className="text-red-500">*</span></Label>
                            <Input id="name_ko" name="name_ko" defaultValue={editingCategory?.name_ko} required placeholder="예: 공지사항" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name_en">카테고리명 (영문)</Label>
                            <Input id="name_en" name="name_en" defaultValue={editingCategory?.name_en || ''} placeholder="예: Notice" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sort_order">정렬 순서</Label>
                            <Input id="sort_order" name="sort_order" type="number" defaultValue={editingCategory?.sort_order || 0} />
                            <p className="text-xs text-gray-500">낮은 숫자가 먼저 표시됩니다.</p>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
                            <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700 min-w-[80px]">
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                저장
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Alert Dialog */}
            <DeleteAlertDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={confirmDelete}
                className="!top-[15vh] !translate-y-0 !rounded-2xl !shadow-2xl"
                title="카테고리 삭제"
                description="이 카테고리를 삭제하시겠습니까? 관련 게시글에 영향이 있을 수 있습니다."
            />

            {/* Error Message Dialog */}
            <AlertMessageDialog
                open={!!errorMessage}
                onOpenChange={(open) => !open && setErrorMessage(null)}
                title="알림"
                message={errorMessage || ''}
                className="!top-[15vh] !translate-y-0 !rounded-2xl !shadow-2xl"
            />
        </div>
    );
}
