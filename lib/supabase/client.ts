import { createBrowserClient } from '@supabase/ssr'

export function getBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Note: It's generally recommended to create the client inside a component or hook
// to ensure it's specific to a user's browser session.
// However, to fix your immediate import error, we'll export a singleton instance.
export const supabase = getBrowserSupabase()
