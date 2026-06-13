import Link from 'next/link'
import {
  TrendingUp,
  BarChart3,
  Search,
  Shield,
  Brain,
  Globe,
  Zap,
  Target,
  LineChart,
  ArrowRight,
  Users,
  DollarSign,
  Award,
} from 'lucide-react'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { baseOptions } from '@/app/layout.config'
import type { Metadata } from 'next'
import FooterMenu from '@/components/FooterMenu'

export const metadata: Metadata = {
  title: 'WealthCreators AI — The AI Platform for Wealth Creators',
  description:
    'Turn market intelligence into wealth. WealthCreators AI gives you institutional-grade portfolio analysis, market research, and investment insights.',
}

/* ---------------------------------------------------------------------------
 * Features data
 * --------------------------------------------------------------------------- */

const features = [
  {
    icon: TrendingUp,
    title: 'Portfolio Intelligence',
    description:
      'AI-powered portfolio analysis, rebalancing suggestions, and performance attribution across all asset classes.',
    href: '/docs/features/portfolio',
  },
  {
    icon: BarChart3,
    title: 'Market Research',
    description:
      'Deep market analysis with AI-powered insights, trend detection, and competitive intelligence at your fingertips.',
    href: '/docs/features/market-research',
  },
  {
    icon: Search,
    title: 'Investment Screener',
    description:
      'Screen thousands of stocks, ETFs, and crypto assets using natural language — no complex query syntax required.',
    href: '/docs/features/screener',
  },
  {
    icon: Brain,
    title: 'AI Agents',
    description:
      'Autonomous agents that monitor markets, run research workflows, and surface opportunities while you sleep.',
    href: '/docs/features/agents',
  },
  {
    icon: LineChart,
    title: 'Risk Analysis',
    description:
      'Portfolio risk metrics, correlation analysis, drawdown simulation, and hedging strategies — all AI-explained.',
    href: '/docs/features/risk',
  },
  {
    icon: Globe,
    title: 'News Intelligence',
    description:
      'AI-curated financial news with real-time sentiment scoring and impact analysis across your holdings.',
    href: '/docs/features/news',
  },
  {
    icon: Target,
    title: 'Financial Planning',
    description:
      'Goal-based wealth planning, retirement projections, and savings optimization tailored to your timeline.',
    href: '/docs/features/planning',
  },
  {
    icon: Zap,
    title: 'Tax Optimization',
    description:
      'AI-assisted tax-loss harvesting, wash-sale avoidance, and year-end tax strategy recommendations.',
    href: '/docs/features/tax',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'Bank-grade encryption, SOC 2 compliance, SSO/SAML support, and full audit trails for your financial data.',
    href: '/docs/configuration/security',
  },
]

/* ---------------------------------------------------------------------------
 * Trusted By Section data
 * --------------------------------------------------------------------------- */

const trustedBy = [
  { name: 'Family Offices', value: '500+' },
  { name: 'RIAs', value: '1,200+' },
  { name: 'Hedge Funds', value: '80+' },
  { name: 'Wealth Advisors', value: '3,400+' },
]

/* ---------------------------------------------------------------------------
 * Hero Section
 * --------------------------------------------------------------------------- */

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 md:pt-24 lg:px-8 lg:pt-32">
      {/* Subtle gradient orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/20 to-accent/20 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary">
          <Award className="mr-2 size-3.5" aria-hidden="true" />
          Institutional-grade AI for every wealth creator
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          The AI Platform
          <br />
          <span className="text-primary">for Wealth Creators</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Turn market intelligence into wealth. Get institutional-grade portfolio analysis,
          real-time market research, and AI-powered investment insights — all in one platform.
        </p>

        {/* CTAs */}
        <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Primary actions">
          <Link
            href="/docs"
            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            aria-label="Get started with WealthCreators AI"
          >
            Get Started
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/docs/quick_start"
            className="inline-flex items-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            aria-label="Read the quick start guide"
          >
            Quick Start Guide
          </Link>
        </nav>
      </div>

      {/* Stats strip */}
      <div className="mx-auto mt-16 max-w-3xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Assets Analyzed', value: '$2.4T+' },
            { label: 'Active Users', value: '50k+' },
            { label: 'Countries', value: '90+' },
            { label: 'AI Models', value: '20+' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
 * Trusted By Section
 * --------------------------------------------------------------------------- */

function TrustedBySection() {
  return (
    <section className="border-y border-border px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="mb-10 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by wealth professionals worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {trustedBy.map((item) => (
            <div key={item.name} className="flex flex-col items-center gap-1 px-4">
              <span className="text-3xl font-bold text-primary">{item.value}</span>
              <span className="text-sm text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
 * Features Section
 * --------------------------------------------------------------------------- */

function FeaturesSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Every tool you need to build wealth
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A comprehensive AI platform built for serious investors and wealth creators
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article key={feature.title}>
                <Link
                  href={feature.href}
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:bg-muted hover:shadow-sm"
                >
                  <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon
                      className="size-5 text-primary transition-colors group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">{feature.title}</h3>
                  <p className="flex-1 text-sm text-muted-foreground">{feature.description}</p>
                  <span
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    Learn more
                    <ArrowRight className="ml-1 size-3.5" />
                  </span>
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
 * Why Section
 * --------------------------------------------------------------------------- */

function WhySection() {
  return (
    <section className="border-y border-border bg-muted/30 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built for the modern wealth creator
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether you manage a family office, run an RIA, or are building your own portfolio,
              WealthCreators AI delivers the intelligence you need at the speed of thought.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                'Connect any AI model — Anthropic, OpenAI, Gemini, and more',
                'Deploy on your own infrastructure for full data sovereignty',
                'Integrate with your existing tools via MCP and REST APIs',
                'Multi-user support with role-based access controls',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <svg className="size-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                      <path
                        d="M10 3L5 8.5 2 5.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </span>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/docs"
                className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Explore the docs
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              {
                icon: DollarSign,
                title: 'Portfolio-First AI',
                description:
                  'Every AI interaction is context-aware of your portfolio and investment thesis.',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description:
                  'Share research, insights, and AI conversations with your investment team.',
              },
              {
                icon: Globe,
                title: 'Global Markets',
                description:
                  'Coverage across equities, fixed income, crypto, commodities, and alternatives.',
              },
              {
                icon: Shield,
                title: 'Data Sovereignty',
                description:
                  'Your financial data never leaves your infrastructure. Full self-hosting supported.',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-xl border border-border bg-card p-5">
                  <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-4 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
 * CTA Section
 * --------------------------------------------------------------------------- */

function CTASection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Start building wealth with AI
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Get up and running in minutes. Deploy locally or on your own infrastructure.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/docs/quick_start"
            className="inline-flex items-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            aria-label="Read the quickstart guide"
          >
            Quick Start Guide
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Read the Blog
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
 * Page Component
 * --------------------------------------------------------------------------- */

export default function HomePage() {
  return (
    <HomeLayout {...baseOptions} nav={{ ...baseOptions.nav, transparentMode: 'top' }}>
      <main className="min-h-screen">
        <HeroSection />
        <TrustedBySection />
        <FeaturesSection />
        <WhySection />
        <CTASection />
      </main>
      <div className="border-t border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <FooterMenu />
        </div>
      </div>
    </HomeLayout>
  )
}
