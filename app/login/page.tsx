'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="theme-coach min-h-screen flex items-center justify-center bg-[hsl(var(--coach-bg))]">
      <div className="w-full max-w-sm space-y-8 px-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-[hsl(var(--coach-gold))/10] border border-[hsl(var(--coach-gold))/20]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
          <h1 className="text-2xl font-display font-bold text-[hsl(var(--coach-fg))]">
            WealthCreators AI
          </h1>
          <p className="text-sm text-[hsl(var(--coach-muted))]">Sign in to access your AI Coach</p>
        </div>

        {sent ? (
          <div className="rounded-xl border border-[hsl(var(--coach-gold))/30] bg-[hsl(var(--coach-gold))/5] p-6 text-center space-y-2">
            <p className="font-medium text-[hsl(var(--coach-fg))]">Check your email</p>
            <p className="text-sm text-[hsl(var(--coach-muted))]">
              We sent a magic link to <strong>{email}</strong>. Click it to sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[hsl(var(--coach-fg))]">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-[hsl(var(--coach-surface))] border-[hsl(var(--coach-border))] text-[hsl(var(--coach-fg))] placeholder:text-[hsl(var(--coach-muted))] focus-visible:ring-[hsl(var(--coach-gold))]"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[hsl(var(--coach-gold))] hover:bg-[hsl(var(--coach-gold))/90] text-black font-semibold"
            >
              {loading ? 'Sending…' : 'Send magic link'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
