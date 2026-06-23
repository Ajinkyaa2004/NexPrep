'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/client';
import {
  Sparkles, BrainCircuit, BarChart3, ShieldCheck, FileCheck2, Mic,
  ArrowRight, Check, ChevronDown, Zap, Target, Menu, X,
} from 'lucide-react';

const features = [
  { icon: BrainCircuit, title: 'AI Mock Interviews', desc: 'Role-tailored questions generated from your job title, description and experience — across behavioural, technical and situational rounds.' },
  { icon: BarChart3, title: 'Instant, Honest Feedback', desc: 'Every answer is scored 1–10 and compared against an ideal answer, with specific notes on what to fix.' },
  { icon: ShieldCheck, title: 'ATS Resume Checker', desc: 'See how your resume scores against applicant tracking systems and which keywords you are missing.' },
  { icon: FileCheck2, title: 'Resume Builder', desc: 'Craft a clean, recruiter-ready resume from polished templates in minutes.' },
  { icon: Mic, title: 'Speak or Type', desc: 'Answer out loud with live speech-to-text, or type — whatever feels closest to the real thing.' },
  { icon: Target, title: 'Track Your Progress', desc: 'Watch your scores climb over time and focus practice where it matters most.' },
];

const steps = [
  { n: '01', title: 'Tell us the role', desc: 'Add the job title, description, experience and difficulty. Our AI builds a tailored interview.' },
  { n: '02', title: 'Take the interview', desc: 'Answer questions by voice or text with your webcam on — just like the real interview.' },
  { n: '03', title: 'Get your report', desc: 'Receive a detailed, scored feedback report and a clear plan to improve.' },
];

const faqs = [
  { q: 'Is NexPrep free to use?', a: 'Yes — NexPrep is currently in early access and completely free. You get unlimited mock interviews, AI feedback, the ATS checker and the resume builder at no cost.' },
  { q: 'How does the AI feedback work?', a: 'When you answer a question, your response is sent to Google Gemini along with the question and an ideal answer. It returns a 1–10 score and detailed, specific feedback — it is never hardcoded.' },
  { q: 'Do I need a webcam or microphone?', a: 'A webcam and mic make it feel realistic and let you answer aloud, but they are optional — you can always type your answers instead.' },
  { q: 'What kind of interviews can I practise?', a: 'Any role. Describe a software, product, data, design or business role and NexPrep generates relevant ice-breaker, technical, problem-solving and situational questions.' },
  { q: 'Is my data private?', a: 'Your interviews and feedback are tied to your account and only visible to you. See our Privacy Policy for details.' },
];

const roles = ['Frontend Developer', 'Product Manager', 'Data Analyst', 'Backend Engineer', 'UX Designer', 'DevOps Engineer'];
const marqueeRoles = ['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer', 'Marketing Lead', 'Business Analyst', 'DevOps Engineer', 'QA Engineer', 'Sales Executive', 'HR Manager'];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/logo.svg" alt="NexPrep" width={130} height={36} priority className="h-8 w-auto" />
    </Link>
  );
}

