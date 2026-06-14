'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { UIMessage } from 'ai'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Message, TypingIndicator } from './Message'
import { Composer } from './Composer'
import { useCoach } from './CoachProvider'
import { DEFAULT_COACH_MODEL } from '@/lib/coach/models'

interface ChatSource {
  id: string
  label: string
  similarity: number
}

interface DbMessage {
  id: string
  role: 'user' | 'coach'
  content: string
  sources: ChatSource[] | null
  created_at: string
}

function dbMessagesToUIMessages(dbMsgs: DbMessage[]): UIMessage[] {
  return dbMsgs.map((m) => ({
    id: m.id,
    role: m.role === 'coach' ? ('assistant' as const) : ('user' as const),
    parts: [{ type: 'text' as const, text: m.content }],
    content: m.content,
    metadata: m.sources ? { sources: m.sources } : undefined,
  }))
}

interface ChatViewProps {
  threadId: string
  initialDbMessages?: DbMessage[]
}

export function ChatView({ threadId, initialDbMessages }: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [model, setModel] = useState(DEFAULT_COACH_MODEL)
  const modelRef = useRef(model)
  modelRef.current = model

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/coach/chat',
        headers: () => ({
          'x-thread-id': threadId,
          'x-model': modelRef.current,
        }),
      }),
    // threadId is stable per page; modelRef is a ref so not needed in deps

    [threadId],
  )

  const initialMessagesRef = useRef(
    initialDbMessages ? dbMessagesToUIMessages(initialDbMessages) : undefined,
  )
  const initialMessages = initialMessagesRef.current

  const [input, setInput] = useState('')
  const { messages, sendMessage, status } = useChat({
    id: `coach-${threadId}`,
    transport,
    messages: initialMessages,
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // Pick up pending initial message (from new-chat flow)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const pending = sessionStorage.getItem('coach-init-msg')
    if (pending) {
      sessionStorage.removeItem('coach-init-msg')
      sendMessage({ text: pending })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = useCallback(() => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    sendMessage({ text })
  }, [input, isLoading, sendMessage])

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-6 space-y-6 [scrollbar-width:thin]">
        {messages.length === 0 && !isLoading && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-[hsl(var(--coach-muted))]">Start the conversation…</p>
          </div>
        )}

        {messages.map((m) => {
          const textContent =
            m.parts
              ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
              .map((p) => p.text)
              .join('') ?? ''

          const sources = (m.metadata as { sources?: ChatSource[] } | undefined)?.sources

          return (
            <Message
              key={m.id}
              role={m.role === 'assistant' ? 'assistant' : 'user'}
              content={textContent}
              sources={sources}
              isStreaming={
                isLoading && m === messages[messages.length - 1] && m.role === 'assistant'
              }
            />
          )
        })}

        {isLoading && (messages.length === 0 || messages[messages.length - 1]?.role === 'user') && (
          <TypingIndicator />
        )}
      </div>

      <Composer
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        model={model}
        onModelChange={setModel}
      />
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/*  NewChatView — empty state on /coach                                     */
/* ---------------------------------------------------------------------- */

interface PresetPrompt {
  id: string
  group: string
  title: string
  description: string
  prompt_text: string
}

interface NewChatViewProps {
  presetPrompts: PresetPrompt[]
}

export function NewChatView({ presetPrompts }: NewChatViewProps) {
  const { user, addThread } = useCoach()
  const router = useRouter()
  const [input, setInput] = useState('')
  const [model, setModel] = useState(DEFAULT_COACH_MODEL)
  const [isCreating, setIsCreating] = useState(false)

  async function startChat(text: string) {
    if (!text.trim() || isCreating) return
    setIsCreating(true)

    const supabase = createClient()
    const title = text.slice(0, 80)

    const { data: thread, error } = await supabase
      .from('coach_threads')
      .insert({ user_id: user.id, title, model })
      .select('id, title, created_at, updated_at, model')
      .single()

    if (error || !thread) {
      setIsCreating(false)
      return
    }

    addThread(thread)
    sessionStorage.setItem('coach-init-msg', text)
    router.push(`/coach/${thread.id}`)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 overflow-y-auto px-6 py-8">
        {/* Welcome */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-[hsl(var(--coach-gold))/10] border border-[hsl(var(--coach-gold))/20]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="hsl(var(--coach-gold))" opacity="0.9" />
              <path
                d="M2 17l10 5 10-5"
                stroke="hsl(var(--coach-gold))"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M2 12l10 5 10-5"
                stroke="hsl(var(--coach-gold))"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-[hsl(var(--coach-fg))]">
            Your AI Wealth Coach
          </h1>
          <p className="text-sm text-[hsl(var(--coach-muted))] max-w-sm">
            Ask anything about wealth creation, business strategy, or get personalized guidance
            based on your goals.
          </p>
        </div>

        {/* Preset prompts grid */}
        {presetPrompts.length > 0 && (
          <div className="w-full max-w-3xl grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {presetPrompts.map((p) => (
              <button
                key={p.id}
                onClick={() => void startChat(p.prompt_text)}
                disabled={isCreating}
                className={cn(
                  'group flex flex-col gap-2 rounded-xl border border-[hsl(var(--coach-border))] bg-[hsl(var(--coach-surface))] p-4 text-left transition-all',
                  'hover:border-[hsl(var(--coach-gold))/40] hover:bg-[hsl(var(--coach-gold))/5]',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                )}
              >
                <span className="text-sm font-semibold text-[hsl(var(--coach-fg))] group-hover:text-[hsl(var(--coach-gold))] transition-colors">
                  {p.title}
                </span>
                <p className="text-xs text-[hsl(var(--coach-muted))] leading-relaxed">
                  {p.description}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      <Composer
        input={input}
        setInput={setInput}
        onSubmit={() => void startChat(input)}
        isLoading={isCreating}
        model={model}
        onModelChange={setModel}
        placeholder="Ask your AI Coach anything…"
        autoFocus
      />
    </div>
  )
}
