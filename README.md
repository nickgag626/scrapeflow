# ScrapeFlow 🕸️

**Point-and-click web data extraction. The Octoparse alternative at 1/10th the price.**

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-brightgreen)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/nickgag626/scrapeflow)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Features

✨ **Point-and-Click Selection**
- Click any element, we find all similar items automatically
- Smart detection: 1 click finds 24 product cards

📄 **Multi-Page Support**
- Click pagination
- Infinite scroll
- URL pattern scraping

📊 **Export Anywhere**
- CSV for Excel/Google Sheets
- JSON for developers

🎯 **Built-in Templates**
- Amazon products
- Zillow real estate
- LinkedIn jobs
- Reddit posts
- News articles
- eBay listings

🔒 **Privacy First**
- All processing in your browser
- No data sent to servers
- Your data stays yours

## Installation

1. Install from [Chrome Web Store](https://chrome.google.com/webstore)
2. Click the 🕸️ icon in your toolbar
3. Start scraping!

## How It Works

1. Navigate to any website with data you want
2. Click "New Scraper" → "Add Column"
3. Click the data element you want
4. We auto-detect all similar elements
5. Export to CSV or JSON

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 | Unlimited single-page scraping, all templates |
| **Pro** | $19/mo | Multi-page, scheduled runs, API access |

*75% cheaper than Octoparse*

## Development

```bash
# Install dependencies
npm install

# Build extension
npm run build

# Package for Chrome Web Store
npm run package
```

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Extension**: Chrome Extension Manifest V3
- **Storage**: Chrome Storage API (local)

## Roadmap

- [ ] Cloud execution
- [ ] Scheduled scraping
- [ ] Proxy rotation
- [ ] API/webhooks
- [ ] Team workspaces

## License

MIT

## Support

- Email: support@scrapeflow.io
- Issues: [GitHub Issues](https://github.com/nickgag626/scrapeflow/issues)

---

Built with ❤️ as an alternative to expensive web scraping tools.
