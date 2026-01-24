import { createClient } from '@/lib/supabase/client'

interface AuditLogParams {
    action: 'INSERT' | 'UPDATE' | 'DELETE'
    tableName: string
    recordId?: string
    oldData?: Record<string, unknown>
    newData?: Record<string, unknown>
    userEmail?: string // Add this
}

export async function logAudit({
    action,
    tableName,
    recordId,
    oldData,
    newData,
    userEmail // Add this
}: AuditLogParams) {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        // Use Supabase user if available, otherwise use passed email
        const actorEmail = user?.email || userEmail || 'system@webapp'
        const actorId = user?.id || null

        await supabase.from('portfolio_audit_logs').insert({
            user_id: actorId,
            user_email: actorEmail,
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
