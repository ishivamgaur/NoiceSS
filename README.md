<div align="center">
  <a href="https://noicess.vercel.app" target="_blank">
    <img src="https://noicess.vercel.app/noice-og.webp" alt="NoiceSS - Beautiful Screenshot Mockup Studio" width="100%" />
  </a>

  <br />
  <br />

  <h1>NoiceSS</h1>
  <p><strong>Open-source screenshot mockup studio. Turn flat screenshots into stunning 3D presentations.</strong></p>

  <p>
    <a href="https://noicess.vercel.app"><b>Try it Live →</b></a>
  </p>

  <p>
    <img src="https://img.shields.io/github/license/ishivgaur/noiceSS?style=for-the-badge" alt="License" />
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
    <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" alt="PRs Welcome" />
  </p>
</div>

---

## Table of Contents

- [Why NoiceSS](#why-noicess)
- [Key Features](#key-features)
- [Export Quality](#export-quality)
- [Getting Started](#getting-started)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)
- [License](#license)

---

## Why NoiceSS

Raw screenshots don't sell products. But hiring a designer or wrestling with Figma every time you need a polished mockup is overkill.

**NoiceSS** solves this. It's a browser-based studio that takes your flat screenshot and wraps it in professional macOS frames, 3D perspectives, and curated backdrops—ready for Twitter, Product Hunt, portfolios, or pitch decks. No uploads. No accounts. No watermarks. Everything runs locally in your browser.

> [!TIP]
> **🚀 Offline Ready:** NoiceSS is a fully-featured Progressive Web App (PWA). Once loaded for the first time, you can disconnect from the internet and continue using the app completely offline. You can even "Install" it as a standalone app on your desktop or mobile device.

It's also 100% open-source under the MIT License, so you can self-host it, fork it, or contribute to it.

## Key Features

| Feature | Description |
| :--- | :--- |
| **macOS Window Frames** | Wrap screenshots in a realistic Safari/macOS application frame with customizable traffic lights. |
| **3D Isometric Tilting** | Full X, Y, Z-axis rotation with adjustable perspective depth for dynamic, eye-catching presentations. |
| **Decoupled Studio Lighting** | Independent brightness, contrast, saturation, and hue controls for the screenshot and the background canvas separately. |
| **8K Radiant Backdrops** | Curated wallpaper library, gradient fills, solid colors, transparency, or custom image uploads. |
| **Background Blur** | Apply gaussian blur to the backdrop with automatic edge scaling to eliminate bleed artifacts. |
| **Offline PWA Support** | Fully functional without an internet connection after the first load. Install it on your device and use it anywhere. Powered by Serwist. |
| **Aspect Ratio Presets** | One-click sizing for Twitter (16:9), Instagram (1:1), Dribbble (4:3), LinkedIn, and custom ratios. |
| **Watermark Editor** | Add draggable, resizable text/image watermarks with opacity and blend mode controls. |
| **Undo / Redo** | Full history stack so you never lose your work. |
| **Privacy-First** | All rendering is performed client-side with HTML2Canvas. Your images never leave your browser. |

## Export Quality

NoiceSS is built for people who care about pixel-perfect output.

| Property | Details |
| :--- | :--- |
| **Format** | WebP (lossy or lossless). Superior compression and color accuracy over JPEG/PNG. |
| **Resolution** | Export at **1×** (standard), **2×** (Retina), or **4×** (Ultra HD / 4K). A 1200×630 canvas at 4× exports as 4800×2520. |
| **Color Space** | sRGB with full alpha channel support for transparent backgrounds. |
| **Anti-Aliasing** | Sub-pixel smoothing on all 3D-transformed edges to prevent jagged artifacts. |
| **File Size** | Optimized WebP encoding keeps file sizes small without sacrificing visual quality. |

## Getting Started

### Prerequisites

- **Node.js** 18.x or later
- **npm**, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/ishivgaur/noiceSS.git
cd noiceSS

# Install dependencies
npm install

# (Optional) Configure environment variables for analytics
cp .env.example .env

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start creating.

### Environment Variables

NoiceSS works perfectly without any environment variables. These are entirely optional:

| Variable | Purpose |
| :--- | :--- |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification tag |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Umami analytics tracking ID |

See [`.env.example`](.env.example) for reference.

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| UI Primitives | [Radix UI](https://www.radix-ui.com/) |
| State | [Zustand](https://zustand-demo.pmnd.rs/) |
| PWA & Offline | [Serwist](https://serwist.pages.dev/) |
| Canvas Export | HTML2Canvas |
| Deployment | [Vercel](https://vercel.com/) |

## Contributing

We welcome contributions from everyone—whether it's a bug fix, a new backdrop preset, performance optimization, or documentation improvement.

Please read the **[Contributing Guide](CONTRIBUTING.md)** before opening a pull request. It covers the development setup, coding conventions, and PR process.

Quick start for contributors:

```bash
# Fork → Clone → Branch
git checkout -b feature/your-feature

# Make changes, then commit using conventional commits
git commit -m "feat: add gradient backdrop preset"

# Push and open a PR
git push origin feature/your-feature
```

## License

This project is open-source and distributed under the **MIT License**. See the [`LICENSE`](LICENSE) file for details.

---

<div align="center">
  <sub>Built and maintained by <a href="https://github.com/ishivgaur">@ishivgaur</a></sub>
</div>
