'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Plus, MoreHorizontal, Search, FileText, Calendar, Filter, Pencil, Trash2 } from 'lucide-react';
import DeleteAlertDialog from '@/components/admin/DeleteAlertDialog';

// Mock Data
const MOCK_NOTICES = [
    {
        id: '1',
        title: '전시회 참가 안내 (K-Machinery 2025)',
        category: '전시회',
        status: 'Published',
        date: '2025-11-28',
        views: 128,
    },
    {
        id: '2',
        title: '신제품 라인업 출시: Smart Blow Molder XN-Series',
        category: '뉴스',
        status: 'Published',
        date: '2025-11-20',
        views: 342,
    },
    {
        id: '3',
        title: '2025년 상반기 정기 설비 점검 안내',
        category: '유지보수',
        status: 'Draft',
        date: '2025-12-10',
        views: 0,
    },
    {
        id: '4',
        title: '웹사이트 리뉴얼 및 서버 점검 공지',
        category: '뉴스',
        status: 'Published',
        date: '2025-10-15',
        views: 89,
    },
    {
        id: '5',
        title: '추석 연휴 휴무 안내',
        category: '뉴스',
        status: 'Archived',
        date: '2025-09-20',
        views: 56,
    },
];

export default function NoticesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        alert('공지사항이 삭제되었습니다. (Mock)');
        setDeleteId(null);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">공지사항 관리</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">웹사이트의 공지사항 및 뉴스를 관리합니다.</p>
                </div>
                <Link href="/admin/notices/new">
                    <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4" /> 새 공지 작성
                    </Button>
                </Link>
            </div>

            {/* Filters & Search */}
            <Card className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 py-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="제목 검색..."
                        className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </Card>

            {/* Notices Table */}
            <Card className="overflow-hidden p-0 py-0 gap-0">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                        <TableRow>
                            <TableHead className="w-[400px]">제목</TableHead>
                            <TableHead>카테고리</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead className="hidden md:table-cell">날짜</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_NOTICES.map((notice) => (
                            <TableRow key={notice.id} className="group">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <span className="group-hover:text-blue-600 transition-colors cursor-pointer">{notice.title}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                        {notice.category}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={`font-medium border shadow-none ${notice.status === 'Published'
                                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                            : notice.status === 'Draft'
                                                ? 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                                : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                                            }`}
                                    >
                                        {notice.status === 'Published' ? '게시됨' : notice.status === 'Draft' ? '작성중' : '보관됨'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {notice.date}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/notices/${notice.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(notice.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <DeleteAlertDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
