import { createClient } from '@/lib/supabase/server'
import { NewChatView } from '@/components/coach/ChatView'

export default async function CoachPage() {
  const supabase = await createClient()

  const { data: prompts } = await supabase
    .from('coach_starter_prompts')
    .select('id, group, title, description, prompt_text')
    .order('id', { ascending: true })
    .limit(12)

  return <NewChatView presetPrompts={prompts ?? []} />
}
