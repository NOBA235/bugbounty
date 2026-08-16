
import type { Difficulty, ScoreBreakdown } from "@/types/challenge";

const BASE_XP: Record<Difficulty, number> = { easy: 150, medium: 300, hard: 500, expert: 800 };
const TIME_LIMITS: Record<Difficulty, number> = { easy: 180, medium: 300, hard: 420, expert: 600 };
const HINT_COSTS = [10, 20, 35, 50];

export function getBaseXp(d: Difficulty) { return BASE_XP[d] ?? 300; }
export function getTimeLimit(d: Difficulty) { return TIME_LIMITS[d] ?? 300; }
export function getHintCost(i: number) { return HINT_COSTS[Math.min(i, HINT_COSTS.length - 1)] ?? 50; }
export function getStreakMultiplier(streak: number): number {
  if (streak <= 1) return 0;
  if (streak === 2) return 30;
  if (streak === 3) return 60;
  if (streak === 4) return 100;
  return 150 + (streak - 5) * 20;
}
export function calculateScore(p: {
  difficulty: Difficulty; remainingSeconds: number; streak: number;
  hintsUsed: number; styleBonus: number;
}): ScoreBreakdown {
  const baseXp = getBaseXp(p.difficulty);
  const timeBonus = Math.max(0, Math.floor(p.remainingSeconds * 0.6));
  const streakMultiplier = getStreakMultiplier(p.streak + 1);
  let hintPenalty = 0;
  for (let i = 0; i < p.hintsUsed; i++) hintPenalty += getHintCost(i);
  const styleBonus = Math.max(0, Math.min(p.styleBonus, 80));
  const total = Math.max(50, baseXp + timeBonus + streakMultiplier - hintPenalty + styleBonus);
  return { baseXp, timeBonus, streakMultiplier, hintPenalty, styleBonus, total };
}
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
