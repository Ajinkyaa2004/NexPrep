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

  useEffect(() => {
    console.log('Interview ID:', interviewId);
    if (interviewId) {
      getInterviewDetails(interviewId);
    }
  }, [interviewId]);

  const getInterviewDetails = async (id) => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, id));

    setInterviewData(result?.[0] || null);
  };

  return (
    <div className="my-6 flex justify-center items-center flex-col">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>

      <h3 className="text-gray-500 text-sm mt-1">Interview ID: {interviewId}</h3>

      {interviewData && (
        <div className="my-4 text-center">
          <p>
            <strong>Job Role / Position:</strong> {interviewData.jobPosition}
          </p>
        </div>
      )}

      <div>
        {webCamEnabled ? (
          <Webcam
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            mirrored={true}
            style={{
              height: 300,
              width: 300,
            }}
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
    </div>
  );
}

export default InterviewPage;
