'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../../../../utils/db';
import { MockInterview } from '../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { useParams } from 'next/navigation';
import QuestionsSection from './_components/QuestionsSection';
import dynamic from 'next/dynamic';
import { Button } from '../../../../../components/ui/button';
import Link from 'next/link';

// ✅ Dynamically import RecordAnswerSection with SSR disabled
const RecordAnswerSection = dynamic(
  () => import('./_components/RecordAnswerSection'),
  { ssr: false }
);

function StartInterview() {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // ✅ track user answers

  const params = useParams();

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
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        if (typeof jsonMockResp === 'object' && jsonMockResp !== null) {
          const allQuestions = Object.entries(jsonMockResp.interview || {}).flatMap(
            ([category, questions]) => questions
          );
          console.log(`Questions (${allQuestions.length})`);
          console.log(allQuestions);
          setMockInterviewQuestion(allQuestions);
        }
        setInterviewData(result[0]);
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap- mt-3">
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

      <div className="flex justify-end gap-6">
  {activeQuestionIndex > 0 && (
    <Button
      onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 mb-10 rounded-md font-medium transition-all duration-200"
    >
      Previous Question
    </Button>
  )}

  {activeQuestionIndex !== mockInterviewQuestion?.length - 1 && (
    <Button
      onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2  rounded-md font-medium transition-all duration-200"
    >
      Next Question
    </Button>
  )}
 
  {activeQuestionIndex === mockInterviewQuestion?.length - 1 && (

      <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
    <Button 
      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-medium transition-all duration-200"
    >
      End Interview
    </Button>
    </Link>
  )}
</div>

    </div>
  );
}

export default StartInterview;
