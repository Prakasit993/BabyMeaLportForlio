'use server'

import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me'

export async function loginAction(formData: FormData) {
    const email = (formData.get('email') as string).trim()
    const password = formData.get('password') as string

    const checkEmail = email.toLowerCase().trim()
    const targetEmail = 'prakasit993@gmail.com'
    const targetPassword = 'Prakasit2536@'

    if (checkEmail !== targetEmail) {
        return {
            error: `อีเมลไม่ตรงกับในระบบ`,
            details: `คุณพิมพ์: "${checkEmail}" | อีเมลที่ถูกต้องคือ: "${targetEmail}"`
        }
    }

    if (password !== targetPassword) {
        return {
            error: 'รหัสผ่านไม่ถูกต้อง',
            details: 'กรุณาตรวจสอบตัวเล็ก-ใหญ่ และอักขระพิเศษ'
        }
    }

    // Create JWT
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' })

    // Set Cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return { success: true }
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_token')
}

export async function getAdminSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    if (!token) return null

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { email: string }
        return decoded
    } catch {
        return null
    }
}
