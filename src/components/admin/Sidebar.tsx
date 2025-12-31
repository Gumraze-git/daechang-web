import Link from 'next/link';
import Image from 'next/image';
import { FileText, Settings, LogOut, LayoutTemplate, Package, Users, Wrench, Calendar, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions/auth';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function AdminSidebar() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    // Start logic for setting cookies
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Fetch role
    let role = 'admin';
    if (user) {
        const { data: admin } = await supabase
            .from('admins')
            .select('role')
            .eq('id', user.id)
            .single();
        if (admin) role = admin.role;
    }

    const isSuperAdmin = role === 'super_admin';
    const isAtLeastAdmin = role === 'admin' || role === 'super_admin';
    const isEditor = role === 'editor' || isAtLeastAdmin; // Editor is subset of Admin access? No, Editor is separate but Admin includes Editor capability usually or distinct?
    // Based on implementation plan:
    // SuperAdmin: All
    // Admin: Content (Products, Facilities, History, Partners, Company) - NO Admins
    // Editor: Notices ONLY.

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col fixed inset-y-0">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <Image src="/logo_small.png" alt="Daechang Logo" width={160} height={40} className="h-8 w-auto" unoptimized />
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {/* 1. Editor & Above Access */}
                <Link href="/admin/home" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors font-medium">
                    <LayoutTemplate className="w-5 h-5" />
                    홈 화면 관리
                </Link>

                <Link href="/admin/notices" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors font-medium">
                    <FileText className="w-5 h-5" />
                    공지사항 관리
                </Link>

                {/* 2. Admin & Super Admin Access Only */}
                {isAtLeastAdmin && (
                    <>
                        <Link href="/admin/company" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors font-medium">
                            <Building2 className="w-5 h-5" />
                            기업 관리
                        </Link>
                        <Link href="/admin/history" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors font-medium">
                            <Calendar className="w-5 h-5" />
                            연혁 관리
                        </Link>
                        <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors font-medium">
                            <Package className="w-5 h-5" />
                            제품 관리
                        </Link>
                        <Link href="/admin/facilities" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors font-medium">
                            <Wrench className="w-5 h-5" />
                            설비 관리
                        </Link>
                        <Link href="/admin/partners" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors font-medium">
                            <Users className="w-5 h-5" />
                            협력사 관리
                        </Link>
                    </>
                )}

                {/* 3. Super Admin Only */}
                {isSuperAdmin && (
                    <Link href="/admin/admins" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors font-medium">
                        <Users className="w-5 h-5" />
                        관리자 계정 관리
                    </Link>
                )}

                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors font-medium">
                        <Settings className="w-5 h-5" />
                        설정
                    </Link>
                </div>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <form action={logout} className="w-full">
                    <Button variant="ghost" className="w-full flex items-center justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                        <LogOut className="w-4 h-4" />
                        로그아웃
                    </Button>
                </form>
            </div>
        </aside>
    );
}
