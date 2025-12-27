import MobileGuard from '@/components/admin/MobileGuard';

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
