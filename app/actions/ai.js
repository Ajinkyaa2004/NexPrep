'use server';

import dbConnect from '../../utils/mongodb';
import { RateLimit } from '../../utils/rateLimitModel';
import { verifyAuthToken } from '../../firebase/admin';
import moment from 'moment';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const MODELS = [PRIMARY_MODEL, 'gemini-2.5-flash-lite', 'gemini-2.0-flash'].filter((m, i, a) => a.indexOf(m) === i);
const RETRYABLE = [429, 500, 502, 503, 504];
const DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT || 80);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const endpoint = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

function genConfig(model, options) {
  const cfg = { temperature: options.temperature ?? 0.7, responseMimeType: 'application/json' };
  if (model.includes('2.5')) cfg.thinkingConfig = { thinkingBudget: 0 };
  return cfg;
}

// parts = [{ text }, { inlineData: { mimeType, data } }, ...]
async function callModel(model, parts, options) {
  const res = await fetch(endpoint(model), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: genConfig(model, options) }),
  });
  if (!res.ok) {
    const t = await res.text();
    const err = new Error(`Gemini ${res.status}: ${t.slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
}

async function runWithFallback(parts, options) {
  let lastError;
  for (let round = 0; round < 3; round++) {
    for (const model of MODELS) {
      try {
        const content = await callModel(model, parts, options);
        if (!content) throw new Error('Empty response');
        return { success: true, text: content };
      } catch (error) {
        lastError = error;
        const retryable = RETRYABLE.includes(error.status) || error.message.includes('Empty response');
        if (!retryable) {
          console.error('AI non-retryable error:', error.message);
          return { success: false, error: 'AI request failed.' };
        }
      }
    }
    await sleep(1000 * (round + 1));
  }
  console.error('AI failed after retries:', lastError?.message);
  return { success: false, error: 'AI is busy right now. Please try again.' };
}

async function checkRateLimit(email) {
  await dbConnect();
  const day = moment().format('YYYY-MM-DD');
  const doc = await RateLimit.findOneAndUpdate(
    { key: `${email}:${day}` },
    { $inc: { count: 1 }, $set: { day } },
    { upsert: true, new: true }
  );
  return doc.count <= DAILY_LIMIT;
}

async function authorize(idToken) {
  const auth = await verifyAuthToken(idToken);
  if (!auth?.email) return { ok: false, error: 'Not authenticated.' };
  if (!apiKey) return { ok: false, error: 'AI is not configured on the server.' };
  try {
    const allowed = await checkRateLimit(auth.email);
    if (!allowed) return { ok: false, error: `Daily AI limit reached (${DAILY_LIMIT}). Please try again tomorrow.`, rateLimited: true };
  } catch (e) {
    console.error('Rate limit check failed (allowing):', e.message);
  }
  return { ok: true, email: auth.email };
}

/** Text-only generation (interview questions, answer evaluation, etc.). */
export async function generateAI(prompt, options = {}, idToken) {
  const a = await authorize(idToken);
  if (!a.ok) return { success: false, error: a.error, rateLimited: a.rateLimited };
  return runWithFallback([{ text: prompt }], options);
}

/**
 * Transcribe a spoken answer (audio) AND evaluate it in a single Gemini call.
 * Gemini's speech recognition handles accents, technical terms and long answers
 * far better than the browser Web Speech API.
 */
export async function transcribeAndEvaluate({ audioBase64, mimeType, question, modelAnswer }, idToken) {
  const a = await authorize(idToken);
  if (!a.ok) return { success: false, error: a.error, rateLimited: a.rateLimited };
  if (!audioBase64) return { success: false, error: 'No audio captured.' };

  const prompt =
    'You are a strict but fair technical interview evaluator. The candidate answered the question below by voice. ' +
    'First transcribe exactly what they said from the audio, then evaluate that answer against the expected answer.\n\n' +
    'Question: ' + (question || '') + '\n' +
    'Expected/Model Answer: ' + (modelAnswer || 'N/A') + '\n\n' +
    'Scoring (be accurate, do not inflate): 1-3 if empty/off-topic/incorrect; 4-6 partial; 7-8 mostly correct; 9-10 accurate, complete and well-articulated. ' +
    'Base the rating ONLY on what the candidate actually said.\n\n' +
    'Return ONLY raw JSON with exactly: { "transcript": string (what they said, verbatim; empty string if silent), ' +
    '"rating": integer 1-10, "strength": string, "feedback": string with **bold** headers covering ' +
    '**Overall Impression**, **Correctness vs Expected Answer**, **Missing Key Concepts**, **Final Recommendation** (Strong/Moderate/Needs Improvement) }.';

  const parts = [{ text: prompt }, { inlineData: { mimeType: mimeType || 'audio/wav', data: audioBase64 } }];
  const result = await runWithFallback(parts, { temperature: 0.3 });
  if (!result.success) return result;

  try {
    const clean = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const match = clean.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : clean);
    return { success: true, ...parsed };
  } catch (e) {
    console.error('Audio eval parse error:', e.message);
    return { success: false, error: 'Could not parse the evaluation.' };
  }
}
