import { useState } from 'react';
import type { ScraperConfig } from '../../types';

interface ConfigListProps {
  configs: ScraperConfig[];
  allConfigs: ScraperConfig[];
  onCreate: () => void;
  onEdit: (config: ScraperConfig) => void;
  onDelete: (configId: string) => void;
  onRun: (config: ScraperConfig) => void;
  onExport: (config: ScraperConfig, format: 'csv' | 'json') => void;
  onTemplates: () => void;
}

export function ConfigList({ 
  configs, 
  allConfigs, 
  onCreate, 
  onEdit, 
  onDelete, 
  onRun, 
  onExport,
  onTemplates
}: ConfigListProps) {
  const [showAll, setShowAll] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const displayedConfigs = showAll ? allConfigs : configs;
  const hasOtherDomainConfigs = allConfigs.length > configs.length;

  function confirmDelete(configId: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (deletingId === configId) {
      onDelete(configId);
      setDeletingId(null);
    } else {
      setDeletingId(configId);
      setTimeout(() => setDeletingId(null), 3000);
    }
  }

  return (
    <div className="config-list">
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button className="btn btn-primary btn-full btn-large" onClick={onCreate}>
          + New Scraper
        </button>
        <button className="btn btn-secondary" onClick={onTemplates} style={{ minWidth: '80px' }}>
          📋 Templates
        </button>
      </div>

      {displayedConfigs.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🕸️</div>
          <p style={{ fontSize: '15px', marginBottom: '8px' }}>No scrapers for this site yet</p>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            Create your first scraper or use a template
          </p>
          
          <div style={{ marginTop: '20px', padding: '16px', background: '#1e293b', borderRadius: '8px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>🚀 Quick Start:</p>
            <ol style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'left', paddingLeft: '20px' }}>
              <li>Click "+ New Scraper"</li>
              <li>Select data columns on the page</li>
              <li>Optional: Enable pagination</li>
              <li>Run and export as CSV/JSON</li>
            </ol>
          </div>
        </div>
      ) : (
        <>
          <div className="divider" />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="form-label">
              {showAll ? 'All Scrapers' : 'Scrapers for this site'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-blue">{displayedConfigs.length}</span>
            </div>
          </div>

          {displayedConfigs.map((config) => (
            <div key={config.id} className="config-card">
              <div className="config-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="config-name">{config.name}</span>
                  {config.pagination.enabled && (
                    <span className="badge badge-green">📄 Multi-page</span>
                  )}
                </div>
                <button
                  className="btn btn-danger"
                  onClick={(e) => confirmDelete(config.id, e)}
                  title={deletingId === config.id ? 'Click again to confirm' : 'Delete'}
                >
                  {deletingId === config.id ? '⚠️' : '🗑️'}
                </button>
              </div>
              
              <div className="config-meta">
                {config.selectors.length} columns 
                {config.pagination.enabled && ` • up to ${config.pagination.maxPages} pages`}
                {' • '}{config.domain}
              </div>
              
              <div className="config-actions">
                <button className="btn btn-success" onClick={() => onRun(config)}>
                  ▶ Run
                </button>
                <button className="btn btn-secondary" onClick={() => onEdit(config)}>
                  Edit
                </button>
                <button className="btn btn-secondary" onClick={() => onExport(config, 'csv')}>
                  Export
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {hasOtherDomainConfigs && (
        <>
          <div className="divider" />
          <button
            className="btn btn-secondary btn-full"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show only this site' : `Show all scrapers (${allConfigs.length})`}
          </button>
        </>
      )}
    </div>
  );
}
