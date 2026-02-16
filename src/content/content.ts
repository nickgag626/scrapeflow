import type { ElementInfo, Message, ScraperConfig, ScrapedRow, TransformConfig } from '../types';

let isSelecting = false;
let isSelectingPagination = false;
let highlightedElement: HTMLElement | null = null;
let selectedElements: HTMLElement[] = [];

// Enhanced overlay styles with pagination UI
const overlayStyles = `
  .scrapeflow-highlight {
    outline: 3px solid #3b82f6 !important;
    outline-offset: 2px !important;
    cursor: crosshair !important;
    position: relative;
    background: rgba(59, 130, 246, 0.1) !important;
  }
  
  .scrapeflow-similar {
    outline: 2px dashed #10b981 !important;
    outline-offset: 2px !important;
    position: relative;
  }
  
  .scrapeflow-pagination-highlight {
    outline: 3px solid #f59e0b !important;
    outline-offset: 2px !important;
    cursor: pointer !important;
    position: relative;
    background: rgba(245, 158, 11, 0.1) !important;
  }
  
  .scrapeflow-tooltip {
    position: fixed;
    background: #1e293b;
    color: white;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-family: system-ui, sans-serif;
    z-index: 2147483647;
    pointer-events: none;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    max-width: 350px;
    border: 1px solid #334155;
  }
  
  .scrapeflow-tooltip-tag {
    color: #60a5fa;
    font-weight: 600;
  }
  
  .scrapeflow-preview-panel {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #1e293b;
    color: white;
    padding: 20px;
    border-radius: 12px;
    font-family: system-ui, sans-serif;
    z-index: 2147483647;
    box-shadow: 0 12px 32px rgba(0,0,0,0.5);
    width: 380px;
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid #334155;
  }
  
  .scrapeflow-preview-panel h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .scrapeflow-preview-panel .count {
    color: #10b981;
    font-weight: 700;
    font-size: 18px;
  }
  
  .scrapeflow-preview-list {
    max-height: 180px;
    overflow-y: auto;
    margin: 12px 0;
    padding: 0;
    list-style: none;
    font-size: 12px;
    background: #0f172a;
    border-radius: 6px;
    padding: 8px;
  }
  
  .scrapeflow-preview-list li {
    padding: 6px 8px;
    border-bottom: 1px solid #1e293b;
    color: #94a3b8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .scrapeflow-preview-list li:last-child {
    border-bottom: none;
  }
  
  .scrapeflow-preview-actions {
    display: flex;
    gap: 10px;
    margin-top: 16px;
  }
  
  .scrapeflow-btn {
    flex: 1;
    padding: 10px 14px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .scrapeflow-btn-primary {
    background: #3b82f6;
    color: white;
  }
  
  .scrapeflow-btn-primary:hover {
    background: #2563eb;
  }
  
  .scrapeflow-btn-secondary {
    background: #334155;
    color: #e2e8f0;
  }
  
  .scrapeflow-btn-secondary:hover {
    background: #475569;
  }
  
  .scrapeflow-selector-info {
    font-size: 12px;
    color: #64748b;
    margin-top: 12px;
    padding: 12px;
    border-top: 1px solid #334155;
    font-family: monospace;
    word-break: break-all;
    background: #0f172a;
    border-radius: 6px;
  }
  
  .scrapeflow-progress {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #1e293b;
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    font-family: system-ui, sans-serif;
    z-index: 2147483647;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    border: 1px solid #334155;
    min-width: 250px;
  }
  
  .scrapeflow-progress-bar {
    height: 4px;
    background: #334155;
    border-radius: 2px;
    margin-top: 10px;
    overflow: hidden;
  }
  
  .scrapeflow-progress-fill {
    height: 100%;
    background: #3b82f6;
    transition: width 0.3s ease;
  }
  
  .scrapeflow-pagination-detected {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #f59e0b;
    color: #1e293b;
    padding: 10px 20px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 13px;
    z-index: 2147483646;
    animation: scrapeflow-pulse 2s infinite;
  }
  
  @keyframes scrapeflow-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = overlayStyles;
document.head.appendChild(styleSheet);

// Create tooltip element
const tooltip = document.createElement('div');
tooltip.className = 'scrapeflow-tooltip';
tooltip.style.display = 'none';
document.body.appendChild(tooltip);

// Preview panel (created on demand)
let previewPanel: HTMLDivElement | null = null;
let progressPanel: HTMLDivElement | null = null;

// Message listener
chrome.runtime.onMessage.addListener((request: Message, _sender, sendResponse) => {
  switch (request.type) {
    case 'START_SELECTION':
      startSelectionMode();
      sendResponse({ success: true });
      break;
    
    case 'START_PAGINATION_SELECTION':
      startPaginationSelectionMode();
      sendResponse({ success: true });
      break;
    
    case 'STOP_SELECTION':
      stopSelectionMode();
      sendResponse({ success: true });
      break;
    
    case 'EXTRACT_DATA':
      handleExtractData(request.payload as { config: ScraperConfig })
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
    
    case 'PING':
      sendResponse({ pong: true, url: window.location.href, title: document.title });
      break;
  }
  return true;
});

function startSelectionMode(): void {
  isSelecting = true;
  isSelectingPagination = false;
  selectedElements = [];
  document.body.style.cursor = 'crosshair';
  
  document.addEventListener('mouseover', handleMouseOver, true);
  document.addEventListener('mouseout', handleMouseOut, true);
  document.addEventListener('click', handleClick, true);
  document.addEventListener('mousedown', preventDefault, true);
  document.addEventListener('mouseup', preventDefault, true);
}

function startPaginationSelectionMode(): void {
  isSelecting = true;
  isSelectingPagination = true;
  document.body.style.cursor = 'pointer';
  
  // Show helper tooltip
  showPaginationHelper();
  
  document.addEventListener('mouseover', handlePaginationMouseOver, true);
  document.addEventListener('mouseout', handlePaginationMouseOut, true);
  document.addEventListener('click', handlePaginationClick, true);
  document.addEventListener('mousedown', preventDefault, true);
  document.addEventListener('mouseup', preventDefault, true);
}

function showPaginationHelper(): void {
  const helper = document.createElement('div');
  helper.className = 'scrapeflow-pagination-detected';
  helper.id = 'scrapeflow-pagination-helper';
  helper.textContent = '👆 Click the "Next" button or page link';
  document.body.appendChild(helper);
}

function stopSelectionMode(): void {
  isSelecting = false;
  isSelectingPagination = false;
  document.body.style.cursor = '';
  
  document.removeEventListener('mouseover', handleMouseOver, true);
  document.removeEventListener('mouseout', handleMouseOut, true);
  document.removeEventListener('click', handleClick, true);
  document.removeEventListener('mouseover', handlePaginationMouseOver, true);
  document.removeEventListener('mouseout', handlePaginationMouseOut, true);
  document.removeEventListener('click', handlePaginationClick, true);
  document.removeEventListener('mousedown', preventDefault, true);
  document.removeEventListener('mouseup', preventDefault, true);
  
  if (highlightedElement) {
    highlightedElement.classList.remove('scrapeflow-highlight');
    highlightedElement.classList.remove('scrapeflow-pagination-highlight');
    highlightedElement = null;
  }
  
  clearSimilarHighlights();
  
  if (previewPanel) {
    previewPanel.remove();
    previewPanel = null;
  }
  
  const helper = document.getElementById('scrapeflow-pagination-helper');
  if (helper) helper.remove();
  
  tooltip.style.display = 'none';
}

function handleMouseOver(e: MouseEvent): void {
  if (!isSelecting || isSelectingPagination) return;
  
  const target = e.target as HTMLElement;
  if (!target || target === document.body || target === document.documentElement) return;
  if (target.closest('.scrapeflow-preview-panel') || target.classList.contains('scrapeflow-tooltip')) return;
  
  if (highlightedElement) {
    highlightedElement.classList.remove('scrapeflow-highlight');
  }
  
  highlightedElement = target;
  target.classList.add('scrapeflow-highlight');
  updateTooltip(target, e);
}

function handlePaginationMouseOver(e: MouseEvent): void {
  if (!isSelecting || !isSelectingPagination) return;
  
  const target = e.target as HTMLElement;
  if (!target || target === document.body || target === document.documentElement) return;
  
  if (highlightedElement) {
    highlightedElement.classList.remove('scrapeflow-pagination-highlight');
  }
  
  highlightedElement = target;
  target.classList.add('scrapeflow-pagination-highlight');
  
  // Show what text content this element has
  tooltip.innerHTML = `<span class="scrapeflow-tooltip-tag">${target.textContent?.trim().slice(0, 30) || 'No text'}</span><br>Click to use as pagination button`;
  tooltip.style.display = 'block';
  tooltip.style.left = `${e.clientX + 10}px`;
  tooltip.style.top = `${e.clientY + 10}px`;
}

function handlePaginationMouseOut(e: MouseEvent): void {
  if (!isSelecting || !isSelectingPagination) return;
  
  const target = e.target as HTMLElement;
  if (target === highlightedElement) {
    target.classList.remove('scrapeflow-pagination-highlight');
    highlightedElement = null;
    tooltip.style.display = 'none';
  }
}

function handleMouseOut(e: MouseEvent): void {
  if (!isSelecting || isSelectingPagination) return;
  
  const target = e.target as HTMLElement;
  if (target === highlightedElement) {
    target.classList.remove('scrapeflow-highlight');
    highlightedElement = null;
    tooltip.style.display = 'none';
  }
}

function updateTooltip(element: HTMLElement, e: MouseEvent): void {
  const tag = element.tagName.toLowerCase();
  const className = element.className ? `.${element.className.split(' ').slice(0, 2).join('.')}` : '';
  const id = element.id ? `#${element.id}` : '';
  
  tooltip.innerHTML = `
    <span class="scrapeflow-tooltip-tag">&lt;${tag}${id}${className.slice(0, 20)}&gt;&lt;/${tag}&gt;</span><br>
    ${element.textContent?.slice(0, 60).trim() || '(no text)'}
  `;
  
  tooltip.style.display = 'block';
  tooltip.style.left = `${e.clientX + 10}px`;
  tooltip.style.top = `${e.clientY + 10}px`;
}

