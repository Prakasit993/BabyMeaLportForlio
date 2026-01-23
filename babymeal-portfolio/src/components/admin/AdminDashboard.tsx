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

const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: '👤', description: 'ข้อมูลส่วนตัว' },
    { id: 'projects' as Tab, label: 'Projects', icon: '📦', description: 'ผลงาน' },
    { id: 'techstack' as Tab, label: 'Tech Stack', icon: '🛠️', description: 'เทคโนโลยี' },
    { id: 'security' as Tab, label: 'Security', icon: '🔐', description: 'ความปลอดภัย' }
]

export default function AdminDashboard({ user, profile, projects, techStack }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<Tab>('profile')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()

    async function handleLogout() {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <div className="admin-container min-h-screen">
            {/* Mobile Header */}
            <header className="lg:hidden sticky top-0 z-50 bg-[var(--bg-secondary)]/95 backdrop-blur-xl border-b border-[var(--border-glass)]">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg bg-[var(--bg-glass)] border border-[var(--border-glass)]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold gradient-text">Admin</h1>
                    <a href="/" target="_blank" className="p-2 rounded-lg bg-[var(--bg-glass)] border border-[var(--border-glass)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
                    fixed lg:sticky top-0 left-0 z-50 lg:z-auto
                    w-72 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border-glass)]
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <div className="flex flex-col h-full">
                        {/* Logo */}
                        <div className="p-6 border-b border-[var(--border-glass)]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-xl">
                                    ⚡
                                </div>
                                <div>
                                    <h1 className="font-bold gradient-text">Portfolio Admin</h1>
                                    <p className="text-xs text-[var(--text-muted)] truncate max-w-[160px]">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id)
                                        setSidebarOpen(false)
                                    }}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left
                                        ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 border border-[var(--accent-primary)]/30 text-white'
                                            : 'hover:bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-white'
                                        }
                                    `}
                                >
                                    <span className="text-xl">{tab.icon}</span>
                                    <div>
                                        <p className="font-medium">{tab.label}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{tab.description}</p>
                                    </div>
                                    {activeTab === tab.id && (
                                        <div className="ml-auto w-1.5 h-8 bg-gradient-to-b from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full" />
                                    )}
                                </button>
                            ))}
                        </nav>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-[var(--border-glass)] space-y-2">
                            <a
                                href="/"
                                target="_blank"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] hover:border-[var(--accent-primary)] transition-all text-sm"
                            >
                                <span>🌐</span>
                                <span>ดู Portfolio</span>
                                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:border-red-500/40 text-red-400 transition-all text-sm"
                            >
                                <span>🚪</span>
                                <span>ออกจากระบบ</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-h-screen">
                    {/* Desktop Header */}
                    <header className="hidden lg:flex items-center justify-between px-8 py-6 border-b border-[var(--border-glass)]">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {tabs.find(t => t.id === activeTab)?.icon} {tabs.find(t => t.id === activeTab)?.label}
                            </h2>
                            <p className="text-[var(--text-muted)] text-sm mt-1">
                                จัดการ{tabs.find(t => t.id === activeTab)?.description}ของคุณ
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right mr-4">
                                <p className="text-sm font-medium">{profile?.full_name || 'Admin'}</p>
                                <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-lg">
                                {profile?.full_name?.charAt(0) || '👤'}
                            </div>
                        </div>
                    </header>

                    {/* Content Area */}
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="admin-card">
                            {activeTab === 'profile' && <ProfileForm profile={profile} />}
                            {activeTab === 'projects' && <ProjectsForm projects={projects} />}
                            {activeTab === 'techstack' && <TechStackForm techStack={techStack} />}
                            {activeTab === 'security' && <PasskeySettings />}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
