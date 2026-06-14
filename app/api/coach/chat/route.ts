import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText, convertToModelMessages } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { loadMemberContext, buildSystemPrompt } from '@/lib/coach/context'
import { validateModel } from '@/lib/coach/models'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

const DAILY_LIMIT = parseInt(process.env.COACH_DAILY_LIMIT ?? '50', 10)

async function embedText(text: string): Promise<number[] | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) return null

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ text: text.slice(0, 512) }),
    })
    if (!res.ok) return null
    const { embedding } = (await res.json()) as { embedding: number[] }
    return Array.isArray(embedding) ? embedding : null
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: 'OPENROUTER_API_KEY not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const today = new Date().toISOString().slice(0, 10)
  const { data: usage } = await supabase
    .from('coach_usage')
    .select('count')
    .eq('user_id', user.id)
    .eq('day', today)
    .single()

  if (usage && usage.count >= DAILY_LIMIT) {
    return new Response(
      JSON.stringify({ error: 'Daily message limit reached. Try again tomorrow.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const body = (await req.json()) as { messages: unknown[] }
  const threadId = req.headers.get('x-thread-id')
  const model = validateModel(req.headers.get('x-model'))

  const [memberCtx] = await Promise.all([loadMemberContext(supabase, user.id)])

  // Find last user message text for RAG
  type MsgPart = { type: string; text?: string }
  type Msg = { role: string; parts?: MsgPart[]; content?: string }
  const msgs = body.messages as Msg[]
  const lastUser = msgs.filter((m) => m.role === 'user').at(-1)
  const queryText =
    lastUser?.parts?.find((p) => p.type === 'text')?.text ??
    (typeof lastUser?.content === 'string' ? lastUser.content : '') ??
    ''

  // RAG
  type KnowledgeChunk = { id: string; source_label: string; chunk_text: string; similarity: number }
  let knowledgeBlock = ''
  let retrievedChunks: KnowledgeChunk[] = []

  if (queryText) {
    const embedding = await embedText(queryText)
    if (embedding) {
      const { data: chunks } = await supabase.rpc('match_knowledge_chunks', {
        query_embedding: embedding,
        match_count: 5,
        min_similarity: 0.3,
      })
      if (chunks && (chunks as KnowledgeChunk[]).length > 0) {
        retrievedChunks = chunks as KnowledgeChunk[]
        knowledgeBlock = retrievedChunks
          .map((c) => `[${c.source_label}]\n${c.chunk_text}`)
          .join('\n\n---\n\n')
      }
    }
  }

  const systemPrompt = buildSystemPrompt(memberCtx, knowledgeBlock)
  const modelMessages = await convertToModelMessages(
    body.messages as Parameters<typeof convertToModelMessages>[0],
  )

  const result = streamText({
    model: openrouter.chat(model),
    system: systemPrompt,
    messages: modelMessages,
    async onFinish({ text }) {
      if (!threadId) return

      const sourcesJson = retrievedChunks.map((c) => ({
        id: c.id,
        label: c.source_label,
        similarity: c.similarity,
      }))

      await Promise.all([
        supabase.from('coach_messages').insert({
          thread_id: threadId,
          role: 'user',
          content: queryText,
        }),
        supabase.from('coach_messages').insert({
          thread_id: threadId,
          role: 'coach',
          content: text,
          sources: sourcesJson,
          model,
        }),
        supabase
          .from('coach_threads')
          .update({ updated_at: new Date().toISOString(), model })
          .eq('id', threadId)
          .eq('user_id', user.id),
        supabase
          .from('coach_usage')
          .upsert(
            { user_id: user.id, day: today, count: (usage?.count ?? 0) + 1 },
            { onConflict: 'user_id,day' },
          ),
      ])
    },
  })

  return result.toUIMessageStreamResponse()
}
