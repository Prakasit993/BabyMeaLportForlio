'use client'

import { motion, AnimatePresence, Variants } from 'framer-motion'
import type { Project } from '@/lib/types'
import { useLanguage } from '@/lib/context/language-context'

interface PortfolioProps {
    projects: Project[]
}

const defaultProjects: Project[] = [
    {
        id: '1',
        title: 'SmartShip',
        title_en: 'SmartShip',
        subtitle: 'AI-Powered ERP',
        subtitle_en: 'AI-Powered ERP',
        description: 'ระบบจัดการทรัพยากรและสต็อกสินค้าอัจฉริยะที่ใช้ AI ช่วยตัดสินใจในเชิงธุรกิจ รองรับการวิเคราะห์ข้อมูลแบบ Real-time และการคาดการณ์ยอดขายล่วงหน้า',
        description_en: 'Intelligent resource and stock management system using AI for business decision making. Supports real-time data analysis and advance sales forecasting.',
        icon: '🚀',
        tags: ['AI Integration', 'ERP System', 'Business Intelligence'],
        link_url: null,
        sort_order: 1,
        created_at: '',
        updated_at: ''
    },
    {
        id: '2',
        title: 'HelpMe CheckSystem',
        title_en: 'HelpMe CheckSystem',
        subtitle: 'Proactive Monitoring',
        subtitle_en: 'Proactive Monitoring',
        description: 'ระบบเฝ้าระวังโครงสร้างพื้นฐานไอทีอัตโนมัติ 24/7 เพื่อรับประกันความเสถียรระดับ Zero Downtime พร้อมแจ้งเตือนปัญหาก่อนเกิดขึ้นจริง',
        description_en: '24/7 automated IT infrastructure monitoring system ensuring zero downtime stability with proactive alerts for potential issues.',
        icon: '🛡️',
        tags: ['24/7 Monitoring', 'Zero Downtime', 'Auto Alerts'],
        link_url: null,
        sort_order: 2,
        created_at: '',
        updated_at: ''
    },
    {
        id: '3',
        title: 'Multi-tenant Architecture',
        title_en: 'Multi-tenant Architecture',
        subtitle: 'Scalable Infrastructure',
        subtitle_en: 'Scalable Infrastructure',
        description: 'การวางสถาปัตยกรรมที่รองรับหลายธุรกิจภายใต้ระบบจัดการเดียวอย่างปลอดภัยและคลีนที่สุด พร้อม Data Isolation และ Performance Optimization',
        description_en: 'Architectural design supporting multiple businesses under a single management system with maximum security and data isolation.',
        icon: '🏗️',
        tags: ['Multi-tenant', 'Data Security', 'Scalability'],
        link_url: null,
        sort_order: 3,
        created_at: '',
        updated_at: ''
    }
]

export default function Portfolio({ projects }: PortfolioProps) {
    const { locale, t } = useLanguage()
    const displayProjects = projects.length > 0 ? projects : defaultProjects

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
        }
    }

    return (
        <section className="py-32 relative overflow-hidden" id="portfolio">
            {/* Decoration */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-[var(--accent-secondary)]/10 blur-[120px] rounded-full -translate-x-1/2"></div>

            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="section-header max-w-3xl mx-auto text-center mb-20"
                >
                    <span className="inline-block px-4 py-1.5 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full mb-4">
                        <span className="text-[var(--accent-primary)] text-xs font-bold uppercase tracking-widest">Portfolio</span>
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">{t('portfolio.title')}</h2>
                    <p className="text-[var(--text-secondary)] text-lg">
                        {t('portfolio.description')}
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {displayProjects.map((project) => (
                        <motion.article
                            key={project.id}
                            variants={itemVariants}
                            className="glass-card p-1 group flex flex-col h-full overflow-hidden"
                        >
                            <div className="p-8 md:p-10 flex flex-col h-full bg-[var(--bg-secondary)]/40 rounded-[19px] border border-white/5 group-hover:bg-transparent transition-colors duration-500">
                                {/* Icon with spotlight */}
                                <div className="relative mb-10 w-16 h-16">
                                    <div className="absolute inset-0 bg-[var(--accent-primary)]/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                                    <div className="relative w-16 h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-3xl shadow-xl z-10 group-hover:-translate-y-1 transition-transform">
                                        {project.icon}
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-[var(--accent-primary)] transition-colors duration-300 antialiased tracking-tight">
                                        {locale === 'en' ? (project.title_en || project.title) : project.title}
                                    </h3>
                                    <p className="text-[var(--accent-tertiary)] text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase mb-8 opacity-90">
                                        {locale === 'en' ? (project.subtitle_en || project.subtitle) : project.subtitle}
                                    </p>
                                    <p className="text-[var(--text-secondary)] leading-[1.8] mb-10 line-clamp-4 font-normal text-sm md:text-base">
                                        {locale === 'en' ? (project.description_en || project.description) : project.description}
                                    </p>
                                </div>

                                <div className="mt-auto space-y-8 w-full">
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {project.tags.map((tag) => (
                                            <span key={tag} className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-xs md:text-sm font-semibold text-[var(--text-secondary)] group-hover:border-[var(--accent-primary)]/50 group-hover:text-[var(--text-primary)] group-hover:bg-[var(--accent-primary)]/10 transition-all shadow-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {project.link_url && (
                                        <a
                                            href={project.link_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 text-sm font-bold text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors group/link pt-2"
                                        >
                                            {t('portfolio.view_details')}
                                            <svg className="w-5 h-5 translate-x-0 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
