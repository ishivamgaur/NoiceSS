# Contributing to NoiceSS

First off, thank you for considering contributing to NoiceSS! Every contribution helps make this tool better for the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Conventions](#coding-conventions)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

By participating in this project, you agree to maintain a welcoming, inclusive, and harassment-free environment for everyone. Be respectful in all interactions - whether in issues, pull requests, or discussions.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating a bug report, please check the [existing issues](https://github.com/ishivgaur/noiceSS/issues) to avoid duplicates. When filing a new bug, include:

- **A clear, descriptive title.**
- **Steps to reproduce** the behavior.
- **Expected behavior** vs. what actually happened.
- **Screenshots or screen recordings** if the issue is visual.
- **Browser and OS** information (e.g., Chrome 126, Windows 11).

### 💡 Suggesting Features

Feature requests are welcome! Open a new issue with:

- A clear description of the feature and the problem it solves.
- Any mockups, sketches, or references that illustrate the idea.
- Whether you'd be willing to implement it yourself.

### 🎨 Adding Backdrop Presets or Wallpapers

If you'd like to contribute a new wallpaper or gradient preset:

1. Ensure the image is high quality (ideally 8K or higher resolution).
2. Use `.webp` format for compression efficiency.
3. Place the file in `public/wallpapers/` and reference it in the presets array inside `page.tsx`.

### 📝 Improving Documentation

Typos, grammar fixes, and documentation improvements are always appreciated. No change is too small.

## Development Setup

### Prerequisites

- **Node.js** 18.x or later
- **npm** (comes with Node.js)
- **Git**

### Steps

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/<your-username>/noiceSS.git
cd noiceSS

# 3. Install dependencies
npm install

# 4. (Optional) Set up environment variables
cp .env.example .env

# 5. Start the development server
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
noiceSS/
├── public/
│   ├── wallpapers/       # 8K backdrop wallpapers (.webp)
│   ├── favicon.svg       # App icon
│   └── noice-og.webp     # OpenGraph preview image
├── src/
│   └── app/
│       ├── layout.tsx     # Root layout, metadata, JSON-LD schemas
│       ├── page.tsx       # Main studio page (state, UI, canvas logic)
│       ├── globals.css    # Global styles and Tailwind imports
│       ├── sitemap.ts     # Dynamic sitemap generation
│       ├── robots.ts      # Crawler access rules
│       └── manifest.ts    # PWA manifest
├── .env.example           # Environment variable template
├── CONTRIBUTING.md        # ← You are here
└── README.md              # Project overview
```

## Coding Conventions

### General

- **TypeScript** is used throughout the project. Avoid `any` types where possible.
- **Tailwind CSS** is used for all styling. Do not introduce external CSS frameworks.
- Follow a **mobile-first** approach: write base styles for small screens, then use responsive prefixes (`md:`, `lg:`) for larger breakpoints.

### UI / UX Rules

NoiceSS follows a strict dark-mode-first design system:

- **Text colors**: `text-zinc-300` for body text, `text-white` for headings, `text-zinc-500` for muted text.
- **Backgrounds**: Use deep grays like `bg-[#0f0f11]` or `bg-zinc-900`. Never use pure black (`bg-black`).
- **Micro-interactions**: All buttons and interactive elements must include `hover:`, `active:scale-95`, and `transition-colors duration-200`.
- **Glassmorphism**: Use `backdrop-blur-md bg-black/20 border border-white/10` for glass effects.

### File Naming

- React components: `PascalCase.tsx`
- Utilities and helpers: `camelCase.ts`
- CSS modules (if used): `component-name.module.css`

## Commit Messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Every commit message should be structured as:

```
<type>(<scope>): <short summary>
```

### Types

| Type | When to Use |
| :--- | :--- |
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, whitespace, etc. (no logic changes) |
| `refactor` | Code restructuring without changing behavior |
| `perf` | Performance improvements |
| `chore` | Maintenance tasks (dependencies, configs) |

### Examples

```
feat(canvas): add gradient backdrop preset
fix(export): resolve 4x resolution scaling on Safari
docs(readme): update installation instructions
chore(deps): bump next.js to v15.1
```

## Pull Request Process

1. **Create a branch** from `main` with a descriptive name:
   ```
   feature/gradient-backdrops
   fix/export-blur-artifact
   docs/update-readme
   ```

2. **Keep PRs focused.** One feature or fix per pull request. Avoid bundling unrelated changes.

3. **Test your changes** locally before submitting. Verify that:
   - The dev server runs without errors.
   - Your changes render correctly across different screen sizes.
   - Export functionality still works as expected.

4. **Write a clear PR description** explaining:
   - What you changed and why.
   - Any trade-offs or decisions you made.
   - Screenshots or recordings for visual changes.

5. **Be responsive.** If a reviewer requests changes, address them promptly.

---

Thank you for helping make NoiceSS better! If you have any questions, feel free to open a [Discussion](https://github.com/ishivgaur/noiceSS/discussions) or reach out via an issue.
