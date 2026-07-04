import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const linkStyle = ({ isActive }) => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
  color: isActive ? '#3FC6D6' : '#8B96A6',
  background: isActive ? 'rgba(63,198,214,0.1)' : 'transparent'
});

export default function Sidebar() {
  const { usuario, logout, esAdmin } = useAuth();

  return (
    <aside style={{
      width: 240, minHeight: '100vh', borderRight: '1px solid var(--border)',
      background: 'var(--surface)', display: 'flex', flexDirection: 'column', padding: 20, position: 'sticky', top: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8, background: 'var(--cyan-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)', fontWeight: 700
        }}>SI</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, lineHeight: 1.1 }}>Inventario</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Informático SITT</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <NavLink to="/" end style={linkStyle}>Panel general</NavLink>
        <NavLink to="/inventario" style={linkStyle}>Inventario</NavLink>
        <NavLink to="/alta" style={linkStyle}>Dar de alta</NavLink>
        {esAdmin && (
          <>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '18px 0 6px 14px' }}>
              Administración
            </div>
            <NavLink to="/admin/bodegas" style={linkStyle}>Bodegas</NavLink>
            <NavLink to="/admin/usuarios" style={linkStyle}>Usuarios</NavLink>
            <NavLink to="/admin/alertas" style={linkStyle}>Alertas</NavLink>
          </>
        )}
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{usuario?.nombre}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'capitalize' }}>{usuario?.rol}</div>
        <button className="btn btn-ghost" style={{ padding: '6px 0', fontSize: 13 }} onClick={logout}>Cerrar sesión</button>
      </div>
    </aside>
  );
}
