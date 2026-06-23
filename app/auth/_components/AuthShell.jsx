'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { Sparkles, CheckCircle2, BrainCircuit, FileCheck2, BarChart3, ShieldCheck } from 'lucide-react';
import { auth } from '../../../firebase/client';

const features = [
  { icon: BrainCircuit, title: 'AI Mock Interviews', desc: 'Role-tailored questions generated in seconds.' },
  { icon: BarChart3, title: 'Instant Feedback', desc: 'Detailed scoring on every answer you give.' },
  { icon: ShieldCheck, title: 'ATS Resume Checker', desc: 'Beat the bots and get past screening.' },
  { icon: FileCheck2, title: 'Resume Builder', desc: 'Craft a recruiter-ready resume fast.' },
];

const blob = {
  animate: {
    scale: [1, 1.15, 1],
    x: [0, 20, 0],
    y: [0, -20, 0],
    transition: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
  },
};

/**
 * Split-screen auth shell. Left = animated brand panel (lg+), right = form.
 */
export default function AuthShell({ children }) {
  const router = useRouter();

  // If the visitor is already signed in, don't let them sit on the auth pages.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.replace('/dashboard');
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen w-full flex bg-[#F2F4F7]">
      {/* LEFT — Brand panel */}
      <div className="relative hidden lg:flex w-1/2 overflow-hidden bg-gradient-to-br from-[#4A6CFF] via-[#5C73FF] to-[#8393FF] text-white">
        {/* Animated gradient blobs */}
        <motion.div
          variants={blob}
          animate="animate"
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/20 blur-3xl"
        />
        <motion.div
          variants={blob}
          animate="animate"
          style={{ animationDelay: '2s' }}
          className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-[#A9D7FF]/30 blur-3xl"
        />
        <motion.div
          variants={blob}
          animate="animate"
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-indigo-300/20 blur-3xl"
        />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Brand mark */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="bg-white rounded-2xl p-2.5 shadow-lg shadow-black/10">
              <Image src="/logo.svg" alt="NexPrep" width={130} height={40} priority className="h-7 w-auto" />
            </div>
          </motion.div>

          {/* Headline */}
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-semibold mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Gemini AI
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl xl:text-5xl font-extrabold leading-[1.1] tracking-tight"
            >
              Land your dream job with confidence.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-4 text-white/80 text-lg leading-relaxed"
            >
              Practice realistic interviews, get instant AI feedback, and polish your resume — all in one place.
            </motion.p>

            {/* Feature grid */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4 hover:bg-white/15 transition-colors"
                >
                  <div className="rounded-xl bg-white/20 p-2 shrink-0">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{f.title}</p>
                    <p className="text-white/70 text-xs mt-0.5 leading-snug">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer / social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center gap-3 text-sm text-white/80"
          >
            <CheckCircle2 className="w-4 h-4" />
            Trusted by candidates preparing for top companies.
          </motion.div>
        </div>
      </div>

      {/* RIGHT — Form panel */}
      <div className="relative flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-10">
        {/* Soft glow accents for the form side */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 right-0 w-72 h-72 bg-[#4A6CFF]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-10 w-72 h-72 bg-[#8393FF]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
