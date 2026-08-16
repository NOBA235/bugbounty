import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini/client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const idx = typeof body.hintIndex === "number" ? body.hintIndex : 0;
    if (body.challenge?.hints?.[idx]) {
      return NextResponse.json({ hint: body.challenge.hints[idx], source: "challenge" });
    }
    if (!process.env.GEMINI_API_KEY) {
      const generic = [
        "Look carefully at variable scope and when values are captured.",
        "Consider whether the code mutates shared state or closes over a changing variable.",
        "Check async control flow — are you awaiting what you think you are?",
        "Compare expected behavior with what each line actually does.",
      ];
      return NextResponse.json({ hint: generic[Math.min(idx, generic.length - 1)], source: "fallback" });
    }
    const level = idx === 0 ? "High-level direction only." : idx === 1 ? "Name the core concept." : idx === 2 ? "Point to the pattern without code." : "Almost give it away, no fixed code.";
    const prompt = `Senior JS mentor. Socratic. Never reveal full solution. ${level}
Title: ${body.challenge?.title}
Code:\n${body.userCode || body.challenge?.starterCode}
One concise hint, no markdown.`;
    try {
      const text = await generateWithGemini(prompt);
      return NextResponse.json({ hint: text.trim().slice(0, 400), source: "gemini" });
    } catch {
      return NextResponse.json({ hint: "Re-read the reproduction steps carefully.", source: "fallback" });
    }
  } catch {
    return NextResponse.json({ error: "Mentor unavailable" }, { status: 500 });
  }
}
