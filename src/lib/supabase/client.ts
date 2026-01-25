import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/browser";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

if (!isSupabaseConfigured()) {
  console.warn(
    "Supabase credentials not found. Running in mock mode. " +
    "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

// Use the same browser client singleton for consistency
// This ensures auth state is shared across all API calls
export const supabase = createBrowserSupabaseClient();
