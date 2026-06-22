"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../../../../../components/ui/button';
import Webcam from 'react-webcam';
import { Mic, Square, Keyboard, Save, Loader2, CheckCircle2, VideoOff } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '../../../../../../utils/GeminiAIModal';
import { createUserAnswer } from '../../../../../actions/interview';
import { auth } from '../../../../../../firebase/client';
import moment from 'moment';

/**
 * Custom speech-to-text hook built directly on the Web Speech API.
 * Fully controls the SpeechRecognition instance so it never throws the
 * "recognition has already started" InvalidStateError, and keeps React state
 * in sync via the recognition lifecycle events.
 */
function useSpeechRecognition() {
  const recognitionRef = useRef(null);
  const wantOnRef = useRef(false); // user intends to keep recording
  const activeRef = useRef(false); // recognition is currently running
  const finalRef = useRef('');

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const SR =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SR) {
      setSupported(false);
      return;
    }

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      activeRef.current = true;
      setIsRecording(true);
    };

    rec.onend = () => {
      activeRef.current = false;
      // Chrome auto-stops after silence in continuous mode — restart if the
      // user hasn't explicitly stopped.
      if (wantOnRef.current) {
        try {
          rec.start();
        } catch (_) {
          /* will retry on next end */
        }
      } else {
        setIsRecording(false);
      }
    };

    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        wantOnRef.current = false;
        setIsRecording(false);
        toast.error('Microphone access is blocked. Allow it in your browser, or use "Type".');
      }
      // 'no-speech' / 'aborted' / 'network' are non-fatal in continuous mode.
    };

    rec.onresult = (event) => {
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalRef.current += res[0].transcript + ' ';
        else interimText += res[0].transcript;
      }
      setInterim(interimText);
      setTranscript((finalRef.current + interimText).trim());
    };

    recognitionRef.current = rec;

    return () => {
      wantOnRef.current = false;
      try { rec.abort(); } catch (_) {}
      recognitionRef.current = null;
    };
  }, []);

  const start = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    finalRef.current = '';
    setTranscript('');
    setInterim('');
    wantOnRef.current = true;
    if (!activeRef.current) {
      try {
        rec.start();
      } catch (_) {
        // Already started — state will sync via onstart. Safe to ignore.
      }
    }
  };

  const stop = () => {
    wantOnRef.current = false;
    const rec = recognitionRef.current;
    if (rec) {
      try { rec.stop(); } catch (_) {}
    }
    setIsRecording(false);
  };

  const reset = () => {
    finalRef.current = '';
    setTranscript('');
    setInterim('');
  };

  return { isRecording, transcript, interim, supported, start, stop, reset };
}

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [typeMode, setTypeMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [camError, setCamError] = useState(false);

  const { isRecording, transcript, interim, supported, start, stop, reset } = useSpeechRecognition();

  // Mirror the speech transcript into the answer (unless the user is typing).
  useEffect(() => {
    if (!typeMode && transcript) {
      setUserAnswer(transcript);
      setSaved(false);
    }
  }, [transcript, typeMode]);

  // Reset everything when moving to a new question.
  useEffect(() => {
    stop();
    reset();
    setUserAnswer('');
    setSaved(false);
    setTypeMode(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestionIndex]);

  const toggleRecording = () => {
    if (isRecording) {
      stop();
    } else {
      setUserAnswer('');
      setSaved(false);
      start();
    }
  };

  const enableTyping = () => {
    if (isRecording) stop();
    setTypeMode((t) => !t);
  };

  const saveAnswer = async () => {
    const answer = userAnswer.trim();
    if (answer.length < 2) {
      toast.error('Please record or type an answer first.');
      return;
    }
    if (!interviewData?.mockId) {
      toast.error('Interview ID is missing. Please refresh the page.');
      return;
    }
    if (isRecording) stop();

    setLoading(true);
    const currentQuestion = mockInterviewQuestion[activeQuestionIndex];
    const feedbackPrompt =
      'You are a strict but fair technical interview evaluator. ' +
      "Evaluate the candidate's answer by comparing it against the question and the expected (model) answer.\n\n" +
      'Question: ' + (currentQuestion?.question || '') + '\n' +
      'Expected/Model Answer: ' + (currentQuestion?.answer || 'N/A') + '\n' +
      "Candidate's Answer: " + answer + '\n\n' +
      'Scoring rules (be accurate, do not inflate): ' +
      'rate 1-3 if the answer is empty, off-topic, or largely incorrect; ' +
      '4-6 if partially correct but missing key concepts; ' +
      '7-8 if mostly correct and relevant; ' +
      '9-10 only if accurate, complete, and well-articulated. ' +
      'Base the rating ONLY on what the candidate actually said versus the expected answer.\n\n' +
      'Return JSON with exactly these fields: ' +
      "1. 'rating' (integer 1-10). " +
      "2. 'strength' (one specific thing the candidate did well; if nothing, say so honestly). " +
      "3. 'feedback' (a detailed report string using **bold** for headers, including: " +
      '**Overall Impression**, **Correctness vs Expected Answer**, **Missing Key Concepts**, and ' +
      '**Final Recommendation** (Strong / Moderate / Needs Improvement)). ' +
      'OUTPUT RAW JSON ONLY.';

    try {
      const result = await chatSession.sendMessage(feedbackPrompt, { temperature: 0.3 });
      const textResponse = result.response.text();
      const cleanResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in AI response');
      const JsonFeedbackResp = JSON.parse(jsonMatch[0]);

      const saveResult = await createUserAnswer({
        mockIdRef: interviewData.mockId,
        question: currentQuestion?.question,
        correctAns: currentQuestion?.answer,
        userAns: answer,
        feedback: JsonFeedbackResp?.feedback || 'No feedback generated',
        strength: JsonFeedbackResp?.strength || 'N/A',
        rating: String(JsonFeedbackResp?.rating ?? '0'),
        userEmail: auth.currentUser?.email || 'demo@gmail.com',
        createdAt: moment().format('DD-MM-yyyy'),
      });

      if (saveResult.success) {
        setSaved(true);
        toast.success(`Answer saved & evaluated ✓ (Score: ${JsonFeedbackResp?.rating ?? '?'}/10)`);
      } else {
        toast.error('Could not save your answer. ' + (saveResult.error || ''));
      }
    } catch (e) {
      console.error('Evaluation error:', e);
      toast.error('Could not evaluate the answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const micDisabled = loading || typeMode || !supported;

  return (
    <div className="flex flex-col h-full min-h-0 gap-3">
      {/* Webcam */}
      <div className="relative flex-1 min-h-0 bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
        {camError ? (
          <div className="flex flex-col items-center text-gray-400 gap-2">
            <VideoOff className="w-10 h-10" />
            <p className="text-sm">Camera unavailable — you can still answer.</p>
          </div>
        ) : (
          <Webcam
            mirrored
            audio={false}
            onUserMediaError={() => setCamError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}

        {isRecording && (
          <div className="absolute top-3 left-3 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2 backdrop-blur-sm border border-white/10">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Recording
          </div>
        )}
        {loading && (
          <div className="absolute top-3 right-3 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2 backdrop-blur-sm border border-white/10">
            <Loader2 className="w-3 h-3 animate-spin" /> Evaluating…
          </div>
        )}
      </div>

      {/* Answer panel */}
      <div className="shrink-0 bg-white rounded-2xl border border-gray-200 shadow-sm p-3 flex flex-col gap-2">
        {typeMode ? (
          <textarea
            value={userAnswer}
            onChange={(e) => { setUserAnswer(e.target.value); setSaved(false); }}
            placeholder="Type your answer here…"
            className="w-full h-20 p-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        ) : (
          <div className="min-h-[3rem] max-h-24 overflow-y-auto text-sm text-gray-700 bg-gray-50 rounded-lg p-2.5 leading-relaxed">
            {userAnswer} <span className="text-gray-400">{isRecording && interim}</span>
            {!userAnswer && !interim && (
              <span className="text-gray-400 italic">
                {isRecording ? 'Listening… speak your answer now.' : 'Click "Record" and answer aloud, or switch to typing.'}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={toggleRecording}
            disabled={micDisabled}
            title={!supported ? 'Speech recognition not supported in this browser — use Type' : ''}
            className={`gap-2 h-10 ${isRecording ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : 'bg-primary hover:bg-primary/90 text-white'}`}
          >
            {isRecording ? <><Square className="w-4 h-4" /> Stop</> : <><Mic className="w-4 h-4" /> Record</>}
          </Button>

          <Button variant="outline" onClick={enableTyping} disabled={loading} className="gap-2 h-10">
            <Keyboard className="w-4 h-4" /> {typeMode ? 'Use Mic' : 'Type'}
          </Button>

          <Button
            onClick={saveAnswer}
            disabled={loading || !userAnswer.trim()}
            className={`gap-2 h-10 ml-auto ${saved ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-900 hover:bg-gray-800'} text-white`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {loading ? 'Evaluating…' : saved ? 'Saved' : 'Save Answer'}
          </Button>
        </div>

        {!supported && (
          <p className="text-[11px] text-amber-600">
            Speech recognition isn&apos;t supported in this browser. Click &quot;Type&quot; to enter your answer.
          </p>
        )}
      </div>
    </div>
  );
}

export default RecordAnswerSection;
