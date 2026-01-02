'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';

const inquirySchema = z.object({
    company_name: z.string().optional(),
    person_name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    inquiry_type: z.string().min(1, 'Inquiry type is required'),
    product_category: z.string().optional(),
    message: z.string().min(1, 'Message is required'),
});

export async function createInquiry(formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        company_name: formData.get('company_name')?.toString() || undefined,
        person_name: formData.get('person_name')?.toString() || undefined,
        email: formData.get('email')?.toString() || undefined,
        phone: formData.get('phone')?.toString() || undefined,
        inquiry_type: formData.get('inquiry_type')?.toString() || undefined,
        product_category: formData.get('product_category')?.toString() || undefined,
        message: formData.get('message')?.toString() || undefined,
    };

    // Rate Limit: 3 attempts per hour (3600s)
    const rateLimit = await checkRateLimit('inquiry', 3, 3600);
    if (!rateLimit.success) {
        return {
            success: false,
            message: '문의가 너무 많이 접수되었습니다. 잠시 후 다시 시도해주세요.'
        };
    }

    // Validation
    const validatedFields = inquirySchema.safeParse(rawData);

    if (!validatedFields.success) {
        const fieldErrors = validatedFields.error.flatten().fieldErrors;
        const errorMessages = Object.entries(fieldErrors)
            .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
            .join(' | ');

        return {
            success: false,
            error: fieldErrors,
            message: `Validation failed: ${errorMessages}`
        };
    }

    // Insert into DB
    const { error } = await supabase
        .from('inquiries')
        .insert(validatedFields.data);

    if (error) {
        console.error('Error creating inquiry:', error);
        return {
            success: false,
            message: `DB Error: ${error.message}`
        };
    }

    // Send Email
    try {
        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false // Optional: depending on server strictness
            }
        });
        // Fetch category name if exists
        let categoryName = rawData.product_category || '-';
        if (rawData.product_category) {
            const { data: categoryData } = await supabase
                .from('product_categories')
                .select('name_ko')
                .eq('code', rawData.product_category)
                .single();
            if (categoryData?.name_ko) {
                categoryName = categoryData.name_ko;
            }
        }

        // Content for the email
        const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

        const typeMapping: Record<string, string> = {
            'general': '일반 문의',
            'product': '제품 문의',
            'tech': '기술 지원 문의',
            'quote': '견적 요청 문의',
            'quotation': '견적 요청 문의',
            'other': '기타 문의'
        };
        const typeLabel = typeMapping[rawData.inquiry_type || ''] || rawData.inquiry_type;

        const identifier = rawData.company_name || rawData.person_name;
        // If category is valid and not a dash, include it
        const productPart = (categoryName && categoryName !== '-') ? `, ${categoryName}` : '';

        const subjectTitle = `[${typeLabel}] ${identifier}${productPart} 문의의 건`;

        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: process.env.MAIL_TO,
            subject: subjectTitle,
            text: `
        새로운 문의가 접수되었습니다
        
        발송 일시: ${now}

        회사명: ${rawData.company_name || '-'}
        담당자: ${rawData.person_name}
        이메일: ${rawData.email}
        연락처: ${rawData.phone}
        
        문의 유형: ${typeLabel}
        관심 제품: ${categoryName}
        
        문의 내용:
        ${rawData.message}
      `,
            html: `
        <div style="font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1a1a1a; color: #fff; padding: 20px; text-align: center;">
                <h2 style="margin: 0; font-size: 20px;">새로운 문의가 접수되었습니다</h2>
                <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.8;">${now}</p>
            </div>
            
            <div style="padding: 30px;">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; width: 120px; color: #666; font-weight: bold;">회사명</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${rawData.company_name || '-'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; font-weight: bold;">담당자</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${rawData.person_name}</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; font-weight: bold;">이메일</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${rawData.email}" style="color: #0066cc; text-decoration: none;">${rawData.email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; font-weight: bold;">연락처</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${rawData.phone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; font-weight: bold;">문의 유형</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><span style="background-color: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-size: 14px;">${typeLabel}</span></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; font-weight: bold;">관심 제품</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${categoryName}</td>
                    </tr>
                </table>

                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                    <h3 style="margin: 0 0 15px; font-size: 16px; color: #333;">문의 내용</h3>
                    <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; color: #555;">${rawData.message}</p>
                </div>
            </div>
            
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                <p style="margin: 0;">본 메일은 대창기계산업 홈페이지 고객지원 양식을 통해 발송되었습니다.</p>
            </div>
        </div>
      `
        };

        console.log('Attempting to send email with host:', process.env.MAIL_HOST);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);

    } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // We don't fail the whole request if email fails, because DB insert succeeded.
        // Ideally we should alert admin or retry, but for now we just log it.
    }

    return {
        success: true,
        message: 'Inquiry submitted successfully'
    };
}
