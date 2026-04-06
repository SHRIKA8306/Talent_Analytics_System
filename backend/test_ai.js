const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGeneration() {
  try {
    console.log("Testing AI generation with 'gemini-2.0-flash'...");
    
    // Using the same configuration as the main app
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }, { apiVersion: 'v1' });
    
    const prompt = "Write a one-sentence career tip for a software engineer.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("\n--- SUCCESS! ---");
    console.log("AI Response:", text.trim());
    console.log("----------------\n");
    
  } catch (err) {
    console.error("\n--- FAILURE! ---");
    console.error("Error Detail:", err.message);
    if (err.stack) {
        // Log stack trace if available for more detail
        // console.error(err.stack);
    }
    console.log("----------------\n");
  }
}

testGeneration();
