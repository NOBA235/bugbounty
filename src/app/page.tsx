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
    <div className="relative min-h-screen overflow-hidden bg-[#08080a] text-zinc-50 antialiased selection:bg-violet-500/30 selection:text-white">
      {/* Background grid + glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 70%)",
          }}
        />
        <div className="absolute left-1/2 top-[-20rem] h-[40rem] w-[80rem] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute left-1/3 top-40 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 md:pt-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-sm transition hover:border-violet-400/40 hover:bg-violet-500/10">
            <Zap className="h-3.5 w-3.5 text-violet-400" />
            Competitive JavaScript debugging arena
            <span className="ml-1 hidden h-1.5 w-1.5 rounded-full bg-violet-400 sm:inline-block" />
          </div>

          <h1 className="mx-auto max-w-4xl text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Ship fixes. Hunt bugs.{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
              Level up JavaScript.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-zinc-400 md:text-xl">
            A competitive debugging arena where every broken function is a bounty.
            Sharpen your skills, earn XP, and climb the leaderboard.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <Button
              asChild
              size="lg"
              className="group h-13 w-full gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 text-base font-semibold shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/40 sm:w-auto"
            >
              <Link href="/dashboard">
                Start Hunting
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-13 w-full rounded-full border-zinc-700 bg-white/5 px-8 text-base font-medium backdrop-blur-sm transition-all duration-300 hover:border-zinc-500 hover:bg-white/10 sm:w-auto"
            >
              <a href="#how-it-works">View How It Works</a>
            </Button>
          </div>
        </motion.div>

        {/* Code mockup */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-500/20 via-fuchsia-500/10 to-violet-500/20 blur-xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d10]/90 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="ml-3 font-mono text-xs text-zinc-500">BUG #2041 · HARD · 01:42</span>
              <span className="ml-auto rounded-full bg-violet-500/15 px-3 py-1 font-mono text-xs font-semibold text-violet-300">
                +420 XP
              </span>
            </div>
            <div className="grid md:grid-cols-[1.4fr_1fr]">
              <pre className="max-h-[420px] overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-zinc-300 md:max-h-none">
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
              <div className="border-t border-white/10 bg-white/[0.02] p-5 md:border-l md:border-t-0">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Bug Report
                </div>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Each callback returns the same value instead of its own index.
                  Closures capture a shared loop variable.
                </p>
                <div className="mt-5 space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px]">✓</span>
                    Basic length 3
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px]">✓</span>
                    Length 1
                  </div>
                  <div className="flex items-center gap-2 text-red-400">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500/20 text-[10px]">✕</span>
                    Length 5
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative border-t border-white/10 bg-white/[0.02] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Four steps from bug report to bounty. No setup, no fluff — just pure debugging.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-violet-500/10"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-300 ring-1 ring-white/10 transition-all duration-300 group-hover:from-violet-500/30 group-hover:to-fuchsia-500/30">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Step {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Challenge Categories
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Master the full spectrum of modern JavaScript, one bug at a time.
          </p>
          <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3">
            {topics.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="px-5 py-2 text-sm font-medium text-zinc-200 ring-1 ring-white/10 transition-all duration-300 hover:bg-violet-500/15 hover:text-violet-200 hover:ring-violet-400/30"
              >
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <s.icon className="mx-auto mb-3 h-6 w-6 text-violet-400" />
              <div className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm font-medium text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-28 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-64 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />
        </div>
        <h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Ready to claim your first bounty?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-zinc-400">
          No account required. Jump straight into a challenge and start debugging.
        </p>
        <Button
          asChild
          size="lg"
          className="group mt-10 h-13 gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-10 text-base font-semibold shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/40"
        >
          <Link href="/dashboard">
            Start Hunting
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          bugbounty.ai · Built for the modern JavaScript engineer
        </div>
      </footer>
    </div>
  );
}