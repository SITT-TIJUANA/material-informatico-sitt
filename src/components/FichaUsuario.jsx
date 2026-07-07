import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function FichaUsuario() {
  const { usuario } = useAuth();
  const [abierta, setAbierta] = useState(false);
  const [pos, setPos] = useState(null); // null = posición inicial por default (CSS)
  const arrastrando = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  function iniciarArrastre(clientX, clientY) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    offset.current = { x: clientX - rect.left, y: clientY - rect.top };
    arrastrando.current = true;
  }

  function moverA(clientX, clientY) {
    if (!arrastrando.current) return;
    const x = clientX - offset.current.x;
    const y = clientY - offset.current.y;
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 130;
    setPos({ x: Math.min(Math.max(x, 8), maxX), y: Math.min(Math.max(y, 8), maxY) });
  }

  useEffect(() => {
    function onMouseMove(e) { moverA(e.clientX, e.clientY); }
    function onMouseUp() { arrastrando.current = false; }
    function onTouchMove(e) { const t = e.touches[0]; if (t) moverA(t.clientX, t.clientY); }
    function onTouchEnd() { arrastrando.current = false; }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes fichaEntra { from { opacity: 0; transform: scale(0.85) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes girar360 { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        @keyframes botonPulso {
          0%, 100% { box-shadow: 0 0 0 0 rgba(15,184,166,0.5), 0 8px 18px rgba(15,184,166,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(15,184,166,0), 0 8px 22px rgba(15,184,166,0.5); }
        }
      `}</style>

      {/* Botón flotante: mostrar / ocultar la ficha */}
      <button
        onClick={() => setAbierta((v) => !v)}
        aria-label="Mostrar u ocultar mi ficha"
        style={{
          position: 'fixed', right: 18, bottom: 96, zIndex: 60,
          width: 48, height: 48, borderRadius: '50%', border: '3px solid #fff',
          background: 'linear-gradient(135deg, var(--aqua), var(--aqua-dark))', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          animation: abierta ? 'none' : 'botonPulso 2.2s ease-in-out infinite'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <circle cx="9" cy="11" r="2" />
          <path d="M13 10.5h5M13 13.5h3.5" />
        </svg>
      </button>

      {abierta && (
        <div
          ref={cardRef}
          style={{
            position: 'fixed',
            left: pos ? pos.x : undefined,
            top: pos ? pos.y : undefined,
            right: pos ? undefined : 18,
            bottom: pos ? undefined : 152,
            zIndex: 61, width: 200,
            background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)', padding: '22px 18px 18px',
            animation: 'fichaEntra 0.25s ease', cursor: 'grab', userSelect: 'none',
            textAlign: 'center'
          }}
          onMouseDown={(e) => iniciarArrastre(e.clientX, e.clientY)}
          onTouchStart={(e) => { const t = e.touches[0]; if (t) iniciarArrastre(t.clientX, t.clientY); }}
        >
          <button
            onClick={() => setAbierta(false)}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            aria-label="Cerrar"
            style={{
              position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%',
              border: 'none', background: 'var(--surface-2)', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 13
            }}
          >
            ✕
          </button>

          <div style={{
            width: 60, height: 60, borderRadius: '50%', margin: '0 auto 14px', overflow: 'hidden',
            background: 'var(--aqua-dim)', color: 'var(--aqua-dark)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: 22,
            boxShadow: '0 0 0 4px var(--aqua-dim)'
          }}>
            {usuario?.foto_perfil_url
              ? <img src={usuario.foto_perfil_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (usuario?.nombre?.charAt(0)?.toUpperCase() || '?')}
          </div>

          <div style={{ perspective: 500 }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, color: 'var(--ink)',
              animation: 'girar360 3.5s linear infinite', display: 'inline-block'
            }}>
              {usuario?.nombre}
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: 4 }}>
            {usuario?.rol}
          </div>
        </div>
      )}
    </>
  );
}
