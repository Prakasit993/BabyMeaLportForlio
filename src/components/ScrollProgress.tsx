'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 20,
        restDelta: 0.001,
    })

    return (
        <motion.div
            aria-hidden
            className="fixed top-0 left-0 right-0 z-[80] h-1 origin-left bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] shadow-[0_0_14px_rgba(99,102,241,0.45)]"
            style={{ scaleX }}
        />
    )
}
