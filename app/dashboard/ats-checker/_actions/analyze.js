
"use server";

const JD_STOPWORDS = new Set([
  "the", "and", "for", "with", "you", "your", "our", "are", "will", "that", "this", "have", "has",
  "able", "ability", "work", "working", "team", "teams", "role", "job", "experience", "experienced",
  "years", "year", "including", "include", "using", "use", "strong", "good", "excellent", "plus",
  "must", "should", "would", "can", "all", "any", "who", "what", "when", "where", "how", "into",
  "about", "across", "within", "such", "etc", "per", "via", "out", "not", "but", "they", "their",
  "from", "they", "them", "été", "candidate", "candidates", "ideal", "looking", "join", "help",
  "build", "building", "develop", "developing", "responsibilities", "requirements", "qualifications",
  "preferred", "required", "skills", "knowledge", "understanding", "proficiency", "familiar",
  "well", "more", "than", "also", "may", "new", "high", "level", "support", "ensure", "deliver",
]);

// Extracts the most meaningful keywords from a job description.
function extractKeywords(text, limit = 25) {
  const words = (text.toLowerCase().match(/[a-z][a-z0-9+.#-]{2,}/g) || []);
  const freq = {};
  for (const w of words) {
    if (JD_STOPWORDS.has(w)) continue;
    freq[w] = (freq[w] || 0) + 1;
  }
  return Object.keys(freq).sort((a, b) => freq[b] - freq[a]).slice(0, limit);
}

export async function matchJobDescription(resumeText, jobDescription) {
  try {
    if (!jobDescription || jobDescription.trim().length < 20) {
      return { success: false, error: "Please paste a longer job description." };
    }
    const keywords = extractKeywords(jobDescription);
    if (keywords.length === 0) {
      return { success: false, error: "Couldn't extract keywords from the job description." };
    }
    const resumeLower = (resumeText || "").toLowerCase();
    const matched = keywords.filter((k) => resumeLower.includes(k));
    const missing = keywords.filter((k) => !resumeLower.includes(k));
    const matchPercentage = Math.round((matched.length / keywords.length) * 100);

    return {
      success: true,
      data: {
        match_percentage: matchPercentage,
        matched_keywords: matched,
        missing_keywords: missing,
        total_keywords: keywords.length,
      },
    };
  } catch (error) {
    console.error("JD match error:", error);
    return { success: false, error: error.message };
  }
}

export async function analyzeResume(resumeText) {
    try {
        console.log("Starting Rule-Based Analysis. Text length:", resumeText.length);
        const text = resumeText;
        const lowerText = text.toLowerCase();

        // --- 1. SCORING LOGIC ---

        // A. Structure (Sections) - 15%
        // Strict ATS Section Names
        const sections = ["professional summary|summary|profile", "skills", "experience|work experience", "education", "projects", "certifications"];
        let structureScore = 0;
        const missingSections = [];
        sections.forEach(sec => {
            const regex = new RegExp(sec, "i");
            if (regex.test(text)) {
                structureScore += (100 / sections.length);
            } else {
                missingSections.push(sec.split("|")[0].replace(/\b\w/g, l => l.toUpperCase()));
            }
        });
        structureScore = Math.min(100, Math.round(structureScore));

        // B. Impact (Metrics) - 25% (Boosted)
        const metricsRegex = /(\d+%|\$\d+|\d+k|\d+\+|\d+\syears)/gi;
        const metricsCount = (text.match(metricsRegex) || []).length;
        let impactScore = Math.min(100, metricsCount * 15);

        // C. Skills (Keywords) - 30%
        const commonSkills = ["react", "javascript", "python", "java", "node", "sql", "aws", "docker", "communication", "leadership", "agile", "html", "css", "git", "typescript", "kubernetes", "linux", "c++", "c#", "go", "analysis", "marketing", "sales", "finance"];
        const foundSkills = commonSkills.filter(skill => lowerText.includes(skill));
        let skillsScore = Math.min(100, foundSkills.length * 8);

        // D. Style (Action Verbs & Formatting) - 20%
        const actionVerbs = ["led", "developed", "created", "managed", "designed", "implemented", "optimized", "built", "engineered", "reduced", "increased", "initiated", "launched"];
        const verbsCount = actionVerbs.filter(verb => lowerText.includes(verb)).length;
        let styleScore = Math.min(100, verbsCount * 12);

        // E. Brevity (Sentence Length) - 10%
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        const longLines = lines.filter(line => line.split(' ').length > 25).length;
        let brevityScore = 100 - (longLines * 5);
        brevityScore = Math.max(0, brevityScore);

        // --- NEW CHECKS ---
        const hasEmail = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi.test(text);
        const hasPhone = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/gi.test(text);
        const hasLinkedIn = /linkedin\.com|github\.com/gi.test(text);
        const hasContactInfo = hasEmail && hasPhone;

        const forbiddenSymbols = /[✓★✦❌]/g.test(text);

        // Calculate Overall Match
        let matchPercentage = Math.round(
            (structureScore * 0.2) +
            (impactScore * 0.25) +
            (skillsScore * 0.3) +
            (styleScore * 0.15) +
            (brevityScore * 0.1)
        );

        // Penalize for critical issues
        if (forbiddenSymbols) matchPercentage -= 10;
        if (!hasContactInfo) matchPercentage -= 10;

        matchPercentage = Math.max(0, matchPercentage);

        // --- 2. GENERATE FEEDBACK ---

        const suggestions = [];
        if (!hasEmail || !hasPhone) suggestions.push("Critical: Missing Email or Phone Number in Contact section.");
        if (!hasLinkedIn) suggestions.push("Add a LinkedIn or Portfolio URL to your header.");
        if (forbiddenSymbols) suggestions.push("Remove icons/symbols (✓, ★) - they break ATS parsers.");
        if (metricsCount < 4) suggestions.push("Add more metrics (%, $, numbers) to prove your impact.");
        if (verbsCount < 4) suggestions.push("Start bullets with strong action verbs like 'Led', 'Built', 'Optimized'.");
        if (missingSections.length > 0) suggestions.push(`Missing standard sections: ${missingSections.join(", ")}.`);
        if (foundSkills.length < 6) suggestions.push("Boost your Skills section with more technical keywords.");

        const improvementTip = suggestions[0] || "Great formatting! Ensure keywords match the specific job description.";

        const summary = `Your resume scored ${matchPercentage}/100. ${!hasContactInfo ? "Contact info is incomplete." : ""} ${forbiddenSymbols ? "Avoid special symbols." : ""} You have ${structureScore > 80 ? 'good structure' : 'room for structural improvement'} and ${impactScore > 70 ? 'strong metrics' : 'need more quantified results'}.`;

        return {
            match_percentage: matchPercentage,
            summary: summary,
            impovement_tip: improvementTip,
            scoring_breakdown: {
                impact_score: impactScore,
                brevity_score: brevityScore,
                style_score: styleScore,
                structure_score: structureScore
            },
            checks: {
                quantifying_impact: metricsCount > 3,
                action_verbs: verbsCount > 4,
                no_spelling_errors: !forbiddenSymbols, // Re-using as strict formatting check
                ats_compatible: hasContactInfo && !forbiddenSymbols && structureScore > 60
            },
            missing_keywords: missingSections,
            suggestions: suggestions
        };

    } catch (error) {
        console.error("Analysis Error:", error);
        throw new Error("Analysis Failed: " + error.message);
    }
}
