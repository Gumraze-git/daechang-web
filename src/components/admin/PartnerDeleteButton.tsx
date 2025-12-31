'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import DeleteAlertDialog from '@/components/admin/DeleteAlertDialog';
import { deletePartner } from '@/lib/actions/partners';
import { useToast } from "@/components/ui/use-toast";

interface PartnerDeleteButtonProps {
    id: string;
}

export default function PartnerDeleteButton({ id }: PartnerDeleteButtonProps) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        try {
            await deletePartner(id);
            toast({ title: "삭제 완료", description: "협력사가 삭제되었습니다." });
        } catch (error) {
            console.error('Error deleting partner:', error);
            toast({ title: "삭제 실패", description: "오류가 발생했습니다.", variant: "destructive" });
        } finally {
            setOpen(false);
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                onClick={() => setOpen(true)}
            >
                <Trash2 className="w-4 h-4" />
            </Button>
            <DeleteAlertDialog
                open={open}
                onOpenChange={setOpen}
                onConfirm={handleDelete}
                className="!top-[50%] !translate-y-[-50%] !rounded-2xl !shadow-2xl"
            />
        </>
    );
}