function handleClick(e: MouseEvent): void {
  if (!isSelecting || isSelectingPagination) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const target = e.target as HTMLElement;
  if (!target || target.closest('.scrapeflow-preview-panel')) return;
  
  const similarElements = findSimilarElements(target);
  selectedElements = similarElements;
  
  highlightSimilarElements(similarElements);
  showPreviewPanel(target, similarElements);
}

function handlePaginationClick(e: MouseEvent): void {
  if (!isSelecting || !isSelectingPagination) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const target = e.target as HTMLElement;
  if (!target) return;
  
  const selector = generateSelector(target);
  
  chrome.runtime.sendMessage({
    type: 'PAGINATION_SELECTED',
    payload: {
      selector,
      text: target.textContent?.trim(),
      tag: target.tagName.toLowerCase()
    }
  });
  
  stopSelectionMode();
}

function preventDefault(e: Event): void {
  if (isSelecting) {
    e.preventDefault();
  }
}

// Find similar elements using multiple strategies
function findSimilarElements(element: HTMLElement | string): HTMLElement[] {
  if (typeof element === 'string') {
    try {
      return Array.from(document.querySelectorAll(element)) as HTMLElement[];
    } catch {
      return [];
    }
  }
  
  const selectors = generateSimilarSelectors(element);
  
  for (const selector of selectors) {
    try {
      const matches = document.querySelectorAll(selector);
      if (matches.length >= 2) {
        return Array.from(matches) as HTMLElement[];
      }
    } catch {
      continue;
    }
  }
  
  return [element];
}

