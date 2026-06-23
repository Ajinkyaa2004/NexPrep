'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Button } from '../../../components/ui/button';
import { auth } from '../../../firebase/client';
import AuthShell from '../_components/AuthShell';
import FloatingInput from '../_components/FloatingInput';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success('Reset link sent — check your inbox.');
    } catch (error) {
      console.error('Reset error:', error.code);
      // Don't reveal whether an account exists — show a neutral success either way.
      if (error.code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address.');
      } else {
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="lg:hidden flex justify-center mb-8">
          <Image src="/logo.svg" alt="NexPrep" width={150} height={44} priority className="h-10 w-auto" />
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Check your email</h1>
            <p className="text-gray-500 mt-3 leading-relaxed">
              If an account exists for <span className="font-medium text-gray-700">{email}</span>, we&apos;ve sent a
              password reset link. It may take a minute to arrive.
            </p>
            <Link href="/auth/sign-in" className="inline-flex items-center gap-1.5 mt-8 text-[#4A6CFF] font-semibold hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reset your password</h1>
              <p className="text-gray-500 mt-2">Enter your email and we&apos;ll send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <FloatingInput id="email" label="Email Address" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#4A6CFF] to-[#8393FF] hover:from-[#3D5CF0] hover:to-[#7384FF] text-white text-base font-semibold shadow-lg shadow-[#4A6CFF]/25 transition-all group"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Sending…</span>
                ) : (
                  <span className="flex items-center justify-center gap-2">Send reset link <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                )}
              </Button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-8">
              Remembered it?{' '}
              <Link href="/auth/sign-in" className="text-[#4A6CFF] font-semibold hover:underline">Back to sign in</Link>
            </p>
          </>
        )}
      </motion.div>
    </AuthShell>
  );
}
