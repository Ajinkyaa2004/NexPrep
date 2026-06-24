"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../../../../../components/ui/button';
import Webcam from 'react-webcam';
import { Mic, Square, Keyboard, Save, Loader2, CheckCircle2, VideoOff } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '../../../../../../utils/GeminiAIModal';
import { createUserAnswer } from '../../../../../actions/interview';
import { transcribeAndEvaluate } from '../../../../../actions/ai';
import { getIdToken } from '../../../../../../lib/clientAuth';
import moment from 'moment';

/* ---------- live transcript preview (Web Speech API) ---------- */
function useSpeechPreview() {
  const recognitionRef = useRef(null);
  const wantOnRef = useRef(false);
  const activeRef = useRef(false);
  const finalRef = useRef('');
  const [interim, setInterim] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true; rec.interimResults = true; rec.lang = 'en-US';
    rec.onstart = () => { activeRef.current = true; };
    rec.onend = () => { activeRef.current = false; if (wantOnRef.current) { try { rec.start(); } catch (_) {} } };
    rec.onerror = () => {};
    rec.onresult = (event) => {
      let it = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalRef.current += r[0].transcript + ' ';
        else it += r[0].transcript;
      }
      setInterim(it);
      setPreview((finalRef.current + it).trim());
    };
    recognitionRef.current = rec;
    return () => { wantOnRef.current = false; try { rec.abort(); } catch (_) {} };
  }, []);

  return {
    start() { finalRef.current = ''; setPreview(''); setInterim(''); wantOnRef.current = true; if (!activeRef.current) { try { recognitionRef.current?.start(); } catch (_) {} } },
    stop() { wantOnRef.current = false; try { recognitionRef.current?.stop(); } catch (_) {} },
    reset() { finalRef.current = ''; setPreview(''); setInterim(''); },
    interim, preview,
  };
}

