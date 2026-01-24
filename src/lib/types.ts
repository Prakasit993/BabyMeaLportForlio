export interface Profile {
    id: string
    full_name: string
    full_name_en?: string
    headline: string
    headline_en?: string
    tagline: string
    tagline_en?: string
    introduction: string
    introduction_en?: string
    philosophy: string
    philosophy_en?: string
    avatar_url: string | null
    email: string | null
    social_links: {
        github?: string
        linkedin?: string
        line?: string
    } | null
    created_at: string
    updated_at: string
}

export interface Project {
    id: string
    title: string
    title_en?: string
    subtitle: string
    subtitle_en?: string
    description: string
    description_en?: string
    icon: string
    tags: string[]
    link_url: string | null
    sort_order: number
    created_at: string
    updated_at: string
}

export interface TechStack {
    id: string
    category: string
    category_en?: string
    icon: string
    items: string[]
    sort_order: number
    created_at: string
    updated_at: string
}