function generateSimilarSelectors(element: HTMLElement): string[] {
  const selectors: string[] = [];
  const tag = element.tagName.toLowerCase();
  
  // Strategy 1: Class-based selector
  if (element.className) {
    const classes = element.className
      .split(' ')
      .filter(c => c.length > 0 && !c.startsWith('scrapeflow'));
    
    if (classes.length > 0) {
      selectors.push(`${tag}.${classes.join('.')}`);
      if (classes.length > 1) {
        selectors.push(`${tag}.${classes[0]}`);
      }
    }
  }
  
  // Strategy 2: Parent context + class
  const parent = element.parentElement;
  if (parent && element.className) {
    const parentTag = parent.tagName.toLowerCase();
    const classes = element.className
      .split(' ')
      .filter(c => c.length > 0 && !c.startsWith('scrapeflow'));
    
    if (classes.length > 0) {
      selectors.push(`${parentTag} > ${tag}.${classes[0]}`);
    }
    
    if (parent.id) {
      selectors.push(`#${parent.id} > ${tag}`);
    }
  }
  
  // Strategy 3: Attribute-based
  for (const attr of element.attributes) {
    if (attr.name.startsWith('data-')) {
      selectors.push(`${tag}[${attr.name}]`);
      if (attr.value) {
        selectors.push(`${tag}[${attr.name}="${attr.value}"]`);
      }
    }
  }
  
  // Strategy 4: Structural patterns
  if (parent) {
    const siblings = Array.from(parent.children).filter(c => c.tagName === element.tagName);
    if (siblings.length > 1) {
      selectors.push(`${parent.tagName.toLowerCase()} > ${tag}`);
    }
  }
  
  // Strategy 5: Role-based
  const role = element.getAttribute('role');
  if (role) {
    selectors.push(`${tag}[role="${role}"]`);
  }
  
  return selectors;
}

