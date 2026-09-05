# NoiceSS MCP Server

Use NoiceSS directly inside your AI coding assistant: **Cursor, Claude Desktop, Windsurf, VS Code (Cline / Roo Code), Google Antigravity, or Zed**.

Instead of switching tabs to open Figma or drag images into a browser, you can tell your AI agent to make your screenshots look great, add macOS window frames, apply blurred backgrounds, and generate responsive landing page code.

---

## Why NoiceSS MCP?

- **100% Local & Free**: Runs on your machine with Node.js. No API keys, no subscriptions, and zero cloud server costs.
- **Private**: Your screenshots and code never get uploaded anywhere.
- **Fast**: Generates high-resolution WebP, PNG, and JPEG mockups in milliseconds using Sharp.
- **Studio Quality**: Frosted glass borders, blurred backgrounds, macOS traffic lights, and watermark badges look just like the web studio.
- **Code Generation**: Emits clean, copy-paste Tailwind CSS and React components with 3D tilt for your websites.

---

## Agent Setup (1 Minute)

Connect NoiceSS directly from GitHub without cloning or downloading:

### Cursor (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "noicess": {
      "command": "npx",
      "args": ["-y", "github:ishivamgaur/noiceSS"]
    }
  }
}
```

### Claude Desktop (`claude_desktop_config.json`)
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "noicess": {
      "command": "npx",
      "args": ["-y", "github:ishivamgaur/noiceSS"]
    }
  }
}
```

### Windsurf (`~/.codeium/windsurf/mcp_config.json`)
```json
{
  "mcpServers": {
    "noicess": {
      "command": "npx",
      "args": ["-y", "github:ishivamgaur/noiceSS"]
    }
  }
}
```

### VS Code (Cline / Roo Code / OpenCode)
Add to your extension's MCP configuration (`cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "noicess": {
      "command": "npx",
      "args": ["-y", "github:ishivamgaur/noiceSS"]
    }
  }
}
```

### Google Antigravity / Gemini CLI
```bash
agy mcp add noicess npx -y github:ishivamgaur/noiceSS
```

### Zed (`~/.config/zed/settings.json`)
```json
{
  "context_servers": {
    "noicess": {
      "command": {
        "path": "npx",
        "args": ["-y", "github:ishivamgaur/noiceSS"]
      }
    }
  }
}
```

*(Note: If working locally inside this cloned repository, you can also use `"command": "node", "args": ["bin/noicess-mcp.mjs"]`).*

---

## Available Tools

The MCP server provides 9 tools to your agent:

### 1. `generate_mockup`
The main rendering tool. Takes an image and wraps it with backgrounds, window frames, drop shadows, glass borders, and watermarks.

| Category | Option | Type | What it does |
| :--- | :--- | :--- | :--- |
| **Input / Output** | `imagePath` | `string` *(required)* | File path to input image (e.g., `public/screenshot.png`) |
| | `outputPath` | `string` | Where to save the output file (e.g., `public/hero.webp`) |
| | `preset` | `string` | One-click preset ID: `studio-minimal`, `apple-sequoia`, `3d-hero-angle`, `monterey-dark`, `safari-minimal`, `tahoe-sunset`, `pure-obsidian`, `big-sur-3d` |
| **Background** | `background` | `string` | Wallpaper name (`macos-sequoia.webp`), `"CURRENT_IMAGE"` (uses screenshot as blurred background), hex color (`#09090b`), or CSS gradient |
| | `bgBlur` | `number` | Background blur amount in pixels (default: `25` when using screenshot) |
| **Canvas & Sizing** | `aspectRatio` | `string` | `"auto"` (keeps original ratio), `"16:9"`, `"4:3"`, `"1:1"`, `"9:16"`, or `"21:9"` |
| | `scale` | `number` | How much space the card takes up on the canvas (default: `85`, max: `300`) |
| | `padding` | `number` | Extra outer spacing around canvas in pixels |
| | `radius` | `number` | Window corner roundness in pixels (default: `12`) |
| | `rotation` | `number` | Card rotation angle in degrees (`0` to `360`) |
| **Window Frame** | `view` | `string` | Frame style: `"default"` (macOS titlebar), `"browser"` (Safari address bar), or `"minimal"` (frameless) |
| | `showMacOsBar` | `boolean` | Show red/yellow/green traffic light buttons |
| | `showBrowserBar` | `boolean` | Show Safari address bar |
| | `browserUrl` | `string` | Address bar text (default: `"example.com"`) |
| | `windowTitle` | `string` | Title shown in the macOS bar |
| **Frosted Glass** | `glassBorder` | `boolean` | Add frosted glass frame around screenshot (default: `false`) |
| | `glassBorderWidth` | `number` | Glass border width in pixels (e.g. `4` or `8`) |
| | `glassBorderBlur` | `number` | Blur strength behind the glass border (default: `20`) |
| | `glassBorderOpacity`| `number` | White glass sheen opacity percentage (default: `20`-`25`) |
| **Shadow** | `shadow` | `number` | Shadow spread (`0` to `80`, default: `25`) |
| | `shadowBlur` | `number` | Shadow blur radius in pixels (default: `45`) |
| | `shadowOpacity` | `number` | Shadow dark intensity percentage (default: `35`) |
| **Watermark Badge**| `watermark` | `string` | Badge text (e.g. `"@ishivgaur"`, `"made with mcp"`) |
| | `watermarkPosition`| `string` | `"top-right"`, `"bottom-right"`, `"bottom-left"`, `"bottom-center"`, `"top-left"` |
| | `watermarkScale` | `string` / `number` | Badge size: `'small'` (85%), `'medium'` (100%), `'large'` (125%), or a percentage number |
| | `watermarkBlur` | `number` | Frosted blur strength behind badge (default: `20`) |
| | `watermarkGlass` | `string` | Badge style: `'frosted'` (translucent white wash), `'dark'`, or `'clear'` |
| | `watermarkOpacity` | `number` | Text opacity percentage (default: `85`) |
| **Color & Lighting**| `brightness` | `number` | Brightness level (default: `100`%) |
| | `contrast` | `number` | Contrast level (default: `100`%) |
| | `saturation` | `number` | Saturation level (default: `100`%, `0` = black and white) |
| | `hueRotate` | `number` | Color hue rotation in degrees (`0` to `360`) |
| | `filter` | `string` | Color filter: `none`, `grayscale`, `contrast`, `warm`, `sepia`, `cool`, `cyberpunk` |
| **Texture & Noise** | `grainIntensity` | `number` | Film grain amount (`0` to `100`) |
| | `noiseIntensity` | `number` | Texture noise amount (`0` to `100`) |
| **Export** | `format` | `string` | Output format: `'webp'`, `'png'`, or `'jpeg'` (default: `'webp'`) |
| | `quality` | `number` | Image quality (`1` to `100`, default: `95`) |
| | `exportScale` | `number` | Size multiplier: `1` (1x), `2` (2x Retina), `4` (4x Ultra HD) |

