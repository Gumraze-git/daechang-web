'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import nodemailer from 'nodemailer';

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Login Error:', error);
        return { error: error.message }; // Return actual error for debugging
    }

    redirect('/admin');
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/admin/login');
}

function generateRandomPassword() {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

export async function requestPasswordReset(formData: FormData) {
    const email = formData.get('email') as string;

    if (!email) {
        return { success: false, error: '이메일을 입력해주세요.' };
    }

    const supabaseAdmin = createAdminClient();

    // 1. Check if user exists first (optional, but good for UX/Security balance)
    const { data: { users }, error: findError } = await supabaseAdmin.auth.admin.listUsers();

    if (findError) {
        console.error('List Users Error:', findError);
        // Fallback or return generic error
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        // Security: Don't reveal user existence? Or friendly?
        // Let's pretend success to avoid enumeration, or return error if strictly internal.
        // Given it's admin, returning specific error is usually acceptable for usability.
        return { success: false, error: '등록된 관리자 이메일이 아닙니다.' };
    }

    // 2. Generate Temporary Password & Update User
    const tempPassword = generateRandomPassword();

    // supabaseAdmin.auth.admin.updateUserById is the correct method
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: tempPassword }
    );

    if (updateError) {
        console.error('Update User Error:', updateError);
        return { success: false, error: '비밀번호 재설정 중 오류가 발생했습니다.' };
    }

    // 3. Mark as must_change_password
    const { error: dbError } = await supabaseAdmin
        .from('admins')
        .update({ must_change_password: true })
        .eq('id', user.id);

    if (dbError) {
        console.error('Update Admin DB Error:', dbError);
        // Continue anyway, as password is changed. Worst case they just don't get prompted immediately.
    }

    // 4. Send Email using Nodemailer
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.MAIL_ADMIN_FROM || process.env.MAIL_FROM,
            to: email,
            subject: '[대창기계산업] 관리자 임시 비밀번호 발급',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #1f2937; font-size: 24px; font-weight: bold;">임시 비밀번호 발급</h2>
                    </div>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
                        안녕하세요, 대창기계산업 관리자님.<br>
                        비밀번호 재설정 요청에 따라 <strong>임시 비밀번호</strong>가 발급되었습니다.
                    </p>
                    <div style="text-align: center; margin: 30px 0; background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
                        <p style="margin: 0; color: #6b7280; font-size: 14px; margin-bottom: 8px;">임시 비밀번호</p>
                        <p style="margin: 0; color: #111827; font-size: 24px; font-weight: bold; letter-spacing: 2px; font-family: monospace;">${tempPassword}</p>
                    </div>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
                        위 비밀번호로 로그인하시면<br>
                        <strong>자동으로 비밀번호 변경 페이지로 이동</strong>합니다.<br>
                        로그인 후 안전한 새 비밀번호로 변경해 주세요.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/login" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">관리자 로그인 바로가기</a>
                    </div>
                    <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                        본인이 요청하지 않은 경우 관리자에게 문의해주세요.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true };

    } catch (mailError: unknown) {
        console.error('Mail Send Error:', mailError);
        const errorMessage = mailError instanceof Error ? mailError.message : String(mailError);
        return { success: false, error: '이메일 발송에 실패했습니다: ' + errorMessage };
    }
}
