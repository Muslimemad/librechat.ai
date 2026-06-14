import { redirect } from 'next/navigation'
import { Anton, Inter } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { CoachProvider } from '@/components/coach/CoachProvider'
import { Sidebar } from '@/components/coach/Sidebar'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'AI Coach — WealthCreators',
  description: 'Your personal AI wealth coach',
}

export default async function CoachLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [threadsResult, profileResult] = await Promise.all([
    supabase
      .from('coach_threads')
      .select('id, title, created_at, updated_at, model')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(100),
    supabase.from('profiles').select('display_name, tier, avatar_url').eq('id', user.id).single(),
  ])

  const threads = threadsResult.data ?? []
  const profile = profileResult.data ?? {
    display_name: user.email?.split('@')[0] ?? 'Member',
    tier: 'free_affiliate',
    avatar_url: null,
  }

  return (
    <div className={`${anton.variable} ${inter.variable} theme-coach`}>
      <CoachProvider
        user={{ id: user.id, email: user.email ?? '' }}
        profile={profile}
        initialThreads={threads}
      >
        <div className="flex h-screen overflow-hidden bg-[hsl(var(--coach-bg))] text-[hsl(var(--coach-fg))]">
          <Sidebar />
          <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
        </div>
      </CoachProvider>
    </div>
  )
}
