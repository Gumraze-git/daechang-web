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
import { Plus, MoreHorizontal, Search, Users, Trash2, Mail, Pencil, UserPlus } from 'lucide-react';
import DeleteAlertDialog from '@/components/admin/DeleteAlertDialog';

// Mock Data for Admins
const MOCK_ADMINS = [
    {
        id: '1',
        name: '최고 관리자',
        email: 'admin@daechang.com',
        role: '최고 관리자',
        status: 'Active',
        lastLogin: '2024-03-20 14:30',
    },
    {
        id: '2',
        name: '김철수',
        email: 'kimcs@daechang.com',
        role: '관리자',
        status: 'Active',
        lastLogin: '2024-03-19 09:15',
    },
    {
        id: '3',
        name: '이영희',
        email: 'leeyh@daechang.com',
        role: '편집자',
        status: 'Inactive',
        lastLogin: '2024-02-28 17:45',
    }
];

export default function AdminsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        alert('관리자 계정이 삭제되었습니다. (Mock)');
        setDeleteId(null);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">관리자 계정 관리</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">관리자 계정을 추가하고 권한을 관리합니다.</p>
                </div>
                <Link href="/admin/admins/new">
                    <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <UserPlus className="w-4 h-4" /> 계정 추가
                    </Button>
                </Link>
            </div>

            {/* Filters & Search */}
            <Card className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 py-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="이름 또는 이메일 검색..."
                        className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                    />
                </div>
            </Card>

            {/* Admins Table */}
            <Card className="overflow-hidden p-0 py-0 gap-0">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                        <TableRow>
                            <TableHead>이름</TableHead>
                            <TableHead>이메일</TableHead>
                            <TableHead>권한</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead className="hidden md:table-cell">마지막 접속</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_ADMINS.map((admin) => (
                            <TableRow key={admin.id} className="group">
                                <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                    {admin.name}
                                </TableCell>
                                <TableCell className="text-gray-500">
                                    {admin.email}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                        {admin.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={`font-medium border shadow-none ${admin.status === 'Active'
                                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                            }`}
                                    >
                                        {admin.status === 'Active' ? '활성' : '비활성'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-gray-500">
                                    {admin.lastLogin}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/admins/${admin.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(admin.id)}>
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