function getBestSelector(element: HTMLElement, similarElements: HTMLElement[]): string {
  const selectors = generateSimilarSelectors(element);
  
  for (const selector of selectors) {
    try {
      const matches = document.querySelectorAll(selector);
      if (matches.length === similarElements.length) {
        return selector;
      }
    } catch {
      continue;
    }
  }
  
  return generateSelector(element);
}

function highlightSimilarElements(elements: HTMLElement[]): void {
  clearSimilarHighlights();
  elements.forEach((el, index) => {
    el.classList.add('scrapeflow-similar');
    el.setAttribute('data-scrapeflow-index', String(index + 1));
  });
}

function clearSimilarHighlights(): void {
  document.querySelectorAll('.scrapeflow-similar').forEach(el => {
    el.classList.remove('scrapeflow-similar');
    el.removeAttribute('data-scrapeflow-index');
  });
}

function showPreviewPanel(element: HTMLElement, similarElements: HTMLElement[]): void {
  if (previewPanel) {
    previewPanel.remove();
  }
  
  const bestSelector = getBestSelector(element, similarElements);
  const previewTexts = similarElements.slice(0, 5).map(el => {
    const text = el.textContent?.trim().slice(0, 60) || '(no text)';
    return text.length > 60 ? text + '...' : text;
  });
  
  previewPanel = document.createElement('div');
  previewPanel.className = 'scrapeflow-preview-panel';
  previewPanel.innerHTML = `
    <h3>✨ Found <span class="count">${similarElements.length}</span> similar elements</h3>
    <ul class="scrapeflow-preview-list">
      ${previewTexts.map(text => `<li>${text}</li>`).join('')}
      ${similarElements.length > 5 ? `<li style="color: #64748b; font-style: italic;">... and ${similarElements.length - 5} more</li>` : ''}
    </ul>
    <div class="scrapeflow-selector-info">
      ${bestSelector}
    </div>
    <div class="scrapeflow-preview-actions">
      <button class="scrapeflow-btn scrapeflow-btn-primary" id="scrapeflow-confirm">✓ Use This Selector</button>
      <button class="scrapeflow-btn scrapeflow-btn-secondary" id="scrapeflow-cancel">✕ Try Again</button>
    </div>
  `;
  
  document.body.appendChild(previewPanel);
  
  previewPanel.querySelector('#scrapeflow-confirm')?.addEventListener('click', (e) => {
    e.stopPropagation();
    confirmSelection(element, bestSelector, similarElements.length);
  });
  
  previewPanel.querySelector('#scrapeflow-cancel')?.addEventListener('click', (e) => {
    e.stopPropagation();
    cancelSelection();
  });
}

