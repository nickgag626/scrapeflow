import type { ScraperConfig, PaginationConfig } from '../../types';

interface PaginationSetupProps {
  config: ScraperConfig;
  onUpdate: (pagination: PaginationConfig) => void;
  onBack: () => void;
  onStartSelecting: () => void;
}

export function PaginationSetup({ config, onUpdate, onBack, onStartSelecting }: PaginationSetupProps) {
  const pagination = config.pagination;

  function toggleEnabled(enabled: boolean) {
    onUpdate({ ...pagination, enabled });
  }

  function updateType(type: PaginationConfig['type']) {
    onUpdate({ ...pagination, type });
  }

  function updateMaxPages(maxPages: number) {
    onUpdate({ ...pagination, maxPages: Math.max(1, Math.min(100, maxPages)) });
  }

  function updateDelay(delay: number) {
    onUpdate({ ...pagination, delay: Math.max(500, delay) });
  }

  return (
    <div className="editor">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <h2 style={{ margin: 0, fontSize: '16px' }}>Pagination Setup</h2>
      </div>

      <div className="form-group">
        <label className="form-label">Enable Pagination</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className={`btn ${pagination.enabled ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => toggleEnabled(true)}
            style={{ flex: 1 }}
          >
            ✓ Yes, scrape multiple pages
          </button>
          <button
            className={`btn ${!pagination.enabled ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => toggleEnabled(false)}
            style={{ flex: 1 }}
          >
            ✕ No, single page only
          </button>
        </div>
      </div>

      {pagination.enabled && (
        <>
          <div className="form-group">
            <label className="form-label">Pagination Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <PaginationOption
                selected={pagination.type === 'click'}
                onClick={() => updateType('click')}
                icon="🖱️"
                title="Click Button"
                description="Click 'Next' or page number buttons"
              />
              <PaginationOption
                selected={pagination.type === 'scroll'}
                onClick={() => updateType('scroll')}
                icon="📜"
                title="Infinite Scroll"
                description="Scroll down to load more content"
              />
              <PaginationOption
                selected={pagination.type === 'url'}
                onClick={() => updateType('url')}
                icon="🔗"
                title="URL Pattern"
                description="Modify URL to change pages"
              />
              <PaginationOption
                selected={pagination.type === 'infinite'}
                onClick={() => updateType('infinite')}
                icon="⬇️"
                title="Load More Button"
                description="Click 'Load More' buttons"
              />
            </div>
          </div>

          {pagination.type === 'click' && (
            <div className="form-group">
              <label className="form-label">Next Button Selector</label>
              <div className="pagination-selector-box">
                {pagination.selector ? (
                  <div>
                    <code style={{ 
                      background: '#0f172a', 
                      padding: '8px 12px', 
                      borderRadius: '4px',
                      display: 'block',
                      fontSize: '12px',
                      marginBottom: '8px'
                    }}>
                      {pagination.selector}
                    </code>
                    <button className="btn btn-secondary" onClick={onStartSelecting}>
                      🖱️ Re-select button
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-primary btn-full" onClick={onStartSelecting}>
                    🖱️ Click to select "Next" button
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Max Pages: {pagination.maxPages}</label>
            <input
              type="range"
              className="form-input"
              min="1"
              max="50"
              value={pagination.maxPages}
              onChange={(e) => updateMaxPages(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '11px', 
              color: '#64748b',
              marginTop: '4px'
            }}>
              <span>1 page</span>
              <span>50 pages</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Delay Between Pages: {pagination.delay}ms</label>
            <input
              type="range"
              className="form-input"
              min="500"
              max="5000"
              step="100"
              value={pagination.delay}
              onChange={(e) => updateDelay(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '11px', 
              color: '#64748b',
              marginTop: '4px'
            }}>
              <span>Fast (500ms)</span>
              <span>Slow (5s)</span>
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
              💡 Longer delays prevent rate limiting on some sites
            </p>
          </div>
        </>
      )}

      <div className="editor-actions">
        <button className="btn btn-primary" onClick={onBack}>
          ✓ Done
        </button>
      </div>
    </div>
  );
}

interface PaginationOptionProps {
  selected: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  description: string;
}

function PaginationOption({ selected, onClick, icon, title, description }: PaginationOptionProps) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px',
        borderRadius: '8px',
        border: `2px solid ${selected ? '#3b82f6' : '#334155'}`,
        background: selected ? '#1e3a5f' : '#1e293b',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>{title}</div>
      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{description}</div>
      {selected && <div style={{ color: '#3b82f6', fontSize: '12px', marginTop: '4px' }}>✓ Selected</div>}
    </div>
  );
}
