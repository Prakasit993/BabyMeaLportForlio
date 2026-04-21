'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/lib/context/language-context'

interface CounterItem {
    value: number
    suffix?: string
    label: string
}

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [count, setCount] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' })

    useEffect(() => {
        if (!inView || hasAnimated) return

        const duration = 1200
        const start = performance.now()
        setHasAnimated(true)

        const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            setCount(Math.round(value * progress))
            if (progress < 1) requestAnimationFrame(tick)
        }

        requestAnimationFrame(tick)
    }, [inView, hasAnimated, value])

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    )
}

export default function ImpactCounters() {
    const { locale } = useLanguage()

    const counters: CounterItem[] = locale === 'en'
        ? [
            { value: 30, suffix: '%', label: 'Cost reduction from automation' },
            { value: 99, suffix: '.9%', label: 'System uptime target achieved' },
            { value: 70, suffix: '%', label: 'Faster incident response time' },
        ]
        : [
            { value: 30, suffix: '%', label: 'ลดต้นทุนจากระบบอัตโนมัติ' },
            { value: 99, suffix: '.9%', label: 'เป้าหมายเสถียรภาพระบบ' },
            { value: 70, suffix: '%', label: 'ลดเวลาแก้ปัญหาได้รวดเร็วขึ้น' },
        ]

    return (
        <section className="py-14 md:py-20 relative" aria-label="Key impact metrics">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="glass-card p-6 md:p-10 grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8"
                >
                    {counters.map((counter) => (
                        <div key={counter.label} className="text-center">
                            <div className="text-3xl md:text-4xl font-extrabold gradient-text mb-2">
                                <CountUp value={counter.value} suffix={counter.suffix} />
                            </div>
                            <p className="text-xs md:text-sm text-[var(--text-secondary)]">{counter.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
