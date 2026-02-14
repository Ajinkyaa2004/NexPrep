'use client';

import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon, ArrowRight } from 'lucide-react';
import { getInterviewById } from '../../../actions/interview';
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
    const result = await getInterviewById(id);

    setInterviewData(result || null);
    setLoading(false);
  };

  const videoConstraints = {
    width: 300,
    height: 300,
    facingMode: 'user',
  };

  return (
    <div className="my-10 px-4 flex flex-col items-center justify-center relative">
      <h2 className="font-bold text-2xl mb-2 text-center md:text-left">Let's Get Started</h2>
      <h3 className="text-gray-500 text-sm mb-6 text-center md:text-left">Interview ID: {interviewId}</h3>

      {/* Main Content */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 md:gap-10 justify-center items-start">

        {/* Webcam Section */}
        <div className="flex flex-col items-center w-full md:w-1/3">
          {webCamEnabled ? (
            <Webcam
              mirrored
              videoConstraints={videoConstraints}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: 300,
                borderRadius: 12,
                border: '2px solid #e5e7eb',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              }}
              audio={true}
            />
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-col items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-full h-64 rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
                <WebcamIcon className="h-20 w-20 text-gray-400" />
                <p className="mt-2 text-gray-500 text-sm text-center">Webcam preview</p>
              </div>
              <Button
                className="mt-4 px-5 py-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white w-full max-w-xs sm:max-w-sm md:max-w-full"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Web Cam & Microphone
              </Button>
            </div>
          )}
        </div>

        {/* Interview Details + Start Button */}
        <div className="flex flex-col w-full md:w-2/3 items-center md:items-start gap-4">
          {loading ? (
            <p className="text-gray-600">Loading interview details...</p>
          ) : interviewData ? (
            <>
              <div className="bg-white p-5 border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 w-full overflow-hidden">
                <p>
                  <strong className="font-bold text-gray-800">Job Role:</strong>{' '}
                  {interviewData.jobPosition}
                </p>
                <p className="mt-1">
                  <strong className="font-bold text-gray-800 ">Experience:</strong>{' '}
                  {interviewData.jobExperience}
                </p>
                <p className='mt-1'>
                  <strong className="font-bold text-gray-800 ">Selected Duration:</strong>{' '}
                  {interviewData.selectedDuration}
                </p>
                <p className='mt-1'>
                  <strong className="font-bold text-gray-800 mt-5">Difficulty Level:</strong>{' '}
                  {interviewData.selectedDifficulty}
                </p>

                <div className="mt-2 overflow-y-auto max-h-72 sm:max-h-80 md:max-h-96 p-2 border rounded-md">
                  <p className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap break-words">
                    <strong className="font-bold text-gray-800">Job Description:</strong> {interviewData.jobDescription}
                  </p>
                </div>


              </div>

              <div className="w-full flex justify-center md:justify-start mt-4">
                <Link href={'/dashboard/interview/' + interviewId + '/start'} replace className="w-full md:w-auto">
                  <Button className="w-full md:w-auto px-6 py-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200">
                    Start Interview <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <p className="text-red-500">Interview not found.</p>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-10 md:mt-40 relative w-full">
        <div className="md:absolute bottom-5 left-5 p-5 border rounded-lg border-yellow-100 bg-yellow-100 max-w-sm">
          <h2 className="flex gap-2 items-center text-yellow-600 mb-2">
            <Lightbulb />
            <strong>Information</strong>
          </h2>
          <p className="text-sm text-gray-800 mt">{process.env.NEXT_PUBLIC_INFORMATION}</p>
        </div>
      </div>
    </div>

  );
}

export default InterviewPage;
