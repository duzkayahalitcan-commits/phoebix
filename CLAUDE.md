# Claude Code Rules — Phoebix

## Project Context
- Phoebix (phoebix.com) — Next.js 14 App Router, Supabase (@supabase/ssr), Tailwind, Vercel
- Dark purple glassmorphism aesthetic (#04020e bg, #7b5ea8 / #c4b5f7 accents)
- Priority: Ship working features fast.

## Workflow

### 1. Planning
- For complex tasks (3+ steps): write plan to tasks/todo.md before starting
- If something goes wrong: STOP and re-plan
- Simple fixes: just fix, no planning needed

### 2. Self-Improvement Loop
- After ANY user correction: update tasks/lessons.md with the pattern
- Review lessons.md at session start

### 3. Verification
- Never mark a task complete without proving it works
- Run: build check, grep for obvious errors, curl to verify endpoints
- Then commit and push

### 4. Bug Fixing
- When given a bug: just fix it autonomously
- Check logs and errors, resolve without asking for hand-holding

## Core Principles
- Simplicity first: minimal code impact, no side effects
- No lazy fixes: find root cause, senior developer standards
- Only touch what's necessary
