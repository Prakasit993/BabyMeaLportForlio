'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logAudit } from '@/lib/audit'
import type { Profile } from '@/lib/types'
import Image from 'next/image'

import { useLanguage } from '@/lib/context/language-context'

interface ProfileFormProps {
    profile: Profile | null
    userEmail: string
}

export default function ProfileForm({ profile, userEmail }: ProfileFormProps) {
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '')
    const router = useRouter()

    const [formData, setFormData] = useState({
        full_name: profile?.full_name || '',
        full_name_en: profile?.full_name_en || '',
        headline: profile?.headline || '',
        headline_en: profile?.headline_en || '',
        tagline: profile?.tagline || '',
        tagline_en: profile?.tagline_en || '',
        introduction: profile?.introduction || '',
        introduction_en: profile?.introduction_en || '',
        philosophy: profile?.philosophy || '',
        philosophy_en: profile?.philosophy_en || '',
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
        setMessage('')
        try {
            const supabase = createClient()
            const fileExt = file.name.split('.').pop()
            const fileName = `avatar-${Date.now()}.${fileExt}`

            // Ensure bucket exists and has correct policies (Instruction in chat)
            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(fileName, file, { upsert: true })

            if (uploadError) {
                console.error('Upload Error:', uploadError)
                throw new Error(`อัพโหลดรูปไม่สำเร็จ: ${uploadError.message}`)
            }

            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(fileName)

            setAvatarPreview(publicUrl)
            setMessage(t('admin.success'))
        } catch (error: any) {
            console.error(error)
            setMessage(t('admin.error'))
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
                full_name_en: formData.full_name_en,
                headline: formData.headline,
                headline_en: formData.headline_en,
                tagline: formData.tagline,
                tagline_en: formData.tagline_en,
                introduction: formData.introduction,
                introduction_en: formData.introduction_en,
                philosophy: formData.philosophy,
                philosophy_en: formData.philosophy_en,
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
                    newData: profileData,
                    userEmail: userEmail
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
                    newData: profileData,
                    userEmail: userEmail
                })
            }

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
            <h2 className="text-xl font-bold mb-6">{t('admin.profile.title')}</h2>

            {message && (
                <div className={`p-4 rounded-xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500 ${message.toLowerCase().includes('success') || message.includes('สำเร็จ')
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                    }`}>
                    <span className="text-xl">{message.toLowerCase().includes('success') || message.includes('สำเร็จ') ? '✅' : '⚠️'}</span>
                    <div className="flex-1">
                        <p className="font-semibold text-sm">{message}</p>
                    </div>
                </div>
            )}

            {/* Avatar */}
            <div>
                <label className="admin-label">รูปโปรไฟล์</label>
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
            <div className="grid md:grid-cols-2 gap-8 p-8 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-2xl">
                <div className="space-y-6">
                    <h3 className="admin-section-header text-[var(--accent-primary)]">{t('admin.content.thai')}</h3>
                    <div className="admin-grid-item">
                        <label className="admin-label">ชื่อ-นามสกุล (TH)</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="สมชาย ใจดี"
                        />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="admin-section-header text-[var(--accent-secondary)]">{t('admin.content.english')}</h3>
                    <div className="admin-grid-item">
                        <label className="admin-label">Full Name (EN)</label>
                        <input
                            type="text"
                            name="full_name_en"
                            value={formData.full_name_en}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="Somchai Jaidee"
                        />
                    </div>
                </div>
            </div>

            {/* Email (Generic) */}
            <div className="p-8 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-2xl">
                <label className="admin-label">Email Address</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="admin-input"
                    placeholder="your.email@example.com"
                />
            </div>

            {/* Headline & Tagline */}
            <div className="grid md:grid-cols-2 gap-6 p-6 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-2xl">
                <div className="space-y-8">
                    <h3 className="admin-section-header text-[var(--accent-primary)]">{t('admin.lang.thai')}</h3>
                    <div className="admin-grid-item">
                        <label className="admin-label">Headline (TH)</label>
                        <input
                            type="text"
                            name="headline"
                            value={formData.headline}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="Senior Full-stack AI Engineer"
                        />
                    </div>
                    <div className="admin-grid-item">
                        <label className="admin-label">Tagline (TH)</label>
                        <input
                            type="text"
                            name="tagline"
                            value={formData.tagline}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="Bridging Complex Business Logic..."
                        />
                    </div>
                </div>
                <div className="space-y-8">
                    <h3 className="admin-section-header text-[var(--accent-secondary)]">{t('admin.lang.english')}</h3>
                    <div className="admin-grid-item">
                        <label className="admin-label">Headline (EN)</label>
                        <input
                            type="text"
                            name="headline_en"
                            value={formData.headline_en}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="Senior Full-stack AI Engineer"
                        />
                    </div>
                    <div className="admin-grid-item">
                        <label className="admin-label">Tagline (EN)</label>
                        <input
                            type="text"
                            name="tagline_en"
                            value={formData.tagline_en}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="Bridging Complex Business Logic..."
                        />
                    </div>
                </div>
            </div>

            {/* Introduction */}
            <div className="grid md:grid-cols-2 gap-8 p-8 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-2xl">
                <div className="admin-grid-item">
                    <label className="admin-label">{t('nav.about')} (TH)</label>
                    <textarea
                        name="introduction"
                        value={formData.introduction}
                        onChange={handleChange}
                        rows={8}
                        className="admin-input resize-none"
                        placeholder="..."
                    />
                </div>
                <div className="admin-grid-item">
                    <label className="admin-label">Introduction (EN)</label>
                    <textarea
                        name="introduction_en"
                        value={formData.introduction_en}
                        onChange={handleChange}
                        rows={8}
                        className="admin-input resize-none"
                        placeholder="..."
                    />
                </div>
            </div>

            {/* Philosophy */}
            <div className="grid md:grid-cols-2 gap-8 p-8 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-2xl">
                <div className="admin-grid-item">
                    <label className="admin-label">Philosophy (TH)</label>
                    <textarea
                        name="philosophy"
                        value={formData.philosophy}
                        onChange={handleChange}
                        rows={6}
                        className="admin-input resize-none"
                        placeholder="..."
                    />
                </div>
                <div className="admin-grid-item">
                    <label className="admin-label">Philosophy (EN)</label>
                    <textarea
                        name="philosophy_en"
                        value={formData.philosophy_en}
                        onChange={handleChange}
                        rows={6}
                        className="admin-input resize-none"
                        placeholder="..."
                    />
                </div>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
                <label className="admin-label text-lg">Social Connections</label>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="admin-grid-item">
                        <label className="admin-label opacity-70">GitHub URL</label>
                        <input
                            type="url"
                            name="github"
                            value={formData.github}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="https://github.com/..."
                        />
                    </div>
                    <div className="admin-grid-item">
                        <label className="admin-label opacity-70">LinkedIn URL</label>
                        <input
                            type="url"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="https://linkedin.com/in/..."
                        />
                    </div>
                    <div className="admin-grid-item">
                        <label className="admin-label opacity-70">Line ID / Contact</label>
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
            <div className="flex justify-end pt-8">
                <button
                    type="submit"
                    disabled={loading}
                    className="admin-button min-w-[200px]"
                >
                    {loading ? t('admin.loading') : t('admin.save')}
                </button>
            </div>
        </form>
    )
}
