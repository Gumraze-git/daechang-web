'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { cn } from '@/lib/utils';

interface AlertMessageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    message: string;
    onConfirm?: () => void;
    className?: string;
}

export default function AlertMessageDialog({
    open,
    onOpenChange,
    title = '알림',
    message,
    onConfirm,
    className,
}: AlertMessageDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className={cn("bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", className)}>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription className="whitespace-pre-wrap">
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            if (onConfirm) onConfirm();
                            onOpenChange(false);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-600"
                    >
                        확인
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
