'use client';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignOut() {
  const router = useRouter();
  const signout = async () => { await supabase.auth.signOut(); router.replace('/signin'); };
  return <button onClick={signout} className="px-3 py-1 rounded border">Sign out</button>;
}