function confirmSelection(element: HTMLElement, selector: string, count: number): void {
  const elementInfo: ElementInfo = {
    tag: element.tagName.toLowerCase(),
    id: element.id || undefined,
    className: element.className || undefined,
    text: element.textContent?.trim() || '',
    selector: selector,
    xpath: generateXPath(element),
    attributes: getRelevantAttributes(element)
  };
  
  chrome.runtime.sendMessage({
    type: 'ELEMENT_SELECTED',
    payload: {
      ...elementInfo,
      similarCount: count,
      previewTexts: selectedElements.slice(0, 3).map(el => el.textContent?.trim().slice(0, 50) || '')
    }
  });
  
  stopSelectionMode();
}

function cancelSelection(): void {
  clearSimilarHighlights();
  if (previewPanel) {
    previewPanel.remove();
    previewPanel = null;
  }
}

// Data extraction with pagination
async function handleExtractData({ config }: { config: ScraperConfig }): Promise<{ success: boolean; rows: ScrapedRow[]; pageCount: number; error?: string }> {
  const allRows: ScrapedRow[] = [];
  let pageCount = 0;
  
  showProgressPanel();
  
  try {
    if (!config.pagination.enabled) {
      // Single page extraction
      const rows = extractPageData(config);
      allRows.push(...rows);
      pageCount = 1;
      updateProgress(1, 1, rows.length);
    } else {
      // Multi-page extraction
      const maxPages = config.pagination.maxPages || 10;
      
      for (let page = 1; page <= maxPages; page++) {
        const rows = extractPageData(config, page);
        
        if (rows.length === 0) {
          break; // No more data
        }
        
        allRows.push(...rows);
        pageCount = page;
        updateProgress(page, maxPages, allRows.length);
        
        // Check if there's a next page
        if (page < maxPages) {
          const hasNext = await navigateToNextPage(config.pagination);
          if (!hasNext) {
            break;
          }
          // Wait for page to load
          await delay(config.pagination.delay || 1000);
        }
      }
    }
    
    hideProgressPanel();
    return { success: true, rows: allRows, pageCount };
  } catch (error) {
    hideProgressPanel();
    return { success: false, rows: allRows, pageCount, error: String(error) };
  }
}

