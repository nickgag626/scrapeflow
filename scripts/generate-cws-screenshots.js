import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Chrome Web Store requires 1280x800 or 640x400
const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 800;

const screenshots = [
  { file: 'demo-cws-1.html', output: 'screenshot-1-main-ui.png' },
  { file: 'demo-cws-2.html', output: 'screenshot-2-selection.png' },
  { file: 'demo-cws-3.html', output: 'screenshot-3-preview.png' },
  { file: 'demo-cws-4.html', output: 'screenshot-4-templates.png' },
  { file: 'demo-cws-5.html', output: 'screenshot-5-pagination.png' }
];

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });

  for (const shot of screenshots) {
    const context = await browser.newContext({
      viewport: { width: TARGET_WIDTH, height: TARGET_HEIGHT }
    });
    const page = await context.newPage();
    
    const filePath = `file://${path.join(__dirname, '..', 'screenshots', shot.file)}`;
    await page.goto(filePath, { waitUntil: 'networkidle' });
    
    const outputPath = path.join(__dirname, '..', 'screenshots', shot.output);
    await page.screenshot({ 
      path: outputPath,
      fullPage: false // Capture viewport exactly at 1280x800
    });
    
    console.log(`✓ Created ${shot.output} (${TARGET_WIDTH}x${TARGET_HEIGHT})`);
    await context.close();
  }

  await browser.close();
  console.log('\n✅ All screenshots ready for Chrome Web Store!');
  console.log('Format: 1280x800 PNG (no alpha)');
}

takeScreenshots().catch(console.error);
