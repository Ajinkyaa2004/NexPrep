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
import { SpeechProvider } from '@speechly/react-client';

function RecordAnswerSection({mockInterviewQuestion, activeQuestionIndex, interviewData}) {
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    error,interimResult,isRecording,results,startSpeechToText,stopSpeechToText,}=useSpeechToText({continuous:true,useLegacyResults:false,});

  useEffect(() => {
    results.forEach((result) => {
      setUserAnswer((prevAns) => result?.transcript);
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
      ",Depend on Question and user Answer for given interview Question" +
      "please give us rating for the answer  feedback as area of improvement and areas where user were performing well if any" +
      "in just 5 to 8 lines to improve it in JSON format with rating field and feedback field";

    const result = await chatSession.sendMessage(feedbackPrompt);

    const MockJsonResp = result.response.text().replace('```json', '').replace('```', '');
    const JsonFeedbackResp = JSON.parse(MockJsonResp);

    // ✅ Log all required values instantly here
    console.log("User Answer:", userAnswer);
    console.log("Rating:", JsonFeedbackResp?.rating);
    console.log("Feedback:", JsonFeedbackResp?.feedback);

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
    }
    setUserAnswer('');
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image src="/webcam.svg" alt="Webcam" width={200} height={200} className="absolute" />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10,
          }}
        />
      </div>

      <Button disabled={loading} variant="outline" className="my-10" onClick={StartStopRecording}>
        {isRecording ? (
          <span className="flex items-center gap-2 text-red-500">
            <h2 className="text-red-600 flex gap-2">
              <Mic /> Stop Recording...
            </h2>
          </span>
        ) : (
          'Record Answer'
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
