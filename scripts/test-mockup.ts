import path from 'path';
import { compositeMockup } from '../src/mcp/compositor';

async function runMockupTest() {
  console.log('Testing NoiceSS macOS Titlebar & Browser Bar with local code...\n');

  const projectRoot = process.cwd();
  const inputImage = path.join(projectRoot, 'public/anime-ghibli-valley.jpg');

  // Test 1: Safari Browser Bar with URL
  const outSafari = path.join(projectRoot, '.test-safari.webp');
  console.log('1. Generating Safari Browser Bar (16:9 on macOS Sequoia)...');
  const resSafari = await compositeMockup({
    imagePath: inputImage,
    outputPath: outSafari,
    aspectRatio: '16:9',
    background: 'macos-sequoia.webp',
    bgBlur: 10,
    radius: 14,
    view: 'browser',
    showMacOsBar: true,
    showBrowserBar: true,
    browserUrl: 'ghibli-valley.art',
    scale: 85,
    shadow: 35,
    format: 'webp',
    quality: 95,
  });
  console.log(`   Safari test passed: ${resSafari.width} x ${resSafari.height} px (${(resSafari.sizeBytes / 1024).toFixed(1)} KB)`);

  // Test 2: macOS Window Titlebar with centered Title
  const outTitle = path.join(projectRoot, '.test-title.webp');
  console.log('\n2. Generating macOS Titlebar with Window Title (16:9 on macOS Sequoia)...');
  const resTitle = await compositeMockup({
    imagePath: inputImage,
    outputPath: outTitle,
    aspectRatio: '16:9',
    background: 'macos-sequoia.webp',
    bgBlur: 10,
    radius: 14,
    view: 'default',
    showMacOsBar: true,
    showBrowserBar: false,
    windowTitle: 'Studio Ghibli: Valley Cottage',
    scale: 85,
    shadow: 35,
    format: 'webp',
    quality: 95,
  });
  console.log(`   Title test passed: ${resTitle.width} x ${resTitle.height} px (${(resTitle.sizeBytes / 1024).toFixed(1)} KB)`);

  // Clean up temporary test files
  const fs = await import('fs/promises');
  await fs.unlink(outSafari).catch(() => {});
  await fs.unlink(outTitle).catch(() => {});

  console.log('\nAll macOS Titlebar tests completed successfully! (cleaned up temp files)');
}

runMockupTest().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
