# Manual Testing Instructions for ScrapeFlow

## Build Status: ✅ SUCCESS

The extension has been built successfully and is ready for testing.

## How to Test Locally

### 1. Download the Extension
```bash
git clone https://github.com/nickgag626/scrapeflow.git
cd scrapeflow
npm install
npm run build
```

### 2. Load Extension in Chrome/Brave/Edge

1. Open Chrome and go to: `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top right)
3. Click **"Load unpacked"**
4. Select the `dist/` folder from the scrapeflow project

### 3. Test Basic Functionality

**Test 1: Create a Scraper**
1. Go to https://news.ycombinator.com (or any simple site)
2. Click the ScrapeFlow extension icon 🕸️
3. Click **"+ New Scraper"**
4. Click **"Add Column"**
5. Hover over a story title - should see blue highlight
6. Click the title - should show "Found X similar elements" panel

**Test 2: Auto-Detection**
1. After clicking one title, check if other titles are outlined with green dashed lines
2. Preview panel should show multiple items
3. Click "Use This Selector" to confirm

**Test 3: Export Data**
1. Give the scraper a name
2. Click **"Run Scraper"**
3. Wait for scraping to complete
4. Click **"Export CSV"** or **"Export JSON"**
5. Verify the downloaded file contains the data

**Test 4: Templates**
1. Go to Templates tab
2. Select "News Headlines" template
3. Verify it creates a scraper with pre-configured selectors
4. Navigate to a news site and test

**Test 5: Pagination (if on a paginated site)**
1. Edit a scraper
2. Click **"Setup Pagination"**
3. Select pagination type (click, scroll, or URL)
4. Click the "Next" button on the page
5. Run scraper - should collect from multiple pages

## What Was Fixed

### Issues Fixed:

1. **URL Parsing Errors**
   - Added try-catch around `new URL()` calls
   - Default to 'example.com' if URL is invalid

2. **Hard-coded Page Load Wait**
   - Changed from fixed 3s wait to polling page status
   - Now waits up to 30s for page to fully load
   - Checks `tab.status === 'complete'`

3. **Template System**
   - Templates now actually apply default selectors
   - Each template has pre-configured CSS selectors for common sites
   - Includes default URLs for testing

4. **Build Output**
   - Fixed popup.html path issues
   - Corrected script paths (removed leading slashes)

## Known Limitations

- Templates have CSS selectors that may need adjustment for site changes
- Some sites with heavy JavaScript rendering may need extra wait time
- Complex pagination (infinite scroll) can be tricky on some sites

## Debugging

If something doesn't work:

1. **Check console for errors:**
   - Right-click extension icon → "Inspect popup"
   - Check background script: `chrome://extensions/` → click "background page" link
   - Check content script: DevTools → Console on the target page

2. **Common issues:**
   - "Could not establish connection" = Content script not injected, refresh page
   - "undefined" errors = URL parsing failed, check current URL
   - No data extracted = Selectors don't match, try manual selection

## Reporting Issues

If you find bugs, check:
1. Browser console for error messages
2. Extension version in manifest.json
3. Steps to reproduce the issue
