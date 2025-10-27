'use client';
import React from 'react';

export default function BudgetProgress({
  category, spent, limitAmount,
}: { category: string; spent: number; limitAmount: number; }) {
  const pct = limitAmount > 0 ? Math.min(100, Math.round((spent / limitAmount) * 100)) : 0;
  let bar = 'bg-emerald-500';
  if (pct >= 80 && pct < 100) bar = 'bg-amber-500';
  if (pct >= 100) bar = 'bg-rose-600';

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div className="font-medium">{category}</div>
        <div className="text-sm text-slate-400">
          {spent.toLocaleString()} / {limitAmount.toLocaleString()}
        </div>
      </div>

      <div className="mt-3 h-2 rounded-full bg-white/10">
        <div
          className={`h-2 rounded-full ${bar} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-2 text-xs text-slate-400">
        {pct}% used • {Math.max(0, limitAmount - spent).toLocaleString()} left
      </div>

      {pct >= 100 && (
        <div className="mt-3 text-xs text-rose-300 bg-rose-950/40 border border-rose-700/40 px-2 py-1 rounded">
          Over budget — consider reducing spend in <b>{category}</b>
        </div>
      )}
      {pct >= 80 && pct < 100 && (
        <div className="mt-3 text-xs text-amber-300 bg-amber-950/40 border border-amber-700/40 px-2 py-1 rounded">
          Warning: you’ve used over 80% of your <b>{category}</b> budget
        </div>
      )}
    </div>
  );
}
