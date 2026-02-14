

const apiKey = process.env.NEXT_PUBLIC_GROK_API_KEY;

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
            throw new Error('NEXT_PUBLIC_GROK_API_KEY environment variable is not set. Please add it to your .env.local file.');
        }

        const prompt = ATS_SCORING_PROMPT.replace("{resumeText}", resumeText);

        const response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "grok-beta",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.5
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Grok API Error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || "{}";

        // Clean markdown code blocks if present
        const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("ATS Analysis Error:", error);
        throw error;
    }
};

