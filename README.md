<div align="center">
  <a href="https://noicess.fun" target="_blank">
    <img src="https://noicess.fun/noice-og.webp" alt="NoiceSS - Screenshot Mockup Studio & MCP Server" width="800" style="border-radius: 12px; margin-bottom: 24px;" />
  </a>

  # NoiceSS

  **Turn raw screenshots into beautiful mockups — in your browser or directly from your AI agent.**

  [![Try it Live](https://img.shields.io/badge/Live_Studio-noicess.fun-000000?style=for-the-badge)](https://noicess.fun)

  <div style="margin-top: 14px; display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
    <a href="https://github.com/ishivamgaur/noiceSS/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/ishivamgaur/noiceSS?style=flat-square&color=blue" alt="License" />
    </a>
    <img src="https://img.shields.io/badge/MCP_Server-Ready-8A2BE2?style=flat-square" alt="MCP Server Ready" />
    <img src="https://img.shields.io/badge/Zero_Cost-100%25_Local-brightgreen?style=flat-square" alt="100% Local" />
    <img src="https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/PWA-Offline_Ready-5A0FC8?style=flat-square" alt="Offline Ready" />
    <a href="#contributing">
      <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
    </a>
  </div>
</div>

---

## What is NoiceSS?

Raw screenshots look boring in documentation, pitch decks, and social posts. Making them look great in Figma or Photoshop takes too long.

**NoiceSS gives you two simple ways to fix this:**

1. **The Web Studio ([noicess.fun](https://noicess.fun))**: Drop an image into your browser, click presets for 3D tilt, macOS window frames, wallpapers, or frosted borders, and download 4K Retina images instantly. Works completely offline as a PWA.
2. **The MCP Server for AI Agents**: Hook NoiceSS into **Cursor, Claude, Windsurf, Cline, Antigravity, or Zed**. Just ask your AI agent in plain English to transform any image in your codebase into a polished mockup or responsive 3D website component.

```
"Make this screenshot 16:9 with a blurred background, macOS frame, and a small watermark"
                                   │
                                   ▼
          [Plain Screenshot]  ──▶  [NoiceSS MCP]  ──▶  [Polished Hero Mockup]
```

---

## Quick Comparison

| What you need | Web Studio (`noicess.fun`) | AI Agent MCP Server |
| :--- | :--- | :--- |
| **Best for** | Quick manual edits & visual tweaking | Automated mockups right inside your coding workflow |
| **Interface** | Visual sliders & instant browser preview | Plain English prompts to your coding assistant |
| **Outputs** | WebP, PNG, JPEG (1x, 2x, 4x Retina) | Saved image files + copy-paste React & Tailwind code |
| **Cost** | 100% Free | $0 (Runs locally on your machine, zero API fees) |
| **Privacy** | Never leaves your browser | Never leaves your computer |

---

## Model Context Protocol (MCP) Quickstart

Let your AI agent make your screenshots look great without you ever leaving your editor.

### Why use the MCP server?

- **Zero Cloud Fees**: Runs locally using Node and Sharp. No OpenAI API keys, no subscriptions, no credit cards.
- **Total Privacy**: Your proprietary product screenshots and code never get uploaded anywhere.
- **Pixel-Perfect Matches**: Uses the exact same look as the web studio — real frosted glass blur, macOS traffic lights, smooth shadows, and badges.
- **Generates Code Too**: Ask for Tailwind CSS or React components with 3D tilt ready to drop straight into your landing page.

### 1. Test it in 10 seconds

Inside this project folder:

```bash
# Start the MCP server over stdio
npm run mcp
```

### 2. Connect Your AI Agent

Add NoiceSS to your agent's config. Replace `<PATH_TO_NOICESS>` with the path to this folder (e.g., `C:/Users/1by20/Desktop/noiceSS` on Windows or `/Users/you/noiceSS` on Mac/Linux):

#### Cursor (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "noicess": {
      "command": "node",
      "args": ["<PATH_TO_NOICESS>/bin/noicess-mcp.mjs"]
    }
  }
}
```

#### Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "noicess": {
      "command": "node",
      "args": ["<PATH_TO_NOICESS>/bin/noicess-mcp.mjs"]
    }
  }
}
```

#### Windsurf (`~/.codeium/windsurf/mcp_config.json`)
```json
{
  "mcpServers": {
    "noicess": {
      "command": "node",
      "args": ["<PATH_TO_NOICESS>/bin/noicess-mcp.mjs"]
    }
  }
}
```

#### VS Code (Cline / Roo Code)
```json
{
  "mcpServers": {
    "noicess": {
      "command": "node",
      "args": ["<PATH_TO_NOICESS>/bin/noicess-mcp.mjs"]
    }
  }
}
```

#### Google Antigravity / Gemini CLI
```bash
agy mcp add noicess node <PATH_TO_NOICESS>/bin/noicess-mcp.mjs
```

#### Zed (`~/.config/zed/settings.json`)
```json
{
  "context_servers": {
    "noicess": {
      "command": {
        "path": "node",
        "args": ["<PATH_TO_NOICESS>/bin/noicess-mcp.mjs"]
      }
    }
  }
}
```

---

## What Can You Ask Your Agent To Do?

Once connected, just talk to your agent naturally:

#### 1. Blurred Background + Frosted Glass Border
> *"Take `public/preview.png`, use the screenshot itself as a blurred background with 15px blur, 16:9 ratio, 4px frosted glass border, and add a small 'made with mcp' watermark on the top right. Save it to `public/hero.webp`."*

#### 2. macOS Window Frame on Curated Wallpaper
> *"Take `screenshots/app.png`, put it on the macOS Sequoia wallpaper with 10px blur, show the macOS close/minimize buttons with window title 'App Preview', and export as a 2x retina WebP."*

#### 3. Ready-To-Paste Landing Page Code
> *"Generate responsive 3D Tailwind CSS code for `public/hero.png` using the isometric-left perspective and Safari URL bar so I can paste it into my hero section."*

#### 4. Fine-Tune in the Browser
> *"Generate a NoiceSS Studio link for this screenshot with my current settings so I can play with the 3D tilt in the browser."*

> [!TIP]
> Read **[`MCP.md`](MCP.md)** for the complete list of all 9 MCP tools, background IDs, gradients, and custom options.

---

## Features

- **macOS & Safari Frames**: Realistic title bars with red, yellow, green traffic light buttons and customizable URL bars.
- **3D Tilting**: Rotate on X, Y, and Z axes with perspective depth to give your screenshot a sleek presentation angle.
- **Frosted Glass Borders**: Translucent glass framing that samples and blurs whatever is behind it.
- **Blurred Screenshot Backdrops**: Use your own screenshot as an ambient background, smoothly blurred with zero edge leakage.
- **51 Wallpaper Presets**: Includes macOS system wallpapers, Raycast backgrounds, nature landscapes, and clean gradient fills.
- **Watermark Badge**: Add a floating frosted glass badge (`@username` or custom text) in any corner, with small, medium, or large sizes.
- **Offline PWA**: Installable on desktop or mobile. Works without internet once opened.
- **100% Private**: Zero analytics on your images. All browser processing happens on client canvas, and all MCP processing happens locally in Node.

---

## Export Options

- **Formats**: WebP (recommended for small size & high quality), PNG (lossless), and JPEG.
- **Scales**: 1x (standard), 2x (Retina displays), or 4x (Ultra HD / print).
- **Transparency**: Clean transparent background support for PNG and WebP exports.

---

## Getting Started (Local Development)

### Prerequisites

- **Node.js** 18 or newer
- **npm**, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ishivamgaur/noiceSS.git
cd noiceSS

# Install dependencies
npm install

# Start the web app
npm run dev

# Or run the MCP server
npm run mcp
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI & Components**: React 19, Tailwind CSS v4, Radix UI, Lucide Icons
- **AI / MCP**: `@modelcontextprotocol/sdk`
- **Image Compositor**: Sharp
- **State Management**: Zustand
- **Offline Engine**: Serwist PWA

---

## Contributing

Contributions are welcome! Whether it's adding new wallpaper presets, improving the compositor, or reporting bugs:

1. Check out the [Contributing Guide](CONTRIBUTING.md).
2. Create a branch: `git checkout -b feat/my-improvement`.
3. Commit your changes: `git commit -m "feat: add new gradient preset"`.
4. Open a Pull Request.

---

## License

Open-source under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">
  <sub>Built and maintained by <a href="https://github.com/ishivamgaur">@ishivgaur</a></sub>
</div>
