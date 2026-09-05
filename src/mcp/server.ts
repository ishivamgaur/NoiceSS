import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { compositeMockup } from './compositor.js';
import { generateWebsiteEmbed } from './embed.js';
import { generateStudioUrl } from './url.js';
import {
  MCP_PRESETS,
  MCP_PERSPECTIVES,
  ALL_WALLPAPERS,
  ALL_GRADIENTS,
  ALL_SOLID_COLORS,
  ALL_FILTERS,
} from './presets.js';
import type { GenerateMockupOptions, WebsiteEmbedOptions } from './types.js';

/**
 * NoiceSS Universal MCP Server
 * Runs 100% locally via Stdio (Zero server hosting cost)
 *
 * Exposes ALL studio controls: backgrounds, gradients, solid colors, filters,
 * lighting, blur, noise, ASCII overlays, watermarks, glass borders, shadows, etc.
 */
export function createNoiceServer() {
  const server = new Server(
    {
      name: 'noicess',
      version: '1.1.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  );

  // -------------------------------------------------------------
  // 1. TOOLS REGISTRATION
  // -------------------------------------------------------------
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        // ─── Core: Generate Mockup ────────────────────────────
        {
          name: 'generate_mockup',
          description:
            'Generates a pixel-perfect screenshot mockup with FULL control over every parameter: backgrounds, shadows, blur, brightness/contrast, filters, noise/grain, watermarks, ASCII overlays, glass borders, window chrome, and more. Zero cloud costs — runs 100% locally with Sharp.',
          inputSchema: {
            type: 'object',
            properties: {
              // --- Required ---
              imagePath: {
                type: 'string',
                description: 'Local file path, public URL, or base64 data URL of the screenshot to mockup.',
              },
              outputPath: {
                type: 'string',
                description: 'Target filepath for output image (e.g. "public/hero.webp", "./mockup.png").',
              },

              // --- Preset (applies all defaults from a named preset) ---
              preset: {
                type: 'string',
                description: 'Preset ID to apply as base config. Individual params override preset values.',
                enum: ['frosted-clean', 'studio-minimal', 'apple-sequoia', '3d-hero-angle', 'monterey-dark', 'safari-minimal', 'tahoe-sunset', 'pure-obsidian', 'big-sur-3d'],
              },

              // --- Background ---
              background: {
                type: 'string',
                description: 'Wallpaper filename (e.g. "dark-green-8k.webp"), "CURRENT_IMAGE" (use screenshot itself as blurred backdrop), gradient CSS string, or hex color.',
              },
              bgBlur: {
                type: 'number',
                description: 'Background blur radius in pixels (0 = none). Blurs the entire background wallpaper/gradient before compositing.',
              },

              // --- Window Chrome & View ---
              view: {
                type: 'string',
                description: 'Window chrome theme: "default" (macOS window bar), "browser" (Safari URL address bar), or "minimal" (frameless rounded screenshot).',
                enum: ['default', 'browser', 'minimal'],
              },
              showMacOsBar: {
                type: 'boolean',
                description: 'Show macOS traffic lights (red, yellow, green window buttons). Default: false.',
              },
              showBrowserBar: {
                type: 'boolean',
                description: 'Show browser-style chrome with URL bar below traffic lights. Default: false.',
              },
              browserUrl: {
                type: 'string',
                description: 'URL text displayed in browser bar (only used when showBrowserBar is true). Default: "example.com".',
              },
              windowTitle: {
                type: 'string',
                description: 'Title text centered on the macOS window bar.',
              },

              // --- Layout & Canvas Setup ---
              aspectRatio: {
                type: 'string',
                description: 'Canvas aspect ratio. "auto" matches input image ratio exactly. Options: auto, 1:1, 16:9, 9:16, 4:3, 3:2, 4:5, 21:9, 3:1, 4:1, 2:1, 2.62:1, custom. Default: "auto".',
              },
              customRatioW: {
                type: 'number',
                description: 'Custom aspect ratio width factor (when aspectRatio is "custom").',
              },
              customRatioH: {
                type: 'number',
                description: 'Custom aspect ratio height factor (when aspectRatio is "custom").',
              },
              scale: {
                type: 'number',
                description: 'Image scale percentage (20-300). Studio default: 85 (card occupies 85% of canvas).',
              },
              rotation: {
                type: 'number',
                description: 'Image rotation in degrees (0-360). Default: 0.',
              },
              isLocked: {
                type: 'boolean',
                description: 'Lock canvas position. Default: false.',
              },
              padding: {
                type: 'number',
                description: 'Canvas padding around the screenshot in pixels (0 by default; scale controls framing margin in modern studio).',
              },
              radius: {
                type: 'number',
                description: 'Corner radius in pixels for the screenshot window (0-40). Studio default: 12.',
              },

              // --- Shadow ---
              shadow: {
                type: 'number',
                description: 'Drop shadow distance master control (0-80). Studio default: 25.',
              },
              shadowBlur: {
                type: 'number',
                description: 'Shadow blur radius in pixels (0-150). Studio default: 45.',
              },
              shadowOpacity: {
                type: 'number',
                description: 'Shadow opacity percentage (0-100). Studio default: 35.',
              },
              shadowOffsetX: {
                type: 'number',
                description: 'Shadow horizontal offset in pixels (-80 to 80). Studio default: 0.',
              },
              shadowOffsetY: {
                type: 'number',
                description: 'Shadow vertical offset in pixels (-80 to 80). Studio default: 0.',
              },

              // --- Glass Border ---
              glassBorder: {
                type: 'boolean',
                description: 'Enable frosted glass frame around screenshot. Studio default: false.',
              },
              glassBorderWidth: {
                type: 'number',
                description: 'Glass border width in pixels (2-32). Studio default: 8.',
              },
              glassBorderOpacity: {
                type: 'number',
                description: 'Glass border opacity percentage (5-100). Studio default: 20.',
              },
              glassBorderBlur: {
                type: 'number',
                description: 'Glass border backdrop blur in pixels (0-60). Studio default: 20.',
              },
              glassBorderColor: {
                type: 'string',
                description: 'Glass border tint color hex. Studio default: "#ffffff".',
              },

              // --- 3D Perspective ---
              perspective: {
                type: 'string',
                description: '3D perspective preset: front, isometric-left, isometric-right, elevated, skew-left, subtle, flat-lay.',
                enum: ['front', 'isometric-left', 'isometric-right', 'elevated', 'skew-left', 'subtle', 'flat-lay'],
              },
              rotateX: { type: 'number', description: '3D X-axis rotation in degrees. Default: 0.' },
              rotateY: { type: 'number', description: '3D Y-axis rotation in degrees. Default: 0.' },
              rotateZ: { type: 'number', description: '3D Z-axis rotation in degrees. Default: 0.' },
              perspectiveDepth: { type: 'number', description: 'CSS perspective depth in pixels. Default: 1200.' },

              // --- Lighting & Color Grading (Canvas-level) ---
              brightness: {
                type: 'number',
                description: 'Canvas brightness percentage (0-300). 100 = normal. Default: 100.',
              },
              contrast: {
                type: 'number',
                description: 'Canvas contrast percentage (0-300). 100 = normal. Default: 100.',
              },
              saturation: {
                type: 'number',
                description: 'Canvas saturation percentage (0-300). 0 = grayscale, 100 = normal. Default: 100.',
              },
              hueRotate: {
                type: 'number',
                description: 'Canvas hue rotation in degrees (0-360). Default: 0.',
              },
              filter: {
                type: 'string',
                description: 'Canvas color filter preset.',
                enum: ['none', 'grayscale', 'contrast', 'warm', 'sepia', 'cool', 'cyberpunk'],
              },

              // --- Lighting & Color Grading (Image-only) ---
              imageBrightness: {
                type: 'number',
                description: 'Screenshot image brightness (0-300). Applies only to the image, not the canvas. Default: 100.',
              },
              imageContrast: {
                type: 'number',
                description: 'Screenshot image contrast (0-300). Default: 100.',
              },
              imageSaturation: {
                type: 'number',
                description: 'Screenshot image saturation (0-300). Default: 100.',
              },
              imageHueRotate: {
                type: 'number',
                description: 'Screenshot image hue rotation (0-360). Default: 0.',
              },
              imageFilter: {
                type: 'string',
                description: 'Screenshot image filter preset.',
                enum: ['none', 'grayscale', 'contrast', 'warm', 'sepia', 'cool', 'cyberpunk'],
              },

              // --- Blur ---
              imageBlur: {
                type: 'number',
                description: 'Screenshot image blur radius in pixels (0 = sharp). Default: 0.',
              },

              // --- Noise & Grain ---
              noiseIntensity: {
                type: 'number',
                description: 'Noise overlay intensity (0-100). Default: 0.',
              },
              grainIntensity: {
                type: 'number',
                description: 'Film grain overlay intensity (0-100). Default: 0.',
              },
              noiseTarget: {
                type: 'string',
                description: 'Where to apply noise: "both" (canvas+image), "image" only, or "canvas" only.',
                enum: ['both', 'image', 'canvas'],
              },

              // --- ASCII / Pattern Overlay ---
              asciiEnabled: {
                type: 'boolean',
                description: 'Enable ASCII/pattern character overlay. Default: false.',
              },
              asciiPattern: {
                type: 'string',
                description: 'ASCII pattern character to tile. Options: medium-shade, dark-shade, light-shade, block, hash, at, dot, star, cross, diamond, circle, triangle.',
                enum: ['medium-shade', 'dark-shade', 'light-shade', 'block', 'hash', 'at', 'dot', 'star', 'cross', 'diamond', 'circle', 'triangle'],
              },
              asciiSize: {
                type: 'number',
                description: 'ASCII character size in pixels. Default: 16.',
              },
              asciiOpacity: {
                type: 'number',
                description: 'ASCII overlay opacity (0-100). Default: 30.',
              },
              asciiColor: {
                type: 'string',
                description: 'ASCII character color hex. Default: "#ffffff".',
              },

              // --- Watermark & Badge ---
              watermark: {
                type: 'string',
                description: 'Watermark text to overlay (e.g. "@ishivgaur", "Built with NoiceSS").',
              },
              watermarkText: {
                type: 'string',
                description: 'Alias for watermark text.',
              },
              watermarkPlatform: {
                type: 'string',
                description: 'Platform icon for watermark badge.',
                enum: ['x', 'github', 'instagram', 'linkedin', 'globe', 'none'],
              },
              watermarkPosition: {
                type: 'string',
                description: 'Watermark position on the canvas or screenshot.',
                enum: ['bottom-right', 'bottom-left', 'bottom-center', 'top-right', 'top-left', 'top-center'],
              },
              watermarkTarget: {
                type: 'string',
                description: 'Watermark layer target: "screenshot" or "canvas".',
                enum: ['screenshot', 'canvas'],
              },
              watermarkOpacity: {
                type: 'number',
                description: 'Watermark opacity percentage (10-100). Studio default: 65.',
              },
              watermarkBlur: {
                type: 'number',
                description: 'Watermark glass blur in pixels (0-32). Studio default: 20.',
              },
              watermarkGlass: {
                type: 'string',
                description: 'Watermark badge glass style.',
                enum: ['frosted', 'dark', 'clear'],
              },
              watermarkBorderWidth: {
                type: 'number',
                description: 'Watermark badge border width in pixels (0-4). Studio default: 1.',
              },
              watermarkBorderOpacity: {
                type: 'number',
                description: 'Watermark badge border opacity (0-100). Studio default: 25.',
              },
              watermarkScale: {
                description: 'Watermark size scale. Supports browser presets "small" (85%), "medium"/"default" (100%), "large" (125%), or any custom percentage number (25-300). Studio default: 100.',
              },
              watermarkSize: {
                description: 'Alias for watermarkScale. Supports "small" (85%), "medium" (100%), "large" (125%), or custom number.',
              },
              watermarkColor: {
                type: 'string',
                description: 'Watermark text and icon color hex. Studio default: "#ffffff".',
              },

              // --- Export ---
              format: {
                type: 'string',
                description: 'Output format: "webp" (smallest), "png" (lossless), or "jpeg" (compat). Default: "webp".',
                enum: ['webp', 'png', 'jpeg', 'jpg'],
              },
              quality: {
                type: 'number',
                description: 'Output quality 1-100 (for webp/jpeg). Default: 90.',
              },
              exportScale: {
                type: 'number',
                description: 'Export resolution multiplier: 1 (1x 1080p), 2 (2x 2K), 3 (3x 4K), 4 (4x 6K). Studio default: 1.',
                enum: [1, 2, 3, 4],
              },
            },
            required: ['imagePath'],
          },
        },

        // ─── Website Embed Code ───────────────────────────────
        {
          name: 'get_website_embed',
          description:
            'Generates ready-to-paste responsive 3D HTML, Tailwind CSS, or React component code to embed a screenshot mockup directly into a website with zero server cost.',
          inputSchema: {
            type: 'object',
            properties: {
              imageSrc: {
                type: 'string',
                description: 'The image URL or path to use in the embed (e.g. "/hero.webp").',
              },
              altText: { type: 'string', description: 'Image alt text description.' },
              preset: { type: 'string', description: 'Preset style name.' },
              perspective: {
                type: 'string',
                description: '3D perspective angle.',
                enum: ['front', 'isometric-left', 'isometric-right', 'elevated', 'skew-left', 'subtle', 'flat-lay'],
              },
              showMacOsBar: { type: 'boolean', description: 'Include macOS window chrome header.' },
              showBrowserBar: { type: 'boolean', description: 'Include browser chrome header.' },
              windowTitle: { type: 'string', description: 'Title for the window header.' },
              theme: {
                type: 'string',
                enum: ['dark', 'light'],
                description: 'Window chrome theme. Default: "dark".',
              },
            },
            required: ['imageSrc'],
          },
        },

        // ─── Studio Deep Link ─────────────────────────────────
        {
          name: 'generate_studio_url',
          description:
            'Generates a pre-configured deep link to NoiceSS Studio (https://noicess.fun) with ALL your styling parameters loaded. Open the URL to fine-tune interactively.',
          inputSchema: {
            type: 'object',
            properties: {
              preset: { type: 'string', description: 'Preset ID.' },
              background: { type: 'string', description: 'Wallpaper or gradient.' },
              bgBlur: { type: 'number', description: 'Background blur radius (0-50).' },
              view: { type: 'string', description: 'Window theme: default, browser, or minimal.' },
              showMacOsBar: { type: 'boolean', description: 'Show macOS bar.' },
              showBrowserBar: { type: 'boolean', description: 'Show browser bar.' },
              browserUrl: { type: 'string', description: 'Browser URL.' },
              aspectRatio: { type: 'string', description: 'Canvas aspect ratio (auto, 16:9, 1:1, etc.).' },
              scale: { type: 'number', description: 'Image scale percentage (20-300).' },
              rotation: { type: 'number', description: 'Rotation in degrees (0-360).' },
              padding: { type: 'number', description: 'Padding in pixels.' },
              radius: { type: 'number', description: 'Corner radius.' },
              shadow: { type: 'number', description: 'Shadow depth.' },
              glassBorder: { type: 'boolean', description: 'Enable frosted glass border.' },
              glassBorderWidth: { type: 'number', description: 'Glass border width.' },
              glassBorderOpacity: { type: 'number', description: 'Glass border opacity.' },
              glassBorderBlur: { type: 'number', description: 'Glass border blur.' },
              perspective: { type: 'string', description: '3D perspective.' },
              rotateX: { type: 'number', description: 'X rotation.' },
              rotateY: { type: 'number', description: 'Y rotation.' },
              rotateZ: { type: 'number', description: 'Z rotation.' },
              brightness: { type: 'number', description: 'Brightness (0-300).' },
              contrast: { type: 'number', description: 'Contrast (0-300).' },
              saturation: { type: 'number', description: 'Saturation (0-300).' },
              hueRotate: { type: 'number', description: 'Hue rotation degrees.' },
              filter: { type: 'string', description: 'Filter preset ID.' },
              watermark: { type: 'string', description: 'Watermark text.' },
              imageSrc: { type: 'string', description: 'Initial image URL to load.' },
            },
          },
        },

        // ─── List Tools ───────────────────────────────────────
        {
          name: 'list_presets',
          description: 'Lists all 8 NoiceSS studio presets with their visual descriptions and full configurations.',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'list_backgrounds',
          description: 'Lists ALL 51 wallpapers organized by category: macOS (22), Raycast (17), Nature (12).',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Filter by category. Omit to show all.',
                enum: ['macos', 'raycast', 'nature'],
              },
            },
          },
        },
        {
          name: 'list_gradients',
          description: 'Lists all 18 gradient backgrounds with their CSS values, ready to use as the "background" parameter.',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'list_solid_colors',
          description: 'Lists all 18 solid color backgrounds (including transparent) with their hex values.',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'list_filters',
          description: 'Lists all 7 color filter presets (Monochrome, Warm Sunset, Vintage Sepia, Cool Mint, Cyber Neon, etc.) with descriptions.',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'list_perspectives',
          description: 'Lists all 7 3D perspective angles with their CSS transform rules and rotation values.',
          inputSchema: { type: 'object', properties: {} },
        },
      ],
    };
  });

  // -------------------------------------------------------------
  // 2. TOOL CALL HANDLERS
  // -------------------------------------------------------------
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'generate_mockup': {
        const options = (args || {}) as unknown as GenerateMockupOptions;
        if (!options.imagePath) {
          throw new McpError(ErrorCode.InvalidParams, 'imagePath is required');
        }

        try {
          const result = await compositeMockup(options);
          const lines = [
            `✅ Successfully generated NoiceSS screenshot mockup!`,
            `- Dimensions: ${result.width}×${result.height}px`,
            `- Format: ${result.format.toUpperCase()} (${(result.sizeBytes / 1024).toFixed(1)} KB)`,
          ];

          if (result.outputPath) {
            lines.push(`- Saved to: ${result.outputPath}`);
          } else {
            lines.push(`- Output: base64 data available`);
          }

          // Summarize applied effects
          const effects: string[] = [];
          if (options.preset) effects.push(`Preset: ${options.preset}`);
          if (options.background) effects.push(`Background: ${options.background}`);
          if (options.showMacOsBar) effects.push('macOS chrome: ON');
          if (options.showBrowserBar) effects.push('Browser chrome: ON');
          if (options.glassBorder) effects.push('Glass border: ON');
          if (options.imageBlur && options.imageBlur > 0) effects.push(`Image blur: ${options.imageBlur}px`);
          if (options.bgBlur && options.bgBlur > 0) effects.push(`BG blur: ${options.bgBlur}px`);
          if (options.filter && options.filter !== 'none') effects.push(`Filter: ${options.filter}`);
          if (options.noiseIntensity && options.noiseIntensity > 0) effects.push(`Noise: ${options.noiseIntensity}%`);
          if (options.watermarkText) effects.push(`Watermark: "${options.watermarkText}"`);
          if (options.asciiEnabled) effects.push(`ASCII overlay: ON`);
          if (options.exportScale && options.exportScale > 1) effects.push(`Export scale: ${options.exportScale}x`);

          if (effects.length > 0) {
            lines.push(`- Effects: ${effects.join(' | ')}`);
          }

          return {
            content: [{ type: 'text', text: lines.join('\n') }],
          };
        } catch (err: any) {
          return {
            isError: true,
            content: [{ type: 'text', text: `Failed to generate mockup: ${err?.message || String(err)}` }],
          };
        }
      }

      case 'get_website_embed': {
        const options = (args || {}) as unknown as WebsiteEmbedOptions;
        if (!options.imageSrc) {
          throw new McpError(ErrorCode.InvalidParams, 'imageSrc is required');
        }

        const { htmlTailwind, reactTailwind, markdown } = generateWebsiteEmbed(options);
        return {
          content: [{
            type: 'text',
            text: `### 1. Tailwind CSS / HTML (Zero-Cost 3D Mockup)\n\`\`\`html\n${htmlTailwind}\n\`\`\`\n\n### 2. React / Next.js Component\n\`\`\`tsx\n${reactTailwind}\n\`\`\`\n\n### 3. Markdown Snippet\n\`\`\`markdown\n${markdown}\n\`\`\``,
          }],
        };
      }

      case 'generate_studio_url': {
        const options = (args || {}) as any;
        const studioUrl = generateStudioUrl(options);
        return {
          content: [{ type: 'text', text: `Open your mockup directly in NoiceSS Studio:\n${studioUrl}` }],
        };
      }

      case 'list_presets': {
        const presetsSummary = MCP_PRESETS.map(
          (p) =>
            `• **${p.name}** (\`${p.id}\`): ${p.desc}\n  Background: ${p.config.background} | Perspective: ${p.config.perspective} | Padding: ${p.config.padding}px | Radius: ${p.config.radius}px | Shadow: ${p.config.shadow} | Glass border: ${p.config.glassBorder ? 'ON' : 'OFF'}`
        ).join('\n\n');

        return {
          content: [{ type: 'text', text: `### NoiceSS Studio Presets (8 total)\n\n${presetsSummary}` }],
        };
      }

      case 'list_backgrounds': {
        const category = (args as any)?.category;
        const filtered = category
          ? ALL_WALLPAPERS.filter((w) => w.category === category)
          : ALL_WALLPAPERS;

        const grouped: Record<string, typeof filtered> = {};
        for (const w of filtered) {
          if (!grouped[w.category]) grouped[w.category] = [];
          grouped[w.category].push(w);
        }

        let output = `### NoiceSS Wallpapers (${filtered.length} total)\n\n`;
        for (const [cat, items] of Object.entries(grouped)) {
          output += `**${cat.charAt(0).toUpperCase() + cat.slice(1)}** (${items.length}):\n`;
          output += items.map((w) => `• \`${w.filename}\` — ${w.name}`).join('\n');
          output += '\n\n';
        }
        output += `**Usage:** Set as the \`background\` parameter, e.g. \`"dark-green-8k.webp"\``;

        return {
          content: [{ type: 'text', text: output }],
        };
      }

      case 'list_gradients': {
        const gradientsList = ALL_GRADIENTS.map(
          (g) => `• **${g.id}**: \`${g.css}\``
        ).join('\n');

        return {
          content: [{
            type: 'text',
            text: `### NoiceSS Gradients (${ALL_GRADIENTS.length} total)\n\n${gradientsList}\n\n**Usage:** Set as the \`background\` parameter, e.g. \`"linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)"\``,
          }],
        };
      }

      case 'list_solid_colors': {
        const colorsList = ALL_SOLID_COLORS.map(
          (c) => `• **${c.name}**: \`${c.value}\``
        ).join('\n');

        return {
          content: [{
            type: 'text',
            text: `### NoiceSS Solid Colors (${ALL_SOLID_COLORS.length} total)\n\n${colorsList}\n\n**Usage:** Set as the \`background\` parameter, e.g. \`"#09090b"\` or \`"transparent"\``,
          }],
        };
      }

      case 'list_filters': {
        const filtersList = ALL_FILTERS.map(
          (f) => `• **${f.name}** (\`${f.id}\`): ${f.desc}\n  CSS: \`${f.filterStyle}\``
        ).join('\n\n');

        return {
          content: [{
            type: 'text',
            text: `### NoiceSS Color Filters (${ALL_FILTERS.length} total)\n\n${filtersList}\n\n**Usage:** Set as the \`filter\` or \`imageFilter\` parameter, e.g. \`"cyberpunk"\``,
          }],
        };
      }

      case 'list_perspectives': {
        const perspectivesSummary = MCP_PERSPECTIVES.map(
          (p) => `• **${p.name}** (\`${p.id}\`): ${p.desc}\n  CSS: \`${p.cssTransform}\`\n  Rotation: X=${p.rx}° Y=${p.ry}° Z=${p.rz}° | Depth: ${p.depth}px`
        ).join('\n\n');

        return {
          content: [{ type: 'text', text: `### NoiceSS 3D Perspectives (${MCP_PERSPECTIVES.length} total)\n\n${perspectivesSummary}` }],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  });

  // -------------------------------------------------------------
  // 3. RESOURCES REGISTRATION
  // -------------------------------------------------------------
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: 'noicess://presets',
          name: 'NoiceSS Presets Catalog',
          description: 'Machine-readable JSON of all 8 studio presets with full configurations.',
          mimeType: 'application/json',
        },
        {
          uri: 'noicess://backgrounds',
          name: 'NoiceSS Complete Backgrounds Catalog',
          description: 'Machine-readable JSON of ALL 51 wallpapers, 19 gradients, and 18 solid colors.',
          mimeType: 'application/json',
        },
        {
          uri: 'noicess://filters',
          name: 'NoiceSS Filters Catalog',
          description: 'Machine-readable JSON of all 7 color filter presets with CSS filter strings.',
          mimeType: 'application/json',
        },
      ],
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    if (uri === 'noicess://presets') {
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(MCP_PRESETS, null, 2),
        }],
      };
    }

    if (uri === 'noicess://backgrounds') {
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            wallpapers: ALL_WALLPAPERS,
            gradients: ALL_GRADIENTS,
            solidColors: ALL_SOLID_COLORS,
          }, null, 2),
        }],
      };
    }

    if (uri === 'noicess://filters') {
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(ALL_FILTERS, null, 2),
        }],
      };
    }

    throw new McpError(ErrorCode.InvalidRequest, `Unknown resource URI: ${uri}`);
  });

  // -------------------------------------------------------------
  // 4. PROMPTS REGISTRATION
  // -------------------------------------------------------------
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: [
        {
          name: 'design-mockup',
          description: 'Guide the user to create a high-converting screenshot mockup for their website or documentation.',
          arguments: [
            {
              name: 'useCase',
              description: 'The target use case (e.g., "landing-page-hero", "github-readme", "blog-post", "twitter-post")',
              required: false,
            },
          ],
        },
      ],
    };
  });

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === 'design-mockup') {
      const useCase = args?.useCase || 'landing-page-hero';
      return {
        description: 'Mockup design recommendation',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `I want to create a stunning screenshot mockup for a ${useCase}. 
Please inspect the available NoiceSS presets with \`list_presets\`, \`list_backgrounds\`, \`list_gradients\`, \`list_solid_colors\`, and \`list_filters\`, then recommend the ideal preset, perspective angle, background, color grading, and generate the mockup or embed code.`,
            },
          },
        ],
      };
    }
    throw new McpError(ErrorCode.MethodNotFound, `Unknown prompt: ${name}`);
  });

  return server;
}

/**
 * CLI Entrypoint when run via stdio
 */
export async function startStdioServer() {
  const server = createNoiceServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Log to stderr to avoid corrupting stdio JSON-RPC
  console.error('🚀 NoiceSS MCP Server v1.1.0 is running via stdio');
}
