const router = require('express').Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require('../middleware/auth');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get('/test', async (req, res) => {
    res.json({ message: "AI Route is working", keyExists: !!process.env.GEMINI_API_KEY });
});

router.post('/advice', auth, async (req, res) => {
    console.log("AI Advice Request Received for user:", req.user?.id);
    try {
        const { skills, recommendedRole, matchPercentage, missingSkills } = req.body;

        if (!skills || !recommendedRole) {
            console.error("Validation Error: Profile data missing");
            return res.status(400).json({ error: "Missing required profile data" });
        }

        // Using gemini-2.0-flash (most reliable for your new API key)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        console.log("Model initialized with gemini-2.5-flash");

        const skillsList = skills.map(s => `- ${s.name} (${s.level}%)`).join('\n');
        const missingSkillsList = (missingSkills || []).map(s => `- ${s}`).join('\n') || '- None identified';

        // ─────────────────────────────────────────────
        // SYSTEM PERSONA
        // ─────────────────────────────────────────────
        const persona = `
You are CareerCoach AI — a friendly, experienced career mentor specialized in helping students and early-career developers grow in the tech industry.

Your personality:
- Encouraging and realistic — you celebrate strengths while being honest about gaps.
- Practical and action-oriented — you never give vague advice.
- Concise and structured — you respect the user's time.
- Empathetic — you understand that career growth can feel overwhelming.
        `.trim();

        // ─────────────────────────────────────────────
        // RULES / INSTRUCTIONS
        // ─────────────────────────────────────────────
        const instructions = `
INSTRUCTIONS — follow every rule strictly:

1. Answer only career-related questions about the student's tech profile.
   - If the profile data is about a non-tech domain, adapt accordingly.
   - Do NOT answer anything unrelated to career development or skill building.

2. Always base your advice on the provided skill data — do not invent skills.

3. Prioritize missing skills that are most critical for the recommended role.

4. Suggest only real, widely available learning platforms (YouTube, Coursera, Udemy, freeCodeCamp, official docs, etc.).

5. Keep the total response between 130–160 words. Do not exceed this.

6. FORMATTING RULES (strictly follow):
   - Use plain section titles like "1. Career Direction:" — NO markdown bold (**...**), NO asterisks, NO hashtags.
   - Use plain hyphens (-) for bullet points.
   - Never use emojis.
   - Keep language simple — suitable for a college student.

7. Always end with exactly one "Career Tip:" — a single, practical sentence.

8. If match percentage is below 50%, gently note the skill gap without discouraging the student.
        `.trim();

        // ─────────────────────────────────────────────
        // STUDENT PROFILE CONTEXT
        // ─────────────────────────────────────────────
        const profileContext = `
STUDENT PROFILE:
- Recommended Role: ${recommendedRole}
- Match Percentage: ${matchPercentage ?? 'N/A'}%
- Current Skills:
${skillsList}
- Missing Skills:
${missingSkillsList}
        `.trim();

        // ─────────────────────────────────────────────
        // OUTPUT FORMAT (few-shot example)
        // ─────────────────────────────────────────────
        const outputFormat = `
Respond in EXACTLY this structure:

1. Career Direction:
[One sentence summarizing the best-fit career path based on their skills.]

2. Top Skills to Learn Next:
- [Skill 1] — why it matters for ${recommendedRole}
- [Skill 2] — why it matters
- [Skill 3] — why it matters (optional if only 2 gaps)

3. Learning Resources:
- [Platform]: Search "[specific topic or course name]"
- [Platform]: Search "[specific topic or course name]"

4. Action Plan:
- Step 1: [What to start with — beginner task]
- Step 2: [What to practice — intermediate task]
- Step 3: [What to build — project idea]

Career Tip:
[One practical, motivating sentence.]
        `.trim();

        // ─────────────────────────────────────────────
        // FULL PROMPT ASSEMBLY
        // ─────────────────────────────────────────────
        const prompt = `
${persona}

${instructions}

${profileContext}

${outputFormat}
        `.trim();

        console.log("Calling Gemini API...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const advice = response.text();
        console.log("Gemini Advice Generated Successfully.");

        res.json({ advice });

    } catch (err) {
        console.error("Gemini API Error Detail:", err);
        res.status(500).json({
            error: "Failed to generate AI advice",
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

module.exports = router;
