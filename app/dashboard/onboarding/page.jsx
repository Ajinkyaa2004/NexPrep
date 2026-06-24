'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, Loader2, Check, Sparkles, Briefcase, Target, Rocket } from 'lucide-react';
import { auth } from '../../../firebase/client';
import { getIdToken } from '../../../lib/clientAuth';
import { getProfile, saveProfile } from '../../actions/profile';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

const EXPERIENCE = ['Student', 'Fresher (0–1 yr)', '1–3 years', '3–5 years', '5+ years'];
const GOALS = ['Land my first job', 'Switch companies', 'Get promoted', 'Just practising'];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', targetRole: '', experienceLevel: '', goal: '', focusAreas: '', targetCompany: '',
  });

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) { router.replace('/auth/sign-in'); return; }
      const token = await getIdToken();
      const existing = await getProfile(token);
      if (existing) { router.replace('/dashboard'); return; } // already onboarded
      setForm((f) => ({ ...f, name: u.displayName || '' }));
      setChecking(false);
    });
    return () => unsub();
  }, [router]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const next = () => {
    if (step === 0 && !form.targetRole.trim()) { toast.error('Tell us the role you’re targeting.'); return; }
    setStep((s) => s + 1);
  };

  const finish = async () => {
    setSaving(true);
    const token = await getIdToken();
    const res = await saveProfile(form, token);
    setSaving(false);
    if (res.success) {
      try { sessionStorage.setItem('nexprep_onboarded', '1'); } catch (_) {}
      toast.success('You’re all set! Welcome to NexPrep 🎉');
      router.replace('/dashboard');
    } else {
      toast.error(res.error || 'Could not save your profile.');
    }
  };

  if (checking) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#F2F4F7]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-gradient-to-br from-[#F2F4F7] to-white overflow-y-auto">
      {/* soft glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-0 w-[28rem] h-[28rem] bg-[#4A6CFF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-10 w-[24rem] h-[24rem] bg-[#8393FF]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-full flex flex-col items-center justify-center p-6">
        <Image src="/logo.svg" alt="NexPrep" width={140} height={40} priority className="h-9 w-auto mb-8" />

        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl shadow-[#4A6CFF]/10 border border-gray-100 p-8">
          {/* progress */}
          <div className="flex items-center gap-2 mb-6">
            {[0, 1].map((i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-gray-100'}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold mb-4">
                  <Sparkles className="w-3.5 h-3.5" /> Let’s personalize your prep
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900">Welcome{form.name ? `, ${form.name.split(' ')[0]}` : ''} 👋</h1>
                <p className="text-gray-500 mt-1 mb-6">A few quick details so we can tailor your interviews.</p>

                <label className="text-sm font-medium text-gray-700">Your name</label>
                <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" className="mt-1 mb-4" />

                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-primary" /> Target role</label>
                <Input value={form.targetRole} onChange={(e) => set('targetRole', e.target.value)} placeholder="e.g. Frontend Developer, Data Analyst" className="mt-1 mb-4" />

                <label className="text-sm font-medium text-gray-700">Experience level</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {EXPERIENCE.map((e) => (
                    <button key={e} onClick={() => set('experienceLevel', e)}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${form.experienceLevel === e ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40'}`}>
                      {e}
                    </button>
                  ))}
                </div>

                <Button onClick={next} className="w-full h-12 mt-8 rounded-xl bg-gradient-to-r from-[#4A6CFF] to-[#8393FF] text-white font-semibold gap-2 group">
                  Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            ) : (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold mb-4">
                  <Target className="w-3.5 h-3.5" /> Almost there
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900">What are you aiming for?</h1>
                <p className="text-gray-500 mt-1 mb-6">This helps us focus your practice. You can change it anytime.</p>

                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Rocket className="w-4 h-4 text-primary" /> Your goal</label>
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  {GOALS.map((g) => (
                    <button key={g} onClick={() => set('goal', g)}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${form.goal === g ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40'}`}>
                      {g}
                    </button>
                  ))}
                </div>

                <label className="text-sm font-medium text-gray-700">Focus areas / skills <span className="text-gray-400 font-normal">(optional)</span></label>
                <Input value={form.focusAreas} onChange={(e) => set('focusAreas', e.target.value)} placeholder="e.g. React, system design, DSA, communication" className="mt-1 mb-4" />

                <label className="text-sm font-medium text-gray-700">Dream company <span className="text-gray-400 font-normal">(optional)</span></label>
                <Input value={form.targetCompany} onChange={(e) => set('targetCompany', e.target.value)} placeholder="e.g. Google, a startup, …" className="mt-1" />

                <div className="flex gap-3 mt-8">
                  <Button onClick={() => setStep(0)} variant="outline" className="h-12 gap-2"><ArrowLeft className="w-4 h-4" /> Back</Button>
                  <Button onClick={finish} disabled={saving} className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#4A6CFF] to-[#8393FF] text-white font-semibold gap-2">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />} Finish & go to dashboard
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => { try { sessionStorage.setItem('nexprep_onboarded', '1'); } catch (_) {} router.replace('/dashboard'); }}
          className="mt-5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
