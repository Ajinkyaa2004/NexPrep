'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { Button } from '../../../components/ui/button';
import { auth } from '../../../firebase/client';
import AuthShell from '../_components/AuthShell';
import FloatingInput from '../_components/FloatingInput';
import GoogleButton from '../_components/GoogleButton';

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      if (fullName.trim()) {
        await updateProfile(user, { displayName: fullName.trim() });
      }
      // Fire-and-forget verification email (don't block the redirect on it).
      sendEmailVerification(user).catch((err) => console.warn('Verification email failed:', err?.code));
      toast.success('Account created! Welcome to NexPrep 🎉');
      setTimeout(() => router.push('/dashboard'), 900);
    } catch (error) {
      console.error('Signup error:', error.message);
      const map = {
        'auth/email-already-in-use': 'An account already exists with this email. Please sign in instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
      };
      toast.error(map[error.code] || 'Signup failed. Please try again.');
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
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create your account</h1>
          <p className="text-gray-500 mt-2">Start practicing for free — no credit card required.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FloatingInput
            id="name"
            label="Full Name"
            type="text"
            icon={User}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
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
            autoComplete="new-password"
          />
          <FloatingInput
            id="confirm-password"
            label="Confirm Password"
            type="password"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#4A6CFF] to-[#8393FF] hover:from-[#3D5CF0] hover:to-[#7384FF] text-white text-base font-semibold shadow-lg shadow-[#4A6CFF]/25 hover:shadow-[#4A6CFF]/40 transition-all duration-300 group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Creating account...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Create Account
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

        <GoogleButton label="Sign up with Google" />

        <p className="text-sm text-center text-gray-500 mt-8">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="text-[#4A6CFF] font-semibold hover:underline">
            Sign in here
          </Link>
        </p>

        <p className="text-xs text-center text-gray-400 mt-4">
          By signing up you agree to our{' '}
          <Link href="/terms" className="underline hover:text-gray-600">Terms</Link> and{' '}
          <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
        </p>
      </motion.div>
    </AuthShell>
  );
}
