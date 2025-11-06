import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from './types/supabase'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // --- START OF CORRECTED LOGIC ---

  // Refresh session & get the current user
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 1. Protect /account routes
  if (!user && pathname.startsWith('/account')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Protect /admin routes
  if (pathname.startsWith('/admin')) {
    if (!user) {
      // Not logged in, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Logged in, now check role FOR THAT SPECIFIC USER
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id) // <-- This was the missing line
      .single()

    if (profile?.role !== 'admin') {
      // Not an admin, redirect to homepage
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  // --- END OF CORRECTED LOGIC ---

  return response
}

// Config to specify which routes the middleware runs on
export const config = {
  matcher: [
    '/account/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
}