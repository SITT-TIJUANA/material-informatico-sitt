import { useState } from 'react';

export default function BotonAccion({ icono, label, color, onClick, disabled, type = 'button' }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--surface-2)' : 'var(--surface)',
        borderRadius: 10, padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: 8,
        fontSize: 13.5, fontWeight: 600, color: hover ? color : 'var(--text)', cursor: disabled ? 'not-allowed' : 'pointer',
        border: '1px solid var(--border)', transition: 'background-color .2s ease, color .2s ease',
        opacity: disabled ? 0.5 : 1
      }}
    >
      <span style={{ color, flexShrink: 0, display: 'flex' }}>{icono}</span>
      {label}
    </button>
  );
}
