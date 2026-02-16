import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const screenshots = [
  { 
    file: 'demo-main-ui.html', 
    output: 'screenshot-1-main-ui.png',
    width: 380,
    height: 550
  },
  { 
    file: 'demo-selection.html', 
    output: 'screenshot-2-selection.png',
    width: 1280,
    height: 800
  },
  { 
    file: 'demo-preview.html', 
    output: 'screenshot-3-preview.png',
    width: 380,
    height: 550
  },
  { 
    file: 'demo-templates.html', 
    output: 'screenshot-4-templates.png',
    width: 380,
    height: 600
  },
  { 
    file: 'demo-pagination.html', 
    output: 'screenshot-5-pagination.png',
    width: 380,
    height: 650
  }
];

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });

  for (const shot of screenshots) {
    const context = await browser.newContext({
      viewport: { width: shot.width, height: shot.height }
    });
    const page = await context.newPage();
    
    const filePath = `file://${path.join(__dirname, '..', 'screenshots', shot.file)}`;
    await page.goto(filePath, { waitUntil: 'networkidle' });
    
    const outputPath = path.join(__dirname, '..', 'screenshots', shot.output);
    await page.screenshot({ 
      path: outputPath,
      fullPage: false
    });
    
    console.log(`✓ Created ${shot.output}`);
    await context.close();
  }

  await browser.close();
  console.log('\nAll screenshots created successfully!');
  console.log('Location: /workspace/scrapeflow/screenshots/');
}

takeScreenshots().catch(console.error);
