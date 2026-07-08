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
    <div style={{
      overflow: 'hidden', position: 'relative', textAlign: 'left', borderRadius: 12,
      maxWidth: 290, width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.06)',
      background: 'var(--surface)', border: '1px solid var(--border)',
      animation: 'toastEntra 0.3s cubic-bezier(0.34,1.56,0.64,1)'
    }}>
      <button
        onClick={() => onCerrar(toast.id)}
        aria-label="Cerrar"
        style={{
          position: 'absolute', right: 10, top: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 26, height: 26, background: 'var(--surface)', color: 'var(--text-muted)',
          border: '1.5px solid var(--border)', fontSize: 14, borderRadius: 7, cursor: 'pointer', transition: '.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#ee0d0d'; e.currentTarget.style.borderColor = '#ee0d0d'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
      >
        ✕
      </button>

      <div style={{ padding: '20px 16px 16px' }}>
        <div style={{
          display: 'flex', margin: '0 auto', background: c.bg, flexShrink: 0,
          alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%',
          animation: 'toastPulso 0.6s linear alternate-reverse infinite'
        }}>
          {tipo === 'error'
            ? <IconoError width={26} height={26} style={{ color: c.icono }} />
            : <IconoExito width={26} height={26} style={{ color: c.icono }} />}
        </div>

        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <div style={{ color: c.titulo, fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>{titulo}</div>
          {mensaje && <div style={{ marginTop: 6, color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.4 }}>{mensaje}</div>}
        </div>
      </div>

      {acciones?.length > 0 && (
        <div style={{ margin: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {acciones.map((a, i) => (
            <button
              key={i}
              onClick={() => { a.onClick?.(); if (a.cerrar !== false) onCerrar(toast.id); }}
              style={{
                display: 'inline-flex', padding: '9px 14px', fontSize: 13.5, lineHeight: 1.4, fontWeight: 600,
                justifyContent: 'center', width: '100%', borderRadius: 8, cursor: 'pointer',
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
  if (toasts.length === 0) return null;
  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, left: 16, zIndex: 200,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, pointerEvents: 'none'
    }}>
      <style>{`
        @keyframes toastEntra { from { opacity: 0; transform: translateY(-12px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes toastPulso { from { transform: scale(1); } to { transform: scale(1.08); } }
      `}</style>
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'auto', width: '100%', maxWidth: 290 }}>
          <TarjetaToast toast={t} onCerrar={onCerrar} />
        </div>
      ))}
    </div>
  );
}
