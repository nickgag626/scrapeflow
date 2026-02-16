import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Chrome Web Store requires 1280x800 or 640x400
const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 800;

const screenshots = [
  { 
    file: 'demo-main-ui.html', 
    output: 'screenshot-1-main-ui.png',
    popupWidth: 400,
    popupHeight: 600
  },
  { 
    file: 'demo-selection.html', 
    output: 'screenshot-2-selection.png',
    popupWidth: null, // Full page demo
    popupHeight: null
  },
  { 
    file: 'demo-preview.html', 
    output: 'screenshot-3-preview.png',
    popupWidth: 400,
    popupHeight: 600
  },
  { 
    file: 'demo-templates.html', 
    output: 'screenshot-4-templates.png',
    popupWidth: 400,
    popupHeight: 650
  },
  { 
    file: 'demo-pagination.html', 
    output: 'screenshot-5-pagination.png',
    popupWidth: 400,
    popupHeight: 700
  }
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
    
    // If it's a popup demo, center it and add a browser-like background
    if (shot.popupWidth) {
      // Take full page screenshot which will be 1280x800
      const outputPath = path.join(__dirname, '..', 'screenshots', shot.output);
      await page.screenshot({ 
        path: outputPath,
        fullPage: false // Capture viewport exactly
      });
    } else {
      // Full page demo (like selection) - already 1280x800
      const outputPath = path.join(__dirname, '..', 'screenshots', shot.output);
      await page.screenshot({ 
        path: outputPath,
        fullPage: false
      });
    }
    
    console.log(`✓ Created ${shot.output} (${TARGET_WIDTH}x${TARGET_HEIGHT})`);
    await context.close();
  }

  await browser.close();
  console.log('\nAll screenshots created at 1280x800 for Chrome Web Store!');
}

takeScreenshots().catch(console.error);
