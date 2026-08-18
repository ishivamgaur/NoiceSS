import { create } from 'zustand';

export interface StudioState {
  image: string | null;
  setImage: (v: string | null | ((prev: string | null) => string | null)) => void;
  imageDimensions: { w: number; h: number };
  setImageDimensions: (v: { w: number; h: number } | ((prev: { w: number; h: number }) => { w: number; h: number })) => void;
  imageSelected: boolean;
  setImageSelected: (v: boolean | ((prev: boolean) => boolean)) => void;
  isLocked: boolean;
  setIsLocked: (v: boolean | ((prev: boolean) => boolean)) => void;
  rotation: number;
  setRotation: (v: number | ((prev: number) => number)) => void;
  padding: number;
  setPadding: (v: number | ((prev: number) => number)) => void;
  radius: number;
  setRadius: (v: number | ((prev: number) => number)) => void;
  shadow: number;
  setShadow: (v: number | ((prev: number) => number)) => void;
  scale: number;
  setScale: (v: number | ((prev: number) => number)) => void;
  aspectRatio: string;
  setAspectRatio: (v: string | ((prev: string) => string)) => void;
  customRatioW: number | string;
  setCustomRatioW: (v: number | string | ((prev: number | string) => number | string)) => void;
  customRatioH: number | string;
  setCustomRatioH: (v: number | string | ((prev: number | string) => number | string)) => void;
  showRatioMenu: boolean;
  setShowRatioMenu: (v: boolean | ((prev: boolean) => boolean)) => void;
  showPresetsMenu: boolean;
  setShowPresetsMenu: (v: boolean | ((prev: boolean) => boolean)) => void;
  showMacOsBar: boolean;
  setShowMacOsBar: (v: boolean | ((prev: boolean) => boolean)) => void;
  showBrowserBar: boolean;
  setShowBrowserBar: (v: boolean | ((prev: boolean) => boolean)) => void;
  browserUrl: string;
  setBrowserUrl: (v: string | ((prev: string) => string)) => void;
  glassBorder: boolean;
  setGlassBorder: (v: boolean | ((prev: boolean) => boolean)) => void;
  glassBorderWidth: number;
  setGlassBorderWidth: (v: number | ((prev: number) => number)) => void;
  glassBorderBlur: number;
  setGlassBorderBlur: (v: number | ((prev: number) => number)) => void;
  glassBorderColor: string;
  setGlassBorderColor: (v: string | ((prev: string) => string)) => void;
  glassBorderOpacity: number;
  setGlassBorderOpacity: (v: number | ((prev: number) => number)) => void;
  background: string;
  setBackground: (v: string | ((prev: string) => string)) => void;
  isStorageInitialized: boolean;
  setIsStorageInitialized: (v: boolean | ((prev: boolean) => boolean)) => void;
  viewportZoom: number;
  setViewportZoom: (v: number | ((prev: number) => number)) => void;
  baseZoom: number;
  setBaseZoom: (v: number | ((prev: number) => number)) => void;
  viewportPan: { x: number; y: number };
  setViewportPan: (v: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  isPanningWorkspace: boolean;
  setIsPanningWorkspace: (v: boolean | ((prev: boolean) => boolean)) => void;
  isSpacePressed: boolean;
  setIsSpacePressed: (v: boolean | ((prev: boolean) => boolean)) => void;
  pos: { x: number; y: number };
  setPos: (v: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean | ((prev: boolean) => boolean)) => void;
  dragStart: { x: number; y: number };
  setDragStart: (v: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  isResizing: boolean;
  setIsResizing: (v: boolean | ((prev: boolean) => boolean)) => void;
  isRotating: boolean;
  setIsRotating: (v: boolean | ((prev: boolean) => boolean)) => void;
  isEditingRotation: boolean;
  setIsEditingRotation: (v: boolean | ((prev: boolean) => boolean)) => void;
  rotationInput: string;
  setRotationInput: (v: string | ((prev: string) => string)) => void;
  noiseIntensity: number;
  setNoiseIntensity: (v: number | ((prev: number) => number)) => void;
  grainIntensity: number;
  setGrainIntensity: (v: number | ((prev: number) => number)) => void;
  noiseTarget: string;
  setNoiseTarget: (v: string | ((prev: string) => string)) => void;
  imageBlur: number;
  setImageBlur: (v: number | ((prev: number) => number)) => void;
  bgBlur: number;
  setBgBlur: (v: number | ((prev: number) => number)) => void;
  brightness: number;
  setBrightness: (v: number | ((prev: number) => number)) => void;
  contrast: number;
  setContrast: (v: number | ((prev: number) => number)) => void;
  saturation: number;
  setSaturation: (v: number | ((prev: number) => number)) => void;
  hueRotate: number;
  setHueRotate: (v: number | ((prev: number) => number)) => void;
  lightingTarget: string;
  setLightingTarget: (v: string | ((prev: string) => string)) => void;
  filter: string;
  setFilter: (v: string | ((prev: string) => string)) => void;
  imageBrightness: number;
  setImageBrightness: (v: number | ((prev: number) => number)) => void;
  imageContrast: number;
  setImageContrast: (v: number | ((prev: number) => number)) => void;
  imageSaturation: number;
  setImageSaturation: (v: number | ((prev: number) => number)) => void;
  imageHueRotate: number;
  setImageHueRotate: (v: number | ((prev: number) => number)) => void;
  imageFilter: string;
  setImageFilter: (v: string | ((prev: string) => string)) => void;
  showLeftSidebar: boolean;
  setShowLeftSidebar: (v: boolean | ((prev: boolean) => boolean)) => void;
  showRightSidebar: boolean;
  setShowRightSidebar: (v: boolean | ((prev: boolean) => boolean)) => void;
  view: string;
  setView: (v: string | ((prev: string) => string)) => void;
  perspective: string;
  setPerspective: (v: string | ((prev: string) => string)) => void;
  perspectiveDepth: number;
  setPerspectiveDepth: (v: number | ((prev: number) => number)) => void;
  rotateX: number;
  setRotateX: (v: number | ((prev: number) => number)) => void;
  rotateY: number;
  setRotateY: (v: number | ((prev: number) => number)) => void;
  rotateZ: number;
  setRotateZ: (v: number | ((prev: number) => number)) => void;
  watermark: string;
  setWatermark: (v: string | ((prev: string) => string)) => void;
  watermarkPlatform: 'x' | 'github' | 'instagram' | 'linkedin' | 'globe' | 'none';
  setWatermarkPlatform: (v: 'x' | 'github' | 'instagram' | 'linkedin' | 'globe' | 'none' | ((prev: 'x' | 'github' | 'instagram' | 'linkedin' | 'globe' | 'none') => 'x' | 'github' | 'instagram' | 'linkedin' | 'globe' | 'none')) => void;
  watermarkTarget: 'screenshot' | 'canvas';
  setWatermarkTarget: (v: 'screenshot' | 'canvas' | ((prev: 'screenshot' | 'canvas') => 'screenshot' | 'canvas')) => void;
  watermarkOpacity: number;
  setWatermarkOpacity: (v: number | ((prev: number) => number)) => void;
  watermarkBlur: number;
  setWatermarkBlur: (v: number | ((prev: number) => number)) => void;
  watermarkGlass: 'frosted' | 'dark' | 'clear';
  setWatermarkGlass: (v: 'frosted' | 'dark' | 'clear' | ((prev: 'frosted' | 'dark' | 'clear') => 'frosted' | 'dark' | 'clear')) => void;
  watermarkBorderWidth: number;
  setWatermarkBorderWidth: (v: number | ((prev: number) => number)) => void;
  watermarkBorderOpacity: number;
  setWatermarkBorderOpacity: (v: number | ((prev: number) => number)) => void;
  watermarkOffsetX: number;
  setWatermarkOffsetX: (v: number | ((prev: number) => number)) => void;
  watermarkOffsetY: number;
  setWatermarkOffsetY: (v: number | ((prev: number) => number)) => void;
  watermarkScale: number;
  setWatermarkScale: (v: number | ((prev: number) => number)) => void;
  watermarkSelected: boolean;
  setWatermarkSelected: (v: boolean | ((prev: boolean) => boolean)) => void;
  watermarkPosition: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center' | string;
  setWatermarkPosition: (v: string | ((prev: string) => string)) => void;
  watermarkColor: string;
  setWatermarkColor: (v: string | ((prev: string) => string)) => void;
  watermarkSize: number;
  setWatermarkSize: (v: number | ((prev: number) => number)) => void;
  isDraggingWatermark: boolean;
  setIsDraggingWatermark: (v: boolean | ((prev: boolean) => boolean)) => void;
  watermarkCustomPos: { x: number; y: number };
  setWatermarkCustomPos: (v: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  image: null,
  setImage: (v) => set((state) => ({ image: typeof v === 'function' ? (v as Function)(state.image) : v })),
  imageDimensions: { w: 0, h: 0 },
  setImageDimensions: (v) => set((state) => ({ imageDimensions: typeof v === 'function' ? (v as Function)(state.imageDimensions) : v })),
  imageSelected: false,
  setImageSelected: (v) => set((state) => ({ imageSelected: typeof v === 'function' ? (v as Function)(state.imageSelected) : v })),
  isLocked: false,
  setIsLocked: (v) => set((state) => ({ isLocked: typeof v === 'function' ? (v as Function)(state.isLocked) : v })),
  rotation: 0,
  setRotation: (v) => set((state) => ({ rotation: typeof v === 'function' ? v(state.rotation) : v })),
  padding: 64,
  setPadding: (v) => set((state) => ({ padding: typeof v === 'function' ? (v as Function)(state.padding) : v })),
  radius: 16,
  setRadius: (v) => set((state) => ({ radius: typeof v === 'function' ? (v as Function)(state.radius) : v })),
  shadow: 25,
  setShadow: (v) => set((state) => ({ shadow: typeof v === 'function' ? (v as Function)(state.shadow) : v })),
  scale: 100,
  setScale: (v) => set((state) => ({ scale: typeof v === 'function' ? (v as Function)(state.scale) : v })),
  aspectRatio: 'auto',
  setAspectRatio: (v) => set((state) => ({ aspectRatio: typeof v === 'function' ? (v as Function)(state.aspectRatio) : v })),
  customRatioW: 16,
  setCustomRatioW: (v) => set((state) => ({ customRatioW: typeof v === 'function' ? (v as Function)(state.customRatioW) : v })),
  customRatioH: 9,
  setCustomRatioH: (v) => set((state) => ({ customRatioH: typeof v === 'function' ? (v as Function)(state.customRatioH) : v })),
  showRatioMenu: false,
  setShowRatioMenu: (v) => set((state) => ({ showRatioMenu: typeof v === 'function' ? (v as Function)(state.showRatioMenu) : v })),
  showPresetsMenu: false,
  setShowPresetsMenu: (v) => set((state) => ({ showPresetsMenu: typeof v === 'function' ? (v as Function)(state.showPresetsMenu) : v })),
  showMacOsBar: false,
  setShowMacOsBar: (v) => set((state) => ({ showMacOsBar: typeof v === 'function' ? (v as Function)(state.showMacOsBar) : v })),
  showBrowserBar: false,
  setShowBrowserBar: (v) => set((state) => ({ showBrowserBar: typeof v === 'function' ? (v as Function)(state.showBrowserBar) : v })),
  browserUrl: 'example.com',
  setBrowserUrl: (v) => set((state) => ({ browserUrl: typeof v === 'function' ? (v as Function)(state.browserUrl) : v })),
  glassBorder: false,
  setGlassBorder: (v) => set((state) => ({ glassBorder: typeof v === 'function' ? (v as Function)(state.glassBorder) : v })),
  glassBorderWidth: 8,
  setGlassBorderWidth: (v) => set((state) => ({ glassBorderWidth: typeof v === 'function' ? (v as Function)(state.glassBorderWidth) : v })),
  glassBorderBlur: 20,
  setGlassBorderBlur: (v) => set((state) => ({ glassBorderBlur: typeof v === 'function' ? (v as Function)(state.glassBorderBlur) : v })),
  glassBorderColor: '#ffffff',
  setGlassBorderColor: (v) => set((state) => ({ glassBorderColor: typeof v === 'function' ? (v as Function)(state.glassBorderColor) : v })),
  glassBorderOpacity: 20,
  setGlassBorderOpacity: (v) => set((state) => ({ glassBorderOpacity: typeof v === 'function' ? (v as Function)(state.glassBorderOpacity) : v })),
  background: 'url("/wallpapers/dark-green-8k.webp")',
  setBackground: (v) => set((state) => ({ background: typeof v === 'function' ? (v as Function)(state.background) : v })),
  isStorageInitialized: false,
  setIsStorageInitialized: (v) => set((state) => ({ isStorageInitialized: typeof v === 'function' ? (v as Function)(state.isStorageInitialized) : v })),
  viewportZoom: 1,
  setViewportZoom: (v) => set((state) => ({ viewportZoom: typeof v === 'function' ? v(state.viewportZoom) : v })),
  baseZoom: 1,
  setBaseZoom: (v) => set((state) => ({ baseZoom: typeof v === 'function' ? (v as Function)(state.baseZoom) : v })),
  viewportPan: { x: 0, y: 0 },
  setViewportPan: (v) => set((state) => ({ viewportPan: typeof v === 'function' ? v(state.viewportPan) : v })),
  isPanningWorkspace: false,
  setIsPanningWorkspace: (v) => set((state) => ({ isPanningWorkspace: typeof v === 'function' ? (v as Function)(state.isPanningWorkspace) : v })),
  isSpacePressed: false,
  setIsSpacePressed: (v) => set((state) => ({ isSpacePressed: typeof v === 'function' ? (v as Function)(state.isSpacePressed) : v })),
  pos: { x: 0, y: 0 },
  setPos: (v) => set((state) => ({ pos: typeof v === 'function' ? v(state.pos) : v })),
  isDragging: false,
  setIsDragging: (v) => set((state) => ({ isDragging: typeof v === 'function' ? (v as Function)(state.isDragging) : v })),
  dragStart: { x: 0, y: 0 },
  setDragStart: (v) => set((state) => ({ dragStart: typeof v === 'function' ? (v as Function)(state.dragStart) : v })),
  isResizing: false,
  setIsResizing: (v) => set((state) => ({ isResizing: typeof v === 'function' ? (v as Function)(state.isResizing) : v })),
  isRotating: false,
  setIsRotating: (v) => set((state) => ({ isRotating: typeof v === 'function' ? (v as Function)(state.isRotating) : v })),
  isEditingRotation: false,
  setIsEditingRotation: (v) => set((state) => ({ isEditingRotation: typeof v === 'function' ? (v as Function)(state.isEditingRotation) : v })),
  rotationInput: '0',
  setRotationInput: (v) => set((state) => ({ rotationInput: typeof v === 'function' ? (v as Function)(state.rotationInput) : v })),
  noiseIntensity: 0,
  setNoiseIntensity: (v) => set((state) => ({ noiseIntensity: typeof v === 'function' ? (v as Function)(state.noiseIntensity) : v })),
  grainIntensity: 0,
  setGrainIntensity: (v) => set((state) => ({ grainIntensity: typeof v === 'function' ? (v as Function)(state.grainIntensity) : v })),
  noiseTarget: 'both',
  setNoiseTarget: (v) => set((state) => ({ noiseTarget: typeof v === 'function' ? (v as Function)(state.noiseTarget) : v })),
  imageBlur: 0,
  setImageBlur: (v) => set((state) => ({ imageBlur: typeof v === 'function' ? (v as Function)(state.imageBlur) : v })),
  bgBlur: 0,
  setBgBlur: (v) => set((state) => ({ bgBlur: typeof v === 'function' ? (v as Function)(state.bgBlur) : v })),
  brightness: 100,
  setBrightness: (v) => set((state) => ({ brightness: typeof v === 'function' ? (v as Function)(state.brightness) : v })),
  contrast: 100,
  setContrast: (v) => set((state) => ({ contrast: typeof v === 'function' ? (v as Function)(state.contrast) : v })),
  saturation: 100,
  setSaturation: (v) => set((state) => ({ saturation: typeof v === 'function' ? (v as Function)(state.saturation) : v })),
  hueRotate: 0,
  setHueRotate: (v) => set((state) => ({ hueRotate: typeof v === 'function' ? (v as Function)(state.hueRotate) : v })),
  lightingTarget: 'image',
  setLightingTarget: (v) => set((state) => ({ lightingTarget: typeof v === 'function' ? (v as Function)(state.lightingTarget) : v })),
  filter: 'none',
  setFilter: (v) => set((state) => ({ filter: typeof v === 'function' ? (v as Function)(state.filter) : v })),
  imageBrightness: 100,
  setImageBrightness: (v) => set((state) => ({ imageBrightness: typeof v === 'function' ? (v as Function)(state.imageBrightness) : v })),
  imageContrast: 100,
  setImageContrast: (v) => set((state) => ({ imageContrast: typeof v === 'function' ? (v as Function)(state.imageContrast) : v })),
  imageSaturation: 100,
  setImageSaturation: (v) => set((state) => ({ imageSaturation: typeof v === 'function' ? (v as Function)(state.imageSaturation) : v })),
  imageHueRotate: 0,
  setImageHueRotate: (v) => set((state) => ({ imageHueRotate: typeof v === 'function' ? (v as Function)(state.imageHueRotate) : v })),
  imageFilter: 'none',
  setImageFilter: (v) => set((state) => ({ imageFilter: typeof v === 'function' ? (v as Function)(state.imageFilter) : v })),
  showLeftSidebar: false,
  setShowLeftSidebar: (v) => set((state) => ({ showLeftSidebar: typeof v === 'function' ? (v as Function)(state.showLeftSidebar) : v })),
  showRightSidebar: false,
  setShowRightSidebar: (v) => set((state) => ({ showRightSidebar: typeof v === 'function' ? (v as Function)(state.showRightSidebar) : v })),
  view: 'default',
  setView: (v) => set((state) => ({ view: typeof v === 'function' ? (v as Function)(state.view) : v })),
  perspective: 'front',
  setPerspective: (v) => set((state) => ({ perspective: typeof v === 'function' ? (v as Function)(state.perspective) : v })),
  perspectiveDepth: 1200,
  setPerspectiveDepth: (v) => set((state) => ({ perspectiveDepth: typeof v === 'function' ? (v as Function)(state.perspectiveDepth) : v })),
  rotateX: 0,
  setRotateX: (v) => set((state) => ({ rotateX: typeof v === 'function' ? (v as Function)(state.rotateX) : v })),
  rotateY: 0,
  setRotateY: (v) => set((state) => ({ rotateY: typeof v === 'function' ? (v as Function)(state.rotateY) : v })),
  rotateZ: 0,
  setRotateZ: (v) => set((state) => ({ rotateZ: typeof v === 'function' ? (v as Function)(state.rotateZ) : v })),
  watermark: '',
  setWatermark: (v) => set((state) => ({ watermark: typeof v === 'function' ? (v as Function)(state.watermark) : v })),
  watermarkPlatform: 'x',
  setWatermarkPlatform: (v) => set((state) => ({ watermarkPlatform: typeof v === 'function' ? (v as Function)(state.watermarkPlatform) : v })),
  watermarkTarget: 'screenshot',
  setWatermarkTarget: (v) => set((state) => ({ watermarkTarget: typeof v === 'function' ? (v as Function)(state.watermarkTarget) : v })),
  watermarkOpacity: 65,
  setWatermarkOpacity: (v) => set((state) => ({ watermarkOpacity: typeof v === 'function' ? v(state.watermarkOpacity) : v })),
  watermarkBlur: 20,
  setWatermarkBlur: (v) => set((state) => ({ watermarkBlur: typeof v === 'function' ? (v as Function)(state.watermarkBlur) : v })),
  watermarkGlass: 'frosted',
  setWatermarkGlass: (v) => set((state) => ({ watermarkGlass: typeof v === 'function' ? (v as Function)(state.watermarkGlass) : v })),
  watermarkBorderWidth: 1,
  setWatermarkBorderWidth: (v) => set((state) => ({ watermarkBorderWidth: typeof v === 'function' ? (v as Function)(state.watermarkBorderWidth) : v })),
  watermarkBorderOpacity: 25,
  setWatermarkBorderOpacity: (v) => set((state) => ({ watermarkBorderOpacity: typeof v === 'function' ? (v as Function)(state.watermarkBorderOpacity) : v })),
  watermarkOffsetX: 0,
  setWatermarkOffsetX: (v) => set((state) => ({ watermarkOffsetX: typeof v === 'function' ? (v as Function)(state.watermarkOffsetX) : v })),
  watermarkOffsetY: 0,
  setWatermarkOffsetY: (v) => set((state) => ({ watermarkOffsetY: typeof v === 'function' ? (v as Function)(state.watermarkOffsetY) : v })),
  watermarkScale: 100,
  setWatermarkScale: (v) => set((state) => ({ watermarkScale: typeof v === 'function' ? (v as Function)(state.watermarkScale) : v })),
  watermarkSelected: false,
  setWatermarkSelected: (v) => set((state) => ({ watermarkSelected: typeof v === 'function' ? (v as Function)(state.watermarkSelected) : v })),
  watermarkPosition: 'bottom-right',
  setWatermarkPosition: (v) => set((state) => ({ watermarkPosition: typeof v === 'function' ? (v as Function)(state.watermarkPosition) : v })),
  watermarkColor: '#ffffff',
  setWatermarkColor: (v) => set((state) => ({ watermarkColor: typeof v === 'function' ? (v as Function)(state.watermarkColor) : v })),
  watermarkSize: 20,
  setWatermarkSize: (v) => set((state) => ({ watermarkSize: typeof v === 'function' ? (v as Function)(state.watermarkSize) : v })),
  isDraggingWatermark: false,
  setIsDraggingWatermark: (v) => set((state) => ({ isDraggingWatermark: typeof v === 'function' ? (v as Function)(state.isDraggingWatermark) : v })),
  watermarkCustomPos: { x: 20, y: 20 },
  setWatermarkCustomPos: (v) => set((state) => ({ watermarkCustomPos: typeof v === 'function' ? v(state.watermarkCustomPos) : v })),
}));
