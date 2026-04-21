const router = require('express').Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require('../middleware/auth');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function for sleeping (delay)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calls Gemini API with an exponential backoff retry strategy for transient errors (503, 429).
 */
async function generateContentWithRetry(model, prompt, maxRetries = 3) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(`Calling Gemini API (Attempt ${i + 1}/${maxRetries})...`);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (err) {
            lastError = err;
            const isRetryable = err.message?.includes("503") || 
                               err.message?.includes("Service Unavailable") || 
                               err.message?.includes("429") ||
                               err.message?.includes("Too Many Requests") ||
                               err.status === 503 ||
                               err.status === 429;

            if (isRetryable && i < maxRetries - 1) {
                const delay = Math.pow(2, i) * 1000 + (Math.random() * 1000); // 1s, 2s, 4s + jitter
                console.warn(`Gemini API busy (503/429). Retrying in ${Math.round(delay)}ms...`);
                await sleep(delay);
                continue;
            }
            throw err; // Not retryable or max retries reached
        }
    }
    throw lastError;
}

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

        // Using model specified in .env (defaulting to gemini-2.5-flash if not set)
        const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        const model = genAI.getGenerativeModel({ model: modelName });

        const skillsList = skills.map(s => `- ${s.name} (${s.level}%)`).join('\n');
        const missingSkillsList = (missingSkills || []).map(s => `- ${s}`).join('\n') || '- None identified';

        // ─────────────────────────────────────────────
        // SYSTEM PERSONA & PROMPT ASSEMBLY
        // ─────────────────────────────────────────────
        const persona = `You are CareerCoach AI — a friendly, experienced career mentor specialized in tech.`;
        
        const instructions = `
INSTRUCTIONS:
1. Answer only tech career questions.
2. Base advice on provided profile data.
3. Keep response between 130–160 words.
4. Formatting: Use plain section titles (e.g., 1. Career Direction:), plain hyphens for bullets, NO emojis, NO markdown bold.
5. End with exactly one "Career Tip:".
        `.trim();

        const profileContext = `
STUDENT PROFILE:
- Role: ${recommendedRole}
- Match: ${matchPercentage ?? 'N/A'}%
- Current Skills: ${skillsList}
- Missing Skills: ${missingSkillsList}
        `.trim();

        const outputFormat = `
Respond in EXACTLY this structure:
1. Career Direction: [One sentence path]
2. Top Skills to Learn Next: [Bulleted list with why]
3. Learning Resources: [Platform + search term]
4. Action Plan: [3 steps: start, practice, build]
Career Tip: [One final motivating sentence]
        `.trim();

        const prompt = `${persona}\n\n${instructions}\n\n${profileContext}\n\n${outputFormat}`;

        // Call the new resilient helper
        const advice = await generateContentWithRetry(model, prompt);
        
        console.log("Gemini Advice Generated Successfully.");
        res.json({ advice });

    } catch (err) {
        console.error("Gemini API Error Detail:", err);
        
        const isBusy = err.message?.includes("503") || err.message?.includes("Service Unavailable") || err.status === 503;
        const isQuota = err.message?.includes("429") || err.message?.includes("Too Many Requests") || err.status === 429;
        
        res.status(isBusy ? 503 : (isQuota ? 429 : 500)).json({
            error: isBusy ? "AI Server is currently very busy" : (isQuota ? "Rate limit reached" : "Failed to generate AI advice"),
            message: isBusy ? "We tried 3 times but the server is still overloaded. Please wait a minute and try again." : 
                     (isQuota ? "You have reached your API quota. Please try again later." : err.message),
            details: err.message
        });
    }
});

module.exports = router;
