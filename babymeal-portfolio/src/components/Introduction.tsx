'use client'

import { motion } from 'framer-motion'
import type { Profile } from '@/lib/types'

interface IntroductionProps {
    profile: Profile | null
}

export default function Introduction({ profile }: IntroductionProps) {
    const defaultIntro = `สวัสดีครับ ผมเป็น Full-stack Developer ที่มีพื้นฐานจากการเป็นเจ้าของธุรกิจ 
ผมไม่ได้เริ่มต้นจากหน้าจอคอมพิวเตอร์ แต่เริ่มจากการมองหาโซลูชันเพื่อแก้ปัญหาจริงในธุรกิจส่วนตัว 
จนกลายเป็นความเชี่ยวชาญในการสร้างระบบที่ 'ทำเงิน' และ 'ประหยัดเวลา' ด้วยเทคโนโลยี 
Next.js, AI และ Automation`

    return (
        <section className="py-24 bg-[var(--bg-secondary)]" id="introduction">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="section-header"
                >
                    <span className="section-label">About Me</span>
                    <h2 className="section-title">แนะนำตัว</h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="quote-block">
                        <p className="text-base md:text-lg leading-relaxed text-[var(--text-secondary)] relative z-10">
                            {profile?.introduction || defaultIntro}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
