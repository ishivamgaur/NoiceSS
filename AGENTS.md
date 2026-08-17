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
- **Preview Parity**: Sidebar previews and thumbnails MUST visually mirror the main canvas exactly (applying scaled-down dimensions, blur, padding, etc.) without arbitrary backgrounds or borders. Do not add box-shadows or padding to previews that don't exist on the main canvas.
- **Clean Interactions**: Avoid arbitrary hover zooms (`hover:scale-105`) on UI preview elements unless necessary. Keep UI interactions flat and minimal.
- **Floating Controls & Z-Index**:
  - `Header` is `z-[200]`.
  - `Floating HUDs/Editors` are `z-[150]`.
  - Always remember to use `e.stopPropagation()` on `onClick` AND `onPointerDown` for interactive canvas elements (like watermarks) so they don't accidentally trigger canvas deselection.