/** Fade-up on scroll into view. */
function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Counts up to `to` when scrolled into view. */
function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf, start = null;
    const dur = 1100;
    const tick = (t) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      setVal(Math.round(p * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function Landing() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setLoggedIn(!!u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 2400);
    return () => clearInterval(id);
  }, []);

  const primaryCta = loggedIn
    ? { href: '/dashboard', label: 'Go to Dashboard' }
    : { href: '/auth/sign-up', label: 'Start practicing free' };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-[#4A6CFF] transition-colors">Features</a>
            <a href="#how" className="hover:text-[#4A6CFF] transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-[#4A6CFF] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#4A6CFF] transition-colors">FAQ</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            {!loggedIn && (
              <Link href="/auth/sign-in" className="text-sm font-medium text-gray-700 hover:text-[#4A6CFF] transition-colors">Sign in</Link>
            )}
            <Link href={primaryCta.href} className="text-sm font-semibold text-white bg-[#4A6CFF] hover:bg-[#3D5CF0] px-4 py-2 rounded-xl shadow-sm shadow-[#4A6CFF]/30 transition-colors">
              {loggedIn ? 'Dashboard' : 'Get started'}
            </Link>
          </div>
          <button className="md:hidden p-2 text-gray-700" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-5 py-4 flex flex-col gap-3 text-sm font-medium text-gray-700">
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
            <Link href={primaryCta.href} className="text-white bg-[#4A6CFF] px-4 py-2 rounded-xl text-center">{primaryCta.label}</Link>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-20 px-5 sm:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 left-1/4 w-[32rem] h-[32rem] bg-[#4A6CFF]/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-10 right-0 w-[28rem] h-[28rem] bg-[#8393FF]/10 rounded-full blur-3xl"
          />
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#4A6CFF]/10 text-[#4A6CFF] px-3 py-1 text-xs font-semibold mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" /> Powered by Gemini AI
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.08] tracking-tight text-gray-900"
            >
              Ace your next interview with an AI coach that gives{' '}
              <span className="bg-gradient-to-r from-[#4A6CFF] to-[#8393FF] bg-clip-text text-transparent">real feedback</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl"
            >
              Practice realistic mock interviews tailored to any role, get instant scored feedback on every answer,
              and polish your resume — all in one place.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link href={primaryCta.href} className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#4A6CFF] to-[#8393FF] text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-[#4A6CFF]/25 hover:shadow-[#4A6CFF]/40 hover:-translate-y-0.5 transition-all">
                {primaryCta.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#how" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-6 py-3.5 rounded-xl hover:border-gray-300 hover:-translate-y-0.5 transition-all">
                See how it works
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex items-center gap-2 text-sm text-gray-500"
            >
              <Check className="w-4 h-4 text-green-500" /> Free during early access · No credit card required
            </motion.div>
          </div>

          {/* Hero visual — floating report card with rotating role + animated bars */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="bg-white rounded-3xl shadow-2xl shadow-[#4A6CFF]/10 border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Interview report</p>
                  <div className="h-7 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={roleIdx}
                        initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="font-bold text-gray-800 truncate"
                      >
                        {roles[roleIdx]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border-4 border-green-100 shrink-0">
                  <span className="text-xl font-extrabold text-green-600">8.4</span>
                </div>
              </div>
              {[
                { label: 'Communication', v: 88, c: 'bg-[#4A6CFF]' },
                { label: 'Technical depth', v: 82, c: 'bg-[#8393FF]' },
                { label: 'Problem solving', v: 76, c: 'bg-[#A9D7FF]' },
              ].map((b, i) => (
                <div key={b.label} className="mb-4">
                  <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
                    <span>{b.label}</span><span>{b.v}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${b.c}`}
                      initial={{ width: 0 }} animate={{ width: `${b.v}%` }}
                      transition={{ duration: 1.1, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-5 rounded-xl bg-[#4A6CFF]/5 border border-[#4A6CFF]/10 p-3 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#4A6CFF] mt-0.5 shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed">Strong on fundamentals. Add a concrete metric to your project example to stand out.</p>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-2"
            >
              <Zap className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Streak</p>
                <p className="text-sm font-bold text-gray-800">7 days</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ROLES MARQUEE */}
      <section className="py-6 border-y border-gray-100 bg-white overflow-hidden">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Practise for any role</p>
        <div className="marquee-mask overflow-hidden">
          <div className="flex w-max animate-marquee gap-3">
            {[...marqueeRoles, ...marqueeRoles].map((r, i) => (
              <span key={i} className="shrink-0 rounded-full border border-gray-200 bg-[#F8FAFC] px-5 py-2 text-sm font-medium text-gray-600">
                {r}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-b border-gray-100 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: 6, suffix: '', k: 'Question categories' },
            { n: 10, suffix: '', k: 'Point AI scoring' },
            { n: 3, suffix: '', k: 'Difficulty levels' },
            { n: 100, suffix: '%', k: 'Free in early access' },
          ].map((s) => (
            <div key={s.k}>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#4A6CFF]"><Counter to={s.n} suffix={s.suffix} /></p>
              <p className="text-sm text-gray-500 mt-1">{s.k}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Everything you need to walk in prepared</h2>
            <p className="mt-4 text-gray-600">From the first practice question to a recruiter-ready resume.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.08}>
                <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-xl hover:shadow-gray-100 hover:border-[#4A6CFF]/20 hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[#4A6CFF]/10 flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-[#4A6CFF]" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-5 sm:px-8 bg-[#F8FAFC] border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Three steps to your best interview yet</h2>
            <p className="mt-4 text-gray-600">No setup, no fluff. Start practising in under a minute.</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="relative rounded-2xl bg-white border border-gray-100 p-8 hover:-translate-y-1 hover:shadow-lg transition-all">
                  <span className="text-5xl font-extrabold text-[#4A6CFF]/15">{s.n}</span>
                  <h3 className="font-bold text-xl text-gray-900 mt-3 mb-2">{s.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-5 sm:px-8">
        <Reveal className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Simple pricing</h2>
          <p className="mt-4 text-gray-600">NexPrep is free while in early access. Practise as much as you want.</p>
          <div className="mt-10 rounded-3xl border-2 border-[#4A6CFF]/20 bg-gradient-to-b from-[#4A6CFF]/5 to-white p-10 text-left">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-semibold text-[#4A6CFF] uppercase tracking-wider">Early access</p>
                <p className="text-4xl font-extrabold mt-1">Free</p>
              </div>
              <Link href={primaryCta.href} className="bg-[#4A6CFF] hover:bg-[#3D5CF0] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                {loggedIn ? 'Open dashboard' : 'Get started'}
              </Link>
            </div>
            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {['Unlimited mock interviews', 'Detailed AI feedback', 'ATS resume checker', 'Resume builder', 'Progress tracking', 'Priority support'].map((p) => (
                <div key={p} className="flex items-center gap-2 text-gray-700">
                  <Check className="w-5 h-5 text-green-500 shrink-0" /> {p}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-5 sm:px-8 bg-[#F8FAFC] border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <Reveal><h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center mb-12">Frequently asked questions</h2></Reveal>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-gray-800">
                    {f.q}
                    <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }} className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 -mt-1 text-gray-600 leading-relaxed text-sm">{f.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-5 sm:px-8">
        <Reveal className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-[#4A6CFF] to-[#8393FF] text-white p-12 sm:p-16 text-center relative overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl"
            />
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight relative">Your next interview is closer than you think</h2>
            <p className="mt-4 text-white/85 max-w-xl mx-auto relative">Join NexPrep and turn interview anxiety into confidence — one practice session at a time.</p>
            <Link href={primaryCta.href} className="relative mt-8 inline-flex items-center gap-2 bg-white text-[#4A6CFF] font-semibold px-7 py-3.5 rounded-xl hover:bg-gray-50 hover:-translate-y-0.5 transition-all">
              {primaryCta.label} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 px-5 sm:px-8 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo />
            <p className="text-sm text-gray-500">AI-powered interview preparation.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <a href="#features" className="hover:text-[#4A6CFF]">Features</a>
            <a href="#pricing" className="hover:text-[#4A6CFF]">Pricing</a>
            <Link href="/privacy" className="hover:text-[#4A6CFF]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#4A6CFF]">Terms</Link>
            <Link href="/auth/sign-in" className="hover:text-[#4A6CFF]">Sign in</Link>
          </div>
        </div>
        <p className="max-w-7xl mx-auto mt-8 text-xs text-gray-400 text-center md:text-left">
          © {new Date().getFullYear()} NexPrep AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
