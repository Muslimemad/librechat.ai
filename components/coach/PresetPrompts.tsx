'use client'

import { cn } from '@/lib/utils'

interface Prompt {
  id: string
  group: string
  title: string
  description: string
  prompt_text: string
}

interface PresetPromptsProps {
  prompts: Prompt[]
  onSelect: (text: string) => void
}

const GROUP_COLORS: Record<string, string> = {
  Growth: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Strategy: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Mindset: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Finance:
    'bg-[hsl(var(--coach-gold))/10] text-[hsl(var(--coach-gold))] border-[hsl(var(--coach-gold))/20]',
}

export function PresetPrompts({ prompts, onSelect }: PresetPromptsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {prompts.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.prompt_text)}
          className="group flex flex-col gap-2 rounded-xl border border-[hsl(var(--coach-border))] bg-[hsl(var(--coach-surface))] p-4 text-left transition-all hover:border-[hsl(var(--coach-gold))/40] hover:bg-[hsl(var(--coach-gold))/5]"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-semibold text-[hsl(var(--coach-fg))] group-hover:text-[hsl(var(--coach-gold))] transition-colors">
              {p.title}
            </span>
            <span
              className={cn(
                'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium',
                GROUP_COLORS[p.group] ??
                  'bg-[hsl(var(--coach-surface))] text-[hsl(var(--coach-muted))] border-[hsl(var(--coach-border))]',
              )}
            >
              {p.group}
            </span>
          </div>
          <p className="text-xs text-[hsl(var(--coach-muted))] leading-relaxed">{p.description}</p>
        </button>
      ))}
    </div>
  )
}
