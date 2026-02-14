import React from 'react';
import { ShieldCheck, BrainCircuit, BookOpen, FileText, TrendingUp, Wand2, FileSpreadsheet } from 'lucide-react';

const HowItWorks = () => {
    const modules = [
        {
            title: "Authentication Module",
            description: "Secure login and access control to protect user data and personalize the experience.",
            icon: <ShieldCheck className="w-8 h-8 text-blue-500" />
        },
        {
            title: "Intelligent Prompt Engine",
            description: "Dynamically generates interview questions and responses tailored to your role and experience.",
            icon: <BrainCircuit className="w-8 h-8 text-purple-500" />
        },
        {
            title: "Knowledge-Based Module",
            description: "Uses domain-specific datasets to evaluate your answers with precision and depth.",
            icon: <BookOpen className="w-8 h-8 text-green-500" />
        },
        {
            title: "Report Generator",
            description: "Compiles performance data into clear, structured reports to track your progress.",
            icon: <FileText className="w-8 h-8 text-orange-500" />
        },
        {
            title: "Candidate Improvement Engine",
            description: "Provides personalized suggestions to help you identify weaknesses and improve.",
            icon: <TrendingUp className="w-8 h-8 text-red-500" />
        },
        {
            title: "Grammar Polish Refiner",
            description: "Enhances language quality and communication skills for professional responses.",
            icon: <Wand2 className="w-8 h-8 text-pink-500" />
        },
        {
            title: "Resume Builder",
            description: "Create professional resumes based on your interview performance and profile details.",
            icon: <FileSpreadsheet className="w-8 h-8 text-teal-500" />
        }
    ];

    return (
        <div className="p-10">
            <h2 className="font-bold text-3xl mb-2 text-gray-800">How It Works</h2>
            <p className="text-gray-500 mb-8">Discover the powerful modules that power your AI interview experience.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module, index) => (
                    <div key={index} className="p-6 border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white group">
                        <div className="mb-4 p-3 bg-gray-50 rounded-full w-fit group-hover:scale-110 transition-transform">
                            {module.icon}
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-gray-800">{module.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{module.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-blue-50 p-8 rounded-2xl border border-blue-100 text-center">
                <h3 className="font-bold text-2xl text-blue-900 mb-3">Your Complete Interview Platform</h3>
                <p className="text-blue-700 max-w-2xl mx-auto">
                    Together, these modules create a complete, smart, and user-friendly interview platform designed to take your career to the next level.
                </p>
            </div>
        </div>
    );
};

export default HowItWorks;
