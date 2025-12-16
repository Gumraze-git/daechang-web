'use client';

import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DeleteAlertDialog from '@/components/admin/DeleteAlertDialog';
import HistoryForm, { HistoryYear } from '@/components/admin/history/HistoryForm';

// Initial Mock Data
const INITIAL_HISTORY: HistoryYear[] = [
    {
        id: '1',
        year: '2025',
        events: [
            { id: 'e1', month: '03', description: '제 2공장 준공 완료' },
            { id: 'e2', month: '01', description: '신년 비전 선포식' }
        ]
    },
    {
        id: '2',
        year: '2024',
        events: [
            { id: 'e3', month: '12', description: '수출 1000만불 탑 달성' },
            { id: 'e4', month: '10', description: 'ISO 45001 인증 획득' },
            { id: 'e5', month: '05', description: '기업부설연구소 설립' }
        ]
    },
    {
        id: '3',
        year: '2009',
        events: [
            { id: 'e6', month: '08', description: '화성공장 확장이전' }
        ]
    }
];

export default function HistoryAdminPage() {
    const [historyData, setHistoryData] = useState<HistoryYear[]>(INITIAL_HISTORY);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingYear, setEditingYear] = useState<HistoryYear | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleAdd = () => {
        setEditingYear(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: HistoryYear) => {
        setEditingYear(item);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            setHistoryData(historyData.filter(item => item.id !== deleteId));
            setDeleteId(null);
        }
    };

    const handleFormSubmit = (data: HistoryYear) => {
        if (editingYear) {
            // Update
            setHistoryData(historyData.map(item => item.id === editingYear.id ? data : item));
        } else {
            // Add
            setHistoryData([data, ...historyData].sort((a, b) => b.year.localeCompare(a.year)));
        }
        setIsFormOpen(false);
        setEditingYear(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">연혁 관리</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">회사 연혁을 연도별로 관리합니다. (연도별 최대 5개)</p>
                </div>
                <Button onClick={handleAdd} className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4" /> 새 연혁 등록
                </Button>
            </div>

            <Card className="overflow-hidden p-0 py-0 gap-0">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                        <TableRow>
                            <TableHead className="w-[100px]">연도</TableHead>
                            <TableHead>주요 내용 (최신순)</TableHead>
                            <TableHead className="w-[100px] text-right">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {historyData.map((item) => (
                            <TableRow key={item.id} className="group">
                                <TableCell className="font-bold text-lg text-gray-900 dark:text-gray-100 align-top pt-4">
                                    {item.year}
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-2 py-2">
                                        {item.events.map((event) => (
                                            <div key={event.id} className="flex gap-3 text-sm">
                                                <Badge variant="outline" className="h-6 w-12 justify-center flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                                                    {event.month}월
                                                </Badge>
                                                <span className="text-gray-700 dark:text-gray-300">{event.description}</span>
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right align-top pt-4">
                                    <div className="flex items-center justify-end gap-2">
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
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingYear ? '연혁 수정' : '새 연혁 등록'}</DialogTitle>
                        <DialogDescription>
                            해당 연도의 주요 이벤트를 입력하세요. 최대 5개까지 등록 가능합니다.
                        </DialogDescription>
                    </DialogHeader>
                    <HistoryForm
                        initialData={editingYear || undefined}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsFormOpen(false)}
                        existingYears={editingYear ? [] : historyData.map(h => h.year)} // Only validate duplicates on add
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
