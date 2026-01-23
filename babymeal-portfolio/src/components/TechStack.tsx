'use client'

import { motion } from 'framer-motion'
import type { TechStack as TechStackType } from '@/lib/types'

interface TechStackProps {
    techStack: TechStackType[]
}

const defaultTechStack: TechStackType[] = [
    {
        id: '1',
        category: 'Frontend',
        icon: '🎨',
        items: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
        sort_order: 1,
        created_at: '',
        updated_at: ''
    },
    {
        id: '2',
        category: 'Backend & Data',
        icon: '⚙️',
        items: ['Supabase', 'PostgreSQL', 'Python', 'Node.js'],
        sort_order: 2,
        created_at: '',
        updated_at: ''
    },
    {
        id: '3',
        category: 'AI & Automation',
        icon: '🤖',
        items: ['n8n', 'OpenAI SDK', 'Webhook Integrations'],
        sort_order: 3,
        created_at: '',
        updated_at: ''
    },
    {
        id: '4',
        category: 'Infrastructure',
        icon: '☁️',
        items: ['Docker', 'System Monitoring', 'DevOps'],
        sort_order: 4,
        created_at: '',
        updated_at: ''
    }
]

export default function TechStack({ techStack }: TechStackProps) {
    const displayStack = techStack.length > 0 ? techStack : defaultTechStack

    return (
        <section className="py-24 pb-32" id="tech-stack">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="section-header"
                >
                    <span className="section-label">Tech Stack</span>
                    <h2 className="section-title">เทคโนโลยีที่ใช้</h2>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-4">
                    {displayStack.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-5 sm:p-6 md:p-8 bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-xl sm:rounded-2xl hover:border-[var(--accent-primary)] transition-all"
                        >
                            {/* Category Header */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[rgba(99,102,241,0.1)] to-[rgba(139,92,246,0.1)] rounded-xl text-xl">
                                    {category.icon}
                                </div>
                                <h3 className="font-semibold">{category.category}</h3>
                            </div>

                            {/* Tech Items */}
                            <div className="flex flex-wrap gap-2">
                                {category.items.map((item) => (
                                    <span key={item} className="tech-item">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
