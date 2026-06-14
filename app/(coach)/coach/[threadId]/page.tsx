import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatView } from '@/components/coach/ChatView'

interface PageProps {
  params: Promise<{ threadId: string }>
}

export default async function ThreadPage({ params }: PageProps) {
  const { threadId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify thread belongs to user
  const { data: thread } = await supabase
    .from('coach_threads')
    .select('id, model')
    .eq('id', threadId)
    .eq('user_id', user.id)
    .single()

  if (!thread) notFound()

  // Load messages
  const { data: messages } = await supabase
    .from('coach_messages')
    .select('id, role, content, sources, created_at')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })

  return (
    <ChatView
      threadId={threadId}
      initialDbMessages={(messages ?? []).map((m) => ({
        ...m,
        role: m.role as 'user' | 'coach',
        sources: Array.isArray(m.sources) ? m.sources : null,
      }))}
    />
  )
}
