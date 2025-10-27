// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !/^https?:\/\//.test(url)) {
  throw new Error(
    'Missing/invalid NEXT_PUBLIC_SUPABASE_URL. Set it in .env.local (e.g., https://xxxxx.supabase.co).'
  );
}
if (!anon) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy the anon public key from Supabase → Settings → API.'
  );
}

export const supabase = createClient(url, anon);
