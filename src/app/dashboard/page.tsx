"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Trophy, Clock, Target, ArrowRight, Zap, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOrCreateUser, getAttempts } from "@/lib/storage";
import type { UserStats, ChallengeAttempt } from "@/types/user";
import { formatTime } from "@/lib/scoring";

export default function DashboardPage() {
  const [user, setUser] = useState<UserStats | null>(null);
  const [attempts, setAttempts] = useState<ChallengeAttempt[]>([]);
  useEffect(() => { setUser(getOrCreateUser()); setAttempts(getAttempts()); }, []);
  if (!user) return <div className="mx-auto max-w-6xl px-4 py-12"><div className="h-40 animate-pulse rounded-xl bg-zinc-800" /></div>;

  const successRate = user.bugsSolved + user.bugsFailed > 0
    ? Math.round((user.bugsSolved / (user.bugsSolved + user.bugsFailed)) * 100) : 0;
  const avgTime = user.bugsSolved > 0 ? Math.round(user.totalSolveTime / user.bugsSolved / 1000) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {user.username}</h1>
          <p className="text-zinc-400">Ready for the next bounty?</p>
        </div>
        <Button asChild className="gap-2"><Link href="/hunt">Start Quick Hunt <ArrowRight className="h-4 w-4" /></Link></Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-violet-500/30 bg-gradient-to-br from-zinc-900 to-violet-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-zinc-400"><Target className="h-4 w-4" /> Continue Hunting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="medium">MEDIUM</Badge>
              <span className="text-sm text-zinc-400">Closures</span>
              <span className="flex items-center gap-1 text-sm text-zinc-400"><Clock className="h-3.5 w-3.5" /> ~5 min</span>
              <span className="font-mono text-sm text-violet-400">+300 XP</span>
            </div>
            <p className="text-sm text-zinc-400">Jump into a Quick Hunt. A realistic bug is planted; fix it before the timer runs out.</p>
            <div className="flex flex-wrap gap-2">
              <Button asChild><Link href="/hunt?difficulty=medium">Hunt Medium</Link></Button>
              <Button asChild variant="outline"><Link href="/hunt?difficulty=easy">Easy Warm-up</Link></Button>
              <Button asChild variant="outline"><Link href="/hunt?mode=daily">Daily Bounty</Link></Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base text-zinc-400">Your Run</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15"><Zap className="h-6 w-6 text-violet-400" /></div>
              <div><div className="text-2xl font-bold">{user.xp.toLocaleString()}</div><div className="text-xs text-zinc-500">Total XP</div></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15"><Flame className="h-6 w-6 text-amber-400" /></div>
              <div><div className="text-2xl font-bold">{user.streak}x</div><div className="text-xs text-zinc-500">Streak · best {user.longestStreak}</div></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Bugs Solved", value: user.bugsSolved, icon: Bug },
          { label: "Success Rate", value: `${successRate}%`, icon: Trophy },
          { label: "Avg Solve Time", value: avgTime ? formatTime(avgTime) : "—", icon: Clock },
          { label: "Hints Used", value: user.hintsUsed, icon: Target },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <s.icon className="h-5 w-5 text-zinc-500" />
              <div><div className="text-lg font-semibold">{s.value}</div><div className="text-xs text-zinc-500">{s.label}</div></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Recent Hunts</h2>
        {attempts.length === 0 ? (
          <Card><CardContent className="flex flex-col items-center py-12 text-center">
            <Bug className="mb-3 h-10 w-10 text-zinc-600" />
            <p className="font-medium">No hunts yet</p>
            <p className="mt-1 text-sm text-zinc-400">Your first bounty is waiting.</p>
            <Button asChild className="mt-4"><Link href="/hunt">Start Hunting</Link></Button>
          </CardContent></Card>
        ) : (
          <div className="space-y-2">
            {attempts.slice(0, 8).map((a) => (
              <Card key={a.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${a.success ? "bg-emerald-500" : "bg-red-500"}`} />
                    <div><div className="font-medium">{a.title}</div><div className="text-xs text-zinc-500">{a.topic} · {a.difficulty}</div></div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-zinc-500">{formatTime(a.solveTime)}</span>
                    <span className="font-mono text-violet-400">{a.success ? `+${a.score}` : "—"} XP</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
