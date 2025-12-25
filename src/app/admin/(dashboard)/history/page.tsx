'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DeleteAlertDialog from '@/components/admin/DeleteAlertDialog';
import HistoryForm, { HistoryItem } from '@/components/admin/history/HistoryForm';
import { createClient } from '@/lib/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export default function HistoryAdminPage() {
    const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<HistoryItem | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const supabase = createClient();
    const { toast } = useToast();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .order('year', { ascending: false })
            .order('month', { ascending: false })
            .order('day', { ascending: false });

        if (error) {
            console.error('Error fetching history:', error);
            toast({
                title: "오류 발생",
                description: "연혁 데이터를 불러오는데 실패했습니다.",
                variant: "destructive",
            });
        } else {
            // Map Supabase 'content_ko' to 'description'
            const formattedData: HistoryItem[] = (data || []).map(item => ({
                id: item.id,
                year: item.year,
                month: item.month,
                day: item.day || '',
                description: item.content_ko
            }));
            setHistoryData(formattedData);
        }
        setIsLoading(false);
    };

    const handleAdd = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: HistoryItem) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            const { error } = await supabase.from('history').delete().eq('id', deleteId);

            if (error) {
                console.error('Error deleting history:', error);
                toast({ title: "삭제 실패", description: "오류가 발생했습니다.", variant: "destructive" });
            } else {
                toast({ title: "삭제 완료", description: "연혁이 삭제되었습니다." });
                fetchHistory(); // Refresh list
            }
            setDeleteId(null);
        }
    };

    const handleFormSubmit = async (data: HistoryItem) => {
        try {
            if (editingItem) {
                // Update
                const { error } = await supabase
                    .from('history')
                    .update({
                        year: data.year,
                        month: data.month,
                        day: data.day || null,
                        content_ko: data.description
                    })
                    .eq('id', editingItem.id);

                if (error) throw error;
                toast({ title: "수정 완료", description: "연혁이 수정되었습니다." });
            } else {
                // Add
                const { error } = await supabase
                    .from('history')
                    .insert({
                        year: data.year,
                        month: data.month,
                        day: data.day || null,
                        content_ko: data.description
                    });

                if (error) throw error;
                toast({ title: "등록 완료", description: "새 연혁이 등록되었습니다." });
            }

            setIsFormOpen(false);
            setEditingItem(null);
            fetchHistory(); // Refresh list to get new IDs and sorted order from DB

        } catch (error) {
            console.error('Error saving history:', error);
            toast({
                title: "저장 실패",
                description: "데이터 저장 중 오류가 발생했습니다.",
                variant: "destructive",
            });
        }
    };

    // Group data for RowSpan calculation
    const getRowSpan = (year: string, index: number, data: HistoryItem[]) => {
        const isFirst = index === 0 || data[index - 1].year !== year;
        if (!isFirst) return 0;

        let span = 1;
        for (let i = index + 1; i < data.length; i++) {
            if (data[i].year === year) span++;
            else break;
        }
        return span;
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">연혁 관리</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">회사 연혁을 개별 이벤트 단위로 관리합니다.</p>
                </div>
                <Button onClick={handleAdd} className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4" /> 새 연혁 등록
                </Button>
            </div>

            <Card className="overflow-hidden p-0 py-0 gap-0">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                        <TableRow>
                            <TableHead className="w-[100px] text-center">연도</TableHead>
                            <TableHead className="w-[80px] text-center">월</TableHead>
                            <TableHead className="w-[80px] text-center">일</TableHead>
                            <TableHead>내용</TableHead>
                            <TableHead className="w-[100px] text-center">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {historyData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                                    등록된 연혁이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            historyData.map((item, index) => {
                                const yearRowSpan = getRowSpan(item.year, index, historyData);

                                return (
                                    <TableRow key={item.id} className="group hover:bg-gray-50/50">
                                        {yearRowSpan > 0 && (
                                            <TableCell
                                                rowSpan={yearRowSpan}
                                                className="font-bold text-lg text-gray-900 dark:text-gray-100 align-middle text-center border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950"
                                            >
                                                {item.year}
                                            </TableCell>
                                        )}
                                        <TableCell className="text-center align-middle">
                                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                                                {item.month}월
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center align-middle">
                                            <span className="text-gray-500 dark:text-gray-500 text-sm">
                                                {item.day ? `${item.day}일` : '-'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="align-middle">
                                            <span className="text-gray-700 dark:text-gray-300">{item.description}</span>
                                        </TableCell>
                                        <TableCell className="text-center align-middle border-l border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDeleteClick(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto !top-[15vh] !translate-y-0 !rounded-2xl !shadow-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? '연혁 수정' : '새 연혁 등록'}</DialogTitle>
                        <DialogDescription>
                            연혁의 연도, 월, 일, 내용을 입력하세요. 등록 시 날짜순으로 자동 정렬됩니다.
                        </DialogDescription>
                    </DialogHeader>
                    <HistoryForm
                        initialData={editingItem || undefined}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <DeleteAlertDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
