'use client';

import { useState, useEffect } from 'react';
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
import { Card } from '@/components/ui/card';
import { Search, Trash2, Pencil, UserPlus, Shield } from 'lucide-react';
import DeleteAlertDialog from '@/components/admin/DeleteAlertDialog';
import { getAdmins, deleteAdminUser } from '@/lib/actions/admin-auth';
import { getSystemSettings, togglePasswordExpiration, type SystemSettings } from '@/lib/actions/system';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function AdminsPage() {

    const [admins, setAdmins] = useState<any[]>([]);
    const [settings, setSettings] = useState<SystemSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchAdmins = async () => {
        setIsLoading(true);
        try {
            const [adminsData, settingsData] = await Promise.all([
                getAdmins(),
                getSystemSettings()
            ]);
            setAdmins(adminsData || []);
            setSettings(settingsData);
        } catch (error) {
            console.error('Failed to fetch admins:', error);
            toast({
                title: "Error",
                description: "관리자 목록을 불러오는데 실패했습니다.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const result = await deleteAdminUser(deleteId);
            if (result.success) {
                toast({
                    title: "Success",
                    description: "관리자 계정이 삭제되었습니다.",
                });
                fetchAdmins(); // Refresh list
            } else {
                toast({
                    title: "Error",
                    description: result.error || "삭제에 실패했습니다.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "삭제 중 오류가 발생했습니다.",
                variant: "destructive",
            });
        }
        setDeleteId(null);
    };

    const handleTogglePolicy = async (enabled: boolean) => {
        // Optimistic update
        setSettings(prev => prev ? { ...prev, password_expiration_enabled: enabled } : null);

        try {
            const result = await togglePasswordExpiration(enabled);
            if (result.success) {
                toast({
                    title: "Success",
                    description: `비밀번호 만료 정책이 ${enabled ? '활성화' : '비활성화'}되었습니다.`,
                });
            } else {
                throw new Error("Failed to update");
            }
        } catch (error) {
            // Revert
            setSettings(prev => prev ? { ...prev, password_expiration_enabled: !enabled } : null);
            toast({
                title: "Error",
                description: "설정 변경에 실패했습니다.",
                variant: "destructive",
            });
        }
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



            {/* Admins Table */}
            <Card className="overflow-hidden p-0 py-0 gap-0">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                        <TableRow>
                            <TableHead>이름</TableHead>
                            <TableHead>이메일</TableHead>
                            <TableHead>권한</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead className="hidden md:table-cell">가입일</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : admins.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                    등록된 관리자가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            admins.map((admin) => (
                                <TableRow key={admin.id} className="group">
                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                        {admin.name}
                                    </TableCell>
                                    <TableCell className="text-gray-500">
                                        {admin.email}
                                    </TableCell>
                                    <TableCell className="text-gray-900 dark:text-gray-100">
                                        {admin.role === 'super_admin' ? '최고 관리자' : '일반 관리자'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`font-medium border shadow-none ${!admin.must_change_password
                                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                                : 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                                                }`}
                                        >
                                            {!admin.must_change_password ? '정상' : '비밀번호 변경 필요'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-gray-500">
                                        {new Date(admin.created_at).toLocaleDateString()}
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
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            <DeleteAlertDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={confirmDelete}
            />

            {/* Admin Security Settings */}
            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-green-500" />
                        <h2 className="text-xl font-bold">관리자 보안 설정</h2>
                    </div>
                    <p className="text-gray-500 text-sm mb-6">계정 보호 및 보안 관련 정책을 설정합니다.</p>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">비밀번호 만료 정책 (90일)</Label>
                                <p className="text-sm text-gray-500">90일마다 비밀번호 변경을 강제합니다.</p>
                            </div>
                            <Switch
                                checked={settings?.password_expiration_enabled ?? false}
                                onCheckedChange={handleTogglePolicy}
                                disabled={!settings}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
