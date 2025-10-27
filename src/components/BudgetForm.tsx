'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function BudgetForm({
  defaultMonth, defaultYear, onCreated,
}: { defaultMonth: number; defaultYear: number; onCreated: () => void }) {
  const [category, setCategory] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { error } = await supabase.from('budgets').insert({
      user_id: user.id,
      year: defaultYear,
      month: defaultMonth,
      category,
      limit_amount: Number(limitAmount || 0),
    });
    setLoading(false);
    if (!error) { setCategory(''); setLimitAmount(''); onCreated(); }
    else alert(error.message);
  };

  return (
    <form onSubmit={add} className="card p-4 space-y-3">
      <div className="text-lg font-semibold">Add budget ( {defaultMonth}/{defaultYear} )</div>
      <input className="border rounded-lg px-3 py-2 w-full bg-transparent"
             placeholder="Category (e.g., Food, Rent, Transport)"
             value={category} onChange={e=>setCategory(e.target.value)} required />
      <input className="border rounded-lg px-3 py-2 w-full bg-transparent"
             type="number" min="0" step="0.01" placeholder="Limit amount"
             value={limitAmount} onChange={e=>setLimitAmount(e.target.value)} required />
      <button className="btn-primary" disabled={loading}>{loading ? 'Adding…' : 'Add budget'}</button>
    </form>
  );
}
