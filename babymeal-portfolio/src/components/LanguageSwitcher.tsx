'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/context/language-context'

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage()

    return (
        <div className="fixed top-6 right-6 z-[60] flex gap-2 p-1.5 bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-full backdrop-blur-3xl shadow-2xl">
            <button
                onClick={() => setLocale('th')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${locale === 'th'
                        ? 'bg-[var(--accent-primary)] text-white shadow-lg'
                        : 'text-[var(--text-muted)] hover:text-white'
                    }`}
            >
                TH
            </button>
            <button
                onClick={() => setLocale('en')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${locale === 'en'
                        ? 'bg-[var(--accent-primary)] text-white shadow-lg'
                        : 'text-[var(--text-muted)] hover:text-white'
                    }`}
            >
                EN
            </button>
        </div>
    )
}
