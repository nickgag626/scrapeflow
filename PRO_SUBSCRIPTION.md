# ScrapeFlow Pro Subscription Plan

## Pricing
- **Free:** $0/forever - Single-page scraping, all templates, CSV/JSON export
- **Pro:** $19/month - Multi-page, scheduling, API access, priority support

## Free Tier (Current)
- ✅ Unlimited single-page scraping
- ✅ All 6 built-in templates
- ✅ CSV/JSON export
- ✅ Point-and-click selection
- ✅ Auto-detection of similar items
- ✅ Privacy-first (local processing)
- ✅ Basic email support

## Pro Tier Features

### 1. Multi-Page Scraping
- **Click pagination:** Automatically click "Next" buttons
- **Infinite scroll:** Auto-scroll to load more content
- **URL patterns:** Scrape pages like `/page/1`, `/page/2`, etc.
- **Max pages:** Up to 100 pages per scraper (vs 1 in Free)

### 2. Scheduled Scraping
- Run scrapers automatically on schedule
- **Frequency:** Hourly, daily, weekly, monthly
- **Delivery:** Email notification when complete
- **History:** View past scheduled runs

### 3. API & Webhooks
- **REST API:** Access scraped data programmatically
- **Webhooks:** Send data to Zapier, Make, or custom endpoints
- **JSON endpoint:** Direct access to latest scrape results
- **Authentication:** API key-based access

### 4. Cloud Storage
- Store scraped data in the cloud (not just local export)
- **Retention:** 90 days of scrape history
- **Storage:** Up to 10GB per user
- **Search:** Full-text search across all historical data

### 5. Advanced Data Processing
- **Custom transforms:** Regex, formulas, data cleaning
- **Column merging:** Combine multiple fields
- **Conditional logic:** If/then data rules
- **Data validation:** Ensure data quality

### 6. Collaboration
- **Team sharing:** Share scrapers with team members
- **Permissions:** View-only or edit access
- **Activity log:** Track who ran what and when

### 7. Priority Support
- **Response time:** < 4 hours (vs 24-48h Free)
- **Channels:** Email + Discord community
- **Onboarding:** 1-on-1 setup call (annual plans)

### 8. Custom Templates
- **Save custom templates:** Create and save your own templates
- **Template marketplace:** Access community templates
- **Template sharing:** Share templates publicly or privately

## Technical Implementation

### Backend Needed
- **Database:** PostgreSQL for user data, scrape configs, results
- **Scheduler:** Bull Queue + Redis for scheduled jobs
- **API:** Fastify/Express with API key auth
- **Storage:** S3-compatible for scrape results
- **Worker:** Puppeteer/Playwright for server-side scraping

### Architecture
```
Chrome Extension (Client)
    ↓
ScrapeFlow API (Cloud)
    ├── Auth Service (API keys, webhooks)
    ├── Scheduler (Cron jobs)
    ├── Worker Pool (Headless browsers)
    └── Storage (S3 + Database)
```

### Pricing Comparison
| Tool | Price | Notes |
|------|-------|-------|
| Octoparse | $75-208/mo | Cloud-based, complex |
| ParseHub | $149/mo | Enterprise focus |
| Instant Data Scraper | $0 (no Pro) | Basic, no cloud |
| **ScrapeFlow Pro** | **$19/mo** | **Best value** |

## Revenue Targets
- **100 Pro users:** $1,900/mo = $22,800/year
- **500 Pro users:** $9,500/mo = $114,000/year
- **1,000 Pro users:** $19,000/mo = $228,000/year

## MVP Priority for Pro
1. Multi-page scraping (already built, just needs enablement)
2. Simple API endpoint for latest scrape
3. Cloud storage for scrape history
4. Stripe subscription integration

## Timeline
- **Week 1-2:** Set up backend infrastructure (API, auth, database)
- **Week 3-4:** Build multi-page scraping service
- **Week 5-6:** Add scheduling with Bull Queue
- **Week 7-8:** Stripe integration and Pro feature gates
- **Week 9:** Beta test with early users
- **Week 10:** Public Pro launch
