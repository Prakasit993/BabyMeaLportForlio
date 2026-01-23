'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Project, TechStack } from '@/lib/types'
import type { User } from '@supabase/supabase-js'
import ProfileForm from './ProfileForm'
import ProjectsForm from './ProjectsForm'
import TechStackForm from './TechStackForm'
import PasskeySettings from './PasskeySettings'

interface AdminDashboardProps {
    user: User
    profile: Profile | null
    projects: Project[]
    techStack: TechStack[]
}

type Tab = 'profile' | 'projects' | 'techstack' | 'security'

export default function AdminDashboard({ user, profile, projects, techStack }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<Tab>('profile')
    const router = useRouter()

    async function handleLogout() {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <div className="admin-container">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--border-glass)]">
                <div className="container flex items-center justify-between py-4">
                    <div>
                        <h1 className="text-xl font-bold gradient-text">Admin Dashboard</h1>
                        <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href="/"
                            target="_blank"
                            className="admin-button admin-button-secondary text-sm"
                        >
                            ดู Portfolio
                        </a>
                        <button
                            onClick={handleLogout}
                            className="admin-button admin-button-secondary text-sm"
                        >
                            ออกจากระบบ
                        </button>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="container py-6">
                <div className="flex gap-2 mb-8 flex-wrap">
                    {[
                        { id: 'profile' as Tab, label: '👤 Profile' },
                        { id: 'projects' as Tab, label: '📦 Projects' },
                        { id: 'techstack' as Tab, label: '🛠️ Tech Stack' },
                        { id: 'security' as Tab, label: '🔐 Security' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white'
                                : 'bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="admin-card">
                    {activeTab === 'profile' && <ProfileForm profile={profile} />}
                    {activeTab === 'projects' && <ProjectsForm projects={projects} />}
                    {activeTab === 'techstack' && <TechStackForm techStack={techStack} />}
                    {activeTab === 'security' && <PasskeySettings />}
                </div>
            </div>
        </div>
    )
}
