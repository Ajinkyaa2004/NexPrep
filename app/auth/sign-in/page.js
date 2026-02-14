'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { auth } from '../../../firebase/client';
import { signInWithEmailAndPassword } from 'firebase/auth';

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 15,
      delay: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + i * 0.1,
      duration: 0.4,
    },
  }),
};

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
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (error) {
      console.error('Signin error:', error.message);
      toast.error(error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white bg-[url('/grid.svg')] bg-cover">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="backdrop-blur-xl border border-gray-200 bg-white/80 shadow-xl rounded-3xl p-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div className="flex justify-center mb-4" variants={itemVariants} custom={0}>
          <Image src="/logo.svg" alt="Site Logo" width={200} height={20} className="rounded-lg" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-2xl font-semibold text-center text-blue-500 mb-1"
          variants={itemVariants}
          custom={1}
        >
          Welcome Back
        </motion.h1>
        <motion.p
          className="text-sm text-center text-gray-500 mb-8"
          variants={itemVariants}
          custom={2}
        >
          Sign in to continue your journey!
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial="hidden"
          animate="visible"
        >
          {[3, 4].map((i) => (
            <motion.div key={i} className="relative group" variants={itemVariants} custom={i}>
              <input
                type={i === 4 ? 'password' : 'email'}
                id={i === 4 ? 'password' : 'email'}
                required
                className="w-full px-4 pt-6 pb-1 text-sm bg-transparent border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer transition"
                placeholder=" "
                value={i === 4 ? password : email}
                onChange={(e) => {
                  const val = e.target.value;
                  if (i === 4) setPassword(val);
                  else setEmail(val);
                }}
              />
              <label
                htmlFor={i === 4 ? 'password' : 'email'}
                className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              >
                {i === 4 ? 'Password' : 'Email Address'}
              </label>
            </motion.div>
          ))}

          {/* Submit Button */}
          <motion.div variants={itemVariants} custom={5}>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-md rounded-xl py-2 text-base font-medium transition"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </motion.div>
        </motion.form>

        {/* Footer */}
        <motion.p
          className="text-sm text-center text-gray-500 mt-6"
          variants={itemVariants}
          custom={6}
        >
          Don’t have an account?{' '}
          <Link href="/auth/sign-up" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
