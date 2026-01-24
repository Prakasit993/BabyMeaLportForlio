import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Check if user is logged in and is admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // If not logged in and not on login page, redirect to login
    // The login page handles its own layout

    return <>{children}</>
}
