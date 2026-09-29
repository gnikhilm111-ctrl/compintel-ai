import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk';

async function testGroqCompletion() {
  const apiKey = process.env.GROQ_API_KEY;
  const groq = new Groq({ apiKey });

  const modelsToTest = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];

  for (const model of modelsToTest) {
    try {
      console.log(`Testing model: "${model}"...`);
      const res = await groq.chat.completions.create({
        model,
        messages: [{ role: 'user', content: 'Hello! State your model name.' }],
        max_tokens: 50
      });
      console.log(`SUCCESS [${model}]:`, res.choices[0]?.message?.content);
      return model;
    } catch (err) {
      console.log(`FAILED [${model}]:`, err.message);
    }
  }
}

testGroqCompletion().catch(console.error);
