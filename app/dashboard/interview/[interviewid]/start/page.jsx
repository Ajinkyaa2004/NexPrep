'use client';

import React, { useState, useEffect } from 'react';
import { getInterviewById } from '../../../../actions/interview';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '../../../../../components/ui/button';
import Link from 'next/link';
import {
  LayoutDashboard,
  Video,
  Lightbulb,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Bell,
  MoreVertical,
  Mic,
  PhoneOff,
  Video as VideoIcon,
  MessageSquare,
  User,
  Volume2,
  Loader2
} from 'lucide-react';
import Image from 'next/image';

const RecordAnswerSection = dynamic(
  () => import('./_components/RecordAnswerSection'),
  { ssr: false }
);

// Mock Data for Charts
const aiScoreData = {
  professionalism: 90,
  attitude: 85,
  creativity: 70,
  communication: 80,
  leadership: 65,
  teamwork: 75,
  sociability: 80
};

function StartInterview() {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const interviewId = params?.interviewid;
    if (interviewId) {
      getInterviewDetails(interviewId);
    }
  }, [params?.interviewid]);

  const getInterviewDetails = async (id) => {
    try {
      setLoading(true);
      const result = await getInterviewById(id);

      if (result) {
        const data = result;
        const jsonMockResp = JSON.parse(data.jsonMockResp);
        if (typeof jsonMockResp === 'object' && jsonMockResp !== null) {
          const allQuestions = Object.entries(jsonMockResp.interview || {}).flatMap(
            ([category, questions]) => questions
          );
          setMockInterviewQuestion(allQuestions);
        }
        setInterviewData(data);

        // Timer Logic (simplified for brevity)
        const durationString = data.selectedDuration || "30";
        const minutes = parseInt(durationString.match(/\d+/)?.[0] || 30, 10);
        setTimeLeft(minutes * 60);

      } else {
        setMockInterviewQuestion([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading interview data:", error);
      setMockInterviewQuestion([]);
      setLoading(false);
    }
  };


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">

      {/* 1. LEFT SIDEBAR (Dark Theme) */}



      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="font-bold text-gray-800">Interview for {interviewData?.jobPosition || 'Developer'}</h1>
              <p className="text-xs text-gray-500">Sans Brother</p>
            </div>
          </div>


        </header>

        {/* Content Grid */}
        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CENTER COLUMN (Video & Content) */}
          <div className="lg:col-span-2 space-y-6">

            {/* People Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-gray-500" />
                <span className="font-medium text-gray-700">People attending the call</span>
              </div>
              <button className="text-purple-600 text-sm font-medium hover:underline">+ Add person to the call</button>
            </div>

            {/* Main Video Area */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-lg relative aspect-video flex items-center justify-center group">
              {/* This wraps the existing RecordAnswerSection logic but styles it to fit */}
              <div className="absolute inset-0 z-0">
                <RecordAnswerSection
                  mockInterviewQuestion={mockInterviewQuestion}
                  activeQuestionIndex={activeQuestionIndex}
                  interviewData={interviewData}
                  userAnswers={userAnswers}
                  setUserAnswers={setUserAnswers}
                  className="w-full h-full object-cover"
                  isRedesign={true}
                  leftControls={
                    <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 shadow-lg">
                      <ControlButton icon={<VideoIcon size={20} />} />
                      <ControlButton icon={<Settings size={20} />} />
                    </div>
                  }
                  rightControls={
                    <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 shadow-lg">
                      <ControlButton
                        icon={<PhoneOff size={24} className="text-white" />}
                        bg="bg-red-500 hover:bg-red-600 shadow-red-900/20"
                        onClick={() => router.replace(`/dashboard/interview/${interviewData?.mockId}/feedback`)}
                      />
                    </div>
                  }
                />
              </div>

              {/* Fake Participants overlays */}
              <div className="absolute top-4 left-4 z-10 bg-black/40 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2 backdrop-blur-sm border border-white/10">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Recording
              </div>
            </div>




          </div>


          {/* RIGHT COLUMN (Stats & Chat Placeholder) */}
          <div className="flex flex-col gap-6">



            {/* Active Question Card */}
            <div className="bg-white rounded-2xl shadow-sm border flex-1 flex flex-col overflow-hidden p-6 relative min-h-[300px]">

              {mockInterviewQuestion && mockInterviewQuestion.length > 0 ? (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                      Question #{activeQuestionIndex + 1}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {activeQuestionIndex + 1} of {mockInterviewQuestion?.length}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-snug">
                      {mockInterviewQuestion[activeQuestionIndex]?.question}
                    </h2>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-800 text-sm animate-in fade-in duration-500">
                      <div className="flex items-center gap-2 mb-2 font-bold">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>AI Hint</span>
                      </div>
                      <p className="opacity-90 leading-relaxed">
                        Structure your answer using the STAR method (Situation, Task, Action, Result) for best impact.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Volume2 className="w-5 h-5 text-gray-400 hover:text-purple-600 cursor-pointer transition-colors" onClick={() => {
                      const speech = new SpeechSynthesisUtterance(mockInterviewQuestion[activeQuestionIndex]?.question);
                      window.speechSynthesis.speak(speech);
                    }} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p>Loading Questions...</p>
                </div>
              )}

            </div>

            {/* Navigation Controls */}
            <div className="grid grid-cols-2 gap-4">
              {activeQuestionIndex > 0 && (
                <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)} variant="outline">
                  Back
                </Button>
              )}
              {activeQuestionIndex < mockInterviewQuestion?.length - 1 ? (
                <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Next
                </Button>
              ) : (
                <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`} replace className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">End</Button>
                </Link>
              )}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

// -- Minor Components --

function NavItem({ icon, label, active, href }) {
  if (href) {
    return (
      <Link href={href}>
        <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl transition-colors ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'hover:bg-white/10 text-gray-400'}`}>
          {icon}
          <span className="font-medium text-sm">{label}</span>
        </div>
      </Link>
    )
  }
  return (
    <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl transition-colors ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'hover:bg-white/10 text-gray-400'}`}>
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </div>
  )
}

function ParticipantCard({ name, color }) {
  return (
    <div className="bg-white p-1 rounded-lg shadow-sm flex flex-col items-center">
      <div className={`w-8 h-8 ${color} rounded-full mb-1 flex items-center justify-center text-[10px] font-bold`}>{name.charAt(0)}</div>
      {/* <span className="text-[8px] text-gray-500 truncate w-full text-center">{name}</span> */}
    </div>
  )
}

function ControlButton({ icon, bg = "bg-white/20 text-white hover:bg-white/30" }) {
  return (
    <button className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${bg}`}>
      {icon}
    </button>
  )
}

function SkillBar({ label, score, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
        <span>{label}</span>
        <span>{score}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  )
}

export default StartInterview;
