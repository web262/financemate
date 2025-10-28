'use client';
import { supabase } from '@/lib/supabaseClient'; // Import supabase client
import { useRouter } from 'next/navigation'; // Use next.js router for redirection

export default function SignOut() {
  const router = useRouter(); // Initialize router for navigation

  // SignOut function
  const signout = async () => {
    // Perform sign-out with supabase auth
    await supabase.auth.signOut();

    // Redirect to the sign-in page after successful sign-out
    router.replace('/signin');
  };

  return (
    <button 
      onClick={signout} 
      className="px-3 py-1 rounded border bg-red-500 text-white hover:bg-red-600 transition duration-200"
    >
      Sign Out
    </button>
  );
}
