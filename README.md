# bugbounty.ai

**Ship fixes. Hunt bugs. Level up JavaScript.**

A production-grade competitive JavaScript debugging arena built for a 48-hour Devpost hackathon.

## Features

- **Monaco Editor** workspace with VS Code-like experience
- **Web Worker** sandbox for safe client-side JS execution + hidden tests
- **Gemini 2.5 / 2.0 Flash** challenge generation, Socratic mentor, senior code review
- **Scoring**: base XP + time bonus + streak multiplier − hint penalties + style bonus
- **Streak system**, victory confetti, failure recovery
- **localStorage** persistence (Supabase-ready)
- **Leaderboard** & **Profile**
- **Daily Bounty** with deterministic selection
- Responsive desktop-first UI with mobile tabs

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + shadcn-style components
- Monaco Editor, Framer Motion, Lucide, canvas-confetti
- Zod validation, Google Generative AI SDK

## Quick start

```bash
npm install
cp .env.example .env.local
# Optional: add GEMINI_API_KEY=your_key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without a Gemini key the app uses high-quality **fallback challenges** so demos always work.

## Project structure

```
src/app/           # pages + API routes
src/components/    # UI, layout
src/lib/           # scoring, storage, gemini, challenges, execution
src/types/         # shared types
```

## API routes

- `POST /api/ai/challenge` — generate challenge (Gemini or fallback)
- `POST /api/ai/review` — senior code review after success
- `POST /api/ai/mentor` — progressive Socratic hints

## License

MIT — built for hackathon demonstration.
