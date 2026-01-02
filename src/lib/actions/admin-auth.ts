'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * 랜덤 비밀번호 생성 (영문 대소문자 + 숫자 + 특수문자 조합, 12자리)
 */
import { randomBytes } from 'crypto';

/**
 * 랜덤 비밀번호 생성 (영문 대소문자 + 숫자 + 특수문자 조합, 12자리)
 * Crypto API를 사용하여 보안성 강화
 */
function generateRandomPassword() {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let retVal = "";
    const randomValues = randomBytes(length);

    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(randomValues[i] % n);
    }
    return retVal;
}

interface CreateAdminUserParams {
    email: string;
    name: string;
    role: string;
}

/**
 * 관리자 계정 생성 (최고 관리자 전용)
 * 1. 랜덤 비밀번호 생성
 * 2. Supabase Auth 유저 생성 (이메일 인증 자동 완료)
 * 3. public.admins 테이블에 정보 저장 (must_change_password = true)
 * 4. 임시 비밀번호 반환 (화면 표시 또는 로그용)
 */
export async function createAdminUser({ email, name, role }: CreateAdminUserParams) {
    const supabaseAdmin = createAdminClient();
    const password = generateRandomPassword();

    // 1. Auth 유저 생성
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // 이메일 자동 승인
        user_metadata: { name }
    });

    if (authError) {
        console.error('Error creating auth user:', authError);
        return { success: false, error: authError.message };
    }

    const userId = authData.user.id;

    // 2. admins 테이블에 정보 저장
    const { error: dbError } = await supabaseAdmin
        .from('admins')
        .insert({
            id: userId,
            email,
            name,
            role,
            must_change_password: true // 최초 로그인 시 비밀번호 변경 강제
        });

    if (dbError) {
        // DB 저장 실패 시 Auth 유저도 삭제 (Rollback 유사 처리)
        await supabaseAdmin.auth.admin.deleteUser(userId);
        console.error('Error creating admin record:', dbError);
        return { success: false, error: dbError.message };
    }

    console.log(`[Admin Created] Email: ${email}, Temp Password: ${password}`);

    // Send Invitation Email
    try {
        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/login`;

        const mailOptions = {
            from: process.env.MAIL_ADMIN_FROM,
            to: email, // Send to the new admin
            subject: `[대창기계산업] 관리자 계정이 생성되었습니다.`,
            text: `
        안녕하세요, ${name}님.
        
        대창기계산업 홈페이지(My Daechang) 관리자 계정이 생성되었습니다.
        아래 정보를 사용하여 로그인 후, 반드시 비밀번호를 변경해 주시기 바랍니다.
        
        [로그인 정보]
        아이디: ${email}
        임시 비밀번호: ${password}
        
        로그인 페이지: ${loginUrl}
        
        감사합니다.
            `,
            html: `
        <div style="font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #003366; color: #fff; padding: 20px; text-align: center;">
                <h2 style="margin: 0; font-size: 20px;">관리자 계정 생성 안내</h2>
            </div>
            
            <div style="padding: 30px;">
                <p style="margin-bottom: 20px; color: #333;">
                    안녕하세요, <strong>${name}</strong>님.<br><br>
                    대창기계산업 홈페이지(My Daechang) 관리자 계정이 생성되었습니다.<br>
                    아래 임시 비밀번호로 로그인하신 후, 보안을 위해 <strong>반드시 비밀번호를 변경</strong>해 주시기 바랍니다.
                </p>
                
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e0e0e0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #666; width: 100px; font-weight: bold;">아이디</td>
                            <td style="padding: 8px 0; color: #333;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666; font-weight: bold;">임시 비밀번호</td>
                            <td style="padding: 8px 0; color: #d32f2f; font-weight: bold;">${password}</td>
                        </tr>
                    </table>
                </div>

                <div style="text-align: center;">
                    <a href="${loginUrl}" style="display: inline-block; background-color: #003366; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">관리자 로그인하러 가기</a>
                </div>
            </div>
            
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                <p style="margin: 0;">본 메일은 발신 전용이며, 회신되지 않습니다.</p>
            </div>
        </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Invitation email sent:', info.response);

    } catch (emailError) {
        // 이메일 발송 실패해도 계정 생성을 무효화하지는 않음 (관리자가 temp PW를 직접 알려줄 수 있으므로)
        console.error('Failed to send invitation email:', emailError);
    }

    revalidatePath('/admin/admins');

    return { success: true, tempPassword: password };
}

/**
 * 관리자 정보 수정 (Admin 테이블만 수정)
 */
export async function updateAdminUser(id: string, data: { name?: string; role?: string }) {
    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin
        .from('admins')
        .update(data)
        .eq('id', id);

    if (error) {
        console.error('Error updating admin:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/admins');
    return { success: true };
}

/**
 * 관리자 계정 삭제
 */
export async function deleteAdminUser(id: string) {
    const supabaseAdmin = createAdminClient();

    // 1. Auth 유저 삭제 (Cascade 설정이 되어 있다면 admins 테이블도 자동 삭제될 수 있음)
    // 하지만 안전하게 Auth 삭제 -> DB 삭제 순서로 진행하거나, Auth 삭제만으로 충분할 수 있음 (Supabase 설정에 따라 다름)
    // 여기서는 Auth 유저를 삭제합니다.
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
        console.error('Error deleting user:', error);
        return { success: false, error: error.message };
    }

    // admins 테이블에서 삭제 (만약 Cascade가 아니라면 명시적 삭제 필요)
    const { error: dbError } = await supabaseAdmin
        .from('admins')
        .delete()
        .eq('id', id);

    if (dbError) {
        console.warn('Error deleting admin record (might be already deleted by cascade):', dbError);
    }

    revalidatePath('/admin/admins');
    return { success: true };
}

/**
 * 비밀번호 변경 (사용자 본인)
 */
export async function changePassword(newPassword: string) {
    const supabase = await createClient();

    // 1. 비밀번호 업데이트
    const { data: { user }, error: authError } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (authError || !user) {
        console.error('Error changing password:', authError);
        return { success: false, error: authError?.message || 'User not found' };
    }

    // 2. must_change_password 플래그 해제 (Admin 권한 필요)
    // 일반 사용자는 admins 테이블 update 권한이 없을 수 있으므로 Service Role 사용
    const supabaseAdmin = createAdminClient();
    const { error: dbError } = await supabaseAdmin
        .from('admins')
        .update({
            must_change_password: false,
            password_changed_at: new Date().toISOString()
        })
        .eq('id', user.id);

    if (dbError) {
        console.error('Error updating status:', dbError);
        return { success: false, error: dbError.message };
    }

    return { success: true };
}

export async function getAdmins() {
    const supabase = await createClient(); // 일반 클라이언트로 조회 (RLS 적용)

    const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching admins:', error);
        return [];
    }

    return data;
}

export async function getAdminById(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching admin:', error);
        return null;
    }

    return data;
}
