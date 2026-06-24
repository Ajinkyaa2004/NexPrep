"use client";
import React, { useEffect, useState } from 'react';
import AddNewInterview from './_components/AddNewInterview';
import InterviewList from './_components/InterviewList';
import Achievements from './_components/Achievements';
import { UserCheck, Zap, TrendingUp, Clock, Activity, Award, ArrowUpRight, ArrowDownRight } from "lucide-react";

import { auth } from '../../firebase/client';
import { getDashboardStats } from '../actions/interview';
import { getIdToken } from '../../lib/clientAuth';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,   // percentage (0-100)
    questionsSolved: 0,
    streak: 0,
    bestScore: 0,      // 0-10
    level: "Beginner",
    trend: [],         // per-interview average ratings (0-10), oldest -> newest
    improvement: 0,    // last vs first interview average (0-10)
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.email) {
      GetDashboardStats();
    }
  }, [user]);

  const GetDashboardStats = async () => {
    setLoading(true);
    try {
      const token = await getIdToken();
      const { interviews, answers } = await getDashboardStats(token);

      const totalInt = interviews.length;
      const totalQ = answers.length;

      const ratings = answers.map((a) => Number(a.rating) || 0).filter((r) => r > 0);
      const avgScore = ratings.length ? ratings.reduce((s, r) => s + r, 0) / ratings.length : 0;
      const avgPercent = Math.round((avgScore / 10) * 100); // ratings are on a 1-10 scale
      const bestScore = ratings.length ? Math.max(...ratings) : 0;

      // Per-interview average rating (oldest -> newest), for the score trend.
      const trend = interviews
        .map((iv) => {
          const rs = answers
            .filter((a) => a.mockIdRef === iv.mockId)
            .map((a) => Number(a.rating) || 0)
            .filter((r) => r > 0);
          return rs.length ? +(rs.reduce((s, x) => s + x, 0) / rs.length).toFixed(1) : null;
        })
        .filter((v) => v !== null);
      const recentTrend = trend.slice(-7);
      const improvement = recentTrend.length >= 2 ? +(recentTrend[recentTrend.length - 1] - recentTrend[0]).toFixed(1) : 0;

      // Active days = unique calendar dates with activity.
      const streak = totalQ > 0 ? new Set(answers.map((a) => a.createdAt)).size : 0;

      const level = totalQ > 20 ? "Pro" : totalQ > 5 ? "Intermediate" : "Beginner";

      setStats({
        totalInterviews: totalInt,
        averageScore: isNaN(avgPercent) ? 0 : avgPercent,
        questionsSolved: totalQ,
        streak,
        bestScore,
        level,
        trend: recentTrend,
        improvement,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 relative">

      {/* Subtle Background Mesh/Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] opacity-60"></div>
      </div>

      {/* 1. Header with Tech Vibe */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold text-primary tracking-wider uppercase border border-primary/20">Beta v2.0</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-secondary" />
            System Status: <span className="text-green-500 font-medium">Optimal</span>
          </p>
        </div>
      </div>

      {/* 2. Sleek Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Interviews"
          value={loading ? "..." : stats.totalInterviews}
          icon={Clock}
          color="text-primary"
          subtext="Lifetime Total"
        />
        <StatsCard
          title="Average Score"
          value={loading ? "..." : stats.averageScore + "%"}
          icon={TrendingUp}
          color="text-secondary"
          subtext="Based on AI Rating"
        />
        <StatsCard
          title="Questions Solved"
          value={loading ? "..." : stats.questionsSolved}
          icon={UserCheck}
          color="text-accent"
          subtext="Across all sessions"
        />
        <StatsCard
          title="Active Days"
          value={loading ? "..." : stats.streak + " Days"}
          icon={Zap}
          color="text-orange-400"
          subtext="Consistency"
        />
      </div>

      {/* 3. Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Col */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-1 rounded-2xl shadow-sm border border-gray-200/60">
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  Start New Session
                </h3>
              </div>
              <AddNewInterview />
            </div>
          </section>

          <Achievements stats={stats} loading={loading} />

          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="font-bold text-lg text-gray-800">Recent Activity</h3>
              <span className="text-xs text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <InterviewList />
          </section>
        </div>

        {/* Right Col: Minimal Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 relative overflow-hidden group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm relatiive">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-gray-700">{(user?.displayName || "U")[0]}</span>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <p className="font-bold text-gray-900">{user?.displayName || "Guest User"}</p>
                <p className="text-xs text-gray-500">{user?.email || "Explore Mode"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium mb-2">
                  <span className="text-gray-500">Average Score</span>
                  <span className="text-primary">{loading ? "..." : stats.averageScore}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${loading ? 0 : stats.averageScore}%` }}></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400">Best Score</p>
                    <p className="font-bold text-gray-800">{loading ? "..." : (stats.bestScore > 0 ? stats.bestScore + "/10" : "—")}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400">Level</p>
                    <p className="font-bold text-gray-800">{loading ? "..." : stats.level}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Score Trend */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Score Trend
              </h3>
              {!loading && stats.improvement !== 0 && (
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${stats.improvement > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.improvement > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {Math.abs(stats.improvement)} pts
                </span>
              )}
            </div>
            {loading ? (
              <p className="text-xs text-gray-400">Loading…</p>
            ) : stats.trend.length === 0 ? (
              <div className="text-center py-6">
                <Award className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Complete an interview to see your score trend.</p>
              </div>
            ) : (
              <div className="flex items-end justify-between gap-2 h-28">
                {stats.trend.map((score, i) => {
                  const color = score >= 8 ? 'bg-green-500' : score >= 5 ? 'bg-amber-400' : 'bg-red-400';
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                      <span className="text-[10px] font-semibold text-gray-500">{score}</span>
                      <div className="w-full bg-gray-100 rounded-md overflow-hidden flex items-end" style={{ height: '100%' }}>
                        <div className={`w-full rounded-md ${color} transition-all duration-700`} style={{ height: `${(score / 10) * 100}%` }} />
                      </div>
                      <span className="text-[9px] text-gray-300">#{i + 1}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon: Icon, color, subtext }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
          <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
          <p className="text-[10px] text-gray-400 mt-2 font-medium">{subtext}</p>
        </div>
        <div className={`p-2.5 rounded-lg bg-gray-50 ${color} group-hover:bg-primary/5 transition-colors`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard;