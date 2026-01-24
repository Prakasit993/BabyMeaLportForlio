'use client'

import { useLanguage } from '@/lib/context/language-context'

export default function Footer() {
    const { t } = useLanguage()
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer py-12">
            <p className="text-[var(--text-muted)] text-sm text-center px-4">
                © {currentYear} Senior Full-stack AI Engineer. {t('footer.built_with')}
            </p>
        </footer>
    )
}
