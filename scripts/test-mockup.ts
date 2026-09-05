import path from 'path';
import { compositeMockup } from '../src/mcp/compositor';

async function runMockupTest() {
  console.log('Testing NoiceSS Mockup Generation...\n');

  const projectRoot = process.cwd();
  const inputImage = path.join(projectRoot, 'public/anime-ghibli-valley.jpg');
  const outputFile = path.join(projectRoot, 'public/test-nature-mockup.webp');

  const startTime = Date.now();

  const result = await compositeMockup({
    imagePath: inputImage,
    outputPath: outputFile,
    aspectRatio: '3:2',
    background: 'chosen-nature-7.webp', // Curated nature wallpaper
    bgBlur: 15,                         // Soft blurred background
    radius: 12,                         // Default corner radius
    glassBorder: true,                  // Frosted glass border enabled
    glassBorderWidth: 8,                // 8px border width
    glassBorderBlur: 40,                // Frosted blur effect on border
    glassBorderOpacity: 50,             // 50% border opacity
    view: 'minimal',                    // Frameless minimal view (no macOS title bar)
    showMacOsBar: false,
    showBrowserBar: false,
    scale: 85,                          // Default 85% card scale
    shadow: 25,                         // Default studio shadow
    format: 'webp',
    quality: 95,
  });

  const durationMs = Date.now() - startTime;

  console.log('Test completed successfully!');
  console.log(`- Input:       ${path.basename(inputImage)}`);
  console.log(`- Output:      ${outputFile}`);
  console.log(`- Dimensions:  ${result.width} x ${result.height} px (3:2 ratio)`);
  console.log(`- Size:        ${(result.sizeBytes / 1024).toFixed(1)} KB`);
  console.log(`- Time:        ${durationMs} ms\n`);
}

runMockupTest().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
