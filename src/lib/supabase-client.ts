import { createBrowserClient } from '@supabase/ssr' // <-- Changed
import { Database } from '@/types/supabase'

export const createClient = () =>
  createBrowserClient<Database>( // <-- Changed
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )