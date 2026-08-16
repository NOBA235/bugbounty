import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini/client";
import { ChallengeSchema } from "@/lib/gemini/schemas";
import { getFallbackByTopic } from "@/lib/challenges/fallbacks";

export const runtime = "nodejs";

const SYSTEM = `You are an expert JavaScript challenge designer for bugbounty.ai.
Generate a realistic solvable debugging challenge with exactly one primary conceptual bug.
Return ONLY valid JSON (no markdown fences):
{ "title": string, "description": string, "topic": string, "difficulty": "easy"|"medium"|"hard"|"expert",
  "starterCode": string, "solution": string, "hints": string[], "tests": [{ "name": string, "input": any, "expected": any }],
  "reproduction": string, "expectedBehavior": string }
Hints must be Socratic. Never give full solution in a hint.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic = (body.topic as string) || "JavaScript Fundamentals";
    const difficulty = (body.difficulty as string) || "medium";

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ challenge: getFallbackByTopic(topic, difficulty), source: "fallback" });
    }

    let text = "";
    try {
      text = await generateWithGemini(`${SYSTEM}\n\nCreate a ${difficulty} challenge about "${topic}".`);
    } catch {
      return NextResponse.json({ challenge: getFallbackByTopic(topic, difficulty), source: "fallback" });
    }

    let cleaned = text.trim();
    if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

    try {
      const parsed = JSON.parse(cleaned);
      const result = ChallengeSchema.safeParse(parsed);
      if (result.success) {
        const d = result.data.difficulty;
        return NextResponse.json({
          challenge: {
            ...result.data,
            id: `ai-${Date.now()}`,
            timeLimit: d === "easy" ? 180 : d === "medium" ? 300 : d === "hard" ? 420 : 600,
            baseXp: d === "easy" ? 150 : d === "medium" ? 300 : d === "hard" ? 500 : 800,
          },
          source: "gemini",
        });
      }
    } catch {}

    return NextResponse.json({ challenge: getFallbackByTopic(topic, difficulty), source: "fallback" });
  } catch {
    return NextResponse.json({ challenge: getFallbackByTopic("Closures", "easy"), source: "fallback" });
  }
}
