'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../../../../utils/db';
import { MockInterview } from '../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { useParams } from 'next/navigation';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';

function StartInterview() {
    const [interviewData, setInterviewData] = useState(null);
    // Use [] not null!
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(4);

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
                // If no questions found, set to empty array just in case
                setMockInterviewQuestion([]);
            }
            setLoading(false);
        } catch (error) {
            setMockInterviewQuestion([]); // Defensive: always an array
            setLoading(false);
        }
    };
return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
    <div>
      <QuestionsSection
        mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={activeQuestionIndex}
      />
    </div>

    <div className="flex justify-center items-start">
      <RecordAnswerSection />
    </div>
  </div>
);


   
}

export default StartInterview;
