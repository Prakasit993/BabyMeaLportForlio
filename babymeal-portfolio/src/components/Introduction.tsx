'use client'

import { motion } from 'framer-motion'
import type { Profile } from '@/lib/types'
import { useLanguage } from '@/lib/context/language-context'

interface IntroductionProps {
    profile: Profile | null
}

export default function Introduction({ profile }: IntroductionProps) {
    const { locale, t } = useLanguage()

    const defaultIntro = locale === 'en'
        ? `Hi, I am a Full-stack Developer with a business background.
I didn't start from a computer screen, but from looking for solutions to solve real problems in my own business.
This has turned into an expertise in creating systems that 'make money' and 'save time' using
Next.js, AI, and Automation.`
        : `สวัสดีครับ ผมเป็น Full-stack Developer ที่มีพื้นฐานจากการเป็นเจ้าของธุรกิจ 
ผมไม่ได้เริ่มต้นจากหน้าจอคอมพิวเตอร์ แต่เริ่มจากการมองหาโซลูชันเพื่อแก้ปัญหาจริงในธุรกิจส่วนตัว 
จนกลายเป็นความเชี่ยวชาญในการสร้างระบบที่ 'ทำเงิน' และ 'ประหยัดเวลา' ด้วยเทคโนโลยี 
Next.js, AI และ Automation`

    const introduction = locale === 'en'
        ? (profile?.introduction_en || profile?.introduction || defaultIntro)
        : (profile?.introduction || defaultIntro)

    return (
        <section className="py-32 bg-[var(--bg-secondary)] relative overflow-hidden" id="introduction">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--accent-primary)]/5 to-transparent skew-x-12 translate-x-1/2"></div>

            <div className="container relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:w-1/3"
                    >
                        <div className="inline-block px-4 py-1.5 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full mb-6">
                            <span className="text-[var(--accent-primary)] text-xs font-bold uppercase tracking-widest">{t('about.label')}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">{t('about.title')}</h2>
                        <div className="w-20 h-1.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full"></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="lg:w-2/3"
                    >
                        <div className="glass-card p-8 md:p-12 relative group">
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-[var(--accent-primary)]/20 rounded-xl blur-xl group-hover:bg-[var(--accent-primary)]/40 transition-colors"></div>

                            <p className="text-lg md:text-xl leading-[1.8] text-[var(--text-secondary)] font-medium">
                                {introduction}
                            </p>

                            <div className="mt-10 flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-[var(--accent-tertiary)] hover:bg-white/10 transition-colors">
                                    <span>🎯</span> {locale === 'en' ? 'Problem Solver' : 'นักแก้ปัญหา'}
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-[var(--accent-tertiary)] hover:bg-white/10 transition-colors">
                                    <span>⚡</span> {locale === 'en' ? 'Efficiency First' : 'เน้นประสิทธิภาพ'}
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-[var(--accent-tertiary)] hover:bg-white/10 transition-colors">
                                    <span>📈</span> {locale === 'en' ? 'Result Driven' : 'มุ่งเน้นผลลัพธ์'}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
