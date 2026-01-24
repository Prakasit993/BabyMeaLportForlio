import { createClient } from '@/lib/supabase/client'
import {
    startRegistration,
    startAuthentication,
    browserSupportsWebAuthn
} from '@simplewebauthn/browser'

const RP_NAME = 'Portfolio Admin'
const RP_ID = typeof window !== 'undefined' ? window.location.hostname : 'localhost'

export function isWebAuthnSupported(): boolean {
    return browserSupportsWebAuthn()
}

// Generate registration options (call from server ideally)
export async function registerPasskey(deviceName?: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    // Generate challenge
    const challenge = crypto.getRandomValues(new Uint8Array(32))
    const challengeBase64 = btoa(String.fromCharCode(...challenge))

    const registrationOptions = {
        challenge: challengeBase64,
        rp: {
            name: RP_NAME,
            id: RP_ID
        },
        user: {
            id: user.id,
            name: user.email || 'admin',
            displayName: user.email || 'Admin User'
        },
        pubKeyCredParams: [
            { alg: -7, type: 'public-key' as const },   // ES256
            { alg: -257, type: 'public-key' as const }  // RS256
        ],
        timeout: 60000,
        attestation: 'none' as const,
        authenticatorSelection: {
            authenticatorAttachment: 'platform' as const,
            userVerification: 'required' as const,
            residentKey: 'preferred' as const
        }
    }

    try {
        const credential = await startRegistration({ optionsJSON: registrationOptions })

        // Store credential in database
        const { error } = await supabase.from('portfolio_passkeys').insert({
            user_id: user.id,
            credential_id: credential.id,
            public_key: JSON.stringify(credential.response),
            device_name: deviceName || 'Unknown Device'
        })

        if (error) throw error

        return { success: true, credentialId: credential.id }
    } catch (error) {
        console.error('Passkey registration failed:', error)
        throw error
    }
}

export async function verifyPasskey() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    // Get user's registered passkeys
    const { data: passkeys } = await supabase
        .from('portfolio_passkeys')
        .select('credential_id')
        .eq('user_id', user.id)

    if (!passkeys || passkeys.length === 0) {
        throw new Error('No passkeys registered')
    }

    const challenge = crypto.getRandomValues(new Uint8Array(32))
    const challengeBase64 = btoa(String.fromCharCode(...challenge))

    const authenticationOptions = {
        challenge: challengeBase64,
        timeout: 60000,
        rpId: RP_ID,
        allowCredentials: passkeys.map(p => ({
            id: p.credential_id,
            type: 'public-key' as const
        })),
        userVerification: 'required' as const
    }

    try {
        const credential = await startAuthentication({ optionsJSON: authenticationOptions })

        // Update last used timestamp
        await supabase
            .from('portfolio_passkeys')
            .update({ last_used_at: new Date().toISOString() })
            .eq('credential_id', credential.id)

        return { success: true, credentialId: credential.id }
    } catch (error) {
        console.error('Passkey verification failed:', error)
        throw error
    }
}

export async function getRegisteredPasskeys() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data } = await supabase
        .from('portfolio_passkeys')
        .select('id, credential_id, device_name, created_at, last_used_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return data || []
}

export async function deletePasskey(id: string) {
    const supabase = createClient()
    const { error } = await supabase
        .from('portfolio_passkeys')
        .delete()
        .eq('id', id)

    if (error) throw error
    return { success: true }
}
