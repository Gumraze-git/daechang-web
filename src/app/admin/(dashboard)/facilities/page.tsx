import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Plus, Search, Filter, Pencil, Save } from 'lucide-react';
import { getFacilities } from '@/lib/actions/facilities';
import FacilityDeleteButton from '@/components/admin/FacilityDeleteButton';

export default async function FacilitiesPage() {
    const facilities = await getFacilities();

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

            {/* Facilities Table */}
            <Card className="overflow-hidden p-0 py-0 gap-0">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="설비명 검색..."
                            className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button variant="outline" className="gap-2 w-full sm:w-auto">
                            <Filter className="w-4 h-4" />
                            필터
                        </Button>
                    </div>
                </div>
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
                        {facilities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                                    등록된 설비가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            facilities.map((facility) => (
                                <TableRow key={facility.id} className="group border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <TableCell className="font-medium">
                                        <div>
                                            <p className="text-gray-900 dark:text-gray-100 font-semibold">{facility.name_ko}</p>
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
                                            <FacilityDeleteButton id={facility.id} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Statistics Management - Placeholder for visuals */}
            <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold">시설 통계 관리</h2>
                        <p className="text-gray-500 text-sm mt-1">시설 페이지 상단에 표시되는 주요 통계 수치를 관리합니다.</p>
                    </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="stat_production">연간 생산량 (Annual Production)</Label>
                        <Input id="stat_production" defaultValue="5M+ Units" placeholder="예: 5M+ Units" />
                        <p className="text-xs text-gray-400">메인 통계: 생산 능력</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stat_equipment">보유 설비 (Equipment)</Label>
                        <Input id="stat_equipment" defaultValue="50+" placeholder="예: 50+" />
                        <p className="text-xs text-gray-400">메인 통계: 설비 수</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stat_area">공장 면적 (Factory Area)</Label>
                        <Input id="stat_area" defaultValue="3,300 m²" placeholder="예: 3,300 m²" />
                        <p className="text-xs text-gray-400">메인 통계: 전체 면적</p>
                    </div>
                </div>
                <div className="px-6 pb-6 flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <Save className="w-4 h-4" />
                        통계 저장
                    </Button>
                </div>
            </Card>
        </div>
    );
}
