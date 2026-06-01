import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "placeholder-key";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
