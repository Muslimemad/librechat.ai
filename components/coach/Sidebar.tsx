'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Plus,
  MessageSquare,
  Trash2,
  Pencil,
  Check,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useCoach } from './CoachProvider'

export function Sidebar() {
  const { threads, profile, removeThread, updateThread } = useCoach()
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const activeThreadId = pathname?.match(/\/coach\/([^/]+)/)?.[1]

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('coach_threads').delete().eq('id', id)
    removeThread(id)
    if (activeThreadId === id) router.push('/coach')
  }

  async function handleRename(id: string) {
    if (!renameValue.trim()) return
    const supabase = createClient()
    await supabase.from('coach_threads').update({ title: renameValue.trim() }).eq('id', id)
    updateThread(id, { title: renameValue.trim() })
    setRenaming(null)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col border-r border-[hsl(var(--coach-border))] bg-[hsl(var(--coach-sidebar))] transition-all duration-200',
        collapsed ? 'w-12' : 'w-64',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[hsl(var(--coach-border))] p-3">
        {!collapsed && (
          <span className="font-display text-sm font-bold text-[hsl(var(--coach-gold))] tracking-wide">
            WealthCreators
          </span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="rounded-md p-1 text-[hsl(var(--coach-muted))] hover:bg-[hsl(var(--coach-border))] hover:text-[hsl(var(--coach-fg))]"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      {/* New Chat */}
      <div className="p-2">
        <Link
          href="/coach"
          className={cn(
            'flex items-center gap-2 rounded-lg border border-[hsl(var(--coach-gold))/30] bg-[hsl(var(--coach-gold))/8] px-3 py-2 text-sm font-medium text-[hsl(var(--coach-gold))] transition-all hover:bg-[hsl(var(--coach-gold))/15]',
            collapsed && 'justify-center px-2',
          )}
        >
          <Plus className="size-4 shrink-0" />
          {!collapsed && 'New Chat'}
        </Link>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 [scrollbar-width:thin]">
        {!collapsed && threads.length > 0 && (
          <p className="mb-1 px-2 pt-2 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--coach-muted))]">
            Recent
          </p>
        )}
        <ul className="space-y-0.5">
          {threads.map((thread) => {
            const isActive = activeThreadId === thread.id
            const isRenaming = renaming === thread.id

            if (collapsed) {
              return (
                <li key={thread.id}>
                  <Link
                    href={`/coach/${thread.id}`}
                    className={cn(
                      'flex items-center justify-center rounded-lg p-2 transition-colors',
                      isActive
                        ? 'bg-[hsl(var(--coach-gold))/15] text-[hsl(var(--coach-gold))]'
                        : 'text-[hsl(var(--coach-muted))] hover:bg-[hsl(var(--coach-border))]',
                    )}
                    title={thread.title}
                  >
                    <MessageSquare className="size-4" />
                  </Link>
                </li>
              )
            }

            return (
              <li key={thread.id}>
                {isRenaming ? (
                  <div className="flex items-center gap-1 rounded-lg border border-[hsl(var(--coach-gold))/40] px-2 py-1.5">
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') void handleRename(thread.id)
                        if (e.key === 'Escape') setRenaming(null)
                      }}
                      className="flex-1 bg-transparent text-xs text-[hsl(var(--coach-fg))] outline-none"
                    />
                    <button
                      onClick={() => void handleRename(thread.id)}
                      className="text-[hsl(var(--coach-gold))]"
                    >
                      <Check className="size-3" />
                    </button>
                    <button
                      onClick={() => setRenaming(null)}
                      className="text-[hsl(var(--coach-muted))]"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ) : (
                  <div className="group flex items-center gap-1">
                    <Link
                      href={`/coach/${thread.id}`}
                      className={cn(
                        'flex flex-1 items-center gap-2 overflow-hidden rounded-lg p-2 text-xs transition-colors',
                        isActive
                          ? 'bg-[hsl(var(--coach-gold))/12] text-[hsl(var(--coach-fg))]'
                          : 'text-[hsl(var(--coach-muted))] hover:bg-[hsl(var(--coach-border))] hover:text-[hsl(var(--coach-fg))]',
                      )}
                    >
                      <MessageSquare
                        className={cn(
                          'size-3.5 shrink-0',
                          isActive && 'text-[hsl(var(--coach-gold))]',
                        )}
                      />
                      <span className="truncate">{thread.title || 'New Chat'}</span>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="shrink-0 rounded p-1 text-[hsl(var(--coach-muted))] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[hsl(var(--coach-border))] hover:text-[hsl(var(--coach-fg))]">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="19" r="2" />
                          </svg>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border-[hsl(var(--coach-border))] bg-[hsl(var(--coach-sidebar))] text-[hsl(var(--coach-fg))]"
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setRenaming(thread.id)
                            setRenameValue(thread.title ?? '')
                          }}
                          className="gap-2 text-xs focus:bg-[hsl(var(--coach-border))]"
                        >
                          <Pencil className="size-3" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => void handleDelete(thread.id)}
                          className="gap-2 text-xs text-red-400 focus:bg-red-500/10 focus:text-red-400"
                        >
                          <Trash2 className="size-3" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-[hsl(var(--coach-border))] p-2">
        {!collapsed && (
          <div className="mb-1 flex items-center gap-2 rounded-lg px-2 py-1.5">
            <div className="flex size-6 items-center justify-center rounded-full bg-[hsl(var(--coach-gold))/15] text-[10px] font-bold text-[hsl(var(--coach-gold))]">
              {(profile.display_name ?? 'M').slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-[hsl(var(--coach-fg))]">
                {profile.display_name ?? 'Member'}
              </p>
              <p className="text-[10px] text-[hsl(var(--coach-muted))] capitalize">
                {profile.tier?.replace(/_/g, ' ') ?? 'Free'}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => void handleSignOut()}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-[hsl(var(--coach-muted))] hover:bg-[hsl(var(--coach-border))] hover:text-[hsl(var(--coach-fg))]',
            collapsed && 'justify-center',
          )}
        >
          <LogOut className="size-3.5 shrink-0" />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </aside>
  )
}
