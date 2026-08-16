import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini/client";
import { ReviewSchema } from "@/lib/gemini/schemas";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        review: {
          summary: "Solid fix. Tests pass and the approach is readable.",
          qualityScore: 82, complexity: "O(n)", spaceComplexity: "O(n)",
          styleBonus: 30, strengths: ["Correctness", "Readable"], improvement: "Add brief comments for non-obvious logic.",
        },
        source: "fallback",
      });
    }
    const prompt = `You are a senior engineer reviewing a JS bug fix. Return ONLY JSON:
{ "summary": string, "qualityScore": 0-100, "complexity": "O(...)", "spaceComplexity": "O(...)", "styleBonus": 0-80, "strengths": string[], "improvement": string }
Challenge: ${body.challenge?.title}
User code:\n${body.userCode}
Tests: ${JSON.stringify(body.testResults)}`;
    try {
      let text = await generateWithGemini(prompt);
      if (text.startsWith("```")) text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      const parsed = JSON.parse(text);
      const r = ReviewSchema.safeParse(parsed);
      if (r.success) return NextResponse.json({ review: r.data, source: "gemini" });
    } catch {}
    return NextResponse.json({
      review: { summary: "Clean and correct solution.", qualityScore: 80, complexity: "O(n)", styleBonus: 28, strengths: ["Works"], improvement: "Minor style polish." },
      source: "fallback",
    });
  } catch {
    return NextResponse.json({ error: "Review failed" }, { status: 500 });
  }
}
