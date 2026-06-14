'use client'

import { createContext, useContext, useState, useCallback } from 'react'

export interface Thread {
  id: string
  title: string
  created_at: string
  updated_at: string
  model: string | null
}

export interface CoachUser {
  id: string
  email: string
}

export interface CoachProfile {
  display_name: string
  tier: string
  avatar_url: string | null
}

interface CoachContextValue {
  user: CoachUser
  profile: CoachProfile
  threads: Thread[]
  addThread: (thread: Thread) => void
  removeThread: (id: string) => void
  updateThread: (id: string, updates: Partial<Thread>) => void
}

const CoachContext = createContext<CoachContextValue | null>(null)

export function CoachProvider({
  user,
  profile,
  initialThreads,
  children,
}: {
  user: CoachUser
  profile: CoachProfile
  initialThreads: Thread[]
  children: React.ReactNode
}) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads)

  const addThread = useCallback((thread: Thread) => {
    setThreads((prev) => [thread, ...prev])
  }, [])

  const removeThread = useCallback((id: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const updateThread = useCallback((id: string, updates: Partial<Thread>) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }, [])

  return (
    <CoachContext.Provider
      value={{ user, profile, threads, addThread, removeThread, updateThread }}
    >
      {children}
    </CoachContext.Provider>
  )
}

export function useCoach() {
  const ctx = useContext(CoachContext)
  if (!ctx) throw new Error('useCoach must be used within CoachProvider')
  return ctx
}
