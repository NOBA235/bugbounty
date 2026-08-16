"use client";
import { useEffect, useState } from "react";
import { Bug, Flame, Trophy, Clock, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrCreateUser, getAttempts } from "@/lib/storage";
import type { UserStats, ChallengeAttempt } from "@/types/user";
import { formatTime } from "@/lib/scoring";

export default function ProfilePage() {
  const [user, setUser] = useState<UserStats | null>(null);
  const [attempts, setAttempts] = useState<ChallengeAttempt[]>([]);
  useEffect(() => { setUser(getOrCreateUser()); setAttempts(getAttempts()); }, []);
  if (!user) return null;

  const successRate = user.bugsSolved + user.bugsFailed > 0
    ? Math.round((user.bugsSolved / (user.bugsSolved + user.bugsFailed)) * 100) : 0;
  const avgTime = user.bugsSolved > 0 ? Math.round(user.totalSolveTime / user.bugsSolved / 1000) : 0;
  const bestScore = attempts.reduce((m, a) => Math.max(m, a.score), 0);
  const topicCounts: Record<string, number> = {};
  attempts.forEach((a) => { if (a.success) topicCounts[a.topic] = (topicCounts[a.topic] || 0) + 1; });
  const favoriteTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20 text-xl font-bold text-violet-300">
          {user.username.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{user.username}</h1>
          <p className="text-sm text-zinc-400">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total XP", value: user.xp.toLocaleString(), icon: Zap },
          { label: "Bugs Solved", value: user.bugsSolved, icon: Bug },
          { label: "Success Rate", value: `${successRate}%`, icon: Trophy },
          { label: "Avg Solve Time", value: avgTime ? formatTime(avgTime) : "—", icon: Clock },
          { label: "Longest Streak", value: `${user.longestStreak}x`, icon: Flame },
          { label: "Best Score", value: bestScore || "—", icon: Target },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <s.icon className="h-5 w-5 text-violet-400" />
              <div><div className="text-lg font-semibold">{s.value}</div><div className="text-xs text-zinc-500">{s.label}</div></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-zinc-500">Favorite topic</span><span>{favoriteTopic}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">Hints used</span><span>{user.hintsUsed}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">Failed attempts</span><span>{user.bugsFailed}</span></div>
        </CardContent>
      </Card>
    </div>
  );
}
