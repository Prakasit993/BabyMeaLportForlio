'use client'

import { useState, useEffect } from 'react'
import {
    isWebAuthnSupported,
    registerPasskey,
    getRegisteredPasskeys,
    deletePasskey
} from '@/lib/passkey'

import { useLanguage } from '@/lib/context/language-context'

interface Passkey {
    id: string
    credential_id: string
    device_name: string
    created_at: string
    last_used_at: string | null
}

export default function PasskeySettings() {
    const { t, locale } = useLanguage()
    const [passkeys, setPasskeys] = useState<Passkey[]>([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [deviceName, setDeviceName] = useState('')
    const [supported, setSupported] = useState(true)

    useEffect(() => {
        setSupported(isWebAuthnSupported())
        loadPasskeys()
    }, [])

    async function loadPasskeys() {
        const keys = await getRegisteredPasskeys()
        setPasskeys(keys)
    }

    async function handleRegister() {
        if (!deviceName.trim()) {
            setMessage(locale === 'th' ? 'กรุณาใส่ชื่ออุปกรณ์' : 'Please enter a device name')
            return
        }

        setLoading(true)
        setMessage('')

        try {
            await registerPasskey(deviceName)
            setMessage(t('admin.success'))
            setDeviceName('')
            await loadPasskeys()
        } catch (error) {
            console.error(error)
            setMessage(t('admin.error'))
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm(locale === 'th' ? 'ต้องการลบ Passkey นี้?' : 'Do you want to delete this Passkey?')) return

        try {
            await deletePasskey(id)
            setMessage(t('admin.success'))
            await loadPasskeys()
        } catch (error) {
            console.error(error)
            setMessage(t('admin.error'))
        }
    }

    if (!supported) {
        return (
            <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <h3 className="font-bold text-yellow-400 mb-2">⚠️ WebAuthn {locale === 'th' ? 'ไม่รองรับ' : 'Not Supported'}</h3>
                <p className="text-sm text-[var(--text-muted)]">
                    {locale === 'th'
                        ? 'เบราว์เซอร์หรืออุปกรณ์ของคุณไม่รองรับ Passkey/Fingerprint กรุณาใช้ Chrome, Safari หรือ Edge เวอร์ชันล่าสุด'
                        : 'Your browser or device does not support Passkey/Fingerprint. Please use the latest version of Chrome, Safari, or Edge.'}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold mb-2">🔐 Passkey / Fingerprint</h3>
                <p className="text-sm text-[var(--text-muted)] opacity-80">
                    {locale === 'th'
                        ? 'เพิ่มความปลอดภัยด้วยการใช้ลายนิ้วมือ, Face ID หรือ Windows Hello'
                        : 'Enhance security using fingerprint, Face ID, or Windows Hello'}
                </p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl text-sm font-bold ${message.toLowerCase().includes('success') || message.includes('สำเร็จ')
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                    }`}>
                    {message.toLowerCase().includes('success') || message.includes('สำเร็จ') ? '✅' : '⚠️'} {message}
                </div>
            )}

            {/* Register New Passkey */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl shadow-inner">
                <h4 className="text-sm font-bold mb-4 uppercase tracking-wider opacity-70">
                    {locale === 'th' ? 'เพิ่ม Passkey ใหม่' : 'Register New Passkey'}
                </h4>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        placeholder={locale === 'th' ? "ชื่ออุปกรณ์ (เช่น MacBook, iPhone)" : "Device Name (e.g., MacBook, iPhone)"}
                        className="admin-input flex-1"
                    />
                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="admin-button min-w-[160px]"
                    >
                        {loading ? t('admin.loading') : `➕ ${locale === 'th' ? 'เพิ่ม Passkey' : 'Add Passkey'}`}
                    </button>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-4 opacity-60">
                    {locale === 'th'
                        ? 'คลิกเพิ่มแล้วใช้ลายนิ้วมือหรือ Face ID เพื่อยืนยัน'
                        : 'Click add and use your fingerprint or Face ID to confirm.'}
                </p>
            </div>

            {/* Registered Passkeys */}
            <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider opacity-70">
                    {locale === 'th' ? 'Passkeys ที่ลงทะเบียนแล้ว' : 'Registered Passkeys'}
                </h4>
                {passkeys.length === 0 ? (
                    <div className="p-8 bg-black/20 border border-dashed border-white/10 rounded-2xl text-center">
                        <p className="text-sm text-[var(--text-muted)]">
                            {locale === 'th' ? 'ยังไม่มี Passkey ที่ลงทะเบียน' : 'No passkeys registered yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {passkeys.map((passkey) => (
                            <div
                                key={passkey.id}
                                className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl border border-white/5">
                                        💻
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{passkey.device_name || 'Unknown Device'}</p>
                                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                                            {locale === 'th' ? 'เพิ่มเมื่อ' : 'Added'}: {new Date(passkey.created_at).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US')}
                                            {passkey.last_used_at && (
                                                <> • {locale === 'th' ? 'ใช้ล่าสุด' : 'Last used'}: {new Date(passkey.last_used_at).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US')}</>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(passkey.id)}
                                    className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                    title={locale === 'th' ? "ลบ" : "Delete"}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
