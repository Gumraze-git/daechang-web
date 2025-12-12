'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { Card, CardContent } from '@/components/ui/card';
import { Plus, MoreHorizontal, Search, Package, Filter, Trash2, Pencil } from 'lucide-react';
import DeleteAlertDialog from '@/components/admin/DeleteAlertDialog';

// Mock Data for Products
const MOCK_PRODUCTS = [
    {
        id: '1',
        name: 'DA series',
        name_ko: 'DA 시리즈',
        category: '브로우 성형기',
        status: 'Active',
        image: '/images/products/da-series.jpg', // Placeholder
    },
    {
        id: '2',
        name: 'XN series',
        name_ko: 'XN 시리즈',
        category: '브로우 성형기',
        status: 'Active',
        image: '/images/products/xn-series.jpg',
    },
    {
        id: '3',
        name: 'PVC Extrusion Line',
        name_ko: 'PVC 압출 라인',
        category: '압출기',
        status: 'Draft',
        image: '/images/products/pvc-line.jpg',
    },
    {
        id: '4',
        name: 'Winder',
        name_ko: '와인더',
        category: '주변 기기',
        status: 'Hidden',
        image: '/images/products/winder.jpg',
    }
];

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        alert('제품이 삭제되었습니다. (Mock)');
        setDeleteId(null);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">제품 관리</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">등록된 제품 목록을 조회하고 관리합니다.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4" /> 제품 추가
                    </Button>
                </Link>
            </div>

            {/* Filters & Search */}
            <Card className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 py-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="제품명 검색..."
                        className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </Card>

            {/* Products Table */}
            <Card className="overflow-hidden p-0 py-0 gap-0">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                        <TableRow>
                            <TableHead className="w-[80px]">이미지</TableHead>
                            <TableHead>제품명 (KO/EN)</TableHead>
                            <TableHead>카테고리</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_PRODUCTS.map((product) => (
                            <TableRow key={product.id} className="group">
                                <TableCell>
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                                        {/* Placeholder Image using Package icon if no image */}
                                        <Package className="w-6 h-6 text-gray-400" />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div>
                                        <p className="text-gray-900 dark:text-gray-100 font-semibold">{product.name_ko}</p>
                                        <p className="text-gray-500 text-xs">{product.name}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-normal">
                                        {product.category}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={`font-medium border shadow-none ${product.status === 'Active'
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : product.status === 'Draft'
                                                ? 'bg-gray-100 text-gray-700 border-gray-200'
                                                : 'bg-red-50 text-red-700 border-red-200'
                                            }`}
                                    >
                                        {product.status === 'Active' ? '판매중' : product.status === 'Draft' ? '초안' : '숨김'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/products/${product.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(product.id)}>
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
