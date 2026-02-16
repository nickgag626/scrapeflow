import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const images = [
  { 
    file: 'promo-small.html', 
    output: 'promo-small-440x280.png',
    width: 440,
    height: 280
  },
  { 
    file: 'promo-marquee.html', 
    output: 'promo-marquee-1400x560.png',
    width: 1400,
    height: 560
  },
  { 
    file: 'icon.html', 
    output: 'icon-128x128.png',
    width: 128,
    height: 128
  }
];

async function generateImages() {
  const browser = await chromium.launch({ headless: true });

  for (const img of images) {
    const context = await browser.newContext({
      viewport: { width: img.width, height: img.height }
    });
    const page = await context.newPage();
    
    const filePath = `file://${path.join(__dirname, img.file)}`;
    await page.goto(filePath, { waitUntil: 'networkidle' });
    
    const outputPath = path.join(__dirname, img.output);
    await page.screenshot({ 
      path: outputPath,
      fullPage: false
    });
    
    console.log(`✓ Created ${img.output} (${img.width}x${img.height})`);
    await context.close();
  }

  await browser.close();
  console.log('\n✅ All promo images ready for Chrome Web Store!');
}

generateImages().catch(console.error);
