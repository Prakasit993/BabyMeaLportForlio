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

export default function TechStackForm({ techStack: initialStack, userEmail }: TechStackFormProps) {
    const [techStack, setTechStack] = useState<Partial<TechStack>[]>(
        initialStack.length > 0 ? initialStack : [
            { category: 'Frontend', icon: '🎨', items: [], sort_order: 1 }
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
            { category: '', icon: '⚙️', items: [], sort_order: prev.length + 1 }
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

            setMessage('บันทึกสำเร็จ!')
            router.refresh()
        } catch (error: any) {
            console.error(error)
            setMessage(`เกิดข้อผิดพลาด: ${error.message || 'กรุณาลองใหม่'}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">จัดการ Tech Stack</h2>
                <button
                    type="button"
                    onClick={addCategory}
                    className="admin-button admin-button-secondary text-sm"
                >
                    + เพิ่ม Category
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg text-sm ${message.includes('สำเร็จ') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                    {message}
                </div>
            )}

            <div className="space-y-6">
                {techStack.map((category, index) => (
                    <div key={index} className="p-6 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-[var(--text-muted)]">Category #{index + 1}</span>
                            {techStack.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeCategory(index)}
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
                                    value={category.icon || ''}
                                    onChange={(e) => handleChange(index, 'icon', e.target.value)}
                                    className="admin-input"
                                    placeholder="🎨"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-[var(--text-muted)] mb-1">Category Name</label>
                                <input
                                    type="text"
                                    value={category.category || ''}
                                    onChange={(e) => handleChange(index, 'category', e.target.value)}
                                    className="admin-input"
                                    placeholder="เช่น Frontend"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-[var(--text-muted)] mb-1">Tech Items (คั่นด้วย ,)</label>
                            <input
                                type="text"
                                value={category.items?.join(', ') || ''}
                                onChange={(e) => handleItemsChange(index, e.target.value)}
                                className="admin-input"
                                placeholder="Next.js, TypeScript, Tailwind CSS"
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
