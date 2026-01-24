'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AuditLog {
    id: string
    user_email: string
    action: 'INSERT' | 'UPDATE' | 'DELETE'
    table_name: string
    created_at: string
    new_data: any
    old_data: any
}

export default function AuditLog() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLogs()
    }, [])

    async function fetchLogs() {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('portfolio_audit_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50)

            if (error) throw error
            setLogs(data || [])
        } catch (error) {
            console.error('Error fetching logs:', error)
        } finally {
            setLoading(false)
        }
    }

    const getActionColor = (action: string) => {
        switch (action) {
            case 'INSERT': return 'text-green-400 bg-green-400/10 border-green-400/20'
            case 'UPDATE': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
            case 'DELETE': return 'text-red-400 bg-red-400/10 border-red-400/20'
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
        }
    }

    const formatTableName = (name: string) => {
        return name.replace('portfolio_', '').replace('_', ' ').toUpperCase()
    }

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full" />
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">บันทึกกิจกรรมล่าสุด</h3>
                <button
                    onClick={fetchLogs}
                    className="p-2 hover:bg-[var(--bg-glass)] rounded-lg transition-colors text-sm"
                >
                    🔄 รีเฟรช
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-[var(--border-glass)] bg-[var(--bg-secondary)]/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-glass)] border-b border-[var(--border-glass)]">
                                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider uppercase">วัน-เวลา</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider uppercase">ผู้ใช้</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider uppercase">การกระทำ</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider uppercase">ตาราง</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider uppercase">ข้อมูล</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-glass)]">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-muted)]">
                                        ไม่พบข้อมูลการใช้งาน
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-[var(--bg-glass)] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {new Date(log.created_at).toLocaleString('th-TH')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-[10px]">
                                                    {log.user_email?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium">{log.user_email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                                            {formatTableName(log.table_name)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <details className="cursor-pointer group">
                                                <summary className="text-[var(--accent-primary)] hover:underline opacity-80 group-open:opacity-100 italic">
                                                    ดูรายละเอียด
                                                </summary>
                                                <div className="mt-2 p-3 rounded-lg bg-black/40 border border-[var(--border-glass)] overflow-x-auto">
                                                    <pre className="text-[10px] leading-relaxed">
                                                        {JSON.stringify({
                                                            before: log.old_data,
                                                            after: log.new_data
                                                        }, null, 2)}
                                                    </pre>
                                                </div>
                                            </details>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] italic">
                * ระบบจะบันทึก Log อัตโนมัติทุกครั้งที่มีการเปลี่ยนเปลงข้อมูลที่ระดับ Database
            </p>
        </div>
    )
}
