import React from 'react';

export default function DataTable({
  columns = [],
  rows = [],
  loading = false,
  error = null,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return <div style={{ padding: '20px', fontSize: '14px' }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#991B1B', fontSize: '14px' }}>
        {error}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div style={{ padding: '20px', fontSize: '14px', color: '#6B7280' }}>
        No data available.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead style={{ background: '#F9FAFB' }}>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                style={{
                  textAlign: 'left',
                  padding: '10px',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB',
                }}
              >
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th style={{ padding: '10px', borderBottom: '1px solid #E5E7EB' }}>
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id || idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
              {columns.map(col => (
                <td key={col.key} style={{ padding: '10px', color: '#111827' }}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : row[col.key] ?? '—'}
                </td>
              ))}

              {(onEdit || onDelete) && (
                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      style={actionBtn('#1A5F7A')}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row)}
                      style={actionBtn('#991B1B')}
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// small helper for buttons (keeps style consistent)
function actionBtn(color) {
  return {
    background: 'transparent',
    border: 'none',
    color,
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '10px',
  };
}