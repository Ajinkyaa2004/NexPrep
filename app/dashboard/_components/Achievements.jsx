'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Star, Target, Rocket, Medal, Award, Crown, Lock } from 'lucide-react';

/**
 * Gamification panel — derives level, XP and unlockable badges from the user's
 * real stats (interviews, questions answered, best/avg score, active-day streak).
 */
function getLevel(questionsSolved) {
  // Simple XP curve: each level needs progressively more answered questions.
  const thresholds = [0, 5, 15, 30, 50, 80, 120];
  let level = 1;
  for (let i = 1; i < thresholds.length; i++) {
    if (questionsSolved >= thresholds[i]) level = i + 1;
  }
  const curr = thresholds[Math.min(level - 1, thresholds.length - 1)];
  const next = thresholds[level] ?? null;
  const into = questionsSolved - curr;
  const span = next !== null ? next - curr : 1;
  const pct = next !== null ? Math.min(100, Math.round((into / span) * 100)) : 100;
  return { level, next, toNext: next !== null ? Math.max(0, next - questionsSolved) : 0, pct };
}

export default function Achievements({ stats, loading }) {
  const { totalInterviews = 0, questionsSolved = 0, bestScore = 0, averageScore = 0, streak = 0 } = stats || {};
  const { level, toNext, pct } = getLevel(questionsSolved);

  const badges = [
    { id: 'first', name: 'First Steps', desc: 'Complete your first interview', icon: Rocket, unlocked: totalInterviews >= 1, color: 'from-blue-500 to-indigo-500' },
    { id: 'five', name: 'Warming Up', desc: 'Answer 5 questions', icon: Target, unlocked: questionsSolved >= 5, color: 'from-cyan-500 to-blue-500' },
    { id: 'streak3', name: 'On a Roll', desc: 'Practise on 3 different days', icon: Flame, unlocked: streak >= 3, color: 'from-orange-500 to-amber-500' },
    { id: 'high', name: 'High Scorer', desc: 'Score 9+ on an answer', icon: Star, unlocked: bestScore >= 9, color: 'from-amber-400 to-yellow-500' },
    { id: 'pro', name: 'Seasoned', desc: 'Answer 20 questions', icon: Medal, unlocked: questionsSolved >= 20, color: 'from-violet-500 to-purple-500' },
    { id: 'avg', name: 'Top Performer', desc: 'Reach an 80% average', icon: Trophy, unlocked: averageScore >= 80, color: 'from-green-500 to-emerald-500' },
    { id: 'marathon', name: 'Marathoner', desc: 'Answer 50 questions', icon: Award, unlocked: questionsSolved >= 50, color: 'from-pink-500 to-rose-500' },
    { id: 'perfect', name: 'Perfectionist', desc: 'Score a perfect 10', icon: Crown, unlocked: bestScore >= 10, color: 'from-fuchsia-500 to-purple-600' },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" /> Achievements
        </h3>
        <span className="text-xs font-semibold text-gray-400">{unlockedCount}/{badges.length} unlocked</span>
      </div>

      {/* Level + streak */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="sm:col-span-2 rounded-xl border border-gray-100 bg-gradient-to-br from-primary/5 to-white p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-800">Level {level}</span>
            <span className="text-xs text-gray-400">
              {loading ? '…' : (toNext > 0 ? `${toNext} answers to level ${level + 1}` : 'Max level')}
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }} animate={{ width: `${loading ? 0 : pct}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-gray-800 leading-none">{loading ? '…' : streak}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">active days</p>
          </div>
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {badges.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 18 }}
            className={`relative rounded-xl border p-3 text-center transition-all ${
              b.unlocked ? 'border-gray-200 bg-white hover:shadow-md hover:-translate-y-0.5' : 'border-gray-100 bg-gray-50'
            }`}
            title={b.desc}
          >
            <div className={`w-11 h-11 mx-auto rounded-xl flex items-center justify-center mb-2 ${
              b.unlocked ? `bg-gradient-to-br ${b.color} text-white shadow-sm` : 'bg-gray-200 text-gray-400'
            }`}>
              {b.unlocked ? <b.icon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
            </div>
            <p className={`text-xs font-bold ${b.unlocked ? 'text-gray-800' : 'text-gray-400'}`}>{b.name}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
