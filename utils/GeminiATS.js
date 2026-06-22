/*
  Optional Gemini-powered ATS analysis. The ATS Checker page currently uses the
  fast rule-based analyzer in app/dashboard/ats-checker/_actions/analyze.js, but
  this helper is kept available and wired to the real Gemini API.
*/

const apiKey =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

const MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.5-flash";

export const ATS_SCORING_PROMPT = `
You are an expert ATS (Applicant Tracking System) Resume Analyzer.
Analyze the resume based on these key pillars: Impact, Brevity, Style, and Structure.

Output strictly valid JSON with no markdown formatting. Structure:
{
  "match_percentage": number, // 0-100 overall score
  "summary": string, // 2 sentences summary
  "impovement_tip": string, // One specific actionable tip
  "scoring_breakdown": {
    "impact_score": number, // 0-100 (Use of metrics/results)
    "brevity_score": number, // 0-100 (Conciseness)
    "style_score": number, // 0-100 (Formatting/Tone)
    "structure_score": number // 0-100 (Sections quality)
  },
  "checks": {
    "quantifying_impact": boolean, // true if metrics used > 30%
    "action_verbs": boolean, // true if strong verbs used
    "no_spelling_errors": boolean, // true if mostly clean
    "ats_compatible": boolean // true if standard parsing likely
  },
  "missing_keywords": string[], // Critical skills missing
  "suggestions": string[] // 3 specific improvement bullets
}

Resume Text:
{resumeText}
`;

export const analyzeResumeWithGemini = async (resumeText, jobDescription) => {
  try {
    if (!apiKey) {
      throw new Error(
        "NEXT_PUBLIC_GEMINI_API_KEY environment variable is not set. Please add it to your .env.local file."
      );
    }

    let prompt = ATS_SCORING_PROMPT.replace("{resumeText}", resumeText);
    if (jobDescription) {
      prompt += `\n\nTarget Job Description:\n${jobDescription}`;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.5,
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const content =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join("") || "{}";

    const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("ATS Analysis Error:", error);
    throw error;
  }
};
