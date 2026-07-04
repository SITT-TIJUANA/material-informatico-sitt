import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ICONOS = {
  panel: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>,
  inventario: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 8l-9-5-9 5 9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>,
  alta: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></svg>,
  bodegas: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9.5 12 3l9 6.5V21H3V9.5Z" /><path d="M9 21v-7h6v7" /></svg>,
  usuarios: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16.5 4.7a3.5 3.5 0 0 1 0 6.7M19.5 20c0-3-1.7-5.2-4.3-5.9" /></svg>,
  alertas: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2a5 5 0 0 0-5 5v3.3c0 .6-.2 1.2-.6 1.7L4.8 14.6c-.9 1.1-.1 2.7 1.3 2.7h11.8c1.4 0 2.2-1.6 1.3-2.7l-1.6-2.6a2.6 2.6 0 0 1-.6-1.7V7a5 5 0 0 0-5-5Z" /><path d="M9 20a3 3 0 0 0 6 0" /></svg>,
  colapsar: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></svg>,
};

export default function Sidebar() {
  const { usuario, logout, esAdmin } = useAuth();
  const [colapsado, setColapsado] = useState(false);

  const enlace = (icono, label, to, end) => (
    <NavLink to={to} end={end} style={({ isActive }) => ({
      display: 'flex', alignItems: 'center', gap: 13,
      padding: colapsado ? '11px 0' : '11px 14px', justifyContent: colapsado ? 'center' : 'flex-start',
      borderRadius: 12, fontSize: 14, fontWeight: 600,
      color: isActive ? '#fff' : 'var(--text-muted)',
      background: isActive ? 'linear-gradient(135deg, var(--aqua), var(--aqua-dark))' : 'transparent',
      boxShadow: isActive ? '0 6px 16px rgba(15,184,166,0.35)' : 'none',
      transition: 'all .15s'
    })}>
      {({ isActive }) => (
        <>
          {ICONOS[icono]({ width: 19, height: 19, style: { flexShrink: 0, color: isActive ? '#fff' : 'var(--aqua-dark)' } })}
          {!colapsado && <span>{label}</span>}
        </>
      )}
    </NavLink>
  );

  return (
    <aside style={{
      width: colapsado ? 84 : 252, minHeight: '100vh', borderRight: '1px solid var(--border)',
      background: '#fff', display: 'flex', flexDirection: 'column', padding: 18, position: 'sticky', top: 0,
      transition: 'width .2s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, justifyContent: colapsado ? 'center' : 'space-between' }}>
        {!colapsado && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'linear-gradient(135deg, var(--aqua), var(--aqua-dark))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800,
              fontFamily: 'var(--font-display)', fontSize: 15, boxShadow: '0 6px 14px rgba(15,184,166,0.3)'
            }}>SI</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, lineHeight: 1.1, color: 'var(--ink)' }}>Inventario</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Informático SITT</div>
            </div>
          </div>
        )}
        <button
          onClick={() => setColapsado((v) => !v)}
          title={colapsado ? 'Expandir menú' : 'Ocultar menú'}
          style={{
            width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: '#fff',
            color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}
        >
          {ICONOS.colapsar({ width: 15, height: 15 })}
        </button>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
        {enlace('panel', 'Panel general', '/', true)}
        {enlace('inventario', 'Inventario', '/inventario')}
        {enlace('alta', 'Dar de alta', '/alta')}
        {esAdmin && (
          <>
            {!colapsado && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '20px 0 8px 14px', fontWeight: 700 }}>
                Administración
              </div>
            )}
            {colapsado && <div style={{ height: 1, background: 'var(--border)', margin: '14px 8px' }} />}
            {enlace('bodegas', 'Bodegas', '/admin/bodegas')}
            {enlace('usuarios', 'Usuarios', '/admin/usuarios')}
            {enlace('alertas', 'Alertas', '/admin/alertas')}
          </>
        )}
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 10, justifyContent: colapsado ? 'center' : 'flex-start' }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', background: 'var(--aqua-dim)', color: 'var(--aqua-dark)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0
        }}>
          {usuario?.nombre?.charAt(0)?.toUpperCase() || '?'}
        </div>
        {!colapsado && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{usuario?.nombre}</div>
            <button className="btn btn-ghost" style={{ padding: 0, fontSize: 12, height: 'auto' }} onClick={logout}>Cerrar sesión</button>
          </div>
        )}
      </div>
    </aside>
  );
}
