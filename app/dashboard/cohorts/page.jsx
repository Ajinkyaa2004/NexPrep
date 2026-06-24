'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Users, Plus, GraduationCap, LogIn, Copy, ArrowRight, Loader2, Check,
  UsersRound, Sparkles, X,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { getIdToken } from '../../../lib/clientAuth';
import { createCohort, getMyCohorts, joinCohort } from '../../actions/cohort';

export default function CohortsPage() {
  const router = useRouter();
  const [tab, setTab] = useState('teaching');
  const [data, setData] = useState({ teaching: [], enrolled: [] });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'create' | 'join' | null
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState('');

  // form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');

  const load = async () => {
    setLoading(true);
    const token = await getIdToken();
    const res = await getMyCohorts(token);
    setData(res);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!name.trim()) { toast.error('Give your cohort a name.'); return; }
    setBusy(true);
    const token = await getIdToken();
    const res = await createCohort({ name, description }, token);
    setBusy(false);
    if (res.success) {
      toast.success(`Cohort created! Invite code: ${res.code}`);
      setModal(null); setName(''); setDescription('');
      setTab('teaching');
      load();
    } else {
      toast.error(res.error || 'Could not create cohort.');
    }
  };

  const handleJoin = async () => {
    if (!code.trim()) { toast.error('Enter an invite code.'); return; }
    setBusy(true);
    const token = await getIdToken();
    const res = await joinCohort(code, token);
    setBusy(false);
    if (res.success) {
      toast.success(`Joined "${res.name}"!`);
      setModal(null); setCode('');
      setTab('enrolled');
      load();
    } else {
      toast.error(res.error || 'Could not join cohort.');
    }
  };

  const copyCode = (c) => {
    navigator.clipboard?.writeText(c);
    setCopied(c);
    toast.success('Invite code copied');
    setTimeout(() => setCopied(''), 1500);
  };

  const list = tab === 'teaching' ? data.teaching : data.enrolled;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200/60 pb-6">
        <div>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold text-primary tracking-wider uppercase border border-primary/20">For educators</span>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 mt-1">
            <UsersRound className="w-7 h-7 text-primary" /> Cohorts
          </h2>
          <p className="text-gray-500 mt-1 text-sm">Create a class, invite students with a code, and track their interview progress.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setModal('join')} variant="outline" className="gap-2 h-10">
            <LogIn className="w-4 h-4" /> Join with code
          </Button>
          <Button onClick={() => setModal('create')} className="gap-2 h-10 bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4" /> Create cohort
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{ id: 'teaching', label: 'Teaching', icon: GraduationCap, n: data.teaching.length },
          { id: 'enrolled', label: 'Enrolled', icon: Users, n: data.enrolled.length }].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              tab === t.id ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
            <span className={`text-xs rounded-full px-1.5 ${tab === t.id ? 'bg-white/20' : 'bg-gray-100'}`}>{t.n}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin" /> Loading cohorts…
        </div>
      ) : list.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white rounded-2xl border border-gray-100"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/5 flex items-center justify-center">
            {tab === 'teaching' ? <GraduationCap className="w-8 h-8 text-primary/60" /> : <Users className="w-8 h-8 text-primary/60" />}
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            {tab === 'teaching' ? 'No cohorts yet' : 'You haven’t joined any cohort'}
          </h3>
          <p className="text-gray-500 text-sm mt-1 mb-6 max-w-sm mx-auto">
            {tab === 'teaching'
              ? 'Create a cohort to invite your students and watch their progress in one place.'
              : 'Ask your educator for an invite code and join their cohort.'}
          </p>
          <Button onClick={() => setModal(tab === 'teaching' ? 'create' : 'join')} className="bg-primary hover:bg-primary/90 text-white gap-2">
            {tab === 'teaching' ? <><Plus className="w-4 h-4" /> Create cohort</> : <><LogIn className="w-4 h-4" /> Join with code</>}
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((c, i) => (
            <motion.div
              key={c.code}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
                  <UsersRound className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {c.memberCount}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 truncate">{c.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[2rem]">{c.description || (tab === 'enrolled' ? `By ${c.ownerName}` : 'No description')}</p>

              {tab === 'teaching' ? (
                <div className="mt-4 flex items-center justify-between">
                  <button onClick={() => copyCode(c.code)} className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary bg-primary/5 px-2.5 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                    {copied === c.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {c.code}
                  </button>
                  <button onClick={() => router.push(`/dashboard/cohorts/${c.code}`)} className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    View <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-4 text-xs text-gray-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary/50" /> Enrolled · code {c.code}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Create / Join modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !busy && setModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => !busy && setModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              {modal === 'create' ? (
                <>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><GraduationCap className="w-6 h-6 text-primary" /></div>
                  <h3 className="text-xl font-bold text-gray-900">Create a cohort</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-5">Your students join with a unique invite code.</p>
                  <label className="text-sm font-medium text-gray-700">Cohort name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Batch 2026 — Placement Prep" className="mt-1 mb-4" />
                  <label className="text-sm font-medium text-gray-700">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this cohort for?" className="mt-1 mb-5 h-20 resize-none" />
                  <Button onClick={handleCreate} disabled={busy} className="w-full h-11 bg-primary hover:bg-primary/90 text-white gap-2">
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create cohort
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><LogIn className="w-6 h-6 text-primary" /></div>
                  <h3 className="text-xl font-bold text-gray-900">Join a cohort</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-5">Enter the invite code your educator shared.</p>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    maxLength={12}
                    className="mb-5 text-center text-lg font-mono font-bold tracking-widest uppercase"
                  />
                  <Button onClick={handleJoin} disabled={busy} className="w-full h-11 bg-primary hover:bg-primary/90 text-white gap-2">
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />} Join cohort
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
