import { useRef, useState } from 'react';

/**
 * Muestra la foto de la bodega con un pin en pos_x/pos_y (0-100, porcentaje).
 * Si editable=true, un clic sobre la imagen mueve el pin y llama a onChange({x,y}).
 */
export default function MapaUbicacion({ fotoUrl, x, y, editable = false, onChange, nombreBodega }) {
  const imgRef = useRef(null);
  const [hover, setHover] = useState(null);

  function manejarClic(e) {
    if (!editable || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    onChange?.({ x: Math.max(0, Math.min(100, px)).toFixed(2), y: Math.max(0, Math.min(100, py)).toFixed(2) });
  }

  if (!fotoUrl) {
    return (
      <div style={{
        aspectRatio: '16/10', borderRadius: 10, border: '1px dashed var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13
      }}>
        Esta bodega todavía no tiene foto general
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
      <img
        ref={imgRef}
        src={fotoUrl}
        alt={nombreBodega || 'Bodega'}
        onClick={manejarClic}
        onMouseMove={(e) => {
          if (!editable || !imgRef.current) return;
          const rect = imgRef.current.getBoundingClientRect();
          setHover({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
        }}
        onMouseLeave={() => setHover(null)}
        style={{ width: '100%', display: 'block', cursor: editable ? 'crosshair' : 'default', userSelect: 'none' }}
      />
      {x != null && y != null && (
        <Pin x={x} y={y} />
      )}
      {editable && hover && (x == null || y == null) && (
        <div style={{ position: 'absolute', left: `${hover.x}%`, top: `${hover.y}%`, transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: 'rgba(63,198,214,0.4)', pointerEvents: 'none' }} />
      )}
      {editable && (
        <div style={{
          position: 'absolute', bottom: 10, left: 10, background: 'rgba(16,20,26,0.85)',
          padding: '4px 10px', borderRadius: 6, fontSize: 12, color: 'var(--aqua)'
        }}>
          Haz clic en la foto para marcar la ubicación exacta
        </div>
      )}
    </div>
  );
}

function Pin({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-100%)', pointerEvents: 'none' }}>
      <svg width="34" height="44" viewBox="0 0 34 44" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}>
        <circle cx="17" cy="17" r="16" fill="rgba(231,169,76,0.28)">
          <animate attributeName="r" values="10;16;10" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.05;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <path d="M17 43C17 43 30 27.5 30 16.5C30 9.043 24.18 3 17 3C9.82 3 4 9.043 4 16.5C4 27.5 17 43 17 43Z" fill="#E7A94C" stroke="#0B2B29" strokeWidth="1.5" />
        <circle cx="17" cy="16" r="5.5" fill="#0B2B29" />
      </svg>
    </div>
  );
}
