import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iwvrjjgjxxtlvvbdbytb.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/** Browser Supabase client for client components */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
