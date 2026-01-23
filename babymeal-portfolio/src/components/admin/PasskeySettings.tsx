'use client'

import { useState, useEffect } from 'react'
import {
    isWebAuthnSupported,
    registerPasskey,
    getRegisteredPasskeys,
    deletePasskey
} from '@/lib/passkey'

interface Passkey {
    id: string
    credential_id: string
    device_name: string
    created_at: string
    last_used_at: string | null
}

export default function PasskeySettings() {
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
            setMessage('กรุณาใส่ชื่ออุปกรณ์')
            return
        }

        setLoading(true)
        setMessage('')

        try {
            await registerPasskey(deviceName)
            setMessage('ลงทะเบียน Passkey สำเร็จ!')
            setDeviceName('')
            await loadPasskeys()
        } catch (error) {
            console.error(error)
            setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('ต้องการลบ Passkey นี้?')) return

        try {
            await deletePasskey(id)
            setMessage('ลบ Passkey สำเร็จ')
            await loadPasskeys()
        } catch (error) {
            console.error(error)
            setMessage('เกิดข้อผิดพลาดในการลบ')
        }
    }

    if (!supported) {
        return (
            <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <h3 className="font-bold text-yellow-400 mb-2">⚠️ WebAuthn ไม่รองรับ</h3>
                <p className="text-sm text-[var(--text-muted)]">
                    เบราว์เซอร์หรืออุปกรณ์ของคุณไม่รองรับ Passkey/Fingerprint
                    กรุณาใช้ Chrome, Safari หรือ Edge เวอร์ชันล่าสุด
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold mb-2">🔐 Passkey / Fingerprint</h3>
                <p className="text-sm text-[var(--text-muted)]">
                    เพิ่มความปลอดภัยด้วยการใช้ลายนิ้วมือ, Face ID หรือ Windows Hello
                </p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg text-sm ${message.includes('สำเร็จ')
                        ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                    }`}>
                    {message}
                </div>
            )}

            {/* Register New Passkey */}
            <div className="p-6 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-xl">
                <h4 className="font-medium mb-4">เพิ่ม Passkey ใหม่</h4>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        placeholder="ชื่ออุปกรณ์ (เช่น MacBook, iPhone)"
                        className="admin-input flex-1"
                    />
                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="admin-button whitespace-nowrap"
                    >
                        {loading ? 'กำลังลงทะเบียน...' : '➕ เพิ่ม Passkey'}
                    </button>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                    คลิกเพิ่มแล้วใช้ลายนิ้วมือหรือ Face ID เพื่อยืนยัน
                </p>
            </div>

            {/* Registered Passkeys */}
            <div>
                <h4 className="font-medium mb-4">Passkeys ที่ลงทะเบียนแล้ว</h4>
                {passkeys.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)]">ยังไม่มี Passkey ที่ลงทะเบียน</p>
                ) : (
                    <div className="space-y-3">
                        {passkeys.map((passkey) => (
                            <div
                                key={passkey.id}
                                className="flex items-center justify-between p-4 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-lg"
                            >
                                <div>
                                    <p className="font-medium">{passkey.device_name || 'Unknown Device'}</p>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        เพิ่มเมื่อ: {new Date(passkey.created_at).toLocaleDateString('th-TH')}
                                        {passkey.last_used_at && (
                                            <> • ใช้ล่าสุด: {new Date(passkey.last_used_at).toLocaleDateString('th-TH')}</>
                                        )}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(passkey.id)}
                                    className="text-red-400 hover:text-red-300 text-sm"
                                >
                                    ลบ
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
