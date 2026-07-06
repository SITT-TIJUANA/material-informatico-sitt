// Componentes de lista agrupada estilo "Ajustes de iPhone":
// secciones con etiqueta gris arriba, tarjeta blanca redondeada, filas con ícono + texto + flecha.

export function Grupo({ titulo, children }) {
  return (
    <div style={{ marginBottom: 26 }}>
      {titulo && (
        <div style={{
          fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 4px 8px'
        }}>{titulo}</div>
      )}
      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
        overflow: 'hidden', boxShadow: 'var(--shadow)'
      }}>
        {children}
      </div>
    </div>
  );
}

export function Fila({ icono, label, valor, onClick, color, ultima, destructivo }) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 13,
        padding: '13px 16px', background: 'none', border: 'none',
        borderBottom: ultima ? 'none' : '1px solid var(--border)',
        textAlign: 'left', cursor: onClick ? 'pointer' : 'default'
      }}
    >
      {icono && (
        <div style={{
          width: 30, height: 30, borderRadius: 9, flexShrink: 0,
          background: color || 'var(--aqua-dim)', color: destructivo ? 'var(--red)' : 'var(--aqua-dark)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {icono}
        </div>
      )}
      <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: destructivo ? 'var(--red)' : 'var(--text)' }}>{label}</span>
      {valor && <span style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>{valor}</span>}
      {onClick && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
          <path d="M9 6l6 6-6 6" />
        </svg>
      )}
    </button>
  );
}
