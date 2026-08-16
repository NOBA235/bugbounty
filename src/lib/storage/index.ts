
import type { UserStats, ChallengeAttempt } from "@/types/user";

const USER_KEY = "bugbounty_user";
const ATTEMPTS_KEY = "bugbounty_attempts";
const DAILY_KEY = "bugbounty_daily";

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch { return fallback; }
}
function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function getOrCreateUser(): UserStats {
  const existing = safeGet<UserStats | null>(USER_KEY, null);
  if (existing) return existing;
  const user: UserStats = {
    id: `local_${Date.now()}`,
    username: `hunter_${Math.floor(Math.random() * 9000 + 1000)}`,
    xp: 0, streak: 0, longestStreak: 0, bugsSolved: 0, bugsFailed: 0,
    totalSolveTime: 0, hintsUsed: 0, createdAt: new Date().toISOString(),
  };
  safeSet(USER_KEY, user);
  return user;
}
export function updateUser(partial: Partial<UserStats>): UserStats {
  const current = getOrCreateUser();
  const updated = { ...current, ...partial };
  safeSet(USER_KEY, updated);
  return updated;
}
export function getAttempts(): ChallengeAttempt[] {
  return safeGet<ChallengeAttempt[]>(ATTEMPTS_KEY, []);
}
export function addAttempt(attempt: ChallengeAttempt): void {
  const attempts = getAttempts();
  attempts.unshift(attempt);
  safeSet(ATTEMPTS_KEY, attempts.slice(0, 50));
}
export function getDailyChallengeId(): string | null {
  const data = safeGet<{ date: string; id: string } | null>(DAILY_KEY, null);
  const today = new Date().toISOString().slice(0, 10);
  if (data && data.date === today) return data.id;
  return null;
}
export function setDailyChallengeId(id: string): void {
  const today = new Date().toISOString().slice(0, 10);
  safeSet(DAILY_KEY, { date: today, id });
}
