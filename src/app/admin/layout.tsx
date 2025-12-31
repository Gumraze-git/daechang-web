import type { Metadata } from 'next';
import MobileGuard from '@/components/admin/MobileGuard';

export const metadata: Metadata = {
    title: '대창기계산업 관리자',
    description: 'Daechang Admin Dashboard',
};

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MobileGuard>
            {children}
        </MobileGuard>
    );
}
