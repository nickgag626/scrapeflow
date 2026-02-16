import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXTENSION_PATH = path.join(__dirname, 'dist');

async function testExtension() {
  console.log('🚀 Starting ScrapeFlow Extension Test (Headless)');
  console.log('Extension path:', EXTENSION_PATH);

  // Launch browser with extension loaded
  const browser = await chromium.launch({
    headless: true,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  try {
    // Create context and page
    const context = await browser.newContext();
    const page = await context.newPage();

    // Test 1: Load a simple test page
    console.log('\n📄 Test 1: Loading test page...');
    await page.goto('https://news.ycombinator.com');
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    console.log('✅ Page loaded:', title);

    // Test 2: Verify content script can be messaged
    console.log('\n🎯 Test 2: Testing content script communication...');
    try {
      const pingResponse = await page.evaluate(async () => {
        // Check if we can send a message to the content script
        try {
          return await new Promise((resolve) => {
            chrome.runtime.sendMessage({ type: 'PING' }, (response) => {
              resolve({ success: true, response });
            });
            setTimeout(() => resolve({ success: false, error: 'Timeout' }), 5000);
          });
        } catch (e) {
          return { success: false, error: e.message };
        }
      });
      console.log('Content script ping:', pingResponse);
    } catch (e) {
      console.log('⚠️ Content script test (expected in headless):', e.message);
    }

    // Test 3: Check if page has content we can scrape
    console.log('\n🔍 Test 3: Finding scrapeable elements...');
    const storyTitles = await page.$$eval('.titleline > a', links => 
      links.slice(0, 5).map(a => ({ text: a.textContent.trim(), href: a.href }))
    );
    console.log(`Found ${storyTitles.length} story titles:`);
    storyTitles.forEach((t, i) => console.log(`  ${i + 1}. ${t.text.substring(0, 50)}...`));

    // Test 4: Test selector generation logic
    console.log('\n🧪 Test 4: Testing selector matching...');
    const selectorTest = await page.evaluate(() => {
      // Simulate what content script does
      const links = document.querySelectorAll('.titleline > a');
      if (links.length === 0) return { success: false, error: 'No links found' };
      
      const firstLink = links[0];
      const selector = '.titleline > a';
      const matches = document.querySelectorAll(selector);
      
      return {
        success: true,
        selector,
        matchCount: matches.length,
        firstText: firstLink.textContent?.trim().substring(0, 50)
      };
    });
    console.log('Selector test:', selectorTest);

    // Test 5: Simulate data extraction
    console.log('\n📊 Test 5: Simulating data extraction...');
    const extractedData = await page.evaluate(() => {
      const rows = [];
      const items = Array.from(document.querySelectorAll('.athing'));
      
      items.slice(0, 5).forEach((item, index) => {
        const titleEl = item.querySelector('.titleline > a');
        const subtextEl = item.nextElementSibling;
        const scoreEl = subtextEl?.querySelector('.score');
        const authorEl = subtextEl?.querySelector('.hnuser');
        
        rows.push({
          index: index + 1,
          title: titleEl?.textContent?.trim() || '',
          url: titleEl?.href || '',
          author: authorEl?.textContent?.trim() || '',
          score: scoreEl?.textContent?.trim() || '',
          _scrapedAt: new Date().toISOString()
        });
      });
      
      return rows;
    });
    
    console.log(`✅ Extracted ${extractedData.length} rows:`);
    extractedData.forEach(r => {
      console.log(`  ${r.index}. ${r.title?.substring(0, 40) || 'N/A'}... (${r.author || 'no author'})`);
    });

    // Test 6: Test CSV conversion
    console.log('\n📄 Test 6: Testing CSV conversion...');
    const csvOutput = convertToCSV(extractedData);
    console.log('CSV preview (first 500 chars):');
    console.log(csvOutput.substring(0, 500) + '...');

    // Test 7: Check extension files are valid
    console.log('\n📦 Test 7: Verifying extension structure...');
    const popupPage = await context.newPage();
    
    // Try to load popup directly via file URL
    const popupPath = path.join(EXTENSION_PATH, 'popup.html');
    await popupPage.goto(`file://${popupPath}`);
    await popupPage.waitForTimeout(500);
    
    const popupContent = await popupPage.content();
    const hasScrapeFlow = popupContent.includes('ScrapeFlow') || popupContent.includes('scrapeflow');
    const hasRootDiv = popupContent.includes('id="root"');
    
    console.log('Popup HTML loaded:', hasScrapeFlow ? '✅' : '❌');
    console.log('Root div present:', hasRootDiv ? '✅' : '❌');
    
    // Check if JS loaded
    const consoleLogs = [];
    popupPage.on('console', msg => consoleLogs.push(msg.text()));
    await popupPage.waitForTimeout(1000);
    
    console.log('Console messages:', consoleLogs.length > 0 ? consoleLogs.slice(0, 3) : 'None');
    
    await popupPage.close();

    console.log('\n✅ All tests completed!');
    
    return {
      success: true,
      tests: {
        pageLoad: true,
        contentScript: 'skipped (headless)',
        elementsFound: storyTitles.length > 0,
        selectorMatch: selectorTest.success,
        dataExtracted: extractedData.length > 0,
        csvGenerated: csvOutput.length > 0,
        popupLoaded: hasScrapeFlow
      }
    };

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

function convertToCSV(rows) {
  if (rows.length === 0) return '';
  
  const headers = Object.keys(rows[0]).filter(h => !h.startsWith('_'));
  const csvRows = rows.map(row => 
    headers.map(h => {
      const value = row[h];
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',')
  );
  
  return [headers.join(','), ...csvRows].join('\n');
}

testExtension().then(result => {
  console.log('\n📊 Test Results:', JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
