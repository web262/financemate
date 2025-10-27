'use client';
import { supabase } from '@/lib/supabaseClient';

export default function BillRow({
  bill, onChange
}: {
  bill: { id:string; name:string; amount:number; due_date:string; repeat:string; paid:boolean; notes?:string };
  onChange: () => void;
}) {
  const markPaid = async () => {
    const { error } = await supabase.from('bills').update({ paid: true }).eq('id', bill.id);
    if (error) return alert(error.message);
    onChange();
  };
  const remove = async () => {
    if (!confirm('Delete this bill?')) return;
    const { error } = await supabase.from('bills').delete().eq('id', bill.id);
    if (error) return alert(error.message);
    onChange();
  };

  const days = Math.ceil((new Date(bill.due_date).getTime() - new Date().getTime()) / (1000*60*60*24));
  const badge =
    bill.paid ? 'bg-emerald-900/40 text-emerald-300 border-emerald-600/30' :
    days < 0 ? 'bg-rose-900/40 text-rose-300 border-rose-600/30' :
    days <= 7 ? 'bg-amber-900/40 text-amber-300 border-amber-600/30' :
    'bg-white/5 text-slate-300 border-white/10';

  return (
    <div className="card p-4 flex items-center justify-between">
      <div>
        <div className="font-medium">{bill.name}</div>
        <div className="text-sm text-slate-400">
          Due {bill.due_date} • {bill.repeat !== 'none' ? `repeats ${bill.repeat}` : 'one-time'}
          {bill.notes ? ` • ${bill.notes}` : ''}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className={`badge border ${badge}`}>{bill.paid ? 'Paid' : (days < 0 ? 'Overdue' : `${days} days`)}</div>
        <div className="text-lg font-semibold">{Number(bill.amount || 0).toLocaleString()}</div>
        {!bill.paid && <button onClick={markPaid} className="btn-ghost">Mark paid</button>}
        <button onClick={remove} className="btn-ghost">Delete</button>
      </div>
    </div>
  );
}
