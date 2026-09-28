<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# NoiceSS UI & Styling Guidelines

## 1. Mobile-First Responsive Design
- **Strict Mobile-First approach**: Always write base CSS/Tailwind classes for mobile screens first (e.g., `flex-col`, `w-full`, `p-4`).
- **Progressive Enhancement**: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) ONLY to override mobile styles for larger screens (e.g., `md:flex-row`, `lg:w-1/2`).
- Never use max-width media queries (e.g., `max-md:`) unless it's an extreme edge case.
- **Sidebar & Modals**: On mobile screens (`< 768px`), sidebars should collapse into off-canvas drawers, bottom sheets, or sticky bottom navigation.

## 2. Tailwind & CSS Best Practices
- **Spacing Consistency**: Rely strictly on standard Tailwind spacing scales (`gap-2`, `p-4`, `px-6`). Avoid arbitrary values like `p-[13px]` unless matching a precise design comp.
- **Grid vs Flex**: Prefer `flex` for 1-dimensional layouts (toolbars, rows) and `grid` for 2-dimensional layouts (galleries, responsive cards).
- **Glassmorphism**: When generating glass effects, always use `backdrop-blur-md bg-black/20 border border-white/10`. Keep borders incredibly thin (1px) and subtle.

## 3. UI/UX Principles
- **Minimalism**: Keep the UI clean, distraction-free, and uncluttered. If a tool isn't frequently used, hide it behind an "Advanced" accordion or popover.
- **Micro-interactions**: Interactive elements (buttons, inputs) must have `hover:`, `active:scale-95`, and `transition-colors duration-200` states to feel premium and tactile.
- **Dark Mode Standard**: NoiceSS is a dark-mode-first application. Text should be `text-zinc-300`, headers `text-white`, and muted text `text-zinc-500`. Avoid pure black backgrounds; use deep grays like `#0f0f11` or `#18181b`.

## 4. User Preferences & Strict Directives
- **Username**: The user's username is `ishivgaur` (not `ishivamgaur`). Keep this in mind if generating mock data.
- **Active States**: Avoid colored border accents unless explicitly requested. Use `border-white ring-1 ring-white/30 shadow-md` (or similar white/translucent combos) for strong active/selected states.
- **No em dashes anywhere.** Never write `—` or `–` in any user-facing copy, metadata, alt text, comments, or docs. When a break or aside needs punctuation, use a hyphen `-` instead. This is a hard rule, not a style preference. Verify with a grep for the em dash character across `src/` before finishing.
- **Preview Parity**: Sidebar previews and thumbnails MUST visually mirror the main canvas exactly (applying scaled-down dimensions, blur, padding, etc.) without arbitrary backgrounds or borders. Do not add box-shadows or padding to previews that don't exist on the main canvas.
- **Clean Interactions**: Avoid arbitrary hover zooms (`hover:scale-105`) on UI preview elements unless necessary. Keep UI interactions flat and minimal.
- **Floating Controls & Z-Index**:
  - `Header` is `z-[200]`.
  - `Floating HUDs/Editors` are `z-[150]`.
  - Always remember to use `e.stopPropagation()` on `onClick` AND `onPointerDown` for interactive canvas elements (like watermarks) so they don't accidentally trigger canvas deselection.

## 5. Styling System (non-negotiable)
- **Tailwind v4 is the only styling system.** Never hand-write a `.css` file with raw hex values for a component or page. Use Tailwind classes plus the tokens defined in `@theme` inside `src/app/globals.css`.
- **Never hardcode colors.** Use the semantic tokens: `bg-bg-dark`, `bg-panel`, `text-text-main`, `text-text-muted`, `text-zinc-*`, `border-white/5`, `border-white/10`.
- **Use `cn()` from `@/lib/utils`** to merge conditional classes. It wraps `clsx` + `tailwind-merge`, so a later class correctly overrides an earlier one instead of both surviving.
- **Build UI from the primitives in `src/components/ui/`** (Base UI via shadcn). Do not hand-roll a component that already exists as a primitive: a hand-rolled `role="tablist"` will not match the real one's keyboard and ARIA behavior.
- **Compose rather than fight.** Primitives ship default styling. Override it explicitly (`data-active:`, `variant="line"`, `after:hidden`) instead of assuming your classes win. Verify with a real browser, not just a passing build.

## 6. Shared Primitive Traps
- `Tabs` in `src/components/ui/tabs.tsx` wraps Base UI. It now forwards `orientation` to the primitive *and* writes the `data-orientation` attribute. Keep **both** in sync. Setting only the HTML attribute leaves Base UI's internal context on the default, which silently kills arrow-key navigation because `useCompositeRoot` maps `vertical` to `ArrowDown` and `horizontal` to `ArrowRight`.
- For a tab list where selection should follow focus, pass `activateOnFocus` to `TabsList`. The default is `false` (Enter/Space to activate), which is correct for page-like tabs and wrong for a detail readout.
- The base `Tabs` is `flex`. When switching to `md:grid`, set `flex-col` on the base so the mobile layout stacks before the grid override applies.
- Brand icons (`Github`, `Twitter`) were **removed from lucide v1**. Use the inline SVG exported as `GitHubIcon` from `src/app/landing/Mockup.tsx`, matching what the studio already does in `src/app/page.tsx`.

## 7. Route Shell
- `body` is globally `position: fixed` for the full-viewport studio shell. That traps scroll on any normal page.
- A scrolling page must render an element with the `data-scrolling-page` attribute (see `src/app/landing/Landing.tsx`). `globals.css` resets `body` via `body:has([data-scrolling-page])`. Without it the page cannot scroll and `100vw` causes horizontal overflow.
- Scroll reveal (`Reveal` + `RevealObserver`) is gated behind a `data-reveal-ready` flag on `<html>` set by a pre-paint inline script. That way content is never stuck invisible when JS is unavailable. The observer sweeps by `getBoundingClientRect`, not `IntersectionObserver` alone, so a jump to the bottom of the page still reveals everything it skipped past.

## 8. Verification Before Claiming Done
- `npx tsc --noEmit`, `npx eslint <paths>`, and `npx next build` all passing is **necessary but not sufficient**. A build will happily ship a layout that renders one word per line.
- Check rendered output at a mobile viewport (~390px) and a desktop viewport (~1440px) with a real browser, and confirm: no horizontal overflow (`scrollWidth === clientWidth`), focus ring visibility, and that keyboard focus and visual selection never disagree.
- Prefer inspecting computed styles over reading screenshots alone. `getComputedStyle` pinpoints a stray border or a wrong `data-orientation` that is easy to misread by eye.
- A Playwright `fullPage` screenshot renders `position: sticky` headers at their scrolled offset, so a header appearing mid-page is an artifact, not a bug. Take a viewport screenshot to confirm, and compare bounding rects instead of eyeballing.

