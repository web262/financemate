'use client';
import { useEffect, useMemo, useState } from 'react';
import AuthGate from '@/components/AuthGate';
import { supabase } from '@/lib/supabaseClient';
import { format, parseISO } from 'date-fns';

type Tx = {
  id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  note: string | null;
  occurred_on: string; // date
};

const detectCategory = (text: string) => {
  const desc = text.toLowerCase();
  const map: Record<string, string[]> = {
    food: ['food','meal','coffee','cafe','restaurant','snack'],
    travel: ['bus','taxi','grab','uber','flight','train','fuel','gas'],
    rent: ['rent','apartment','room','lease'],
    shopping: ['shop','shopee','lazada','mall','market'],
    utilities: ['electric','water','internet','wifi','phone','mobile','bill'],
    investment: ['stock','coin','crypto','mutual','fund','broker'],
  };
  for (const [cat, list] of Object.entries(map)) {
    if (list.some(w => desc.includes(w))) return cat;
  }
  return 'other';
};

export default function TransactionsPage() {
  const [txns, setTxns] = useState<Tx[]>([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('id, amount, category, type, note, occurred_on')
      .order('occurred_on', { ascending: false })
      .limit(200);
    if (!error && data) setTxns(data as Tx[]);
  };

  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id!;
    const cat = category || detectCategory(note);
    const { error } = await supabase.from('transactions').insert({
      user_id: uid,
      amount: Number(amount),
      category: cat || 'other',
      type,
      note: note || null,
      occurred_on: date,
    });
    setLoading(false);
    if (!error) { setAmount(''); setNote(''); setCategory(''); await load(); }
    else alert(error.message);
  };

  const remove = async (id: string) => {
    await supabase.from('transactions').delete().eq('id', id);
    await load();
  };

  const totals = useMemo(() => {
    const inc = txns.filter(t=>t.type==='income').reduce((a,b)=>a+Number(b.amount),0);
    const exp = txns.filter(t=>t.type==='expense').reduce((a,b)=>a+Number(b.amount),0);
    return { inc, exp, net: inc - exp };
  }, [txns]);

  return (
  <AuthGate>
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-semibold">Transactions</h1>
      <a className="link" href="/dashboard">Back to Dashboard</a>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={add} className="card p-4 space-y-3">
        <div className="flex gap-2">
          <select className="border rounded-lg px-3 py-2" value={type} onChange={e=>setType(e.target.value as any)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input className="flex-1 border rounded-lg px-3 py-2" type="number" step="0.01" min="0" placeholder="Amount"
                 value={amount} onChange={e=>setAmount(e.target.value)} required />
        </div>
        <div className="flex gap-2">
          <input className="flex-1 border rounded-lg px-3 py-2" placeholder="Note (e.g., Coffee at Highlands)"
                 value={note} onChange={e=>setNote(e.target.value)} />
          <input className="border rounded-lg px-3 py-2" placeholder="Category (auto if empty)"
                 value={category} onChange={e=>setCategory(e.target.value)} />
        </div>
        <input className="border rounded-lg px-3 py-2" type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <button disabled={loading} className="btn-primary">
          {loading ? 'Adding…' : 'Add'}
        </button>
      </form>

      <div className="card p-4">
        <h2 className="font-semibold mb-2">Summary</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="stat">
            <div className="stat-label">Income</div>
            <div className="text-xl font-semibold">{totals.inc.toLocaleString()}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Expense</div>
            <div className="text-xl font-semibold">{totals.exp.toLocaleString()}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Net</div>
            <div className="text-xl font-semibold">{totals.net.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 card">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th><th>Type</th><th>Category</th><th>Amount</th><th>Note</th><th></th>
          </tr>
        </thead>
        <tbody>
          {txns.map(t => (
            <tr key={t.id}>
              <td>{t.occurred_on}</td>
              <td>{t.type}</td>
              <td>{t.category}</td>
              <td>{Number(t.amount).toLocaleString()}</td>
              <td>{t.note}</td>
              <td>
                <button className="text-red-600 hover:underline" onClick={()=>remove(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {txns.length === 0 && <tr><td className="p-4 text-slate-500" colSpan={6}>No transactions yet.</td></tr>}
        </tbody>
      </table>
    </div>
  </AuthGate>
);

}
