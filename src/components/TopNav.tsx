'use client'

import { useLanguage } from '@/lib/context/language-context'

export default function TopNav() {
    const { t } = useLanguage()

    const links = [
        { href: '#home', label: t('nav.home') },
        { href: '#introduction', label: t('nav.about') },
        { href: '#portfolio', label: t('nav.portfolio') },
        { href: '#tech-stack', label: t('nav.tech') },
        { href: '#contact', label: t('nav.contact') },
    ]

    return (
        <nav
            aria-label="Primary navigation"
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-2 px-2 py-2 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-full backdrop-blur-3xl shadow-2xl"
        >
            {links.map((link) => (
                <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-colors"
                >
                    {link.label}
                </a>
            ))}
        </nav>
    )
}
