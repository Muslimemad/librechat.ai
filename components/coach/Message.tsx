'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Check, Copy } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { useCoach } from './CoachProvider'

interface Source {
  id: string
  label: string
  similarity: number
}

interface MessageProps {
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  isStreaming?: boolean
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => clearTimeout(timeout.current), [])

  const copy = useCallback(() => {
    void navigator.clipboard.writeText(text)
    setCopied(true)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setCopied(false), 1500)
  }, [text])

  return (
    <button
      onClick={copy}
      className="absolute right-2 top-2 rounded-md border border-[hsl(var(--coach-border))] bg-[hsl(var(--coach-surface))] p-1 text-[hsl(var(--coach-muted))] opacity-0 transition-opacity group-hover/code:opacity-100 hover:text-[hsl(var(--coach-fg))]"
      aria-label="Copy code"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </button>
  )
}

function CoachMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children: c }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[hsl(var(--coach-gold))] underline underline-offset-2 hover:opacity-80"
          >
            {c}
          </a>
        ),
        pre: ({ children: c }) => {
          let text = ''
          const extractText = (node: React.ReactNode): void => {
            if (typeof node === 'string') text += node
            else if (Array.isArray(node)) {
              for (const n of node) extractText(n)
            } else if (node && typeof node === 'object' && 'props' in node)
              extractText((node as React.ReactElement).props.children)
          }
          extractText(c)
          return (
            <div className="group/code relative my-2">
              <pre className="overflow-x-auto rounded-lg border border-[hsl(var(--coach-border))] bg-[hsl(var(--coach-bg))] p-3 text-xs leading-relaxed text-[hsl(var(--coach-fg))]">
                {c}
              </pre>
              <CopyButton text={text.trim()} />
            </div>
          )
        },
        code: ({ className, children: c, ...props }) => {
          if (className?.startsWith('language-')) {
            return (
              <code className={className} {...props}>
                {c}
              </code>
            )
          }
          return (
            <code
              className="rounded bg-[hsl(var(--coach-surface))] px-1 py-0.5 font-mono text-xs text-[hsl(var(--coach-gold))]"
              {...props}
            >
              {c}
            </code>
          )
        },
        p: ({ children: c }) => <p className="my-1.5 leading-relaxed">{c}</p>,
        ul: ({ children: c }) => <ul className="my-1.5 ml-4 list-disc space-y-0.5">{c}</ul>,
        ol: ({ children: c }) => <ol className="my-1.5 ml-4 list-decimal space-y-0.5">{c}</ol>,
        li: ({ children: c }) => <li className="leading-relaxed">{c}</li>,
        strong: ({ children: c }) => (
          <strong className="font-semibold text-[hsl(var(--coach-gold))]">{c}</strong>
        ),
        blockquote: ({ children: c }) => (
          <blockquote className="my-2 border-l-2 border-[hsl(var(--coach-gold))/40] pl-3 text-[hsl(var(--coach-muted))] italic">
            {c}
          </blockquote>
        ),
        h3: ({ children: c }) => (
          <h3 className="mb-1 mt-3 text-sm font-semibold text-[hsl(var(--coach-fg))]">{c}</h3>
        ),
        h4: ({ children: c }) => (
          <h4 className="mb-1 mt-2 text-sm font-medium text-[hsl(var(--coach-fg))]">{c}</h4>
        ),
        hr: () => <hr className="my-3 border-[hsl(var(--coach-border))]" />,
        table: ({ children: c }) => (
          <div className="my-2 overflow-x-auto">
            <table className="w-full text-xs">{c}</table>
          </div>
        ),
        th: ({ children: c }) => (
          <th className="border border-[hsl(var(--coach-border))] bg-[hsl(var(--coach-surface))] px-2 py-1 text-left font-medium">
            {c}
          </th>
        ),
        td: ({ children: c }) => (
          <td className="border border-[hsl(var(--coach-border))] px-2 py-1">{c}</td>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

function CoachAvatar() {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--coach-gold))/10] border border-[hsl(var(--coach-gold))/30]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
  )
}

export function Message({ role, content, sources, isStreaming }: MessageProps) {
  const { profile } = useCoach()
  const initials = (profile.display_name ?? 'M').slice(0, 1).toUpperCase()

  if (role === 'user') {
    return (
      <div className="flex justify-end gap-2.5 px-4">
        <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-[hsl(var(--coach-gold))] px-4 py-2.5 text-sm font-medium text-black">
          {content}
        </div>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--coach-surface))] border border-[hsl(var(--coach-border))] text-xs font-semibold text-[hsl(var(--coach-fg))]">
          {initials}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2.5 px-4">
      <div className="mt-1 shrink-0">
        <CoachAvatar />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            'text-sm text-[hsl(var(--coach-fg))] leading-relaxed',
            isStreaming &&
              'after:ml-0.5 after:inline-block after:h-3.5 after:w-0.5 after:animate-pulse after:rounded-sm after:bg-[hsl(var(--coach-gold))] after:content-[""]',
          )}
        >
          <CoachMarkdown>{content}</CoachMarkdown>
        </div>

        {/* Source pills */}
        {sources && sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {sources.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--coach-gold))/20] bg-[hsl(var(--coach-gold))/8] px-2.5 py-1 text-[10px] font-medium text-[hsl(var(--coach-muted))]"
                title={`Similarity: ${(s.similarity * 100).toFixed(0)}%`}
              >
                <span className="size-1.5 rounded-full bg-[hsl(var(--coach-gold))] opacity-60" />
                {s.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex gap-2.5 px-4">
      <div className="mt-1 shrink-0">
        <CoachAvatar />
      </div>
      <div className="flex items-center gap-1 py-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-[hsl(var(--coach-gold))] opacity-60 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
