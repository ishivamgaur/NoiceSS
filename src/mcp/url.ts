import type { MockupConfig } from './types.js';

/**
 * Serializes mockup parameters into a shareable NoiceSS Studio URL.
 * When opened, the client-side app hydrates these parameters directly into the canvas.
 * Supports ALL controls for full round-trip parity.
 */
export function generateStudioUrl(
  options: MockupConfig & { imageSrc?: string; baseUrl?: string }
): string {
  const base = options.baseUrl || 'https://noicess.fun';
  const params = new URLSearchParams();

  // Background
  if (options.background) params.set('bg', options.background);
  if (options.bgBlur !== undefined && options.bgBlur > 0) params.set('bgBlur', String(options.bgBlur));

  // Preset & Perspective
  if (options.preset) params.set('preset', options.preset);
  if (options.perspective) params.set('perspective', options.perspective);

  // Window Chrome & View
  if (options.view) params.set('view', options.view);
  if (options.showMacOsBar !== undefined) params.set('chrome', options.showMacOsBar ? '1' : '0');
  if (options.showBrowserBar !== undefined) params.set('browser', options.showBrowserBar ? '1' : '0');
  if (options.browserUrl) params.set('browserUrl', options.browserUrl);

  // Layout & Aspect Ratio
  if (options.aspectRatio) params.set('aspect', options.aspectRatio);
  if (options.padding !== undefined) params.set('padding', String(options.padding));
  if (options.radius !== undefined) params.set('radius', String(options.radius));
  if (options.scale !== undefined && options.scale !== 100) params.set('scale', String(options.scale));
  if (options.rotation !== undefined && options.rotation !== 0) params.set('rotation', String(options.rotation));

  // Shadow
  if (options.shadow !== undefined) params.set('shadow', String(options.shadow));
  if (options.shadowBlur !== undefined) params.set('shadowBlur', String(options.shadowBlur));
  if (options.shadowOpacity !== undefined) params.set('shadowOpacity', String(options.shadowOpacity));
  if (options.shadowOffsetX !== undefined && options.shadowOffsetX !== 0) params.set('shadowOffsetX', String(options.shadowOffsetX));
  if (options.shadowOffsetY !== undefined && options.shadowOffsetY !== 6) params.set('shadowOffsetY', String(options.shadowOffsetY));

  // Glass Border
  if (options.glassBorder !== undefined) params.set('glassBorder', options.glassBorder ? '1' : '0');
  if (options.glassBorderWidth !== undefined) params.set('gbWidth', String(options.glassBorderWidth));
  if (options.glassBorderOpacity !== undefined) params.set('gbOpacity', String(options.glassBorderOpacity));
  if (options.glassBorderBlur !== undefined) params.set('gbBlur', String(options.glassBorderBlur));

  // 3D Rotation
  if (options.rotateX !== undefined) params.set('rx', String(options.rotateX));
  if (options.rotateY !== undefined) params.set('ry', String(options.rotateY));
  if (options.rotateZ !== undefined) params.set('rz', String(options.rotateZ));
  if (options.perspectiveDepth !== undefined && options.perspectiveDepth !== 1200) params.set('depth', String(options.perspectiveDepth));

  // Lighting
  if (options.brightness !== undefined && options.brightness !== 100) params.set('brightness', String(options.brightness));
  if (options.contrast !== undefined && options.contrast !== 100) params.set('contrast', String(options.contrast));
  if (options.saturation !== undefined && options.saturation !== 100) params.set('saturation', String(options.saturation));
  if (options.hueRotate !== undefined && options.hueRotate !== 0) params.set('hueRotate', String(options.hueRotate));
  if (options.filter && options.filter !== 'none') params.set('filter', options.filter);

  // Image-level Lighting
  if (options.imageBrightness !== undefined && options.imageBrightness !== 100) params.set('imgBrightness', String(options.imageBrightness));
  if (options.imageContrast !== undefined && options.imageContrast !== 100) params.set('imgContrast', String(options.imageContrast));
  if (options.imageSaturation !== undefined && options.imageSaturation !== 100) params.set('imgSaturation', String(options.imageSaturation));
  if (options.imageHueRotate !== undefined && options.imageHueRotate !== 0) params.set('imgHueRotate', String(options.imageHueRotate));
  if (options.imageFilter && options.imageFilter !== 'none') params.set('imgFilter', String(options.imageFilter));

  // Blur
  if (options.imageBlur !== undefined && options.imageBlur > 0) params.set('imageBlur', String(options.imageBlur));

  // Noise & Grain
  if (options.noiseIntensity !== undefined && options.noiseIntensity > 0) params.set('noise', String(options.noiseIntensity));
  if (options.grainIntensity !== undefined && options.grainIntensity > 0) params.set('grain', String(options.grainIntensity));

  // Watermark
  const wm = options.watermark || options.watermarkText;
  if (wm) params.set('watermark', wm);

  // Image source
  if (options.imageSrc) params.set('img', options.imageSrc);

  const query = params.toString();
  return query ? `${base}/#${query}` : base;
}
