
"use client";
import React, { useState } from 'react';
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Upload, Loader2, CheckCircle, AlertTriangle, FileText, ArrowRight, X, Check } from "lucide-react";
import { parseResumeFile } from "./_actions/fileParser";
import { analyzeResume } from "./_actions/analyze";
import Link from 'next/link';
import { toast } from "sonner";

const ATSChecker = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResult(null);
        }
    };

    const handleCheck = async () => {
        if (!file) {
            toast.error("Please upload a resume first.");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("resume", file);

            const parseResult = await parseResumeFile(formData);

            if (!parseResult.success) {
                console.error(parseResult.error);
                throw new Error(parseResult.error);
            }

            const analysis = await analyzeResume(parseResult.text);
            setResult(analysis);
            toast.success("Resume Analyzed!");

        } catch (error) {
            toast.error(error.message || "Failed to analyze resume.");
        } finally {
            setIsLoading(false);
        }
    };

    const ScoreRing = ({ score }) => {
        const radius = 60;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (score / 100) * circumference;

        let color = "#ef4444"; // red
        if (score > 50) color = "#eab308"; // yellow
        if (score > 80) color = "#22c55e"; // green

        return (
            <div className="relative flex items-center justify-center w-48 h-48">
                <svg className="transform -rotate-90 w-full h-full">
                    <circle cx="96" cy="96" r={radius} stroke="#e5e7eb" strokeWidth="12" fill="transparent" />
                    <circle cx="96" cy="96" r={radius} stroke={color} strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-5xl font-bold text-gray-800">{score}</span>
                    <span className="text-sm text-gray-500 uppercase mt-2">Overall Score</span>
                </div>
            </div>
        );
    };

    const StatCard = ({ title, score, color = "gray" }) => {
        let labelText = "NEEDS WORK";
        if (score >= 80) labelText = "EXCELLENT";
        else if (score >= 50) labelText = "AVERAGE";
        else if (score >= 90) labelText = "VERY GOOD";

        const colorMap = {
            purple: "bg-purple-50 text-purple-700",
            blue: "bg-blue-50 text-blue-700",
            green: "bg-green-50 text-green-700",
            pink: "bg-pink-50 text-pink-700",
            gray: "bg-gray-50 text-gray-700"
        };
        const activeColor = colorMap[color] || colorMap.gray;

        // Label Colors (Pills)
        const pillColors = {
            purple: "bg-purple-100 text-purple-800",
            blue: "bg-blue-100 text-blue-800",
            green: "bg-green-100 text-green-800",
            pink: "bg-pink-100 text-pink-800",
            gray: "bg-gray-200 text-gray-800"
        };
        const activePill = pillColors[color] || pillColors.gray;

        return (
            <div className={`p-4 rounded-xl flex flex-col items-center text-center ${activeColor}`}>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-70">{title}</h4>
                <div className="text-3xl font-bold mb-3">{score}<span className="text-sm opacity-50">/100</span></div>
                <span className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase ${activePill}`}>{labelText}</span>
            </div>
        );
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto font-sans bg-white min-h-screen">

            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">ATS Resume Checker</h1>
            <p className="text-gray-500 mb-8">Optimize your resume for AI screenings and get hired faster.</p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left: Inputs */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer relative group h-64">
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" accept="*" />
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800">{file ? file.name : "Upload Resume (PDF)"}</h3>
                        <p className="text-sm text-gray-400 mt-2">Max 5MB</p>
                    </div>



                    <Button onClick={handleCheck} disabled={isLoading || !file} className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200">
                        {isLoading ? <><Loader2 className="mr-2 animate-spin" /> Analyizing Resume...</> : "Check Resume Score"}
                    </Button>
                </div>

                {/* Right: Results Display */}
                <div className="lg:col-span-7">
                    {!result ? (
                        <div className="h-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-10 text-center">
                            <FileText className="w-16 h-16 mb-4 opacity-20" />
                            <p>Upload a resume to see the detailed ATS analysis score here.</p>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">

                            {/* Top Card: Overall Score */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
                                <div className="z-10 flex items-center gap-10">
                                    <ScoreRing score={result.match_percentage} />
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Your resume scored <span className="text-blue-600">{result.match_percentage}</span> out of 100.</h3>
                                        <p className="text-gray-500 leading-relaxed text-sm mb-4">{result.summary}</p>
                                        <div className="bg-blue-50 text-blue-800 text-xs px-4 py-2 rounded-lg inline-block border border-blue-100">
                                            💡 <strong>Tip:</strong> {result.impovement_tip}
                                        </div>
                                    </div>
                                </div>
                                {/* Resume Preview Decorator */}
                                <div className="hidden md:block absolute -right-10 -top-10 opacity-10 rotate-12 transform scale-150 pointer-events-none">
                                    <FileText className="w-64 h-64 text-blue-900" />
                                </div>
                            </div>

                            {/* Breakdown Grid */}
                            <div>
                                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-4">Breakdown</h4>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard title="Impact" score={result.scoring_breakdown?.impact_score || 0} color="purple" />
                                    <StatCard title="Brevity" score={result.scoring_breakdown?.brevity_score || 0} color="blue" />
                                    <StatCard title="Style" score={result.scoring_breakdown?.style_score || 0} color="green" />
                                    <StatCard title="Skills" score={result.scoring_breakdown?.skills_score || result.scoring_breakdown?.structure_score || 0} color="pink" />
                                </div>
                            </div>

                            {/* Detailed Checks - Bottom Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">

                                {/* Left: Impact Score Circle */}
                                <div className="md:col-span-1 flex flex-col items-center justify-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="relative flex items-center justify-center w-40 h-40">
                                        <svg className="transform -rotate-90 w-full h-full">
                                            <circle cx="80" cy="80" r="50" stroke="#f3f4f6" strokeWidth="10" fill="transparent" />
                                            <circle cx="80" cy="80" r="50" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray={2 * Math.PI * 50} strokeDashoffset={(2 * Math.PI * 50) - (result.scoring_breakdown?.impact_score / 100) * (2 * Math.PI * 50)} className="transition-all duration-1000 ease-out" />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-4xl font-bold text-gray-800">{result.scoring_breakdown?.impact_score || 0}</span>
                                            <span className="text-[10px] text-gray-400 uppercase mt-1">Impact Score</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Checklist */}
                                <div className="md:col-span-2 space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            {result.checks?.quantifying_impact ? <CheckCircle className="text-green-500 w-5 h-5" /> : <X className="text-red-400 w-5 h-5" />}
                                            <span className="text-sm text-gray-600">Quantifying impact</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {result.checks?.action_verbs ? <CheckCircle className="text-green-500 w-5 h-5" /> : <X className="text-red-400 w-5 h-5" />}
                                            <span className="text-sm text-gray-600">Strong action verbs</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {result.checks?.ats_compatible ? <CheckCircle className="text-green-500 w-5 h-5" /> : <X className="text-red-400 w-5 h-5" />}
                                            <span className="text-sm text-gray-600">Unique action verbs</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {result.checks?.no_spelling_errors ? <CheckCircle className="text-green-500 w-5 h-5" /> : <X className="text-red-400 w-5 h-5" />}
                                            <span className="text-sm text-gray-600">No spelling errors</span>
                                        </div>
                                        <div className="flex items-center gap-3 md:col-span-2">
                                            <CheckCircle className="text-green-500 w-5 h-5" />
                                            <span className="text-sm text-gray-600">Accomplishment-oriented language</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Missing Keywords */}
                            {result.missing_keywords?.length > 0 && (
                                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                                    <h3 className="text-red-800 font-bold mb-3 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" /> Missing Keywords
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missing_keywords.map((kw, i) => (
                                            <span key={i} className="px-3 py-1 bg-white text-red-600 border border-red-200 rounded-lg text-sm font-medium shadow-sm">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <Link href="/dashboard/resume">
                                <Button className="w-full bg-gray-900 text-white h-14 text-lg hover:bg-gray-800 rounded-xl shadow-xl">
                                    Fix Resume with AI Builder <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>

                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ATSChecker;
