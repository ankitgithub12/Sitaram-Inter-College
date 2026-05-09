const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './server/.env' });

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // The SDK doesn't have a direct listModels method on the genAI object in all versions, 
    // but we can try to hit the endpoint or just test a few names.
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'];
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        await model.generateContent("test");
        console.log(`✅ Model ${m} is available`);
      } catch (e) {
        console.log(`❌ Model ${m} failed: ${e.message}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();
