import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    // Fetch current data
    const [profileRes, projectsRes, techStackRes] = await Promise.all([
        supabase.from('portfolio_profile').select('*').single(),
        supabase.from('portfolio_projects').select('*').order('sort_order'),
        supabase.from('portfolio_tech_stack').select('*').order('sort_order')
    ])

    return (
        <AdminDashboard
            user={user}
            profile={profileRes.data}
            projects={projectsRes.data || []}
            techStack={techStackRes.data || []}
        />
    )
}
