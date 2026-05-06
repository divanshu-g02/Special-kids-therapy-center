// src/components/ui/DataTable.jsx

// DataTable renders any list of data as a table.
// Used by every admin page — users, doctors, patients, appointments etc.
//
// Props:
// columns → array of column definitions (explained below)
// rows    → array of objects from your backend API
// loading → boolean, shows loading state while API call is pending
// error   → string, shows error message if API call failed
// onEdit  → function(row) called when Edit is clicked — optional
// onDelete→ function(row) called when Delete is clicked — optional
// emptyMessage → custom message when rows is empty

export default function DataTable({
  columns      = [],
  rows         = [],
  loading      = false,
  error        = null,
  onEdit,
  onDelete,
  emptyMessage = 'No records found.',
}) {

  // ── Loading state ──────────────────────────────────────
  // Shows while useApi is fetching data from your backend
  // Matches the card style so it doesn't look out of place
  if (loading) {
    return (
      <div style={{
        background:   '#fff',
        borderRadius: '12px',
        border:       '0.5px solid rgba(0,0,0,0.08)',
        padding:      '48px',
        textAlign:    'center',
        color:        '#9CA3AF',
        fontSize:     '14px',
      }}>
        Loading...
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────
  // Shows when the API call fails
  // e.g. network error, 401, 403, 500
  if (error) {
    return (
      <div style={{
        background:   '#FEF0F0',
        borderRadius: '12px',
        border:       '0.5px solid rgba(226,75,74,0.2)',
        padding:      '24px',
        color:        '#991B1B',
        fontSize:     '14px',
      }}>
        {error}
      </div>
    );
  }

  return (
    // Outer wrapper handles horizontal scrolling on small screens
    // Without this, wide tables would break the page layout
    <div style={{
      background:   '#fff',
      borderRadius: '12px',
      border:       '0.5px solid rgba(0,0,0,0.08)',
      overflow:     'hidden',   // clips the table inside the rounded corners
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width:           '100%',
          borderCollapse:  'collapse',  // removes double borders between cells
          fontSize:        '13px',
        }}>

          {/* ── Header row ──────────────────────────────── */}
          <thead>
            <tr style={{
              borderBottom: '0.5px solid rgba(0,0,0,0.08)',
              background:   '#F9FAFB',
            }}>
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{
                    padding:       '10px 16px',
                    textAlign:     'left',
                    fontWeight:    '500',
                    color:         '#6B7280',
                    fontSize:      '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace:    'nowrap',  // headers never wrap
                  }}
                >
                  {col.label}
                </th>
              ))}

              {/* Actions column header — only shown if onEdit or onDelete provided */}
              {(onEdit || onDelete) && (
                <th style={{
                  padding:       '10px 16px',
                  textAlign:     'right',
                  fontWeight:    '500',
                  color:         '#6B7280',
                  fontSize:      '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* ── Body rows ───────────────────────────────── */}
          <tbody>
            {/* Empty state — shown inside tbody so table structure is valid */}
            {rows.length === 0 ? (
              <tr>
                <td
                  // colSpan covers all columns + 1 for actions column
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  style={{
                    textAlign: 'center',
                    padding:   '48px',
                    color:     '#9CA3AF',
                    fontSize:  '14px',
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  // key: use index as fallback because your rows use different id fields
                  // (userId, doctorId, patientId etc.) not a generic "id"
                  key={index}
                  style={{ borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}

                  // Hover effect — inline because we can't use CSS :hover here
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#F9FAFB';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {/* ── Data cells ──────────────────────── */}
                  {columns.map(col => (
                    <td
                      key={col.key}
                      style={{
                        padding:   '11px 16px',
                        color:     '#111827',
                        // wrap: true allows long text to wrap instead of overflow
                        // used for columns like observations, recommendations, bio
                        whiteSpace: col.wrap ? 'normal' : 'nowrap',
                        // limit wrap columns width so they don't take over the table
                        maxWidth:   col.wrap ? '260px' : 'none',
                      }}
                    >
                      {col.render
                        // col.render(cellValue, fullRow)
                        // cellValue → row[col.key] e.g. row['status'] = 'Scheduled'
                        // fullRow   → the entire row object (used when you need multiple fields)
                        // example: render: (_, r) => `${r.firstName} ${r.lastName}`
                        ? col.render(row[col.key], row)
                        // No render function → just show the value
                        // ?? '—' means show dash if value is null or undefined
                        : (row[col.key] ?? '—')
                      }
                    </td>
                  ))}

                  {/* ── Action buttons ───────────────────── */}
                  {(onEdit || onDelete) && (
                    <td style={{
                      padding:    '11px 16px',
                      textAlign:  'right',
                      whiteSpace: 'nowrap',  // buttons always stay on one line
                    }}>
                      {/* Edit button — only renders if onEdit was passed */}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          style={{
                            background:   'none',
                            border:       '0.5px solid rgba(0,0,0,0.15)',
                            borderRadius: '6px',
                            padding:      '4px 10px',
                            fontSize:     '12px',
                            cursor:       'pointer',
                            color:        '#374151',
                            fontFamily:   "'DM Sans', sans-serif",
                            marginRight:  '6px',
                            transition:   'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          Edit
                        </button>
                      )}

                      {/* Delete button — only renders if onDelete was passed */}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          style={{
                            background:   'none',
                            border:       '0.5px solid rgba(226,75,74,0.3)',
                            borderRadius: '6px',
                            padding:      '4px 10px',
                            fontSize:     '12px',
                            cursor:       'pointer',
                            color:        '#E24B4A',
                            fontFamily:   "'DM Sans', sans-serif",
                            transition:   'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#FEF0F0'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}