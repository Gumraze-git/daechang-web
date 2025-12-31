import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/admin/ProfileForm';

export default async function SettingsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/admin/login');
    }

    const { data: admin, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error || !admin) {
        // Handle case where auth user exists but admin record doesn't (shouldn't happen)
        return <div className="p-8">관리자 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold">내 정보 설정</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    내 프로필 정보를 확인하고 비밀번호를 변경할 수 있습니다.
                </p>
            </div>

            <ProfileForm admin={admin} />
        </div>
    );
}
