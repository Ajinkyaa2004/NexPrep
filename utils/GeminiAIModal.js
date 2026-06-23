/*
  Google Gemini API integration for AI-powered interview generation and answer
  evaluation.

  Keeps the exact interface the app depends on:
    const result = await chatSession.sendMessage(prompt);
    const text = result.response.text();

  Hardened against Gemini's intermittent overloads (503/429/5xx) with
  retry-and-backoff plus automatic fallback to alternate models.
*/

const apiKey =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

const PRIMARY_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.5-flash";
// Tried in order; if the primary is overloaded/rate-limited we fall back to the
// next. flash-lite has separate, higher free-tier quota and is a reliable backup.
const MODELS = [PRIMARY_MODEL, "gemini-2.5-flash-lite", "gemini-2.0-flash"].filter(
  (m, i, a) => a.indexOf(m) === i
);

const RETRYABLE_STATUS = [429, 500, 502, 503, 504];

const ENDPOINT = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function generationConfig(model, options) {
  const cfg = {
    temperature: options.temperature ?? 0.7,
    // Force clean JSON output — every caller expects JSON.
    responseMimeType: "application/json",
  };
  // Disable "thinking" only on models that support it (2.5 family).
  if (model.includes("2.5")) {
    cfg.thinkingConfig = { thinkingBudget: 0 };
  }
  return cfg;
}

async function callModel(model, inputPrompt, options) {
  const response = await fetch(ENDPOINT(model), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: inputPrompt }] }],
      generationConfig: generationConfig(model, options),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const err = new Error(
      `Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`
    );
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  return (
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || ""
  );
}

export const chatSession = {
  // options.temperature lets callers tune creativity (e.g. lower for evaluation).
  sendMessage: async (inputPrompt, options = {}) => {
    if (!apiKey) {
      throw new Error(
        "NEXT_PUBLIC_GEMINI_API_KEY environment variable is not set. Please add it to your .env.local file."
      );
    }

    let lastError;
    // Two rounds: each round cycles through every model so a transiently
    // overloaded primary falls through to a working fallback quickly.
    for (let round = 0; round < 3; round++) {
      for (const model of MODELS) {
        try {
          const content = await callModel(model, inputPrompt, options);
          if (!content) throw new Error("Empty response from Gemini");
          return { response: { text: () => content } };
        } catch (error) {
          lastError = error;
          const retryable =
            RETRYABLE_STATUS.includes(error.status) ||
            error.message.includes("Empty response");
          if (!retryable) {
            // Auth / bad-request errors won't be fixed by retrying.
            throw error;
          }
        }
      }
      // All models busy this round — back off briefly, then try again.
      await sleep(1000 * (round + 1));
    }

    console.error("Error generating AI response:", lastError);
    throw lastError;
  },
};
