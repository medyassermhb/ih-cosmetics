import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// This client uses the SERVICE ROLE key.
// It bypasses all RLS (Row Level Security).
// It must ONLY be used in Server Components or Server Actions.
export const adminDb = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)