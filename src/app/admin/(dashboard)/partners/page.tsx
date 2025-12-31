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
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { getPartners, deletePartner } from '@/lib/actions/partners';
import PartnerDeleteButton from '@/components/admin/PartnerDeleteButton';

export default async function PartnersPage() {
    const partners = await getPartners();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">협력사 관리</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">등록된 협력사 및 관련 회사 목록을 관리합니다.</p>
                </div>
                <Link href="/admin/partners/new">
                    <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4" /> 협력사 추가
                    </Button>
                </Link>
            </div>

            {/* Partners Table */}
            <Card className="overflow-hidden p-0 py-0 gap-0">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                        <TableRow>
                            <TableHead className="w-[80px]">로고</TableHead>
                            <TableHead>회사명 (국문/영문)</TableHead>
                            <TableHead>구분</TableHead>
                            <TableHead>웹사이트</TableHead>
                            <TableHead className="w-[100px] text-right">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {partners.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                    등록된 협력사가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            partners.map((partner) => (
                                <TableRow key={partner.id} className="group">
                                    <TableCell>
                                        <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden">
                                            {partner.logo_url ? (
                                                <Image
                                                    src={partner.logo_url}
                                                    alt={partner.name_ko}
                                                    width={48}
                                                    height={48}
                                                    className="object-contain w-full h-full p-1"
                                                />
                                            ) : (
                                                <span className="text-gray-300 text-xs">No Img</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div>
                                            <p className="text-gray-900 dark:text-gray-100 font-semibold">{partner.name_ko}</p>
                                            {partner.name_en && (
                                                <p className="text-gray-500 text-xs">{partner.name_en}</p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-normal capitalize">
                                            {partner.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {partner.website_url ? (
                                            <a
                                                href={partner.website_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                            >
                                                Visit <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <PartnerDeleteButton id={partner.id} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
