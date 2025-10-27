// src/app/signup/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string| null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/dashboard');
    });
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email, password
    });
    if (error) return setError(error.message);

    // create profile row
    const { data: sessionData } = await supabase.auth.getUser();
    const uid = sessionData.user?.id;
    if (uid) {
      await supabase.from('profiles').upsert({ id: uid, full_name: fullName }).select();
    }

    router.replace('/dashboard');
  };

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      <form className="space-y-3" onSubmit={submit}>
        <input className="w-full border rounded px-3 py-2" placeholder="Full name"
               value={fullName} onChange={e=>setFullName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Email"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password"
               value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full px-4 py-2 rounded bg-slate-900 text-white">Sign up</button>
      </form>
    </div>
  );
}
