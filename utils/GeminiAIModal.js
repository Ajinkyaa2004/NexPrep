/*
  Client-side AI helper. Keeps the interface the app depends on:
    const result = await chatSession.sendMessage(prompt, { temperature });
    const text = result.response.text();

  The actual Gemini call now happens in a server action (app/actions/ai.js),
  which verifies the user, enforces a per-user daily rate limit, and keeps the
  API key off the client. Retry + multi-model fallback live server-side too.
*/

import { generateAI } from "../app/actions/ai";
import { getIdToken } from "../lib/clientAuth";

export const chatSession = {
  sendMessage: async (inputPrompt, options = {}) => {
    const token = await getIdToken();
    const result = await generateAI(inputPrompt, options, token);

    if (!result?.success) {
      throw new Error(result?.error || "AI request failed.");
    }

    // Adapt to the interface callers expect: result.response.text()
    return {
      response: {
        text: () => result.text,
      },
    };
  },
};
