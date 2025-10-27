'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import BudgetForm from '@/components/BudgetForm';
import BudgetProgress from '@/components/BudgetProgress';
import AuthGate from '@/components/AuthGate';
import Link from 'next/link';

type Budget = {
  id: string; user_id: string; year: number; month: number;
  category: string; limit_amount: number;
};
type Row = { category: string; spent: number; };

export default function BudgetsPage() {
  const now = new Date();
  const defaultMonth = now.getMonth() + 1;
  const defaultYear = now.getFullYear();

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [spendRows, setSpendRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: b } = await supabase
      .from('budgets')
      .select('id,user_id,year,month,category,limit_amount')
      .eq('user_id', user.id)
      .eq('year', defaultYear)
      .eq('month', defaultMonth)
      .order('category');

    const { data: s } = await supabase
      .from('monthly_expense_totals')
      .select('category, spent')
      .eq('user_id', user.id)
      .eq('year', defaultYear)
      .eq('month', defaultMonth);

    setBudgets((b || []) as Budget[]);
    setSpendRows((s || []) as Row[]);
    setLoading(false);
  };

  useEffect(()=>{ load(); }, []);

  const spentByCat = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of spendRows) m.set(r.category, Number(r.spent));
    return m;
  }, [spendRows]);

  const remove = async (id: string) => {
    if (!confirm('Delete this budget?')) return;
    const { error } = await supabase.from('budgets').delete().eq('id', id);
    if (error) return alert(error.message);
    load();
  };

  return (
    <AuthGate>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Budgets</h1>
        <Link href="/dashboard" className="btn-ghost">Back to Dashboard</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <BudgetForm defaultMonth={defaultMonth} defaultYear={defaultYear} onCreated={load} />
        </div>

        <div className="md:col-span-2 space-y-4">
          {loading && <div className="text-slate-400">Loading…</div>}
          {!loading && budgets.length === 0 && (
            <div className="card p-4 text-slate-300">No budgets yet for this month. Add one on the left.</div>
          )}
          {!loading && budgets.map(b => (
            <div key={b.id} className="relative">
              <BudgetProgress
                category={b.category}
                spent={spentByCat.get(b.category) || 0}
                limitAmount={Number(b.limit_amount)}
              />
              <button onClick={()=>remove(b.id)}
                      className="absolute top-4 right-4 text-xs text-rose-300 hover:underline">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </AuthGate>
  );
}
