'use client';

import React, { useState, useEffect } from 'react';
import { getInterviewById } from '../../../../actions/interview';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '../../../../../components/ui/button';
import Link from 'next/link';
import {
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Loader2,
  PhoneOff,
  Flag,
} from 'lucide-react';

const RecordAnswerSection = dynamic(
  () => import('./_components/RecordAnswerSection'),
  { ssr: false }
);

function StartInterview() {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const interviewId = params?.interviewid;
    if (interviewId) getInterviewDetails(interviewId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.interviewid]);

  const getInterviewDetails = async (id) => {
    try {
      setLoading(true);
      const result = await getInterviewById(id);
      if (result) {
        const jsonMockResp = JSON.parse(result.jsonMockResp);
        if (jsonMockResp && typeof jsonMockResp === 'object') {
          const allQuestions = Object.entries(jsonMockResp.interview || {}).flatMap(
            ([, questions]) => questions
          );
          setMockInterviewQuestion(allQuestions);
        }
        setInterviewData(result);
      } else {
        setMockInterviewQuestion([]);
      }
    } catch (error) {
      console.error('Error loading interview data:', error);
      setMockInterviewQuestion([]);
    } finally {
      setLoading(false);
    }
  };

  const totalQuestions = mockInterviewQuestion.length;
  const currentQuestion = mockInterviewQuestion[activeQuestionIndex];
  const isLast = activeQuestionIndex >= totalQuestions - 1;
  const feedbackUrl = `/dashboard/interview/${interviewData?.mockId}/feedback`;

  const speakQuestion = () => {
    if (!currentQuestion?.question || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(currentQuestion.question));
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-gray-50 overflow-hidden font-sans">
      {/* Header */}
      <header className="h-14 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="font-bold text-gray-800 truncate text-sm sm:text-base">
              Interview · {interviewData?.jobPosition || 'Loading…'}
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">AI-powered mock interview</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {totalQuestions > 0 && (
            <span className="text-xs sm:text-sm font-medium text-gray-500">
              Question {activeQuestionIndex + 1} / {totalQuestions}
            </span>
          )}
          <Link href={feedbackUrl} replace>
            <Button className="bg-red-500 hover:bg-red-600 text-white gap-2 h-9">
              <PhoneOff size={16} /> <span className="hidden sm:inline">End</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Progress bar */}
      {totalQuestions > 0 && (
        <div className="h-1 w-full bg-gray-200 shrink-0">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((activeQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      )}

      {/* Body */}
      <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto lg:overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
          {/* Left: webcam + answer controls */}
          <div className="min-h-[340px] lg:min-h-0 lg:h-full">
            <RecordAnswerSection
              mockInterviewQuestion={mockInterviewQuestion}
              activeQuestionIndex={activeQuestionIndex}
              interviewData={interviewData}
            />
          </div>

          {/* Right: question + navigation */}
          <div className="flex flex-col min-h-0 lg:h-full gap-3">
            <div className="flex-1 min-h-0 overflow-y-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p>Loading questions…</p>
                </div>
              ) : currentQuestion ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                      Question #{activeQuestionIndex + 1}
                    </span>
                    <button
                      onClick={speakQuestion}
                      className="text-gray-400 hover:text-primary transition-colors"
                      aria-label="Read question aloud"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-snug mb-5">
                    {currentQuestion.question}
                  </h2>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-800 text-sm">
                    <div className="flex items-center gap-2 mb-1.5 font-bold">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>AI Hint</span>
                    </div>
                    <p className="opacity-90 leading-relaxed">
                      Structure your answer using the STAR method (Situation, Task, Action, Result) for best impact.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 text-center">
                  <Flag className="w-8 h-8" />
                  <p>No questions found for this interview.</p>
                  <Link href="/dashboard"><Button variant="outline" className="mt-2">Back to Dashboard</Button></Link>
                </div>
              )}
            </div>

            {/* Navigation */}
            {totalQuestions > 0 && (
              <div className="shrink-0 flex gap-3">
                <Button
                  variant="outline"
                  disabled={activeQuestionIndex === 0}
                  onClick={() => setActiveQuestionIndex((i) => Math.max(0, i - 1))}
                  className="flex-1 h-11"
                >
                  Previous
                </Button>
                {!isLast ? (
                  <Button
                    onClick={() => setActiveQuestionIndex((i) => Math.min(totalQuestions - 1, i + 1))}
                    className="flex-1 h-11 bg-primary hover:bg-primary/90 text-white gap-2"
                  >
                    Next Question <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Link href={feedbackUrl} replace className="flex-1">
                    <Button className="w-full h-11 bg-green-600 hover:bg-green-700 text-white gap-2">
                      <Flag className="w-4 h-4" /> Finish & See Feedback
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartInterview;
