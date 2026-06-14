import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

function isMarkdownPreferred(request: NextRequest): boolean {
  const accept = request.headers.get('accept') ?? ''
  return accept.includes('text/markdown')
}

export default async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // Docs markdown rewrite
  if (isMarkdownPreferred(request) && pathname.startsWith('/docs')) {
    const rest = pathname.slice('/docs'.length)
    const rewritten = `/llms.mdx/docs${rest}`
    return NextResponse.rewrite(new URL(rewritten, request.nextUrl))
  }

  // Coach auth gate
  if (pathname.startsWith('/coach')) {
    let proxyResponse = NextResponse.next({ request })

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // Supabase not configured — skip auth gate in dev
      return proxyResponse
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            for (const { name, value } of cookiesToSet) request.cookies.set(name, value)
            proxyResponse = NextResponse.next({ request })
            for (const { name, value, options } of cookiesToSet)
              proxyResponse.cookies.set(name, value, options)
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    return proxyResponse
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/docs/:path*', '/coach/:path*'],
}
