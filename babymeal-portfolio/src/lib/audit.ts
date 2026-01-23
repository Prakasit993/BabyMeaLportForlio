import { createClient } from '@/lib/supabase/client'

interface AuditLogParams {
    action: 'INSERT' | 'UPDATE' | 'DELETE'
    tableName: string
    recordId?: string
    oldData?: Record<string, unknown>
    newData?: Record<string, unknown>
}

export async function logAudit({
    action,
    tableName,
    recordId,
    oldData,
    newData
}: AuditLogParams) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        await supabase.from('portfolio_audit_logs').insert({
            user_id: user.id,
            user_email: user.email,
            action,
            table_name: tableName,
            record_id: recordId,
            old_data: oldData || null,
            new_data: newData || null,
            user_agent: typeof window !== 'undefined' ? navigator.userAgent : null
        })
    } catch (error) {
        console.error('Failed to log audit:', error)
    }
}
