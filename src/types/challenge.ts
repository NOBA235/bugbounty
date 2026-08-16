export type Difficulty = "easy" | "medium" | "hard" | "expert";
export type Topic = "Promises" | "Array Methods" | "Closures" | "Objects" | "DOM" | "Functions" | "Event Loop" | "JavaScript Fundamentals";

export interface TestCase {
  name?: string;
  input: unknown;
  expected: unknown;
}

export interface Challenge {
  id: string;
  title: string;
  topic: Topic | string;
  difficulty: Difficulty;
  description: string;
  reproduction?: string;
  expectedBehavior?: string;
  starterCode: string;
  solution: string;
  tests: TestCase[];
  hints: string[];
  timeLimit?: number;
  baseXp?: number;
}

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  executionTime?: number;
}

export interface ExecutionResult {
  success: boolean;
  results: TestResult[];
  consoleOutput: string[];
  error?: string;
  totalTime: number;
  passedCount: number;
  totalCount: number;
}

export interface ReviewResult {
  summary: string;
  qualityScore: number;
  complexity: string;
  spaceComplexity?: string;
  styleBonus: number;
  strengths: string[];
  improvement: string;
}

export interface ScoreBreakdown {
  baseXp: number;
  timeBonus: number;
  streakMultiplier: number;
  hintPenalty: number;
  styleBonus: number;
  total: number;
}
