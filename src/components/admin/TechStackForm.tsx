'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logAudit } from '@/lib/audit'
import type { TechStack } from '@/lib/types'

interface TechStackFormProps {
    techStack: TechStack[]
    userEmail: string
}

import { useLanguage } from '@/lib/context/language-context'

interface TechStackFormProps {
    techStack: TechStack[]
    userEmail: string
}

export default function TechStackForm({ techStack: initialStack, userEmail }: TechStackFormProps) {
    const { t } = useLanguage()
    const [techStack, setTechStack] = useState<Partial<TechStack>[]>(
        initialStack.length > 0 ? initialStack : [
            { category: 'Frontend', category_en: 'Frontend', icon: '🎨', items: [], sort_order: 1 }
        ]
    )
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    function handleChange(index: number, field: string, value: string | string[]) {
        setTechStack(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
    }

    function handleItemsChange(index: number, value: string) {
        const items = value.split(',').map(item => item.trim()).filter(Boolean)
        handleChange(index, 'items', items)
    }

    function addCategory() {
        setTechStack(prev => [
            ...prev,
            { category: '', category_en: '', icon: '⚙️', items: [], sort_order: prev.length + 1 }
        ])
    }

    function removeCategory(index: number) {
        if (techStack.length === 1) return
        setTechStack(prev => prev.filter((_, i) => i !== index))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const supabase = createClient()

            // Delete all existing and insert fresh
            await supabase.from('portfolio_tech_stack').delete().neq('id', '00000000-0000-0000-0000-000000000000')

            const stackToInsert = techStack.map((s, index) => ({
                category: s.category || '',
                category_en: s.category_en || '',
                icon: s.icon || '⚙️',
                items: s.items || [],
                sort_order: index + 1
            }))

            const { error } = await supabase.from('portfolio_tech_stack').insert(stackToInsert)
            if (error) throw error

            // Log the update
            await logAudit({
                action: 'UPDATE',
                tableName: 'portfolio_tech_stack',
                newData: { tech_stack: stackToInsert },
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
                <h2 className="text-xl font-bold">{t('admin.tech.title')}</h2>
                <button
                    type="button"
                    onClick={addCategory}
                    className="admin-button admin-button-secondary text-sm"
                >
                    {t('admin.add_category')}
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg text-sm ${message.toLowerCase().includes('success') || message.includes('สำเร็จ') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                    {message}
                </div>
            )}

            <div className="space-y-6">
                {techStack.map((category, index) => (
                    <div key={index} className="p-8 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-2xl relative group/card">
                        <div className="absolute -top-3 -left-3 w-10 h-10 bg-[var(--accent-secondary)]/10 rounded-lg flex items-center justify-center font-bold text-sm border border-[var(--accent-secondary)]/20 shadow-lg">
                            {index + 1}
                        </div>

                        <div className="flex items-center justify-end mb-6">
                            {techStack.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeCategory(index)}
                                    className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold transition-all"
                                >
                                    ลบชุดนี้
                                </button>
                            )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 mb-8 text-left">
                            <div className="admin-grid-item">
                                <label className="admin-label">Icon</label>
                                <input
                                    type="text"
                                    value={category.icon || ''}
                                    onChange={(e) => handleChange(index, 'icon', e.target.value)}
                                    className="admin-input text-center text-xl"
                                    placeholder="🎨"
                                />
                            </div>
                            <div className="md:col-span-2 admin-grid-item text-left">
                                <label className="admin-label">Tech Items (คั่นด้วย ,)</label>
                                <input
                                    type="text"
                                    value={category.items?.join(', ') || ''}
                                    onChange={(e) => handleItemsChange(index, e.target.value)}
                                    className="admin-input"
                                    placeholder="React, Next.js, Node.js"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                            <div className="admin-grid-item">
                                <label className="admin-label">Category Name (TH)</label>
                                <input
                                    type="text"
                                    value={category.category || ''}
                                    onChange={(e) => handleChange(index, 'category', e.target.value)}
                                    className="admin-input"
                                    placeholder="เช่น Frontend"
                                    required
                                />
                            </div>
                            <div className="admin-grid-item">
                                <label className="admin-label">Category Name (EN)</label>
                                <input
                                    type="text"
                                    value={category.category_en || ''}
                                    onChange={(e) => handleChange(index, 'category_en', e.target.value)}
                                    className="admin-input"
                                    placeholder="e.g., Frontend & Design"
                                />
                            </div>
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
