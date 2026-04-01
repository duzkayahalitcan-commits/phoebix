# Phoebix — Lessons Learned

## Architecture

### NavbarWrapper pattern
When layout.tsx is a Server Component but Navbar needs `useState` (lang, auth),
create a thin `NavbarWrapper` client shell. Never put `'use client'` on layout.tsx.
```
layout.tsx (Server) → NavbarWrapper (Client, holds lang state) → Navbar (Client)
```

### Never add a nav to page files
Navbar is global via layout.tsx. Adding a nav inside a page = duplicate.
Commit `9c5da4c` removed 6 inline navs. Commit `f9350a6` deleted the orphaned PageNav.tsx.

### @supabase/ssr vs @supabase/supabase-js
- Use `createBrowserClient` from `@supabase/ssr` in Client Components for auth (handles cookies).
- Use `createClient` from `@supabase/supabase-js` only for non-auth operations.
- `@supabase/auth-helpers-nextjs` is NOT installed — do not import it.

## Debugging

### Ghost duplicate navbar
When a "ghost" nav appears at top-left with missing styles, it's almost always:
1. A second component rendering a `<nav>` not caught by grep (check components/ too, not just app/)
2. Stale Vercel CDN / browser cache — hard refresh first before code-diving
3. Old `.next` build cache — restart dev server

### astronomia VSOP87-D
- Use `vsop87D` (not `vsop87B`). Call `planet.position(jde)` for heliocentric spherical coords.
- Sun geocentric = `(earth.position(jde).ra * 180/Math.PI + 180) % 360`.
- Do NOT use `solar.apparentLongitude` — returns wrong values (~320° for spring equinox).

## Patterns

### React hooks in conditional-mount components
Never call hooks after an early return. Compute derived values before hooks,
put early return AFTER all hooks. Or check inside effects: `if (value < 0) return`.

### TypeScript with Record<number, T>
For milestone lookup tables indexed by age: `Record<number, { ... }>` — not an array.
Lookup: `const ms = TABLE[age]` — returns `undefined` if not a milestone key.

### globals.css duplicate rule guard
globals.css had the entire utility block duplicated (copy-paste bug). Fixed in `f9350a6`.
Rule: always check file length after appending CSS — duplicates cause confusing style bugs.

## Git

### First push needs --set-upstream
```
git push --set-upstream origin main
```
After that, plain `git push` works.

### Commit message format
Use heredoc for multi-line commit messages to avoid shell escaping issues:
```bash
git commit -m "$(cat <<'EOF'
subject line

body
EOF
)"
```
