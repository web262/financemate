'use client';
import { useEffect, useState } from 'react';
import AuthGate from '@/components/AuthGate';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import BillForm from '@/components/BillForm';
import BillRow from '@/components/BillRow';

type Bill = {
  id:string; user_id:string; name:string; amount:number; due_date:string; repeat:'none'|'monthly'|'yearly'; paid:boolean; notes?:string;
};

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setLoading(false);
    const { data } = await supabase
      .from('bills')
      .select('id, user_id, name, amount, due_date, repeat, paid, notes')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });
    setBills((data as any) || []);
    setLoading(false);
  };

  useEffect(()=>{ load(); }, []);

  return (
    <AuthGate>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Bills & Reminders</h1>
        <Link href="/dashboard" className="btn-ghost">Back to Dashboard</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <BillForm onCreated={load} />
        </div>

        <div className="md:col-span-2 space-y-3">
          {loading && <div className="text-slate-400">Loading…</div>}
          {!loading && bills.length === 0 && (
            <div className="card p-4 text-slate-300">No bills yet. Add one on the left.</div>
          )}
          {!loading && bills.map(b => (
            <BillRow key={b.id} bill={b} onChange={load} />
          ))}
        </div>
      </div>
    </AuthGate>
  );
}
