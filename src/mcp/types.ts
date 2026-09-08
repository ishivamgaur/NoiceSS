export type ImageFormat = 'png' | 'jpeg' | 'jpg' | 'webp';

export type PerspectiveId =
  | 'front'
  | 'isometric-left'
  | 'isometric-right'
  | 'elevated'
  | 'skew-left'
  | 'subtle'
  | 'flat-lay';

export type FilterId =
  | 'none'
  | 'grayscale'
  | 'contrast'
  | 'warm'
  | 'sepia'
  | 'cool'
  | 'cyberpunk';

export type WatermarkPlatform = 'x' | 'github' | 'instagram' | 'linkedin' | 'globe' | 'none';
export type WatermarkPosition = 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center';
export type WatermarkGlass = 'frosted' | 'dark' | 'clear';
export type NoiseTarget = 'both' | 'image' | 'canvas';
export type LightingTarget = 'image' | 'canvas' | 'both';
export type AsciiTarget = 'canvas' | 'image' | 'both';

export interface MockupConfig {
  // --- Preset ---
  preset?: string;

  // --- Background ---
  background?: string;
  bgBlur?: number | 'off' | 'less' | 'soft' | 'default' | 'medium' | 'more' | 'frosted' | string;

  // --- Window Chrome & View ---
  view?: 'default' | 'browser' | 'minimal';
  showMacOsBar?: boolean;
  showBrowserBar?: boolean;
  browserUrl?: string;
  windowTitle?: string;

  // --- Layout & Canvas Setup ---
  padding?: number;
  radius?: number;
  scale?: number;
  rotation?: number;
  isLocked?: boolean;
  aspectRatio?: string;
  customRatioW?: number | string;
  customRatioH?: number | string;

  // --- Shadow ---
  shadow?: number;
  shadowBlur?: number;
  shadowOpacity?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;

  // --- Glass Border ---
  glassBorder?: boolean;
  glassBorderWidth?: number;
  glassBorderOpacity?: number;
  glassBorderBlur?: number;
  glassBorderColor?: string;

  // --- 3D Perspective ---
  perspective?: PerspectiveId;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  perspectiveDepth?: number;

  // --- Lighting & Color Grading (Canvas) ---
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hueRotate?: number;
  filter?: FilterId | string;

  // --- Lighting & Color Grading (Image-only) ---
  imageBrightness?: number;
  imageContrast?: number;
  imageSaturation?: number;
  imageHueRotate?: number;
  imageFilter?: FilterId | string;
  lightingTarget?: LightingTarget;

  // --- Blur ---
  imageBlur?: number;

  // --- Noise & Grain ---
  noiseIntensity?: number;
  grainIntensity?: number;
  noiseTarget?: NoiseTarget;

  // --- ASCII / Pattern Overlay ---
  asciiEnabled?: boolean;
  asciiPattern?: string;
  asciiSize?: number;
  asciiOpacity?: number;
  asciiTarget?: AsciiTarget;
  asciiColor?: string;

  // --- Watermark & Badge ---
  watermark?: string;
  watermarkText?: string;
  watermarkPlatform?: WatermarkPlatform;
  watermarkPosition?: WatermarkPosition;
  watermarkTarget?: 'screenshot' | 'canvas';
  watermarkOpacity?: number;
  watermarkBlur?: number | 'off' | 'less' | 'soft' | 'default' | 'frosted' | 'more' | 'deep' | string;
  watermarkGlass?: WatermarkGlass;
  watermarkBorderWidth?: number;
  watermarkBorderOpacity?: number;
  watermarkOffsetX?: number;
  watermarkOffsetY?: number;
  watermarkScale?: number | 'small' | 'medium' | 'large' | 'default';
  watermarkColor?: string;
  watermarkSize?: number | 'small' | 'medium' | 'large' | 'default';

  // --- Export ---
  format?: ImageFormat;
  quality?: number;
  exportScale?: number;
  resolution?: '1080p' | '2k' | '4k' | '8k' | string;
  targetWidth?: number;
  targetHeight?: number;
}

export interface GenerateMockupOptions extends MockupConfig {
  imagePath: string;
  outputPath?: string;
  preset?: string;
}

export interface BatchMockupOptions extends MockupConfig {
  inputPaths?: string[];
  inputDir?: string;
  outputDir: string;
  preset?: string;
  pattern?: string;
}

export interface BatchMockupItemResult {
  inputPath: string;
  outputPath?: string;
  width?: number;
  height?: number;
  format?: string;
  sizeBytes?: number;
  success: boolean;
  error?: string;
}

export interface WebsiteEmbedOptions {
  imageSrc: string;
  altText?: string;
  preset?: string;
  perspective?: PerspectiveId;
  showMacOsBar?: boolean;
  showBrowserBar?: boolean;
  windowTitle?: string;
  theme?: 'dark' | 'light';
  framework?: 'html-tailwind' | 'react-tailwind' | 'pure-css';
}
