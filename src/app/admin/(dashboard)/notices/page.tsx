import Link from 'next/link';
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
import { Plus, Trash2, Pencil, Calendar } from 'lucide-react';
import { getNotices, deleteNotice } from '@/lib/actions/notices';
import NoticeDeleteButton from '@/components/admin/NoticeDeleteButton';

export default async function NoticesPage() {
    const notices = await getNotices();

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

            {/* Notices Table */}
            <Card className="overflow-hidden p-0 py-0 gap-0">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                        <TableRow>
                            <TableHead className="w-[400px]">제목</TableHead>
                            <TableHead>카테고리</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead className="hidden md:table-cell">날짜</TableHead>
                            <TableHead className="w-[100px] text-right">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {notices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                    등록된 공지사항이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            notices.map((notice) => (
                                <TableRow key={notice.id} className="group">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {notice.is_pinned && (
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">고정</Badge>
                                            )}
                                            <span className="group-hover:text-blue-600 transition-colors">
                                                {notice.title_ko}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal capitalize">
                                            {notice.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`font-medium border shadow-none ${notice.status === 'published'
                                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                                : notice.status === 'draft'
                                                    ? 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                                                }`}
                                        >
                                            {notice.status === 'published' ? '게시됨' : notice.status === 'draft' ? '작성중' : '보관됨'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {new Date(notice.published_at).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/notices/${notice.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>

                                            <NoticeDeleteButton id={notice.id} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card >
        </div >
    );
}
