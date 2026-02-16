export interface SelectorConfig {
  id: string;
  selector: string;
  columnName: string;
  selectorType: 'css' | 'xpath';
  attribute?: string;
  dataType: 'text' | 'html' | 'attribute' | 'number';
  similarCount?: number;
  previewTexts?: string[];
  transform?: TransformConfig;
}

export interface TransformConfig {
  type: 'none' | 'trim' | 'number' | 'currency' | 'date' | 'regex' | 'replace';
  options?: {
    regex?: string;
    replacement?: string;
    dateFormat?: string;
    currencySymbol?: string;
  };
}

export interface PaginationConfig {
  enabled: boolean;
  type: 'click' | 'scroll' | 'url' | 'infinite';
  selector?: string;
  maxPages: number;
  delay: number; // ms between pages
  urlPattern?: string; // for URL-based pagination, e.g., "?page={n}"
}

export interface ScraperConfig {
  id: string;
  name: string;
  url: string;
  domain: string;
  selectors: SelectorConfig[];
  pagination: PaginationConfig;
  exportFormat: 'csv' | 'json' | 'both';
  schedule?: ScheduleConfig;
  createdAt: number;
  updatedAt: number;
}

export interface ScheduleConfig {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly';
  hour?: number; // for daily/weekly (0-23)
  dayOfWeek?: number; // for weekly (0-6, Sunday=0)
  webhookUrl?: string;
  emailResults?: boolean;
}

export interface ScrapedRow {
  [columnName: string]: string | number | null | undefined;
  _page?: number;
  _url?: string;
  _scrapedAt?: string;
}

export interface ScrapedData {
  configId: string;
  configName: string;
  url: string;
  timestamp: number;
  rows: ScrapedRow[];
  rowCount: number;
  pageCount: number;
  executionTime: number; // ms
}

export interface ElementInfo {
  tag: string;
  id?: string;
  className?: string;
  text: string;
  selector: string;
  xpath: string;
  attributes: Record<string, string>;
}

export type SelectionMode = 'idle' | 'selecting' | 'preview';

export interface Message {
  type: string;
  payload?: unknown;
}

export interface RunConfig {
  config: ScraperConfig;
  startPage?: number;
  maxPagesOverride?: number;
}

export interface ScrapeResult {
  success: boolean;
  rows: ScrapedRow[];
  pageCount: number;
  error?: string;
  partial?: boolean; // true if some pages failed
}

// Template types
export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'ecommerce' | 'realestate' | 'jobs' | 'social' | 'news';
  domainPattern?: string;
  defaultSelectors: Partial<SelectorConfig>[];
  paginationDefaults?: Partial<PaginationConfig>;
}
