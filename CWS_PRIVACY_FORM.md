# Chrome Web Store Privacy Form Responses

## Single Purpose Description
ScrapeFlow is a web data extraction tool that allows users to scrape structured data from websites through a point-and-click interface. Users can select elements on any webpage, automatically detect similar items, and export the extracted data to CSV or JSON format. The extension provides a visual way to extract data without writing code.

## activeTab Justification
The activeTab permission is required to access the content of the currently active browser tab when the user initiates a scraping session. This permission allows the extension to:
- Read the DOM structure of the current webpage
- Highlight elements when the user hovers over them during selection
- Extract the selected data from the page
- Execute scripts in the context of the current page
This permission is only activated when the user explicitly clicks the extension icon or uses the extension popup, ensuring user control over when the extension accesses page content.

## storage Justification
The storage permission is required to save user-created scraper configurations locally in the browser. This includes:
- Saved scraper definitions (selectors, column mappings)
- User preferences and settings
- Template configurations
- Export history metadata
All data is stored locally using Chrome's storage API and is never transmitted to external servers.

## scripting Justification
The scripting permission is required to inject content scripts into web pages for the following purposes:
- Enable visual element highlighting during the selection process
- Extract data from selected elements using DOM queries
- Handle pagination by navigating between pages
- Communicate between the extension popup and the webpage content
Scripts are only injected when the user actively initiates a scraping session through the extension interface.

## Host Permission Justification
Host permissions are required to access the content of websites that users choose to scrape. The extension uses the <all_urls> permission pattern to allow users to scrape any website they have access to. This is necessary because:
- Users may need to scrape data from any website (e-commerce, real estate listings, job boards, etc.)
- The extension cannot predict which specific domains users will want to scrape
- The permission is only used when users explicitly initiate scraping on a specific page
- No data is collected or transmitted without user action
Users maintain full control over which pages are accessed and when scraping occurs.

## Remote Code
No, I am not using remote code. All JavaScript code is packaged within the extension and loaded from the local extension bundle.

## Data Usage Checkboxes
I certify that the following disclosures are true:
- ✅ I do not sell or transfer user data to third parties, outside of the approved use cases
- ✅ I do not use or transfer user data for purposes that are unrelated to my item's single purpose  
- ✅ I do not use or transfer user data to determine creditworthiness or for lending purposes

## Privacy Policy URL
https://github.com/nickgag626/scrapeflow/blob/master/PRIVACY_POLICY.md

## Data Collection
None of the data types are collected:
- ☐ Personally identifiable information
- ☐ Health information  
- ☐ Financial and payment information
- ☐ Authentication information
- ☐ Personal communications
- ☐ Location
- ☐ Web history
- ☐ User activity
- ☐ Website content

ScrapeFlow processes all data locally in the user's browser. No user data is collected, stored, or transmitted to external servers.
