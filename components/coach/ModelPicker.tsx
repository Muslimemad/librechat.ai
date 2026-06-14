'use client'

import { COACH_MODELS } from '@/lib/coach/models'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Cpu } from 'lucide-react'

interface ModelPickerProps {
  value: string
  onChange: (model: string) => void
}

export function ModelPicker({ value, onChange }: ModelPickerProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-7 w-auto gap-1 border-[hsl(var(--coach-border))] bg-[hsl(var(--coach-surface))] px-2 py-0 text-xs text-[hsl(var(--coach-muted))] hover:text-[hsl(var(--coach-fg))] focus:ring-[hsl(var(--coach-gold))]">
        <Cpu className="size-3 shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-[hsl(var(--coach-border))] bg-[hsl(var(--coach-surface))] text-[hsl(var(--coach-fg))]">
        {COACH_MODELS.map((m) => (
          <SelectItem
            key={m.id}
            value={m.id}
            className="text-xs focus:bg-[hsl(var(--coach-gold))/10] focus:text-[hsl(var(--coach-fg))]"
          >
            {m.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
