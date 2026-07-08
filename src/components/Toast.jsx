let estilosInyectados = false;
function inyectarEstilos() {
  if (estilosInyectados) return;
  estilosInyectados = true;
  const style = document.createElement('style');
  style.textContent = `
    .toast-fondo-movil { display: none; }
    .toast-contenedor {
      position: fixed; top: calc(16px + env(safe-area-inset-top, 0px)); right: 16px; left: 16px; z-index: 210;
      display: flex; flex-direction: column; align-items: flex-end; gap: 10px; pointer-events: none;
    }
    .toast-tarjeta-wrap { pointer-events: auto; width: 100%; max-width: 290px; }

    @media (max-width: 860px) {
      .toast-fondo-movil {
        display: block; position: fixed; inset: 0; background: rgba(6,32,30,0.55);
        z-index: 209; animation: toastFondoEntra 0.25s ease;
      }
      .toast-contenedor {
        top: 0; left: 0; right: 0; bottom: 0; align-items: center; justify-content: center; gap: 14px;
      }
      .toast-tarjeta-wrap { max-width: 380px; padding: 0 22px; }
      .toast-tarjeta { transform: scale(1.05); }
    }

    @keyframes toastEntra { from { opacity: 0; transform: translateY(-12px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes toastFondoEntra { from { opacity: 0; } to { opacity: 1; } }
    @keyframes toastPulso { from { transform: scale(1); } to { transform: scale(1.08); } }
  `;
  document.head.appendChild(style);
}

const PALETA = {
  exito: { bg: '#e2feee', icono: '#0afa2a', titulo: '#066e29', boton: '#1aa06d' },
  error: { bg: '#fde2e2', icono: '#fa2a2a', titulo: '#8c1010', boton: '#d63c3c' },
};

function IconoExito(p) {
  return <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>;
}
function IconoError(p) {
  return <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>;
}

function TarjetaToast({ toast, onCerrar }) {
  const { tipo, titulo, mensaje, acciones } = toast;
  const c = PALETA[tipo] || PALETA.exito;

  return (
    <div className="toast-tarjeta" style={{
      overflow: 'hidden', position: 'relative', textAlign: 'left', borderRadius: 16,
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.18), 0 10px 10px -5px rgba(0,0,0,0.08)',
      background: 'var(--surface)', border: '1px solid var(--border)',
      animation: 'toastEntra 0.3s cubic-bezier(0.34,1.56,0.64,1)'
    }}>
      <button
        onClick={() => onCerrar(toast.id)}
        aria-label="Cerrar"
        style={{
          position: 'absolute', right: 10, top: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, background: 'var(--surface)', color: 'var(--text-muted)',
          border: '1.5px solid var(--border)', fontSize: 15, borderRadius: 8, cursor: 'pointer', transition: '.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#ee0d0d'; e.currentTarget.style.borderColor = '#ee0d0d'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
      >
        ✕
      </button>

      <div style={{ padding: '22px 18px 18px' }}>
        <div style={{
          display: 'flex', margin: '0 auto', background: c.bg, flexShrink: 0,
          alignItems: 'center', justifyContent: 'center', width: 50, height: 50, borderRadius: '50%',
          animation: 'toastPulso 0.6s linear alternate-reverse infinite'
        }}>
          {tipo === 'error'
            ? <IconoError width={27} height={27} style={{ color: c.icono }} />
            : <IconoExito width={27} height={27} style={{ color: c.icono }} />}
        </div>

        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <div style={{ color: c.titulo, fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>{titulo}</div>
          {mensaje && <div style={{ marginTop: 6, color: 'var(--text-muted)', fontSize: 13.5, lineHeight: 1.4 }}>{mensaje}</div>}
        </div>
      </div>

      {acciones?.length > 0 && (
        <div style={{ margin: '0 18px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {acciones.map((a, i) => (
            <button
              key={i}
              onClick={() => { a.onClick?.(); if (a.cerrar !== false) onCerrar(toast.id); }}
              style={{
                display: 'inline-flex', padding: '10px 14px', fontSize: 14, lineHeight: 1.4, fontWeight: 600,
                justifyContent: 'center', width: '100%', borderRadius: 9, cursor: 'pointer',
                background: i === 0 ? c.boton : 'var(--surface)',
                color: i === 0 ? '#fff' : 'var(--text)',
                border: i === 0 ? 'none' : '1px solid var(--border)'
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ToastContainer({ toasts, onCerrar }) {
  inyectarEstilos();
  if (toasts.length === 0) return null;
  return (
    <>
      <div className="toast-fondo-movil" />
      <div className="toast-contenedor">
        {toasts.map((t) => (
          <div key={t.id} className="toast-tarjeta-wrap">
            <TarjetaToast toast={t} onCerrar={onCerrar} />
          </div>
        ))}
      </div>
    </>
  );
}
