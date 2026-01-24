'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '@/lib/auth-actions'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const formData = new FormData()
            formData.append('email', email)
            formData.append('password', password)

            const result = await loginAction(formData)

            if (result?.error) {
                if ((result as any).details) {
                    setError(`${result.error}\nรายละเอียด: ${(result as any).details}`)
                } else {
                    setError(result.error)
                }
                return
            }

            if (result?.success) {
                router.push('/admin')
                router.refresh()
            }
        } catch {
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        } finally {
            setLoading(false)
        }
    }

    // Google Login disabled for this simple version
    async function handleGoogleLogin() {
        setError('กรุณาใช้ Email และ Password ในการเข้าสู่ระบบ')
    }

    // Check for error in URL
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
    const urlError = searchParams?.get('error')
    if (urlError === 'unauthorized' && !error) {
        setError('คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (Unauthorized)')
    }

    return (
        <div className="admin-container min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="bg-animated"></div>
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>

            <div className="w-full max-w-sm sm:max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 border border-[var(--border-glass)] rounded-3xl mb-6 text-4xl shadow-glow backdrop-blur-xl">
                        🔐
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">Admin Login</h1>
                    <p className="text-[var(--text-secondary)] text-sm sm:text-base font-medium">เข้าสู่ระบบจัดการ Portfolio</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="glass-card p-6 sm:p-10 space-y-6 animate-in fade-in zoom-in duration-700 delay-200">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs sm:text-sm leading-relaxed flex flex-col gap-1 items-start">
                            <div className="flex gap-3 items-center">
                                <span className="text-lg">⚠️</span>
                                <span className="font-bold">{error}</span>
                            </div>
                            {typeof error === 'object' && (error as any).details && (
                                <p className="ml-8 text-[10px] opacity-70 bg-black/20 p-2 rounded w-full break-all">
                                    {(error as any).details}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2.5 ml-1 text-[var(--text-secondary)] uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="admin-input bg-white/5 border-[var(--border-glass)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 transition-all placeholder:text-[var(--text-muted)]"
                                placeholder="your.email@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2.5 ml-1 text-[var(--text-secondary)] uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="admin-input bg-white/5 border-[var(--border-glass)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 transition-all placeholder:text-[var(--text-muted)]"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="admin-button w-full py-4 text-base tracking-wide flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-[var(--accent-primary)]/30"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                กำลังเข้าสู่ระบบ...
                            </span>
                        ) : (
                            <>
                                <span>เข้าสู่ระบบ</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>

                    {/* Divider (Optional if only one method remains) */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--border-glass)]"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                            <span className="px-3 bg-[#0f0f23] text-[var(--text-muted)]">โปรดกรอกรหัสผ่านเพื่อเข้าใช้งาน</span>
                        </div>
                    </div>
                </form>

                {/* Back link */}
                <p className="text-center mt-10 animate-in fade-in duration-1000 delay-500">
                    <a href="/" className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all text-sm flex items-center justify-center gap-2 group underline-offset-4 hover:underline">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        กลับไปหน้าหลัก
                    </a>
                </p>
            </div>
        </div>
    )
}
