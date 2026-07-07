import { useEffect } from 'react';

export default function Modal({ abierto, onCerrar, children, ancho = 480 }) {
  useEffect(() => {
    function porTecla(e) { if (e.key === 'Escape') onCerrar(); }
    if (abierto) document.addEventListener('keydown', porTecla);
    return () => document.removeEventListener('keydown', porTecla);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div
      onClick={onCerrar}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(6,32,30,0.45)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20,
        animation: 'fadeIn .15s ease'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="scrollbar-thin"
        style={{
          background: 'var(--surface)', borderRadius: 20, maxWidth: ancho, width: '100%',
          maxHeight: '88vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)',
          animation: 'scaleIn .18s ease'
        }}
      >
        {children}
      </div>
    </div>
  );
}
