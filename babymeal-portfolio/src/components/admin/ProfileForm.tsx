'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logAudit } from '@/lib/audit'
import type { Profile } from '@/lib/types'
import Image from 'next/image'

interface ProfileFormProps {
    profile: Profile | null
}

export default function ProfileForm({ profile }: ProfileFormProps) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '')
    const router = useRouter()

    const [formData, setFormData] = useState({
        full_name: profile?.full_name || '',
        headline: profile?.headline || 'Senior Full-stack AI Engineer',
        tagline: profile?.tagline || 'Bridging Complex Business Logic with Scalable AI Automation',
        introduction: profile?.introduction || '',
        philosophy: profile?.philosophy || '',
        email: profile?.email || '',
        github: profile?.social_links?.github || '',
        linkedin: profile?.social_links?.linkedin || '',
        line: profile?.social_links?.line || ''
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setLoading(true)
        try {
            const supabase = createClient()
            const fileExt = file.name.split('.').pop()
            const fileName = `avatar-${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(fileName, file, { upsert: true })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(fileName)

            setAvatarPreview(publicUrl)
            setMessage('อัพโหลดรูปสำเร็จ!')
        } catch (error) {
            console.error(error)
            setMessage('เกิดข้อผิดพลาดในการอัพโหลดรูป')
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const supabase = createClient()

            const profileData = {
                full_name: formData.full_name,
                headline: formData.headline,
                tagline: formData.tagline,
                introduction: formData.introduction,
                philosophy: formData.philosophy,
                avatar_url: avatarPreview,
                email: formData.email,
                social_links: {
                    github: formData.github,
                    linkedin: formData.linkedin,
                    line: formData.line
                }
            }

            if (profile?.id) {
                // Update existing
                const { error } = await supabase
                    .from('portfolio_profile')
                    .update(profileData)
                    .eq('id', profile.id)
                if (error) throw error

                // Log the update
                await logAudit({
                    action: 'UPDATE',
                    tableName: 'portfolio_profile',
                    recordId: profile.id,
                    oldData: profile as unknown as Record<string, unknown>,
                    newData: profileData
                })
            } else {
                // Insert new
                const { data: newProfile, error } = await supabase
                    .from('portfolio_profile')
                    .insert([profileData])
                    .select()
                    .single()
                if (error) throw error

                // Log the insert
                await logAudit({
                    action: 'INSERT',
                    tableName: 'portfolio_profile',
                    recordId: newProfile?.id,
                    newData: profileData
                })
            }

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
            <h2 className="text-xl font-bold mb-6">แก้ไขข้อมูลส่วนตัว</h2>

            {message && (
                <div className={`p-4 rounded-lg text-sm ${message.includes('สำเร็จ') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                    {message}
                </div>
            )}

            {/* Avatar */}
            <div>
                <label className="block text-sm font-medium mb-3">รูปโปรไฟล์</label>
                <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--border-glass)] bg-[var(--bg-glass)]">
                        {avatarPreview ? (
                            <Image src={avatarPreview} alt="Avatar" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
                        )}
                    </div>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                            id="avatar-upload"
                        />
                        <label
                            htmlFor="avatar-upload"
                            className="admin-button admin-button-secondary cursor-pointer text-sm"
                        >
                            {loading ? 'กำลังอัพโหลด...' : 'เลือกรูป'}
                        </label>
                        <p className="text-xs text-[var(--text-muted)] mt-2">PNG, JPG ไม่เกิน 2MB</p>
                    </div>
                </div>
            </div>

            {/* Name */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">ชื่อ-นามสกุล</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="admin-input"
                        placeholder="เช่น สมชาย ใจดี"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="admin-input"
                        placeholder="your.email@example.com"
                    />
                </div>
            </div>

            {/* Headline & Tagline */}
            <div>
                <label className="block text-sm font-medium mb-2">Headline</label>
                <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    className="admin-input"
                    placeholder="เช่น Senior Full-stack AI Engineer"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Tagline</label>
                <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="admin-input"
                    placeholder="เช่น Bridging Complex Business Logic..."
                />
            </div>

            {/* Introduction */}
            <div>
                <label className="block text-sm font-medium mb-2">ข้อความแนะนำตัว</label>
                <textarea
                    name="introduction"
                    value={formData.introduction}
                    onChange={handleChange}
                    rows={4}
                    className="admin-input resize-none"
                    placeholder="เขียนแนะนำตัวเองสั้นๆ..."
                />
            </div>

            {/* Philosophy */}
            <div>
                <label className="block text-sm font-medium mb-2">Technical Philosophy</label>
                <textarea
                    name="philosophy"
                    value={formData.philosophy}
                    onChange={handleChange}
                    rows={3}
                    className="admin-input resize-none"
                    placeholder="แนวคิดในการพัฒนา..."
                />
            </div>

            {/* Social Links */}
            <div>
                <label className="block text-sm font-medium mb-4">Social Links</label>
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--text-muted)] mb-1">GitHub</label>
                        <input
                            type="url"
                            name="github"
                            value={formData.github}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="https://github.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--text-muted)] mb-1">LinkedIn</label>
                        <input
                            type="url"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="https://linkedin.com/in/..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--text-muted)] mb-1">Line ID</label>
                        <input
                            type="text"
                            name="line"
                            value={formData.line}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="@yourlineid"
                        />
                    </div>
                </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="admin-button"
                >
                    {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                </button>
            </div>
        </form>
    )
}
