import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit } from 'lucide-react';
import { getProducts, deleteProduct } from '@/lib/actions/products';

import CategoryManager from '@/components/admin/CategoryManager';
import { getCategories } from '@/lib/actions/categories';

export default async function ProductsPage() {
    const products = await getProducts();
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">제품 관리</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">등록된 제품 목록을 관리합니다.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4" /> 제품 등록
                    </Button>
                </Link>
            </div>

            {/* Products Table */}
            <Card className="overflow-hidden p-0 py-0 gap-0">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                        <TableRow>
                            <TableHead className="w-[80px]">이미지</TableHead>
                            <TableHead>제품명 (국문/영문)</TableHead>
                            <TableHead>카테고리</TableHead>
                            <TableHead>협력사</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead className="w-[100px] text-right">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                                    등록된 제품이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id} className="group">
                                    <TableCell>
                                        <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden">
                                            {product.images && product.images.length > 0 ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name_ko}
                                                    width={48}
                                                    height={48}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <span className="text-gray-300 text-xs">No Img</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div>
                                            <p className="text-gray-900 dark:text-gray-100 font-semibold">{product.name_ko}</p>
                                            <p className="text-gray-500 text-xs">{product.name_en}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal capitalize">
                                            {product.category_code}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {product.partners && product.partners.length > 0 ? (
                                                product.partners.map((partner: any) => (
                                                    <span key={partner.id} className="text-sm text-blue-600 after:content-[','] last:after:content-[''] mr-1">
                                                        {partner.name_ko}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-xs">-</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`
                                            ${product.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}
                                            ${product.status === 'draft' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : ''}
                                            ${product.status === 'hidden' ? 'bg-red-100 text-red-700 hover:bg-red-200' : ''}
                                        `}>
                                            {product.status === 'active' ? '공개' : product.status === 'draft' ? '비공개' : '숨김'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Edit Link (Not implemented fully yet, but link exists) */}
                                            <Link href={`/admin/products/${product.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>

                                            <form action={deleteProduct.bind(null, product.id)}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                    type="submit"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Category Management Section */}
            <CategoryManager categories={categories} />
        </div>
    );
}
