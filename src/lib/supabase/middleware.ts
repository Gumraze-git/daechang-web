import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 중요: createServerClient와 supabase.auth.getUser() 사이에 어떠한 로직도 작성하지 마세요.
    // 단순한 실수가 사용자의 로그아웃을 유발하는 등 디버깅하기 어려운 문제를 야기할 수 있습니다.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (
        !user &&
        request.nextUrl.pathname.startsWith('/admin') &&
        !request.nextUrl.pathname.startsWith('/admin/login')
    ) {
        // 사용자가 없는 경우, 로그인 페이지로 리다이렉트합니다.
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
    }

    // Role & Password Check Logic
    if (user && request.nextUrl.pathname.startsWith('/admin')) {
        const [{ data: admin }, { data: settings }] = await Promise.all([
            supabase
                .from('admins')
                .select('role, must_change_password, password_changed_at')
                .eq('id', user.id)
                .single(),
            supabase
                .from('system_settings')
                .select('*')
                .single()
        ])

        const path = request.nextUrl.pathname
        const role = admin?.role || 'admin'
        const isPasswordChangePage = path === '/admin/password-change'

        // 1. Force Password Change (Priority)
        // Case A: Explicit 'must_change_password' flag
        if (admin?.must_change_password && !isPasswordChangePage) {
            const url = request.nextUrl.clone()
            url.pathname = '/admin/password-change'
            return NextResponse.redirect(url)
        }

        // Case B: Password Expiration
        if (settings?.password_expiration_enabled && admin?.password_changed_at && !isPasswordChangePage) {
            const lastChanged = new Date(admin.password_changed_at).getTime()
            const now = new Date().getTime()
            const daysSinceChange = (now - lastChanged) / (1000 * 60 * 60 * 24)

            if (daysSinceChange >= settings.password_expiration_days) {
                const url = request.nextUrl.clone()
                url.pathname = '/admin/password-change'
                // Optional: Add query param to indicate reason, e.g. ?reason=expired
                return NextResponse.redirect(url)
            }
        }

        // 2. RBAC Route Protection
        // Only Super Admin can access Admin Management
        if (path.startsWith('/admin/admins') && role !== 'super_admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/admin/home'
            return NextResponse.redirect(url)
        }

        // Editor can ONLY access Notices (and core pages like home/password/profile)
        // If role is editor, block access to products, facilities, history, partners
        if (role === 'editor') {
            const restrictedPaths = [
                '/admin/products',
                '/admin/facilities',
                '/admin/history',
                '/admin/partners',
                '/admin/company' // Company settings might be restricted too? Let's say yes for editor.
            ]
            if (restrictedPaths.some(p => path.startsWith(p))) {
                const url = request.nextUrl.clone()
                url.pathname = '/admin/home'
                return NextResponse.redirect(url)
            }
        }

        // Admin (standard) cannot access Admin Management (handled by first check)
        // Admin has access to products/facilities etc. so no extra block needed for them specifically.
    }

    // 중요: supabaseResponse 객체는 반드시 그대로 반환해야 합니다.
    // 만약 NextResponse.next()로 새로운 Response 객체를 생성해야 한다면 다음을 준수하세요:
    // 1. request를 전달하세요: const myNewResponse = NextResponse.next({ request })
    // 2. 쿠키를 복사하세요: myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. myNewResponse 객체를 원하는 대로 수정하되, 쿠키는 변경하지 마세요!
    // 4. 마지막으로: return myNewResponse
    // 이 과정을 따르지 않으면 브라우저와 서버의 동기화가 깨져 사용자 세션이 조기에 종료될 수 있습니다!

    return supabaseResponse
}
