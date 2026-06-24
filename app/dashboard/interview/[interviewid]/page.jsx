'use client';

import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import {
  ArrowRight, ListChecks, Clock, Layers, Briefcase, BarChart3, ChevronLeft,
  Video, Mic, CheckCircle2, Loader2, Volume2, FileText,
} from 'lucide-react';
import { getInterviewById } from '../../../actions/interview';
import { getIdToken } from '../../../../lib/clientAuth';
import { Button } from '../../../../components/ui/button';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params?.interviewid;

  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (interviewId) getInterviewDetails(interviewId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  const getInterviewDetails = async (id) => {
    setLoading(true);
    const token = await getIdToken();
    const result = await getInterviewById(id, token);
    setInterviewData(result || null);
    setLoading(false);
  };

  const getStructure = () => {
    try {
      const groups = JSON.parse(interviewData.jsonMockResp).interview || {};
      const categories = Object.entries(groups)
        .map(([name, qs]) => ({ name: name.replace(/_/g, ' '), count: Array.isArray(qs) ? qs.length : 0 }))
        .filter((c) => c.count > 0);
      return { total: categories.reduce((s, c) => s + c.count, 0), categories };
    } catch { return null; }
  };
  const structure = interviewData ? getStructure() : null;

  const detailItem = (icon, label, value) => (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">{label}</p>
        <p className="text-sm font-semibold text-gray-800 truncate">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-2">
      {/* Header */}
      <button onClick={() => router.push('/dashboard')} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-4">
        <ChevronLeft className="w-4 h-4" /> Dashboard
      </button>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Let’s get started</h1>
      <p className="text-gray-500 mt-1 mb-8">Check your setup and review your interview, then begin when you’re ready.</p>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin" /> Loading your interview…
        </div>
      ) : !interviewData ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-xl font-bold text-gray-800">Interview not found</p>
          <p className="text-gray-500 mt-1 mb-6">It may not exist, or you don’t have access to it.</p>
          <Link href="/dashboard"><Button variant="outline">Back to Dashboard</Button></Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* LEFT — camera + tips */}
          <div className="space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 shadow-sm flex items-center justify-center">
              {webCamEnabled ? (
                <Webcam mirrored audio style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="flex flex-col items-center text-gray-300 gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Video className="w-8 h-8" />
                  </div>
                  <p className="text-sm">Camera preview</p>
                </div>
              )}
              {webCamEnabled && (
                <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Camera ready
                </span>
              )}
            </div>

            {!webCamEnabled && (
              <Button onClick={() => setWebCamEnabled(true)} className="w-full h-12 gap-2 bg-primary hover:bg-primary/90 text-white text-base font-semibold">
                <Mic className="w-4 h-4" /> Enable camera & microphone
              </Button>
            )}

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <h3 className="font-bold text-gray-800 text-sm mb-3">Before you begin</h3>
              <ul className="space-y-2.5 text-sm text-gray-600">
                {[
                  ['Find a quiet space', 'so your answers transcribe accurately.'],
                  ['Answer out loud', 'speak naturally — or type if you prefer.'],
                  ['Use the timer', 'pace yourself like a real interview.'],
                  ['Save each answer', 'to get a scored AI report at the end.'],
                ].map(([t, d]) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span><span className="font-medium text-gray-800">{t}</span> — {d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT — details + structure + start */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4">Interview details</h3>
              <div className="grid grid-cols-2 gap-3">
                {detailItem(<Briefcase className="w-4 h-4" />, 'Role', interviewData.jobPosition)}
                {detailItem(<BarChart3 className="w-4 h-4" />, 'Experience', `${interviewData.jobExperience} yr`)}
                {detailItem(<Clock className="w-4 h-4" />, 'Duration', interviewData.selectedDuration)}
                {detailItem(<Layers className="w-4 h-4" />, 'Difficulty', interviewData.selectedDifficulty)}
              </div>
              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Job description
                </p>
                <div className="max-h-32 overflow-y-auto text-sm text-gray-700 leading-relaxed bg-gray-50/60 border border-gray-100 rounded-xl p-3 whitespace-pre-wrap break-words">
                  {interviewData.jobDescription}
                </div>
              </div>
            </div>

            {structure && structure.total > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-1">
                  <ListChecks className="w-5 h-5 text-primary" /> Your interview is ready
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Built from your inputs — {interviewData.interviewType ? <span className="font-medium text-gray-700">{interviewData.interviewType}</span> : 'a tailored'} interview, {interviewData.selectedDifficulty} difficulty.
                </p>
                <div className="flex flex-wrap gap-2.5 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-sm bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-medium"><ListChecks className="w-4 h-4" /> {structure.total} questions</span>
                  <span className="inline-flex items-center gap-1.5 text-sm bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-medium"><Clock className="w-4 h-4" /> {interviewData.selectedDuration}</span>
                  <span className="inline-flex items-center gap-1.5 text-sm bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-medium"><Layers className="w-4 h-4" /> {structure.categories.length} sections</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {structure.categories.map((c) => (
                    <span key={c.name} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">{c.name} · {c.count}</span>
                  ))}
                </div>
              </div>
            )}

            <Link href={`/dashboard/interview/${interviewId}/start`} replace className="block">
              <Button className="w-full h-14 gap-2 text-base font-semibold bg-gradient-to-r from-[#4A6CFF] to-[#8393FF] hover:from-[#3D5CF0] hover:to-[#7384FF] text-white shadow-lg shadow-[#4A6CFF]/25 hover:-translate-y-0.5 transition-all group">
                Start Interview
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-center text-xs text-gray-400 -mt-3">You can answer by voice or text · {structure?.total || ''} questions await</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewPage;
