import type { ScraperConfig } from '../../types';

interface ExportPanelProps {
  config: ScraperConfig;
  onBack: () => void;
  onExport: (data: any, format: 'csv' | 'json') => void;
}

export function ExportPanel({ config, onBack, onExport: _onExport }: ExportPanelProps) {
  return (
    <div className="editor">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <h2 style={{ margin: 0, fontSize: '16px' }}>Export Options</h2>
      </div>

      <div className="form-group">
        <label className="form-label">Default Export Format</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <ExportOption
            selected={config.exportFormat === 'csv'}
            onClick={() => { /* update config */ }}
            icon="📊"
            title="CSV"
            description="Spreadsheet format for Excel, Google Sheets"
          />
          <ExportOption
            selected={config.exportFormat === 'json'}
            onClick={() => { /* update config */ }}
            icon="{ }"
            title="JSON"
            description="Structured data for developers"
          />
          <ExportOption
            selected={config.exportFormat === 'both'}
            onClick={() => { /* update config */ }}
            icon="📦"
            title="Both"
            description="Export as both CSV and JSON"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">API Integration (Pro Feature)</label>
        <div className="empty-box" style={{ opacity: 0.6 }}>
          <p>🔗 Webhook URL</p>
          <input
            type="text"
            className="form-input"
            placeholder="https://your-api.com/webhook"
            disabled
          />
          <p style={{ fontSize: '11px', marginTop: '8px', color: '#64748b' }}>
            Available in Pro plan: Send data directly to your API, Zapier, or Make.com
          </p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Scheduled Export (Pro Feature)</label>
        <div className="empty-box" style={{ opacity: 0.6 }}>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>
            ⏰ Automatically export data on a schedule:
          </p>
          <ul style={{ fontSize: '11px', color: '#64748b', marginTop: '8px', paddingLeft: '16px' }}>
            <li>Hourly monitoring</li>
            <li>Daily reports</li>
            <li>Weekly summaries</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

interface ExportOptionProps {
  selected: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  description: string;
}

function ExportOption({ selected, onClick, icon, title, description }: ExportOptionProps) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '16px',
        borderRadius: '8px',
        border: `2px solid ${selected ? '#3b82f6' : '#334155'}`,
        background: selected ? '#1e3a5f' : '#1e293b',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'center'
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{description}</div>
    </div>
  );
}
