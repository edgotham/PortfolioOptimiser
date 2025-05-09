import { createClient } from "@supabase/supabase-js";

// These come from Vite env vars (client‐exposed). Make sure they're set in Vercel!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Debug logs to verify at runtime
console.log("🔗 Supabase URL:", supabaseUrl);
console.log(
  "🔑 Supabase ANON Key (first 4 chars):",
  supabaseAnonKey.slice(0, 4) + "…",
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
