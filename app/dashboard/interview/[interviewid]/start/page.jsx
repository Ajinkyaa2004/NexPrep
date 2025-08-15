'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../../../../utils/db';
import { MockInterview } from '../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { useParams, useRouter } from 'next/navigation';
import QuestionsSection from './_components/QuestionsSection';
import dynamic from 'next/dynamic';
import { Button } from '../../../../../components/ui/button';
import Link from 'next/link';

const RecordAnswerSection = dynamic(
  () => import('./_components/RecordAnswerSection'),
  { ssr: false }
);

function StartInterview() {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  
  // ⏳ Timer state
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
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, id));

      if (result.length > 0) {
        const data = result[0];
        
        // Parse questions
        const jsonMockResp = JSON.parse(data.jsonMockResp);
        if (typeof jsonMockResp === 'object' && jsonMockResp !== null) {
          const allQuestions = Object.entries(jsonMockResp.interview || {}).flatMap(
            ([category, questions]) => questions
          );
          setMockInterviewQuestion(allQuestions);
        }
        
        setInterviewData(data);

        // ✅ Check if we already have an end time saved
        const savedEndTime = localStorage.getItem(`endTime_${id}`);
        if (savedEndTime) {
          const remaining = Math.floor((parseInt(savedEndTime, 10) - Date.now()) / 1000);
          if (remaining > 0) {
            setTimeLeft(remaining);
            return; // skip initializing timer again
          } else {
            router.push(`/dashboard/interview/${id}/feedback`);
            return;
          }
        }

        // 🎯 First time starting — store end time
        const durationString = data.selectedDuration || "";
        const minutes = parseInt(durationString.match(/\d+/)?.[0], 10);
        if (!isNaN(minutes)) {
          const endTime = Date.now() + minutes * 60 * 1000;
          localStorage.setItem(`endTime_${id}`, endTime.toString());
          setTimeLeft(minutes * 60);
        }

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

  // Countdown effect
  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      localStorage.removeItem(`endTime_${params?.interviewid}`);
      router.push(`/dashboard/interview/${interviewData?.mockId}/feedback`);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, interviewData?.mockId, router, params?.interviewid]);

  // Helper function to format seconds into mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-3">
      {/* Timer */}
      {timeLeft !== null && (
        <div className="fixed top bg-blue-600 text-white px-2 py-1 rounded-lg shadow-lg z-50 w-37">
          Time Left: {formatTime(timeLeft)}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <QuestionsSection
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
          />
        </div>

        <div className="flex justify-center items-start">
          <RecordAnswerSection
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
          />
        </div>
      </div>

      <div className="flex justify-end gap-6 mt-6">
        {activeQuestionIndex > 0 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Previous Question
          </Button>
        )}

        {activeQuestionIndex !== mockInterviewQuestion?.length - 1 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white "
          >
            Next Question
          </Button>
        )}

        {activeQuestionIndex === mockInterviewQuestion?.length - 1 && (
          <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              End Interview
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
