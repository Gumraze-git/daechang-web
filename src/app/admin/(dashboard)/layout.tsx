import Link from 'next/link';
import Image from 'next/image';
import { FileText, Settings, LogOut, Menu, LayoutTemplate, Package, Users, Wrench, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions/auth';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#fdfdfd] dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col fixed inset-y-0">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <Image src="/logo_small.png" alt="Daechang Logo" width={160} height={40} className="h-8 w-auto" unoptimized />
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/admin/home" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors font-medium">
                        <LayoutTemplate className="w-5 h-5" />
                        홈 화면 관리
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
                    <Link href="/admin/notices" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors font-medium">
                        <FileText className="w-5 h-5" />
                        공지사항 관리
                    </Link>
                    <Link href="/admin/admins" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors font-medium">
                        <Users className="w-5 h-5" />
                        관리자 계정 관리
                    </Link>
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

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">D</div>
                    <span className="text-lg font-bold">관리자</span>
                </div>
                <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                </Button>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10">
                {children}
            </main>
        </div>
    );
}
