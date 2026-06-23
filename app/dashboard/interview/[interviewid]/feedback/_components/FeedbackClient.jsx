"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../../../../../../components/ui/collapsible";
import { ChevronsUpDown, CheckCircle, AlertTriangle, Target, Home } from "lucide-react";
import { Button } from "../../../../../../components/ui/button";

/**
 * Renders an AI feedback string (which uses **Header**: body markers) as a clean
 * bulleted list with bold section titles, instead of a raw markdown blob.
 */
function FeedbackReport({ text }) {
    if (!text || typeof text !== "string") {
        return <p className="text-gray-500 text-sm">No feedback available.</p>;
    }

    const parts = text.split(/\*\*(.+?)\*\*/g);
    const preface = (parts[0] || "").replace(/^[:\s-]+/, "").trim();
    const sections = [];
    for (let i = 1; i < parts.length; i += 2) {
        const header = (parts[i] || "").replace(/:$/, "").trim();
        const body = (parts[i + 1] || "").replace(/^[:\s-]+/, "").trim();
        if (header) sections.push({ header, body });
    }

    if (sections.length === 0) {
        return <p className="text-gray-600 text-sm whitespace-pre-line">{text}</p>;
    }

    const recColor = (val) => {
        const v = (val || "").toLowerCase();
        if (v.includes("strong")) return "bg-green-100 text-green-700";
        if (v.includes("moderate")) return "bg-yellow-100 text-yellow-700";
        if (v.includes("need") || v.includes("improv")) return "bg-red-100 text-red-700";
        return "bg-gray-100 text-gray-700";
    };

    return (
        <div className="space-y-2.5">
            {preface && <p className="text-gray-600 text-sm">{preface}</p>}
            <ul className="space-y-2.5">
                {sections.map((s, idx) => {
                    const isRec = /final recommendation|recommendation/i.test(s.header);
                    return (
                        <li key={idx} className="flex gap-2.5">
                            <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <p className="text-sm leading-relaxed">
                                <span className="font-semibold text-gray-800">{s.header}: </span>
                                {isRec ? (
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${recColor(s.body)}`}>
                                        {s.body}
                                    </span>
                                ) : (
                                    <span className="text-gray-600">{s.body}</span>
                                )}
                            </p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default function FeedbackClient({ feedbackList }) {
    // --- Statistics Calculation ---
    const totalQuestions = feedbackList.length;
    const totalRating = feedbackList.reduce((sum, item) => sum + Number(item.rating || 0), 0);
    const overallRating = totalQuestions > 0 ? (totalRating / totalQuestions).toFixed(1) : "0";
    const overallRatingNum = Number(overallRating);

    // Calculate percentage for donut chart (scale of 10)
    const percentage = (overallRatingNum / 10) * 100;
    const circumference = 2 * Math.PI * 45; // radius 45
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Additional Stats
    const highestScore = Math.max(...feedbackList.map(i => Number(i.rating || 0)), 0);
    const aboveAverageCount = feedbackList.filter(i => Number(i.rating) >= 5).length;
    const improvementCount = feedbackList.filter(i => Number(i.rating) < 5).length;

    const getPerformanceColor = (rating) => {
        if (rating >= 8) return "text-green-500";
        if (rating >= 5) return "text-yellow-500";
        return "text-red-500";
    };
    const getPerformanceBg = (rating) => {
        if (rating >= 8) return "bg-green-500";
        if (rating >= 5) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="p-10 min-h-screen bg-gray-50">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Feedback Dashboard</h2>
                    <p className="text-gray-500">Overview of your interview performance</p>
                </div>
                <Link href="/dashboard">
                    <Button variant="outline" className="gap-2"><Home className="w-4 h-4" /> Dashboard</Button>
                </Link>
            </div>

            {feedbackList.length === 0 ? (
                <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-amber-50 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">No Feedback Yet for This Interview</h2>
                    <p className="text-gray-500 mb-2 leading-relaxed">
                        It looks like the interview wasn&apos;t completed properly — no answers were recorded.
                    </p>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        To generate feedback, start the interview and for <strong>each question</strong> either record
                        your answer aloud or type it, then click <strong>&quot;Save Answer&quot;</strong> before moving on.
                        Skipped questions won&apos;t produce a score.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/dashboard"><Button variant="outline" className="gap-2"><Home className="w-4 h-4" /> Back to Dashboard</Button></Link>
                        <Link href="/dashboard"><Button className="bg-primary hover:bg-primary/90 text-white">Start a New Interview</Button></Link>
                    </div>
                </div>
            ) : (
                <>
                    {/* Top Section: Donut Chart + Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

                        {/* Donut Chart Card */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center relative">
                            <h3 className="absolute top-4 left-6 font-semibold text-gray-700">Overall Score</h3>

                            <div className="relative w-48 h-48 mt-4">
                                {/* SVG Donut */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke="#f3f4f6"
                                        strokeWidth="16"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke={overallRatingNum >= 8 ? "#22c55e" : overallRatingNum >= 5 ? "#eab308" : "#ef4444"}
                                        strokeWidth="16"
                                        fill="transparent"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                {/* Center Text */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                    <span className={`text-5xl font-bold ${getPerformanceColor(overallRatingNum)}`}>{overallRating}</span>
                                    <span className="text-gray-400 text-sm block mt-1">out of 10</span>
                                </div>
                            </div>

                        </div>

                        {/* Stats Grid */}
                        <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Stat 1 */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Questions</p>
                                    <h4 className="text-3xl font-bold text-gray-800 mt-2">{totalQuestions}</h4>
                                    <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full mt-2 inline-block">100% Completed</span>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                    <Target className="w-6 h-6" />
                                </div>
                            </div>

                            {/* Stat 2 */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Highest Score</p>
                                    <h4 className="text-3xl font-bold text-gray-800 mt-2">{highestScore}<span className="text-lg text-gray-400">/10</span></h4>
                                    <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full mt-2 inline-block">Top Performance</span>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg text-green-600">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                            </div>

                            {/* Stat 3 */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Above Average</p>
                                    <h4 className="text-3xl font-bold text-gray-800 mt-2">{aboveAverageCount}</h4>
                                    <p className="text-xs text-gray-400 mt-2">Questions with 5+ rating</p>
                                </div>
                                <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
                                    <div className="w-6 h-6 font-bold flex items-center justify-center">Avg</div>
                                </div>
                            </div>

                            {/* Stat 4 */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Improvements</p>
                                    <h4 className="text-3xl font-bold text-gray-800 mt-2">{improvementCount}</h4>
                                    <p className="text-xs text-gray-400 mt-2">Questions needing focus</p>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg text-red-600">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar Section — colour + copy reflect the real score */}
                    {(() => {
                        const tier = overallRatingNum >= 8
                            ? { box: "bg-green-50 border-green-200", head: "text-green-800", sub: "text-green-700", track: "bg-green-200", bar: "bg-green-600", pct: "text-green-800", lbl: "text-green-600",
                                msg: "Strong performance — you're well prepared for the real interview." }
                            : overallRatingNum >= 5
                            ? { box: "bg-yellow-50 border-yellow-200", head: "text-yellow-800", sub: "text-yellow-700", track: "bg-yellow-200", bar: "bg-yellow-500", pct: "text-yellow-800", lbl: "text-yellow-600",
                                msg: "Decent attempt — review the flagged questions to sharpen weak areas." }
                            : { box: "bg-red-50 border-red-200", head: "text-red-800", sub: "text-red-700", track: "bg-red-200", bar: "bg-red-500", pct: "text-red-800", lbl: "text-red-600",
                                msg: "Needs work — focus on the low-scoring questions and practise again." };
                        return (
                            <div className={`${tier.box} border p-6 rounded-xl mb-10 flex items-center justify-between`}>
                                <div>
                                    <h4 className={`${tier.head} font-bold text-lg mb-1`}>Interview Capability Forecast</h4>
                                    <p className={`${tier.sub} text-sm`}>{tier.msg}</p>
                                </div>
                                <div className="w-1/2 hidden md:block">
                                    <div className={`flex justify-between text-xs ${tier.sub} mb-1`}>
                                        <span>Current Skill</span>
                                        <span>Target Potential</span>
                                    </div>
                                    <div className={`w-full ${tier.track} rounded-full h-3`}>
                                        <div className={`${tier.bar} h-3 rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-3xl font-bold ${tier.pct}`}>{percentage.toFixed(0)}%</span>
                                    <span className={`${tier.lbl} text-sm block`}>Readiness</span>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Detailed List Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-700">Detailed Question Analysis</h3>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {/* List Header */}
                            <div className="grid grid-cols-12 gap-4 p-4 text-xs font-semibold text-gray-500 uppercase bg-gray-50/50">
                                <div className="col-span-1 text-center">Status</div>
                                <div className="col-span-1 text-center">Score</div>
                                <div className="col-span-9">Question</div>
                                <div className="col-span-1 text-right">Action</div>
                            </div>

                            {/* Rows */}
                            {feedbackList.map((item, index) => {
                                const rating = Number(item.rating);
                                const statusBg = getPerformanceBg(rating);

                                return (
                                    <Collapsible key={index} className="group">
                                        <CollapsibleTrigger className="w-full">
                                            <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors text-left cursor-pointer">
                                                <div className="col-span-1 flex justify-center">
                                                    <div className={`w-3 h-3 rounded-full ${statusBg}`}></div>
                                                </div>
                                                <div className="col-span-1 text-center font-bold text-gray-700">{item.rating}</div>
                                                <div className="col-span-9 text-gray-800 font-medium truncate pr-4">{item.question}</div>
                                                <div className="col-span-1 flex justify-end">
                                                    <ChevronsUpDown className="w-5 h-5 text-gray-400 group-data-[state=open]:rotate-180 transition-transform" />
                                                </div>
                                            </div>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="bg-gray-50/50 p-6 border-t border-gray-100">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Your Answer</h5>
                                                    <p className="text-gray-700 text-sm leading-relaxed">{item.userAns}</p>
                                                </div>
                                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                    <h5 className="text-xs font-bold text-blue-400 uppercase mb-2">Correct Answer</h5>
                                                    <p className="text-blue-900 text-sm leading-relaxed">{item.correctAns}</p>
                                                </div>
                                            </div>

                                            {item.strength && item.strength !== "N/A" && (
                                                <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-4">
                                                    <h5 className="text-xs font-bold text-green-600 uppercase mb-1.5 flex items-center gap-1.5">
                                                        <CheckCircle className="w-3.5 h-3.5" /> Key Strength
                                                    </h5>
                                                    <p className="text-green-900 text-sm leading-relaxed">{item.strength}</p>
                                                </div>
                                            )}

                                            <div className="mt-4">
                                                <h5 className="text-xs font-bold text-gray-400 uppercase mb-3">Feedback & Improvement</h5>
                                                <FeedbackReport text={item.feedback} />
                                            </div>
                                        </CollapsibleContent>
                                    </Collapsible>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}

        </div>
    );
}
