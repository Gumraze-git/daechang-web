'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Lock, Calendar, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

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
    return (
        <Card className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>

                {/* Info Container */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                    <h2 className="text-2xl font-bold">{admin.name || '관리자'}</h2>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Mail className="w-4 h-4" />
                            <span>{admin.email}</span>
                        </div>

                        <Link href="/admin/password-change" className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-medium">
                            비밀번호 변경 <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                        <Badge variant="outline" className="gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span className="uppercase">{admin.role}</span>
                        </Badge>
                        <Badge className={`${admin.must_change_password ? "bg-yellow-500" : "bg-green-500"} gap-1`}>
                            {admin.must_change_password ? '비밀번호 변경 필요' : '정상'}
                        </Badge>
                        <span className="text-sm text-gray-400 flex items-center gap-1 ml-2">
                            <Calendar className="w-3 h-3" />
                            {new Date(admin.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
