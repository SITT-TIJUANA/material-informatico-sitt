import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const I = {
  panel: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>,
  inventario: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 8l-9-5-9 5 9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>,
  bodegas: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9.5 12 3l9 6.5V21H3V9.5Z" /><path d="M9 21v-7h6v7" /></svg>,
  ajustes: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></svg>,
  plus: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>,
};

const tabStyle = ({ isActive }) => ({
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
  color: isActive ? 'var(--aqua-dark)' : 'var(--text-muted)', fontSize: 10.5, fontWeight: 700,
  flex: 1, padding: '6px 0'
});

export default function BottomNav() {
  const navigate = useNavigate();
  const { esAdmin, puedeEditar } = useAuth();

  return (
    <nav className="bottom-nav-mobile" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--surface)',
      borderTop: '1px solid var(--border)', alignItems: 'center',
      padding: '6px 6px calc(env(safe-area-inset-bottom, 0px) + 6px)', zIndex: 40,
      boxShadow: '0 -6px 20px rgba(10,60,55,0.06)'
    }}>
      <NavLink to="/" end style={tabStyle}>
        {I.panel({ width: 21, height: 21 })}
        Panel
      </NavLink>
      <NavLink to="/inventario" style={tabStyle}>
        {I.inventario({ width: 21, height: 21 })}
        Inventario
      </NavLink>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', marginTop: -22 }}>
        <button
          onClick={() => navigate('/alta')}
          aria-label="Dar de alta"
          style={{
            width: 54, height: 54, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--aqua), var(--aqua-dark))',
            color: '#fff', border: '4px solid #fff', boxShadow: '0 8px 20px rgba(15,184,166,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          {I.plus({ width: 24, height: 24 })}
        </button>
      </div>

      {puedeEditar && (
        <NavLink to="/admin/bodegas" style={tabStyle}>
          {I.bodegas({ width: 21, height: 21 })}
          Bodega
        </NavLink>
      )}
      <NavLink to="/ajustes" style={tabStyle}>
        {I.ajustes({ width: 21, height: 21 })}
        Ajustes
      </NavLink>
    </nav>
  );
}
