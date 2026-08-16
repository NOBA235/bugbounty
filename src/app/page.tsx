"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bug, ArrowRight, Code2, Timer, Brain, Trophy, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const topics = [
  "Async & Promises",
  "Arrays & Methods",
  "Closures",
  "Objects",
  "DOM",
  "Functions",
  "Event Loop",
  "JavaScript Fundamentals",
];

const steps = [
  { icon: Bug, title: "Receive the Bug", desc: "Get a realistic bug report and intentionally broken JavaScript." },
  { icon: Code2, title: "Investigate the Code", desc: "Read the report, open Monaco, and hunt the root cause." },
  { icon: Target, title: "Fix & Test", desc: "Run hidden tests in a secure sandbox until green." },
  { icon: Trophy, title: "Claim the Bounty", desc: "Submit before the timer, earn XP, keep your streak." },
];

const stats = [
  { label: "Bugs Fixed", value: "12,840+", icon: Bug },
  { label: "Total XP", value: "2.4M+", icon: Zap },
  { label: "Best Streak", value: "47", icon: Timer },
  { label: "Accuracy", value: "78%", icon: Brain },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-50 antialiased selection:bg-amber-400/20 selection:text-white">
      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 md:pt-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-400">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            Competitive JavaScript debugging arena
            <span className="ml-1 hidden h-1.5 w-1.5 rounded-full bg-amber-400 sm:inline-block" />
          </div>

          <h1 className="mx-auto max-w-4xl text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Ship fixes. Hunt bugs. <span className="text-amber-400">Level up JavaScript.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-zinc-400 md:text-xl">
            A competitive debugging arena where every broken function is a bounty.
            Sharpen your skills, earn XP, and climb the leaderboard.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 w-full gap-2 rounded-md bg-amber-400 px-8 text-base font-semibold text-zinc-950 hover:bg-amber-300 sm:w-auto"
            >
              <Link href="/dashboard">
                Start Hunting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 w-full rounded-md border-zinc-700 bg-transparent px-8 text-base font-medium text-zinc-300 hover:border-zinc-500 hover:bg-zinc-900 sm:w-auto"
            >
              <a href="#how-it-works">View How It Works</a>
            </Button>
          </div>
        </motion.div>

        {/* Code mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 border-b border-zinc-800 px-5 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="ml-3 font-mono text-xs text-zinc-500">BUG #2041 · HARD · 01:42</span>
              <span className="ml-auto rounded border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-xs font-semibold text-amber-400">
                +420 XP
              </span>
            </div>
            <div className="grid md:grid-cols-[1.4fr_1fr]">
              <pre className="max-h-[420px] overflow-x-auto bg-zinc-950 p-5 font-mono text-[13px] leading-relaxed text-zinc-300 md:max-h-none">
                <code>{`function createCallbacks(n) {
  const callbacks = [];
  for (var i = 0; i < n; i++) {
    callbacks.push(function () {
      return i;  // ← bug lives here
    });
  }
  return callbacks;
}`}</code>
              </pre>
              <div className="border-t border-zinc-800 bg-zinc-900 p-5 md:border-l md:border-t-0">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Bug Report
                </div>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Each callback returns the same value instead of its own index.
                  Closures capture a shared loop variable.
                </p>
                <div className="mt-5 space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15 text-[10px]">
                      ✓
                    </span>
                    Basic length 3
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15 text-[10px]">
                      ✓
                    </span>
                    Length 1
                  </div>
                  <div className="flex items-center gap-2 text-rose-400">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-rose-500/15 text-[10px]">
                      ✕
                    </span>
                    Length 5
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative border-t border-zinc-800 bg-zinc-900/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Four steps from bug report to bounty. No setup, no fluff — just pure debugging.
            </p>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 transition-colors hover:border-zinc-700"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 text-amber-400">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Step {i + 1}
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Challenge Categories</h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Master the full spectrum of modern JavaScript, one bug at a time.
          </p>
          <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-2">
            {topics.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="rounded-md border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-amber-400/40 hover:text-amber-300"
              >
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-800 bg-zinc-900/40 py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <s.icon className="mx-auto mb-3 h-5 w-5 text-amber-400" />
              <div className="font-mono text-3xl font-semibold tabular-nums sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm font-medium text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 text-center">
        <h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Ready to claim your first bounty?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-zinc-400">
          No account required. Jump straight into a challenge and start debugging.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-10 h-12 gap-2 rounded-md bg-amber-400 px-10 text-base font-semibold text-zinc-950 hover:bg-amber-300"
        >
          <Link href="/dashboard">
            Start Hunting
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          bugbounty.ai · Built for the modern JavaScript engineer
        </div>
      </footer>
    </div>
  );
}