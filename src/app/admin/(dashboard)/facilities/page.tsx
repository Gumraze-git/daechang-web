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
import { getCompanySettings } from '@/lib/actions/company';
import FacilityDeleteButton from '@/components/admin/FacilityDeleteButton';
import FactoryImagesManager from '@/components/admin/FactoryImagesManager';

export default async function FacilitiesPage() {
    const facilities = await getFacilities();
    const settings = await getCompanySettings();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">설비 관리</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">보유하고 있는 주요 설비들의 목록을 관리합니다.</p>
                </div>
                {facilities.length < 4 ? (
                    <Link href="/admin/facilities/new">
                        <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="w-4 h-4" /> 설비 등록
                        </Button>
                    </Link>
                ) : (
                    <Button disabled className="w-full sm:w-auto gap-2 bg-gray-300 text-gray-500 cursor-not-allowed">
                        <Plus className="w-4 h-4" /> 등록 제한 (최대 4개)
                    </Button>
                )}
            </div>

            {/* Facilities Table */}
            <Card className="overflow-hidden p-0 py-0 gap-0">
                <Table>
                    <TableHeader className="bg-gray-50/80 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800">
                        <TableRow className="border-gray-100 dark:border-gray-800">
                            <TableHead>설비명</TableHead>
                            <TableHead>유형</TableHead>
                            <TableHead>모델명</TableHead>
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
                            facilities.map((facility) => {
                                let modelName = '-';
                                try {
                                    if (facility.specs) {
                                        const parsed = JSON.parse(facility.specs);
                                        modelName = parsed.modelName || '-';
                                    }
                                } catch (e) {
                                    // Fallback for non-JSON specs or error
                                    modelName = facility.specs || '-';
                                }

                                return (
                                    <TableRow key={facility.id} className="group border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <TableCell className="font-medium">
                                            <div>
                                                <p className="text-gray-900 dark:text-gray-100 font-semibold">{facility.name_ko}</p>
                                                <p className="text-gray-500 text-xs">{facility.name_en}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                {facility.type}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-gray-500 truncate max-w-[200px]">
                                            {modelName}
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
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Factory Images Manager */}
            <FactoryImagesManager initialImages={settings?.factory_images || []} />


        </div >
    );
}