function extractPageData(config: ScraperConfig, pageNum?: number): ScrapedRow[] {
  const rows: ScrapedRow[] = [];
  
  if (config.selectors.length === 0) return rows;
  
  // Find all containers using the first selector
  const firstSelector = config.selectors[0].selector;
  const containers = document.querySelectorAll(firstSelector);
  
  containers.forEach((container, index) => {
    const row: ScrapedRow = {};
    
    config.selectors.forEach((selectorConfig) => {
      let element: Element | null = null;
      
      if (selectorConfig.selector === firstSelector) {
        element = container;
      } else {
        // For other selectors, try relative to container first, then global
        element = container.querySelector(selectorConfig.selector);
        if (!element) {
          const allMatches = document.querySelectorAll(selectorConfig.selector);
          element = allMatches[index] || null;
        }
      }
      
      let value: string | number | null = '';
      
      if (element) {
        switch (selectorConfig.dataType) {
          case 'text':
            value = element.textContent?.trim() || '';
            break;
          case 'html':
            value = element.innerHTML || '';
            break;
          case 'attribute':
            value = selectorConfig.attribute 
              ? element.getAttribute(selectorConfig.attribute) || ''
              : '';
            break;
          case 'number':
            const text = element.textContent?.trim() || '';
            const num = parseFloat(text.replace(/[^\d.-]/g, ''));
            value = isNaN(num) ? null : num;
            break;
        }
        
        // Apply transforms
        if (selectorConfig.transform) {
          value = applyTransform(value, selectorConfig.transform);
        }
      }
      
      row[selectorConfig.columnName] = value;
    });
    
    // Add metadata
    if (pageNum) {
      row._page = pageNum;
    }
    row._url = window.location.href;
    row._scrapedAt = new Date().toISOString();
    
    rows.push(row);
  });
  
  return rows;
}

function applyTransform(value: string | number | null, transform: TransformConfig): string | number | null {
  if (value === null) return null;
  
  let strValue = String(value);
  
  switch (transform.type) {
    case 'trim':
      return strValue.trim();
    
    case 'number':
      const num = parseFloat(strValue.replace(/[^\d.-]/g, ''));
      return isNaN(num) ? null : num;
    
    case 'currency':
      const currencyNum = parseFloat(strValue.replace(/[^\d.-]/g, ''));
      return isNaN(currencyNum) 
        ? null 
        : `${transform.options?.currencySymbol || '$'}${currencyNum.toFixed(2)}`;
    
    case 'regex':
      if (transform.options?.regex) {
        const regex = new RegExp(transform.options.regex);
        const match = strValue.match(regex);
        return match ? match[0] : '';
      }
      return strValue;
    
    case 'replace':
      if (transform.options?.regex && transform.options?.replacement !== undefined) {
        return strValue.replace(new RegExp(transform.options.regex, 'g'), transform.options.replacement);
      }
      return strValue;
    
    default:
      return value;
  }
}

async function navigateToNextPage(pagination: { type: string; selector?: string; urlPattern?: string }): Promise<boolean> {
  switch (pagination.type) {
    case 'click':
      if (pagination.selector) {
        const nextButton = document.querySelector(pagination.selector);
        if (nextButton) {
          // Check if button is disabled
          const isDisabled = nextButton.hasAttribute('disabled') ||
            nextButton.classList.contains('disabled') ||
            nextButton.getAttribute('aria-disabled') === 'true';
          
          if (isDisabled) return false;
          
          (nextButton as HTMLElement).click();
          return true;
        }
      }
      return false;
    
    case 'scroll':
      window.scrollTo(0, document.body.scrollHeight);
      return true;
    
    case 'url':
      if (pagination.urlPattern) {
        const currentPage = getCurrentPageNumber();
        const nextUrl = pagination.urlPattern.replace('{n}', String(currentPage + 1));
        window.location.href = nextUrl;
        return true;
      }
      return false;
    
    case 'infinite':
      // For infinite scroll, just scroll down and check if new content loads
      const beforeHeight = document.body.scrollHeight;
      window.scrollTo(0, document.body.scrollHeight);
      await delay(1000);
      const afterHeight = document.body.scrollHeight;
      return afterHeight > beforeHeight;
    
    default:
      return false;
  }
}

function getCurrentPageNumber(): number {
  const url = new URL(window.location.href);
  const pageParam = url.searchParams.get('page');
  if (pageParam) {
    const num = parseInt(pageParam, 10);
    return isNaN(num) ? 1 : num;
  }
  
  // Try to find page number in URL path
  const matches = window.location.pathname.match(/page[/-](\d+)/i);
  if (matches) {
    return parseInt(matches[1], 10);
  }
  
  return 1;
}

