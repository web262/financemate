// src/app/layout.tsx
import './globals.css';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import SignOut from '@/components/SignOut'; // Import SignOut component

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MoneyMate',
  description: 'Smart budgeting & expense tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated
    const session = supabase.auth.getSession();
    setUser(session?.user ?? null);

    // Monitor auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  return (
    <html lang="en" className={inter.className}>
      <body className="text-slate-900">
        <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
          <div className="container-xx flex h-14 items-center justify-between">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              <span className="text-sky-600">Money</span>Mate
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/dashboard" className="hover:text-sky-700">Dashboard</Link>
              <Link href="/transactions" className="hover:text-sky-700">Transactions</Link>
              <Link href="/goals" className="hover:text-sky-700">Goals</Link>

              {/* Render SignIn/SignOut buttons based on user authentication state */}
              {user ? (
                <>
                  <span className="mr-4">Hello, {user.email}</span>
                  <SignOut /> {/* SignOut button */}
                </>
              ) : (
                <Link href="/signin" className="btn-ghost">Sign in</Link> {/* SignIn button */}
              )}
            </nav>
          </div>
        </header>

        <main className="container-xx py-8">{children}</main>

        <footer className="mt-16 border-t">
          <div className="container-xx py-8 text-xs text-slate-500">
            Built with Next.js + Supabase • © {new Date().getFullYear()}
          </div>
        </footer>
      </body>
    </html>
  );
}
