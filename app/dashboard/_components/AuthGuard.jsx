'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { auth } from '../../../firebase/client';
import { getIdToken } from '../../../lib/clientAuth';
import { getProfile } from '../../actions/profile';

/**
 * Client-side route guard for the whole /dashboard segment.
 * - Redirects unauthenticated users to sign-in.
 * - On first login (no profile yet) sends the user to onboarding, unless they
 *   already skipped it this session or are already on the onboarding route.
 */
export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState('checking'); // checking | authed | unauthed

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus('unauthed');
        router.replace('/auth/sign-in');
        return;
      }

      const onOnboarding = pathname === '/dashboard/onboarding';
      const skipped = typeof window !== 'undefined' && sessionStorage.getItem('nexprep_onboarded') === '1';

      if (!onOnboarding && !skipped) {
        try {
          const token = await getIdToken();
          const profile = await getProfile(token);
          if (profile) {
            sessionStorage.setItem('nexprep_onboarded', '1');
          } else {
            router.replace('/dashboard/onboarding');
            return;
          }
        } catch (_) {
          // If the check fails, don't block the user.
        }
      }
      setStatus('authed');
    });
    return () => unsubscribe();
  }, [router, pathname]);

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
