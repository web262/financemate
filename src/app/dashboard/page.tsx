'use client';

import AuthGate from '@/components/AuthGate';
import SignOut from '@/components/SignOut';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

type Tx = {
  amount: number;
  category: string;
  type: 'income' | 'expense';
  occurred_on: string; // ISO yyyy-mm-dd
};

type BudgetRow = {
  category: string;
  limit_amount: number;
};

type UpcomingBill = { id: string; name: string; amount: number; due_date: string };

const COLORS = ['#22d3ee','#38bdf8','#34d399','#a78bfa','#f59e0b','#ef4444','#14b8a6'];

export default function Dashboard() {
  const [txns, setTxns] = useState<Tx[]>([]);
  const [firstName, setFirstName] = useState<string>('User');
  const [budgetRows, setBudgetRows] = useState<BudgetRow[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingBill[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------- Load profile + transactions (current month) ----------
  const loadTxns = async () => {
    setLoading(true);
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id;

    // Name
    if (uid) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', uid)
        .maybeSingle();
      if (prof?.full_name) setFirstName(prof.full_name.split(' ')[0]);
    }

    // Txns for this month
    const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .slice(0, 10);

    const { data: tData } = await supabase
      .from('transactions')
      .select('amount, category, type, occurred_on')
      .gte('occurred_on', start)
      .order('occurred_on', { ascending: true });

    setTxns((tData as Tx[]) || []);
    setLoading(false);
  };

  // ---------- Load budgets for current month ----------
  const loadBudgets = async () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('budgets')
      .select('category, limit_amount')
      .eq('user_id', user.id)
      .eq('year', y)
      .eq('month', m);

    setBudgetRows(((data as any[]) || []).map(r => ({
      category: r.category,
      limit_amount: Number(r.limit_amount || 0),
    })));
  };

  // ---------- Load upcoming (7 days) unpaid bills ----------
  const loadUpcomingBills = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const start = new Date().toISOString().slice(0, 10);
    const plus7 = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const { data } = await supabase
      .from('bills')
      .select('id,name,amount,due_date,paid')
      .eq('user_id', user.id)
      .eq('paid', false)
      .gte('due_date', start)
      .lte('due_date', plus7)
      .order('due_date', { ascending: true });

    setUpcoming(((data as any[]) || []).map(b => ({
      id: b.id,
      name: b.name,
      amount: Number(b.amount || 0),
      due_date: b.due_date,
    })));
  };

  useEffect(() => {
    loadTxns();
    loadBudgets();
    loadUpcomingBills();
  }, []);

  // ---------- Aggregations ----------
  const totals = useMemo(() => {
    const inc = txns.filter(t => t.type === 'income').reduce((a, b) => a + Number(b.amount), 0);
    const exp = txns.filter(t => t.type === 'expense').reduce((a, b) => a + Number(b.amount), 0);
    return { inc, exp, net: inc - exp };
  }, [txns]);

  const byCat = useMemo(() => {
    const m: Record<string, number> = {};
    txns
      .filter(t => t.type === 'expense')
      .forEach(t => { m[t.category] = (m[t.category] || 0) + Number(t.amount); });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [txns]);

  const dailySeries = useMemo(() => {
    const m = new Map<string, { income: number; expense: number }>();
    txns.forEach(t => {
      const d = t.occurred_on;
      if (!m.has(d)) m.set(d, { income: 0, expense: 0 });
      m.get(d)![t.type] += Number(t.amount);
    });
    return Array.from(m.entries()).map(([date, v]) => ({ date, ...v }));
  }, [txns]);

  // ---------- Budget-based warnings ----------
  const catSpendMap = useMemo(() => {
    const m = new Map<string, number>();
    txns.filter(t => t.type === 'expense').forEach(t => {
      m.set(t.category, (m.get(t.category) || 0) + Number(t.amount));
    });
    return m;
  }, [txns]);

  const budgetWarnings = useMemo(() => {
    const msgs: string[] = [];
    for (const b of budgetRows) {
      const spent = catSpendMap.get(b.category) ?? 0;
      if (b.limit_amount > 0) {
        const pct = Math.round((spent / b.limit_amount) * 100);
        if (pct >= 100) msgs.push(`${b.category}: ${pct}% (over)`); 
        else if (pct >= 80) msgs.push(`${b.category}: ${pct}%`);
      }
    }
    return msgs;
  }, [budgetRows, catSpendMap]);

  // Fallback global warn: expenses > 80% of income
  const incomeOverspendWarn = totals.inc > 0 && totals.exp > totals.inc * 0.8;

  return (
    <AuthGate>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Hello, {firstName} 👋</h1>
          <div className="text-slate-400 text-sm">
            Month: {format(new Date(), 'MMMM yyyy')}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="btn-ghost" href="/transactions">Add transactions</Link>
          <Link className="btn-ghost" href="/budgets">Budgets</Link>
          <Link className="btn-ghost" href="/bills">Bills</Link>
          <SignOut />
        </div>
      </div>

      {/* Budget warnings */}
      {budgetWarnings.length > 0 && (
        <div className="mb-6 border border-amber-300/30 bg-amber-900/30 text-amber-200 rounded-xl p-3 text-sm">
          Budget warnings: {budgetWarnings.join(' • ')}. See{' '}
          <Link href="/budgets" className="underline">Budgets</Link>.
        </div>
      )}

      {budgetWarnings.length === 0 && incomeOverspendWarn && (
        <div className="mb-6 border border-rose-400/30 bg-rose-900/30 text-rose-200 rounded-xl p-3 text-sm">
          Warning: you’ve spent more than 80% of your income this month.
        </div>
      )}

      {/* Upcoming bills (7 days) */}
      {upcoming.length > 0 && (
        <div className="card p-4 mb-6">
          <div className="font-medium mb-2">Upcoming bills (next 7 days)</div>
          <ul className="space-y-2 text-sm">
            {upcoming.map(u => (
              <li key={u.id} className="flex items-center justify-between">
                <span>{u.name} • {u.due_date}</span>
                <span className="font-semibold">{u.amount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-xs text-slate-400">
            Manage in <Link href="/bills" className="underline">Bills</Link>.
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="stat">
          <div className="stat-label">Income</div>
          <div className="stat-value">{totals.inc.toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Expense</div>
          <div className="stat-value">{totals.exp.toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Net</div>
          <div className="stat-value">{totals.net.toLocaleString()}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="card p-4">
          <div className="font-medium mb-3">Expenses by Category</div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byCat}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  stroke="#0f172a"
                  strokeWidth={2}
                >
                  {byCat.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4">
          <div className="font-medium mb-3">Daily Income vs Expense</div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#34d399" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-6 text-sm text-slate-400">Refreshing data…</div>
      )}
    </AuthGate>
  );
}
