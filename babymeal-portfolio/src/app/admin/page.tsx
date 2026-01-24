import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/admin/AdminDashboard'
import { getAdminSession } from '@/lib/auth-actions'

export default async function AdminPage() {
    const session = await getAdminSession()

    if (!session) {
        redirect('/admin/login')
    }

    const supabase = await createClient()

    // Fetch current data
    const [profileRes, projectsRes, techStackRes] = await Promise.all([
        supabase.from('portfolio_profile').select('*').single(),
        supabase.from('portfolio_projects').select('*').order('sort_order'),
        supabase.from('portfolio_tech_stack').select('*').order('sort_order')
    ])

    return (
        <AdminDashboard
            user={session}
            profile={profileRes.data}
            projects={projectsRes.data || []}
            techStack={techStackRes.data || []}
        />
    )
}
