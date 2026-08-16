"use client";
import { useEffect, useState } from "react";
import { Flame, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getOrCreateUser } from "@/lib/storage";
import type { UserStats, LeaderboardEntry } from "@/types/user";

const DEMO: LeaderboardEntry[] = [
  { rank: 1, username: "asyncWizard", xp: 12840, streak: 14, bugsSolved: 89 },
  { rank: 2, username: "bugHunter", xp: 11920, streak: 9, bugsSolved: 76 },
  { rank: 3, username: "closureKing", xp: 10420, streak: 7, bugsSolved: 71 },
  { rank: 4, username: "promiseQueen", xp: 9850, streak: 5, bugsSolved: 64 },
  { rank: 5, username: "eventLoopDev", xp: 8720, streak: 11, bugsSolved: 58 },
  { rank: 6, username: "mapFilterReduce", xp: 7650, streak: 3, bugsSolved: 52 },
  { rank: 7, username: "thisBinder", xp: 6890, streak: 6, bugsSolved: 47 },
  { rank: 8, username: "hoistMaster", xp: 6120, streak: 2, bugsSolved: 41 },
];

export default function LeaderboardPage() {
  const [user, setUser] = useState<UserStats | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>(DEMO);

  useEffect(() => {
    const u = getOrCreateUser();
    setUser(u);
    const merged = [...DEMO];
    const existing = merged.findIndex((e) => e.username === u.username);
    if (existing >= 0) {
      merged[existing] = { ...merged[existing], xp: Math.max(merged[existing].xp, u.xp), streak: u.streak, bugsSolved: u.bugsSolved, isCurrentUser: true };
    } else {
      merged.push({ rank: 0, username: u.username, xp: u.xp, streak: u.streak, bugsSolved: u.bugsSolved, isCurrentUser: true });
    }
    merged.sort((a, b) => b.xp - a.xp);
    merged.forEach((e, i) => { e.rank = i + 1; });
    setEntries(merged.slice(0, 20));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <Trophy className="h-7 w-7 text-violet-400" />
        <div>
          <h1 className="text-2xl font-semibold">Leaderboard</h1>
          <p className="text-sm text-zinc-400">Top bug hunters by XP</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-[48px_1fr_80px_72px] gap-2 border-b border-zinc-800 px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <span>#</span><span>Developer</span><span className="text-right">XP</span><span className="text-right">Streak</span>
          </div>
          {entries.map((e) => (
            <div key={e.username} className={`grid grid-cols-[48px_1fr_80px_72px] gap-2 border-b border-zinc-800/50 px-4 py-3 text-sm ${e.isCurrentUser ? "bg-violet-500/10" : ""}`}>
              <span className="font-mono text-zinc-500">{e.rank}</span>
              <span className={e.isCurrentUser ? "font-semibold text-violet-300" : ""}>{e.username}{e.isCurrentUser ? " (you)" : ""}</span>
              <span className="text-right font-mono">{e.xp.toLocaleString()}</span>
              <span className="flex items-center justify-end gap-1 text-amber-400"><Flame className="h-3.5 w-3.5" />{e.streak}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
