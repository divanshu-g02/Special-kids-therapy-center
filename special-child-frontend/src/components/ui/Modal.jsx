// src/components/ui/Modal.jsx
import { useEffect } from 'react';

// Modal displays content in a popup overlay.
// Used for: Create form, Edit form, Delete confirmation, Invoice view
//
// Props:
// title    → heading text e.g. "Add New User"
// onClose  → function called when X or backdrop is clicked
// children → the form or content inside the modal
// width    → optional custom width, defaults to '480px'
export default function Modal({ title, onClose, children, width = '480px' }) {

  // Lock body scroll when modal is open
  // Without this, the background page scrolls while modal is open
  // which looks broken and confusing
  useEffect(() => {
    // save original overflow value
    const original = document.body.style.overflow;

    // prevent background scrolling
    document.body.style.overflow = 'hidden';

    // cleanup: restore scroll when modal closes
    // this runs when the component unmounts (modal closes)
    return () => {
      document.body.style.overflow = original;
    };
  }, []); // empty array = run once when modal opens, cleanup when it closes

  // Close modal when user presses Escape key
  // Much better UX than forcing them to click the X button
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }

    // attach listener when modal opens
    document.addEventListener('keydown', handleKeyDown);

    // cleanup: remove listener when modal closes
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    // ── Backdrop ──────────────────────────────────────────
    // Full screen dark overlay behind the modal
    // position fixed means it covers the entire viewport
    // regardless of scroll position
    <div
      onClick={onClose}  // clicking the backdrop closes the modal
      style={{
        position:       'fixed',
        inset:          0,             // shorthand for top/right/bottom/left all = 0
        background:     'rgba(0, 0, 0, 0.45)',
        display:        'flex',
        alignItems:     'center',      // center vertically
        justifyContent: 'center',      // center horizontally
        zIndex:         1000,          // above everything else
        padding:        '24px',        // so modal doesn't touch screen edges on mobile
      }}
    >
      {/* ── Modal box ──────────────────────────────────── */}
      {/* stopPropagation prevents clicks INSIDE the modal */}
      {/* from bubbling up to the backdrop and closing it  */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:   '#fff',
          borderRadius: '16px',
          padding:      '32px',
          width:        '100%',
          maxWidth:     width,

          // maxHeight + overflow so modal scrolls if content is too tall
          // e.g. a long form on a small screen
          maxHeight:    '90vh',
          overflowY:    'auto',

          // shadow to separate modal from backdrop
          boxShadow:    '0 20px 60px rgba(0, 0, 0, 0.18)',

          // slide up animation when modal opens
          animation:    'modalSlideIn 0.2s ease',
        }}
      >
        {/* ── Header ───────────────────────────────────── */}
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            marginBottom:   '24px',
          }}
        >
          {/* Title */}
          <h2
            style={{
              fontSize:   '18px',
              fontFamily: "'DM Serif Display', serif",
              fontWeight: '400',
              color:      '#111827',
              margin:     0,
            }}
          >
            {title}
          </h2>

          {/* Close button — X in top right */}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              color:      '#9CA3AF',
              padding:    '4px',
              display:    'flex',
              alignItems: 'center',
              borderRadius: '4px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#374151'}
            onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M4 4l10 10M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* ── Content ──────────────────────────────────── */}
        {/* Whatever you put between <Modal> tags renders here */}
        {children}
      </div>

      {/* ── Animation keyframes ──────────────────────── */}
      {/* Injected as a style tag so no CSS file needed  */}
      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity:   0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity:   1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}