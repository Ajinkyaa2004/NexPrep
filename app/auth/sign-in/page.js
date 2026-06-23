'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '../../../components/ui/button';
import { auth } from '../../../firebase/client';
import AuthShell from '../_components/AuthShell';
import FloatingInput from '../_components/FloatingInput';
import GoogleButton from '../_components/GoogleButton';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (error) {
      console.error('Signin error:', error.message);
      const map = {
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
      };
      toast.error(map[error.code] || 'Sign in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden flex justify-center mb-8">
          <Image src="/logo.svg" alt="NexPrep" width={150} height={44} priority className="h-10 w-auto" />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h1>
          <p className="text-gray-500 mt-2">Sign in to continue your interview prep journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FloatingInput
            id="email"
            label="Email Address"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <FloatingInput
            id="password"
            label="Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <div className="flex justify-end">
            <Link href="/auth/forgot" className="text-sm text-[#4A6CFF] font-medium hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#4A6CFF] to-[#8393FF] hover:from-[#3D5CF0] hover:to-[#7384FF] text-white text-base font-semibold shadow-lg shadow-[#4A6CFF]/25 hover:shadow-[#4A6CFF]/40 transition-all duration-300 group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <GoogleButton label="Sign in with Google" />

        <p className="text-sm text-center text-gray-500 mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/auth/sign-up" className="text-[#4A6CFF] font-semibold hover:underline">
            Sign up for free
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
}
