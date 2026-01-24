'use client'

import { motion } from 'framer-motion'
import type { TechStack as TechStackType } from '@/lib/types'

interface TechStackProps {
    techStack: TechStackType[]
}

const defaultTechStack: TechStackType[] = [
    {
        id: '1',
        category: 'Frontend & Design',
        icon: '🎨',
        items: ['Next.js', 'Typescript', 'Tailwind', 'Framer', 'Figma', 'UI/UX'],
        sort_order: 1,
        created_at: '',
        updated_at: ''
    },
    {
        id: '2',
        category: 'Backend & Cloud',
        icon: '☁️',
        items: ['Supabase', 'Node.js', 'Python', 'Docker', 'PostgreSQL', 'AWS'],
        sort_order: 2,
        created_at: '',
        updated_at: ''
    },
    {
        id: '3',
        category: 'AI & Logic',
        icon: '🧠',
        items: ['OpenAI API', 'LangChain', 'n8n', 'Make', 'Claude', 'Automation'],
        sort_order: 3,
        created_at: '',
        updated_at: ''
    },
    {
        id: '4',
        category: 'Tools & DevOps',
        icon: '🛠️',
        items: ['Git', 'VS Code', 'Postman', 'Vercel', 'Monitoring', 'CI/CD'],
        sort_order: 4,
        created_at: '',
        updated_at: ''
    }
]

export default function TechStack({ techStack }: TechStackProps) {
    const displayStack = techStack.length > 0 ? techStack : defaultTechStack

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    }

    const categoryVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 30 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    }

    return (
        <section className="py-32 relative overflow-hidden" id="tech-stack">
            {/* Background elements */}
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[var(--accent-tertiary)]/5 blur-[150px] rounded-full translate-x-1/2 translate-y-1/2"></div>

            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="section-header text-center mb-20"
                >
                    <span className="inline-block px-4 py-1.5 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full mb-4">
                        <span className="text-[var(--accent-primary)] text-xs font-bold uppercase tracking-widest">Tech Stack</span>
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text italic antialiased">อาวุธที่ใช้สร้างสรรค์</h2>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {displayStack.map((category) => (
                        <motion.div
                            key={category.id}
                            variants={categoryVariants}
                            className="p-8 glass-card flex flex-col items-center text-center group h-full relative"
                        >
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--accent-primary)] transform scale-x-0 group-hover:scale-x-50 transition-transform origin-center duration-500 rounded-full"></div>

                            {/* Category Header */}
                            <div className="flex flex-col items-center gap-4 mb-8">
                                <div className="w-16 h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-3xl shadow-xl group-hover:-translate-y-2 group-hover:bg-white/10 transition-all duration-300">
                                    {category.icon}
                                </div>
                                <h3 className="font-bold text-xl text-[var(--text-primary)] tracking-tight">{category.category}</h3>
                            </div>

                            {/* Tech Items */}
                            <div className="flex flex-wrap justify-center gap-2.5 mt-auto">
                                {category.items.map((item) => (
                                    <motion.span
                                        key={item}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all cursor-default"
                                    >
                                        {item}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
