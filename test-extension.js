import { chromium, Browser, BrowserContext, Page } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXTENSION_PATH = path.join(__dirname, 'dist');

async function testExtension() {
  console.log('🚀 Starting ScrapeFlow Extension Test');
  console.log('Extension path:', EXTENSION_PATH);

  const browser = await chromium.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`
    ]
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Test 1: Navigate to a simple page
  console.log('📄 Test 1: Loading test page...');
  await page.goto('https://news.ycombinator.com');
  await page.waitForTimeout(2000);
  console.log('✅ Page loaded:', await page.title());

  // Test 2: Open extension popup
  console.log('\n🧩 Test 2: Opening extension popup...');
  const extensionId = await getExtensionId(browser, EXTENSION_PATH);
  console.log('Extension ID:', extensionId);

  if (extensionId) {
    const popupUrl = `chrome-extension://${extensionId}/popup.html`;
    const popupPage = await context.newPage();
    await popupPage.goto(popupUrl);
    await popupPage.waitForTimeout(1000);
    
    // Check if popup loaded correctly
    const content = await popupPage.content();
    if (content.includes('ScrapeFlow')) {
      console.log('✅ Popup loaded successfully');
    } else {
      console.log('❌ Popup content check failed');
      console.log('Content preview:', content.substring(0, 500));
    }
    
    await popupPage.close();
  }

  // Test 3: Test content script injection
  console.log('\n🎯 Test 3: Testing content script...');
  await page.bringToFront();
  
  // Inject a test to verify content script is loaded
  const contentScriptLoaded = await page.evaluate(() => {
    return typeof window !== 'undefined';
  });
  
  if (contentScriptLoaded) {
    console.log('✅ Content script context available');
  } else {
    console.log('❌ Content script not accessible');
  }

  // Test 4: Test element selection (manual for now)
  console.log('\n👆 Test 4: Manual testing instructions:');
  console.log('1. Click the ScrapeFlow extension icon in the toolbar');
  console.log('2. Click "+ New Scraper"');
  console.log('3. Click "Add Column"');
  console.log('4. Hover over and click a story title on HN');
  console.log('5. Check if similar items are detected');

  console.log('\n⏳ Browser will stay open for 30 seconds for manual testing...');
  await page.waitForTimeout(30000);

  await browser.close();
  console.log('\n✅ Test completed');
}

async function getExtensionId(browser: Browser, extensionPath: string): Promise<string | null> {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto('chrome://extensions/');
    await page.waitForTimeout(1000);
    
    // Try to get extension ID from the extensions page
    const extensions = await page.evaluate(() => {
      const items = document.querySelectorAll('extensions-item');
      return Array.from(items).map(item => ({
        id: item.getAttribute('id'),
        name: item.querySelector('#name')?.textContent
      }));
    });
    
    await context.close();
    
    // Find ScrapeFlow extension
    const scrapeFlowExt = extensions.find((e: any) => e.name?.includes('ScrapeFlow'));
    return scrapeFlowExt?.id || null;
  } catch (error) {
    await context.close();
    console.error('Failed to get extension ID:', error);
    return null;
  }
}

testExtension().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
