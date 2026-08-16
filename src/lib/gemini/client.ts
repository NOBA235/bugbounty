import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGeminiModel(modelName = "gemini-2.0-flash") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured");
  return new GoogleGenerativeAI(key).getGenerativeModel({ model: modelName });
}

export async function generateWithGemini(prompt: string, modelName = "gemini-2.0-flash"): Promise<string> {
  const model = getGeminiModel(modelName);
  const result = await model.generateContent(prompt);
  return result.response.text();
}
