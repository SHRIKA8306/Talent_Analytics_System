const router = require('express').Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require('../middleware/auth');

// Initialize Gemini API
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

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Format skills for prompt
        const skillsList = skills.map(s => `* ${s.name} (${s.level}%)`).join('\n');
        const missingSkillsList = (missingSkills || []).map(s => `* ${s}`).join('\n');

        const prompt = `
            Analyze this student's technical profile and provide actionable career guidance in the following structured format:

            1. Recommended Direction:
            - Suggest the best career path based on current strengths (${skillsList}).

            2. What You Should Learn Next:
            - List top 2–3 skills to learn in priority order for the ${recommendedRole} role.

            3. Learning Resources:
            - Suggest platforms (YouTube, Coursera, Udemy, free resources).
            - Mention what to search or learn.

            4. Action Plan:
            - Step 1: What to start with.
            - Step 2: What to practice.
            - Step 3: What to build.

            5. Career Tip:
            - Give a short practical suggestion.

            CONSTRAINTS:
            - IMPORTANT: Do NOT use markdown bolding (like **1. Recommended Direction:**) for the section titles. Use plain text like "1. Recommended Direction:".
            - Keep the response clear and structured.
            - Length: Around 120–150 words.
            - Use simple and practical language.
        `;

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