---

### 2. `get_website_embed`
Generates clean, responsive HTML, Tailwind CSS, or React component code with 3D tilt to drop directly into your marketing website or landing page.

```typescript
// Example call:
{
  imageSrc: "/dashboard.png",
  perspective: "isometric-left",
  showMacOsBar: true,
  windowTitle: "Analytics Dashboard"
}
```

---

### 3. `generate_studio_url`
Creates a shareable link with all settings saved in the URL. Click it to open NoiceSS Studio in your browser and adjust sliders in real-time.

---

### 4. Catalog Tools
Lets your AI agent discover all available built-in assets:

- `list_presets`: Returns 8 ready-to-use style presets.
- `list_backgrounds`: Lists 51 wallpapers across macOS, Raycast, and Nature collections.
- `list_gradients`: Lists 18 curated gradient backgrounds.
- `list_solid_colors`: Lists 18 clean solid colors and transparent options.
- `list_filters`: Lists 7 color filters.
- `list_perspectives`: Lists 7 3D tilt angles.

---

## Example Prompts to Try

Once registered with your editor, talk to your agent naturally:

#### Blurred Background with Frosted Border
> "Take `public/preview.png`, use the screenshot itself as the blurred background with 15px blur, 16:9 ratio, 4px frosted glass border, and add a small 'made with mcp' watermark on the top right. Save to `public/hero.webp`."

#### macOS Window on Wallpaper
> "Take `screenshots/app.png`, put it on the macOS Sequoia wallpaper with 10px blur, add macOS buttons with title 'Analytics', and export as a 2x retina WebP."

#### Dark Mode 4:3 Mockup
> "Generate a 4:3 mockup of `assets/code.png` with a `#09090b` dark background, 8px frosted border, 35px drop shadow, and minimal frameless view. Save to `public/mockup.png`."

#### Landing Page Hero Component
> "Generate responsive 3D Tailwind CSS code for `public/hero.png` using the isometric-left perspective and Safari address bar so I can paste it into my website."

---

## Optional: Publishing as an NPM Package

If you want anyone to run your MCP server with `npx`:

1. Check `bin` field in `package.json`:
   ```json
   {
     "name": "noicess-mcp",
     "version": "1.0.0",
     "bin": {
       "noicess-mcp": "./bin/noicess-mcp.mjs"
     }
   }
   ```
2. Publish:
   ```bash
   npm publish --access public
   ```
3. Anyone can now add it with zero installation:
   ```json
   {
     "mcpServers": {
       "noicess": {
         "command": "npx",
         "args": ["-y", "noicess-mcp"]
       }
     }
   }
   ```
