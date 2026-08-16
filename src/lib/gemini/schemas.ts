import { z } from "zod";

export const TestCaseSchema = z.object({
  name: z.string().optional(),
  input: z.unknown(),
  expected: z.unknown(),
});

export const ChallengeSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  topic: z.string(),
  difficulty: z.enum(["easy", "medium", "hard", "expert"]),
  starterCode: z.string().min(10),
  solution: z.string().min(10),
  hints: z.array(z.string()).min(1).max(5),
  tests: z.array(TestCaseSchema).min(2),
  reproduction: z.string().optional(),
  expectedBehavior: z.string().optional(),
});

export const ReviewSchema = z.object({
  summary: z.string(),
  qualityScore: z.number().min(0).max(100),
  complexity: z.string(),
  spaceComplexity: z.string().optional(),
  styleBonus: z.number().min(0).max(80),
  strengths: z.array(z.string()),
  improvement: z.string(),
});
