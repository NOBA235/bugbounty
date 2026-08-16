"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Trophy,
  Clock,
  Target,
  ArrowRight,
  Zap,
  Bug,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getOrCreateUser, getAttempts } from "@/lib/storage";
import type { UserStats, ChallengeAttempt } from "@/types/user";
import { formatTime } from "@/lib/scoring";

function difficultyClasses(level: string) {
  const key = (level || "").toLowerCase();
  if (key === "easy") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-400";
  if (key === "hard") return "border-rose-400/30 bg-rose-400/10 text-rose-400";
  return "border-amber-400/30 bg-amber-400/10 text-amber-400"; // medium / default
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserStats | null>(null);
  const [attempts, setAttempts] = useState<ChallengeAttempt[]>([]);

  useEffect(() => {
    setUser(getOrCreateUser());
    setAttempts(getAttempts());
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="h-9 w-72 animate-pulse rounded-md bg-zinc-900" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg border border-zinc-900 bg-zinc-900/60" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const successRate =
    user.bugsSolved + user.bugsFailed > 0
      ? Math.round((user.bugsSolved / (user.bugsSolved + user.bugsFailed)) * 100)
      : 0;
  const avgTime =
    user.bugsSolved > 0
      ? Math.round(user.totalSolveTime / user.bugsSolved / 1000)
      : 0;

  const stats = [
    { label: "Bugs Solved", value: user.bugsSolved, icon: Bug },
    { label: "Success Rate", value: `${successRate}%`, icon: Trophy },
    { label: "Avg Solve Time", value: avgTime ? formatTime(avgTime) : "—", icon: Clock },
    { label: "Hints Used", value: user.hintsUsed, icon: Target },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Dashboard
            </div>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              Welcome back, <span className="text-amber-400">{user.username}</span>
            </h1>
            <p className="mt-1 text-sm text-zinc-500">Ready for the next bounty?</p>
          </div>
          <Button
            asChild
            className="h-10 gap-2 rounded-md bg-amber-400 px-5 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
          >
            <Link href="/hunt">
              Start Quick Hunt
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </header>

        {/* Stat strip */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-zinc-700"
            >
              <div className="flex items-center gap-2 text-zinc-500">
                <s.icon className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">{s.label}</span>
              </div>
              <div className="mt-2 font-mono text-2xl font-semibold tabular-nums">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Continue hunting + Your run */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="rounded-lg border-zinc-800 bg-zinc-900/60 lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <Target className="h-3.5 w-3.5" />
                Next Challenge
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-xs font-semibold text-amber-400">
                  MEDIUM
                </span>
                <span className="text-sm text-zinc-400">Closures</span>
                <span className="flex items-center gap-1 text-sm text-zinc-500">
                  <Clock className="h-3.5 w-3.5" /> ~5 min
                </span>
                <span className="ml-auto font-mono text-sm font-semibold text-amber-400">
                  +300 XP
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                Jump into a Quick Hunt. A realistic bug is planted; fix it before the timer runs out.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  asChild
                  className="h-9 rounded-md bg-amber-400 px-5 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
                >
                  <Link href="/hunt?difficulty=medium">Hunt Medium</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-9 rounded-md border-zinc-700 bg-transparent px-4 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800/60"
                >
                  <Link href="/hunt?difficulty=easy">Easy Warm-up</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-9 rounded-md border-zinc-700 bg-transparent px-4 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800/60"
                >
                  <Link href="/hunt?mode=daily">Daily Bounty</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-zinc-800 bg-zinc-900/60">
            <CardContent className="flex flex-col gap-5 p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Your Run
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 text-amber-400">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-mono text-2xl font-semibold tabular-nums">
                    {user.xp.toLocaleString()}
                  </div>
                  <div className="text-xs text-zinc-500">Total XP</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 text-orange-400">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-mono text-2xl font-semibold tabular-nums">
                    {user.streak}x
                  </div>
                  <div className="text-xs text-zinc-500">Streak · best {user.longestStreak}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent hunts */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">Recent Hunts</h2>

          {attempts.length === 0 ? (
            <div className="flex flex-col items-center rounded-lg border border-zinc-800 bg-zinc-900/60 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950">
                <Bug className="h-6 w-6 text-zinc-600" />
              </div>
              <p className="text-base font-semibold">No hunts yet</p>
              <p className="mt-1 text-sm text-zinc-500">Your first bounty is waiting.</p>
              <Button
                asChild
                className="mt-6 h-9 rounded-md bg-amber-400 px-5 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
              >
                <Link href="/hunt">Start Hunting</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/60 text-xs uppercase tracking-wide text-zinc-500">
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Challenge</th>
                    <th className="px-4 py-3 font-medium">Difficulty</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 text-right font-medium">XP</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.slice(0, 8).map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-zinc-800/60 bg-zinc-950/40 transition-colors last:border-0 hover:bg-zinc-900/60"
                    >
                      <td className="px-4 py-3">
                        {a.success ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Solved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-rose-400">
                            <XCircle className="h-4 w-4" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-zinc-100">{a.title}</div>
                        <div className="text-xs text-zinc-500">{a.topic}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded border px-2 py-0.5 text-xs font-semibold ${difficultyClasses(
                            a.difficulty
                          )}`}
                        >
                          {a.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono tabular-nums text-zinc-400">
                        {formatTime(a.solveTime)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-mono font-semibold tabular-nums ${
                          a.success ? "text-amber-400" : "text-zinc-600"
                        }`}
                      >
                        {a.success ? `+${a.score}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}