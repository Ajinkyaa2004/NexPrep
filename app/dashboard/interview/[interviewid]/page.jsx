'use client';

import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon, ArrowRight } from 'lucide-react';
import { db } from '../../../../utils/db';
import { MockInterview } from '../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { Button } from '../../../../components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function InterviewPage() {
  const params = useParams();
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
    <div className="my-10 px-4 flex flex-col items-center justify-center relative">
      <h2 className="font-bold text-2xl mb-2">Let's Get Started</h2>
      <h3 className="text-gray-500 text-sm mb-6">Interview ID: {interviewId}</h3>

      {/* Main Content */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10 justify-center items-start">
        
        {/* Webcam Section */}
        <div className="flex flex-col items-center">
          {webCamEnabled ? (
            <Webcam
              mirrored
              videoConstraints={videoConstraints}
              style={{
                height: 300,
                width: 300,
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              }}
              audio={true}
            />
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center justify-center h-64 w-64 rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
                <WebcamIcon className="h-20 w-20 text-gray-400" />
                <p className="mt-2 text-gray-500 text-sm">Webcam preview</p>
              </div>
              <Button
                className="mt-4 px-5 py-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Web Cam & Microphone
              </Button>
            </div>
          )}
        </div>

        {/* Interview Details + Start Button */}
        <div className="text-center md:text-left max-w-md w-full flex flex-col items-center md:items-start gap-4">
          {loading ? (
            <p className="text-gray-600">Loading interview details...</p>
          ) : interviewData ? (
            <>
              <div className="bg-white p-5 border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 space-y-3">
                <p>
                  <strong className="font-bold text-gray-800">Job Role:</strong>{' '}
                  {interviewData.jobPosition}
                </p>
                <p>
                  <strong className="font-bold text-gray-800">Job Description:</strong>{' '}
                  {interviewData.jobDescription}
                </p>
                <p>
                  <strong className="font-bold text-gray-800">Experience:</strong>{' '}
                  {interviewData.jobExperience}
                </p>
                <p>
                  <strong className="font-bold text-gray-800">Difficulty Level:</strong>{' '}
                  {interviewData.selectedDifficulty}
                </p>
              </div>

              <Link href={'/dashboard/interview/' + interviewId + '/start'}>
                <Button className="px-6 py-3 mt-21 ml-32 font-semibold flex items-center gap-2 transition-all duration-200  bg-blue-600 hover:bg-blue-700 text-white">
                  Start Interview <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : (
            <p className="text-red-500">Interview not found.</p>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-40 relative w-full">
        <div className="md:absolute bottom-5 left-5 p-5 border rounded-lg border-yellow-100 bg-yellow-100 max-w-sm">
          <h2 className="flex gap-2 items-center text-yellow-600 mb-2">
            <Lightbulb />
            <strong>Information</strong>
          </h2>
          <p className="text-sm text-gray-800">{process.env.NEXT_PUBLIC_INFORMATION}</p>
        </div>
      </div>
    </div>
  );
}

export default InterviewPage;
