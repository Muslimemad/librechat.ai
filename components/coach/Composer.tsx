'use client'

import { useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ModelPicker } from './ModelPicker'
import { DEFAULT_COACH_MODEL } from '@/lib/coach/models'

interface ComposerProps {
  input: string
  setInput: (v: string) => void
  onSubmit: () => void
  isLoading: boolean
  model: string
  onModelChange: (m: string) => void
  placeholder?: string
  autoFocus?: boolean
}

export function Composer({
  input,
  setInput,
  onSubmit,
  isLoading,
  model,
  onModelChange,
  placeholder = 'Message your AI Coach…',
  autoFocus = false,
}: ComposerProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const rows = Math.min(6, Math.max(1, input.split('\n').length))

  useEffect(() => {
    if (autoFocus) ref.current?.focus()
  }, [autoFocus])

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  const canSend = input.trim().length > 0 && !isLoading

  return (
    <div className="shrink-0 border-t border-[hsl(var(--coach-border))] bg-[hsl(var(--coach-bg))] p-4">
      <div className="rounded-xl border border-[hsl(var(--coach-border))] bg-[hsl(var(--coach-surface))] transition-colors focus-within:border-[hsl(var(--coach-gold))/50] focus-within:ring-1 focus-within:ring-[hsl(var(--coach-gold))/30]">
        <textarea
          ref={ref}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          rows={rows}
          className="w-full resize-none bg-transparent px-4 py-3 text-sm text-[hsl(var(--coach-fg))] placeholder:text-[hsl(var(--coach-muted))] focus:outline-none"
        />
        <div className="flex items-center justify-between border-t border-[hsl(var(--coach-border))] px-3 py-2">
          <ModelPicker value={model || DEFAULT_COACH_MODEL} onChange={onModelChange} />
          <button
            onClick={onSubmit}
            disabled={!canSend}
            className={cn(
              'flex size-8 items-center justify-center rounded-lg transition-all',
              canSend
                ? 'bg-[hsl(var(--coach-gold))] text-black hover:opacity-90'
                : 'bg-[hsl(var(--coach-surface))] text-[hsl(var(--coach-muted))] opacity-40 cursor-not-allowed',
            )}
            aria-label="Send"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </button>
        </div>
      </div>
      <p className="mt-1.5 text-center text-[10px] text-[hsl(var(--coach-muted))]">
        AI can make mistakes · Shift+Enter for new line
      </p>
    </div>
  )
}
