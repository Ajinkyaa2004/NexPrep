'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { auth } from '../../../firebase/client';
import { createUserWithEmailAndPassword } from 'firebase/auth';

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

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up:', userCredential.user);
      toast.success('Account created! Redirecting to sign-in...');
      setTimeout(() => router.push('/auth/sign-in'), 1500);
    } catch (error) {
      console.error('Signup error:', error.message);

      if (error.code === 'auth/email-already-in-use') {
        toast.error('An account already exists with this email. Please sign in instead.');
      } else {
        toast.error(error.message || 'Signup failed');
      }
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
          Create a new account
        </motion.h1>
        <motion.p
          className="text-sm text-center text-gray-500 mb-8"
          variants={itemVariants}
          custom={2}
        >
          Join and prepare for your future!
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial="hidden"
          animate="visible"
        >
          {[3, 4, 5, 6].map((i) => (
            <motion.div key={i} className="relative group" variants={itemVariants} custom={i}>
              <input
                type={i === 5 || i === 6 ? 'password' : i === 4 ? 'email' : 'text'}
                id={
                  i === 3
                    ? 'name'
                    : i === 4
                    ? 'email'
                    : i === 5
                    ? 'password'
                    : 'confirm-password'
                }
                required
                className="w-full px-4 pt-6 pb-1 text-sm bg-transparent border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer transition"
                placeholder=" "
                value={
                  i === 3
                    ? fullName
                    : i === 4
                    ? email
                    : i === 5
                    ? password
                    : confirmPassword
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (i === 3) setFullName(val);
                  else if (i === 4) setEmail(val);
                  else if (i === 5) setPassword(val);
                  else setConfirmPassword(val);
                }}
              />
              <label
                htmlFor={
                  i === 3
                    ? 'name'
                    : i === 4
                    ? 'email'
                    : i === 5
                    ? 'password'
                    : 'confirm-password'
                }
                className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              >
                {i === 3
                  ? 'Full Name'
                  : i === 4
                  ? 'Email Address'
                  : i === 5
                  ? 'Password'
                  : 'Confirm Password'}
              </label>
            </motion.div>
          ))}

          {/* Submit Button */}
          <motion.div variants={itemVariants} custom={7}>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-md rounded-xl py-2 text-base font-medium transition"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </motion.div>
        </motion.form>

        {/* Footer */}
        <motion.p
          className="text-sm text-center text-gray-500 mt-6"
          variants={itemVariants}
          custom={8}
        >
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="text-blue-500 hover:underline">
            Sign in here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
