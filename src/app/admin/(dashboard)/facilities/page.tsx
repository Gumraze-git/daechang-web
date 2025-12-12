'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Plus, MoreHorizontal, Search, Settings, Filter, Trash2, PenTool, Pencil } from 'lucide-react';
import DeleteAlertDialog from '@/components/admin/DeleteAlertDialog';

// Mock Data for Facilities
const MOCK_FACILITIES = [
    {
        id: '1',
        name: '용접 로봇 시스템',
        name_en: 'Robotic Welding System',
        type: '용접',
        status: 'Active',
        specs: '6-Axis, 10kg Payload',
    },
    {
        id: '2',
        name: '3차원 측정기 (CMM)',
        name_en: 'Coordinate Measuring Machine',
        type: '검사',
        status: 'Active',
        specs: 'Accuracy 1.8µm',
    },
    {
        id: '3',
        name: 'CNC 밀링 머신',
        name_en: 'CNC Milling Machine',
        type: '가공',
        status: 'Maintenance',
        specs: '5-Axis, High Speed',
    },
    {
        id: '4',
        name: '대형 조립 라인',
        name_en: 'Large Assembly Line',
        type: '조립',
        status: 'Active',
        specs: 'Length 50m',
    }
];

export default function FacilitiesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        alert('설비가 삭제되었습니다. (Mock)');
        setDeleteId(null);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">설비 관리</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">보유하고 있는 주요 설비들의 목록을 관리합니다.</p>
                </div>
                <Link href="/admin/facilities/new">
                    <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4" /> 설비 등록
                    </Button>
                </Link>
            </div>

            {/* Filters & Search */}
            <Card className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 py-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="설비명 검색..."
                        className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="gap-2 w-full sm:w-auto">
                        <Filter className="w-4 h-4" />
                        필터
                    </Button>
                </div>
            </Card>

            {/* Facilities Table */}
            <Card className="overflow-hidden p-0 py-0 gap-0">
                <Table>
                    <TableHeader className="bg-gray-50/80 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800">
                        <TableRow className="border-gray-100 dark:border-gray-800">
                            <TableHead>설비명 (KO/EN)</TableHead>
                            <TableHead>유형</TableHead>
                            <TableHead>제원 (Specs)</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_FACILITIES.map((facility) => (
                            <TableRow key={facility.id} className="group border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <TableCell className="font-medium">
                                    <div>
                                        <p className="text-gray-900 dark:text-gray-100 font-semibold">{facility.name}</p>
                                        <p className="text-gray-500 text-xs">{facility.name_en}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                        {facility.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-gray-500 truncate max-w-[200px]">
                                    {facility.specs}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/facilities/${facility.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(facility.id)}>
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
