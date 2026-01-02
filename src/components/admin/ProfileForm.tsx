'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface ProfileFormProps {
    admin: {
        id: string;
        email: string;
        name?: string;
        role: string;
        created_at: string;
        must_change_password?: boolean;
    };
}

export default function ProfileForm({ admin }: ProfileFormProps) {
    // Helper to format role text
    const getRoleText = (role: string) => {
        if (role === 'super_admin') return '최고 관리자';
        if (role === 'admin') return '일반 관리자';
        return role;
    };

    return (
        <Card className="p-8 border-gray-100 shadow-sm">
            <div className="space-y-8">
                {/* Header Section */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{admin.name || '관리자'}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        가입일: {new Date(admin.created_at).toLocaleDateString()}
                    </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">이메일</label>
                        <p className="text-base text-gray-900 font-medium">{admin.email}</p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">계정 권한</label>
                        <div className="flex items-center gap-2">
                            <p className="text-base text-gray-900 font-medium">{getRoleText(admin.role)}</p>
                            {admin.role === 'super_admin' && (
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Master</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div>
                        <span className={`text-sm ${admin.must_change_password ? 'text-red-500 font-medium' : 'text-green-600'}`}>
                            {admin.must_change_password ? '비밀번호 변경이 필요합니다.' : '계정 상태 정상'}
                        </span>
                    </div>
                    <Link
                        href="/admin/password-change"
                        className="text-sm font-medium text-gray-600 hover:text-black hover:underline transition-colors"
                    >
                        비밀번호 변경하기 &rarr;
                    </Link>
                </div>
            </div>
        </Card>
    );
}
