"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../../../components/ui/button';
import Webcam from 'react-webcam';
import Image from 'next/image';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '../../../../../../utils/GeminiAIModal';
import { UserAnswer } from '../../../../../../utils/schema.js';
import moment from 'moment';
import { db } from '../../../../../../utils/db';
// import { SpeechProvider } from '@speechly/react-client';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.forEach((result) => {
      setUserAnswer(() => result?.transcript);
    });
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [isRecording]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    setLoading(true);
    const feedbackPrompt =
      "Question:" +
      mockInterviewQuestion[activeQuestionIndex]?.question +
      ", User Answer:" +
     userAnswer +
  ", Depending on the question and the user's answer for the given interview question, " +
  "evaluate the answer based on accuracy, completeness, and reasoning. " +
  "Do not penalize the user for giving a correct answer that is worded differently than the reference answer. " +
  "Please provide a rating and feedback in JSON format. " +
  "The JSON should have two fields: 'rating' (numeric score from 1 to 10) and 'feedback' (a single string of 2–4 sentences with no line breaks, no bullet points, and no unescaped quotes). " +
  "In the feedback, first mention areas of improvement, then mention strengths where the user performed well.";


    const result = await chatSession.sendMessage(feedbackPrompt);

    const MockJsonResp = result.response.text().replace('```json', '').replace('```', '');
    const JsonFeedbackResp = JSON.parse(MockJsonResp);

    console.log("User Answer:", userAnswer);
    console.log("Rating:", JsonFeedbackResp?.rating);
    console.log("Feedback:", JsonFeedbackResp?.feedback);
    console.log("Strength:",JsonFeedbackResp?.Strength);

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: mockInterviewQuestion[activeQuestionIndex]?.question,
      correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      createdAt: moment().format('DD-MM-yyyy'),
    });

    if (resp) {
      toast('User answer recorded successfully');
      setResults([]);
    }
    setResults([]);
    setUserAnswer('');
    setLoading(false);
  };

  return (
  <div className="flex items-center justify-center flex-col px-4 w-full ">
  {/* Webcam Section */}
  <div className="flex flex-col mt-12 justify-center items-center bg-white rounded-xl p-5 border shadow-sm w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
    <div className="relative w-full flex justify-center" style={{ aspectRatio: '4/3', maxWidth: 400 }}>
      {/* Webcam Overlay */}
      <Image
        src="/webcam.svg"
        alt="Webcam Overlay"
        fill
        className="absolute object-contain opacity-20 z-0"
      />

      {/* Webcam */}
      <Webcam
        mirrored
        style={{
          height: '100%',
          width: '100%',
          borderRadius: '12px',
          border: '2px solid #e5e7eb',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          zIndex: 10,
        }}
      />
    </div>
  </div>

  {/* Record Button */}
  <Button
    disabled={loading}
    onClick={StartStopRecording}
    className={`my-5 px-6 py-3 font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 ${
      isRecording
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-blue-600 hover:bg-blue-700 text-white'
    }`}
  >
    {isRecording ? (
      <>
        <Mic className="h-5 w-5" />
        Stop Recording...
      </>
    ) : (
      'Record Answer'
    )}
  </Button>
</div>


  );
}

export default RecordAnswerSection;
