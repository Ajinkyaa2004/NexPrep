/*
  Google Gemini API integration for AI-powered interview generation and answer
  evaluation.

  Keeps the exact interface the app depends on:
    const result = await chatSession.sendMessage(prompt);
    const text = result.response.text();
*/

const apiKey =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

// Fast, capable, generally-available model.
const MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.5-flash";

const ENDPOINT = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

export const chatSession = {
  // options.temperature lets callers tune creativity (e.g. lower for evaluation).
  sendMessage: async (inputPrompt, options = {}) => {
    if (!apiKey) {
      throw new Error(
        "NEXT_PUBLIC_GEMINI_API_KEY environment variable is not set. Please add it to your .env.local file."
      );
    }

    try {
      const response = await fetch(ENDPOINT(MODEL), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: inputPrompt }] }],
          generationConfig: {
            temperature: options.temperature ?? 0.7,
            // Force clean JSON output — every caller expects JSON.
            responseMimeType: "application/json",
            // Disable "thinking" for lower latency on flash models.
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      const content =
        data?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || "")
          .join("") || "";

      // Adapt to the interface expected by callers: result.response.text()
      return {
        response: {
          text: () => content,
        },
      };
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw error;
    }
  },
};
