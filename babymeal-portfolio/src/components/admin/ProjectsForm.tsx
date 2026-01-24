'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logAudit } from '@/lib/audit'
import type { Project } from '@/lib/types'

import { useLanguage } from '@/lib/context/language-context'

interface ProjectsFormProps {
    projects: Project[]
    userEmail: string
}

export default function ProjectsForm({ projects: initialProjects, userEmail }: ProjectsFormProps) {
    const { t } = useLanguage()
    const [projects, setProjects] = useState<Partial<Project>[]>(
        initialProjects.length > 0 ? initialProjects : [
            { title: '', title_en: '', subtitle: '', subtitle_en: '', description: '', description_en: '', icon: '🚀', tags: [], link_url: '', sort_order: 1 }
        ]
    )
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    function handleChange(index: number, field: string, value: string | string[]) {
        setProjects(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
    }

    function handleTagsChange(index: number, value: string) {
        const tags = value.split(',').map(tag => tag.trim()).filter(Boolean)
        handleChange(index, 'tags', tags)
    }

    function addProject() {
        setProjects(prev => [
            ...prev,
            { title: '', title_en: '', subtitle: '', subtitle_en: '', description: '', description_en: '', icon: '📦', tags: [], link_url: '', sort_order: prev.length + 1 }
        ])
    }

    function removeProject(index: number) {
        if (projects.length === 1) return
        setProjects(prev => prev.filter((_, i) => i !== index))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const supabase = createClient()

            // Delete all existing and insert fresh
            await supabase.from('portfolio_projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')

            const projectsToInsert = projects.map((p, index) => ({
                title: p.title || '',
                title_en: p.title_en || '',
                subtitle: p.subtitle || '',
                subtitle_en: p.subtitle_en || '',
                description: p.description || '',
                description_en: p.description_en || '',
                icon: p.icon || '📦',
                tags: p.tags || [],
                link_url: p.link_url || null,
                sort_order: index + 1
            }))

            const { error } = await supabase.from('portfolio_projects').insert(projectsToInsert)
            if (error) throw error

            // Log the update
            await logAudit({
                action: 'UPDATE',
                tableName: 'portfolio_projects',
                newData: { projects: projectsToInsert },
                userEmail: userEmail
            })

            setMessage(t('admin.success'))
            router.refresh()
        } catch (error: any) {
            console.error(error)
            setMessage(`${t('admin.error')}: ${error.message || ''}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{t('admin.projects.title')}</h2>
                <button
                    type="button"
                    onClick={addProject}
                    className="admin-button admin-button-secondary text-sm"
                >
                    {t('admin.add_project')}
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg text-sm ${message.toLowerCase().includes('success') || message.includes('สำเร็จ') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                    {message}
                </div>
            )}

            <div className="space-y-12">
                {projects.map((project, index) => (
                    <div key={index} className="p-8 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-2xl relative group/card">
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-[var(--accent-primary)]/10 rounded-xl flex items-center justify-center font-bold text-lg border border-[var(--accent-primary)]/20 shadow-xl">
                            {index + 1}
                        </div>

                        <div className="flex items-center justify-end mb-8">
                            {projects.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeProject(index)}
                                    className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold transition-all"
                                >
                                    ลบชุดนี้
                                </button>
                            )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div>
                                <label className="block text-xs font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-2">Icon (Emoji)</label>
                                <input
                                    type="text"
                                    value={project.icon || ''}
                                    onChange={(e) => handleChange(index, 'icon', e.target.value)}
                                    className="admin-input text-center text-2xl"
                                    placeholder="🚀"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Link URL</label>
                                <input
                                    type="url"
                                    value={project.link_url || ''}
                                    onChange={(e) => handleChange(index, 'link_url', e.target.value)}
                                    className="admin-input"
                                    placeholder="https://your-project-link.com"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-8 pt-6 border-t border-white/5">
                            {/* Thai Content */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-4">🇹🇭 Thai Content</h4>
                                <div>
                                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1.5">Project Title (TH)</label>
                                    <input
                                        type="text"
                                        value={project.title || ''}
                                        onChange={(e) => handleChange(index, 'title', e.target.value)}
                                        className="admin-input"
                                        placeholder="ชื่อโปรเจคภาษาไทย"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1.5">Subtitle (TH)</label>
                                    <input
                                        type="text"
                                        value={project.subtitle || ''}
                                        onChange={(e) => handleChange(index, 'subtitle', e.target.value)}
                                        className="admin-input"
                                        placeholder="คำอธิบายสั้นๆ ภาษาไทย"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1.5">Description (TH)</label>
                                    <textarea
                                        value={project.description || ''}
                                        onChange={(e) => handleChange(index, 'description', e.target.value)}
                                        className="admin-input resize-none"
                                        rows={4}
                                        placeholder="รายละเอียดโปรเจคภาษาไทย..."
                                    />
                                </div>
                            </div>

                            {/* English Content */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-[var(--accent-secondary)] uppercase tracking-widest mb-4">🇺🇸 English Content</h4>
                                <div>
                                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1.5">Project Title (EN)</label>
                                    <input
                                        type="text"
                                        value={project.title_en || ''}
                                        onChange={(e) => handleChange(index, 'title_en', e.target.value)}
                                        className="admin-input"
                                        placeholder="Project Title in English"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1.5">Subtitle (EN)</label>
                                    <input
                                        type="text"
                                        value={project.subtitle_en || ''}
                                        onChange={(e) => handleChange(index, 'subtitle_en', e.target.value)}
                                        className="admin-input"
                                        placeholder="Short subtitle in English"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-[var(--text-muted)] uppercase mb-1.5">Description (EN)</label>
                                    <textarea
                                        value={project.description_en || ''}
                                        onChange={(e) => handleChange(index, 'description_en', e.target.value)}
                                        className="admin-input resize-none"
                                        rows={4}
                                        placeholder="Project details in English..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Tags (คั่นด้วย ,)</label>
                            <input
                                type="text"
                                value={project.tags?.join(', ') || ''}
                                onChange={(e) => handleTagsChange(index, e.target.value)}
                                className="admin-input"
                                placeholder="AI Integration, Next.js, Automation"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button type="submit" disabled={loading} className="admin-button">
                    {loading ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
                </button>
            </div>
        </form>
    )
}
