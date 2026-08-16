# bugbounty.ai

### Ship fixes. Hunt bugs. Level up JavaScript.

A competitive debugging arena where every broken function is a bounty.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-2.0%20Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## The Idea

Most coding platforms ask: *Can you write this function?*

**bugbounty.ai** asks: *Can you fix this one — under time pressure, with incomplete information, the way senior engineers actually work?*

You receive intentionally broken JavaScript, a realistic bug report, and a countdown. You investigate in a Monaco editor, run hidden tests in a secure Web Worker sandbox, optionally consult a Socratic AI mentor, and submit before the bounty expires.

Pass → XP, streak multiplier, and a senior AI code review.  
Fail → the bug escapes. Streak resets.

It combines the feel of **VS Code**, **HackerRank**, **GitHub**, and a competitive bug-bounty board — without cartoon hackers or fake terminal gimmicks.

---

## Why This Exists

Real production work is debugging:

- Closures capturing the wrong binding  
- Promises that never settle  
- Mutation during iteration  
- Lost `this`  
- Event-loop ordering mistakes  
- Shallow copies that share nested state  

LeetCode-style greenfield problems do not train that muscle.  
bugbounty.ai does.

---

## Core Loop

```
Landing → Start Hunting → Select difficulty/topic
       → Challenge Workspace
       → Read bug report
       → Inspect & edit code (Monaco)
       → Run tests (Web Worker)
       → Optional AI mentor hints
       → Submit
       → Automated evaluation
       → Senior AI review + score
       → Victory / Failure → Next bug
```

Every transition is designed to feel fast and intentional.

---

## Features

### Debugging Workspace
- Full **Monaco Editor** (syntax highlighting, minimap, folding, shortcuts)
- Split layout: editor ~60% · bug report + mentor ~40%
- Realistic terminal with live test output
- Keyboard shortcuts: `⌘/Ctrl + Enter` run tests · `⌘/Ctrl + Shift + Enter` submit
- Mobile: tabbed CODE / BUG / TESTS / MENTOR views

### Secure Client-Side Execution
- User code never runs on the main UI thread
- Dedicated **Web Worker** with ~3s timeout
- Captures console output, syntax errors, runtime errors, rejected promises
- Hidden tests — expected values are never shown on failure
- Supports async functions and sequential awaits

### AI Layer (Google Gemini)
| Endpoint | Role |
|----------|------|
| `POST /api/ai/challenge` | Generate a solvable challenge with one primary conceptual bug |
| `POST /api/ai/mentor` | Progressive Socratic hints (never the full solution) |
| `POST /api/ai/review` | Senior engineer review after a successful submit |

- API key stays **server-side only** (`GEMINI_API_KEY`)
- Responses validated with **Zod**
- Automatic fallback to curated challenges if Gemini is unavailable or returns invalid JSON

### Scoring System

```
Final XP =
  Base Bounty
+ Remaining Seconds × Multiplier
+ Streak Multiplier
− Hint Penalties
+ Code Style Bonus (from AI review)
```

Transparent breakdown on the victory screen.

### Progression
- Streak system with escalating multipliers  
- localStorage persistence (user stats, attempts, daily bounty)  
- Supabase-ready schema hooks (optional)  
- Leaderboard with current-user highlight  
- Profile: XP, success rate, average solve time, favorite topic, best score  

### Daily Bounty
Deterministic challenge selection from the date string — same challenge for everyone on a given day, with a leaderboard bonus reward.

### Demo Mode
No registration required.  
“Start Hunting” creates a local profile and drops you into a solvable challenge in under a minute.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS, custom shadcn-style components |
| Editor | `@monaco-editor/react` |
| Motion | Framer Motion |
| Icons | Lucide React |
| Confetti | canvas-confetti |
| AI | Google Generative AI SDK · Gemini 2.0 Flash |
| Validation | Zod |
| Execution | Web Workers (Blob worker) |
| Persistence | localStorage (Supabase optional) |

No unnecessary frameworks. Desktop-first, tablet/mobile usable.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing
│   ├── dashboard/               # Stats + continue hunting
│   ├── hunt/                    # Core debugging workspace
│   ├── leaderboard/
│   ├── profile/
│   └── api/ai/
│       ├── challenge/           # Gemini challenge generator
│       ├── review/              # Senior code review
│       └── mentor/              # Socratic hints
├── components/
│   ├── ui/                      # Button, Badge, Card
│   └── layout/                  # Navbar
├── lib/
│   ├── challenges/fallbacks.ts  # 8 high-quality offline challenges
│   ├── execution/runner.ts      # Web Worker test runner
│   ├── gemini/                  # Client + Zod schemas
│   ├── scoring/                 # XP, streaks, timers
│   └── storage/                 # localStorage layer
└── types/
    ├── challenge.ts
    └── user.ts
```

Clear separation: **UI · AI API · Challenge Engine · Execution Worker · Persistence · Scoring**.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or pnpm / yarn)

### Install & Run

```bash
git clone <repo-url> bugbounty-ai
cd bugbounty-ai
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Required for AI generation / mentor / review
GEMINI_API_KEY=your_google_ai_studio_key

# Optional — app works fully offline without these
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Without a Gemini key** the product still runs end-to-end using eight curated fallback challenges covering closures, promises, arrays, async/await, objects, event loop, `this` binding, and DOM events.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

---

## Challenge Design Principles

AI-generated (and fallback) challenges must:

1. Contain **exactly one primary conceptual bug** (not a syntax error)
2. Look like code a mid-level engineer might actually write
3. Be solvable in roughly 1–5 minutes depending on difficulty
4. Ship with deterministic, JSON-serializable tests
5. Include progressive Socratic hints that never dump the solution

Avoided: trivial `return a + b` problems.

---

## Security Notes

- Gemini API key is **never** exposed to the browser
- User code executes **only** in a client-side Web Worker (not on the server)
- AI JSON is validated with Zod before use
- Hidden test expectations are not rendered in the UI on failure
- Client-side XP is for gameplay; architecture allows future server-authoritative scoring

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘/Ctrl + Enter` | Run tests |
| `⌘/Ctrl + Shift + Enter` | Submit fix |
| `Escape` | Close modal / cancel exit |

---

## Judging / Demo Path (≈3 minutes)

1. Open landing → **Start Hunting**
2. Dashboard → **Start Quick Hunt** (or Easy Warm-up)
3. Read the bug report
4. Edit the starter code in Monaco
5. **Run Tests** → observe terminal output
6. Optionally request a mentor hint
7. **Submit Fix**
8. Watch confetti, score breakdown, and senior review
9. **Hunt Next Bug** or visit Leaderboard / Profile

First challenge is intentionally solvable in 1–3 minutes so judges experience a full win loop quickly.

---

## What We Deliberately Avoided

- Generic AI purple gradients everywhere  
- Cartoon “hacker” imagery  
- Fake blinking terminals with no real execution  
- Placeholder screens that look like a landing-page mockup  
- Client-side exposure of secrets  
- Dependency on a single external API with no offline path  

The UI is meant to feel like a real developer product a senior engineer would take seriously.

---

## Future Directions

- Server-authoritative scoring & leaderboards  
- Real Supabase auth + multiplayer races  
- Team / company private arenas  
- Expanded topic packs (TypeScript, React hooks, Node)  
- Replay of failed attempts with annotated diffs  

---

## License

MIT — built for a 48-hour Devpost hackathon demonstration.

---

**bugbounty.ai**  
*Ship fixes. Hunt bugs. Level up JavaScript.*