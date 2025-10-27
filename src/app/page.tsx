import Link from 'next/link';

const Check = () => (
  <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="grid md:grid-cols-2 gap-10 items-center py-12">
        <div className="space-y-6">
          <p className="inline-block rounded-full bg-sky-50 text-sky-700 px-3 py-1 text-xs font-medium border border-sky-100">
            New • Smart budgets & insights
          </p>
          <h1 className="text-5xl md:text-6xl font-semibold leading-tight">
            Your money, <span className="text-sky-600">made simple</span>.
          </h1>
          <p className="text-lg text-slate-600">
            Track expenses, set monthly budgets, and hit savings goals. MoneyMate gives you clean
            visuals, smart alerts, and an AI-assisted categorizer so you always know where you stand.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="btn-primary">Create account</Link>
            <Link href="/signin" className="btn-ghost">I already have an account</Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2"><Check/> Secure by design</div>
            <div className="flex items-center gap-2"><Check/> Works on any device</div>
            <div className="flex items-center gap-2"><Check/> Free to start</div>
          </div>
        </div>

        <div className="card p-5">
          <div className="rounded-2xl border bg-gradient-to-br from-sky-100 to-indigo-100 h-72 md:h-96
                          flex items-center justify-center text-slate-500">
            Live charts &amp; insights preview
          </div>
          <div className="mt-3 text-xs text-slate-500">Demo preview — connect your data after sign-in</div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-8">
        <h2 className="text-3xl font-semibold mb-6">Everything you need to stay on track</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              title: 'Income & Expense Tracking',
              desc: 'Add transactions manually or let our categorizer label them automatically.',
            },
            {
              title: 'Dynamic Budgets',
              desc: 'Monthly budgets with progress bars and overspending warnings in real time.',
            },
            {
              title: 'Clear Visuals',
              desc: 'Pie, line, and bar charts to see trends by day and category at a glance.',
            },
            {
              title: 'Savings & Goals',
              desc: 'Create targets like “Save 5,000,000 VND in 3 months” and watch your progress.',
            },
            {
              title: 'Smart Alerts',
              desc: 'Bill reminders and spending nudges so you never miss an important payment.',
            },
            {
              title: 'Multi-currency & Localized',
              desc: 'Ready for VND and more, with clean formatting and date handling.',
            },
          ].map((f) => (
            <div key={f.title} className="card p-5">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center">
                  <svg className="w-5 h-5 text-sky-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2 2 7l10 5 10-5-10-5zm0 7L2 4v13l10 5 10-5V4l-10 5z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">{f.title}</div>
                  <p className="text-slate-600 mt-1">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-14">
        <h2 className="text-3xl font-semibold mb-6">How it works</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {step: '1', title: 'Create your account', text: 'Sign up with email. Your data is private to you.'},
            {step: '2', title: 'Add transactions', text: 'Log expenses/income; categories auto-fill but you can edit.'},
            {step: '3', title: 'Set budgets & goals', text: 'Pick monthly limits and savings targets; get alerts if you overspend.'},
          ].map(s => (
            <div key={s.step} className="card p-6">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">{s.step}</div>
              <div className="mt-4 font-medium">{s.title}</div>
              <p className="text-slate-600 mt-1">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SCREENSHOT STRIP */}
      <section className="mt-14">
        <div className="card p-4">
          <div className="grid md:grid-cols-3 gap-4">
            {['Dashboard', 'Transactions', 'Goals'].map((label) => (
              <div key={label} className="rounded-xl border bg-slate-50 h-48 md:h-56 flex items-center justify-center text-slate-500">
                {label} screenshot
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mt-14">
        <h2 className="text-3xl font-semibold mb-6">What early users say</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {q: 'Finally a budgeting app that feels calm.', a: 'The charts make it obvious where my money is going.'},
            {q: 'The alerts saved me late fees twice.', a: 'Bill reminders are a lifesaver.'},
            {q: 'Goals made saving fun.', a: 'Seeing the progress bar go up each week keeps me motivated.'},
          ].map((t, i) => (
            <div key={i} className="card p-5">
              <p className="text-slate-700 italic">“{t.q}”</p>
              <p className="text-slate-500 mt-2">— {t.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING / CTA */}
      <section className="mt-14">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-2xl font-semibold">Free</h3>
            <p className="text-slate-600 mt-1">All core features. Perfect for getting started.</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Check/> Unlimited transactions</li>
              <li className="flex items-center gap-2"><Check/> Monthly budgets & goals</li>
              <li className="flex items-center gap-2"><Check/> Charts & insights</li>
            </ul>
            <Link href="/signup" className="btn-primary mt-5 inline-block">Start free</Link>
          </div>
          <div className="card p-6 border-sky-300">
            <h3 className="text-2xl font-semibold">Pro (coming soon)</h3>
            <p className="text-slate-600 mt-1">Advanced automations and export tools.</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Check/> Rule-based alerts</li>
              <li className="flex items-center gap-2"><Check/> CSV/Excel export</li>
              <li className="flex items-center gap-2"><Check/> Multi-wallet envelopes</li>
            </ul>
            <a href="#" className="btn-ghost mt-5 inline-block">Join waitlist</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="text-3xl font-semibold mb-6">Frequently asked</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              q: 'Is MoneyMate free?',
              a: 'Yes, the core features are free. A Pro plan with advanced tools will be optional later.',
            },
            {
              q: 'Where is my data stored?',
              a: 'Securely in Supabase, scoped to your account. You control your data and can delete it anytime.',
            },
            {
              q: 'Does it support VND?',
              a: 'Yes. We display currency using your browser locale. Multi-currency support is built-in.',
            },
            {
              q: 'Can I import existing data?',
              a: 'CSV import is on the roadmap. For now, add transactions quickly with our fast form.',
            },
          ].map((item) => (
            <div key={item.q} className="card p-5">
              <div className="font-medium">{item.q}</div>
              <p className="text-slate-600 mt-1">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-16 card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold">Ready to take control of your money?</div>
          <div className="text-slate-600">Create a free account and set your first budget in under 60 seconds.</div>
        </div>
        <div className="flex gap-3">
          <Link href="/signup" className="btn-primary">Get started</Link>
          <Link href="/dashboard" className="btn-ghost">See the demo</Link>
        </div>
      </section>
    </>
  );
}
