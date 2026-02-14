"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../../../components/ui/button';
import Webcam from 'react-webcam';
import Image from 'next/image';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '../../../../../../utils/GeminiAIModal';
import { createUserAnswer } from '../../../../../actions/interview';
import moment from 'moment';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData, isRedesign, leftControls, rightControls }) {
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
    // Combine all transcript segments to avoid duplication
    const combinedTranscripts = results.map(result => result.transcript).join(' ');
    if (combinedTranscripts) {
      setUserAnswer(combinedTranscripts);
    }
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
    if (!interviewData?.mockId) {
      // ... existing logic ...
      toast.error("Error: Interview ID is missing. Please refresh.");
      return;
    }

    setLoading(true);
    const feedbackPrompt =
      "Question: " +
      mockInterviewQuestion[activeQuestionIndex]?.question +
      ", User Answer: " +
      userAnswer +
      ". role: AI Interview Evaluator. " +
      "Analyze the candidate's response. Even if the answer is short/empty, generate a report. " +
      "Return JSON with 3 fields: " +
      "1. 'rating' (1-10). " +
      "2. 'strength' (what was good). " +
      "3. 'feedback' (A detailed report string using **bold** for headers. Include: " +
      "   - Overall Impression " +
      "   - Use of Keywords " +
      "   - Missing Key Concepts " +
      "   - Final Recommendation: Strong/Moderate/Needs Improv). " +
      "OUTPUT RAW JSON ONLY.";

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const textResponse = result.response.text();
      console.log("AI Raw Response:", textResponse); // Debug Log

      // Cleaning response: Remove markdown ```json ... ``` if present
      const cleanResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

      // Robust JSON Extraction using Regex (Fallback if clean fails, but clean is better)
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("Failed to match JSON in:", cleanResponse);
        throw new Error("No JSON found in AI response");
      }

      const JsonFeedbackResp = JSON.parse(jsonMatch[0]);
      console.log("Parsed Feedback:", JsonFeedbackResp);

      if (!JsonFeedbackResp.feedback) {
        console.warn("Feedback field missing in AI response");
      }

      const saveResult = await createUserAnswer({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback || "No feedback generated",
        strength: JsonFeedbackResp?.strength || "N/A",
        rating: JsonFeedbackResp?.rating || "0",
        userEmail: "demo@example.com",
        createdAt: moment().format('DD-MM-yyyy'),
      });

      if (saveResult.success) {
        toast('User answer recorded successfully');
      }
      setResults([]);
      // setUserAnswer(''); 
      setLoading(false);
    } catch (error) {
      console.error("Error saving answer:", error);
      toast.error("Failed to save answer. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center flex-col w-full ${!isRedesign && 'px-4'}`}>

      {/* Webcam Section */}
      /* Webcam Section */
      <div className={`flex flex-col justify-center items-center rounded-xl p-0 w-full ${!isRedesign ? 'bg-white border shadow-sm mt-12 p-5 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl' : 'h-full w-full'}`}>
        <div className={`relative w-full flex justify-center h-full`} style={{ aspectRatio: isRedesign ? 'auto' : '4/3', width: '100%', height: isRedesign ? '100%' : 'auto' }}>

          {!isRedesign && (
            <Image
              src="/webcam.svg"
              alt="Webcam Overlay"
              fill
              className="absolute object-contain opacity-20 z-0"
            />
          )}

          <Webcam
            mirrored
            style={{
              height: '100%',
              width: '100%',
              borderRadius: isRedesign ? '0px' : '12px',
              border: isRedesign ? 'none' : '2px solid #e5e7eb',
              boxShadow: isRedesign ? 'none' : '0 4px 10px rgba(0,0,0,0.05)',
              zIndex: 10,
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Debug: Manual Input */}
        <div className="w-full mt-4">
          <textarea
            className="w-full p-2 border rounded-md text-sm"
            placeholder="Debug: Type answer manually if mic fails..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">Manual input engaged (for testing/debugging)</p>
          <p className="text-[10px] text-gray-300 mt-2">Active Mock ID: {interviewData?.mockId || "Loading..."}</p>
        </div>
      </div>

      {/* Unified Control Bar for Redesign */}
      {isRedesign ? (
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6 z-30 pointer-events-none">
          {/* Left Controls */}
          <div className="pointer-events-auto">
            {leftControls}
          </div>

          {/* Center Record Button */}
          <Button
            disabled={loading}
            onClick={StartStopRecording}
            className={`transition-all duration-200 hover:scale-110 pointer-events-auto rounded-full w-14 h-14 p-0 flex items-center justify-center shadow-xl border-4 border-white/20 ${isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-white text-red-600 hover:bg-gray-100'}`}
          >
            {isRecording ? <div className="w-5 h-5 bg-white rounded-sm" /> : <Mic className="h-6 w-6" />}
          </Button>

          {/* Right Controls */}
          <div className="pointer-events-auto">
            {rightControls}
          </div>
        </div>
      ) : (
        <Button
          disabled={loading}
          onClick={StartStopRecording}
          className="my-5 px-6 py-3 font-semibold flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
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
      )}

      {/* DEBUG: Visible Transcript */}
      <div className="w-full mt-4 p-4 bg-gray-100/50 rounded-lg border border-gray-200">
        <p className="text-xs font-bold text-gray-500 mb-2">Live Transcript (Debug):</p>
        <p className="text-sm text-gray-700 min-h-[40px] italic">
          {userAnswer} <span className="text-gray-400">{isRecording && interimResult}</span>
          {!userAnswer && !interimResult && "Listening... (Speak to see text here)"}
        </p>
        {loading && <p className="text-xs text-purple-600 mt-2 animate-pulse">Generating Feedback Report...</p>}
      </div>
    </div>
  );
}

export default RecordAnswerSection;
