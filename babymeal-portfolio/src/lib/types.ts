export interface Profile {
    id: string
    full_name: string
    headline: string
    tagline: string
    introduction: string
    philosophy: string
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
    subtitle: string
    description: string
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
    icon: string
    items: string[]
    sort_order: number
    created_at: string
    updated_at: string
}
