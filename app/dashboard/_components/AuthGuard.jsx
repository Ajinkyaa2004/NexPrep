'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { auth } from '../../../firebase/client';

/**
 * Client-side route guard for the whole /dashboard segment.
 * Until Firebase resolves the auth state we render a loader (so protected
 * content never flashes); if there's no signed-in user we redirect to sign-in.
 */
export default function AuthGuard({ children }) {
  const router = useRouter();
  const [status, setStatus] = useState('checking'); // checking | authed | unauthed

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setStatus('authed');
      } else {
        setStatus('unauthed');
        router.replace('/auth/sign-in');
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (status !== 'authed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FA] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-gray-500">
          {status === 'unauthed' ? 'Please sign in to continue. Redirecting…' : 'Loading your workspace…'}
        </p>
      </div>
    );
  }

  return children;
}
