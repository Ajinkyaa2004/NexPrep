'use client';

import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { WebcamIcon } from 'lucide-react';
import { db } from '../../../../utils/db';
import { MockInterview } from '../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { Button } from '../../../../components/ui/button';

function InterviewPage({ params }) {
  const interviewId = params?.interviewid;
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (interviewId) {
      getInterviewDetails(interviewId);
    }
  }, [interviewId]);

  const getInterviewDetails = async (id) => {
    setLoading(true);
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, id));

    setInterviewData(result?.[0] || null);
    setLoading(false);
  };

  const videoConstraints = {
    width: 300,
    height: 300,
    facingMode: 'user',
  };

  return (
    <div className="my-10 px-4 flex flex-col items-center justify-center">
      <h2 className="font-bold text-2xl mb-2">Let's Get Started</h2>
      <h3 className="text-gray-500 text-sm mb-6">Interview ID: {interviewId}</h3>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10 justify-center items-center">
        {/* Webcam section */}
        <div className="flex flex-col items-center">
          {webCamEnabled ? (
            <Webcam
              mirrored
              videoConstraints={videoConstraints}
              style={{ height: 300, width: 300, borderRadius: '12px' }}
              audio={true}
            />
          ) : (
            <>
              <WebcamIcon className="h-64 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button onClick={() => setWebCamEnabled(true)}>
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>

        {/* Interview Details section */}
        <div className="text-center md:text-left max-w-md w-full">
          {loading ? (
            <p className="text-gray-600">Loading interview details...</p>
          ) : interviewData ? (
            <div className="bg-muted p-5 border rounded-xl shadow-sm space-y-3">
              <p>
                <strong className="font-bold">Job Role / Position:</strong>{' '}
                {interviewData.jobPosition}
              </p>
              <p>
                <strong className="font-bold">Job Description / Tech Stack:</strong>{' '}
                {interviewData.jobDescription}
              </p>
              <p>
                <strong className="font-bold">Years of Experience:</strong>{' '}
                {interviewData.jobExperience}
              </p>
            </div>
          ) : (
            <p className="text-red-500">Interview not found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewPage;
