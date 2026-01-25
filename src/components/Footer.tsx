'use client'

import { useLanguage } from '@/lib/context/language-context'
import { Profile } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface FooterProps {
    profile: Profile | null
}

export default function Footer({ profile }: FooterProps) {
    const { t } = useLanguage()
    const currentYear = new Date().getFullYear()
    const [showLineQR, setShowLineQR] = useState(false)

    const navLinks = [
        { label: t('nav.home'), href: '#' },
        { label: t('nav.about'), href: '#introduction' },
        { label: t('nav.portfolio'), href: '#portfolio' },
        { label: t('nav.contact'), href: '#contact' }
    ]

    const handleLineClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setShowLineQR(true)
    }

    const lineUrl = profile?.social_links?.line
        ? (profile.social_links.line.startsWith('http')
            ? profile.social_links.line
            : `https://line.me/ti/p/~${profile.social_links.line}`)
        : ''

    return (
        <footer className="footer bg-[var(--bg-secondary)] pt-16 pb-8 border-t border-[var(--border-glass)] text-left relative">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Column 1: Brand & Info */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-2xl font-bold gradient-text">
                            {profile?.full_name_en || 'Portfolio'}
                        </h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm">
                            {profile?.tagline_en || profile?.tagline || 'Senior Full-stack AI Engineer creating scalable business solutions.'}
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest mb-2 opacity-80">
                            {t('footer.menu')}
                        </h4>
                        <nav className="flex flex-col gap-3">
                            {navLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm w-fit font-light"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Column 3: Contact & Social */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest mb-2 opacity-80">
                            {t('footer.contact')}
                        </h4>

                        {profile?.email && (
                            <a
                                href={`mailto:${profile.email}`}
                                className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {profile.email}
                            </a>
                        )}

                        <div className="flex gap-4 mt-2">
                            {profile?.social_links?.github && (
                                <a
                                    href={profile.social_links.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-[var(--bg-glass)] rounded-full text-[var(--text-secondary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all"
                                    title="GitHub"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                </a>
                            )}
                            {profile?.social_links?.linkedin && (
                                <a
                                    href={profile.social_links.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-[var(--bg-glass)] rounded-full text-[var(--text-secondary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all"
                                    title="LinkedIn"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                            )}
                            {profile?.social_links?.line && (
                                <button
                                    onClick={handleLineClick}
                                    className="p-2 bg-[var(--bg-glass)] rounded-full text-[var(--text-secondary)] hover:bg-[#06C755] hover:text-white transition-all cursor-pointer"
                                    title="LINE QR Code"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.047c-.052.308-.252 1.203 1.085.655 1.337-.548 7.207-4.245 9.832-7.261 1.771-1.996 2.125-3.791 2.125-5.726zM6.168 13.316h-2.063c-.19 0-.344-.155-.344-.344V8.143c0-.189.155-.344.344-.344.19 0 .344.155.344.344v4.484h1.719c.19 0 .344.155.344.344 0 .19-.155.345-.344.345zm2.844 0c-.19 0-.344-.155-.344-.344V8.143c0-.189.155-.344.344-.344.19 0 .344.155.344.344v4.829c0 .189-.155.344-.344.344zm5.507 0h-2.158c-.092 0-.179-.036-.244-.101l-1.637-1.649v1.406c0 .189-.155.344-.344.344-.19 0-.344-.155-.344-.344V8.143c0-.189.155-.344.344-.344.19 0 .344.155.344.344v1.547l1.637 1.642V8.143c0-.189.155-.344.344-.344.19 0 .344.155.344.344V12.972c0 .189-.154.344-.344.344zm5.181-2.417c0 .19-.155.344-.344.344h-1.719v1.729c0 .189-.155.344-.344.344s-.344-.155-.344-.344V8.143c0-.189.155-.344.344-.344h2.063c.19 0 .344.155.344.344s-.155.344-.344.344h-1.719v1.375h1.719c.189 0 .344.155.344.344z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-[var(--border-glass)] text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[var(--text-muted)] text-xs">
                        © {currentYear} {profile?.full_name_en || 'Senior Full-stack AI Engineer'}. All rights reserved.
                    </p>
                    <p className="text-[var(--text-muted)] text-xs">
                        {t('footer.built_with')}
                    </p>
                </div>
            </div>

            {/* LINE QR Code Modal */}
            <AnimatePresence>
                {showLineQR && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowLineQR(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full text-center relative shadow-2xl"
                        >
                            <button
                                onClick={() => setShowLineQR(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h3 className="text-xl font-bold text-gray-800 mb-2">Scan to Chat</h3>
                            <p className="text-gray-500 text-sm mb-6">Add me on LINE</p>

                            <div className="bg-white p-2 rounded-xl border-2 border-[#06C755]/20 inline-block mb-6 shadow-sm">
                                {/* Using a reliable QR code API */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(lineUrl)}`}
                                    alt="LINE QR Code"
                                    className="w-48 h-48 md:w-56 md:h-56 object-contain"
                                />
                            </div>

                            <a
                                href={lineUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-3 bg-[#06C755] text-white rounded-xl font-bold hover:bg-[#05b64d] transition-colors shadow-lg shadow-[#06C755]/20"
                            >
                                Open LINE App
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </footer>
    )
}
