import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('[Supabase Client] Initializing with:', {
  supabaseUrl: supabaseUrl,
  urlLength: supabaseUrl?.length,
  hasAnonKey: !!supabaseAnonKey,
  anonKeyLength: supabaseAnonKey?.length,
  timestamp: new Date().toISOString()
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
