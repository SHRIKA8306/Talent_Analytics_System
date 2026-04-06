const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log("Checking available models for your API key...");
    // We use the v1beta endpoint to list models as it's more comprehensive for experimental models
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    
    if (data.error) {
      console.error("API Error:", data.error.message);
      return;
    }

    console.log("\n--- Available Models ---");
    data.models.forEach(model => {
      console.log(`- ${model.name.replace('models/', '')} (Supported methods: ${model.supportedGenerationMethods.join(', ')})`);
    });
    console.log("------------------------\n");
    
    const has20 = data.models.some(m => m.name.includes('gemini-2.0-flash-exp'));
    if (has20) {
      console.log("SUCCESS: 'gemini-2.0-flash-exp' is available for your key.");
    } else {
      console.warn("WARNING: 'gemini-2.0-flash-exp' NOT found in the list.");
    }
  } catch (err) {
    console.error("Failed to fetch models:", err.message);
  }
}

listModels();
