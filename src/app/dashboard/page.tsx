"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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

  useEffect(() => {
    setUser(getOrCreateUser());
    setAttempts(getAttempts());
  }, []);

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="h-40 animate-pulse rounded-xl bg-white/5" />
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
    <div className="relative min-h-screen overflow-hidden bg-[#08080a] text-zinc-50 antialiased selection:bg-violet-500/30 selection:text-white">
      {/* Background grid + glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse 70% 50% at 50% 0%, black 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 0%, black 20%, transparent 70%)",
          }}
        />
        <div className="absolute left-1/2 top-[-15rem] h-[35rem] w-[70rem] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-fuchsia-500/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {user.username}
              </span>
            </h1>
            <p className="mt-2 text-lg text-zinc-400">Ready for the next bounty?</p>
          </div>
          <Button
            asChild
            size="lg"
            className="group h-12 gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 text-base font-semibold shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/40"
          >
            <Link href="/hunt">
              Start Quick Hunt
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        {/* Top Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-6 lg:grid-cols-3"
        >
          {/* Continue Hunting Card */}
          <Card className="relative lg:col-span-2 overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-[#0d0d10] to-violet-950/20 shadow-xl shadow-violet-500/10 backdrop-blur-sm transition-all duration-300 hover:border-violet-400/40 hover:shadow-violet-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold uppercase tracking-wider text-zinc-400">
                <Target className="h-4 w-4 text-violet-400" />
                Continue Hunting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="medium" className="px-3 py-1 text-sm font-medium ring-1 ring-amber-400/30">
                  MEDIUM
                </Badge>
                <span className="text-sm text-zinc-400">Closures</span>
                <span className="flex items-center gap-1 text-sm text-zinc-400">
                  <Clock className="h-3.5 w-3.5" /> ~5 min
                </span>
                <span className="font-mono text-sm font-semibold text-violet-300">+300 XP</span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-400">
                Jump into a Quick Hunt. A realistic bug is planted; fix it before the timer runs out.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 font-medium shadow-md shadow-violet-500/20 transition hover:scale-[1.03] hover:shadow-lg"
                >
                  <Link href="/hunt?difficulty=medium">Hunt Medium</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-zinc-700 bg-white/5 font-medium backdrop-blur-sm transition hover:border-zinc-500 hover:bg-white/10"
                >
                  <Link href="/hunt?difficulty=easy">Easy Warm-up</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-zinc-700 bg-white/5 font-medium backdrop-blur-sm transition hover:border-zinc-500 hover:bg-white/10"
                >
                  <Link href="/hunt?mode=daily">Daily Bounty</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Your Run Card */}
          <Card className="rounded-2xl border border-white/10 bg-white/[0.03] shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold uppercase tracking-wider text-zinc-400">
                Your Run
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 ring-1 ring-white/10">
                  <Zap className="h-7 w-7 text-violet-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{user.xp.toLocaleString()}</div>
                  <div className="text-sm text-zinc-500">Total XP</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 ring-1 ring-white/10">
                  <Flame className="h-7 w-7 text-amber-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{user.streak}x</div>
                  <div className="text-sm text-zinc-500">Streak · best {user.longestStreak}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <Card
              key={s.label}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-violet-500/10"
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300 ring-1 ring-white/10 transition group-hover:bg-violet-500/25">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold">{s.value}</div>
                  <div className="text-sm text-zinc-500">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Recent Hunts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <h2 className="mb-5 text-2xl font-bold tracking-tight">Recent Hunts</h2>

          {attempts.length === 0 ? (
            <Card className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
              <CardContent className="flex flex-col items-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/80">
                  <Bug className="h-8 w-8 text-zinc-500" />
                </div>
                <p className="text-lg font-semibold">No hunts yet</p>
                <p className="mt-1 text-sm text-zinc-400">Your first bounty is waiting.</p>
                <Button
                  asChild
                  className="mt-6 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 font-medium shadow-md shadow-violet-500/20 transition hover:scale-[1.03]"
                >
                  <Link href="/hunt">Start Hunting</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {attempts.slice(0, 8).map((a) => (
                <Card
                  key={a.id}
                  className="group rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          a.success
                            ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{a.title}</div>
                        <div className="text-xs text-zinc-500">
                          {a.topic} · {a.difficulty}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 text-sm">
                      <span className="text-zinc-400">{formatTime(a.solveTime)}</span>
                      <span
                        className={`font-mono font-semibold ${
                          a.success ? "text-violet-300" : "text-zinc-600"
                        }`}
                      >
                        {a.success ? `+${a.score}` : "—"} XP
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}