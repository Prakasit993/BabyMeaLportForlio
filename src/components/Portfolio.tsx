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
        subtitle: 'AI-Powered ERP · ระบบ ERP อัจฉริยะ',
        subtitle_en: 'AI-Powered ERP · Smart Resource Management',
        description: 'ปัญหา: ธุรกิจสูญเสียรายได้จากการจัดการสต็อกที่ไม่แม่นยำและการตัดสินใจล่าช้า\n\nแก้ปัญหาด้วย: ระบบ ERP ที่ฝัง AI คาดการณ์ยอดขายล่วงหน้าได้แม่นยำสูง วิเคราะห์ข้อมูลแบบ Real-time และแนะนำการตัดสินใจทางธุรกิจโดยอัตโนมัติ\n\nวัดผลได้: ลดของเสียจากสต็อกส่วนเกินลง 30% · เพิ่มความแม่นยำการคาดการณ์ยอดขายเป็น 90%+ · ลดเวลาตัดสินใจจากหลายชั่วโมงเหลือไม่กี่นาที',
        description_en: 'Problem: Businesses lose revenue due to inaccurate stock management and delayed decisions.\n\nSolution: An ERP system with embedded AI that accurately forecasts sales, provides real-time analytics, and automates business decision recommendations.\n\nMeasurable Impact: 30% reduction in overstock waste · 90%+ forecast accuracy · Decision time cut from hours to minutes',
        icon: '🚀',
        tags: ['AI Integration', 'ERP System', 'Business Intelligence', 'Real-time Analytics'],
        link_url: null,
        sort_order: 1,
        created_at: '',
        updated_at: ''
    },
    {
        id: '2',
        title: 'HelpMe CheckSystem',
        title_en: 'HelpMe CheckSystem',
        subtitle: 'Proactive IT Monitoring · ระบบเฝ้าระวังเชิงรุก',
        subtitle_en: 'Proactive IT Monitoring · Zero Downtime Guardian',
        description: 'ปัญหา: ระบบล่มโดยไม่มีสัญญาณเตือนล่วงหน้า ทำให้ธุรกิจหยุดชะงักและสูญเสียความเชื่อมั่นจากลูกค้า\n\nแก้ปัญหาด้วย: ระบบเฝ้าระวัง IT Infrastructure แบบ 24/7 ที่ตรวจจับความผิดปกติตั้งแต่เนิ่นๆ แจ้งเตือนอัตโนมัติก่อนเกิดปัญหาจริง พร้อม Dashboard แสดงสถานะ Real-time\n\nวัดผลได้: Uptime ระดับ 99.9% · ตรวจจับปัญหาได้เร็วกว่าการแจ้งเตือนแบบเดิม 5 เท่า · ลดเวลา Response ต่อเหตุฉุกเฉินลง 70%',
        description_en: 'Problem: Systems crash without warning, causing business disruption and eroding customer trust.\n\nSolution: A 24/7 IT infrastructure watchdog that detects anomalies early, triggers automated alerts before failures occur, and provides a real-time health dashboard.\n\nMeasurable Impact: 99.9% uptime guarantee · 5x faster issue detection vs. traditional methods · 70% reduction in emergency response time',
        icon: '🛡️',
        tags: ['24/7 Monitoring', 'Zero Downtime', 'Auto Alerts', 'Proactive Detection'],
        link_url: null,
        sort_order: 2,
        created_at: '',
        updated_at: ''
    },
    {
        id: '3',
        title: 'Multi-tenant Architecture',
        title_en: 'Multi-tenant Architecture',
        subtitle: 'Scalable SaaS Infrastructure · สถาปัตยกรรมรองรับหลายธุรกิจ',
        subtitle_en: 'Scalable SaaS Infrastructure · Secure Multi-business Platform',
        description: 'ปัญหา: การรัน Software แยกสำหรับแต่ละลูกค้าทำให้ค่าใช้จ่าย Server พุ่งสูง และยากต่อการดูแลรักษาระบบ\n\nแก้ปัญหาด้วย: ออกแบบสถาปัตยกรรม Multi-tenant ที่หลายธุรกิจใช้งานระบบเดียวกันได้ มีการแยก Data อย่างปลอดภัย 100% ไม่มีการปนกันระหว่างลูกค้า พร้อม Scale ได้อัตโนมัติตามปริมาณการใช้งาน\n\nวัดผลได้: ลดต้นทุน Infrastructure ได้ 60%+ · รองรับลูกค้าเพิ่มขึ้นโดยไม่ต้องเพิ่ม Server เชิงเส้น · Zero Data Breach ระหว่าง Tenants',
        description_en: 'Problem: Running separate software per client drives infrastructure costs sky-high and makes maintenance a nightmare.\n\nSolution: A multi-tenant architecture where multiple businesses share one platform with 100% secure data isolation between clients and automatic scaling based on usage.\n\nMeasurable Impact: 60%+ reduction in infrastructure costs · Non-linear client growth without linear server costs · Zero cross-tenant data breaches',
        icon: '🏗️',
        tags: ['Multi-tenant', 'Data Isolation', 'Scalability', 'SaaS Architecture'],
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
                    transition={{ duration: 0.8 }}
                    className="section-header max-w-4xl mx-auto"
                >
                    {/* Decorative Background Element for Header */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-[var(--accent-primary)]/5 blur-[80px] rounded-full -z-10"></div>

                    <div className="section-label">
                        {t('portfolio.label') || 'Portfolio'}
                    </div>

                    <h2 className="section-title !mb-10">
                        {t('portfolio.title')}
                    </h2>

                    <div className="flex flex-col items-center gap-8">
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent rounded-full opacity-30"></div>

                        <p className="section-description">
                            {t('portfolio.description')}
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {displayProjects.map((project) => {
                        const CardWrapper = project.link_url ? motion.a : motion.article;
                        const wrapperProps = project.link_url ? {
                            href: project.link_url,
                            target: "_blank",
                            rel: "noopener noreferrer",
                        } : {};

                        return (
                            <CardWrapper
                                key={project.id}
                                variants={itemVariants}
                                {...wrapperProps}
                                className="glass-card p-1 group flex flex-col h-full overflow-hidden cursor-pointer no-underline"
                            >
                                <div className="p-8 md:p-10 flex flex-col h-full bg-[var(--bg-secondary)]/40 rounded-[19px] border border-white/5 group-hover:bg-transparent transition-colors duration-500 items-center text-center">
                                    {/* Media or Icon with spotlight */}
                                    <div className="relative mb-8 w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group-hover:border-[var(--accent-primary)]/30 transition-colors duration-500 bg-white/5">
                                        <div className="absolute inset-0 bg-[var(--accent-primary)]/5 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                        {project.video_url ? (
                                            <video
                                                src={project.video_url}
                                                className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                                                autoPlay muted loop playsInline
                                            />
                                        ) : project.image_url ? (
                                            <img
                                                src={project.image_url}
                                                alt={project.title}
                                                className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-5xl group-hover:scale-125 transition-transform duration-500">
                                                {project.icon}
                                            </div>
                                        )}

                                        {/* Glass Overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>

                                    <div className="flex-grow w-full flex flex-col justify-center items-center">
                                        <h3 className="text-2xl md:text-3xl font-bold mb-6 group-hover:text-[var(--accent-primary)] transition-colors duration-300 antialiased tracking-tight text-center">
                                            {locale === 'en' ? (project.title_en || project.title) : (project.title || project.title_en)}
                                        </h3>
                                        <p className="text-[var(--accent-tertiary)] text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase mb-10 opacity-90 text-center">
                                            {locale === 'en' ? (project.subtitle_en || project.subtitle) : (project.subtitle || project.subtitle_en)}
                                        </p>
                                        <div className="w-full mb-8 rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
                                            {(() => {
                                                const raw = (locale === 'en'
                                                    ? (project.description_en || project.description)
                                                    : (project.description || project.description_en)) || ''

                                                const sectionDefs = locale === 'en'
                                                    ? [
                                                        { pattern: /Problem\s*:/, step: '01', label: 'Problem', accent: 'from-purple-500/20 to-transparent', dot: 'bg-purple-500/30 text-purple-300 border-purple-500/30' },
                                                        { pattern: /Solution\s*:/, step: '02', label: 'Solution', accent: 'from-blue-500/20 to-transparent', dot: 'bg-blue-500/30 text-blue-300 border-blue-500/30' },
                                                        { pattern: /Measurable Impact\s*:/, step: '03', label: 'Impact', accent: 'from-emerald-500/20 to-transparent', dot: 'bg-emerald-500/30 text-emerald-300 border-emerald-500/30' },
                                                    ]
                                                    : [
                                                        { pattern: /ปัญหา\s*:/, step: '01', label: 'ปัญหา', accent: 'from-purple-500/20 to-transparent', dot: 'bg-purple-500/30 text-purple-300 border-purple-500/30' },
                                                        { pattern: /แก้ปัญหาด้วย\s*:/, step: '02', label: 'แนวทาง', accent: 'from-blue-500/20 to-transparent', dot: 'bg-blue-500/30 text-blue-300 border-blue-500/30' },
                                                        { pattern: /วัดผลได้\s*:/, step: '03', label: 'ผลลัพธ์', accent: 'from-emerald-500/20 to-transparent', dot: 'bg-emerald-500/30 text-emerald-300 border-emerald-500/30' },
                                                    ]

                                                const splitRegex = new RegExp(
                                                    `(${sectionDefs.map(s => s.pattern.source).join('|')})`, 'g'
                                                )
                                                const parts = raw.split(splitRegex).filter(p => p.trim())

                                                const sections: { def: typeof sectionDefs[0]; body: string }[] = []
                                                let i = 0
                                                while (i < parts.length) {
                                                    const matched = sectionDefs.find(s => s.pattern.test(parts[i]))
                                                    if (matched) {
                                                        sections.push({ def: matched, body: (parts[i + 1] || '').trim() })
                                                        i += 2
                                                    } else { i++ }
                                                }

                                                if (sections.length === 0) {
                                                    return (
                                                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed text-left px-5 py-4">
                                                            {raw}
                                                        </p>
                                                    )
                                                }

                                                return sections.map((sec, idx) => {
                                                    // Smart body: split by "1. 2. 3." or "·" into list items
                                                    const numberedItems = sec.body
                                                        .split(/(?=\d+\.\s)/)
                                                        .map(s => s.replace(/^\d+\.\s*/, '').trim())
                                                        .filter(Boolean)

                                                    const dotItems = sec.body
                                                        .split(' · ')
                                                        .map(s => s.trim())
                                                        .filter(Boolean)

                                                    const isList = numberedItems.length > 1
                                                    const isDot = !isList && dotItems.length > 1

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`flex items-start gap-4 px-5 py-4 bg-gradient-to-r ${sec.def.accent}`}
                                                        >
                                                            {/* Step badge */}
                                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-bold ${sec.def.dot} mt-0.5`}>
                                                                {sec.def.step}
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex-1 min-w-0 text-left">
                                                                <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 mb-2">
                                                                    {sec.def.label}
                                                                </p>

                                                                {isList ? (
                                                                    // Numbered list → pill rows
                                                                    <ul className="space-y-1.5">
                                                                        {numberedItems.map((item, i) => (
                                                                            <li key={i} className="flex items-start gap-2">
                                                                                <span className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold border ${sec.def.dot}`}>
                                                                                    {i + 1}
                                                                                </span>
                                                                                <span className="text-[var(--text-secondary)] text-xs md:text-sm leading-relaxed group-hover:text-[var(--text-primary)] transition-colors">
                                                                                    {item}
                                                                                </span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                ) : isDot ? (
                                                                    // · separated → metric pills
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {dotItems.map((item, i) => (
                                                                            <span key={i} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-semibold border ${sec.def.dot} bg-white/5`}>
                                                                                <span className="opacity-60">✓</span>
                                                                                {item}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    // Plain text
                                                                    <p className="text-[var(--text-secondary)] text-xs md:text-sm leading-relaxed group-hover:text-[var(--text-primary)] transition-colors">
                                                                        {sec.body}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            })()}
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-8 w-full">
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {project.tags.map((tag) => (
                                                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] md:text-xs font-semibold text-[var(--text-secondary)] group-hover:border-[var(--accent-primary)]/30 group-hover:text-[var(--text-primary)] transition-all">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {project.link_url && (
                                            <div className="inline-flex items-center gap-3 text-sm font-bold text-[var(--accent-primary)] group-hover:text-[var(--accent-secondary)] transition-colors group/link pt-2 justify-center">
                                                {t('portfolio.view_details')}
                                                <svg className="w-5 h-5 translate-x-0 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardWrapper>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    )
}
