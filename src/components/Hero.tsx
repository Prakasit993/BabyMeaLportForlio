'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import type { Profile } from '@/lib/types'
import { useLanguage } from '@/lib/context/language-context'

interface HeroProps {
    profile: Profile | null
}

export default function Hero({ profile }: HeroProps) {
    const { locale, t } = useLanguage()
    const [displayText, setDisplayText] = useState('')

    // Choose correct content based on locale with robust fallback
    const headline = locale === 'en'
        ? (profile?.headline_en || profile?.headline || 'Senior Full-stack AI Engineer')
        : (profile?.headline || profile?.headline_en || 'Senior Full-stack AI Engineer')

    const tagline = locale === 'en'
        ? (profile?.tagline_en || profile?.tagline || 'Bridging Complex Business Logic with Scalable AI Automation')
        : (profile?.tagline || profile?.tagline_en || 'Bridging Complex Business Logic with Scalable AI Automation')

    const containerRef = useRef<HTMLDivElement>(null)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springX = useSpring(mouseX, { stiffness: 100, damping: 30 })
    const springY = useSpring(mouseY, { stiffness: 100, damping: 30 })

    // Typewriter effect
    useEffect(() => {
        let i = 0
        setDisplayText('') // Reset on headline change
        const timer = setInterval(() => {
            setDisplayText(headline.slice(0, i))
            i++
            if (i > headline.length) clearInterval(timer)
        }, 50)
        return () => clearInterval(timer)
    }, [headline])

    // Mouse movement
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return
            const { left, top } = containerRef.current.getBoundingClientRect()
            mouseX.set(e.clientX - left)
            mouseY.set(e.clientY - top)
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [mouseX, mouseY])

    return (
        <section
            ref={containerRef}
            className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-10 relative spotlight-area"
            style={{
                '--mouse-x': `${springX.get()}px`,
                '--mouse-y': `${springY.get()}px`,
            } as any}
        >
            {/* Mouse Spotlight */}
            <div className="spotlight"></div>

            {/* Avatar */}
            {profile?.avatar_url && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2
                    }}
                    className="mb-10 relative z-20"
                >
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[var(--accent-primary)] shadow-2xl p-1 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]">
                        <div className="w-full h-full rounded-full overflow-hidden bg-[var(--bg-primary)] p-0.5">
                            <Image
                                src={profile.avatar_url}
                                alt={profile.full_name || 'Profile'}
                                fill
                                className="object-cover rounded-full"
                                priority
                            />
                        </div>
                    </div>
                    {/* Floating decoration orb behind avatar */}
                    <div className="absolute -inset-4 bg-[var(--accent-primary)]/20 blur-3xl -z-10 animate-pulse"></div>
                </motion.div>
            )}

            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="inline-flex items-center gap-3 px-6 py-2.5 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-full text-xs sm:text-sm text-[var(--text-secondary)] mb-8 backdrop-blur-2xl shadow-xl relative z-20"
            >
                <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-green)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent-green)]"></span>
                </span>
                <span className="font-semibold tracking-wide uppercase opacity-90">{t('hero.available')}</span>
            </motion.div>

            {/* Title with Typewriter */}
            <div className="min-h-[100px] sm:min-h-[120px] mb-8 relative z-20">
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold gradient-text leading-[1.1] tracking-tight px-4 antialiased">
                    {displayText}
                    <span className="animate-pulse border-r-8 border-[var(--accent-primary)] opacity-50">&nbsp;</span>
                </h1>
            </div>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-2xl sm:text-3xl md:text-4xl text-[var(--text-secondary)] mb-20 font-extralight tracking-tight relative z-20"
            >
                {profile?.full_name || 'Business Solution Architect'}
            </motion.p>

            {/* Tagline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="relative z-20 max-w-2xl mx-auto px-4 mb-20"
            >
                <div className="px-10 py-10 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-2xl backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <p className="text-xl sm:text-2xl md:text-3xl text-[var(--accent-tertiary)] leading-relaxed">
                        &quot;{tagline}&quot;
                    </p>
                </div>
            </motion.div>

            {/* Social Links */}
            {profile?.social_links && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                    className="flex gap-14 mt-24 relative z-20"
                >
                    {profile.social_links.github && (
                        <a
                            href={profile.social_links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-2xl hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 hover:-translate-y-1 active:scale-95 transition-all text-[var(--text-secondary)] hover:text-[var(--accent-primary)] shadow-lg"
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                        </a>
                    )}
                    {profile.social_links.linkedin && (
                        <a
                            href={profile.social_links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-2xl hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 hover:-translate-y-1 active:scale-95 transition-all text-[var(--text-secondary)] hover:text-[var(--accent-primary)] shadow-lg"
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                    )}
                    {profile.email && (
                        <a
                            href={`mailto:${profile.email}`}
                            className="p-4 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-2xl hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 hover:-translate-y-1 active:scale-95 transition-all text-[var(--text-secondary)] hover:text-[var(--accent-primary)] shadow-lg"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </a>
                    )}
                </motion.div>
            )}

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 relative z-20 group cursor-pointer"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 group-hover:opacity-100 transition-opacity duration-500 text-[var(--text-primary)] mb-1">
                    {t('hero.scroll')}
                </span>

                <div className="relative">
                    {/* Mouse Frame */}
                    <div className="w-6 h-10 border-2 border-[var(--border-glass)] rounded-full flex justify-center p-1.5 bg-[var(--bg-glass)] backdrop-blur-md group-hover:border-[var(--accent-primary)]/50 transition-colors duration-500">
                        {/* Animated Wheel */}
                        <motion.div
                            animate={{
                                y: [0, 14, 0],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut"
                            }}
                            className="w-1 h-2 bg-gradient-to-b from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full shadow-[0_0_8px_var(--accent-primary)]"
                        ></motion.div>
                    </div>

                    {/* Subtle Glow behind mouse */}
                    <div className="absolute inset-0 bg-[var(--accent-primary)]/10 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>

                {/* Pulsing Chevrons */}
                <div className="flex flex-col items-center -mt-1 scale-75">
                    <motion.svg
                        animate={{ y: [0, 5, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                        className="w-4 h-4 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                </div>
            </motion.div>
        </section>
    )
}
