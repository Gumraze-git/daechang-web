'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { createCategory } from '@/lib/actions/categories';

interface CategoryModalProps {
    onCategoryCreated?: () => void;
}

export function CategoryModal({ onCategoryCreated }: CategoryModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            await createCategory(formData);
            setOpen(false);
            router.refresh(); // Refresh server components to fetch new categories
            if (onCategoryCreated) onCategoryCreated();
        } catch (error: any) {
            console.error(error);
            alert(error.message || '카테고리 생성에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" type="button" className="shrink-0 h-10 w-10 px-0">
                    <Plus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>새 카테고리 추가</DialogTitle>
                        <DialogDescription>
                            새로운 제품 카테고리를 생성합니다. 코드는 영문 소문자, 숫자로 입력해주세요.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="code" className="text-right">
                                코드
                            </Label>
                            <Input
                                id="code"
                                name="code"
                                placeholder="e.g. clean-room"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name_ko" className="text-right">
                                이름 (국문)
                            </Label>
                            <Input
                                id="name_ko"
                                name="name_ko"
                                placeholder="예: 클린룸 장비"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name_en" className="text-right">
                                이름 (영문)
                            </Label>
                            <Input
                                id="name_en"
                                name="name_en"
                                placeholder="e.g. Clean Room Equipment"
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            취소
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? '생성 중...' : '생성'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
