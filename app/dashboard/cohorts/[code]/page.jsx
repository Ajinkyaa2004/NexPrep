'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft, Users, Copy, Check, Loader2, ClipboardList, TrendingUp, UserX, UsersRound,
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { getIdToken } from '../../../../lib/clientAuth';
import { getCohortDetail } from '../../../actions/cohort';

export default function CohortDetailPage() {
  const params = useParams();
  const router = useRouter();
  const code = params?.code;
  const [cohort, setCohort] = useState(undefined); // undefined=loading, null=not found
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getIdToken();
      const res = await getCohortDetail(code, token);
      setCohort(res);
    })();
  }, [code]);

  const copyCode = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    toast.success('Invite code copied');
    setTimeout(() => setCopied(false), 1500);
  };

  if (cohort === undefined) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin" /> Loading cohort…
      </div>
    );
  }

  if (cohort === null) {
    return (
      <div className="text-center py-24">
        <UserX className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800">Cohort not found</h3>
        <p className="text-gray-500 mt-1 mb-6">It may not exist, or you don’t have access to it.</p>
        <Button onClick={() => router.push('/dashboard/cohorts')} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to cohorts
        </Button>
      </div>
    );
  }

  const avgClass = (s) => (s >= 8 ? 'text-green-600 bg-green-50' : s >= 5 ? 'text-amber-600 bg-amber-50' : s > 0 ? 'text-red-500 bg-red-50' : 'text-gray-400 bg-gray-50');
  const classAvg = cohort.roster.length
    ? +(cohort.roster.reduce((s, r) => s + r.avgScore, 0) / cohort.roster.filter(r => r.avgScore > 0).length || 0).toFixed(1)
    : 0;
  const totalInterviews = cohort.roster.reduce((s, r) => s + r.interviews, 0);

  return (
    <div className="space-y-6">
      <button onClick={() => router.push('/dashboard/cohorts')} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> All cohorts
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shrink-0">
            <UsersRound className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 truncate">{cohort.name}</h2>
            <p className="text-sm text-gray-500 truncate">{cohort.description || 'No description'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-gray-400">Invite code</span>
          <button onClick={copyCode} className="flex items-center gap-2 font-mono font-bold text-primary bg-primary/5 px-3 py-2 rounded-xl hover:bg-primary/10 transition-colors">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {cohort.code}
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Students', value: cohort.roster.length, icon: Users },
          { label: 'Total interviews', value: totalInterviews, icon: ClipboardList },
          { label: 'Cohort avg score', value: classAvg > 0 ? `${classAvg}/10` : '—', icon: TrendingUp },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/5 text-primary"><s.icon className="w-5 h-5" /></div>
          </div>
        ))}
      </div>

      {/* Roster */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-800">Student progress</h3>
        </div>
        {cohort.roster.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No students yet. Share the code <span className="font-mono font-bold text-primary">{cohort.code}</span> to invite them.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold text-gray-400 uppercase">
              <div className="col-span-5">Student</div>
              <div className="col-span-2 text-center">Interviews</div>
              <div className="col-span-2 text-center">Answered</div>
              <div className="col-span-3 text-right">Avg score</div>
            </div>
            {cohort.roster.map((r, i) => (
              <motion.div
                key={r.email}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="grid grid-cols-2 sm:grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50/50 transition-colors"
              >
                <div className="col-span-2 sm:col-span-5 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm uppercase shrink-0">
                    {(r.name || r.email)[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{r.name}</p>
                    <p className="text-xs text-gray-400 truncate">{r.email}</p>
                  </div>
                </div>
                <div className="hidden sm:block sm:col-span-2 text-center font-semibold text-gray-700">{r.interviews}</div>
                <div className="hidden sm:block sm:col-span-2 text-center text-gray-600">{r.questionsAnswered}</div>
                <div className="col-span-2 sm:col-span-3 flex sm:justify-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${avgClass(r.avgScore)}`}>
                    {r.avgScore > 0 ? `${r.avgScore}/10` : 'No data'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
