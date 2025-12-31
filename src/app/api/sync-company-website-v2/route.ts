
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();

    // Data scraped from http://daechang100.com/introduce/overview.html and external sources
    const payload = {
        company_name_ko: '대창기계산업(주)',
        company_name_en: 'DAECHANG MACHINERY Co., Ltd.',
        ceo_name_ko: '김주훈',
        ceo_name_en: 'Ju-Hoon Kim',
        establishment_ko: '2004년 03월 03일',
        establishment_en: 'March 3, 2004',
        employees_ko: '16명 (2024년 기준)',
        employees_en: '16 (as of 2024)',
        revenue_ko: '약 49억 4,151만원 (2024년 기준)',
        revenue_en: 'Approx. 4.9 Billion KRW (as of 2024)',
        address_ko: '경기도 화성시 양감면 토성로 553',
        address_en: '553, Toseong-ro, Yanggam-myeon, Hwaseong-si, Gyeonggi-do, Korea',
        updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase.from('company_settings').select('id').limit(1).single();

    let error;
    if (existing) {
        const { error: updateError } = await supabase
            .from('company_settings')
            .update(payload)
            .eq('id', existing.id);
        error = updateError;
    } else {
        const { error: insertError } = await supabase
            .from('company_settings')
            .insert(payload);
        error = insertError;
    }

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: payload });
}
