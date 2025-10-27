'use client';
import { useEffect, useState } from 'react';
import AuthGate from '@/components/AuthGate';
import { supabase } from '@/lib/supabaseClient';

type Goal = {
  id: string; name: string; target_amount: number; saved_amount: number; target_date: string | null;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [date, setDate] = useState<string>('');

  const load = async () => {
    const { data } = await supabase.from('goals').select('*').order('created_at', { ascending: false });
    setGoals((data as Goal[]) || []);
  };
  useEffect(()=>{ load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id!;
    await supabase.from('goals').insert({
      user_id: uid, name, target_amount: Number(target), target_date: date || null
    });
    setName(''); setTarget(''); setDate('');
    await load();
  };

  const saveMore = async (g: Goal, delta: number) => {
    await supabase.from('goals').update({ saved_amount: (g.saved_amount || 0) + delta }).eq('id', g.id);
    await load();
  };

  const remove = async (id: string) => { await supabase.from('goals').delete().eq('id', id); await load(); };

  return (
    <AuthGate>
      <h1 className="text-2xl font-semibold mb-4">Savings Goals</h1>

      <form onSubmit={add} className="bg-white border rounded p-4 space-y-3 max-w-lg">
        <input className="w-full border rounded px-3 py-2" placeholder="Goal name (e.g., Emergency Fund)"
               value={name} onChange={e=>setName(e.target.value)} required />
        <div className="flex gap-2">
          <input className="flex-1 border rounded px-3 py-2" type="number" min="1" step="0.01" placeholder="Target amount"
                 value={target} onChange={e=>setTarget(e.target.value)} required />
          <input className="border rounded px-3 py-2" type="date"
                 value={date} onChange={e=>setDate(e.target.value)} />
        </div>
        <button className="px-4 py-2 rounded bg-slate-900 text-white">Add Goal</button>
      </form>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {goals.map(g => {
          const pct = Math.min(100, Math.round((Number(g.saved_amount||0) / Number(g.target_amount)) * 100));
          return (
            <div key={g.id} className="bg-white border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{g.name}</h3>
                <button className="text-red-600 text-sm" onClick={()=>remove(g.id)}>Delete</button>
              </div>
              <div className="text-sm text-slate-600 mb-1">
                {Number(g.saved_amount||0).toLocaleString()} / {Number(g.target_amount).toLocaleString()}
              </div>
              <div className="w-full bg-slate-100 rounded h-2 mb-2">
                <div className="bg-green-500 h-2 rounded" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded border" onClick={()=>saveMore(g, 50000)}>+50,000</button>
                <button className="px-3 py-1 rounded border" onClick={()=>saveMore(g, 200000)}>+200,000</button>
              </div>
              {g.target_date && <div className="mt-2 text-xs text-slate-500">Target date: {g.target_date}</div>}
            </div>
          );
        })}
        {goals.length === 0 && <div className="text-slate-500">No goals yet.</div>}
      </div>
    </AuthGate>
  );
}
