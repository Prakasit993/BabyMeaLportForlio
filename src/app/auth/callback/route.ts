import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/admin'

    // The origin should be dynamic based on environment if possible, or fallback to request.url origin
    // But since we are getting redirects to production URL, we need to be careful.
    // Ideally, we redirect to the same origin that initiated the request.

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Force redirect to the origin of the current request context if valid, 
            // or use a configured SITE_URL env var if available to be safe.
            // For now, we trust 'origin' from the request.url which SHOULD be localhost in dev.

            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    return NextResponse.redirect(`${origin}/admin/login?error=auth_code_error`)
}
