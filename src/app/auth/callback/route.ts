import { createServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // if 'code' is present, exchange it for a session
  if (code) {
    const supabase = createServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // On success, redirect to the user's order page
      return NextResponse.redirect(`${origin}/account/orders`)
    }
  }

  // return the user to an error page or home
  console.error('Auth callback error')
  return NextResponse.redirect(`${origin}/login?error=true`)
}