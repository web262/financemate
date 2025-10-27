'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function BillForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [due, setDue] = useState<string>(new Date().toISOString().slice(0,10));
  const [repeat, setRepeat] = useState<'none'|'monthly'|'yearly'>('none');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setLoading(false);
    const { error } = await supabase.from('bills').insert({
      user_id: user.id,
      name,
      amount: Number(amount||0),
      due_date: due,
      repeat,
      notes
    });
    setLoading(false);
    if (error) return alert(error.message);
    setName(''); setAmount(''); setNotes('');
    onCreated();
  };

  return (
    <form onSubmit={add} className="card p-4 space-y-3">
      <div className="text-lg font-semibold">Add bill / reminder</div>
      <input className="border rounded-lg px-3 py-2 w-full bg-transparent" placeholder="Name (e.g., Internet)"
        value={name} onChange={e=>setName(e.target.value)} required />
      <div className="grid grid-cols-2 gap-3">
        <input className="border rounded-lg px-3 py-2 w-full bg-transparent" type="number" min="0" step="0.01"
          placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <input className="border rounded-lg px-3 py-2 w-full bg-transparent" type="date"
          value={due} onChange={e=>setDue(e.target.value)} required />
      </div>
      <select className="border rounded-lg px-3 py-2 w-full bg-transparent"
        value={repeat} onChange={e=>setRepeat(e.target.value as any)}>
        <option value="none">No repeat</option>
        <option value="monthly">Repeat monthly</option>
        <option value="yearly">Repeat yearly</option>
      </select>
      <textarea className="border rounded-lg px-3 py-2 w-full bg-transparent" rows={3}
        placeholder="Notes (optional)" value={notes} onChange={e=>setNotes(e.target.value)} />
      <button className="btn-primary" disabled={loading}>{loading ? 'Adding…' : 'Add bill'}</button>
    </form>
  );
}
