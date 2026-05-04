import React from 'react'

const COLORS = {
    green:  { bg: '#EDFAF5', text: '#0F6E56' },
    red:    { bg: '#FEF0F0', text: '#991B1B' }, 
    blue:   { bg: '#EAF4F8', text: '#1A5F7A' },
    orange: { bg: '#FFF7ED', text: '#92400E' }, 
    gray:   { bg: '#F3F4F6', text: '#374151' },
    purple: { bg: '#F5F3FF', text: '#5B21B6' },
}

export default function Badge({label, color = 'gray'}){
    

    const style = COLORS[color] || COLORS.gray;

    return (
    <span
      style={{
        display: 'inline-block',        
        padding: '2px 8px',             
        borderRadius: '5px',            
        fontSize: '11px',              
        fontWeight: '500',             
        background: style.bg,           
        color: style.text,              
        whiteSpace: 'nowrap',    
      }}
    >
      {label}
    </span>
  );
}

export function appointmentStatusColor(status) {
  const map = {
    Scheduled: 'blue',
    Completed: 'green',
    Cancelled: 'red',
    NoShow:    'orange',
  };
  return map[status] || 'gray';
}

export function paymentStatusColor(status) {
  const map = {
    Completed: 'green',
    Pending:   'orange',
    Failed:    'red',
    Refunded:  'gray',
  };
  return map[status] || 'gray';
}