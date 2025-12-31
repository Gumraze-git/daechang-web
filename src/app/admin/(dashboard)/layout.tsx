import Link from 'next/link';
import Image from 'next/image';
import { FileText, Settings, LogOut, Menu, LayoutTemplate, Package, Users, Wrench, Calendar, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions/auth';
import AdminSidebar from '@/components/admin/Sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#fdfdfd] dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
            {/* Sidebar */}
            <AdminSidebar />

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
