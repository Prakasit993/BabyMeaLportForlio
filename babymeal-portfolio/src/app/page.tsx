import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/Hero'
import Introduction from '@/components/Introduction'
import Portfolio from '@/components/Portfolio'
import Philosophy from '@/components/Philosophy'
import TechStack from '@/components/TechStack'
import Footer from '@/components/Footer'
import LanguageSwitcher from '@/components/LanguageSwitcher'
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

  return (
    <main>
      <LanguageSwitcher />
      <Hero profile={profile} />
      <Introduction profile={profile} />
      <Portfolio projects={projects} />
      <Philosophy profile={profile} />
      <TechStack techStack={techStack} />
      <Footer />
    </main>
  )
}
