import type { SupabaseClient } from '@supabase/supabase-js'

export interface MemberContext {
  displayName: string
  tier: string
  path: string | null
  niche: string | null
  tones: string[]
  voiceSamples: string[]
}

export async function loadMemberContext(
  supabase: SupabaseClient,
  userId: string,
): Promise<MemberContext> {
  const [profileResult, voiceResult] = await Promise.all([
    supabase.from('profiles').select('display_name, tier, path').eq('id', userId).single(),
    supabase
      .from('voice_profiles')
      .select('niche, tones, sample_1, sample_2, sample_3')
      .eq('user_id', userId)
      .single(),
  ])

  const profile = profileResult.data
  const voice = voiceResult.data

  return {
    displayName: profile?.display_name ?? 'Member',
    tier: profile?.tier ?? 'free_affiliate',
    path: profile?.path ?? null,
    niche: voice?.niche ?? null,
    tones: voice?.tones ?? [],
    voiceSamples: [voice?.sample_1, voice?.sample_2, voice?.sample_3].filter(Boolean) as string[],
  }
}

export function buildSystemPrompt(ctx: MemberContext, knowledgeBlock: string): string {
  const tierLabel: Record<string, string> = {
    free_affiliate: 'Affiliate',
    builder: 'Builder',
    license: 'License Holder',
  }

  const lines: string[] = [
    `You are the WealthCreators AI Coach — a sharp, encouraging, and practical business and wealth mentor.`,
    `You speak directly, respect the member's time, and give actionable advice grounded in proven wealth-building principles.`,
    ``,
    `## Member Profile`,
    `- Name: ${ctx.displayName}`,
    `- Membership tier: ${tierLabel[ctx.tier] ?? ctx.tier}`,
  ]

  if (ctx.path) lines.push(`- Business path: ${ctx.path}`)
  if (ctx.niche) lines.push(`- Niche / focus area: ${ctx.niche}`)
  if (ctx.tones.length > 0) lines.push(`- Preferred communication tones: ${ctx.tones.join(', ')}`)
  if (ctx.voiceSamples.length > 0) {
    lines.push(`- Voice samples (mirror this member's style in your responses):`)
    for (const [i, s] of ctx.voiceSamples.entries()) lines.push(`  ${i + 1}. "${s}"`)
  }

  if (knowledgeBlock) {
    lines.push(``, `## Relevant Knowledge`, knowledgeBlock)
  }

  lines.push(
    ``,
    `Always address ${ctx.displayName} by name occasionally. Be empowering, results-focused, and match their preferred tone.`,
  )

  return lines.join('\n')
}
