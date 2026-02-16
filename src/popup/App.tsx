import { useState, useEffect } from 'react';
import type { ScraperConfig, ElementInfo, PaginationConfig } from '../types';
import { ConfigList } from './components/ConfigList';
import { ConfigEditor } from './components/ConfigEditor';
import { DataPreview } from './components/DataPreview';
import { PaginationSetup } from './components/PaginationSetup';
import { ExportPanel } from './components/ExportPanel';
import { TemplatesPanel, TEMPLATES } from './components/TemplatesPanel';

type View = 'list' | 'edit' | 'preview' | 'pagination' | 'export' | 'templates';

const DEFAULT_PAGINATION: PaginationConfig = {
  enabled: false,
  type: 'click',
  maxPages: 10,
  delay: 1000
};

function App() {
  const [view, setView] = useState<View>('list');
  const [configs, setConfigs] = useState<ScraperConfig[]>([]);
  const [editingConfig, setEditingConfig] = useState<ScraperConfig | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [scrapedData, setScrapedData] = useState<any>(null);

  useEffect(() => {
    loadConfigs();
    getCurrentUrl();
  }, []);

  // Listen for element selection from content script
  useEffect(() => {
    const listener = (message: any) => {
      if (message.type === 'ELEMENT_SELECTED' && editingConfig) {
        handleElementSelected(message.payload as ElementInfo & { similarCount?: number; previewTexts?: string[] });
      } else if (message.type === 'PAGINATION_SELECTED' && editingConfig) {
        handlePaginationSelected(message.payload);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [editingConfig]);

  async function loadConfigs() {
    const response = await chrome.runtime.sendMessage({ type: 'GET_CONFIGS' });
    if (!response.error) {
      setConfigs(response);
    }
  }

  async function getCurrentUrl() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.url) {
        setCurrentUrl(tab.url);
      }
    } catch (error) {
      console.error('Failed to get current URL:', error);
      setCurrentUrl('');
    }
  }

  function createNewConfig() {
    let domain = 'example.com';
    try {
      if (currentUrl) {
        domain = new URL(currentUrl).hostname;
      }
    } catch (e) {
      console.error('Invalid URL:', currentUrl);
    }
    
    const newConfig: ScraperConfig = {
      id: crypto.randomUUID(),
      name: `Scraper ${configs.length + 1}`,
      url: currentUrl || 'https://example.com',
      domain,
      selectors: [],
      pagination: { ...DEFAULT_PAGINATION },
      exportFormat: 'csv',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setEditingConfig(newConfig);
    setView('edit');
  }

  function editConfig(config: ScraperConfig) {
    setEditingConfig(config);
    setView('edit');
  }

  async function saveConfig(config: ScraperConfig) {
    await chrome.runtime.sendMessage({
      type: 'SAVE_CONFIG',
      payload: config
    });
    await loadConfigs();
    setView('list');
    setEditingConfig(null);
  }

  async function deleteConfig(configId: string) {
    await chrome.runtime.sendMessage({
      type: 'DELETE_CONFIG',
      payload: configId
    });
    await loadConfigs();
  }

  async function startSelecting() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      await chrome.tabs.sendMessage(tab.id, { type: 'START_SELECTION' });
      window.close();
    }
  }

  async function startPaginationSelection() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      await chrome.tabs.sendMessage(tab.id, { type: 'START_PAGINATION_SELECTION' });
      window.close();
    }
  }

  function handleElementSelected(elementInfo: ElementInfo & { similarCount?: number; previewTexts?: string[] }) {
    if (!editingConfig) return;

    // Auto-detect column type and name
    let columnName = `Column ${editingConfig.selectors.length + 1}`;
    const text = elementInfo.text.toLowerCase();
    
    // Smart column naming
    if (/\$?[\d,]+\.?\d*/.test(text) && (text.includes('$') || text.length < 15)) {
      columnName = elementInfo.text.includes('.') ? 'Price' : 'Number';
    } else if (text.includes('⭐') || text.includes('★') || text.includes('rating') || /^[\d.]+$/.test(text)) {
      columnName = 'Rating';
    } else if (elementInfo.tag === 'a' && (text.includes('http') || elementInfo.attributes.href)) {
      columnName = 'URL';
    } else if (elementInfo.tag === 'img') {
      columnName = 'Image';
    } else if (text.length > 30) {
      columnName = 'Title';
    } else if (text.includes('@')) {
      columnName = 'Email';
    }

    const newSelector = {
      id: crypto.randomUUID(),
      selector: elementInfo.selector,
      columnName,
      selectorType: 'css' as const,
      dataType: columnName === 'Price' || columnName === 'Number' || columnName === 'Rating' ? 'number' as const : 'text' as const,
      similarCount: elementInfo.similarCount,
      previewTexts: elementInfo.previewTexts
    };

    setEditingConfig({
      ...editingConfig,
      selectors: [...editingConfig.selectors, newSelector]
    });
  }

  function handlePaginationSelected(payload: { selector: string; text: string; tag: string }) {
    if (!editingConfig) return;

    setEditingConfig({
      ...editingConfig,
      pagination: {
        ...editingConfig.pagination,
        enabled: true,
        type: 'click',
        selector: payload.selector
      }
    });
  }

  async function runScraper(config: ScraperConfig) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) return;

    // First, navigate to the target URL if different
    if (tab.url !== config.url) {
      await chrome.tabs.update(tab.id, { url: config.url });
      // Wait for page load with a more robust check
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds max
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const [updatedTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (updatedTab?.status === 'complete' && updatedTab.url === config.url) {
          break;
        }
        attempts++;
      }
      // Extra wait for any JS rendering
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'EXTRACT_DATA',
      payload: { config }
    });

    if (response?.success) {
      const data = {
        configId: config.id,
        configName: config.name,
        url: config.url,
        timestamp: Date.now(),
        rows: response.rows,
        rowCount: response.rows.length,
        pageCount: response.pageCount,
        executionTime: response.executionTime || 0
      };
      
      await chrome.runtime.sendMessage({
        type: 'SAVE_DATA',
        payload: data
      });
      
      setScrapedData(data);
      setView('preview');
    } else {
      alert('Scraping failed: ' + (response?.error || 'Unknown error'));
    }
  }

  function exportData(config: ScraperConfig, _format: 'csv' | 'json') {
    setEditingConfig(config);
    setView('export');
  }

  async function downloadExport(data: any, format: 'csv' | 'json') {
    let content: string;
    let mimeType: string;
    let extension: string;

    if (format === 'csv') {
      content = convertToCSV(data.rows);
      mimeType = 'text/csv';
      extension = 'csv';
    } else {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.configName}-${Date.now()}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function convertToCSV(rows: any[]): string {
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

  function applyTemplate(templateId: string) {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      createNewConfig();
      return;
    }
    
    const newConfig: ScraperConfig = {
      id: crypto.randomUUID(),
      name: template.name,
      url: template.defaultUrl || currentUrl || 'https://example.com',
      domain: template.defaultUrl ? new URL(template.defaultUrl).hostname : (currentUrl ? new URL(currentUrl).hostname : 'example.com'),
      selectors: template.defaultSelectors?.map((s) => ({
        id: crypto.randomUUID(),
        columnName: s.columnName,
        selector: s.selector,
        selectorType: 'css' as const,
        dataType: s.dataType as 'text' | 'number' | 'html' | 'attribute'
      })) || [],
      pagination: { ...DEFAULT_PAGINATION },
      exportFormat: 'csv',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setEditingConfig(newConfig);
    setView('edit');
  }

  return (
    <div className="app">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🕸️</span>
          <h1>ScrapeFlow</h1>
        </div>
        <span className="url">{new URL(currentUrl).hostname || 'Select a page'}</span>
      </header>

      {view === 'list' && (
        <ConfigList
          configs={configs.filter(c => currentUrl.includes(c.domain))}
          allConfigs={configs}
          onCreate={createNewConfig}
          onEdit={editConfig}
          onDelete={deleteConfig}
          onRun={runScraper}
          onExport={exportData}
          onTemplates={() => setView('templates')}
        />
      )}

      {view === 'edit' && editingConfig && (
        <ConfigEditor
          config={editingConfig}
          onSave={saveConfig}
          onCancel={() => { setView('list'); setEditingConfig(null); }}
          onStartSelecting={startSelecting}
          onUpdateConfig={setEditingConfig}
          onSetupPagination={() => setView('pagination')}
        />
      )}

      {view === 'pagination' && editingConfig && (
        <PaginationSetup
          config={editingConfig}
          onUpdate={(pagination) => setEditingConfig({ ...editingConfig, pagination })}
          onBack={() => setView('edit')}
          onStartSelecting={startPaginationSelection}
        />
      )}

      {view === 'preview' && (
        <DataPreview
          data={scrapedData}
          onBack={() => setView('list')}
          onExport={(format) => downloadExport(scrapedData, format)}
        />
      )}

      {view === 'export' && editingConfig && (
        <ExportPanel
          config={editingConfig}
          onBack={() => setView('edit')}
          onExport={downloadExport}
        />
      )}

      {view === 'templates' && (
        <TemplatesPanel
          onSelect={applyTemplate}
          onBack={() => setView('list')}
        />
      )}
    </div>
  );
}

export default App;
