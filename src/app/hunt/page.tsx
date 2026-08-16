"use client";
import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Play, Send, Lightbulb, X, Flame, Clock, Loader2, CheckCircle2, XCircle, Terminal as TermIcon, Bug, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getOrCreateUser, updateUser, addAttempt, getDailyChallengeId, setDailyChallengeId } from "@/lib/storage";
import { calculateScore, formatTime, getHintCost, getTimeLimit } from "@/lib/scoring";
import { getFallbackByTopic, getDailyFallback } from "@/lib/challenges/fallbacks";
import { runTestsInWorker } from "@/lib/execution/runner";
import type { Challenge, ExecutionResult, ReviewResult, ScoreBreakdown, Difficulty } from "@/types/challenge";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false, loading: () => <div className="flex h-full items-center justify-center bg-[#0d0d0f] text-zinc-500">Loading editor…</div> });

type Phase = "loading" | "playing" | "victory" | "failure";

function HuntInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const difficultyParam = (searchParams.get("difficulty") || "medium") as Difficulty;
  const topicParam = searchParams.get("topic") || "Closures";
  const mode = searchParams.get("mode");

  const [phase, setPhase] = useState<Phase>("loading");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [remaining, setRemaining] = useState(300);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [mentorHint, setMentorHint] = useState<string | null>(null);
  const [mentorLoading, setMentorLoading] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [score, setScore] = useState<ScoreBreakdown | null>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [mobileTab, setMobileTab] = useState<"code" | "bug" | "tests" | "mentor">("code");
  const [confirmExit, setConfirmExit] = useState(false);

  const deadlineRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const appendTerminal = useCallback((line: string) => {
    setTerminalLines((prev) => [...prev.slice(-80), line]);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPhase("loading");
      try {
        if (mode === "daily") {
          const existing = getDailyChallengeId();
          const fb = getDailyFallback();
          if (!cancelled) {
            if (!existing) setDailyChallengeId(fb.id);
            setChallenge(fb); setCode(fb.starterCode);
            const limit = fb.timeLimit || getTimeLimit(fb.difficulty as Difficulty);
            setRemaining(limit); deadlineRef.current = Date.now() + limit * 1000; startTimeRef.current = Date.now();
            setPhase("playing");
          }
          return;
        }
        const res = await fetch("/api/ai/challenge", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: topicParam, difficulty: difficultyParam }),
        });
        const data = await res.json();
        const ch: Challenge = data.challenge || getFallbackByTopic(topicParam, difficultyParam);
        if (!cancelled) {
          setChallenge(ch); setCode(ch.starterCode);
          const limit = ch.timeLimit || getTimeLimit(ch.difficulty as Difficulty);
          setRemaining(limit); deadlineRef.current = Date.now() + limit * 1000; startTimeRef.current = Date.now();
          setPhase("playing");
        }
      } catch {
        const fb = getFallbackByTopic(topicParam, difficultyParam);
        if (!cancelled) {
          setChallenge(fb); setCode(fb.starterCode);
          const limit = fb.timeLimit || getTimeLimit(fb.difficulty as Difficulty);
          setRemaining(limit); deadlineRef.current = Date.now() + limit * 1000; startTimeRef.current = Date.now();
          setPhase("playing");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [difficultyParam, topicParam, mode]);

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) { if (timerRef.current) clearInterval(timerRef.current); setPhase("failure"); }
    }, 250);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const runTests = useCallback(async () => {
    if (!challenge || running || phase !== "playing") return;
    setRunning(true); setTerminalLines([]);
    appendTerminal("$ bugbounty test");
    appendTerminal("Initializing sandbox...");
    appendTerminal(`Running ${challenge.tests.length} hidden tests...`);
    try {
      const result = await runTestsInWorker(code, challenge.tests, 3000);
      setExecResult(result);
      result.results.forEach((r) => appendTerminal(r.passed ? `✓ ${r.name}` : `✕ ${r.name}${r.error ? " — " + r.error : ""}`));
      if (result.error) appendTerminal(`Error: ${result.error}`);
      result.consoleOutput.forEach((l) => appendTerminal(`  log: ${l}`));
      appendTerminal(`${result.passedCount}/${result.totalCount} tests passed · ${Math.round(result.totalTime)}ms`);
    } catch (e) {
      appendTerminal("Sandbox error: " + (e instanceof Error ? e.message : String(e)));
    } finally { setRunning(false); }
  }, [challenge, code, running, phase, appendTerminal]);

  const askMentor = useCallback(async () => {
    if (!challenge || mentorLoading || phase !== "playing") return;
    setMentorLoading(true);
    try {
      const res = await fetch("/api/ai/mentor", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge, hintIndex: hintsUsed, userCode: code }),
      });
      const data = await res.json();
      setMentorHint(data.hint || "Re-examine the reproduction steps.");
      setHintsUsed((h) => h + 1);
      const user = getOrCreateUser();
      updateUser({ hintsUsed: user.hintsUsed + 1 });
    } catch {
      setMentorHint("AI mentor unavailable. Trust your instincts.");
    } finally { setMentorLoading(false); }
  }, [challenge, code, hintsUsed, mentorLoading, phase]);

  const submitFix = useCallback(async () => {
    if (!challenge || submitting || phase !== "playing" || remaining <= 0) return;
    setSubmitting(true); setTerminalLines([]);
    appendTerminal("$ bugbounty submit");
    appendTerminal("Running final evaluation...");
    let result: ExecutionResult;
    try {
      result = await runTestsInWorker(code, challenge.tests, 3000);
      setExecResult(result);
      result.results.forEach((r) => appendTerminal(r.passed ? `✓ ${r.name}` : `✕ ${r.name}`));
      appendTerminal(`${result.passedCount}/${result.totalCount} tests passed`);
    } catch {
      result = { success: false, results: [], consoleOutput: [], error: "Execution failed", totalTime: 0, passedCount: 0, totalCount: challenge.tests.length };
    }
    const solveTimeSec = Math.round((Date.now() - startTimeRef.current) / 1000);
    const user = getOrCreateUser();
    if (result.success) {
      let reviewData: ReviewResult = { summary: "Clean fix. Tests pass.", qualityScore: 85, complexity: "O(n)", styleBonus: 30, strengths: ["Correct"], improvement: "Keep going." };
      try {
        const revRes = await fetch("/api/ai/review", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ challenge, userCode: code, testResults: result, executionTime: result.totalTime }),
        });
        const revJson = await revRes.json();
        if (revJson.review) reviewData = revJson.review;
      } catch {}
      setReview(reviewData);
      const breakdown = calculateScore({ difficulty: challenge.difficulty as Difficulty, remainingSeconds: remaining, streak: user.streak, hintsUsed, styleBonus: reviewData.styleBonus || 0 });
      setScore(breakdown);
      const newStreak = user.streak + 1;
      updateUser({ xp: user.xp + breakdown.total, streak: newStreak, longestStreak: Math.max(user.longestStreak, newStreak), bugsSolved: user.bugsSolved + 1, totalSolveTime: user.totalSolveTime + solveTimeSec * 1000 });
      addAttempt({ id: `att_${Date.now()}`, userId: user.id, challengeId: challenge.id, title: challenge.title, topic: String(challenge.topic), difficulty: challenge.difficulty, code, score: breakdown.total, solveTime: solveTimeSec, hintsUsed, testsPassed: result.passedCount, testsTotal: result.totalCount, success: true, createdAt: new Date().toISOString() });
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ["#8b5cf6", "#a78bfa", "#22c55e", "#f59e0b"] });
      setPhase("victory");
    } else {
      updateUser({ streak: 0, bugsFailed: user.bugsFailed + 1 });
      addAttempt({ id: `att_${Date.now()}`, userId: user.id, challengeId: challenge.id, title: challenge.title, topic: String(challenge.topic), difficulty: challenge.difficulty, code, score: 0, solveTime: solveTimeSec, hintsUsed, testsPassed: result.passedCount, testsTotal: result.totalCount, success: false, createdAt: new Date().toISOString() });
      setPhase("failure");
    }
    setSubmitting(false);
  }, [challenge, code, submitting, phase, remaining, hintsUsed, appendTerminal]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) submitFix(); else runTests();
      }
      if (e.key === "Escape") setConfirmExit(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runTests, submitFix]);

  if (phase === "loading" || !challenge) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        <div className="text-center"><p className="font-medium">Generating bounty…</p><p className="text-sm text-zinc-400">Planting the bug.</p></div>
      </div>
    );
  }

  const diffVariant = challenge.difficulty as "easy" | "medium" | "hard" | "expert";
  const urgent = remaining <= 30;

  return (
    <div className="flex h-[calc(100vh-0px)] flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-zinc-800 bg-zinc-900/50 px-3 py-2">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-violet-400" />
          <span className="font-mono text-sm font-medium">{challenge.id.slice(0, 12).toUpperCase()}</span>
          <Badge variant={diffVariant} className="uppercase">{challenge.difficulty}</Badge>
        </div>
        <div className={`ml-auto flex items-center gap-1.5 font-mono text-lg font-semibold tabular-nums ${urgent ? "timer-urgent" : ""}`}>
          <Clock className="h-4 w-4" />{formatTime(remaining)}
        </div>
        <span className="font-mono text-sm text-violet-400">+{challenge.baseXp || 300} XP</span>
        <span className="flex items-center gap-1 text-amber-400"><Flame className="h-4 w-4" /><span className="text-sm font-medium">{getOrCreateUser().streak}x</span></span>
        <Button variant="ghost" size="sm" onClick={() => setConfirmExit(true)}><X className="h-4 w-4" /></Button>
      </div>

      <div className="flex border-b border-zinc-800 md:hidden">
        {(["code", "bug", "tests", "mentor"] as const).map((t) => (
          <button key={t} onClick={() => setMobileTab(t)} className={`flex-1 py-2 text-center text-xs font-medium uppercase ${mobileTab === t ? "border-b-2 border-violet-500 text-violet-400" : "text-zinc-500"}`}>{t}</button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className={`min-h-0 flex-1 border-zinc-800 md:border-r ${mobileTab !== "code" ? "hidden md:block" : ""}`} style={{ flex: "1 1 60%" }}>
          <MonacoEditor height="100%" language="javascript" theme="vs-dark" value={code} onChange={(v) => setCode(v || "")}
            options={{ fontSize: 14, minimap: { enabled: true }, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 2, wordWrap: "on", padding: { top: 12 } }} />
        </div>
        <div className={`flex w-full flex-col overflow-hidden md:w-[40%] ${mobileTab === "code" ? "hidden md:flex" : ""}`}>
          <div className={`flex-1 overflow-y-auto border-b border-zinc-800 p-4 ${mobileTab !== "bug" && mobileTab !== "mentor" ? "hidden md:block" : ""} ${mobileTab === "mentor" ? "hidden" : ""}`}>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Bug Report</h2>
            <h3 className="text-base font-semibold">{challenge.title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{challenge.description}</p>
            {challenge.reproduction && <div className="mt-3"><div className="text-xs font-medium text-zinc-500">Reproduction</div><p className="mt-1 text-sm text-zinc-400">{challenge.reproduction}</p></div>}
            {challenge.expectedBehavior && <div className="mt-3"><div className="text-xs font-medium text-zinc-500">Expected</div><p className="mt-1 text-sm text-zinc-400">{challenge.expectedBehavior}</p></div>}
          </div>
          <div className={`flex flex-col border-b border-zinc-800 p-4 ${mobileTab !== "mentor" ? "hidden md:flex" : ""}`}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">AI Senior Mentor</h2>
              <Button size="sm" variant="outline" onClick={askMentor} disabled={mentorLoading || phase !== "playing"} className="gap-1.5">
                {mentorLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lightbulb className="h-3.5 w-3.5" />}
                Hint (−{getHintCost(hintsUsed)} XP)
              </Button>
            </div>
            {mentorHint ? <p className="text-sm text-violet-300">{mentorHint}</p> : <p className="text-sm text-zinc-500">Stuck? Ask for a Socratic hint. Each hint costs XP.</p>}
          </div>
        </div>
      </div>

      <div className={`flex h-40 flex-col border-t border-zinc-800 bg-[#0a0a0c] ${mobileTab !== "tests" && mobileTab !== "code" ? "hidden md:flex" : ""}`}>
        <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-1.5 text-xs text-zinc-500"><TermIcon className="h-3.5 w-3.5" /> Terminal</div>
        <div className="flex-1 overflow-y-auto p-3 font-mono text-[12px] leading-relaxed">
          {terminalLines.length === 0 ? <span className="text-zinc-600">Ready. Ctrl/Cmd+Enter to run tests.</span> :
            terminalLines.map((l, i) => (
              <div key={i} className={l.startsWith("✓") ? "text-emerald-400" : l.startsWith("✕") ? "text-red-400" : l.startsWith("$") ? "text-violet-400" : ""}>{l}</div>
            ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-zinc-800 bg-zinc-900/80 px-4 py-3">
        <Button variant="outline" onClick={runTests} disabled={running || phase !== "playing"} className="gap-2">
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Run Tests
        </Button>
        <Button onClick={submitFix} disabled={submitting || phase !== "playing" || remaining <= 0} className="gap-2">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit Fix
        </Button>
      </div>

      <AnimatePresence>
        {confirmExit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <Card className="max-w-sm"><CardContent className="space-y-4 p-6">
              <h3 className="font-semibold">Leave challenge?</h3>
              <p className="text-sm text-zinc-400">Progress will be lost.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmExit(false)}>Stay</Button>
                <Button variant="destructive" onClick={() => router.push("/dashboard")}>Exit</Button>
              </div>
            </CardContent></Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "victory" && score && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                <h2 className="mt-3 text-xl font-bold">Bug Bounty Claimed</h2>
                <p className="text-sm text-zinc-400">All tests passed</p>
                <div className="mt-4 text-3xl font-bold text-violet-400">+{score.total} XP</div>
                <div className="mt-1 flex items-center justify-center gap-1 text-amber-400"><Flame className="h-4 w-4" />{getOrCreateUser().streak}x STREAK</div>
              </div>
              <div className="mt-6 space-y-1 border-t border-zinc-800 pt-4 font-mono text-sm">
                <div className="flex justify-between"><span className="text-zinc-500">Base bounty</span><span>+{score.baseXp}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Time bonus</span><span>+{score.timeBonus}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Streak</span><span>+{score.streakMultiplier}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Hint penalty</span><span>−{score.hintPenalty}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Style bonus</span><span>+{score.styleBonus}</span></div>
              </div>
              {review && (
                <div className="mt-4 rounded-lg bg-zinc-800/50 p-3">
                  <div className="text-xs font-medium uppercase text-zinc-500">Senior Dev Review</div>
                  <p className="mt-1 text-sm italic text-zinc-300">&ldquo;{review.summary}&rdquo;</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500"><span>Quality {review.qualityScore}/100</span><span>{review.complexity}</span></div>
                </div>
              )}
              <Button className="mt-6 w-full gap-2" onClick={() => { window.location.href = `/hunt?difficulty=${difficultyParam}&topic=${encodeURIComponent(topicParam)}`; }}>
                Hunt Next Bug <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "failure" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="text-center">
                <XCircle className="mx-auto h-12 w-12 text-red-400" />
                <h2 className="mt-3 text-xl font-bold">Bounty Escaped</h2>
                <p className="mt-1 text-sm text-zinc-400">{execResult ? `Tests passed: ${execResult.passedCount}/${execResult.totalCount}` : "Time expired or submission failed."}</p>
                <p className="mt-2 text-sm text-zinc-500">The bug got away. Streak reset.</p>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <Button onClick={() => window.location.reload()}>Try Again</Button>
                <Button variant="outline" onClick={askMentor} disabled={mentorLoading}>View First Hint</Button>
                <Button variant="ghost" onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HuntPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-violet-400" /></div>}>
      <HuntInner />
    </Suspense>
  );
}
