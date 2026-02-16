import type { ScraperConfig, SelectorConfig } from '../../types';

interface ConfigEditorProps {
  config: ScraperConfig;
  onSave: (config: ScraperConfig) => void;
  onCancel: () => void;
  onStartSelecting: () => void;
  onUpdateConfig: (config: ScraperConfig) => void;
  onSetupPagination: () => void;
}

export function ConfigEditor({ 
  config, 
  onSave, 
  onCancel, 
  onStartSelecting,
  onUpdateConfig,
  onSetupPagination
}: ConfigEditorProps) {
  function updateName(name: string) {
    onUpdateConfig({ ...config, name });
  }

  function updateSelectorName(selectorId: string, columnName: string) {
    const selectors = config.selectors.map((s) =>
      s.id === selectorId ? { ...s, columnName } : s
    );
    onUpdateConfig({ ...config, selectors });
  }

  function updateSelectorTransform(selectorId: string, dataType: SelectorConfig['dataType']) {
    const selectors = config.selectors.map((s) =>
      s.id === selectorId ? { ...s, dataType } : s
    );
    onUpdateConfig({ ...config, selectors });
  }

  function removeSelector(selectorId: string) {
    const selectors = config.selectors.filter((s) => s.id !== selectorId);
    onUpdateConfig({ ...config, selectors });
  }

  function moveSelector(index: number, direction: 'up' | 'down') {
    const selectors = [...config.selectors];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= selectors.length) return;
    
    [selectors[index], selectors[newIndex]] = [selectors[newIndex], selectors[index]];
    onUpdateConfig({ ...config, selectors });
  }

  return (
    <div className="editor">
      <div className="form-group">
        <label className="form-label">Scraper Name</label>
        <input
          type="text"
          className="form-input"
          value={config.name}
          onChange={(e) => updateName(e.target.value)}
          placeholder="e.g., Amazon Product Scraper"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Target URL</label>
        <input
          type="text"
          className="form-input"
          value={config.url}
          disabled
          style={{ opacity: 0.6 }}
        />
      </div>

      <div className="selectors-section">
        <div className="selectors-header">
          <span className="form-label">Data Columns ({config.selectors.length})</span>
          <button className="btn btn-primary" onClick={onStartSelecting}>
            + Add Column
          </button>
        </div>

        {config.selectors.length === 0 ? (
          <div className="empty-box">
            <p>Click "Add Column" then click webpage elements</p>
            <p style={{ fontSize: '11px', marginTop: '8px', color: '#64748b' }}>
              Select product names, prices, ratings, etc.
            </p>
          </div>
        ) : (
          config.selectors.map((selector, index) => (
            <SelectorItem
              key={selector.id}
              selector={selector}
              index={index}
              total={config.selectors.length}
              onUpdateName={(name) => updateSelectorName(selector.id, name)}
              onUpdateTransform={(type) => updateSelectorTransform(selector.id, type)}
              onRemove={() => removeSelector(selector.id)}
              onMoveUp={() => moveSelector(index, 'up')}
              onMoveDown={() => moveSelector(index, 'down')}
            />
          ))
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Pagination</label>
        <div 
          className="pagination-box"
          onClick={onSetupPagination}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              {config.pagination.enabled ? (
                <>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>✓ Enabled</span>
                  {' — '}
                  {config.pagination.type === 'click' && 'Click "Next" button'}
                  {config.pagination.type === 'scroll' && 'Infinite scroll'}
                  {config.pagination.type === 'url' && 'URL pattern'}
                  {config.pagination.maxPages && ` (max ${config.pagination.maxPages} pages)`}
                </>
              ) : (
                'No pagination — scrape single page only'
              )}
            </span>
            <span style={{ color: '#3b82f6' }}>Configure →</span>
          </div>
        </div>
      </div>

      <div className="editor-actions">
        <button className="btn btn-primary" onClick={() => onSave(config)}>
          💾 Save Scraper
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

interface SelectorItemProps {
  selector: SelectorConfig;
  index: number;
  total: number;
  onUpdateName: (name: string) => void;
  onUpdateTransform: (type: SelectorConfig['dataType']) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function SelectorItem({ 
  selector, 
  index, 
  total,
  onUpdateName, 
  onUpdateTransform,
  onRemove,
  onMoveUp,
  onMoveDown
}: SelectorItemProps) {
  return (
    <div className="selector-item">
      <div className="selector-item-header">
        <input
          type="text"
          className="form-input"
          value={selector.columnName}
          onChange={(e) => onUpdateName(e.target.value)}
          style={{ fontSize: '13px', padding: '6px 8px', flex: 1 }}
        />
        <select
          className="form-input"
          value={selector.dataType}
          onChange={(e) => onUpdateTransform(e.target.value as SelectorConfig['dataType'])}
          style={{ fontSize: '12px', padding: '6px', width: '90px', marginLeft: '8px' }}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="html">HTML</option>
          <option value="attribute">Attr</option>
        </select>
        
        <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={onMoveUp}
            disabled={index === 0}
            style={{ padding: '4px 8px', opacity: index === 0 ? 0.3 : 1 }}
          >
            ↑
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={onMoveDown}
            disabled={index === total - 1}
            style={{ padding: '4px 8px', opacity: index === total - 1 ? 0.3 : 1 }}
          >
            ↓
          </button>
          <button className="btn btn-danger" onClick={onRemove} style={{ padding: '4px 8px' }}>
            ✕
          </button>
        </div>
      </div>
      
      <div className="selector-path" title={selector.selector}>
        {selector.selector}
      </div>
      
      {selector.similarCount && selector.similarCount > 1 && (
        <div style={{ 
          marginTop: '6px', 
          fontSize: '11px', 
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontWeight: 600 }}>✓ {selector.similarCount}</span> similar elements found
          {selector.previewTexts && selector.previewTexts[0] && (
            <span style={{ color: '#64748b' }}>
              (e.g., "{selector.previewTexts[0].slice(0, 25)}...")
            </span>
          )}
        </div>
      )}
    </div>
  );
}
