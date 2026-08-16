"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bug, ArrowRight, Code2, Timer, Brain, Trophy, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const topics = ["Async & Promises","Arrays & Methods","Closures","Objects","DOM","Functions","Event Loop","JavaScript Fundamentals"];
const steps = [
  { icon: Bug, title: "Receive the Bug", desc: "Get a realistic bug report and intentionally broken JavaScript." },
  { icon: Code2, title: "Investigate the Code", desc: "Read the report, open Monaco, and hunt the root cause." },
  { icon: Target, title: "Fix & Test", desc: "Run hidden tests in a secure sandbox until green." },
  { icon: Trophy, title: "Claim the Bounty", desc: "Submit before the timer, earn XP, keep your streak." },
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 md:pt-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400">
            <Zap className="h-3.5 w-3.5 text-violet-400" /> Competitive JavaScript debugging arena
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Ship fixes. Hunt bugs.{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Level up JavaScript.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-400">
            A competitive debugging arena where every broken function is a bounty.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/dashboard">Start Hunting <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#how-it-works">View How It Works</a>
            </Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-xl border border-zinc-800 bg-[#0d0d0f] shadow-2xl">
          <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="ml-3 font-mono text-xs text-zinc-500">BUG #2041 · HARD · 01:42</span>
            <span className="ml-auto font-mono text-xs text-violet-400">+420 XP</span>
          </div>
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-zinc-300">
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
            <div className="border-t border-zinc-800 p-4 md:border-l md:border-t-0">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">Bug Report</div>
              <p className="text-sm text-zinc-400">Each callback returns the same value instead of its own index. Closures capture a shared loop variable.</p>
              <div className="mt-4 space-y-1.5 font-mono text-xs">
                <div className="text-emerald-400">✓ Basic length 3</div>
                <div className="text-emerald-400">✓ Length 1</div>
                <div className="text-red-400">✕ Length 5</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="how-it-works" className="border-t border-zinc-800 bg-zinc-900/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-semibold sm:text-3xl">How It Works</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="mb-1 text-xs font-medium text-zinc-500">Step {i + 1}</div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-semibold">Challenge Categories</h2>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
            {topics.map((t) => (
              <Badge key={t} variant="secondary" className="px-3 py-1.5 text-sm">{t}</Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900/40 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
          {[
            { label: "Bugs Fixed", value: "12,840+", icon: Bug },
            { label: "Total XP", value: "2.4M+", icon: Zap },
            { label: "Best Streak", value: "47", icon: Timer },
            { label: "Accuracy", value: "78%", icon: Brain },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <s.icon className="mx-auto mb-2 h-5 w-5 text-violet-400" />
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 text-center">
        <h2 className="text-2xl font-semibold">Ready to claim your first bounty?</h2>
        <p className="mt-2 text-zinc-400">No account required. Jump straight into a challenge.</p>
        <Button asChild size="lg" className="mt-6 gap-2">
          <Link href="/dashboard">Start Hunting <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </section>

      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        bugbounty.ai · Built for the modern JavaScript engineer
      </footer>
    </div>
  );
}
