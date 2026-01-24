'use client'

import { motion } from 'framer-motion'
import type { Profile } from '@/lib/types'
import { useLanguage } from '@/lib/context/language-context'

interface PhilosophyProps {
    profile: Profile | null
}

export default function Philosophy({ profile }: PhilosophyProps) {
    const { locale } = useLanguage()

    const defaultPhilosophy = locale === 'en'
        ? "I believe in Clean Code and Proactive Maintenance. My work doesn't stop at beautiful UX/UI, but extends to robust back-end systems and tight data security to support future business growth."
        : "ผมเชื่อในเรื่อง Clean Code และ Proactive Maintenance งานของผมจึงไม่ได้จบแค่ที่หน้าบ้านที่สวยงาม UX/UI แต่ต้องรวมถึงระบบหลังบ้าน Admin ที่ยืดหยุ่นและการจัดการความปลอดภัยข้อมูลที่รัดกุม เพื่อรองรับการเติบโตของธุรกิจในอนาคต"

    const philosophy = locale === 'en'
        ? (profile?.philosophy_en || profile?.philosophy || defaultPhilosophy)
        : (profile?.philosophy || defaultPhilosophy)

    return (
        <section className="py-24 bg-[var(--bg-secondary)]" id="philosophy">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="section-header"
                >
                    <span className="section-label">Philosophy</span>
                    <h2 className="section-title">{locale === 'en' ? 'Core Philosophy' : 'แนวคิดในการพัฒนา'}</h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="p-12 md:p-16 bg-gradient-to-br from-[rgba(99,102,241,0.1)] to-[rgba(139,92,246,0.1)] border border-[var(--border-glass)] rounded-3xl text-center">
                        {/* Quote Icon */}
                        <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center bg-[var(--bg-glass)] rounded-full text-4xl">
                            💡
                        </div>

                        {/* Philosophy Text */}
                        <p className="text-base md:text-lg leading-loose text-[var(--text-secondary)]">
                            {philosophy}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
