import { useState, useEffect } from 'react';

interface DataPreviewProps {
  data: any;
  onBack: () => void;
  onExport: (format: 'csv' | 'json') => void;
}

export function DataPreview({ data, onBack, onExport }: DataPreviewProps) {
  const [allData, setAllData] = useState<any[]>([]);
  const [selectedIndex] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const response = await chrome.runtime.sendMessage({ type: 'GET_DATA' });
    if (!response.error && Array.isArray(response)) {
      setAllData(response);
    }
  }

  const displayData = data || allData[selectedIndex];
  const columns = displayData?.rows?.[0] ? Object.keys(displayData.rows[0]).filter((k: string) => !k.startsWith('_')) : [];

  return (
    <div className="data-preview">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        
        {displayData && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-success" onClick={() => onExport('csv')}>
              📊 CSV
            </button>
            <button className="btn btn-success" onClick={() => onExport('json')}>
              { } JSON
            </button>
          </div>
        )}
      </div>

      {!displayData ? (
        <div className="empty-state">
          <div style={{ fontSize: '48px' }}>📊</div>
          <p>No scraped data yet</p>
        </div>
      ) : (
        <>
          <div style={{ 
            background: '#1e293b', 
            padding: '12px 16px', 
            borderRadius: '8px',
            marginBottom: '12px'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>{displayData.configName}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {displayData.rowCount} rows 
              {displayData.pageCount > 1 && `from ${displayData.pageCount} pages`}
              {' • '}
              {new Date(displayData.timestamp).toLocaleString()}
            </div>
          </div>

          <div className="preview-table-container" style={{ maxHeight: '300px', overflow: 'auto' }}>
            <table className="preview-table">
              <thead>
                <tr>
                  {columns.map((col: string) => (
                    <th key={col} style={{ 
                      background: '#334155', 
                      padding: '8px 12px',
                      textAlign: 'left',
                      fontSize: '12px',
                      position: 'sticky',
                      top: 0
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayData.rows.slice(0, 20).map((row: any, i: number) => (
                  <tr key={i}>
                    {columns.map((col: string) => (
                      <td key={col} style={{ 
                        padding: '6px 12px', 
                        borderBottom: '1px solid #334155',
                        fontSize: '12px',
                        maxWidth: '150px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {String(row[col] || '').slice(0, 50)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {displayData.rows.length > 20 && (
            <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', marginTop: '12px' }}>
              Showing first 20 of {displayData.rows.length} rows
            </p>
          )}
        </>
      )}
    </div>
  );
}
