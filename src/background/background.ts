import type { ScraperConfig, ScrapedData } from '../types';

// Storage keys
const CONFIGS_KEY = 'scrapeflow_configs';
const DATA_KEY = 'scrapeflow_data';

// Message handlers
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const handleMessage = async () => {
    switch (request.type) {
      case 'GET_CONFIGS':
        return getConfigs();
      
      case 'SAVE_CONFIG':
        return saveConfig(request.payload);
      
      case 'DELETE_CONFIG':
        return deleteConfig(request.payload);
      
      case 'GET_DATA':
        return getScrapedData();
      
      case 'SAVE_DATA':
        return saveScrapedData(request.payload);
      
      case 'EXPORT_CSV':
        return exportCSV(request.payload);
      
      default:
        throw new Error(`Unknown message type: ${request.type}`);
    }
  };

  handleMessage()
    .then(sendResponse)
    .catch((error) => sendResponse({ error: error.message }));

  return true; // Keep channel open for async
});

async function getConfigs(): Promise<ScraperConfig[]> {
  const result = await chrome.storage.local.get(CONFIGS_KEY);
  return result[CONFIGS_KEY] || [];
}

async function saveConfig(config: ScraperConfig): Promise<ScraperConfig> {
  const configs = await getConfigs();
  const existingIndex = configs.findIndex((c) => c.id === config.id);
  
  if (existingIndex >= 0) {
    configs[existingIndex] = { ...config, updatedAt: Date.now() };
  } else {
    configs.push({ ...config, createdAt: Date.now(), updatedAt: Date.now() });
  }
  
  await chrome.storage.local.set({ [CONFIGS_KEY]: configs });
  return config;
}

async function deleteConfig(configId: string): Promise<void> {
  const configs = await getConfigs();
  const filtered = configs.filter((c) => c.id !== configId);
  await chrome.storage.local.set({ [CONFIGS_KEY]: filtered });
}

async function getScrapedData(): Promise<ScrapedData[]> {
  const result = await chrome.storage.local.get(DATA_KEY);
  return result[DATA_KEY] || [];
}

async function saveScrapedData(data: ScrapedData): Promise<ScrapedData> {
  const allData = await getScrapedData();
  allData.unshift(data); // Add to beginning
  
  // Keep only last 100 datasets to avoid storage limits
  if (allData.length > 100) {
    allData.pop();
  }
  
  await chrome.storage.local.set({ [DATA_KEY]: allData });
  return data;
}

function exportCSV(data: ScrapedData): { success: boolean; csv: string } {
  if (!data.rows.length) {
    return { success: false, csv: '' };
  }

  const headers = Object.keys(data.rows[0]);
  const rows = data.rows.map((row) =>
    headers.map((h) => {
      const value = row[h];
      if (value === null || value === undefined) return '';
      const str = String(value);
      // Escape CSV values containing commas, quotes, or newlines
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  return { success: true, csv };
}

console.log('ScrapeFlow background script loaded');
