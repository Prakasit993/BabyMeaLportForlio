'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logAudit } from '@/lib/audit'
import type { Project } from '@/lib/types'

interface ProjectsFormProps {
    projects: Project[]
}

export default function ProjectsForm({ projects: initialProjects }: ProjectsFormProps) {
    const [projects, setProjects] = useState<Partial<Project>[]>(
        initialProjects.length > 0 ? initialProjects : [
            { title: '', subtitle: '', description: '', icon: '🚀', tags: [], link_url: '', sort_order: 1 }
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
            { title: '', subtitle: '', description: '', icon: '📦', tags: [], link_url: '', sort_order: prev.length + 1 }
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
                subtitle: p.subtitle || '',
                description: p.description || '',
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
                newData: { projects: projectsToInsert }
            })

            setMessage('บันทึกสำเร็จ!')
            router.refresh()
        } catch (error) {
            console.error(error)
            setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">จัดการ Projects</h2>
                <button
                    type="button"
                    onClick={addProject}
                    className="admin-button admin-button-secondary text-sm"
                >
                    + เพิ่ม Project
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg text-sm ${message.includes('สำเร็จ') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                    {message}
                </div>
            )}

            <div className="space-y-6">
                {projects.map((project, index) => (
                    <div key={index} className="p-6 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-[var(--text-muted)]">Project #{index + 1}</span>
                            {projects.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeProject(index)}
                                    className="text-red-400 hover:text-red-300 text-sm"
                                >
                                    ลบ
                                </button>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-[var(--text-muted)] mb-1">Icon (Emoji)</label>
                                <input
                                    type="text"
                                    value={project.icon || ''}
                                    onChange={(e) => handleChange(index, 'icon', e.target.value)}
                                    className="admin-input"
                                    placeholder="🚀"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[var(--text-muted)] mb-1">Title</label>
                                <input
                                    type="text"
                                    value={project.title || ''}
                                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                                    className="admin-input"
                                    placeholder="ชื่อโปรเจค"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-[var(--text-muted)] mb-1">Subtitle</label>
                                <input
                                    type="text"
                                    value={project.subtitle || ''}
                                    onChange={(e) => handleChange(index, 'subtitle', e.target.value)}
                                    className="admin-input"
                                    placeholder="เช่น AI-Powered ERP"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[var(--text-muted)] mb-1">Link URL</label>
                                <input
                                    type="url"
                                    value={project.link_url || ''}
                                    onChange={(e) => handleChange(index, 'link_url', e.target.value)}
                                    className="admin-input"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs text-[var(--text-muted)] mb-1">Description</label>
                            <textarea
                                value={project.description || ''}
                                onChange={(e) => handleChange(index, 'description', e.target.value)}
                                className="admin-input resize-none"
                                rows={2}
                                placeholder="รายละเอียดโปรเจค..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-[var(--text-muted)] mb-1">Tags (คั่นด้วย ,)</label>
                            <input
                                type="text"
                                value={project.tags?.join(', ') || ''}
                                onChange={(e) => handleTagsChange(index, e.target.value)}
                                className="admin-input"
                                placeholder="AI, Automation, Next.js"
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
