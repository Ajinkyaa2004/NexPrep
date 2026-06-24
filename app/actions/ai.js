'use server';

import dbConnect from '../../utils/mongodb';
import { RateLimit } from '../../utils/rateLimitModel';
import { verifyAuthToken } from '../../firebase/admin';
import moment from 'moment';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const MODELS = [PRIMARY_MODEL, 'gemini-2.5-flash-lite', 'gemini-2.0-flash'].filter((m, i, a) => a.indexOf(m) === i);
const RETRYABLE = [429, 500, 502, 503, 504];
const DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT || 80); // AI calls per user per day

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const endpoint = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

function genConfig(model, options) {
  const cfg = { temperature: options.temperature ?? 0.7, responseMimeType: 'application/json' };
  if (model.includes('2.5')) cfg.thinkingConfig = { thinkingBudget: 0 };
  return cfg;
}

async function callModel(model, prompt, options) {
  const res = await fetch(endpoint(model), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: genConfig(model, options),
    }),
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

// Atomically increment today's counter and return whether the user is within limit.
async function checkRateLimit(email) {
  await dbConnect();
  const day = moment().format('YYYY-MM-DD');
  const key = `${email}:${day}`;
  const doc = await RateLimit.findOneAndUpdate(
    { key },
    { $inc: { count: 1 }, $set: { day } },
    { upsert: true, new: true }
  );
  return doc.count <= DAILY_LIMIT;
}

/**
 * Server-side AI generation. Verifies the caller, enforces a per-user daily
 * limit, then calls Gemini with multi-model fallback. The API key never reaches
 * the browser.
 */
export async function generateAI(prompt, options = {}, idToken) {
  const auth = await verifyAuthToken(idToken);
  if (!auth?.email) return { success: false, error: 'Not authenticated.' };
  if (!apiKey) return { success: false, error: 'AI is not configured on the server.' };

  try {
    const allowed = await checkRateLimit(auth.email);
    if (!allowed) {
      return { success: false, error: `Daily AI limit reached (${DAILY_LIMIT}). Please try again tomorrow.`, rateLimited: true };
    }
  } catch (e) {
    console.error('Rate limit check failed (allowing):', e.message);
    // Don't block the user if the counter store hiccups.
  }

  let lastError;
  for (let round = 0; round < 3; round++) {
    for (const model of MODELS) {
      try {
        const content = await callModel(model, prompt, options);
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
  console.error('AI generation failed after retries:', lastError?.message);
  return { success: false, error: 'AI is busy right now. Please try again.' };
}