/* ---------- WAV audio recorder (Web Audio API) ---------- */
function downsample(buffer, inRate, outRate) {
  if (outRate >= inRate) return buffer;
  const ratio = inRate / outRate;
  const newLen = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLen);
  let o = 0, i = 0;
  while (o < newLen) {
    const next = Math.round((o + 1) * ratio);
    let sum = 0, cnt = 0;
    for (let j = i; j < next && j < buffer.length; j++) { sum += buffer[j]; cnt++; }
    result[o++] = sum / (cnt || 1);
    i = next;
  }
  return result;
}
function encodeWAV(samples, rate) {
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buf);
  const w = (off, s) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); view.setUint32(4, 36 + samples.length * 2, true); w(8, 'WAVE');
  w(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  w(36, 'data'); view.setUint32(40, samples.length * 2, true);
  let off = 44;
  for (let i = 0; i < samples.length; i++) { const s = Math.max(-1, Math.min(1, samples[i])); view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7FFF, true); off += 2; }
  return new Blob([view], { type: 'audio/wav' });
}
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => resolve(String(r.result).split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [typeMode, setTypeMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [camError, setCamError] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);

  const speech = useSpeechPreview();

  // Web Audio recorder refs
  const ctxRef = useRef(null), procRef = useRef(null), srcRef = useRef(null), streamRef = useRef(null);
  const chunksRef = useRef([]); const inRateRef = useRef(48000); const audioBlobRef = useRef(null);

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC(); ctxRef.current = ctx; inRateRef.current = ctx.sampleRate;
      const src = ctx.createMediaStreamSource(stream); srcRef.current = src;
      const proc = ctx.createScriptProcessor(4096, 1, 1); procRef.current = proc;
      chunksRef.current = [];
      proc.onaudioprocess = (e) => { chunksRef.current.push(new Float32Array(e.inputBuffer.getChannelData(0))); };
      src.connect(proc); proc.connect(ctx.destination);
      return true;
    } catch (e) {
      console.error('audio capture failed:', e);
      return false;
    }
  };

  const stopAudio = () => {
    try { procRef.current && (procRef.current.onaudioprocess = null, procRef.current.disconnect()); } catch (_) {}
    try { srcRef.current && srcRef.current.disconnect(); } catch (_) {}
    try { streamRef.current && streamRef.current.getTracks().forEach((t) => t.stop()); } catch (_) {}
    const chunks = chunksRef.current; chunksRef.current = [];
    try { ctxRef.current && ctxRef.current.close(); } catch (_) {}
    if (!chunks.length) { audioBlobRef.current = null; return; }
    let len = 0; for (const c of chunks) len += c.length;
    const data = new Float32Array(len); let off = 0;
    for (const c of chunks) { data.set(c, off); off += c.length; }
    const down = downsample(data, inRateRef.current, 16000);
    audioBlobRef.current = encodeWAV(down, 16000);
    setHasAudio(true);
  };

  // Reset on question change
  useEffect(() => {
    if (isRecording) { speech.stop(); stopAudio(); }
    audioBlobRef.current = null;
    setIsRecording(false); setHasAudio(false); setUserAnswer(''); setSaved(false); setTypeMode(false);
    speech.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestionIndex]);

  // Mirror live speech preview into the answer box (voice mode only)
  useEffect(() => {
    if (!typeMode && speech.preview) { setUserAnswer(speech.preview); setSaved(false); }
  }, [speech.preview, typeMode]);

  const toggleRecording = async () => {
    if (isRecording) {
      speech.stop(); stopAudio(); setIsRecording(false);
      return;
    }
    setUserAnswer(''); setSaved(false); audioBlobRef.current = null; setHasAudio(false);
    const ok = await startAudio();
    if (!ok) { toast.error('Microphone unavailable. Please type your answer instead.'); setTypeMode(true); return; }
    speech.start();
    setIsRecording(true);
  };

  const enableTyping = () => {
    if (isRecording) { speech.stop(); stopAudio(); setIsRecording(false); }
    audioBlobRef.current = null; setHasAudio(false);
    setTypeMode((t) => !t);
  };

  const saveAnswer = async () => {
    if (isRecording) { speech.stop(); stopAudio(); setIsRecording(false); }
    if (!interviewData?.mockId) { toast.error('Interview ID is missing. Please refresh.'); return; }
    const currentQuestion = mockInterviewQuestion[activeQuestionIndex];
    setLoading(true);
    try {
      const token = await getIdToken();
      let answerText = '';
      let rating = '0', strength = 'N/A', feedback = 'No feedback generated';

      // Allow the audio blob a tick to finalize after stop.
      await new Promise((r) => setTimeout(r, 150));

      if (!typeMode && audioBlobRef.current) {
        // Accurate path: Gemini transcribes the real audio AND evaluates it.
        const base64 = await blobToBase64(audioBlobRef.current);
        const res = await transcribeAndEvaluate(
          { audioBase64: base64, mimeType: 'audio/wav', question: currentQuestion?.question, modelAnswer: currentQuestion?.answer },
          token
        );
        if (!res.success) { toast.error(res.error || 'Could not evaluate your answer.'); setLoading(false); return; }
        answerText = (res.transcript || '').trim() || speech.preview.trim();
        if (answerText.length < 2) { toast.error('We couldn’t hear an answer — please try again or type it.'); setLoading(false); return; }
        rating = String(res.rating ?? '0'); strength = res.strength || 'N/A'; feedback = res.feedback || feedback;
      } else {
        // Typed path: evaluate the text.
        const answer = userAnswer.trim();
        if (answer.length < 2) { toast.error('Please record or type an answer first.'); setLoading(false); return; }
        const prompt =
          'You are a strict but fair technical interview evaluator. Compare the answer to the expected answer.\n' +
          'Question: ' + (currentQuestion?.question || '') + '\nExpected/Model Answer: ' + (currentQuestion?.answer || 'N/A') +
          "\nCandidate's Answer: " + answer + '\n' +
          'Scoring: 1-3 empty/off-topic/incorrect; 4-6 partial; 7-8 mostly correct; 9-10 accurate+complete. Base ONLY on what they said.\n' +
          "Return JSON { 'rating': int 1-10, 'strength': string, 'feedback': string with **bold** headers (**Overall Impression**, **Correctness vs Expected Answer**, **Missing Key Concepts**, **Final Recommendation**) }. RAW JSON ONLY.";
        const result = await chatSession.sendMessage(prompt, { temperature: 0.3 });
        const clean = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const match = clean.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(match ? match[0] : clean);
        answerText = answer; rating = String(parsed.rating ?? '0'); strength = parsed.strength || 'N/A'; feedback = parsed.feedback || feedback;
      }

      setUserAnswer(answerText);
      const saveResult = await createUserAnswer({
        mockIdRef: interviewData.mockId,
        question: currentQuestion?.question,
        correctAns: currentQuestion?.answer,
        userAns: answerText,
        feedback, strength, rating,
        createdAt: moment().format('DD-MM-yyyy'),
      }, token);

      if (saveResult.success) { setSaved(true); toast.success(`Answer saved & evaluated ✓ (Score: ${rating}/10)`); }
      else { toast.error('Could not save your answer. ' + (saveResult.error || '')); }
    } catch (e) {
      console.error('Evaluation error:', e);
      toast.error('Could not evaluate the answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canSave = !loading && (typeMode ? userAnswer.trim().length > 1 : (hasAudio || isRecording || userAnswer.trim().length > 1));

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
          <Webcam mirrored audio={false} onUserMediaError={() => setCamError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        {isRecording && (
          <div className="absolute top-3 left-3 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2 backdrop-blur-sm border border-white/10">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Recording
          </div>
        )}
        {loading && (
          <div className="absolute top-3 right-3 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2 backdrop-blur-sm border border-white/10">
            <Loader2 className="w-3 h-3 animate-spin" /> Transcribing & evaluating…
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
            {userAnswer} <span className="text-gray-400">{isRecording && speech.interim}</span>
            {!userAnswer && !speech.interim && (
              <span className="text-gray-400 italic">
                {isRecording ? 'Listening… speak your answer now.' : (hasAudio ? 'Answer recorded — click "Save Answer" to get your score.' : 'Click "Record" and answer aloud, or switch to typing.')}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={toggleRecording} disabled={loading || typeMode}
            className={`gap-2 h-10 ${isRecording ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : 'bg-primary hover:bg-primary/90 text-white'}`}>
            {isRecording ? <><Square className="w-4 h-4" /> Stop</> : <><Mic className="w-4 h-4" /> Record</>}
          </Button>
          <Button variant="outline" onClick={enableTyping} disabled={loading} className="gap-2 h-10">
            <Keyboard className="w-4 h-4" /> {typeMode ? 'Use Mic' : 'Type'}
          </Button>
          <Button onClick={saveAnswer} disabled={!canSave}
            className={`gap-2 h-10 ml-auto ${saved ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-900 hover:bg-gray-800'} text-white`}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {loading ? 'Evaluating…' : saved ? 'Saved' : 'Save Answer'}
          </Button>
        </div>
        <p className="text-[11px] text-gray-400">
          Speak naturally — your audio is transcribed by AI for an accurate score. Prefer typing? Use the “Type” option.
        </p>
      </div>
    </div>
  );
}

export default RecordAnswerSection;
