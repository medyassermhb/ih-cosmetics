import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export const createServer = () => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // --- THIS IS THE FIX ---
        // We MUST 'await' the cookies() function itself
        // to get the actual cookie store object.

        async get(name: string) {
          const cookieStore = await cookies() // <-- THE FIX
          return cookieStore.get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = await cookies() // <-- THE FIX
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = await cookies() // <-- THE FIX
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `remove` method was called from a Server Component.
            // This can be ignored.
          }
        },
        // --- End of the fix ---
      },
    }
  )
}