function showProgressPanel(): void {
  if (progressPanel) return;
  
  progressPanel = document.createElement('div');
  progressPanel.className = 'scrapeflow-progress';
  progressPanel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span style="font-weight: 600;">⏳ Scraping in progress...</span>
      <span id="scrapeflow-progress-text">Page 1</span>
    </div>
    <div class="scrapeflow-progress-bar">
      <div class="scrapeflow-progress-fill" id="scrapeflow-progress-fill" style="width: 0%;"></div>
    </div>
    <div id="scrapeflow-rows-count" style="margin-top: 8px; font-size: 12px; color: #94a3b8;">0 rows collected</div>
  `;
  document.body.appendChild(progressPanel);
}

function updateProgress(currentPage: number, totalPages: number, rowCount: number): void {
  if (!progressPanel) return;
  
  const percent = Math.min((currentPage / totalPages) * 100, 100);
  const fill = progressPanel.querySelector('#scrapeflow-progress-fill') as HTMLElement;
  const text = progressPanel.querySelector('#scrapeflow-progress-text') as HTMLElement;
  const rows = progressPanel.querySelector('#scrapeflow-rows-count') as HTMLElement;
  
  if (fill) fill.style.width = `${percent}%`;
  if (text) text.textContent = `Page ${currentPage}`;
  if (rows) rows.textContent = `${rowCount} rows collected`;
}

function hideProgressPanel(): void {
  if (progressPanel) {
    progressPanel.remove();
    progressPanel = null;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Utility functions
function generateSelector(element: HTMLElement): string {
  if (element.id) {
    return `#${element.id}`;
  }
  
  if (element.className) {
    const classes = element.className.split(' ').filter(c => c.length > 0);
    if (classes.length > 0) {
      const classSelector = `.${classes.join('.')}`;
      if (document.querySelectorAll(classSelector).length === 1) {
        return classSelector;
      }
    }
  }
  
  const path: string[] = [];
  let current: HTMLElement | null = element;
  
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    
    if (current.id) {
      selector = `#${current.id}`;
      path.unshift(selector);
      break;
    }
    
    if (current.className) {
      const classes = current.className.split(' ').filter(c => c.length > 0).slice(0, 2);
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`;
      }
    }
    
    const siblings = Array.from(current.parentElement?.children || []);
    const sameTagSiblings = siblings.filter(s => s.tagName === current!.tagName);
    if (sameTagSiblings.length > 1) {
      const index = sameTagSiblings.indexOf(current) + 1;
      selector += `:nth-of-type(${index})`;
    }
    
    path.unshift(selector);
    current = current.parentElement;
  }
  
  return path.join(' > ');
}

function generateXPath(element: HTMLElement): string {
  const parts: string[] = [];
  let current: HTMLElement | null = element;
  
  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let index = 1;
    let sibling = current.previousElementSibling;
    
    while (sibling) {
      if (sibling.nodeName === current.nodeName) {
        index++;
      }
      sibling = sibling.previousElementSibling;
    }
    
    const tagName = current.nodeName.toLowerCase();
    const part = index > 1 ? `${tagName}[${index}]` : tagName;
    parts.unshift(part);
    
    current = current.parentElement;
  }
  
  return '/' + parts.join('/');
}

function getRelevantAttributes(element: HTMLElement): Record<string, string> {
  const relevant = ['href', 'src', 'alt', 'title', 'data-*'];
  const attrs: Record<string, string> = {};
  
  for (const attr of element.attributes) {
    if (relevant.some(r => attr.name === r || (r.endsWith('*') && attr.name.startsWith(r.slice(0, -1))))) {
      attrs[attr.name] = attr.value;
    }
  }
  
  return attrs;
}

console.log('ScrapeFlow content script loaded on', window.location.href);
