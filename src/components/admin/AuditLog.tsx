'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

import { useLanguage } from '@/lib/context/language-context'

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
    const { t, locale } = useLanguage()
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
                <h3 className="text-xl font-bold">{t('admin.tab.activity')}</h3>
                <button
                    onClick={fetchLogs}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-lg transition-all text-xs font-bold"
                >
                    🔄 {locale === 'th' ? 'รีเฟรช' : 'Refresh'}
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/5 bg-[var(--bg-secondary)]/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">
                                <th className="px-6 py-4">{locale === 'th' ? 'วัน-เวลา' : 'Date & Time'}</th>
                                <th className="px-6 py-4">{locale === 'th' ? 'ผู้ใช้' : 'User'}</th>
                                <th className="px-6 py-4">{locale === 'th' ? 'การกระทำ' : 'Action'}</th>
                                <th className="px-6 py-4">{locale === 'th' ? 'ตาราง' : 'Table'}</th>
                                <th className="px-6 py-4">{locale === 'th' ? 'ข้อมูล' : 'Data'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-muted)] text-sm italic">
                                        {locale === 'th' ? 'ไม่พบข้อมูลการใช้งาน' : 'No activity logs found'}
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-[11px] font-mono opacity-70">
                                            {new Date(log.created_at).toLocaleString(locale === 'th' ? 'th-TH' : 'en-US')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[9px] font-bold border border-white/10">
                                                    {log.user_email?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-xs">{log.user_email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[10px] text-[var(--text-secondary)] font-bold">
                                            {formatTableName(log.table_name)}
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            <details className="cursor-pointer group">
                                                <summary className="text-[var(--accent-primary)] hover:underline opacity-80 group-open:opacity-100 italic">
                                                    {locale === 'th' ? 'ดูรายละเอียด' : 'View Details'}
                                                </summary>
                                                <div className="mt-2 p-3 rounded-lg bg-black/40 border border-white/5 overflow-x-auto">
                                                    <pre className="text-[10px] leading-relaxed font-mono opacity-80">
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

            <p className="text-[10px] text-[var(--text-muted)] italic opacity-60">
                * {locale === 'th'
                    ? 'ระบบจะบันทึก Log อัตโนมัติทุกครั้งที่มีการเปลี่ยนเปลงข้อมูลที่ระดับ Database'
                    : 'System automatically logs every change made at the database level.'}
            </p>
        </div>
    )
}
