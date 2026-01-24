'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { logoutAction } from '@/lib/auth-actions'
import { useLanguage } from '@/lib/context/language-context'
import type { Profile, Project, TechStack } from '@/lib/types'
import ProfileForm from './ProfileForm'
import ProjectsForm from './ProjectsForm'
import TechStackForm from './TechStackForm'
import PasskeySettings from './PasskeySettings'
import AuditLog from './AuditLog'
import LanguageSwitcher from '../LanguageSwitcher'

interface AdminDashboardProps {
    user: { email: string }
    profile: Profile | null
    projects: Project[]
    techStack: TechStack[]
}

type Tab = 'profile' | 'projects' | 'techstack' | 'security' | 'activity'

export default function AdminDashboard({ user, profile, projects, techStack }: AdminDashboardProps) {
    const { t } = useLanguage()
    const [activeTab, setActiveTab] = useState<Tab>('profile')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()

    const tabs = [
        { id: 'profile' as Tab, label: t('admin.tab.profile'), icon: '👤', description: t('admin.desc.profile') },
        { id: 'projects' as Tab, label: t('admin.tab.projects'), icon: '📦', description: t('admin.desc.projects') },
        { id: 'techstack' as Tab, label: t('admin.tab.techstack'), icon: '🛠️', description: t('admin.desc.techstack') },
        { id: 'security' as Tab, label: t('admin.tab.security'), icon: '🔐', description: t('admin.desc.security') },
        { id: 'activity' as Tab, label: t('admin.tab.activity'), icon: '📜', description: t('admin.desc.activity') }
    ]

    async function handleLogout() {
        await logoutAction()
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
                    <h1 className="text-lg font-bold gradient-text">{t('admin.title')}</h1>
                    <div className="flex gap-2">
                        <a href="/" target="_blank" className="p-2 rounded-lg bg-[var(--bg-glass)] border border-[var(--border-glass)]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
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
                                    <h1 className="font-bold gradient-text leading-tight">{t('nav.portfolio')} Admin</h1>
                                    <p className="text-[10px] text-[var(--text-muted)] truncate max-w-[160px]">{user.email}</p>
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
                                            ? 'bg-gradient-to-r from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 border border-[var(--accent-primary)]/30 text-white shadow-lg'
                                            : 'hover:bg-white/5 text-[var(--text-secondary)] hover:text-white'
                                        }
                                    `}
                                >
                                    <span className="text-xl">{tab.icon}</span>
                                    <div>
                                        <p className="font-bold text-sm">{tab.label}</p>
                                        <p className="text-[10px] text-[var(--text-muted)] group-hover:text-white/60">{tab.description}</p>
                                    </div>
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="activeTab" className="ml-auto w-1 h-6 bg-[var(--accent-primary)] rounded-full" />
                                    )}
                                </button>
                            ))}
                        </nav>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-white/5 space-y-2">
                            <a
                                href="/"
                                target="_blank"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-[var(--accent-primary)] transition-all text-xs font-bold"
                            >
                                <span>🌐</span>
                                <span>{t('admin.view_site')}</span>
                                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10 hover:border-red-500/30 text-red-400/80 hover:text-red-400 transition-all text-xs font-bold"
                            >
                                <span>🚪</span>
                                <span>{t('admin.logout')}</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-h-screen">
                    {/* Desktop Header */}
                    <header className="hidden lg:flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[var(--bg-secondary)]/50 backdrop-blur-xl sticky top-0 z-30">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <span className="p-2 bg-white/5 rounded-xl border border-white/10 shadow-inner">
                                    {tabs.find(t => t.id === activeTab)?.icon}
                                </span>
                                <span>{tabs.find(t => t.id === activeTab)?.label}</span>
                            </h2>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <LanguageSwitcher />
                            </div>

                            <div className="h-10 w-px bg-white/10 mx-2"></div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-bold">{profile?.full_name || 'Admin'}</p>
                                    <p className="text-[10px] text-[var(--text-muted)]">{user.email}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-lg shadow-xl ring-2 ring-white/5">
                                    {profile?.full_name?.charAt(0) || '👤'}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Area */}
                    <div className="p-4 sm:p-6 lg:p-8">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="admin-card"
                        >
                            {activeTab === 'profile' && <ProfileForm profile={profile} userEmail={user.email} />}
                            {activeTab === 'projects' && <ProjectsForm projects={projects} userEmail={user.email} />}
                            {activeTab === 'techstack' && <TechStackForm techStack={techStack} userEmail={user.email} />}
                            {activeTab === 'security' && <PasskeySettings />}
                            {activeTab === 'activity' && <AuditLog />}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    )
}
