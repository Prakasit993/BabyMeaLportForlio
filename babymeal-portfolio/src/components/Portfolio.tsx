'use client'

import { motion } from 'framer-motion'
import type { Project } from '@/lib/types'

interface PortfolioProps {
    projects: Project[]
}

const defaultProjects: Project[] = [
    {
        id: '1',
        title: 'SmartShip',
        subtitle: 'AI-Powered ERP',
        description: 'ระบบจัดการทรัพยากรและสต็อกสินค้าอัจฉริยะที่ใช้ AI ช่วยตัดสินใจในเชิงธุรกิจ รองรับการวิเคราะห์ข้อมูลแบบ Real-time และการคาดการณ์ยอดขายล่วงหน้า',
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
        subtitle: 'Proactive Monitoring',
        description: 'ระบบเฝ้าระวังโครงสร้างพื้นฐานไอทีอัตโนมัติ 24/7 เพื่อรับประกันความเสถียรระดับ Zero Downtime พร้อมแจ้งเตือนปัญหาก่อนเกิดขึ้นจริง',
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
        subtitle: 'Scalable Infrastructure',
        description: 'การวางสถาปัตยกรรมที่รองรับหลายธุรกิจภายใต้ระบบจัดการเดียวอย่างปลอดภัยและคลีนที่สุด พร้อม Data Isolation และ Performance Optimization',
        icon: '🏗️',
        tags: ['Multi-tenant', 'Data Security', 'Scalability'],
        link_url: null,
        sort_order: 3,
        created_at: '',
        updated_at: ''
    }
]

export default function Portfolio({ projects }: PortfolioProps) {
    const displayProjects = projects.length > 0 ? projects : defaultProjects

    return (
        <section className="py-24" id="portfolio">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="section-header"
                >
                    <span className="section-label">Portfolio</span>
                    <h2 className="section-title">ผลงานที่โดดเด่น</h2>
                    <p className="section-description">
                        ผลงานที่พิสูจน์การทำงานแบบ End-to-End ตั้งแต่การออกแบบโครงสร้างไปจนถึงการดูแลระบบ
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayProjects.map((project, index) => (
                        <motion.article
                            key={project.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card p-6 sm:p-8 md:p-10 relative overflow-hidden group"
                        >
                            {/* Top border animation */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>

                            {/* Icon */}
                            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[rgba(99,102,241,0.1)] to-[rgba(139,92,246,0.1)] rounded-2xl mb-6 text-3xl">
                                {project.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                            <p className="text-sm text-[var(--accent-tertiary)] font-medium mb-4">
                                {project.subtitle}
                            </p>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                                {project.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span key={tag} className="tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Link */}
                            {project.link_url && (
                                <a
                                    href={project.link_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 inline-flex items-center gap-2 text-[var(--accent-primary)] hover:underline"
                                >
                                    View Project
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            )}
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    )
}
