import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/Hero'
import Introduction from '@/components/Introduction'
import Portfolio from '@/components/Portfolio'
import Philosophy from '@/components/Philosophy'
import TechStack from '@/components/TechStack'
import Footer from '@/components/Footer'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import TopNav from '@/components/TopNav'
import ScrollProgress from '@/components/ScrollProgress'
import ImpactCounters from '@/components/ImpactCounters'
import type { Profile, Project, TechStack as TechStackType } from '@/lib/types'

async function getProfile(): Promise<Profile | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('portfolio_profile')
      .select('*')
      .single()
    return data
  } catch {
    return null
  }
}

async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('sort_order', { ascending: true })
    return data || []
  } catch {
    return []
  }
}

async function getTechStack(): Promise<TechStackType[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('portfolio_tech_stack')
      .select('*')
      .order('sort_order', { ascending: true })
    return data || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [profile, projects, techStack] = await Promise.all([
    getProfile(),
    getProjects(),
    getTechStack()
  ])

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile?.full_name || profile?.full_name_en || 'Business Solution Architect',
    jobTitle: profile?.headline_en || profile?.headline || 'System Engineer / Automation Engineer',
    email: profile?.email || undefined,
    sameAs: [
      profile?.social_links?.github,
      profile?.social_links?.linkedin,
      profile?.social_links?.line,
    ].filter(Boolean),
  }

  return (
    <main>
      <ScrollProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <TopNav />
      <LanguageSwitcher />
      <Hero profile={profile} />
      <ImpactCounters />
      <Introduction profile={profile} />
      <Portfolio projects={projects} />
      <Philosophy profile={profile} />
      <TechStack techStack={techStack} />
      <Footer profile={profile} />
    </main>
  )
}
